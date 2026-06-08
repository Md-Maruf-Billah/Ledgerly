from fastapi import APIRouter
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse, TaskListResponse

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


@router.get("/{user_id}", response_model=TaskListResponse)
async def list_tasks(user_id: str):
    """
    INTEGRATION POINT — Fetch all tasks for user
    Supabase table: tasks, filtered by user_id
    Returns tasks with real-time status computation.
    """
    return TaskListResponse(message="Task list placeholder", data=[])


@router.post("/{user_id}", response_model=TaskResponse)
async def create_task(user_id: str, payload: TaskCreate):
    """
    INTEGRATION POINT — Create custom task (from CustomTaskModal)
    Supabase table: tasks, is_custom=True
    """
    return TaskResponse(message="Task create placeholder", data=payload.model_dump())


@router.put("/{user_id}/{task_id}", response_model=TaskResponse)
async def update_task(user_id: str, task_id: str, payload: TaskUpdate):
    """
    INTEGRATION POINT — Update task (mark done, update steps)
    Triggered by TaskDetailPanel "Mark as Done" button.
    Supabase table: tasks, set status='completed', completed_at=now()
    """
    return TaskResponse(message="Task update placeholder", data=payload.model_dump())


@router.delete("/{user_id}/{task_id}", response_model=TaskResponse)
async def delete_task(user_id: str, task_id: str):
    """
    INTEGRATION POINT — Delete a custom task
    Supabase table: tasks, soft-delete or hard-delete by id
    """
    return TaskResponse(message="Task delete placeholder", data=None)
