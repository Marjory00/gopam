# backend/api/routes/pantry.py
"""
Pantry API routes
Handles user inventory management (PantryItem CRUD)

Author: Marjory D. Marquez
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

# Import Database and Dependency helpers
from database import get_db
from api.dependencies import get_current_user

# Import Models and Schemas
from models.user import User
from models.pantry_item import PantryItem
from schemas.pantry import PantryItem, PantryItemCreate # Note: Re-using the Pydantic model name
from models.ingredient import Ingredient # Needed to check if ingredient exists

router = APIRouter()

# --- 1. LIST USER'S PANTRY ITEMS ---

@router.get("/", response_model=List[PantryItem])
def list_pantry_items(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieves all pantry items belonging to the current authenticated user.
    """
    # Query the database for items matching the current user's ID
    pantry_items = db.query(PantryItem).filter(
        PantryItem.user_id == current_user.id
    ).all()
    
    return pantry_items


# --- 2. ADD A NEW PANTRY ITEM ---

@router.post("/", response_model=PantryItem, status_code=status.HTTP_201_CREATED)
def add_pantry_item(
    item_data: PantryItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Adds a new ingredient item to the user's pantry.
    """
    
    # 1. Check if the ingredient_id is valid
    ingredient = db.query(Ingredient).filter(
        Ingredient.id == item_data.ingredient_id
    ).first()
    
    if not ingredient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ingredient not found in the master list."
        )

    # 2. Create the new PantryItem database object
    db_item = PantryItem(
        **item_data.model_dump(),  # Uses Pydantic V2 method to dump data
        user_id=current_user.id
    )
    
    # 3. Add to database and return
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    
    return db_item