# FlowForge

FlowForge is an AI-powered backend architecture platform where developers design backend logic visually, convert it into a deterministic IR, validate it, and then compile production-ready code.

- **Flowchart = Human Logic**
- **IR = Machine Contract**
- **AI = Code Compiler**

> Core rule: AI should not invent backend logic. AI compiles only from validated IR.

---

## Monorepo Structure

- `flowforge-frontend` — Next.js App Router UI scaffold (dark mode by default).
- `flowforge-backend` — IR schema, deterministic validator, compiler/prompt starter modules.

---

## Current Status

### Backend (Phase 1 foundation in progress)

Implemented:

- Strict IR schema using Zod.
- Deterministic IR validation with checks for:
  - circular flows
  - node reachability
  - missing table references
  - terminal path handling
- Manual generator starter and AI prompt builder starter.
- Initial validator unit tests.

### Frontend (starter)

Implemented:

- Runnable Next.js App Router starter.
- Basic landing page and app layout.
- Dark theme defaults aligned with FlowForge palette.

---

## Run Frontend

```bash
cd flowforge-frontend
npm install
npm run dev
```

Open: `http://localhost:3000`

---

## Run Backend Checks

```bash
cd flowforge-backend
npm install
npm run typecheck
npm test
```

---

## Design Defaults (Dark Mode)

- Background: `#0f172a`
- Surface: `#1e293b`
- Accent: `#6366f1`
- Text: `#e2e8f0`

---

## Planned Build Order

1. Backend Core (IR schema + validation)
2. Manual Code Generator
3. Flowchart Builder
4. Database Schema Designer
5. AI Integration
6. Project Export
7. Authentication and Billing
