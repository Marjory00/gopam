# backend/api/routes/pantry.py

from fastapi import APIRouter

# Define the APIRouter instance
router = APIRouter()

# --- Placeholder Endpoint (You will add your real endpoints here) ---

@router.get("/")
async def read_pantry_status():
    """Placeholder to ensure the router loads."""
    return {"message": "Pantry router loaded successfully!"}