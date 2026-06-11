# Five-Minute Demo Guide

## 0:00 to 0:20: Live Deployment

- Begin with the Vercel URL visible in the browser address bar.
- Identify Ledgerly as a compliance planner for Australian small businesses.

## 0:20 to 2:25: Complete Workflow

1. Register or sign in with a real test account.
2. Complete the business profile if using a new account.
3. Create a custom compliance task.
4. Open its details and complete the workflow.
5. Refresh or sign out and back in to show the data persists.
6. Briefly show the calendar, reports, and mobile-responsive layout.

## 2:25 to 2:55: Supabase Evidence

- Open Supabase Table Editor.
- Show the submitted profile or task row.
- Point out the matching user ID and saved status.
- Do not reveal API keys or access tokens.

## 2:55 to 3:35: Architecture and Security

- React provides the interface.
- FastAPI validates requests and handles application logic.
- Supabase Auth and PostgreSQL persist user-specific data.
- Vercel hosts the frontend and Python serverless API.
- Show Vercel environment variable names, but keep values concealed.

## 3:35 to 4:15: Prompt Appendix

- Open `docs/PROMPTS.md`.
- Briefly show the main build, redesign, responsive, security, and deployment
  prompts.
- Explain that prompts are grouped by development stage for review.

## 4:15 to 5:00: GitHub Walkthrough

- Show the public repository and recent commit history.
- Point out `src/`, `backend/`, `api/`, `supabase/`, and `docs/`.
- Open `.gitignore` and confirm credentials, dependencies, builds, caches, and
  logs are excluded.
- Finish on the README architecture summary.
