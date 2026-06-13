# Changelog

## 2026-06-13

- Added project photo upload with square display. Photos are stored locally at `uploads/projects/<id>/photo.<ext>` and served through `/api/projects/:id/photo`.
- Added custom material entries to the Materials panel. A `+` button opens an inline form with a label and value field. Each entry has an `×` remove button. Material entries persist to the `custom_sections` SQLite table.
- Removed the placeholder "Custom sections" panel from the project detail page.
- Wired `custom_sections` API routes (list, create, update, delete) that were previously defined in schema but never registered.
- Added `updatePhotoPath` method to the project repository for internal file path updates without going through the user-facing update schema.

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
