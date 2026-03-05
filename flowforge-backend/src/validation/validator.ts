import { IR, irSchema } from "../ir/schema.js";

export interface ValidationError {
  code:
    | "INVALID_SCHEMA"
    | "CIRCULAR_FLOW"
    | "MISSING_TERMINAL_RESPONSE"
    | "MISSING_TABLE"
    | "UNREACHABLE_NODE"
    | "INVALID_START_NODE";
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  ir?: IR;
}

export function validateIR(input: unknown): ValidationResult {
  const parsed = irSchema.safeParse(input);
  if (!parsed.success) {
    return {
      valid: false,
      errors: parsed.error.issues.map((issue) => ({
        code: "INVALID_SCHEMA",
        message: `${issue.path.join(".")}: ${issue.message}`
      }))
    };
  }

  const ir = parsed.data;
  const errors: ValidationError[] = [];

  const nodeIds = new Set(ir.flow.nodes.map((node) => node.id));
  const startNodes = ir.flow.nodes.filter((node) => node.type === "start");

  if (startNodes.length !== 1) {
    errors.push({
      code: "INVALID_START_NODE",
      message: "Flow must contain exactly one start node"
    });
  }

  const tableNames = new Set(ir.database.tables.map((t) => t.name));
  for (const node of ir.flow.nodes) {
    if (node.type !== "databaseOperation") continue;
    const table = typeof node.config.table === "string" ? node.config.table : undefined;
    if (!table || !tableNames.has(table)) {
      errors.push({
        code: "MISSING_TABLE",
        message: `Database operation node ${node.id} references unknown table`
      });
    }
  }

  const adjacency = new Map<string, string[]>();
  for (const id of nodeIds) adjacency.set(id, []);
  for (const edge of ir.flow.edges) {
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) continue;
    adjacency.get(edge.from)?.push(edge.to);
  }

  const startId = startNodes[0]?.id;
  if (startId) {
    const reachable = new Set<string>();
    const stack = [startId];
    while (stack.length > 0) {
      const current = stack.pop()!;
      if (reachable.has(current)) continue;
      reachable.add(current);
      for (const next of adjacency.get(current) ?? []) {
        stack.push(next);
      }
    }

    for (const node of ir.flow.nodes) {
      if (!reachable.has(node.id)) {
        errors.push({
          code: "UNREACHABLE_NODE",
          message: `Node ${node.id} is not reachable from the start node`
        });
      }
    }

    const visiting = new Set<string>();
    const visited = new Set<string>();
    let hasCycle = false;

    const dfs = (node: string) => {
      if (visiting.has(node)) {
        hasCycle = true;
        return;
      }
      if (visited.has(node)) return;
      visiting.add(node);
      for (const next of adjacency.get(node) ?? []) dfs(next);
      visiting.delete(node);
      visited.add(node);
    };

    dfs(startId);
    if (hasCycle) {
      errors.push({
        code: "CIRCULAR_FLOW",
        message: "Flow graph contains a cycle"
      });
    }

    for (const node of ir.flow.nodes) {
      const outgoing = adjacency.get(node.id) ?? [];
      if (outgoing.length === 0 && node.type !== "response" && node.type !== "end" && node.type !== "error") {
        errors.push({
          code: "MISSING_TERMINAL_RESPONSE",
          message: `Node ${node.id} terminates without response/end/error`
        });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    ir
  };
}
