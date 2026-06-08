from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.auth import LoginRequest, RegisterRequest, AuthResponse, SessionResponse
from app.services import auth_service
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=AuthResponse)
async def register(payload: RegisterRequest):
    try:
        result = await auth_service.sign_up(payload.email, payload.password)
        return AuthResponse(
            message="Account created successfully.",
            **result,
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest):
    try:
        result = await auth_service.sign_in(payload.email, payload.password)
        return AuthResponse(
            message="Signed in successfully.",
            **result,
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.post("/logout")
async def logout(user: dict = Depends(get_current_user)):
    await auth_service.sign_out(user["token"])
    return {"message": "Signed out successfully."}


@router.get("/me", response_model=SessionResponse)
async def get_me(user: dict = Depends(get_current_user)):
    """Validate a stored token and return basic user info + whether onboarding is done."""
    from app.services.supabase_client import get_admin_client
    client = get_admin_client()
    profile = (
        client.table("business_profiles")
        .select("id")
        .eq("user_id", user["user_id"])
        .maybe_single()
        .execute()
    )
    return SessionResponse(
        user_id=user["user_id"],
        email=user["email"],
        has_profile=profile.data is not None,
    )
