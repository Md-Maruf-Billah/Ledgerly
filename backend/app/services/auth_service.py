"""
Auth service — placeholder for Supabase Auth integration.

SUPABASE INTEGRATION:
    from supabase import create_client
    from app.config import settings

    _client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

    async def sign_up(email, password, full_name):
        result = _client.auth.sign_up({"email": email, "password": password})
        # Also insert row into users/profiles table
        return result

    async def sign_in(email, password):
        result = _client.auth.sign_in_with_password({"email": email, "password": password})
        return result
"""


async def sign_up(email: str, password: str, full_name: str) -> dict:
    raise NotImplementedError("Supabase Auth not yet connected")


async def sign_in(email: str, password: str) -> dict:
    raise NotImplementedError("Supabase Auth not yet connected")


async def sign_out(access_token: str) -> None:
    raise NotImplementedError("Supabase Auth not yet connected")
