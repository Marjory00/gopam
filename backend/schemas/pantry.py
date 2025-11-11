# backend/schemas/pantry.py

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# Import the Ingredient schema for nested data structure in the response
from schemas.recipe import Ingredient as IngredientSchema 

# --- Base Schema (Common fields for input/output) ---

class PantryItemBase(BaseModel):
    """
    Base fields for a pantry item.
    """
    ingredient_id: int = Field(..., description="ID of the generic ingredient (e.g., ID for 'Flour')")
    quantity: float = Field(..., gt=0, description="Current amount of the ingredient.")
    unit: str = Field(..., max_length=20, description="Unit of measurement (e.g., 'grams', 'oz', 'units').")
    expiration_date: Optional[datetime] = Field(None, description="Optional date the item expires.")

# --- Schemas for CRUD operations ---

class PantryItemCreate(PantryItemBase):
    """
    Schema for adding a new item to the pantry.
    The user_id and added_at fields are set by the server.
    """
    pass

class PantryItemUpdate(BaseModel):
    """
    Schema for updating an existing pantry item. All fields are optional.
    """
    quantity: Optional[float] = Field(None, gt=0)
    unit: Optional[str] = Field(None, max_length=20)
    expiration_date: Optional[datetime] = None

class PantryItem(PantryItemBase):
    """
    Full schema for returning a pantry item from the API.
    Includes database-managed fields.
    """
    id: int
    user_id: int
    added_at: datetime
    
    # Nested Ingredient Schema for displaying the ingredient details
    # This allows the API response to show the ingredient name, not just its ID.
    ingredient: IngredientSchema 

    class Config:
        # Pydantic V2 setting to allow mapping from SQLAlchemy models
        from_attributes = True