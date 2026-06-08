from fastapi import APIRouter
from app.schemas.notification import NotificationListResponse, NotificationResponse

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@router.get("/{user_id}", response_model=NotificationListResponse)
async def list_notifications(user_id: str):
    """
    INTEGRATION POINT — Fetch notifications for user
    Supabase table: notifications, filtered by user_id, ordered by created_at DESC
    """
    return NotificationListResponse(message="Notifications placeholder", data=[])


@router.put("/{user_id}/{notif_id}/read", response_model=NotificationResponse)
async def mark_read(user_id: str, notif_id: str):
    """
    INTEGRATION POINT — Mark single notification as read
    Supabase table: notifications, set is_read=True where id=notif_id
    """
    return NotificationResponse(message="Mark read placeholder", data=None)


@router.put("/{user_id}/read-all", response_model=NotificationResponse)
async def mark_all_read(user_id: str):
    """
    INTEGRATION POINT — Mark all notifications as read
    Supabase table: notifications, set is_read=True where user_id=user_id
    """
    return NotificationResponse(message="Mark all read placeholder", data=None)
