from pydantic import BaseModel
from typing import Any, List


class NotificationResponse(BaseModel):
    message: str
    data: Any = None


class NotificationListResponse(BaseModel):
    message: str
    data: List[Any] = []
