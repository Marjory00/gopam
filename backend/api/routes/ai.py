# backend/api/routes/ai.py

from fastapi import APIRouter

# Define the APIRouter instance
router = APIRouter()

# --- Placeholder Endpoint (You will add your AI endpoints here) ---

@router.get("/")
async def read_ai_status():
    """Placeholder to ensure the router loads."""
    return {"message": "AI Features router loaded successfully!"}