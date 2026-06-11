# Application Architecture

## Overview

Ledgerly is deployed as one Vercel project containing a React frontend and a
Python serverless backend. Supabase provides authentication and PostgreSQL
persistence.

```text
User
  |
  v
React + Vite on Vercel
  |
  | HTTPS /api/*
  v
FastAPI serverless function
  |
  | authenticated Supabase requests
  v
Supabase Auth + PostgreSQL
```

## Frontend

`src/App.jsx` owns the current screen and application state. Screens and shared
UI live in `src/components/`. `src/utils/api.js` centralises authenticated API
requests, session expiry handling, and the deployment-aware API base URL.

## Backend

`api/index.py` exposes the FastAPI application to Vercel. The backend separates
HTTP routes, Pydantic request schemas, and Supabase services under
`backend/app/`.

Protected routes validate the bearer token before using its user ID. Profile,
task, and notification queries remain scoped to that authenticated user.

## Database

`supabase/schema.sql` documents the persisted tables and Row Level Security
policies:

- `business_profiles`
- `tasks`
- `notifications`
- `user_preferences`
- `subscriptions`

Supabase Auth manages account credentials. Application tables reference
`auth.users(id)` and remove owned records when an account is deleted.

## Deployment

`vercel.json` builds the Vite frontend into `dist/`, routes `/api/*` and
`/health` to the Python function, and sends application routes to React.

Deployment credentials are configured in Vercel project settings. They are not
stored in source control.

## Environment Variables

Frontend:

- `VITE_API_BASE_URL`

Backend:

- `APP_ENV`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CORS_ORIGINS`

Only variables prefixed with `VITE_` are included in the browser build. The
service role key must remain backend-only.
