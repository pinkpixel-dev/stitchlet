# Stitchlet Self-Hosted App Plan

A self-hosted crochet companion app for people who want to run their own private crochet project server, store their own PDFs/photos locally, and access the app from desktop or mobile without cloud storage.

### UI Notes

**Themes:** Dark/light mode toggle. Default dark mode. 
**Dark mode:** Background: Dark Gray #121212, Accent Colors: Pink #FC9EB1 Purple, #D09CDE
**Light mode:** Background: Cream #FEF4E8, Accent Colors: Pink #F27593, Purple #9058A4

### Images
public/logo.png - use within the application and on the README.md
public/icon.png - use to create icons for binaries
public/favicon.png - app favicon.

## 1. App summary

Stitchlet is a simple self-hosted crochet project companion.

The goal is to help users organize crochet projects with:

- Project pages
- Multiple row/round counters per project
- PDF pattern uploads
- In-app PDF viewing
- PDF downloads
- Project photo uploads
- Yarn/material details
- Hook size
- Finished size
- Custom sections
- Notes
- Dashboard with grid/list view
- Mobile-friendly PWA experience
- Local storage on the user's own computer, NAS, or home server

This version does not use Supabase, Cloudflare R2, or any cloud storage provider.

Everything lives on the user's own hardware.

## 2. Product positioning

Stitchlet Self-Hosted is for people who want a private crochet project tracker they can run themselves.

Good positioning:

> A self-hosted crochet companion for organizing projects, PDFs, counters, photos, and notes on your own server.

Target users:

- Crocheters with many PDF patterns
- Makers who prefer local/private storage
- Self-hosting hobbyists
- People with a NAS or home server
- Tech-comfortable crochet designers
- People who want a personal crochet archive without subscription storage

This can be the "self-hosted crochet app" you have wanted: practical, private, cozy, and fully under the user's control.

## 3. Recommended stack

### Frontend

- Vite
- React
- TypeScript
- Tailwind CSS
- React Router
- PDF.js or React PDF viewer wrapper
- vite-plugin-pwa for PWA support

### Backend

- Node.js
- Hono API server
- Zod for validation
- Drizzle ORM

### Database

- SQLite

### File storage

- Local filesystem
- Mounted folder for uploads

### Deployment

- Docker Compose
- NAS, desktop computer, mini PC, or home server

### Optional private remote access

- Tailscale

### Optional HTTPS/reverse proxy

- Caddy
- Nginx Proxy Manager

## 4. High-level architecture

```txt
Browser / PWA
   ↓
React frontend
   ↓ fetch()
Hono API server
   ↓
SQLite database
   ↓
Local uploads folder
```

Everything runs from one self-hosted server.

The frontend never directly touches the database or filesystem. It uses API routes.

## 5. Storage model

### SQLite stores

- Projects
- Counters
- Custom sections
- Notes
- Project metadata
- File paths
- User/session info if auth is enabled

### Local filesystem stores

- PDF patterns
- Project photos
- Future progress photos
- Backup exports

Example local folder structure:

```txt
stitchlet/
  data/
    stitchlet.db

  uploads/
    projects/
      project_abc123/
        pattern.pdf
        main-photo.jpg

      project_def456/
        pattern.pdf
        main-photo.jpg

  backups/
    2026-06-12/
      stitchlet.db
      uploads.tar.gz
```

If multiple users are supported later:

```txt
uploads/
  users/
    user_123/
      projects/
        project_abc123/
          pattern.pdf
          main-photo.jpg
```

For the first personal/self-hosted version, single-user mode is enough.

## 6. Why SQLite is a good fit

SQLite is a strong choice for this app because:

- It is simple.
- It is fast enough for a personal or household app.
- It is one file.
- It is easy to back up.
- It does not require running a separate database server.
- It works nicely with Docker volumes.
- It keeps the self-hosted setup lightweight.

Use Postgres only if multi-user scaling becomes important later.

## 7. Development vs production setup

### Development setup

Run on your computer.

```txt
Vite dev server
Hono API server
SQLite database in ./data
Uploads folder in ./uploads
```

Access locally:

```txt
http://localhost:6497
```

Access from phone on same Wi-Fi:

```txt
http://192.168.1.x:6497
```

### Production/self-hosted setup

Run on NAS, mini PC, or always-on desktop.

```txt
Docker Compose
SQLite mounted as persistent data
Uploads mounted as persistent files
```

Access at home:

```txt
http://nas-ip:6497
```

Example:

```txt
http://192.168.1.50:6497
```

Optional nicer local hostname:

```txt
http://stitchlet.local:6497
```

## 8. Computer vs NAS

### Running from a computer

Pros:

- Easiest for development
- No NAS setup needed
- Great for testing
- Fast iteration

Cons:

- App only works when the computer is on
- Sleep mode can interrupt access
- Less ideal for always-on use

Best use:

- Development
- Early testing
- Personal-only experiments

### Running from a NAS or home server

Pros:

- Always-on access
- Better place for lots of PDFs
- Easier backups
- Desktop and mobile can access it around the house
- Cleaner long-term self-hosting story

Cons:

- More setup
- May need Docker support
- HTTPS/PWA polish takes more work
- Remote access needs Tailscale, VPN, tunnel, or reverse proxy

Best use:

- Real self-hosted deployment

Recommendation:

```txt
Build on computer first.
Deploy to NAS when usable.
```

## 9. PWA notes

Stitchlet should be mobile-friendly and installable as a PWA.

Important detail:

For full installable PWA behavior, browsers generally expect HTTPS, except for local development using localhost or 127.0.0.1.

For LAN usage over plain HTTP, the app can still work in the browser, but install/offline behavior may be limited depending on browser/device.

Practical path:

1. Build the app as a normal responsive web app first.
2. Add PWA manifest and icons.
3. Use it on LAN in browser.
4. Add HTTPS later through Tailscale Serve, Caddy, or another reverse proxy if needed.

Source checked June 12, 2026:

- MDN PWA installability docs: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable

## 10. Access options

### Option A: Home Wi-Fi only

Simplest option.

```txt
Phone/Desktop
   ↓
Home Wi-Fi
   ↓
NAS or computer running Stitchlet
```

Access:

```txt
http://192.168.1.50:6497
```

Good for:

- Simple local use
- No outside-home access
- First deployment

### Option B: Tailscale private access

Recommended if you want to use Stitchlet away from home without exposing your NAS publicly.

```txt
Phone/Desktop
   ↓
Tailscale private network
   ↓
NAS running Stitchlet
```

Tailscale Serve can route traffic from devices in your private tailnet to a local service.

Good for:

- Private remote access
- No router port forwarding
- Less scary security setup
- Personal/family self-hosted apps

Source checked June 12, 2026:

- Tailscale Serve docs: https://tailscale.com/docs/features/tailscale-serve

### Option C: Caddy reverse proxy

Good if you want a real domain and HTTPS.

Example:

```txt
https://stitchlet.yourdomain.com
```

Caddy can reverse proxy to a backend app and is often used for HTTPS setups.

Good for:

- Polished deployment
- Real domain
- Better PWA support
- HTTPS

More advanced because it may require:

- Domain name
- DNS
- Router port forwarding or tunnel
- Reverse proxy configuration
- Security hardening

Sources checked June 12, 2026:

- Caddy reverse proxy docs: https://caddyserver.com/docs/quick-starts/reverse-proxy
- Caddy HTTPS info: https://caddyserver.com/

## 11. Core screens

### Dashboard

Route:

```txt
/
```

Features:

- View all projects
- Grid view
- List view
- Search
- Filter by status
- Sort by updated date
- Create project button

Grid card should show:

- Project photo thumbnail
- Project title
- Status
- Hook size
- Last updated
- Optional active counter summary

List view should show:

- Project title
- Status
- Hook size
- Yarn
- Last updated

### Create project

Route:

```txt
/projects/new
```

Fields:

- Title
- Status
- Main photo
- Pattern PDF
- Yarn type
- Yarn weight
- Colors used
- Hook size
- Finished size
- Notes

### Project detail

Route:

```txt
/projects/:id
```

Sections:

- Header
- Main project photo
- Materials/details
- PDF controls
- Counters
- Custom sections
- Notes

Actions:

- Edit project
- Upload/replace photo
- Upload/replace PDF
- View PDF
- Download PDF
- Add counter
- Add custom section
- Delete project

### PDF viewer

Route:

```txt
/projects/:id/pdf
```

Features:

- View PDF inside app
- Download PDF
- Return to project
- Optional later: remember last page

### Settings

Route:

```txt
/settings
```

Possible settings:

- Theme
- Dashboard view preference
- Backup/export
- Storage location display
- App version
- Optional auth settings

## 12. Project page layout

Example:

```txt
Strawberry Bunny                          [Edit]

[Project Photo]

Status: Active
Hook: 4.0mm
Yarn: Premier Parfait Chunky
Colors: pink, cream, green
Finished size: 10 inches

Pattern
[View PDF] [Download PDF] [Replace PDF]

Counters
Body          Round 18 / 32      [-] [+]
Head          Round 10 / 24      [-] [+]
Left Arm      Round 7 / 12       [-] [+]
Right Arm     Round 7 / 12       [-] [+]

Custom Sections
Safety Eyes
12mm black safety eyes, placed between rounds 14 and 15.

Notes
Make ears slightly shorter next time.
```

## 13. Data model

### Project

```ts
type Project = {
  id: string;
  title: string;
  status: "active" | "paused" | "finished" | "frogged";

  yarnType?: string;
  yarnWeight?: string;
  colorsUsed?: string;
  hookSize?: string;
  finishedSize?: string;

  notes?: string;

  photoPath?: string;
  pdfPath?: string;
  pdfFilename?: string;

  createdAt: string;
  updatedAt: string;
};
```

### Counter

```ts
type Counter = {
  id: string;
  projectId: string;

  name: string;
  type: "row" | "round";

  currentValue: number;
  targetValue?: number;

  notes?: string;
  isCompleted: boolean;
  sortOrder: number;

  createdAt: string;
  updatedAt: string;
};
```

### CustomSection

```ts
type CustomSection = {
  id: string;
  projectId: string;

  title: string;
  content: string;
  sortOrder: number;

  createdAt: string;
  updatedAt: string;
};
```

### User, optional for single-user mode

```ts
type User = {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: string;
};
```

## 14. Database schema outline

### projects

Columns:

- id text primary key
- title text not null
- status text default 'active'
- yarn_type text
- yarn_weight text
- colors_used text
- hook_size text
- finished_size text
- notes text
- photo_path text
- pdf_path text
- pdf_filename text
- created_at text not null
- updated_at text not null

### counters

Columns:

- id text primary key
- project_id text references projects(id) on delete cascade
- name text not null
- type text default 'row'
- current_value integer default 0
- target_value integer
- notes text
- is_completed integer default 0
- sort_order integer default 0
- created_at text not null
- updated_at text not null

### custom_sections

Columns:

- id text primary key
- project_id text references projects(id) on delete cascade
- title text not null
- content text
- sort_order integer default 0
- created_at text not null
- updated_at text not null

### app_settings

Optional table:

- key text primary key
- value text

Use this for:

- theme preference
- default dashboard view
- backup settings
- app configuration

## 15. API routes

### Auth

For single-user mode:

```txt
POST   /api/login
POST   /api/logout
GET    /api/session
```

For LAN-only early development, auth can be optional. For NAS or remote access, use auth.

### Projects

```txt
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PATCH  /api/projects/:id
DELETE /api/projects/:id
```

### Photos

```txt
POST   /api/projects/:id/photo
GET    /api/projects/:id/photo
DELETE /api/projects/:id/photo
```

### PDFs

```txt
POST   /api/projects/:id/pdf
GET    /api/projects/:id/pdf
GET    /api/projects/:id/pdf/download
DELETE /api/projects/:id/pdf
```

### Counters

```txt
POST   /api/projects/:id/counters
PATCH  /api/counters/:id
DELETE /api/counters/:id
```

### Custom sections

```txt
POST   /api/projects/:id/sections
PATCH  /api/sections/:id
DELETE /api/sections/:id
```

### Backups

Optional later:

```txt
POST   /api/backups/export
POST   /api/backups/import
GET    /api/backups/download/:filename
```

## 16. File upload behavior

### Upload PDF

```txt
1. User selects a PDF.
2. Browser sends file to POST /api/projects/:id/pdf.
3. Server validates file type.
4. Server saves it to uploads/projects/:id/pattern.pdf.
5. Server updates pdfPath and pdfFilename in SQLite.
```

### View PDF

```txt
1. User clicks View PDF.
2. Frontend opens /projects/:id/pdf route.
3. PDF viewer loads /api/projects/:id/pdf.
4. Server checks session.
5. Server streams the PDF file.
```

### Download PDF

```txt
1. User clicks Download PDF.
2. Browser requests /api/projects/:id/pdf/download.
3. Server checks session.
4. Server sends the PDF as an attachment.
```

### Upload photo

```txt
1. User selects an image.
2. Browser sends file to POST /api/projects/:id/photo.
3. Server validates image type.
4. Server optionally creates optimized thumbnail later.
5. Server saves the image to uploads/projects/:id/main-photo.jpg.
6. Server updates photoPath in SQLite.
```

## 17. Counter behavior

Each project can have many counters.

Examples:

- Body
- Head
- Left arm
- Right arm
- Left leg
- Right leg
- Sleeve 1
- Sleeve 2
- Border
- Hat brim
- Blanket border

Counter controls:

- Increment
- Decrement
- Set current value
- Set target value
- Reset
- Mark complete
- Duplicate counter
- Delete counter
- Reorder counters

Important UX choice:

Make counter buttons large on mobile. Users may be tapping while actively crocheting.

Mobile counter example:

```txt
Left Arm
Round 17 / 24

[-]        [+]
```

## 18. Custom sections

Start simple.

Each custom section has:

- Title
- Content
- Sort order

Examples:

- Safety Eyes
- Assembly Notes
- Color Changes
- Pattern Adjustments
- Stuffing Notes
- Gift Info
- Sizing Changes
- Yarn Substitutions

Avoid complicated custom field builders in the first version. A title and text box is enough.

## 19. Docker setup

Use Docker Compose for the self-hosted deployment.

Docker volumes or bind mounts should preserve:

- SQLite database
- Uploaded PDFs/photos
- Backups

Docker Compose supports volumes as persistent data stores that can be mounted into services and reused across container runs.

Source checked June 12, 2026:

- Docker Compose volumes docs: https://docs.docker.com/reference/compose-file/volumes/

### Example docker-compose.yml

```yaml
services:
  stitchlet:
    build: .
    container_name: stitchlet
    ports:
      - "6497:6497"
    volumes:
      - ./data:/app/data
      - ./uploads:/app/uploads
      - ./backups:/app/backups
    environment:
      - DATABASE_URL=file:/app/data/stitchlet.db
      - UPLOAD_DIR=/app/uploads
      - BACKUP_DIR=/app/backups
      - APP_SECRET=change-this-to-a-long-random-string
      - NODE_ENV=production
    restart: unless-stopped
```

Important folders:

```txt
data/
uploads/
backups/
```

These folders must persist outside the container.

## 20. Environment variables

```txt
DATABASE_URL=file:/app/data/stitchlet.db
UPLOAD_DIR=/app/uploads
BACKUP_DIR=/app/backups
APP_SECRET=change-this
NODE_ENV=production
MAX_UPLOAD_MB=100
```

Optional:

```txt
ENABLE_AUTH=true
ALLOW_REGISTRATION=false
APP_BASE_URL=http://localhost:6497
```

## 21. Backups

Backups are crucial because the app stores valuable PDFs and project info locally.

Back up:

```txt
data/stitchlet.db
uploads/
```

Simple backup script:

```bash
#!/usr/bin/env bash

DATE=$(date +%Y-%m-%d)
mkdir -p ./backups/$DATE

cp ./data/stitchlet.db ./backups/$DATE/stitchlet.db
tar -czf ./backups/$DATE/uploads.tar.gz ./uploads
```

Future in-app export:

```txt
Export Backup
```

Creates:

```txt
stitchlet-backup-2026-06-12.zip
```

Containing:

```txt
data.json
uploads/
```

Recommended backup rules:

- Keep local NAS backups.
- Keep at least one external backup.
- Consider periodic copies to an external drive.
- Do not rely only on the live NAS copy.

## 22. Security recommendations

For LAN-only use:

- Use a password if other people/devices are on the network.
- Do not expose the uploads folder directly.
- Serve files only through authenticated API routes.

For remote access:

- Prefer Tailscale over opening router ports.
- Use HTTPS if accessing outside localhost/LAN.
- Use strong passwords.
- Set secure cookies when using HTTPS.
- Do not expose admin/debug routes.
- Do not store app secrets in the frontend.
- Rate-limit login attempts eventually.

Avoid this:

```txt
Publicly exposing the uploads folder
```

Prefer this:

```txt
Authenticated API file routes
```

## 23. MVP phases

### Phase 1: Local app skeleton

Build:

- Vite React app
- Hono server
- SQLite setup
- Drizzle schema
- Basic layout
- Dashboard
- Project create/edit/delete

Goal:

Get the core local app running on your computer.

### Phase 2: Counters

Build:

- Add counter
- Rename counter
- Increment/decrement
- Set target
- Reset
- Mark complete
- Duplicate counter
- Delete counter

Goal:

Make the app useful during actual crochet work.

### Phase 3: Photos

Build:

- Upload project photo
- Replace photo
- Show photo thumbnail on dashboard
- Show photo on project page

Goal:

Make project browsing visual and pleasant.

### Phase 4: PDFs

Build:

- Upload PDF
- Replace PDF
- View PDF
- Download PDF
- Delete PDF

Goal:

Make each project a complete pattern workspace.

### Phase 5: Custom sections and notes

Build:

- Notes section
- Add custom section
- Edit custom section
- Delete custom section
- Reorder custom sections

Goal:

Support amigurumi-specific details, garment notes, safety eyes, substitutions, and other project-specific info.

### Phase 6: Docker deployment

Build:

- Dockerfile
- docker-compose.yml
- Persistent data volume
- Persistent uploads volume
- Production build
- NAS deployment notes

Goal:

Make it easy to run on NAS/home server.

### Phase 7: PWA polish

Build:

- Web app manifest
- App icons
- Mobile layout
- Offline shell
- Remember grid/list preference
- Optional HTTPS setup

Goal:

Make it feel like a usable mobile companion app.

### Phase 8: Backups/export

Build:

- Backup script
- In-app export
- Optional import
- Backup documentation

Goal:

Protect project data and PDFs.

## 24. Things to avoid in MVP

Do not build these in the first version:

- Marketplace
- Social/community features
- Public user profiles
- Pattern rewriting
- AI pattern parsing
- PDF OCR
- PDF annotations
- Complex custom field builder
- Cloud sync
- Multi-user collaboration
- Subscription billing
- Public sharing
- Pattern copyright management tools
- Mobile native app wrapper

Keep it simple and self-hosted.

## 25. Later feature ideas

Good post-MVP features:

- Remember last opened PDF page
- Progress photo gallery
- Project tags
- Project search by yarn/color/hook
- Project timer
- Duplicate project
- Archive finished projects
- Favorite projects
- Counter history/undo
- Pattern source link
- Import/export backup
- Optional multi-user mode
- Optional mobile push reminders
- Optional LAN discovery
- Optional one-click installer script
- Optional Docker image published to GitHub Container Registry

Best first post-MVP feature:

```txt
Remember last opened PDF page
```

That makes the PDF viewer feel much more useful.

## 26. Suggested folder structure

Simple version:

```txt
stitchlet/
  src/
    client/
      components/
      pages/
      lib/
      styles/

    server/
      routes/
      db/
      services/
      middleware/
      utils/

    shared/
      types.ts
      schemas.ts

  data/
  uploads/
  backups/

  Dockerfile
  docker-compose.yml
  package.json
```

More structured version:

```txt
stitchlet/
  apps/
    web/
      src/
        components/
        pages/
        hooks/
        lib/

    server/
      src/
        routes/
        db/
        services/
        middleware/

  packages/
    shared/
      src/
        types.ts
        schemas.ts

  data/
  uploads/
  backups/

  docker-compose.yml
```

For the first version, simple is better.

## 27. Recommended build order

1. Create Vite React TypeScript app.
2. Add Tailwind.
3. Add Hono server.
4. Add SQLite and Drizzle.
5. Create project schema.
6. Build project CRUD.
7. Build dashboard grid/list.
8. Build project detail page.
9. Add counters.
10. Add photo uploads.
11. Add PDF uploads.
12. Add PDF viewer.
13. Add custom sections.
14. Add simple auth.
15. Add Dockerfile.
16. Add docker-compose.yml.
17. Deploy to NAS.
18. Add backup script.
19. Add PWA manifest/icons.
20. Add HTTPS/Tailscale/Caddy later if needed.

## 28. Self-hosted release idea

This could eventually be released as:

```txt
Stitchlet Self-Hosted
```

Installation options:

### Beginner-ish Docker install

```bash
git clone https://github.com/yourname/stitchlet
cd stitchlet
docker compose up -d
```

Then open:

```txt
http://localhost:6497
```

### NAS users

Provide docs for:

- Synology
- TrueNAS
- Unraid
- Generic Docker Compose
- Linux server

### Backups

Document exactly which folders matter:

```txt
data/
uploads/
backups/
```

## 29. Final recommendation

Build Stitchlet Self-Hosted as:

```txt
React PWA
Hono API
SQLite database
Local filesystem uploads
Docker Compose deployment
Tailscale optional access
Caddy optional HTTPS
```

This keeps the app:

- Private
- Portable
- Cheap to run
- Friendly to NAS users
- Simple to back up
- Useful without cloud storage
- Good for people with lots of crochet PDFs

The first version should focus on:

- Projects
- Counters
- PDF upload/view/download
- Project photo
- Materials/details
- Notes
- Custom sections
- Dashboard grid/list

That is enough to make Stitchlet genuinely useful.