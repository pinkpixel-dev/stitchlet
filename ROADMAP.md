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
- Show thumbnails on dashboard
- Show project photo on detail page

## Phase 5: PDFs

- Upload pattern PDF
- Replace PDF
- View PDF in app
- Download PDF
- Delete PDF

## Phase 6: Custom Sections and Notes

- Add custom sections
- Edit custom sections
- Delete custom sections
- Reorder custom sections

## Phase 7: Self-Hosted Deployment

- Dockerfile
- `docker-compose.yml`
- Persistent data/uploads/backups folders
- NAS-friendly setup docs

## Phase 8: PWA Polish and Backups

- Web app manifest
- Offline shell
- Installable icon support
- Backup script
- In-app export
