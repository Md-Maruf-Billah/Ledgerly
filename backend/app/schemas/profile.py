from pydantic import BaseModel
from typing import Any, List


class ProfileCreate(BaseModel):
    full_name: str
    business_name: str
    email: str
    state: str
    business_type: str
    tasks: List[Any] = []  # Frontend sends seed tasks at onboarding time


class ProfileResponse(BaseModel):
    message: str
    profile: Any = None
    tasks: List[Any] = []
    notifications: List[Any] = []


class ProfileUpdateRequest(BaseModel):
    full_name: str | None = None
    business_name: str | None = None
    state: str | None = None
