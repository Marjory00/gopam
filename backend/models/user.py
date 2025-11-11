# backend/models/user.py

from sqlalchemy import Column, Integer, String, Boolean
# FIX: Changed relative import (..) to absolute import (database)
from database import Base 

class User(Base): # This defines the 'User' class being imported by routes/users.py
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)