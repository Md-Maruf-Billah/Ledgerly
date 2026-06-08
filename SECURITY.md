# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| 0.3.x (current) | ✅ |
| < 0.3 | ❌ |

## Security Architecture

Ledgerly implements a layered security model — every trust boundary has its own defence.

### Layered Defence Overview

```
Browser
  └── Output sanitisation (stripTags on all user strings)
  └── React ErrorBoundary (no stack traces exposed)
  └── 401 auto-logout (expired tokens never silently fail)
  └── Client-side input validation (belt-and-suspenders before server)

FastAPI
  └── JWT validation on every protected endpoint (Supabase auth.get_user)
  └── All DB queries scoped by user_id from token (no client-supplied IDs)
  └── Pydantic field validators (length, format, enum, range)
  └── Generic error messages on auth failure (prevents email enumeration)
  └── Security response headers on every response
  └── Global exception handler (no stack traces in 500 responses)
  └── CORS restricted to specific origins, methods, and headers

Supabase (PostgreSQL)
  └── Row Level Security: auth.uid() = user_id on all tables
  └── Service role key backend-only (never in frontend code or .env.local)
  └── Parameterised queries via Supabase SDK (no raw SQL interpolation)
```

### Security Headers

Every API response includes:

| Header | Value | Purpose |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `X-XSS-Protection` | `1; mode=block` | Legacy XSS filter |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limit referrer leakage |
| `Permissions-Policy` | `geolocation=(), camera=(), microphone=()` | Disable unused browser APIs |
| `Content-Security-Policy` | `default-src 'self'; ...` | Restrict resource origins |
| `X-Request-ID` | UUID per request | Correlate frontend errors with backend logs |

### Credentials and Secrets

- `SUPABASE_SERVICE_ROLE_KEY` is **never** present in frontend code, `.env.local`, or any committed file
- All `.env` files are listed in `.gitignore` and excluded from version control
- `.env.example` files contain only placeholder values — never real keys

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please:

1. **Do not** open a public GitHub issue
2. Email the maintainer directly with:
   - A description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Any suggested mitigations

You will receive an acknowledgement within 48 hours.
