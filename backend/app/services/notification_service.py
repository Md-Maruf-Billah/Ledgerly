"""
Notification service — placeholder for Supabase database integration.

SUPABASE INTEGRATION:
    _client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

    async def get_notifications(user_id):
        result = (
            _client.table("notifications")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )
        return result.data

    async def mark_read(user_id, notif_id):
        result = (
            _client.table("notifications")
            .update({"is_read": True})
            .eq("id", notif_id)
            .eq("user_id", user_id)
            .execute()
        )
        return result.data[0]
"""


async def get_notifications(user_id: str) -> list:
    raise NotImplementedError("Supabase not yet connected")


async def mark_notification_read(user_id: str, notif_id: str) -> dict:
    raise NotImplementedError("Supabase not yet connected")


async def mark_all_read(user_id: str) -> None:
    raise NotImplementedError("Supabase not yet connected")
