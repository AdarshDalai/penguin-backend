# Penguin Express Backend

Node.js & Express.js backend starter with Supabase Auth integration, direct PostgreSQL queries for database tables, and automated SQL migration generation powered by Drizzle-Kit.

## Architecture & Structure

```text
src/
├── core/
│   ├── config/
│   │   ├── env.js
│   │   ├── migrations.js
│   │   ├── postgres.js
│   │   └── supabase.js
│   └── constants/
│       ├── http.constants.js
│       └── messages.constants.js
├── models/
│   ├── user.model.js
│   └── profile.model.js
├── schemas/
│   ├── request/
│   │   ├── auth.request.schema.js
│   │   └── profile.request.schema.js
│   └── response/
│       ├── auth.response.schema.js
│       └── profile.response.schema.js
├── services/
│   ├── auth.service.js
│   └── profile.service.js
├── controllers/
│   ├── auth.controller.js
│   └── profile.controller.js
├── routes/
│   ├── auth.routes.js
│   └── profile.routes.js
├── middleware/
│   ├── logger.middleware.js
│   └── errorHandler.middleware.js
├── docs/
│   └── swagger.js
├── app.js
└── server.js
drizzle.config.js
migrations/
└── 0000_init.sql
```

## Migration Commands (Native Drizzle-Kit)

### 1. Auto-Generate Migration SQL (`alembic revision --autogenerate`)
Define or update your model in `src/models/*.model.js`, then run:
```bash
npm run migrate:generate -- --name your_migration_name
```
`drizzle-kit` automatically diffs your JS schema against PostgreSQL and **generates the exact SQL migration file** in `migrations/`.

---

### 2. Apply Migrations
Apply all pending migrations using Drizzle's native migrator:
```bash
npm run migrate
```
*(Migrations also run automatically on server startup via `npm start`, `npm run dev`, or `sh script.sh`)*

---

### 3. Visual Database Studio GUI
Open Drizzle's interactive database GUI in your browser:
```bash
npm run studio
```

## Run locally

```bash
npm install
npm run dev
# or
sh script.sh
```

- Server: `http://127.0.0.1:8000`
- Swagger UI: `http://127.0.0.1:8000/docs`
- Health check: `http://127.0.0.1:8000/health`

## Deploy to Render

This project includes a ready-to-use [`render.yaml`](file:///Users/adarshkumardalai/Cloudsbay/penguin-backend/render.yaml) Blueprint file.

### Option A: Automatic Blueprint Deployment
1. Connect your repository to **Render**.
2. Select **Blueprints** and choose your repository.
3. Render will read `render.yaml` automatically.
4. Fill in the required environment variables (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`) in the Render Dashboard.

### Option B: Manual Web Service Setup
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Health Check Path**: `/health`

