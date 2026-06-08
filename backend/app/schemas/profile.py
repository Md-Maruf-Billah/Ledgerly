from pydantic import BaseModel
from typing import Any


BUSINESS_TYPES = [
    "Sole Trader",
    "Retail",
    "Hospitality",
    "Trades",
    "Consulting",
    "Small Team",
]

AUSTRALIAN_STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"]


class ProfileCreate(BaseModel):
    user_id: str | None = None
    full_name: str
    business_name: str
    email: str
    state: str
    business_type: str


class ProfileResponse(BaseModel):
    message: str
    data: Any = None
