# backend/models/user.py

from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship # <-- NEW: Import relationship
from database import Base 

class User(Base): # This defines the 'User' class being imported by routes/users.py
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    
    # --- Relationships ---
    
    # NEW: Relationship back to PantryItem
    # 'PantryItem' must be defined in models/pantry_item.py 
    pantry_items = relationship("PantryItem", back_populates="owner")
    
    # Relationship back to Recipe (already implied by Recipe model)
    created_recipes = relationship("Recipe", back_populates="owner")