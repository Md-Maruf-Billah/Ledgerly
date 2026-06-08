import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.middleware import RequestIDMiddleware, SecurityHeadersMiddleware
from app.routes import auth, tasks, profiles, notifications

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s — %(message)s",
)

app = FastAPI(
    title="Ledgerly API",
    description="Backend API for the Ledgerly compliance calendar app.",
    version="0.3.0",
    # Hide schema endpoints in production to reduce attack surface
    docs_url="/docs" if settings.APP_ENV != "production" else None,
    redoc_url="/redoc" if settings.APP_ENV != "production" else None,
)

# ── Middleware (outermost first) ──────────────────────────────────────────────
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RequestIDMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
)

# ── Global exception handler — never expose stack traces ──────────────────────
@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger = logging.getLogger("ledgerly.error")
    rid = getattr(request.state, "request_id", "-")
    logger.exception("Unhandled error rid=%s path=%s", rid, request.url.path)
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred. Please try again."},
        headers={"X-Request-ID": rid},
    )

# ── Routes ────────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(profiles.router)
app.include_router(notifications.router)
app.include_router(tasks.router)


@app.get("/health", tags=["health"])
async def health_check():
    return {
        "status": "ok",
        "app": "Ledgerly API",
        "version": "0.3.0",
        "env": settings.APP_ENV,
        "supabase_configured": bool(settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY),
    }
