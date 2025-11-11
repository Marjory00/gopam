# backend/models/ingredient.py

from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
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
    
    # Optional: Relationship back to the Pantry Item
    # This assumes a one-to-many relationship where one Ingredient can have many PantryItems
    # pantry_items = relationship("PantryItem", back_populates="ingredient")