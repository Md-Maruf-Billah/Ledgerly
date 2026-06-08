from app.services.supabase_client import get_admin_client


async def save_profile(user_id: str, data: dict) -> dict:
    client = get_admin_client()
    payload = {
        "user_id": user_id,
        "full_name": data["full_name"],
        "business_name": data["business_name"],
        "email": data["email"],
        "state": data["state"],
        "business_type": data["business_type"],
    }
    result = client.table("business_profiles").upsert(payload).execute()
    return result.data[0]


async def get_profile(user_id: str) -> dict | None:
    client = get_admin_client()
    result = (
        client.table("business_profiles")
        .select("*")
        .eq("user_id", user_id)
        .maybe_single()
        .execute()
    )
    return result.data


async def update_profile(user_id: str, data: dict) -> dict:
    client = get_admin_client()
    result = (
        client.table("business_profiles")
        .update(data)
        .eq("user_id", user_id)
        .execute()
    )
    return result.data[0]
