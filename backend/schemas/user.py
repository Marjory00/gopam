"""
User Pydantic schemas for request/response validation
Defines data transfer objects for user endpoints

Author: Marjory D. Marquez
"""

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    """
    Base user schema with common attributes
    """
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    """
    Schema for creating a new user
    """
    password: str


class UserUpdate(BaseModel):
    """
    Schema for updating user information
    """
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None


class UserInDB(UserBase):
    """
    Schema for user data stored in database
    """
    id: int
    is_active: bool
    is_superuser: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class User(UserInDB):
    """
    Schema for user response (without sensitive data)
    """
    pass


class UserLogin(BaseModel):
    """
    Schema for user login request
    """
    email: EmailStr
    password: str


class Token(BaseModel):
    """
    Schema for JWT token response
    """
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """
    Schema for token payload data
    """
    email: Optional[str] = None