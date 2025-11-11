# backend/database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base

# FIX 1: Import the Settings object from config.py
from config import settings 

# --- SQLAlchemy Setup ---

# Define the base class for declarative class definitions (your models)
Base = declarative_base()

# Create the database engine using the URL from the .env file
# The connect_args is necessary for SQLite to allow concurrent access
engine = create_engine(
    settings.DATABASE_URL, 
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
) 

# Create a configured "Session" class for transactional database operations
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# --- Required Functions for main.py ---

def init_db():
    """
    Initializes the database connection and creates all tables 
    defined by the Base metadata (your models).
    Called on application startup.
    """
    # FIX 2: Create all database tables. This requires your models to be defined.
    # Note: This is typically called Base.metadata.create_all(bind=engine)
    print(f"Database connection pool initialized for: {settings.DATABASE_URL}")
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables ensured.")
    except Exception as e:
        print(f"Warning: Could not create database tables. Ensure models and drivers are installed. Error: {e}")
        pass # Allow startup to continue even if tables can't be created immediately


def get_db():
    """
    Dependency generator for FastAPI routes. 
    Yields a database session and closes it afterwards.
    """
    db = SessionLocal()
    try:
        # FIX 3: Yield the session for dependency injection
        yield db 
    finally:
        # Close the session to release the connection back to the pool
        db.close()