<p align="center">
  <img src="./public/logo.png" alt="Stitchlet logo" width="128" />
</p>

# Stitchlet

Stitchlet is a self-hosted crochet companion for organizing projects, PDFs, counters, photos, materials, and notes on your own server.

The core project CRUD, counters, project photos, and custom material entries are all working and backed by SQLite. PDF viewing is the next piece.

## Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- React Router
- Hono
- Drizzle ORM
- SQLite

## Getting Started

Install dependencies:

```bash
npm install
```

Run the frontend and API in development:

```bash
npm run dev
```

Open:

```txt
http://localhost:6497
```

The Vite dev server runs on port `6497` and proxies `/api` requests to the Hono server on port `6498`.

## Project Structure

```txt
src/
  client/
    components/
    lib/
    pages/
    styles.css

  server/
    db/
    routes/
    index.ts

  shared/
    sample-data.ts
    schemas.ts
```

## Current Status

Implemented:

- Minimal dark/light app shell with dotted grid background
- Dashboard route with live project data, reactive search, status filtering, and sorting
- Create project route
- Project detail route
- Settings route with database and media backup export/restore controls
- Shared project/counter/custom section schemas
- Drizzle SQLite schema
- Hono API
- SQLite-backed project create, list, read, update, and delete
- SQLite-backed counter create, list, update, and delete (with increment, decrement, reset, complete)
- Project photo upload, replace, remove — stored locally, served via API
- Project photo thumbnails on dashboard cards (grid and list view)
- Dashboard list/grid view toggle
- Custom material entries (add/remove) — stored in `custom_sections` table
- PDF upload, inline viewer (iframe modal), and download — stored locally, served via API
- PWA installability and dynamic offline-first asset caching (via Service Worker)
- Production Docker containerization and Docker Compose configurations

## Docker Deployment

Stitchlet is designed to run self-hosted on your NAS, mini-PC, or home server.

Deploy via Docker Compose:

```bash
docker compose up -d --build
```

Access the application on:

```txt
http://localhost:6497
```

### Mounted Volumes

Docker Compose creates three bind mounts on the host to persist your data:

- `./data/` -> Contains the SQLite database file (`stitchlet.db`).
- `./uploads/` -> Contains project-specific pattern PDFs and photos.
- `./backups/` -> Destination folder for settings backups.

## PWA & Installability

Stitchlet includes a web app manifest and a dynamic service worker. To install as a PWA, run Stitchlet over `localhost` or deploy behind an HTTPS reverse proxy (such as Caddy or Tailscale Serve).

## Theme

Dark mode is the default.

Dark theme:

- Background: `#121212`
- Pink: `#FC9EB1`
- Purple: `#D09CDE`

Light theme:

- Background: `#FEF4E8`
- Pink: `#F27593`
- Purple: `#9058A4`

## License

Apache-2.0
