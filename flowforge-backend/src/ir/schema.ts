import { z } from "zod";

export const tableFieldSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["string", "number", "boolean", "date", "json", "uuid"]),
  required: z.boolean().default(false),
  unique: z.boolean().default(false),
  primaryKey: z.boolean().default(false),
  references: z
    .object({
      table: z.string().min(1),
      field: z.string().min(1)
    })
    .optional()
});

export const tableSchema = z.object({
  name: z.string().min(1),
  fields: z.array(tableFieldSchema).min(1)
});

export const edgeSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  label: z.string().optional()
});

export const nodeSchema = z.object({
  id: z.string().min(1),
  type: z.enum([
    "start",
    "apiEndpoint",
    "authCheck",
    "decision",
    "databaseOperation",
    "response",
    "error",
    "end"
  ]),
  config: z.record(z.unknown()).default({})
});

export const irSchema = z.object({
  metadata: z.object({
    projectName: z.string().min(1),
    backend: z.literal("nestjs"),
    language: z.literal("typescript")
  }),
  database: z.object({
    tables: z.array(tableSchema)
  }),
  api: z.object({
    method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
    path: z.string().startsWith("/")
  }),
  auth: z.object({
    required: z.boolean()
  }),
  flow: z.object({
    nodes: z.array(nodeSchema).min(1),
    edges: z.array(edgeSchema)
  }),
  responses: z.record(z.object({
    statusCode: z.number().int().min(100).max(599),
    description: z.string().min(1)
  }))
});

export type IR = z.infer<typeof irSchema>;
