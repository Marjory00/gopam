
# backend/models/pantry_item.py

from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

# Import Base from the database file
from database import Base 

# Note: This model relies on the Ingredient model (models.ingredient) and the User model (models.user)

class PantryItem(Base):
    """
    Represents an item (ingredient) currently stored in a user's pantry/inventory.
    """
    __tablename__ = "pantry_items"

    id = Column(Integer, primary_key=True, index=True)
    
    # Link to the User who owns this item
    user_id = Column(Integer, ForeignKey('users.id'), index=True, nullable=False)
    
    # Link to the generic Ingredient definition
    # This means 'ingredient_id' should map to the ID of 'Ingredient.name' (e.g., Flour)
    ingredient_id = Column(Integer, ForeignKey('ingredients.id'), index=True, nullable=False)
    
    # Specific inventory details
    quantity = Column(Float, nullable=False)
    unit = Column(String, nullable=False) # e.g., 'grams', 'ounces', 'cups', 'units'
    
    # Optional field for tracking food waste (part of the AI features)
    expiration_date = Column(DateTime, nullable=True)
    
    # Audit fields
    added_at = Column(DateTime, default=datetime.utcnow)
    
    # --- Relationships ---
    
    # Relationship back to the User (Owner of the pantry)
    owner = relationship("User", back_populates="pantry_items")

    # Relationship to the generic Ingredient definition
    ingredient = relationship("Ingredient", back_populates="pantry_items")