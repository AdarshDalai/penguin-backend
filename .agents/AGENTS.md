# Penguin Backend API & Architecture Standards

This rule defines mandatory architecture guidelines, API response formatting, database migration workflow, security policies, and code conventions for `penguin-backend`.

---

## 0. API Versioning & Route Prefixing Standard

- All business feature endpoints (`auth`, `profile`, `storage`, `admin`) MUST be mounted under the `/api/v1` base route prefix in [`src/app.js`](file:///Users/adarshkumardalai/Cloudsbay/penguin-backend/src/app.js).
- Unversioned system endpoints (`/health`, `/docs`, `/openapi.json`) remain mounted at root.

---

## 1. Database Migrations Workflow (Drizzle ORM)

- **Model Definition**: All database schemas MUST be defined in [`src/models/*.model.js`](file:///Users/adarshkumardalai/Cloudsbay/penguin-backend/src/models/*.model.js) using Drizzle ORM primitives (`pgTable`, `uuid`, `text`, `timestamp`, `primaryKey`, `unique`, `pgPolicy`).
- **Auto-Generation & Execution**:
  - Migrations are automatically diffed & generated via `drizzle-kit generate` and executed via `drizzle-orm/node-postgres/migrator` during server initialization ([`src/server.js`](file:///Users/adarshkumardalai/Cloudsbay/penguin-backend/src/server.js) -> [`src/core/config/migrations.js`](file:///Users/adarshkumardalai/Cloudsbay/penguin-backend/src/core/config/migrations.js)).
  - Manual migration commands: `npm run migrate:generate` and `npm run migrate`.

---

## 2. API Response Formatting & Pagination Standard

- **Standard Response Structure**:
  All controller responses MUST use `successResponse` or `errorResponse` from [`src/schemas/response/auth.response.schema.js`](file:///Users/adarshkumardalai/Cloudsbay/penguin-backend/src/schemas/response/auth.response.schema.js).

  ```json
  {
    "status": "true",
    "message": "resource operating message",
    "data": { ... }
  }
  ```

- **Paginated API Structure**:
  All list/search endpoints MUST accept `skip` (default: 0) and `limit` (default: 50) and encapsulate pagination metadata strictly inside a nested `pagination` object:

  ```json
  {
    "status": "true",
    "message": "resources listed successfully",
    "data": {
      "items": [ ... ],
      "pagination": {
        "total": 120,
        "skip": 0,
        "limit": 50
      }
    }
  }
  ```

---

## 3. Query & Filtering Guidelines

- **Field Filtering**:
  List endpoints supporting field-specific filtering MUST use clear parameter names: `field_name` and `field_value`.
- **Regex Search Endpoints**:
  Search endpoints accepting regular expression matching MUST name the parameter `regex_pattern` (never `q`).
- **SQL Injection Safety**:
  Always validate `field_name` against a whitelist of allowed model columns before executing queries, and use parameterized SQL queries (`$1`, `$2`).

---

## 4. Security & Middleware Policy

- **Public vs Protected Routes**:
  - Specify public unauthenticated routes BEFORE `router.use(authenticateToken)` in route handlers (e.g. [`src/routes/profile.routes.js`](file:///Users/adarshkumardalai/Cloudsbay/penguin-backend/src/routes/profile.routes.js)).
  - Protect user endpoints with `authenticateToken`.
  - Protect administrative endpoints with `authenticateToken` AND `requireAdmin` from [`src/middleware/auth.middleware.js`](file:///Users/adarshkumardalai/Cloudsbay/penguin-backend/src/middleware/auth.middleware.js).
- **Service Role Key**:
  Administrative Supabase auth operations MUST use `supabaseAdmin` initialized with `SUPABASE_SERVICE_ROLE_KEY` in [`src/core/config/supabase.js`](file:///Users/adarshkumardalai/Cloudsbay/penguin-backend/src/core/config/supabase.js).

---

## 5. OpenAPI / Swagger Documentation

- Every new route or updated payload MUST be registered in [`src/docs/swagger.js`](file:///Users/adarshkumardalai/Cloudsbay/penguin-backend/src/docs/swagger.js).
- Include `security: [{ bearerAuth: [] }]` for protected endpoints and full request body JSON schemas.
