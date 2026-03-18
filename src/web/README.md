# Web — Photo Gallery

React frontend. Displays the photo gallery and provides an admin interface for uploading and managing photos and projects.

Built with React 19, TypeScript, Vite, React Router v7, and Tailwind CSS v4.

---

## Running Standalone

```bash
cd src/web
npm install
npm run dev
# Available at http://localhost:5173
```

Other commands:

```bash
npm run build   # Production build (outputs to dist/)
npm run lint    # ESLint
```

In standalone dev mode, API calls are proxied by Vite to `http://localhost:8080` by default. Set the `API_URL` environment variable to point at a different API instance.

---

## Routes

| Route                  | Page               | Description                             |
|------------------------|--------------------|-----------------------------------------|
| `/`                    | HomePage           | Landing page — lists projects + Wall    |
| `/projects`            | ProjectsPage       | All projects                            |
| `/projects/:id`        | ProjectPage        | Photos in a specific project            |
| `/wall`                | GalleryPage        | Photos not assigned to any project      |
| `/admin`               | AdminGalleryPage   | Admin view with delete controls         |
| `/admin/upload`        | UploadPage         | Upload a new photo                      |
| `/admin/projects`      | AdminProjectsPage  | Create and delete projects              |

Routes are defined in `src/App.tsx`.

---

## API Calls

All API calls use `fetch()` directly — no HTTP client library.

**Development:** Vite proxies `/api/*` → `API_URL` (default `http://localhost:8080`), configured in `vite.config.ts`.

**Production (Docker):** Nginx proxies `/api/` → `http://api:8080/`. The built frontend is served as static files by the same Nginx container.
