from app.services import db


async def save_profile(user_id: str, data: dict, token: str) -> dict:
    rows = await db.upsert("business_profiles", token, {
        "user_id": user_id,
        "full_name": data["full_name"],
        "business_name": data["business_name"],
        "email": data["email"],
        "state": data["state"],
        "business_type": data["business_type"],
    })
    return rows[0]


async def get_profile(user_id: str, token: str) -> dict | None:
    rows = await db.select("business_profiles", token, {
        "select": "*",
        "user_id": f"eq.{user_id}",
        "limit": "1",
    })
    return rows[0] if rows else None


async def update_profile(user_id: str, data: dict, token: str) -> dict:
    rows = await db.update("business_profiles", token, data, {
        "user_id": f"eq.{user_id}",
    })
    return rows[0]
