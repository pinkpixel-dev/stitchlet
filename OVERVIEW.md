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
- `PATCH /api/projects/:id`
- `DELETE /api/projects/:id`
- `GET /api/projects/:id/counters`
- `POST /api/projects/:id/counters`
- `PATCH /api/counters/:id`
- `DELETE /api/counters/:id`

Project and counter routes are backed by SQLite through Drizzle. The dashboard, create project page, and project detail page use these routes for project create, list, read, update, and delete behavior. Project detail also uses the counter API for add, increment, decrement, reset, complete, and delete controls.

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

1. Add photo uploads.
2. Add PDF upload, viewing, and download routes.
3. Add custom section mutations.
4. Add migration generation workflow around the current SQLite initializer.
5. Add Docker deployment files.
6. Add PWA manifest and offline shell.
