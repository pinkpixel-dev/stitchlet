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
- `POST /api/projects/:id/photo` — upload project photo
- `GET /api/projects/:id/photo` — serve project photo
- `DELETE /api/projects/:id/photo` — remove project photo
- `GET /api/projects/:id/counters`
- `POST /api/projects/:id/counters`
- `PATCH /api/counters/:id`
- `DELETE /api/counters/:id`
- `GET /api/projects/:id/sections`
- `POST /api/projects/:id/sections`
- `PATCH /api/sections/:id`
- `DELETE /api/sections/:id`
- `GET /api/projects/:id/pdf` — serve PDF inline (for iframe viewer)
- `GET /api/projects/:id/pdf/download` — serve PDF as attachment
- `POST /api/projects/:id/pdf` — upload PDF
- `DELETE /api/projects/:id/pdf` — remove PDF
- `GET /api/system/backup` — export database and files as a ZIP archive
- `POST /api/system/restore` — restore library from ZIP archive and restart server

Project, counter, photo, section, and system backup routes are all backed by SQLite through Drizzle or file management services. The dashboard, create project page, and project detail page use these routes for live data. Project detail supports add/increment/decrement/reset/complete/delete for counters, add/remove for custom material sections, and upload/replace/remove for the project photo.

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
- `uploads/projects/<id>/`: project photos (served via API, not exposed directly)
- `backups/`: future backup exports

Photos are saved to the local filesystem and served through `/api/projects/:id/photo`. Files are not exposed via static file serving — all access goes through the API server.

## Next Technical Steps

1. Show project photo thumbnails on dashboard cards. ✅
2. Add migration generation workflow around the current SQLite initializer.
3. Add Docker deployment files.
4. Add PWA manifest and offline shell.
