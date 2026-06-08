import re
from pydantic import BaseModel, field_validator
from typing import Any, List

VALID_STATES = {"NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"}
VALID_BUSINESS_TYPES = {
    "Sole Trader", "Retail", "Hospitality", "Trades", "Consulting", "Small Team"
}

_SAFE_TEXT = re.compile(r"^[\w\s\-'&.,()]+$", re.UNICODE)


def _safe_str(value: str, field: str, max_len: int = 100) -> str:
    value = value.strip()
    if not value:
        raise ValueError(f"{field} cannot be empty.")
    if len(value) > max_len:
        raise ValueError(f"{field} exceeds maximum length of {max_len} characters.")
    return value


class ProfileCreate(BaseModel):
    full_name: str
    business_name: str
    email: str
    state: str
    business_type: str
    tasks: List[Any] = []

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, v: str) -> str:
        return _safe_str(v, "Full name", 100)

    @field_validator("business_name")
    @classmethod
    def validate_business_name(cls, v: str) -> str:
        return _safe_str(v, "Business name", 120)

    @field_validator("state")
    @classmethod
    def validate_state(cls, v: str) -> str:
        v = v.strip().upper()
        if v not in VALID_STATES:
            raise ValueError(f"Invalid Australian state: {v}")
        return v

    @field_validator("business_type")
    @classmethod
    def validate_business_type(cls, v: str) -> str:
        v = v.strip()
        if v not in VALID_BUSINESS_TYPES:
            raise ValueError(f"Invalid business type: {v}")
        return v

    @field_validator("tasks")
    @classmethod
    def cap_task_list(cls, v: List[Any]) -> List[Any]:
        if len(v) > 20:
            raise ValueError("Task list cannot exceed 20 items.")
        return v


class ProfileUpdateRequest(BaseModel):
    full_name: str | None = None
    business_name: str | None = None
    state: str | None = None

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, v: str | None) -> str | None:
        if v is not None:
            return _safe_str(v, "Full name", 100)
        return v

    @field_validator("business_name")
    @classmethod
    def validate_business_name(cls, v: str | None) -> str | None:
        if v is not None:
            return _safe_str(v, "Business name", 120)
        return v

    @field_validator("state")
    @classmethod
    def validate_state(cls, v: str | None) -> str | None:
        if v is not None:
            v = v.strip().upper()
            if v not in VALID_STATES:
                raise ValueError(f"Invalid Australian state: {v}")
        return v


class ProfileResponse(BaseModel):
    message: str
    profile: Any = None
    tasks: List[Any] = []
    notifications: List[Any] = []
