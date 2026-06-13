# Stitchlet Roadmap

## Phase 1: Local App Skeleton

- Vite React app
- Hono API server
- SQLite and Drizzle schema
- Basic layout
- Dashboard
- Create project page
- Project detail page
- Settings page

Status: scaffolded.

## Phase 2: Real Project CRUD

- Persist projects in SQLite
- Create projects from the UI
- Edit project metadata
- Delete projects
- Replace sample data with API-backed state

Status: implemented for project records.

## Phase 3: Counters

- Add counters
- Increment and decrement counters
- Set targets
- Reset counters
- Mark counters complete
- Delete counters

Status: implemented for basic counter records. Duplicate and reorder can come later if needed.

## Phase 4: Photos

- Upload project photo
- Replace project photo
- Remove project photo
- Show photo on detail page
- Show thumbnails on dashboard cards (grid + list view)

Status: implemented.

## Phase 5: PDFs

- Upload pattern PDF
- Replace PDF
- View PDF in app (iframe modal)
- Download PDF
- Delete PDF

Status: implemented.

## Phase 6: Custom Materials

- Add custom material entries to the Materials panel
- Remove custom material entries
- Edit existing entries (deferred)
- Reorder entries (deferred)

Status: add and remove implemented. Entries persist to the `custom_sections` table.

## Phase 7: Self-Hosted Deployment

- Dockerfile (implemented)
- `docker-compose.yml` (implemented)
- Persistent data/uploads/backups folders (configured)
- NAS-friendly setup docs (written in README.md)

Status: fully implemented.

## Phase 8: PWA Polish and Backups

- Web app manifest (site.webmanifest implemented)
- Offline shell (Service Worker dynamic cache implemented)
- Installable icon support (generated sizes via ImageMagick)
- Backup script (implemented via zip/unzip system routes)
- In-app export and restore (implemented on settings page)

Status: fully implemented.
