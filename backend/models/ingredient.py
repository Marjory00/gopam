# backend/models/ingredient.py

from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship

# Import Base from the database file
from database import Base 

class Ingredient(Base): # <--- This defines the 'Ingredient' class being imported
    __tablename__ = "ingredients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    
    # Optional fields for inventory/pantry tracking
    unit = Column(String)
    is_pantry_staple = Column(Boolean, default=False)
    
    # --- Relationships ---
    
    # 1. Relationship back to PantryItem (User's Inventory)
    # This completes the bi-directional relationship started in models/pantry_item.py
    pantry_items = relationship("PantryItem", back_populates="ingredient")
    
    # 2. Relationship back to RecipeIngredient (Recipe Requirements)
    # This links the Ingredient to the association object holding quantity/unit for a recipe.
    recipe_ingredients = relationship("RecipeIngredient", back_populates="ingredient")