# Ledgerly

Australian compliance calendar for sole traders and micro-businesses.

---

## Local Setup

### Prerequisites

- Node.js 18 or later
- npm 9 or later
- Python 3.11 or later (for backend)

### Frontend

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

**Demo credentials:** `demo@ledgerly.com` / `password123`

### Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy env example (edit values before use)
cp .env.example .env

# Start API server (http://localhost:8000)
uvicorn app.main:app --reload

# Test health check
curl http://localhost:8000/health
```

**API docs available at:** `http://localhost:8000/docs`

---

## Project Structure

```
ledgerly/
├── src/
│   ├── App.jsx                 # Root — all state and screen routing
│   ├── styles.css              # Complete design system (5500+ lines)
│   ├── main.jsx                # React entry point
│   ├── components/             # 17 screen and UI components
│   ├── data/
│   │   └── tasks.js            # Seed task data for 6 business types
│   └── utils/
│       ├── api.js              # API client (integration points marked)
│       ├── dates.js            # Date helpers
│       └── storage.js          # localStorage wrapper
├── backend/
│   ├── app/
│   │   ├── main.py             # FastAPI app + CORS + routes
│   │   ├── config.py           # Settings from .env
│   │   ├── routes/             # auth, tasks, profiles, notifications
│   │   ├── services/           # Supabase integration points
│   │   ├── schemas/            # Pydantic request/response models
│   │   └── models/             # (reserved for ORM models if needed)
│   ├── requirements.txt
│   └── .env.example
├── supabase/
│   └── schema.draft.sql        # DRAFT — do not apply until Supabase exists
├── docs/
│   ├── PRODUCT.md
│   └── DESIGN.md
├── .env.example                # Frontend env template
├── .gitignore
├── vite.config.js
├── package.json
└── index.html
```

---

## Data Requirements Map

| Screen | Form / Action | Fields | Future Supabase Table | Future API Endpoint |
|--------|--------------|--------|-----------------------|---------------------|
| LoginScreen | Login form | email, password | auth.users (Supabase Auth) | POST /api/auth/login |
| BusinessProfileForm | Profile form | fullName, businessName, email, state | business_profiles | POST /api/profile |
| BusinessTypeSelector | Type selection | businessType | business_profiles | PUT /api/profile/{id} |
| Dashboard | View tasks | — | tasks | GET /api/tasks/{user_id} |
| Dashboard | "Add Custom Task" | — | — | — |
| CustomTaskModal | Custom task form | name, dueDate, priority, notes | tasks (is_custom=true) | POST /api/tasks/{user_id} |
| TaskDetailPanel | Mark as Done | taskId | tasks (status, completed_at) | PUT /api/tasks/{user_id}/{task_id} |
| MonthlySummary | Export report | — | tasks (read) | GET /api/tasks/{user_id} |
| SettingsScreen | Toggle preferences | emailReminders, pushNotifications, monthlySummaryEmail | user_preferences | PUT /api/profile/{user_id}/preferences |
| SettingsScreen | Logout | — | — | POST /api/auth/logout |
| Notifications | View notifications | — | notifications | GET /api/notifications/{user_id} |
| PricingPlans | Upgrade plan | — | subscriptions | POST /api/subscriptions |
| CalendarView | View calendar | — | tasks (read) | GET /api/tasks/{user_id} |

---

## Environment Variables

### Frontend (`.env.local`)

| Variable | Description | Required for local dev |
|----------|-------------|------------------------|
| `VITE_API_BASE_URL` | Backend URL | No (defaults to http://localhost:8000) |
| `VITE_SUPABASE_URL` | Supabase project URL | No (Stage 2) |
| `VITE_SUPABASE_ANON_KEY` | Supabase public anon key | No (Stage 2) |

### Backend (`.env`)

| Variable | Description | Required for local dev |
|----------|-------------|------------------------|
| `APP_ENV` | Environment name | No (defaults to local) |
| `BACKEND_CORS_ORIGINS` | Allowed frontend origins | No (defaults set) |
| `SUPABASE_URL` | Supabase project URL | No (Stage 2) |
| `SUPABASE_ANON_KEY` | Supabase anon key | No (Stage 2) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only secret key | No (Stage 2) |
| `DATABASE_URL` | Postgres connection string | No (Stage 2) |
| `SECRET_KEY` | JWT signing secret | Dev only — change in prod |

**Security rule:** `SUPABASE_SERVICE_ROLE_KEY` must NEVER appear in frontend code or `.env.local`.

---

## Supabase Integration Plan (Stage 2)

### Proposed Tables

| Table | Purpose | Frontend Screen |
|-------|---------|-----------------|
| `auth.users` | Managed by Supabase Auth | LoginScreen |
| `business_profiles` | Onboarding data | BusinessProfileForm, SettingsScreen |
| `tasks` | Compliance obligations | Dashboard, TaskDetailPanel, CalendarView |
| `notifications` | Task alerts | Notifications |
| `user_preferences` | Toggle settings | SettingsScreen |
| `subscriptions` | Free/Pro plan tracking | PricingPlans |

### Steps to connect Supabase

1. Create Supabase project at supabase.com
2. Copy project URL and anon key to frontend `.env.local`
3. Copy project URL, anon key, and service role key to backend `.env`
4. Apply `supabase/schema.draft.sql` in Supabase SQL editor (review first)
5. Enable RLS on each table (already in schema draft)
6. Uncomment Supabase dependency in `backend/requirements.txt`
7. Replace placeholder service functions in `backend/app/services/`
8. Replace mock returns in `src/utils/api.js` with real fetch calls
9. Remove demo credentials from `LoginScreen.jsx`

---

## GitHub Readiness Checklist

- [x] `.gitignore` created — covers node_modules, dist, .env, __pycache__, .venv
- [x] `node_modules/` not tracked
- [x] `dist/` not tracked
- [x] Real `.env` files not tracked
- [x] `package.json` present and valid
- [x] `package-lock.json` present
- [x] `backend/requirements.txt` present
- [x] `.env.example` (frontend) present
- [x] `backend/.env.example` present
- [x] `README.md` with setup instructions present
- [x] `supabase/schema.draft.sql` marked as draft
- [x] No credentials in source code
- [x] No service role key anywhere in frontend
- [x] No build artefacts staged
- [ ] Initialize git repo: `git init && git add . && git commit -m "Initial commit"`
- [ ] Create GitHub repository and push

---

## Vercel Readiness Checklist

### Frontend Deployment

| Setting | Value |
|---------|-------|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |
| Node.js Version | 18.x or 20.x |

### Required Vercel Environment Variables (set in Vercel dashboard)

| Variable | Value Source |
|----------|-------------|
| `VITE_API_BASE_URL` | Production backend URL (e.g. Railway/Render URL) |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key (public — safe for frontend) |

### Backend Hosting Note

The FastAPI backend cannot run on Vercel (serverless Python functions have restrictions).
**Recommended options:** Railway, Render, Fly.io, or AWS Lambda (with Mangum adapter).

### CORS Update for Production

When deploying, update `BACKEND_CORS_ORIGINS` in backend `.env` to include the Vercel production URL:

```
BACKEND_CORS_ORIGINS=https://your-app.vercel.app,http://localhost:5173
```

### Potential Deployment Blockers

- [ ] Backend must be deployed and accessible before frontend can make API calls
- [ ] Supabase must be connected before auth/data features work
- [ ] `VITE_*` env vars must be set in Vercel dashboard (not just locally)
- [ ] `vercel.json` not required for this Vite setup — Vercel auto-detects

---

## Remaining TODOs

1. **Auth:** Replace demo@ledgerly.com mock login with Supabase Auth (Stage 2)
2. **Task seeding:** On first login, seed tasks from `businessTypeTasks` into Supabase for the user's business type
3. **Real persistence:** Replace localStorage with Supabase reads/writes
4. **Notification persistence:** Move notification generation server-side
5. **Preference persistence:** Save toggle states to `user_preferences` table
6. **PDF export:** Implement real PDF export for Pro tier (MonthlySummary)
7. **Email reminders:** Server-side cron job for due-soon/overdue reminders
8. **GSAP cleanup:** Remove unused GSAP dependency or implement planned animations
9. **Test suite:** Add Vitest unit tests for date utilities and component rendering
10. **Error boundaries:** Add React error boundaries around major screen components
