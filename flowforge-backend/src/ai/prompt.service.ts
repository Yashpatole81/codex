import type { IR } from "../ir/schema.js";

export function buildCompilerPrompt(ir: IR): string {
  return [
    "You are FlowForge AI compiler.",
    "Do not invent business logic.",
    "Generate NestJS TypeScript code strictly from this IR:",
    JSON.stringify(ir, null, 2)
  ].join("\n\n");
}
