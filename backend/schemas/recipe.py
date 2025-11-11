# backend/schemas/recipe.py

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# --- Ingredient Schemas (Reference for other models) ---

class IngredientBase(BaseModel):
    name: str = Field(..., description="Name of the ingredient")
    unit: Optional[str] = Field(None, description="Standard unit of measure")

class Ingredient(IngredientBase):
    """Schema for reading a generic Ingredient."""
    id: int
    is_pantry_staple: bool

    class Config:
        from_attributes = True

# --- Association Object Schema (NEW) ---

class RecipeIngredientSchema(BaseModel):
    """
    Schema for the RecipeIngredient association object.
    This holds the quantity/unit AND nests the Ingredient details.
    """
    quantity: float = Field(..., gt=0)
    unit: str
    
    # Nested Ingredient schema to display the details of the ingredient itself
    ingredient: Ingredient 

    class Config:
        from_attributes = True

# --- Recipe Schemas ---

class IngredientReference(BaseModel):
    """
    Schema used when creating/updating a recipe to link ingredients with specific details.
    This maps directly to the data needed for the RecipeIngredient Association Model.
    """
    ingredient_id: int = Field(..., description="ID of the generic ingredient.")
    quantity: float = Field(..., gt=0, description="Required quantity for this recipe.")
    unit: str = Field(..., description="Required unit for this recipe.")


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
    # The list now uses the fixed IngredientReference to capture quantity/unit
    ingredients: List[IngredientReference] = Field(default_factory=list, description="List of ingredient references with quantity/unit")

class RecipeUpdate(RecipeBase):
    """Schema for updating an existing recipe."""
    # All fields are optional when updating
    title: Optional[str] = None
    instructions: Optional[str] = None
    
    # NOTE: Updating ingredients is complex and usually requires separate PATCH/PUT routes
    # or overwriting the entire list, which is not included here for simplicity.

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
    
    # FIX: Nested list now uses the Association Object Schema (RecipeIngredientSchema).
    # This structure mirrors the SQLAlchemy relationship: Recipe -> [RecipeIngredientSchema]
    recipe_ingredients: List[RecipeIngredientSchema] = Field(default_factory=list)

    class Config:
        from_attributes = True