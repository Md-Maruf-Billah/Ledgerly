<div align="center">

# Ledgerly

### Australian Compliance Calendar for Sole Traders & Micro-Businesses

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?style=flat-square&logo=vite&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.136-009688?style=flat-square&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.14-3776AB?style=flat-square&logo=python&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-2.31-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-orange?style=flat-square)

Ledgerly transforms scattered ATO obligations — BAS, super, STP, PAYG, licences — into a single calm compliance calendar, purpose-built for Australian small businesses.

[Features](#features) · [Architecture](#architecture) · [Getting Started](#getting-started) · [API Reference](#api-reference) · [Security](#security)

</div>

---

## Overview

Sole traders and micro-businesses in Australia face a constant stream of compliance deadlines — quarterly BAS lodgements, superannuation payments, PAYG instalments, STP finalisation, licence renewals, and annual tax returns. Missing any of these attracts ATO penalties and personal stress.

**Ledgerly** solves this with a business-type-aware compliance calendar that:
- Generates a tailored obligation list on sign-up based on your business category
- Colour-codes every task as **Overdue**, **Due Soon**, or **Upcoming** in real time
- Walks you through each obligation step-by-step with guided checklists
- Persists all data securely in Supabase with per-user Row Level Security

---

## Features

| Category | Feature |
|---|---|
| **Onboarding** | Guided 3-step setup: tour → business profile → business type selection |
| **Calendar** | Monthly calendar view with task pills colour-coded by urgency |
| **Dashboard** | Live metric strip (completed / overdue / pending), obligation timeline SVG, overdue banner |
| **Task Detail** | Step-by-step guided checklist; progress ring; unlocks "Mark as Done" only when all steps checked |
| **Compliance Tasks** | 6 tasks × 6 business types (36 pre-built obligations covering real ATO deadlines) |
| **Custom Tasks** | Add your own compliance obligation with name, due date, priority, and notes |
| **Monthly Summary** | Compliance report with completion rate, interactive bar chart, and TXT export |
| **Notifications** | Auto-generated alerts for overdue and due-soon tasks, stored in Supabase |
| **Settings** | Profile management, preference toggles, secure logout |
| **Pricing** | Free / Pro tier UI with product roadmap section |
| **Demo Mode** | Full app walkthrough with sample data — no account needed |
| **Auth** | Email/password via Supabase Auth; session restore on reload; auto-logout on token expiry |

### Supported Business Types

| Type | Pre-built Obligations |
|---|---|
| Sole Trader | BAS Q3 & Q4, PAYG Instalment, Super Q4, Business Name Renewal, Annual Tax Return |
| Retail | PAYG Withholding, Workers Comp, STP Finalisation, BAS Q4, Super Q4, Annual Tax Return |
| Hospitality | STP Finalisation, Super Q4, Food Licence Renewal, BAS Q4, Liquor Licence, Annual Tax Return |
| Trades | GST Instalment, Contractor Licence, Workers Comp Renewal, BAS Q4, TPAR, Annual Tax Return |
| Consulting | BAS Q3 & Q4, PI Renewal, PAYG Instalment, CPD Log, Annual Tax Return |
| Small Team | PAYG Withholding, STP Finalisation, Super Q4, BAS Q4, Annual Leave Review, Annual Tax Return |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Browser / Client                    │
│                                                         │
│  React 19  ·  Vite 7  ·  Custom CSS Design System      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  13      │  │  API     │  │ sanitize │              │
│  │  Screens │→ │  Client  │→ │  utils   │              │
│  └──────────┘  └────┬─────┘  └──────────┘              │
└───────────────────  │  ──────────────────────────────────┘
                      │  HTTPS · Bearer JWT · X-Request-ID
┌─────────────────────▼──────────────────────────────────┐
│                  FastAPI Backend (Python 3.14)          │
│                                                         │
│  Security Middleware Stack (outermost → innermost):     │
│  CORS → RequestID → SecurityHeaders → Routes            │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  /auth   │  │  /tasks  │  │ /profile │              │
│  │  /notif  │  │  schemas │  │ services │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└───────────────────  │  ──────────────────────────────────┘
                      │  Supabase Python SDK · Service Role Key
┌─────────────────────▼──────────────────────────────────┐
│                    Supabase (PostgreSQL)                │
│                                                         │
│  auth.users  ·  business_profiles  ·  tasks            │
│  notifications  ·  user_preferences  ·  subscriptions  │
│                                                         │
│  Row Level Security enabled on all tables              │
└────────────────────────────────────────────────────────┘
```

### Key Design Decisions

| Decision | Rationale |
|---|---|
| FastAPI over Flask | Async-native, automatic OpenAPI docs, Pydantic validation built-in |
| Supabase over raw Postgres | Managed auth, RLS, and instant REST API — no auth server to maintain |
| Service Role Key backend-only | Frontend never holds elevated credentials; all DB writes go through validated API |
| Single CSS file | 5 500-line design system allows zero runtime CSS-in-JS overhead |
| `currentScreen` state routing | No React Router dependency; all screens are pre-loaded SPA transitions |

---

## Project Structure

```
ledgerly/
├── src/
│   ├── App.jsx                     # Root — all state, auth flow, screen routing
│   ├── main.jsx                    # Entry point + ErrorBoundary wrapper
│   ├── styles.css                  # Complete design system (5 500 lines)
│   ├── components/
│   │   ├── LoginScreen.jsx         # Sign in / Create account toggle
│   │   ├── OnboardingTour.jsx      # 3-slide feature carousel
│   │   ├── BusinessProfileForm.jsx # Step 1 of 2: profile details
│   │   ├── BusinessTypeSelector.jsx# Step 2 of 2: type selection
│   │   ├── LoadingScreen.jsx       # Animated calendar-build skeleton
│   │   ├── WelcomeScreen.jsx       # Confetti welcome after onboarding
│   │   ├── Dashboard.jsx           # Main screen with metrics + task list
│   │   ├── TaskCard.jsx            # Reusable task list item
│   │   ├── TaskDetailPanel.jsx     # Step checklist + progress ring overlay
│   │   ├── ObligationTimeline.jsx  # SVG timeline of all due dates
│   │   ├── CalendarView.jsx        # Monthly calendar with task pills
│   │   ├── MonthlySummary.jsx      # Compliance report + bar chart + export
│   │   ├── Notifications.jsx       # Notification feed
│   │   ├── SettingsScreen.jsx      # Profile + preferences + logout
│   │   ├── CustomTaskModal.jsx     # Add-task overlay with validation
│   │   ├── ConfirmationScreen.jsx  # Post-completion screen
│   │   ├── PricingPlans.jsx        # Free / Pro tier comparison
│   │   ├── Icons.jsx               # 22 stroke-based SVG icons
│   │   └── ErrorBoundary.jsx       # Crash fallback — no stack traces exposed
│   ├── data/
│   │   └── tasks.js                # 36 pre-built Australian compliance tasks
│   └── utils/
│       ├── api.js                  # Backend client with 401 interception
│       ├── sanitize.js             # XSS mitigation helpers
│       ├── dates.js                # Status computation + date formatting
│       └── storage.js              # localStorage wrapper (demo mode only)
│
├── backend/
│   └── app/
│       ├── main.py                 # FastAPI app, middleware, global error handler
│       ├── config.py               # Pydantic settings from .env
│       ├── middleware.py           # RequestID + SecurityHeaders middleware
│       ├── dependencies.py         # JWT validation via Supabase
│       ├── routes/                 # auth · tasks · profiles · notifications
│       ├── services/               # Supabase DB calls (one file per domain)
│       ├── schemas/                # Pydantic request/response models + validators
│       └── models/                 # (reserved for ORM models)
│
├── supabase/
│   └── schema.draft.sql            # Full DB schema with RLS policies
│
├── docs/
│   ├── PRODUCT.md                  # Product brief and design principles
│   └── DESIGN.md                   # Complete design system specification
│
├── .env.example                    # Frontend env template
├── backend/.env.example            # Backend env template
└── .gitignore                      # Excludes node_modules, .env, dist, __pycache__
```

---

## Getting Started

### Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| npm | 9+ | bundled with Node |
| Python | 3.11+ | [python.org](https://python.org) |

### 1 — Clone and install frontend

```bash
git clone https://github.com/Md-Maruf-Billah/Ledgerly.git
cd Ledgerly
npm install
```

### 2 — Configure frontend environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### 3 — Set up the backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
```

Edit `backend/.env` with your Supabase credentials:

```env
APP_ENV=local
BACKEND_CORS_ORIGINS=http://localhost:5173
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4 — Apply the database schema

1. Open your Supabase project → **SQL Editor**
2. Paste the contents of [`supabase/schema.draft.sql`](supabase/schema.draft.sql)
3. Click **Run**

### 5 — Run the app

**Terminal 1 — Backend:**

```bash
cd backend
uvicorn app.main:app --reload
# API running at http://localhost:8000
# Interactive docs at http://localhost:8000/docs
```

**Terminal 2 — Frontend:**

```bash
npm run dev
# App running at http://localhost:5173
```

### Try Demo Mode

No account needed. Click **"Try demo mode"** on the login screen to explore the full app with pre-loaded sample data for a Sole Trader business.

---

## API Reference

All endpoints require `Authorization: Bearer <token>` except `/health`, `/api/auth/login`, and `/api/auth/register`.

Full interactive docs available at `http://localhost:8000/docs` when running locally.

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create a new account |
| `POST` | `/api/auth/login` | Sign in and receive JWT |
| `POST` | `/api/auth/logout` | Invalidate session |
| `GET` | `/api/auth/me` | Validate token + check onboarding status |

### Profile

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/profile` | Save onboarding profile + seed compliance tasks |
| `GET` | `/api/profile/me` | Fetch profile + tasks + notifications (session restore) |
| `PUT` | `/api/profile/me` | Update profile details |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | List all tasks (status recomputed from today) |
| `POST` | `/api/tasks` | Create a custom task |
| `PUT` | `/api/tasks/{id}/done` | Mark task complete + create notification |
| `DELETE` | `/api/tasks/{id}` | Delete a custom task |

### Notifications

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/notifications` | List all notifications |
| `PUT` | `/api/notifications/{id}/read` | Mark one as read |
| `PUT` | `/api/notifications/read-all` | Mark all as read |

---

## Database Schema

```sql
auth.users              -- Managed by Supabase Auth
business_profiles       -- Onboarding data; 1 row per user
tasks                   -- Compliance obligations; steps stored as JSONB
notifications           -- Per-task alerts; overdue / due-soon / completed / system
user_preferences        -- Email reminders, push notifications, monthly summary
subscriptions           -- Free / Pro plan tracking
```

Row Level Security is enabled on all tables. Every policy uses `auth.uid() = user_id`, ensuring users can only read and write their own data.

See [`supabase/schema.draft.sql`](supabase/schema.draft.sql) for full column definitions, indexes, constraints, and `updated_at` triggers.

---

## Security

This project implements a layered security model following the **Fullstack Guardian** framework — defence at every level from database to browser.

### Backend

| Layer | Implementation |
|---|---|
| **Authentication** | Supabase JWT validated server-side on every protected endpoint via `get_current_user` dependency |
| **Authorisation** | All DB queries are scoped by `user_id` extracted from the validated token — no client-supplied IDs trusted |
| **Row Level Security** | Supabase RLS policies enforce data isolation at the database layer, independent of application code |
| **Input Validation** | Pydantic `field_validator` on all schemas — length limits, enum enforcement, date range checks, step count caps |
| **Error Sanitisation** | Auth failures always return a generic message; Supabase errors are never forwarded to prevent email enumeration |
| **Security Headers** | `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy`, `Content-Security-Policy` on every response |
| **CORS** | Restricted to explicit origins, methods (`GET POST PUT DELETE OPTIONS`), and headers (`Authorization Content-Type X-Request-ID`) |
| **Request Tracing** | `X-Request-ID` UUID attached to every request/response for frontend-backend log correlation |
| **Global Error Handler** | Unhandled exceptions return a safe `500` JSON — no stack traces exposed |
| **Docs Gating** | `/docs` and `/redoc` disabled when `APP_ENV=production` |

### Frontend

| Layer | Implementation |
|---|---|
| **Error Boundary** | React class component wraps the full app — crashes show a safe fallback, never raw error details |
| **401 Interception** | All `401` responses fire a `ledgerly:unauthorized` event; `App.jsx` listens and auto-logs out the user |
| **Output Sanitisation** | `sanitize.js` strips HTML tags from all user-provided strings before rendering |
| **Token Guard** | `setToken()` rejects `null`/`"null"` strings — no invalid token ever stored in localStorage |
| **Client Validation** | `CustomTaskModal` validates name length, date range, and notes length before submitting |
| **No Secrets in Frontend** | Supabase `service_role` key is backend-only; frontend only holds the short-lived JWT |

---

## Deployment

### Frontend — Vercel

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Environment Variables | `VITE_API_BASE_URL` (production backend URL) |

### Backend — Railway / Render / Fly.io

The FastAPI backend requires a persistent server (not serverless). Set all backend `.env` variables in your hosting platform's environment settings.

Update `BACKEND_CORS_ORIGINS` to include the Vercel production URL:

```env
BACKEND_CORS_ORIGINS=https://your-app.vercel.app,http://localhost:5173
```

---

## Roadmap

| Feature | Status |
|---|---|
| BAS / IAS pre-fill from ATO data | Planned |
| PDF export of monthly summary | Planned |
| Email reminders (server-side cron) | Planned |
| Accountant sharing & multi-user | Research |
| Xero / MYOB integration | Research |
| Mobile app (React Native) | Exploring |
| Pro tier payment (Stripe) | Exploring |

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 19.2 | UI component model |
| Build | Vite 7.3 | Dev server + production bundler |
| Styling | Custom CSS (5 500 lines) | Complete design system, no runtime overhead |
| Animations | CSS keyframes (35 animations) | Smooth transitions without JS |
| Backend | FastAPI 0.136 | Async REST API with automatic OpenAPI |
| Runtime | Python 3.14 | Backend language |
| Validation | Pydantic 2.13 | Schema validation + settings management |
| Database | Supabase (PostgreSQL) | Managed database with RLS |
| Auth | Supabase Auth | JWT-based authentication |
| DB Client | supabase-py 2.31 | Python Supabase SDK |
| Server | Uvicorn | ASGI production server |
| Typography | DM Sans (Google Fonts) | Calm, readable typeface |

---

## License

[MIT](LICENSE) © 2026 Md Maruf Billah
