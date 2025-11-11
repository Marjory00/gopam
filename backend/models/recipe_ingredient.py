
# backend/models/recipe_ingredient.py
"""
Association Model for Recipe Ingredients, holding quantity and unit.
"""
from sqlalchemy import Column, Integer, Float, String, ForeignKey
from sqlalchemy.orm import relationship

from database import Base 

class RecipeIngredient(Base):
    __tablename__ = "recipe_ingredients"

    # Foreign keys for the composite primary key
    recipe_id = Column(Integer, ForeignKey('recipes.id'), primary_key=True)
    ingredient_id = Column(Integer, ForeignKey('ingredients.id'), primary_key=True)
    
    # --- Extra Recipe-Specific Attributes ---
    quantity = Column(Float, nullable=False)
    unit = Column(String, nullable=False) # e.g., 'cups', 'tsp', 'grams'

    # --- Relationships ---
    
    # Relationship back to Recipe (One RecipeIngredient belongs to one Recipe)
    recipe = relationship("Recipe", back_populates="recipe_ingredients")
    
    # Relationship back to Ingredient (One RecipeIngredient refers to one Ingredient)
    ingredient = relationship("Ingredient", back_populates="recipe_ingredients")