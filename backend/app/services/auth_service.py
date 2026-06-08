from app.services.supabase_client import get_anon_client, get_admin_client


async def sign_up(email: str, password: str) -> dict:
    client = get_anon_client()
    result = client.auth.sign_up({"email": email, "password": password})
    if result.user is None:
        raise ValueError("Sign-up failed — user not created.")
    session = result.session
    return {
        "user_id": result.user.id,
        "email": result.user.email,
        "access_token": session.access_token if session else None,
        "refresh_token": session.refresh_token if session else None,
        "is_new_user": True,
    }


async def sign_in(email: str, password: str) -> dict:
    client = get_anon_client()
    result = client.auth.sign_in_with_password({"email": email, "password": password})
    if result.user is None or result.session is None:
        raise ValueError("Invalid email or password.")

    # Check if this user has completed onboarding
    admin = get_admin_client()
    profile = admin.table("business_profiles").select("id").eq("user_id", result.user.id).maybe_single().execute()
    is_new_user = profile.data is None

    return {
        "user_id": result.user.id,
        "email": result.user.email,
        "access_token": result.session.access_token,
        "refresh_token": result.session.refresh_token,
        "is_new_user": is_new_user,
    }


async def sign_out(token: str) -> None:
    client = get_anon_client()
    client.auth.sign_out()


async def get_session_user(token: str) -> dict | None:
    """Validate a stored token and return the user, or None if expired."""
    try:
        client = get_anon_client()
        result = client.auth.get_user(token)
        if result and result.user:
            return {"user_id": result.user.id, "email": result.user.email}
        return None
    except Exception:
        return None
