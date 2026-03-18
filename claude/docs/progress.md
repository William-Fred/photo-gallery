# Project Progress

## Milestone 1 — Repository Setup

- [x] Create GitHub repository
- [x] Initialize monorepo structure
- [x] Create README
- [x] Setup .gitignore
- [x] Setup folder structure

---

## Milestone 2 — Local Development Environment

- [x] Create ASP.NET Core Web API project
- [x] Add Dockerfile for API
- [x] Create docker-compose.yml
- [x] Add PostgreSQL container
- [x] Create React application

---

## Milestone 3 — Database & Metadata

- [x] Add Dapper + DbUp
- [x] Create Photo entity
- [x] Create SQL migration for images table
- [x] Run migration on API startup

---

## Milestone 4 — Cloudflare R2 Integration

- [x] Create Cloudflare account
- [x] Create R2 bucket
- [x] Configure S3 credentials
- [x] Implement R2StorageService
- [x] Test upload to R2

---

## Milestone 5 — Image Upload API

- [x] Create ImagesController
- [x] Create upload endpoint (POST /api/images)
- [x] Upload file to R2
- [x] Save metadata to database
- [x] Return image metadata

---

## Milestone 6 — React Admin Upload UI

- [x] Create upload page
- [x] Add file input
- [x] Send file to API
- [x] Show upload progress
- [x] Show success message

---

## Milestone 7 — Gallery View

- [x] Create GET /api/images/{id}/file endpoint med vattenstämpel
- [x] Create gallery component (GalleryPage.tsx)
- [x] Fetch images from API (GET /api/images)
- [x] Display images in grid
- [ ] Add pagination (frontend klar, backend saknar stöd för page/pageSize query params)

### Backlog (utöver milestone 7)

- [ ] API: paginering — stöd för `?page=&pageSize=` i GET /api/images
- [ ] API: filstorleksgräns vid upload (förslag: 20 MB)
- [ ] API: validera filändelse vid upload (tillåt t.ex. jpg, jpeg, png, webp)

---

## Milestone 7.5 — Admin & Public Split

- [x] Skapa publik GalleryPage utan delete-knappar (route `/wall`)
- [x] Skapa AdminGalleryPage med delete-knappar (route `/admin`)
- [x] Ta bort delete-knapp från publik vy

---

## Milestone 8 — Projekt & År

Goal: organisera bilder i projekt och år.

### Databas
- [x] Migration 0002: skapa projects-tabell (id, name, year, description)
- [x] Lägg till project_id FK på images-tabellen
- [x] Uppdatera Photo-entiteten med ProjectId

### API
- [x] GET /api/photos?projectId= — filtrera bilder på projekt
- [x] GET /api/photos/wall — bilder utan projekt
- [x] POST /api/photos tar emot projectId vid uppladdning
- [x] GET /api/projects — lista alla projekt
- [x] GET /api/projects/{id} — hämta ett projekt
- [x] POST /api/projects — skapa projekt
- [x] DELETE /api/projects/{id} — ta bort projekt

### Frontend — publik vy
- [x] Startsida (/) visar projektkort + Wall-kort
- [x] /projects/:id — bilder i ett projekt
- [x] /wall — bilder utan projekt
- [ ] Lightbox: klick på bild → större vy med info

### Frontend — admin
- [x] /admin/projects — skapa och ta bort projekt
- [x] Upload-formulär med projekt-dropdown

---

## Milestone 9 — Authentication

- [ ] Implement JWT authentication
- [ ] Add login endpoint
- [ ] Protect upload endpoint
- [ ] Add login UI

---

## Milestone 10 — CI/CD

- [ ] Setup GitHub Actions
- [ ] Build API
- [ ] Run tests
- [ ] Build Docker image
- [ ] Push container image

---

## Milestone 11 — Cloud Deployment

- [ ] Create Azure Container Apps environment
- [ ] Deploy API container
- [ ] Deploy React app to Static Web Apps
- [ ] Configure environment variables
- [ ] Connect database
- [ ] Configure R2 credentials
