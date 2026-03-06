---
name: photo-project-coder
description: generate and modify code for the photo gallery project using asp.net core web api, react, postgres, cloudflare r2, docker compose, github actions and azure container apps in a github monorepo.
---

# Photo Project Coder

This skill assists with implementing the **photo gallery project**.

The system must follow the defined stack and architecture.

---

# Technology Stack

Backend: ASP.NET Core Web API  
Frontend: React  
Database: PostgreSQL  
Image Storage: Cloudflare R2  
Hosting: Azure Container Apps  
Frontend Hosting: Azure Static Web Apps  
CI/CD: GitHub Actions  
Local Development: Docker Compose  
Repository: GitHub Monorepo

---

# Monorepo Structure

All code must follow this structure:


repo/
apps/
api/ (.NET Web API)
web/ (React frontend)

docs/
project-plan.md

infra/

docker-compose.yml

README.md


---

# API Responsibilities

The ASP.NET Core Web API must support:

### Image Upload

Admin uploads images.

Flow:

1 Image uploaded via API
2 File stored in Cloudflare R2
3 Metadata stored in PostgreSQL

Metadata example:


Id
FileName
StorageKey
ContentType
FileSize
UploadedAt


---

### Gallery Listing

Endpoint should allow retrieving images for the gallery.

Example endpoint:


GET /api/images


---

# Database

Use PostgreSQL.

Images table example:


Images
Id (uuid)
FileName
StorageKey
ContentType
FileSize
UploadedAt


Images must **not** be stored in the database.

Only metadata.

---

# Storage Integration

Cloudflare R2 should be accessed via an S3 compatible SDK.

Recommended approach:

Create a **Storage Service** abstraction.

Example:


IStorageService
UploadAsync
DeleteAsync
GetUrl


Implementation:


R2StorageService


---

# Docker Setup

Local development must use Docker Compose.

Services:

- api
- postgres
- frontend (optional)

Example:


docker-compose.yml

api
postgres


---

# CI/CD

Use GitHub Actions.

Basic pipeline steps:

1 restore dependencies
2 build api
3 run tests
4 build docker image
5 push image
6 deploy to Azure Container Apps

---

# Coding Rules

- use clean architecture principles when possible
- separate controllers, services and infrastructure
- use dependency injection
- never store binary images in the database
- store files in R2 only