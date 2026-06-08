"""
Profile service — placeholder for Supabase database integration.

SUPABASE INTEGRATION:
    _client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

    async def save_profile(profile_data):
        result = _client.table("business_profiles").upsert(profile_data).execute()
        return result.data[0]

    async def get_profile(user_id):
        result = _client.table("business_profiles").select("*").eq("user_id", user_id).single().execute()
        return result.data
"""


async def save_profile(profile_data: dict) -> dict:
    raise NotImplementedError("Supabase not yet connected")


async def get_profile(user_id: str) -> dict:
    raise NotImplementedError("Supabase not yet connected")


async def update_profile(user_id: str, profile_data: dict) -> dict:
    raise NotImplementedError("Supabase not yet connected")
