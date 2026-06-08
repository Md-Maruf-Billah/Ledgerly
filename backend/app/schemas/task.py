from pydantic import BaseModel
from typing import Any, List
from datetime import date


class TaskCreate(BaseModel):
    name: str
    description: str | None = None
    due_date: date
    priority: str = "medium"  # high | medium | low
    notes: str | None = None
    steps: List[str] = []
    is_custom: bool = True


class TaskUpdate(BaseModel):
    status: str | None = None  # overdue | due-soon | upcoming | completed
    steps_completed: List[str] | None = None
    completed_at: str | None = None


class TaskResponse(BaseModel):
    message: str
    data: Any = None


class TaskListResponse(BaseModel):
    message: str
    data: List[Any] = []
