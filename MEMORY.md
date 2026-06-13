# Stitchlet Memory

## 2026-06-12

### Decision: Use the simple single-package scaffold

What was decided:

- Use the plan's simple structure with `src/client`, `src/server`, and `src/shared`.
- Scaffold a Vite React frontend, Hono API server, Drizzle schema, and SQLite storage shape in one package.

Why:

- The project is at Phase 1 and does not need monorepo complexity yet.
- The plan explicitly says the simple version is better for the first version.

What was rejected and why:

- A monorepo with `apps/` and `packages/` was rejected for now because it adds structure before the app needs it.
- Fully wiring uploads, PDFs, auth, and Docker was rejected for this task because the chosen scope was the Phase 1 MVP scaffold.

### Decision: Keep Phase 1 UI honest

What was decided:

- Use realistic sample data and scaffolded controls, but label future-only behavior clearly in the UI or docs.
- Keep dashboard, create project, project detail, and settings as the first routes.

Why:

- The app should feel usable enough to guide the build without pretending persistence, uploads, or PDF viewing are complete.

What was rejected and why:

- Fake cloud or sync features were rejected because Stitchlet is explicitly self-hosted and local-first.
- Decorative craft-heavy styling was rejected because the target UI is minimal, sleek, and professional.
