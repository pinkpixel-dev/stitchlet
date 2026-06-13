# Stitchlet Overview

Stitchlet is a self-hosted crochet project companion. The app is intended to run on a user's own computer, NAS, or home server so crochet project data, PDFs, and photos stay local.

## Current Architecture

```txt
Browser / PWA-ready frontend
  -> React app
  -> Hono API
  -> SQLite through Drizzle
  -> Local uploads folder
```

The current scaffold is a single-package TypeScript app:

- `src/client`: React frontend, routes, components, styling, and theme behavior.
- `src/server`: Hono server, API route skeleton, and Drizzle database schema.
- `src/shared`: Zod schemas, TypeScript types, and sample data used by the scaffold.

## Frontend

The frontend uses Vite, React, React Router, Tailwind CSS v4, and CSS variables for theming.

Routes:

- `/`: project dashboard
- `/projects/new`: create project scaffold
- `/projects/:projectId`: project detail scaffold
- `/settings`: app settings scaffold

The UI defaults to dark mode and includes a light mode toggle. Theme values follow the plan:

- Dark background: `#121212`
- Dark accents: `#FC9EB1`, `#D09CDE`
- Light background: `#FEF4E8`
- Light accents: `#F27593`, `#9058A4`

The desktop app shell uses a wide max-width layout so dashboard content can make better use of large monitors. Sidebar navigation stays near the app logo, while the local archive status and theme control sit lower in the sidebar. On wider screens, the dashboard grid supports four project cards per row.

## Backend

The backend uses Hono on Node.js. Development runs the API on port `6498`; production can run the combined server on port `6497`.

Current API routes:

- `GET /api/health`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`

These routes are scaffold routes. Project persistence still needs to be wired to SQLite.

## Database

Drizzle schema files define:

- `projects`
- `counters`
- `custom_sections`
- `app_settings`

Default database path:

```txt
./data/stitchlet.db
```

## Storage

Persistent local folders:

- `data/`: SQLite database
- `uploads/`: future PDFs and photos
- `backups/`: future backup exports

The app should not expose `uploads/` directly. Files should eventually be served through authenticated API routes.

## Next Technical Steps

1. Wire project CRUD to SQLite.
2. Add migrations and database initialization.
3. Add real create/edit/delete UI behavior.
4. Add counter mutations.
5. Add photo uploads.
6. Add PDF upload, viewing, and download routes.
7. Add Docker deployment files.
8. Add PWA manifest and offline shell.
