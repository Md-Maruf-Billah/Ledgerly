from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.profile import ProfileCreate, ProfileResponse, ProfileUpdateRequest
from app.services import profile_service, task_service, notification_service
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/profile", tags=["profile"])


@router.post("", response_model=ProfileResponse)
async def create_profile(payload: ProfileCreate, user: dict = Depends(get_current_user)):
    """
    Called once at the end of onboarding (BusinessTypeSelector).
    Saves profile, seeds compliance tasks, and generates initial notifications.
    """
    try:
        profile = await profile_service.save_profile(user["user_id"], {
            "full_name": payload.full_name,
            "business_name": payload.business_name,
            "email": payload.email,
            "state": payload.state,
            "business_type": payload.business_type,
        })

        tasks = []
        notifications = []

        if payload.tasks:
            tasks = await task_service.seed_tasks(user["user_id"], payload.tasks)
            notifications = await notification_service.create_notifications_for_tasks(
                user["user_id"], tasks, payload.business_name
            )

        return ProfileResponse(
            message="Profile saved and calendar built.",
            profile=profile,
            tasks=tasks,
            notifications=notifications,
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/me", response_model=ProfileResponse)
async def get_profile(user: dict = Depends(get_current_user)):
    """Returns the user's full profile + all tasks + notifications for session restore."""
    profile = await profile_service.get_profile(user["user_id"])
    if not profile:
        return ProfileResponse(message="No profile found.", profile=None, tasks=[], notifications=[])

    tasks = await task_service.get_tasks(user["user_id"])
    notifications = await notification_service.get_notifications(user["user_id"])

    return ProfileResponse(
        message="ok",
        profile=profile,
        tasks=tasks,
        notifications=notifications,
    )


@router.put("/me", response_model=ProfileResponse)
async def update_profile(payload: ProfileUpdateRequest, user: dict = Depends(get_current_user)):
    update_data = payload.model_dump(exclude_none=True)
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update.")
    try:
        profile = await profile_service.update_profile(user["user_id"], update_data)
        return ProfileResponse(message="Profile updated.", profile=profile)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
