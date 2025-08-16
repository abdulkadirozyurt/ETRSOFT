Quick Coolify deployment notes

Server (Express):
- This repository contains `server/Dockerfile` which runs the app with `NODE_ENV=production`.
- Required environment variables for production:
  - `PROD_DB_URL` - PostgreSQL connection string (example: `postgres://user:pass@host:5432/dbname`).
  - `PORT` - optional (defaults to 3000).
- In Coolify, create an "App" using the server folder as the build context and let it use the provided Dockerfile.
- If you prefer managed DB, create a PostgreSQL service in Coolify and copy the connection URL to `PROD_DB_URL`.

Client (React/Vite):
- `client/Dockerfile` builds the app and serves static files with nginx.
- No special env vars are required for the static build. If your client reads runtime envs, prefer embedding them at build time or proxying via the server.
- In Coolify, create a second "App" using the client folder as build context and the included Dockerfile.

Notes and tips:
- For a single host (VDS) you can deploy both apps in Coolify and use Coolify's internal networking or set the server to listen on an exposed port and the client can call it via the server URL.
- If you need HTTPS, configure an Nginx reverse proxy or use Coolify's built-in TLS settings.
- For local testing, use `docker-compose up --build` from the repo root (requires Docker).

Environment checklist before deploying to VDS/Coolify:
- Server: `PROD_DB_URL` (or use an external DB service) and optionally `PORT`.
- Client: none mandatory.

If you want, I can also:
- Add a small health-check route to `server/app.js`.
- Configure nginx headers for better caching/security in `client/Dockerfile`.
- Prepare a Coolify-ready repository secrets list you can paste into the UI.
