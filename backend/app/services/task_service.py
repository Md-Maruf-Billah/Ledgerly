"""
Task service — placeholder for Supabase database integration.

SUPABASE INTEGRATION:
    from supabase import create_client
    from app.config import settings

    _client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

    async def get_tasks(user_id):
        result = _client.table("tasks").select("*").eq("user_id", user_id).execute()
        return result.data

    async def create_task(user_id, task_data):
        result = _client.table("tasks").insert({**task_data, "user_id": user_id}).execute()
        return result.data[0]

    async def mark_done(user_id, task_id):
        from datetime import datetime, timezone
        result = _client.table("tasks").update({
            "status": "completed",
            "completed_at": datetime.now(timezone.utc).isoformat(),
        }).eq("id", task_id).eq("user_id", user_id).execute()
        return result.data[0]
"""


async def get_tasks(user_id: str) -> list:
    raise NotImplementedError("Supabase not yet connected")


async def create_task(user_id: str, task_data: dict) -> dict:
    raise NotImplementedError("Supabase not yet connected")


async def update_task(user_id: str, task_id: str, update_data: dict) -> dict:
    raise NotImplementedError("Supabase not yet connected")


async def delete_task(user_id: str, task_id: str) -> None:
    raise NotImplementedError("Supabase not yet connected")
