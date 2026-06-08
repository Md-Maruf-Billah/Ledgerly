from fastapi import Header, HTTPException, status
from app.services.auth_service import get_session_user


async def get_current_user(authorization: str = Header(...)) -> dict:
    """
    Validates the Supabase JWT from the Authorization: Bearer <token> header.
    Uses direct httpx call to Supabase Auth REST API — does not use the
    supabase-py client which incorrectly sends the anon key as a Bearer token.
    Returns {"user_id": str, "email": str, "token": str} on success.
    Raises 401 if token is missing, malformed, or expired.
    """
    exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired authentication token.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        scheme, token = authorization.strip().split(" ", 1)
        if scheme.lower() != "bearer" or not token:
            raise exc
    except ValueError:
        raise exc

    user = await get_session_user(token)
    if user is None:
        raise exc

    return {**user, "token": token}
