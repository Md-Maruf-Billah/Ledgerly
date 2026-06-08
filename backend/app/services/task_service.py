from datetime import datetime, timezone, date as dt_date
from app.services.supabase_client import get_admin_client


def _compute_status(due_date_str: str) -> str:
    try:
        due = dt_date.fromisoformat(due_date_str)
        diff = (due - datetime.now(timezone.utc).date()).days
        if diff < 0:
            return "overdue"
        if diff <= 14:
            return "due-soon"
        return "upcoming"
    except Exception:
        return "upcoming"


async def get_tasks(user_id: str) -> list:
    client = get_admin_client()
    result = (
        client.table("tasks")
        .select("*")
        .eq("user_id", user_id)
        .order("due_date")
        .execute()
    )
    tasks = result.data or []
    # Recompute status for non-completed tasks
    for t in tasks:
        if t["status"] != "completed":
            t["status"] = _compute_status(t["due_date"])
    return tasks


async def seed_tasks(user_id: str, task_list: list) -> list:
    """
    Called after onboarding — inserts all business-type tasks for the user.
    task_list items come from the frontend tasks.js format:
      { name, description, dueDate, steps: [str, ...] }
    """
    client = get_admin_client()
    rows = [
        {
            "user_id": user_id,
            "name": t["name"],
            "description": t.get("description", ""),
            "due_date": t["dueDate"],
            "status": _compute_status(t["dueDate"]),
            "steps": [{"label": s, "done": False} for s in t.get("steps", [])],
            "is_custom": False,
            "priority": "medium",
        }
        for t in task_list
    ]
    result = client.table("tasks").insert(rows).execute()
    return result.data or []


async def create_task(user_id: str, data: dict) -> dict:
    client = get_admin_client()
    due = data["due_date"]
    row = {
        "user_id": user_id,
        "name": data["name"],
        "description": data.get("notes") or data.get("description") or "",
        "due_date": due,
        "status": _compute_status(due),
        "steps": [{"label": s, "done": False} for s in data.get("steps", ["Review requirements", "Complete the action", "Confirm and file"])],
        "is_custom": True,
        "priority": data.get("priority", "medium"),
    }
    result = client.table("tasks").insert(row).execute()
    return result.data[0]


async def mark_task_done(user_id: str, task_id: str) -> dict:
    client = get_admin_client()
    result = (
        client.table("tasks")
        .update({
            "status": "completed",
            "completed_at": datetime.now(timezone.utc).isoformat(),
        })
        .eq("id", task_id)
        .eq("user_id", user_id)
        .execute()
    )
    if not result.data:
        raise ValueError("Task not found or not owned by user.")
    return result.data[0]


async def delete_task(user_id: str, task_id: str) -> None:
    client = get_admin_client()
    client.table("tasks").delete().eq("id", task_id).eq("user_id", user_id).execute()
