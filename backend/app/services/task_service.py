from datetime import datetime, timezone, date as dt_date
from app.services import db


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


async def get_tasks(user_id: str, token: str) -> list:
    tasks = await db.select("tasks", token, {
        "select": "*",
        "user_id": f"eq.{user_id}",
        "order": "due_date",
    })
    for t in tasks:
        if t.get("status") != "completed":
            t["status"] = _compute_status(t["due_date"])
    return tasks


async def seed_tasks(user_id: str, task_list: list, token: str) -> list:
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
    return await db.insert("tasks", token, rows)


async def create_task(user_id: str, data: dict, token: str) -> dict:
    due = data["due_date"]
    row = {
        "user_id": user_id,
        "name": data["name"],
        "description": data.get("notes") or data.get("description") or "",
        "due_date": due,
        "status": _compute_status(due),
        "steps": [{"label": s, "done": False} for s in data.get("steps", [
            "Review requirements", "Complete the action", "Confirm and file"
        ])],
        "is_custom": True,
        "priority": data.get("priority", "medium"),
    }
    rows = await db.insert("tasks", token, row)
    return rows[0]


async def mark_task_done(user_id: str, task_id: str, token: str) -> dict:
    rows = await db.update("tasks", token, {
        "status": "completed",
        "completed_at": datetime.now(timezone.utc).isoformat(),
    }, {
        "id": f"eq.{task_id}",
        "user_id": f"eq.{user_id}",
    })
    if not rows:
        raise ValueError("Task not found or not owned by user.")
    return rows[0]


async def delete_task(user_id: str, task_id: str, token: str) -> None:
    await db.delete("tasks", token, {
        "id": f"eq.{task_id}",
        "user_id": f"eq.{user_id}",
    })
