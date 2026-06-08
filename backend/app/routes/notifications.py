from fastapi import APIRouter, Depends
from app.schemas.notification import NotificationListResponse, NotificationResponse
from app.services import notification_service
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@router.get("", response_model=NotificationListResponse)
async def list_notifications(user: dict = Depends(get_current_user)):
    notifs = await notification_service.get_notifications(user["user_id"], user["token"])
    return NotificationListResponse(message="ok", data=notifs)


@router.put("/{notif_id}/read", response_model=NotificationResponse)
async def mark_read(notif_id: str, user: dict = Depends(get_current_user)):
    result = await notification_service.mark_notification_read(
        user["user_id"], notif_id, user["token"]
    )
    return NotificationResponse(message="Marked as read.", data=result)


@router.put("/read-all", response_model=NotificationResponse)
async def mark_all_read(user: dict = Depends(get_current_user)):
    await notification_service.mark_all_read(user["user_id"], user["token"])
    return NotificationResponse(message="All notifications marked as read.")
