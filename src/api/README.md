# API — Photo Gallery

ASP.NET Core 10 Web API. Handles image uploads, watermarking, metadata storage, and serving image files from Cloudflare R2.

---

## Running Standalone

```bash
cd src/api
dotnet run
# API available at http://localhost:8080
```

Or with hot reload:

```bash
dotnet watch
```

Requires a running PostgreSQL instance and a `.env` at the repo root (or equivalent environment variables set locally).

---

## Key Endpoints

| Method | Route                       | Description                                 |
|--------|-----------------------------|---------------------------------------------|
| GET    | `/api/photos`               | List all photos (supports `?projectId=`)    |
| GET    | `/api/photos/wall`          | List photos not assigned to any project     |
| POST   | `/api/photos`               | Upload a photo (multipart/form-data)        |
| DELETE | `/api/photos/{id}`          | Delete a photo                              |
| GET    | `/api/photos/{id}/file`     | Serve the watermarked image file            |
| GET    | `/api/projects`             | List all projects                           |
| GET    | `/api/projects/{id}`        | Get a single project                        |
| POST   | `/api/projects`             | Create a project                            |
| DELETE | `/api/projects/{id}`        | Delete a project                            |

---

## Architecture

```
Controllers → Repositories (Dapper) → PostgreSQL
Controllers → IStorageService        → Cloudflare R2
Controllers → WatermarkService       → ImageSharp (applied on upload)
```

- **Dapper + DbUp** for data access — no EF Core. Write raw SQL.
- **`IStorageService`** abstracts R2 vs local storage — never call the S3 SDK directly from controllers.
- **Memory cache** (500 MB) for photo file downloads.

---

## Environment Variables

| Variable                    | Description                              |
|-----------------------------|------------------------------------------|
| `ConnectionStrings__Default`| PostgreSQL connection string             |
| `RunDbMigrations`           | Set to `true` to run DbUp on startup     |
| `R2_ACCOUNT_ID`             | Cloudflare account ID                    |
| `R2_ACCESS_KEY_ID`          | R2 access key                            |
| `R2_SECRET_ACCESS_KEY`      | R2 secret key                            |
| `R2_BUCKET_NAME`            | R2 bucket name                           |
| `R2_ENDPOINT`               | R2 endpoint URL                          |

---

## Adding a Database Migration

1. Add a new SQL file to `Infrastructure/Database/Scripts/` following the naming convention: `000N_description.sql`
2. Set the file's build action to **Embedded Resource** in the `.csproj`
3. Start the API with `RunDbMigrations=true` — DbUp runs all pending scripts on startup in order

Example script name: `0003_add_caption_to_images.sql`
