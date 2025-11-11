# backend/schemas/recipe.py

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# --- Ingredient Schema (Needed for nested data in Recipe) ---

class IngredientBase(BaseModel):
    name: str = Field(..., description="Name of the ingredient")
    unit: Optional[str] = Field(None, description="Standard unit of measure")

class IngredientCreate(IngredientBase):
    pass # Simple alias for now

class Ingredient(IngredientBase):
    id: int
    is_pantry_staple: bool

    class Config:
        from_attributes = True

# --- Recipe Schemas ---

class IngredientReference(BaseModel):
    """Schema used when creating a recipe to link ingredients."""
    ingredient_id: int
    quantity: Optional[float] = None
    unit: Optional[str] = None

class RecipeBase(BaseModel):
    """Base fields for a recipe."""
    title: str = Field(..., max_length=150)
    description: Optional[str] = None
    image_url: Optional[str] = None
    prep_time: Optional[int] = Field(None, description="Time in minutes")
    cook_time: Optional[int] = Field(None, description="Time in minutes")
    servings: Optional[int] = None
    difficulty_level: Optional[str] = None
    instructions: str
    cuisine_type: Optional[str] = None
    meal_type: Optional[str] = None
    nutrition_data: Optional[str] = Field(None, description="JSON string or text for nutrition")

class RecipeCreate(RecipeBase):
    """Schema for creating a new recipe (includes ingredient links)."""
    ingredients: List[IngredientReference] = Field(default_factory=list, description="List of ingredient references")
    # created_by is derived from the token/current_user, so it's not here.

class RecipeUpdate(RecipeBase):
    """Schema for updating an existing recipe."""
    # All fields are optional when updating
    title: Optional[str] = None
    instructions: Optional[str] = None
    
    # You might need a separate mechanism to update ingredients if this is complex

class RecipeSearch(BaseModel):
    """Schema for advanced recipe search filters."""
    query: Optional[str] = None
    cuisine_type: Optional[str] = None
    meal_type: Optional[str] = None
    difficulty_level: Optional[str] = None
    max_prep_time: Optional[int] = None
    max_cook_time: Optional[int] = None

# Schema for reading/returning a recipe from the API
class Recipe(RecipeBase):
    """Full recipe schema returned by the API."""
    id: int
    created_by: int
    created_at: datetime
    
    # Nested list of ingredient schemas for the full response
    ingredients: List[Ingredient] = Field(default_factory=list)

    class Config:
        # Pydantic V2 setting to allow mapping from SQLAlchemy models
        from_attributes = True