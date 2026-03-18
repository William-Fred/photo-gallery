# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal photo gallery platform for displaying analog film photography. Visitors browse images organized into projects/rolls. An admin interface handles uploads. Images are watermarked on upload and served from Cloudflare R2.

Full stack: ASP.NET Core 10 Web API + React/Vite SPA + PostgreSQL + Cloudflare R2, orchestrated with Docker Compose.

- API: `src/api/`
- Frontend: `src/web/`
- Docs & plans: `claude/docs/`
- CI/CD: `.github/workflows/deploy.yml`

---

## Development Commands

### Start everything (recommended)
```bash
docker compose up
# API: http://localhost:8080
# Web: http://localhost:3000
# DB: localhost:5432
```

### API only
```bash
cd src/api
dotnet run
# or
dotnet watch
```

### Frontend only
```bash
cd src/web
npm install
npm run dev       # Vite dev server on :5173
npm run build     # tsc + vite build
npm run lint      # ESLint
```

### Build API for CI
```bash
dotnet build src/api/api.csproj --configuration Release
```

---

## Architecture

### API Layer (`src/api/`)

**Controllers** → **Repositories** (Dapper) → PostgreSQL
**Controllers** → **StorageService** → Cloudflare R2
**Controllers** → **WatermarkService** (ImageSharp) on upload

- `Controllers/PhotosController.cs` — CRUD for photos, `/api/photos`
- `Controllers/ProjectsController.cs` — CRUD for projects, `/api/projects`
- `Services/WatermarkService.cs` — applies "© w_analoga" watermark on upload
- `Infrastructure/Repositories/` — Dapper-based data access (`IPhotoRepository`, `IProjectRepository`)
- `Infrastructure/Storage/` — `IStorageService` with `R2StorageService` (prod) and `LocalStorageService`
- `Infrastructure/Database/DbMigrator.cs` — DbUp migrations, runs on startup when `RunDbMigrations=true`
- `Infrastructure/Database/Scripts/` — SQL migration scripts (numbered `000N_*.sql`, embedded as assembly resources)
- `Configuration/PhotoGalleryOptions.cs` — typed config for R2 credentials

Memory cache (500 MB) is registered for photo file downloads.

### Frontend (`src/web/`)

React Router v7, Tailwind CSS v4, TypeScript. No external state library — plain `useState`/`useEffect`.

Routes defined in `src/web/src/App.tsx`:
- `/` → HomePage
- `/projects` → ProjectsPage, `/projects/:id` → ProjectPage
- `/wall` → GalleryPage (wall view)
- `/admin` → AdminGalleryPage, `/admin/upload` → UploadPage, `/admin/projects` → AdminProjectsPage

API calls use `fetch()` directly. In dev mode, Vite proxies `/api` → `API_URL` (default `http://localhost:8080`). In production (Docker), Nginx proxies `/api/` → `http://api:8080/`.

### Database

PostgreSQL 16. Two tables:
- `images` — photo metadata + `storage_key` for R2 lookup
- `projects` — photo collections; `images.project_id` FK with `ON DELETE SET NULL`

### Environment Variables

The `.env` file (repo root) is read by Docker Compose:

```
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
CLOUDFLARE_API_TOKEN=
```

API also reads:
- `RunDbMigrations=true` — set to run DbUp on startup
- `ConnectionStrings__Default` — PostgreSQL connection string

### CI/CD

`.github/workflows/deploy.yml` triggers on push to `main`:
1. Builds and pushes `ghcr.io/<owner>/photo-gallery-api` Docker image
2. Builds and pushes `ghcr.io/<owner>/photo-gallery-web` Docker image
3. Azure Container Apps deploy step is commented out (pending setup)

---

## Key Conventions

- **Dapper + DbUp**, not EF Core. Write raw SQL for queries; add new migrations as numbered scripts in `Infrastructure/Database/Scripts/`.
- **`IStorageService`** abstracts storage — don't call S3/R2 SDK directly in controllers.
- Docker Compose file is `Docker-compose.yml` (capital D).
- The solution file is `photo-gallery.sln` at the repo root.

---

## Living Docs — Mandatory Updates

These docs must be kept in sync with the code. Update them as part of completing any task, not after.

### `claude/docs/progress.md`

After completing any task that corresponds to a milestone item, mark it `[x]` in `progress.md`.
If a new task arises that isn't in a milestone, add it to the appropriate milestone section or a Backlog section.
If a milestone is fully complete, add a completion date below the milestone heading.

### `claude/docs/architecture.md`

Update `architecture.md` whenever any of the following happen:
- A new service, component, or infrastructure element is added
- A new API endpoint group is created
- The data model changes (new table, new column, changed FK)
- A new environment variable is introduced
- A third-party integration is added or changed
- A significant pattern changes (e.g. switching from one caching strategy to another)

Keep it accurate and brief — it is a reference document, not a narrative.

### `claude/docs/Photo-gallery-plan.md`

Update the plan when milestone scope changes, new milestones are added, or risks/next actions change.

---

## README Standards

Every package, service, and app in this monorepo must have a `README.md`. When adding a new project or making significant changes to an existing one, create or update its README.

### Root `README.md` (repo root)

Must contain:
1. **What it is** — one paragraph: the concept, purpose, and intended audience
2. **How to run it** — minimal steps to get the full stack running locally (`docker compose up`)
3. **Project structure** — brief directory overview
4. **Links** — links to sub-project READMEs

### `src/api/README.md`

Must contain:
1. What the API does
2. How to run it standalone (`dotnet run`)
3. Key endpoints (or link to OpenAPI)
4. Environment variables it reads
5. How to add a new DB migration

### `src/web/README.md`

Must contain:
1. What the frontend does
2. How to run it standalone (`npm run dev`)
3. Route overview
4. How API calls are proxied in dev vs production

### README tone and format

- Use plain, direct language — no marketing fluff
- Code blocks for all commands
- Keep it short: a new developer should be able to run the project after reading the root README in under 5 minutes
