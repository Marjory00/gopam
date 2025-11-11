from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# FIX: Change relative imports (.module) to absolute imports (module)
# This assumes config.py, database.py, and the api directory are all in the 'backend' folder
# and accessible to the Python interpreter.
from config import settings
from database import init_db

# FIX: Change relative imports to absolute imports for the router package
from api.routes import users, recipes, pantry, ai 

# Initialize FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-Powered Recipe & Ingredient Management System API",
)

# --- Middleware Setup ---
# Setup CORS for frontend communication
origins = [
    "http://localhost:3000",  # Next.js Frontend
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Router Inclusion ---
# Include all sub-routers for endpoints
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(recipes.router, prefix="/api/recipes", tags=["Recipes"])
app.include_router(pantry.router, prefix="/api/pantry", tags=["Pantry"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI Features"])

# --- Root Endpoint ---
@app.get("/", tags=["Health Check"])
async def root():
    return {"message": "Gopam AI-Powered Recipe Backend is running!"}

# --- Database Events ---
@app.on_event("startup")
async def startup_event():
    print("Connecting to the database...")
    init_db()

@app.on_event("shutdown")
async def shutdown_event():
    print("Shutting down database connection...")

# Used only if running main.py directly
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)