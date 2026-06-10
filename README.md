# Ledgerly

Ledgerly is a responsive compliance planner for Australian sole traders and micro-businesses. It organises BAS, PAYG, superannuation, renewals, and tax obligations into a clear dashboard, calendar, and guided task workflow.

**Repository:** Public, so the project structure and commit history can be reviewed for assessment.

## Tech Stack

- React 19 and Vite
- FastAPI and Python
- Supabase authentication and database
- Responsive custom CSS design system

## Repository Structure

```text
ledgerly/
|-- src/          React screens, components, data, utilities, and styles
|-- public/       Logo assets and self-hosted fonts
|-- backend/      FastAPI routes, schemas, services, and configuration
|-- api/          Vercel serverless API entry point
|-- supabase/     Database schema and Row Level Security policies
|-- docs/         Product brief and design system documentation
|-- .gitignore    Excludes secrets, dependencies, builds, caches, and logs
|-- package.json  Frontend dependencies and scripts
`-- vercel.json   Deployment configuration
```

## Run Locally

```bash
npm install
npm run dev
```

The app includes a demo workspace, so it can be explored without creating an account.

## Repository Hygiene

The `.gitignore` keeps local-only files out of GitHub, including:

- `.env` and `.env.local`
- `backend/.env`
- `node_modules/`
- `dist/`
- Python virtual environments and `__pycache__/`
- Editor files and development logs

Safe templates such as `.env.example` and `backend/.env.example` are committed instead.

## 45-Second Video Walkthrough

> This is the public GitHub repository for Ledgerly. The project is organised by responsibility: `src` contains the React frontend, `public` contains the shipped assets, `backend` contains the FastAPI application, and `supabase` contains the database schema. The `docs` folder records the product and design decisions, while the root configuration files manage dependencies and deployment. The `.gitignore` excludes environment secrets, dependencies, build output, Python caches, and local logs. The full project and its development history are committed here on the `master` branch.

## License

[MIT](LICENSE)
