from fastapi import Header, HTTPException, status
from app.services.supabase_client import get_anon_client


async def get_current_user(authorization: str = Header(...)) -> dict:
    """
    Validates the Supabase JWT from the Authorization: Bearer <token> header.
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

    try:
        client = get_anon_client()
        response = client.auth.get_user(token)
        if response is None or response.user is None:
            raise exc
        return {
            "user_id": response.user.id,
            "email": response.user.email,
            "token": token,
        }
    except Exception:
        raise exc
