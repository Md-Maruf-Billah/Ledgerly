import re
from datetime import date, timedelta
from pydantic import BaseModel, field_validator
from typing import Any, List

_TASK_NAME_RE = re.compile(r"^[\w\s\-'&.,()/:]+$", re.UNICODE)


class TaskCreate(BaseModel):
    name: str
    due_date: str
    priority: str = "medium"
    notes: str | None = None
    description: str | None = None
    steps: List[str] = []

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Task name cannot be empty.")
        if len(v) > 200:
            raise ValueError("Task name exceeds 200 characters.")
        return v

    @field_validator("due_date")
    @classmethod
    def validate_due_date(cls, v: str) -> str:
        try:
            parsed = date.fromisoformat(v)
        except ValueError:
            raise ValueError("due_date must be a valid ISO date string (YYYY-MM-DD).")
        today = date.today()
        if parsed < today - timedelta(days=365 * 2):
            raise ValueError("due_date cannot be more than 2 years in the past.")
        if parsed > today + timedelta(days=365 * 5):
            raise ValueError("due_date cannot be more than 5 years in the future.")
        return v

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, v: str) -> str:
        if v not in {"high", "medium", "low"}:
            raise ValueError("priority must be high, medium, or low.")
        return v

    @field_validator("notes")
    @classmethod
    def cap_notes(cls, v: str | None) -> str | None:
        if v and len(v) > 1000:
            raise ValueError("Notes exceed 1000 characters.")
        return v

    @field_validator("steps")
    @classmethod
    def validate_steps(cls, v: List[str]) -> List[str]:
        if len(v) > 10:
            raise ValueError("A task cannot have more than 10 steps.")
        sanitised = []
        for step in v:
            step = step.strip()
            if len(step) > 300:
                raise ValueError("Each step cannot exceed 300 characters.")
            sanitised.append(step)
        return sanitised


class TaskDoneResponse(BaseModel):
    message: str
    task: Any = None
    notification: Any = None


class TaskResponse(BaseModel):
    message: str
    data: Any = None


class TaskListResponse(BaseModel):
    message: str
    data: List[Any] = []
