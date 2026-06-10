import uuid
import logging
import time

from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request

logger = logging.getLogger("ledgerly.access")


class RequestIDMiddleware(BaseHTTPMiddleware):
    """Attaches a UUID to every request so frontend and backend logs correlate."""

    async def dispatch(self, request: Request, call_next):
        request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
        request.state.request_id = request_id
        start = time.perf_counter()

        response = await call_next(request)

        duration_ms = round((time.perf_counter() - start) * 1000)
        logger.info(
            "%s %s %s %dms rid=%s",
            request.method,
            request.url.path,
            response.status_code,
            duration_ms,
            request_id,
        )
        response.headers["X-Request-ID"] = request_id
        return response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Adds defence-in-depth HTTP security headers to every response.
    These do not replace backend auth; they reduce browser-level attack surface.
    """

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), camera=(), microphone=()"
        # CSP: allow same-origin scripts only; adjust if CDN assets are added later
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline'; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com; "
            "img-src 'self' data: https://picsum.photos; "
            "connect-src 'self'"
        )
        return response
