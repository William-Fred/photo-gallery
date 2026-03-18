# Analog Gallery

A personal photo gallery for displaying analog film photography. Images are organized into projects (rolls of film or shoots) and a free-form wall. An admin interface handles uploads — images are watermarked automatically on upload and served from Cloudflare R2.

Built as a learning project to practice cloud architecture, containerized development, CI/CD pipelines, and monorepo workflows.

---

## Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React, TypeScript, Vite, Tailwind CSS |
| Backend     | ASP.NET Core 10 Web API             |
| Database    | PostgreSQL 16                       |
| Storage     | Cloudflare R2 (S3-compatible)       |
| Containers  | Docker, Docker Compose              |
| CI/CD       | GitHub Actions                      |
| Hosting     | Azure Container Apps + Azure Static Web Apps |

---

## Running Locally

### Prerequisites

- [Docker](https://www.docker.com/) with Docker Compose
- A `.env` file at the repo root (see below)

### Start the full stack

```bash
docker compose up
```

| Service  | URL                    |
|----------|------------------------|
| Web      | http://localhost:3000  |
| API      | http://localhost:8080  |
| Database | localhost:5432         |


## Project Structure

```
photo-gallery/
├── src/
│   ├── api/          # ASP.NET Core Web API
│   └── web/          # React frontend
├── claude/
│   └── docs/         # Project plan, architecture, progress, dev setup
├── .github/
│   └── workflows/    # GitHub Actions CI/CD
├── Docker-compose.yml
├── photo-gallery.sln

```

---

## Sub-projects

- [src/api/README.md](src/api/README.md) — API setup, endpoints, and migrations
- [src/web/README.md](src/web/README.md) — Frontend setup and routes
