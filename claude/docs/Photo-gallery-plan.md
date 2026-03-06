# Photo Gallery Project Plan

## Vision

Build a personal photo gallery platform where images can be uploaded through an admin interface, stored in Cloudflare R2, and displayed in a web gallery.  

The project is designed to:

- learn modern cloud architecture
- practice containerized development
- implement CI/CD pipelines
- use a monorepo workflow

The system should be **cheap to host**, **easy to evolve**, and **built incrementally**.

---

# Architecture

## Overview

System consists of:

Frontend → React  
Backend → ASP.NET Core Web API  
Database → PostgreSQL  
Image Storage → Cloudflare R2  
Containerization → Docker  
CI/CD → GitHub Actions  
Hosting → Azure Container Apps + Azure Static Web Apps

---

## System Flow

Admin uploads image


React Admin UI
↓
ASP.NET Core API
↓
Upload to Cloudflare R2
↓
Store metadata in PostgreSQL


Gallery view


React Gallery
↓
API
↓
Fetch metadata from PostgreSQL
↓
Return image URLs (R2)


---

# Monorepo Structure


photo-gallery/

apps/
api/ ASP.NET Core Web API
web/ React application

docs/
project-plan.md

infra/
deployment-notes.md

docker-compose.yml

README.md


---

# Milestones

## Milestone 1 — Repository Setup

Goal: establish monorepo and development environment.

### Tasks

- Create GitHub repository
- Initialize monorepo structure
- Create README
- Create project-plan.md
- Setup .gitignore
- Setup folder structure

---

## Milestone 2 — Local Development Environment

Goal: run full stack locally.

### Tasks

- Create ASP.NET Core Web API project
- Create React application
- Add Dockerfile for API
- Create docker-compose.yml
- Add PostgreSQL container
- Configure API database connection

---

## Milestone 3 — Database & Metadata

Goal: store image metadata.

### Tasks

- Add EF Core
- Create Image entity
- Configure DbContext
- Create migration
- Apply migration

Example model:


Image
Id
FileName
StorageKey
ContentType
FileSize
UploadedAt


---

## Milestone 4 — Cloudflare R2 Integration

Goal: store image files.

### Tasks

- Create Cloudflare account
- Create R2 bucket
- Configure S3 credentials
- Add storage configuration to API
- Implement StorageService
- Implement R2StorageService
- Test upload to R2

---

## Milestone 5 — Image Upload API

Goal: allow image uploads.

### Tasks

- Create ImagesController
- Create upload endpoint
- Upload file to R2
- Save metadata to database
- Return image metadata

Endpoint example:


POST /api/images


---

## Milestone 6 — React Admin Upload UI

Goal: allow uploading images from frontend.

### Tasks

- Create upload page
- Add file input
- Send file to API
- Show upload progress
- Show success message

---

## Milestone 7 — Gallery View

Goal: display uploaded images.

### Tasks

- Create gallery component
- Fetch images from API
- Display images in grid
- Add pagination

Endpoint:


GET /api/images


---

## Milestone 8 — Authentication

Goal: protect admin functionality.

### Tasks

- Implement JWT authentication
- Add login endpoint
- Protect upload endpoint
- Add login UI

---

## Milestone 9 — CI/CD

Goal: automated builds.

### Tasks

- Setup GitHub Actions
- Build API
- Run tests
- Build Docker image
- Push container image

---

## Milestone 10 — Cloud Deployment

Goal: deploy to cloud.

### Tasks

- Create Azure Container Apps environment
- Deploy API container
- Deploy React app to Static Web Apps
- Configure environment variables
- Connect database
- Configure R2 credentials

---

# Risks

## Large Image Uploads

Mitigation:
- set upload limits
- stream uploads

---

## Storage Integration Complexity

Mitigation:
- abstract storage service

---

## Docker Networking Issues

Mitigation:
- use consistent service names

---

## Cloud Cost Growth

Mitigation:

- monitor usage
- use cheapest tiers initially

---

# Next Actions

Immediate steps:

1. Create GitHub repository
2. Initialize monorepo structure
3. Create ASP.NET Core Web API project
4. Create React project
5. Add Docker Compose with PostgreSQL
6. Commit initial project

---

# Progress Tracking

## Milestone 1

[ ] Create repository  
[ ] Setup monorepo structure  
[ ] Add README  
[ ] Add project-plan.md  

---

## Milestone 2

[ ] Create API project  
[ ] Create React project  
[ ] Add Dockerfile  
[ ] Create docker-compose.yml  
[ ] Add PostgreSQL  

---

## Milestone 3

[ ] Create Image entity  
[ ] Configure DbContext  
[ ] Add migration  
[ ] Apply migration  