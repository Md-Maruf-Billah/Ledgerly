# Ledgerly

Ledgerly is a full-stack compliance planner for Australian sole traders and
micro-businesses. It turns BAS, PAYG, superannuation, renewals, and tax dates
into a clear annual plan with guided task workflows.

## Assignment Stack

| Layer | Technology | Responsibility |
| --- | --- | --- |
| Frontend | React 19 + Vite | Responsive interface and user workflows |
| Backend | Python + FastAPI | Authentication, validation, and API routes |
| Database | Supabase | Authentication and persistent user data |
| Deployment | Vercel | React build and Python serverless API |

## Key Features

- Account registration and secure sign-in
- Business profile onboarding
- Supabase-backed tasks, notifications, and preferences
- Interactive dashboard, annual calendar, reports, and settings
- Custom task creation and task completion workflows
- Branded downloadable PDF compliance reports
- Responsive layouts for desktop, tablet, and mobile
- Demo workspace for interface exploration without an account

## Repository Structure

```text
ledgerly/
|-- api/                 Vercel Python serverless entry point
|-- backend/             FastAPI application, routes, schemas, and services
|-- docs/                Architecture, demo guide, prompts, and design docs
|-- public/              Brand assets and self-hosted fonts
|-- src/                 React screens, components, data, and utilities
|-- supabase/            PostgreSQL schema and Row Level Security policies
|-- .env.example         Safe frontend environment variable template
|-- .gitignore           Excludes credentials, builds, caches, and logs
|-- vercel.json          Full-stack Vercel deployment configuration
`-- vite.config.js       Frontend build configuration
```

## Local Development

Frontend:

```bash
npm install
npm run dev
```

Backend:

```bash
python -m venv backend/.venv
backend/.venv/Scripts/pip install -r backend/requirements.txt
backend/.venv/Scripts/uvicorn app.main:app --reload --app-dir backend
```

Copy `.env.example` to `.env.local` and `backend/.env.example` to
`backend/.env`. Add your own local values. Never commit either file.

## Data Flow

1. React sends authenticated requests through `src/utils/api.js`.
2. FastAPI validates the Supabase access token and request payload.
3. Backend services read and write user-scoped rows in Supabase.
4. Row Level Security ensures users can access only their own records.
5. React refreshes the interface with the persisted response.

See [Architecture](docs/ARCHITECTURE.md), [Demo Guide](docs/DEMO_GUIDE.md),
and [Prompt Appendix](docs/PROMPTS.md) for assessment documentation.

## Security

Secrets are stored in local or Vercel environment variables. Real `.env`
files, Supabase keys, build output, Python caches, and development logs are
excluded by `.gitignore`. The Supabase service role key is backend-only.

Additional controls are documented in [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE)
