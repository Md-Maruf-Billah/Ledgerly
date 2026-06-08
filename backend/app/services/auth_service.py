"""
Supabase Auth integration via direct REST API calls (httpx).

Why not the supabase-py auth client?
  The Python client sends the API key as both `apikey` header AND
  `Authorization: Bearer <key>`. New Supabase projects issue opaque
  sb_publishable_/sb_secret_ keys that are NOT JWTs — Supabase rejects
  them in the Authorization header. Calling the Auth REST API directly
  with httpx lets us control exactly which headers are sent.

  Rule: anon key goes in `apikey` header only (not Authorization).
        User JWTs go in `Authorization: Bearer <jwt>` header only.
"""

import httpx
from app.config import settings


# ── Helpers ───────────────────────────────────────────────────────────────────

def _auth_url(path: str) -> str:
    return f"{settings.SUPABASE_URL}/auth/v1{path}"


def _anon_headers() -> dict:
    """Headers for public/anon Supabase Auth calls (no user JWT)."""
    return {
        "apikey": settings.SUPABASE_ANON_KEY,
        "Content-Type": "application/json",
    }


def _user_headers(token: str) -> dict:
    """Headers for calls that validate a user's JWT."""
    return {
        **_anon_headers(),
        "Authorization": f"Bearer {token}",
    }


# ── Auth operations ───────────────────────────────────────────────────────────

async def sign_up(email: str, password: str) -> dict:
    async with httpx.AsyncClient(timeout=15.0) as client:
        res = await client.post(
            _auth_url("/signup"),
            json={"email": email, "password": password},
            headers=_anon_headers(),
        )

    data = res.json()

    if res.status_code not in (200, 201):
        msg = (
            data.get("msg")
            or data.get("message")
            or data.get("error_description")
            or "Sign-up failed."
        )
        raise ValueError(msg)

    user = data.get("user")
    if not user:
        raise ValueError("Sign-up failed — user not created.")

    session = data.get("session")

    if session and session.get("access_token"):
        # Email confirmation is OFF — Supabase returned a session immediately.
        from app.services.supabase_client import get_admin_client
        admin = get_admin_client()
        profile = (
            admin.table("business_profiles")
            .select("id")
            .eq("user_id", user["id"])
            .maybe_single()
            .execute()
        )
        return {
            "user_id": user["id"],
            "email": user["email"],
            "access_token": session["access_token"],
            "refresh_token": session.get("refresh_token"),
            "is_new_user": profile.data is None,
        }

    # Email confirmation is ON — no session yet. Try immediate sign-in.
    try:
        return await sign_in(email, password)
    except Exception:
        raise ValueError(
            "Account created — please check your email and click the confirmation "
            "link, then come back and sign in."
        )


async def sign_in(email: str, password: str) -> dict:
    async with httpx.AsyncClient(timeout=15.0) as client:
        res = await client.post(
            _auth_url("/token?grant_type=password"),
            json={"email": email, "password": password},
            headers=_anon_headers(),
        )

    data = res.json()

    if res.status_code != 200:
        raise ValueError("Invalid email or password.")

    access_token = data.get("access_token")
    if not access_token:
        raise ValueError("Invalid email or password.")

    user = data.get("user", {})
    user_id = user.get("id")

    from app.services.supabase_client import get_admin_client
    admin = get_admin_client()
    profile = (
        admin.table("business_profiles")
        .select("id")
        .eq("user_id", user_id)
        .maybe_single()
        .execute()
    )

    return {
        "user_id": user_id,
        "email": user.get("email"),
        "access_token": access_token,
        "refresh_token": data.get("refresh_token"),
        "is_new_user": profile.data is None,
    }


async def sign_out(token: str) -> None:
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            await client.post(
                _auth_url("/logout"),
                headers=_user_headers(token),
            )
    except Exception:
        pass  # Best-effort — client state is cleared regardless


async def get_session_user(token: str) -> dict | None:
    """Validate a user JWT and return basic user info, or None if invalid."""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.get(
                _auth_url("/user"),
                headers=_user_headers(token),
            )
        if res.status_code != 200:
            return None
        data = res.json()
        return {"user_id": data.get("id"), "email": data.get("email")}
    except Exception:
        return None
