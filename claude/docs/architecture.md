# System Architecture

## Overview

Photo Gallery is a web application for uploading and displaying images.

Images are stored in Cloudflare R2 while metadata is stored in PostgreSQL.

Frontend communicates with an ASP.NET Core Web API.

---

## Tech Stack

Frontend: React  
Backend: ASP.NET Core Web API  
Database: PostgreSQL  
Storage: Cloudflare R2  
Containers: Docker  
CI/CD: GitHub Actions  
Hosting: Azure Container Apps + Azure Static Web Apps

---

## System Components

### React Frontend

Responsibilities:

- admin upload interface
- gallery display
- authentication UI

---

### ASP.NET Core Web API

Responsibilities:

- handle image uploads
- store metadata
- return gallery data
- authenticate users

---

### PostgreSQL

Stores metadata:

Image

- Id
- FileName
- StorageKey
- ContentType
- FileSize
- UploadedAt

---

### Cloudflare R2

Stores image files.

Accessed via S3 compatible API.

---

## Upload Flow

React → API → R2 → PostgreSQL

1 user uploads image
2 API uploads file to R2
3 API stores metadata in database
4 API returns image info

---

## Gallery Flow

React → API → PostgreSQL → R2

1 frontend requests images
2 API reads metadata
3 returns image URLs
4 frontend renders gallery