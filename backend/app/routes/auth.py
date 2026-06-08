from fastapi import APIRouter
from app.schemas.auth import LoginRequest, RegisterRequest, AuthResponse

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=AuthResponse)
async def register(payload: RegisterRequest):
    """
    INTEGRATION POINT — Registration
    Replace placeholder with Supabase Auth sign-up call.
    Example:
        from supabase import create_client
        client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
        result = client.auth.sign_up({"email": payload.email, "password": payload.password})
    """
    return AuthResponse(message="Registration placeholder — Supabase not yet connected")


@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest):
    """
    INTEGRATION POINT — Login
    Replace placeholder with Supabase Auth sign-in call.
    """
    return AuthResponse(message="Login placeholder — Supabase not yet connected")


@router.post("/logout", response_model=AuthResponse)
async def logout():
    """
    INTEGRATION POINT — Logout
    Replace placeholder with Supabase Auth sign-out call.
    """
    return AuthResponse(message="Logout placeholder — Supabase not yet connected")
