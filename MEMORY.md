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

### Bug logged: Nested HTML forms silently fail

What happened:

- The add-material UI was implemented as a `<form>` nested inside the edit project `<form>`.
- HTML forbids nested forms. The browser ignores the inner form and submits the outer one on any submit event inside it.
- The result was that clicking Add caused the edit form to save and close, with no error shown anywhere.

What worked instead:

- Replace the inner form with a plain `<div>`.
- Drive the inputs via controlled React state (`value` + `onChange`).
- Handle the Add button with a direct `type="button"` click handler.

Note for next time:

- Any time there is a form inside another form in this app, this will silently break. Always use controlled state + click handlers for nested actions inside an existing form element.

### Decision: Export and import backup archives via system zip/unzip commands and better-sqlite3 backup API

What was decided:
- Implement a backend zip export and restore module that utilizes system `zip`/`unzip` commands.
- Use `sqlite.backup()` to obtain a safe, un-locked copy of the active database before compression.
- For backup restore: write ZIP to disk, close SQLite connection, delete old files, run `unzip`, and exit the process (`process.exit(0)`) to let the process runner (docker, pm2, dev server) reboot the server.
- Move dark/light mode toggle to a dedicated "Appearance" section in Settings to keep the app-shell clean.

Why:
- Avoids extra NPM packaging weight or native compilation errors.
- SQLite backup API avoids corruption risk from zipping an open, actively written database file.
- Re-triggering a reboot is the cleanest way to clear sqlite descriptors and load the new database file safely.

### Decision: Filter and sort dashboard projects client-side

What was decided:
- Implement reactive search (matching project name, notes, hook, yarn) and status filtering (All, Active, Paused, Finished, Frogged) client-side.
- Sort projects dynamically by updated date descending, alphabetically by title, or status.
- Add descriptive empty states when search filters return no results.

Why:
- Standard for small-scale self-hosted instances. Client-side state offers instant filtering and sorting for an exceptionally snappy user experience.

### Decision: Implement custom PWA service worker dynamic caching with Network-First assets strategy

What was decided:
- Create a standard service worker (`sw.js`) utilizing a Network-First cache strategy for web requests, falling back to cache when offline.
- Explicitly exclude `/api/` endpoints and non-GET requests from service worker caching to prevent caching stale database query responses.
- Load the service worker dynamically in production environment context (`import.meta.env.PROD`) inside `main.tsx` to prevent caching during active dev/HMR.

Why:
- A Network-First strategy ensures users see updates immediately when connected (such as new project details or photos), while providing reliable app shell functionality offline.

### Decision: Multi-stage node docker container with system zip/unzip dependencies

What was decided:
- Create a standard `Dockerfile` that packages Node.js v22 and installs system `zip`/`unzip` tools via apk to support settings backup/restore.
- Expose production port `6497` and launch using `npm start`.
- Configure `docker-compose.yml` to define persistent host-bind mounts for `./data` (SQLite database), `./uploads` (patterns and photos), and `./backups` (exported archives).

Why:
- Restoring settings backup archives requires system `zip` and `unzip` tools to be installed within the Docker runtime context. Mount volumes keep user-uploaded assets and project records persistent across container updates.

### Session end: 2026-06-13

Worked on:
- Production Docker containerization (`Dockerfile` and `docker-compose.yml`).
- PWA manifest configuration (`site.webmanifest`) and responsive icons generation using ImageMagick.
- Service worker implementation (`sw.js`) and dynamic production registration.
- Decoupled server database dependencies to resolve Hono router type compiler check errors.
- Documented self-hosted Docker deployment commands and volume guides in `README.md`.
- Rewrote `README.md` as a clean, user-facing document for GitHub and added `README_DOCKER.md` for Docker Hub.
- Added visual screenshots showing the dashboard and project details panels inside `README.md`.

Completed:
- PWA installability and offline assets capabilities.
- Production containerized Docker compose setup.
- App type verification checking and testing suite pass.
- User-facing documentation for GitHub and Docker Hub, including visual screenshots.

Decisions made:
- Exclude live database `/api/` query endpoints from service worker caching.
- Build Docker container using Node-alpine with apk system zip tools installed.

Next session priorities:
- Setup automated database migration generation around the SQLite initializer.
- Add remote access guidelines (Caddy reverse proxy and Tailscale configurations).
