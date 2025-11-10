# gopam/server/main.py

from fastapi import FastAPI # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from contextlib import asynccontextmanager

# Import database initialization and the pantry router
from .database import create_db_and_tables
from .pantry import router as pantry_router  # type: ignore

# --- Lifespan Context Manager ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handles startup and shutdown events for the application."""
    print("Application starting up: Creating DB and tables...")
    # This ensures the database file (gopam_db.db) and tables are created on startup
    create_db_and_tables() 
    yield
    print("Application shutting down.")

# --- Initialization ---
app = FastAPI(
    title="Gopam API",
    version="0.1.0",
    # Connect the startup/shutdown logic
    lifespan=lifespan 
)

# --- CORS Configuration ---
# Allow the Next.js client (default port 3000) to communicate with the server
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Include Routers ---
# This line adds all the CRUD endpoints from the Pantry module (e.g., /pantry/)
app.include_router(pantry_router.router) 

# --- Root Endpoint (Health Check) ---
@app.get("/")
def read_root():
    """Health check endpoint."""
    return {"message": "Gopam FastAPI Server is running!"}

# --- AI Recommendation Placeholder (Kept simple for now) ---
# Note: The original schemas (RecipeCreate, PantryItem) are no longer needed
# here as the functional code resides in the pantry router.
@app.post("/ai/recommend/")
def recommend_recipes():
    """Placeholder: Takes pantry items and returns recommended recipes."""
    return {"message": "AI Recommendation feature is under development."}

# --- Server Run Command ---
# uvicorn main:app --reload