from app.services import db


async def get_notifications(user_id: str, token: str) -> list:
    return await db.select("notifications", token, {
        "select": "*",
        "user_id": f"eq.{user_id}",
        "order": "created_at.desc",
    })


async def create_notifications_for_tasks(
    user_id: str, tasks: list, business_name: str, token: str
) -> list:
    rows = []
    for t in tasks:
        if t.get("status") == "overdue":
            rows.append({
                "user_id": user_id, "task_id": t["id"], "type": "overdue",
                "title": f"{t['name']} is overdue",
                "body": f"Due {t['due_date']}. Review this obligation first.",
                "is_read": False,
            })
        elif t.get("status") == "due-soon":
            rows.append({
                "user_id": user_id, "task_id": t["id"], "type": "upcoming",
                "title": f"{t['name']} due soon",
                "body": f"Due {t['due_date']}. Schedule time to complete this.",
                "is_read": False,
            })
    rows.append({
        "user_id": user_id, "task_id": None, "type": "system",
        "title": "Compliance calendar generated",
        "body": f"{len(tasks)} obligations loaded for {business_name}.",
        "is_read": False,
    })
    if not rows:
        return []
    return await db.insert("notifications", token, rows)


async def create_completion_notification(
    user_id: str, task_id: str, task_name: str, token: str
) -> dict:
    rows = await db.insert("notifications", token, {
        "user_id": user_id, "task_id": task_id, "type": "completed",
        "title": f"{task_name} marked complete",
        "body": "Great work. It remains visible in your timeline and calendar.",
        "is_read": False,
    })
    return rows[0]


async def mark_notification_read(user_id: str, notif_id: str, token: str) -> dict:
    rows = await db.update("notifications", token, {"is_read": True}, {
        "id": f"eq.{notif_id}",
        "user_id": f"eq.{user_id}",
    })
    return rows[0] if rows else {}


async def mark_all_read(user_id: str, token: str) -> None:
    await db.update("notifications", token, {"is_read": True}, {
        "user_id": f"eq.{user_id}",
    })
