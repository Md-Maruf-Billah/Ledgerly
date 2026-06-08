from datetime import datetime, timezone
from app.services.supabase_client import get_admin_client


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


async def get_notifications(user_id: str) -> list:
    client = get_admin_client()
    result = (
        client.table("notifications")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return result.data or []


async def create_notifications_for_tasks(user_id: str, tasks: list, business_name: str) -> list:
    """Generate initial notifications after onboarding based on task statuses."""
    client = get_admin_client()
    rows = []

    for t in tasks:
        if t["status"] == "overdue":
            rows.append({
                "user_id": user_id,
                "task_id": t["id"],
                "type": "overdue",
                "title": f"{t['name']} is overdue",
                "body": f"Due {t['due_date']}. Review this obligation first when you are ready.",
                "is_read": False,
            })
        elif t["status"] == "due-soon":
            rows.append({
                "user_id": user_id,
                "task_id": t["id"],
                "type": "upcoming",
                "title": f"{t['name']} due soon",
                "body": f"Due {t['due_date']}. Schedule time to complete this.",
                "is_read": False,
            })

    rows.append({
        "user_id": user_id,
        "task_id": None,
        "type": "system",
        "title": "Compliance calendar generated",
        "body": f"{len(tasks)} obligations loaded for {business_name}.",
        "is_read": False,
    })

    if not rows:
        return []
    result = client.table("notifications").insert(rows).execute()
    return result.data or []


async def create_completion_notification(user_id: str, task_id: str, task_name: str) -> dict:
    client = get_admin_client()
    result = client.table("notifications").insert({
        "user_id": user_id,
        "task_id": task_id,
        "type": "completed",
        "title": f"{task_name} marked complete",
        "body": "Great work. It remains visible as completed in your timeline and calendar.",
        "is_read": False,
    }).execute()
    return result.data[0]


async def mark_notification_read(user_id: str, notif_id: str) -> dict:
    client = get_admin_client()
    result = (
        client.table("notifications")
        .update({"is_read": True})
        .eq("id", notif_id)
        .eq("user_id", user_id)
        .execute()
    )
    return result.data[0] if result.data else {}


async def mark_all_read(user_id: str) -> None:
    client = get_admin_client()
    client.table("notifications").update({"is_read": True}).eq("user_id", user_id).execute()
