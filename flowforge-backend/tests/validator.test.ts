import { describe, expect, it } from "vitest";
import { validateIR } from "../src/validation/validator.js";

const validIr = {
  metadata: { projectName: "OrderService", backend: "nestjs", language: "typescript" },
  database: {
    tables: [
      { name: "orders", fields: [{ name: "id", type: "uuid", primaryKey: true, required: true, unique: true }] }
    ]
  },
  api: { method: "POST", path: "/orders" },
  auth: { required: true },
  flow: {
    nodes: [
      { id: "start-1", type: "start", config: {} },
      { id: "db-1", type: "databaseOperation", config: { table: "orders", operation: "create" } },
      { id: "res-1", type: "response", config: { responseRef: "success" } }
    ],
    edges: [
      { from: "start-1", to: "db-1" },
      { from: "db-1", to: "res-1" }
    ]
  },
  responses: {
    success: { statusCode: 201, description: "Created" }
  }
};

describe("validateIR", () => {
  it("accepts a valid IR", () => {
    const result = validateIR(validIr);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects circular flow", () => {
    const circular = {
      ...validIr,
      flow: {
        ...validIr.flow,
        edges: [
          ...validIr.flow.edges,
          { from: "res-1", to: "db-1" }
        ]
      }
    };

    const result = validateIR(circular);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === "CIRCULAR_FLOW")).toBe(true);
  });
});
