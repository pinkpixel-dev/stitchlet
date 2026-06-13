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

## 2026-06-13

### Decision: Make project CRUD SQLite-backed before counters/uploads

What was decided:

- Replace sample project reads with real Hono API routes backed by SQLite through Drizzle.
- Wire dashboard, create project, and project detail flows to the API for project create, list, read, update, and delete behavior.
- Keep counters, custom sections, photos, PDFs, auth, Docker, and PWA work out of this slice.

Why:

- Real project persistence gives Stitchlet a useful foundation before adding more feature layers.
- The app can now store core project metadata locally without pretending uploads or counters are complete.

What was rejected and why:

- A full migration framework was rejected for this slice because a small SQLite initializer is simpler while the schema is still early.
- Seeding sample projects into the real database was rejected because the self-hosted app should start clean and private by default.

### Decision: Make counters real before file uploads

What was decided:

- Add SQLite-backed counter create, list, update, and delete routes.
- Wire project detail counters to the API for adding, incrementing, decrementing, resetting, completing, and deleting counters.
- Keep counter duplicate/reorder, custom sections, photos, PDFs, auth, Docker, and PWA work out of this slice.

Why:

- Counters are the first feature that makes Stitchlet useful during active crochet work.
- Building counters before file uploads keeps the app practical while avoiding file-storage complexity too early.

What was rejected and why:

- Duplicate/reorder controls were rejected for this slice because add/update/delete covers the core counter workflow with less UI complexity.
- A richer counter editor was rejected because simple mobile-friendly controls matter more for the first usable pass.

### Decision: Use custom_sections table for custom material entries in the Materials panel

What was decided:

- Reuse the existing `custom_sections` SQLite table (title + content) for custom material entries.
- Surface them inline inside the Materials panel rather than as a separate "Custom sections" section.
- Add a small inline `+` form with a label + value field. Each entry shows an `×` remove button.
- Remove the separate "Custom sections" card from the project detail page.

Why:

- The existing data model already maps perfectly to the requested UX (label = title, value = content).
- One fewer UI section is simpler and keeps the materials panel cohesive.

What was rejected and why:

- A separate materials table was rejected because `custom_sections` already has exactly the right shape.
- Inline editing (click to edit an existing entry) was deferred — add and remove covers the first useful pass.

### Decision: Store photos on local filesystem, serve via API route

What was decided:

- Upload photos to `uploads/projects/<id>/photo.<ext>` on the local filesystem.
- Serve photos through `GET /api/projects/:id/photo` (streams the file).
- Display photos with `aspect-square` + `object-fit: cover` for square display via CSS.
- No image processing library (no Sharp). Raw file saved as uploaded.

Why:

- Consistent with the plan document's storage model.
- Portable: works from local dev, NAS, or Docker with a mounted uploads volume.
- API-served photos work correctly when accessed from another device on the network.
- No extra dependencies needed for MVP.

What was rejected and why:

- Sharp/image processing was deferred — square crop is CSS for now, server-side resize is a future slice.
- Serving photos as static files directly was rejected because API routing handles auth, NAS portability, and future signed URL support better.
