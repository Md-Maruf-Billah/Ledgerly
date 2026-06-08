from pydantic import BaseModel
from typing import Any, List


class TaskCreate(BaseModel):
    name: str
    due_date: str          # ISO date string, e.g. "2026-07-15"
    priority: str = "medium"
    notes: str | None = None
    description: str | None = None
    steps: List[str] = []


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
