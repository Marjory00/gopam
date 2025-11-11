# backend/models/recipe.py

from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

# Import Base from the database file
from database import Base 

# Import models necessary for relationships (assuming they exist in models/)
# NOTE: We no longer import Ingredient directly for the relationship, 
# but we import the Association Object instead.
from models.recipe_ingredient import RecipeIngredient 

# --- Recipe Model ---
class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text)
    image_url = Column(String)
    
    # Time and Difficulty
    prep_time = Column(Integer)  # minutes
    cook_time = Column(Integer)  # minutes
    servings = Column(Integer)
    difficulty_level = Column(String) # e.g., 'Easy', 'Medium', 'Hard'

    # Content
    instructions = Column(Text, nullable=False)
    cuisine_type = Column(String)
    meal_type = Column(String)
    nutrition_data = Column(Text) # Storing JSON/stringified data

    # Audit and Relationships
    created_at = Column(DateTime, default=datetime.utcnow)
    created_by = Column(Integer, ForeignKey('users.id')) 

    # --- Relationships ---
    
    # FIX: Relationship to the Association Object
    # This relationship links the Recipe to the data in the recipe_ingredients table.
    recipe_ingredients = relationship(
        "RecipeIngredient",
        back_populates="recipe",
        cascade="all, delete-orphan" # Allows cascade delete of association objects
    )
    
    # Relationship back to the User who created it
    # FIX: Use back_populates for standard bi-directional relationship management
    owner = relationship("User", back_populates="created_recipes")