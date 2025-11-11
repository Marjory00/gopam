# backend/models/recipe.py

from sqlalchemy import Column, Integer, String, Text, ForeignKey, Enum, DateTime, Table
from sqlalchemy.orm import relationship
from datetime import datetime

# Import Base from the database file
from database import Base 

# Import models necessary for relationships
from models.ingredient import Ingredient 

# --- Association Table for Recipe Ingredients (Many-to-Many) ---
recipe_ingredients = Table(
    'recipe_ingredients', 
    Base.metadata,
    Column('recipe_id', Integer, ForeignKey('recipes.id'), primary_key=True),
    Column('ingredient_id', Integer, ForeignKey('ingredients.id'), primary_key=True)
)

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
    created_by = Column(Integer, ForeignKey('users.id')) # Assuming User model is loaded

    # Relationship to ingredients
    ingredients = relationship(
        "Ingredient", 
        secondary=recipe_ingredients, 
        backref="recipes"
    )
    
    # Relationship back to the User who created it
    owner = relationship("User", backref="created_recipes")