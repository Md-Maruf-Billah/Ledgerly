"""
Thin PostgREST client using httpx + the user's own JWT.

Why not supabase-py admin client?
  The admin client sends sb_secret_ keys as `Authorization: Bearer <key>`.
  New Supabase projects issue opaque keys that are NOT JWTs, so Supabase
  rejects them in the Bearer header.  Using the user's own JWT instead:
    - Works with every key format (user JWTs are always real JWTs)
    - RLS policies enforce data isolation (users only see their own rows)
    - No service-role key needed for user-scoped operations
"""

import httpx
from app.config import settings


def _url(table: str) -> str:
    return f"{settings.SUPABASE_URL}/rest/v1/{table}"


def _headers(token: str, prefer: str | None = None) -> dict:
    h = {
        "apikey": settings.SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    if prefer:
        h["Prefer"] = prefer
    return h


async def select(table: str, token: str, params: dict | None = None) -> list:
    async with httpx.AsyncClient(timeout=15.0) as c:
        r = await c.get(_url(table), params=params, headers=_headers(token))
    r.raise_for_status()
    data = r.json()
    return data if isinstance(data, list) else []


async def insert(table: str, token: str, data: dict | list) -> list:
    async with httpx.AsyncClient(timeout=15.0) as c:
        r = await c.post(
            _url(table), json=data,
            headers=_headers(token, "return=representation"),
        )
    r.raise_for_status()
    result = r.json()
    return result if isinstance(result, list) else [result]


async def upsert(table: str, token: str, data: dict | list) -> list:
    """Insert or update on conflict (uses table's unique constraint)."""
    async with httpx.AsyncClient(timeout=15.0) as c:
        r = await c.post(
            _url(table), json=data,
            headers=_headers(token, "return=representation,resolution=merge-duplicates"),
        )
    r.raise_for_status()
    result = r.json()
    return result if isinstance(result, list) else [result]


async def update(table: str, token: str, data: dict, params: dict | None = None) -> list:
    async with httpx.AsyncClient(timeout=15.0) as c:
        r = await c.patch(
            _url(table), json=data, params=params,
            headers=_headers(token, "return=representation"),
        )
    r.raise_for_status()
    result = r.json()
    return result if isinstance(result, list) else [result]


async def delete(table: str, token: str, params: dict | None = None) -> None:
    async with httpx.AsyncClient(timeout=15.0) as c:
        await c.delete(_url(table), params=params, headers=_headers(token))
