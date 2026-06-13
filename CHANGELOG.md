# Changelog

## 2026-06-13

- Added app previews and screenshots to `README.md`.
- Refactored `README.md` as user-facing GitHub documentation and created `README_DOCKER.md` for Docker Hub listings.
- Added multi-stage production Dockerfile and Docker Compose configurations supporting persistent bind mounts for app data, uploaded files, and backups.
- Integrated progressive web application (PWA) configuration: created web app manifest (`site.webmanifest`), generated full multi-resolution icon assets using ImageMagick, and registered an offline-capable Service Worker (`sw.js`) utilizing a Network-First caching strategy.
- Fixed backend route factory type signatures to decouple unrelated SQLite configuration imports, resolving compiler errors.
- Added backup export and import/restore capability to Settings. Users can download a ZIP file of the database and media folder, or restore an archive to overwrite local data and trigger a server reboot.
- Implemented `/api/system/backup` and `/api/system/restore` backend routes utilizing SQLite backup APIs and native zip/unzip commands.
- Wired the dashboard search, status filters, and sorting dropdowns to dynamically filter and sort projects client-side with visual empty states.
- Added Vitest integration tests for the new system backup routes.
- Added PDF upload, inline viewing, and download to the project detail Pattern section.
- PDF files are stored at `uploads/projects/<id>/pattern.pdf` and served via `/api/projects/:id/pdf`.
- Added a full-screen PDF viewer modal using a native browser `<iframe>` — no dependencies needed.
- Added a download endpoint (`/api/projects/:id/pdf/download`) that sends `Content-Disposition: attachment`.
- Added PDF remove button that deletes the file and clears the database record.
- Fixed dashboard photo thumbnails — project cards now show the actual project photo via `/api/projects/:id/photo`.
- Wired the grid/list view toggle on the dashboard. List view shows a compact row per project with thumbnail, status, hook, and yarn info.
- Removed the unused `counters` prop from `ProjectCard` (was using stale sample data; counter info belongs on the detail page).

- Added project photo upload with square display. Photos are stored locally at `uploads/projects/<id>/photo.<ext>` and served through `/api/projects/:id/photo`.
- Added custom material entries to the Materials panel. A `+` button in the edit project form reveals an inline label + value input. Each entry shows an `×` remove button. Material entries persist to the `custom_sections` SQLite table.
- Moved custom material add/remove controls into the edit project form so the view-only Materials panel stays read-only, consistent with how other material fields behave.
- Removed the placeholder "Custom sections" panel from the project detail page.
- Fixed a nested form bug where the add-material form was inside the edit project form. The browser silently ignored the inner form and the submit event hit the outer one, closing edit mode without saving the new material. Fixed by replacing the inner form with controlled state and a click handler.
- Wired `custom_sections` API routes (list, create, update, delete) that were previously defined in schema but never registered.
- Added `updatePhotoPath` method to the project repository for internal file path updates without going through the user-facing update schema.
- Replaced deprecated `FormEvent` (removed in React 19 / TypeScript 6) with `SyntheticEvent<HTMLFormElement>` across all form submit handlers.

- Expanded the main app shell width so Stitchlet uses more available desktop space.
- Moved desktop sidebar navigation closer to the logo while keeping local archive details anchored near the bottom.
- Adjusted the dashboard grid to show smaller project cards across wider screens.
- Added SQLite-backed project CRUD with API routes for create, list, read, update, and delete.
- Wired the dashboard, create project page, and project detail page to the project API instead of static sample project data.
- Added Vitest coverage for the project CRUD API.
- Added SQLite-backed counter CRUD with API routes for create, list, update, and delete.
- Wired project detail counters to the API with add, increment, decrement, reset, complete, and delete controls.
- Added Vitest coverage for the counter CRUD API.

## 2026-06-12

- Scaffolded the Phase 1 Stitchlet application with Vite, React, TypeScript, Tailwind CSS, React Router, Hono, Drizzle, and SQLite.
- Added a minimal, sleek dark/light UI using the theme colors from `stitchlet-self-hosted-plan.md`.
- Added dashboard, create project, project detail, and settings routes with realistic starter project data.
- Added shared Zod schemas, a Drizzle SQLite schema, and a Hono API skeleton for future project CRUD.
- Added project documentation, environment example, persistent folder placeholders, and an Apache 2.0 license.
