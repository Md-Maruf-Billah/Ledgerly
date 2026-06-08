from fastapi import APIRouter
from app.schemas.profile import ProfileCreate, ProfileResponse

router = APIRouter(prefix="/api/profile", tags=["profile"])


@router.post("", response_model=ProfileResponse)
async def create_profile(payload: ProfileCreate):
    """
    INTEGRATION POINT — Save onboarding profile
    Triggered after BusinessProfileForm + BusinessTypeSelector completion.
    Supabase table: business_profiles
    """
    return ProfileResponse(
        message="Profile save placeholder",
        data=payload.model_dump(),
    )


@router.get("/{user_id}", response_model=ProfileResponse)
async def get_profile(user_id: str):
    """
    INTEGRATION POINT — Fetch profile for authenticated user
    Supabase table: business_profiles, filtered by user_id
    """
    return ProfileResponse(
        message="Profile fetch placeholder",
        data=None,
    )


@router.put("/{user_id}", response_model=ProfileResponse)
async def update_profile(user_id: str, payload: ProfileCreate):
    """
    INTEGRATION POINT — Update profile (from SettingsScreen)
    Supabase table: business_profiles
    """
    return ProfileResponse(
        message="Profile update placeholder",
        data=payload.model_dump(),
    )
