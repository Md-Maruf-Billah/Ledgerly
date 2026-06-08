from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.task import TaskCreate, TaskDoneResponse, TaskResponse, TaskListResponse
from app.services import task_service, notification_service
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


@router.get("", response_model=TaskListResponse)
async def list_tasks(user: dict = Depends(get_current_user)):
    tasks = await task_service.get_tasks(user["user_id"])
    return TaskListResponse(message="ok", data=tasks)


@router.post("", response_model=TaskResponse)
async def create_task(payload: TaskCreate, user: dict = Depends(get_current_user)):
    try:
        task = await task_service.create_task(user["user_id"], payload.model_dump())
        return TaskResponse(message="Task created.", data=task)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.put("/{task_id}/done", response_model=TaskDoneResponse)
async def mark_done(task_id: str, user: dict = Depends(get_current_user)):
    try:
        task = await task_service.mark_task_done(user["user_id"], task_id)
        notif = await notification_service.create_completion_notification(
            user["user_id"], task_id, task["name"]
        )
        return TaskDoneResponse(message="Task marked as done.", task=task, notification=notif)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.delete("/{task_id}", response_model=TaskResponse)
async def delete_task(task_id: str, user: dict = Depends(get_current_user)):
    await task_service.delete_task(user["user_id"], task_id)
    return TaskResponse(message="Task deleted.")
