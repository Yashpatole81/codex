# FlowForge

FlowForge is an AI-powered backend builder where:

- **Flowchart = Human Logic**
- **IR = Machine Contract**
- **AI = Code Compiler**

This repository contains an initial monorepo scaffold with:

- `flowforge-backend`: IR schema, validation engine, and early manual generator stubs.
- `flowforge-frontend`: folder skeleton for the future Next.js visual builder.

## Current implementation status

### ✅ Phase 1 (started): Backend Core

Implemented in `flowforge-backend`:

- Strict IR schema via Zod (`src/ir/schema.ts`).
- Deterministic IR validation (`src/validation/validator.ts`) for:
  - circular flow detection
  - reachable node checks
  - table reference validation
  - terminal path checks
- Minimal compiler prompt builder and manual NestJS skeleton generator stubs.
- Basic tests for IR validation.

### 🧱 Scaffolded next phases

Created folder structure for:

- Frontend flow editor and schema designer
- Backend AI/compiler/auth/modules organization

## Run backend checks

```bash
cd flowforge-backend
npm install
npm run typecheck
npm test
```

## Design defaults

UI should use **dark mode by default** with the palette:

- Background: `#0f172a`
- Surface: `#1e293b`
- Accent: `#6366f1`
- Text: `#e2e8f0`
