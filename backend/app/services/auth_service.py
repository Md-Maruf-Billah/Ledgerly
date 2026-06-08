"""
Supabase Auth via direct httpx REST calls + PostgREST profile check.
See db.py for why supabase-py is not used for database operations.
"""

import httpx
from app.config import settings


def _auth_url(path: str) -> str:
    return f"{settings.SUPABASE_URL}/auth/v1{path}"


def _anon_headers() -> dict:
    return {
        "apikey": settings.SUPABASE_ANON_KEY,
        "Content-Type": "application/json",
    }


def _user_headers(token: str) -> dict:
    return {**_anon_headers(), "Authorization": f"Bearer {token}"}


async def _has_profile(user_id: str, token: str) -> bool:
    """Check for a business profile using the user's own JWT (respects RLS)."""
    try:
        async with httpx.AsyncClient(timeout=10.0) as c:
            r = await c.get(
                f"{settings.SUPABASE_URL}/rest/v1/business_profiles",
                params={"select": "id", "user_id": f"eq.{user_id}", "limit": "1"},
                headers={
                    "apikey": settings.SUPABASE_ANON_KEY,
                    "Authorization": f"Bearer {token}",
                    "Accept": "application/json",
                },
            )
        return r.status_code == 200 and len(r.json()) > 0
    except Exception:
        return False


async def sign_up(email: str, password: str) -> dict:
    async with httpx.AsyncClient(timeout=15.0) as c:
        res = await c.post(
            _auth_url("/signup"),
            json={"email": email, "password": password},
            headers=_anon_headers(),
        )

    data = res.json()

    if res.status_code not in (200, 201):
        msg = (
            data.get("msg") or data.get("message")
            or data.get("error_description") or "Sign-up failed."
        )
        raise ValueError(msg)

    user = data.get("user")
    if not user:
        raise ValueError("Sign-up failed — user not created.")

    session = data.get("session")

    if session and session.get("access_token"):
        # Email confirmation OFF → session returned immediately.
        token = session["access_token"]
        return {
            "user_id": user["id"],
            "email": user["email"],
            "access_token": token,
            "refresh_token": session.get("refresh_token"),
            "is_new_user": not await _has_profile(user["id"], token),
        }

    # Email confirmation ON → no session yet. Try immediate sign-in.
    try:
        return await sign_in(email, password)
    except Exception:
        raise ValueError(
            "Account created — please check your email and click the "
            "confirmation link, then come back and sign in."
        )


async def sign_in(email: str, password: str) -> dict:
    async with httpx.AsyncClient(timeout=15.0) as c:
        res = await c.post(
            _auth_url("/token?grant_type=password"),
            json={"email": email, "password": password},
            headers=_anon_headers(),
        )

    data = res.json()

    if res.status_code != 200:
        raise ValueError("Invalid email or password.")

    token = data.get("access_token")
    if not token:
        raise ValueError("Invalid email or password.")

    user = data.get("user", {})
    user_id = user.get("id")

    return {
        "user_id": user_id,
        "email": user.get("email"),
        "access_token": token,
        "refresh_token": data.get("refresh_token"),
        "is_new_user": not await _has_profile(user_id, token),
    }


async def sign_out(token: str) -> None:
    try:
        async with httpx.AsyncClient(timeout=10.0) as c:
            await c.post(_auth_url("/logout"), headers=_user_headers(token))
    except Exception:
        pass


async def get_session_user(token: str) -> dict | None:
    try:
        async with httpx.AsyncClient(timeout=10.0) as c:
            res = await c.get(_auth_url("/user"), headers=_user_headers(token))
        if res.status_code != 200:
            return None
        data = res.json()
        return {"user_id": data.get("id"), "email": data.get("email")}
    except Exception:
        return None
