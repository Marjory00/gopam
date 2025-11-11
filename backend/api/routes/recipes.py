"""
Recipe API routes
Handles recipe creation, retrieval, update, and search

Author: Marjory D. Marquez
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

# FIX 1: Change all 'app.' imports to absolute imports from the backend root.
from database import get_db
from models.user import User
from models.recipe import Recipe
from models.ingredient import Ingredient
from schemas.recipe import RecipeCreate, Recipe as RecipeSchema, RecipeUpdate, RecipeSearch
from api.dependencies import get_current_user

router = APIRouter()


@router.post("/", response_model=RecipeSchema, status_code=status.HTTP_201_CREATED)
def create_recipe(
    recipe_data: RecipeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new recipe
    
    Args:
        recipe_data: Recipe creation data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Created recipe object
    """
    # Create recipe
    db_recipe = Recipe(
        title=recipe_data.title,
        description=recipe_data.description,
        image_url=recipe_data.image_url,
        prep_time=recipe_data.prep_time,
        cook_time=recipe_data.cook_time,
        servings=recipe_data.servings,
        difficulty_level=recipe_data.difficulty_level,
        instructions=recipe_data.instructions,
        cuisine_type=recipe_data.cuisine_type,
        meal_type=recipe_data.meal_type,
        nutrition_data=recipe_data.nutrition_data,
        created_by=current_user.id
    )
    
    # Add ingredients
    # NOTE: This assumes a many-to-many relationship where Recipe has an 'ingredients' relationship attribute.
    # It also assumes ingredient_data has an 'ingredient_id'.
    for ingredient_data in recipe_data.ingredients:
        ingredient = db.query(Ingredient).filter(Ingredient.id == ingredient_data.ingredient_id).first()
        if ingredient:
            db_recipe.ingredients.append(ingredient)
    
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    
    return db_recipe


@router.get("/", response_model=List[RecipeSchema])
def list_recipes(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    List all recipes with pagination
    
    Args:
        skip: Number of records to skip
        limit: Maximum number of records to return
        db: Database session
        
    Returns:
        List of recipes
    """
    recipes = db.query(Recipe).offset(skip).limit(limit).all()
    return recipes


@router.get("/{recipe_id}", response_model=RecipeSchema)
def get_recipe(recipe_id: int, db: Session = Depends(get_db)):
    """
    Get a specific recipe by ID
    
    Args:
        recipe_id: Recipe ID
        db: Database session
        
    Returns:
        Recipe object
        
    Raises:
        HTTPException: If recipe not found
    """
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )
    
    return recipe


@router.put("/{recipe_id}", response_model=RecipeSchema)
def update_recipe(
    recipe_id: int,
    recipe_data: RecipeUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a recipe
    
    Args:
        recipe_id: Recipe ID
        recipe_data: Updated recipe data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Updated recipe object
        
    Raises:
        HTTPException: If recipe not found or user not authorized
    """
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )
    
    # Check if user is authorized to update
    # NOTE: Assuming User model has 'is_superuser' attribute
    if recipe.created_by != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this recipe"
        )
    
    # Update recipe fields
    # NOTE: Using model_dump method from Pydantic V2
    update_data = recipe_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(recipe, field, value)
    
    db.commit()
    db.refresh(recipe)
    
    return recipe


@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_recipe(
    recipe_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a recipe
    
    Args:
        recipe_id: Recipe ID
        current_user: Current authenticated user
        db: Database session
        
    Raises:
        HTTPException: If recipe not found or user not authorized
    """
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )
    
    # Check if user is authorized to delete
    if recipe.created_by != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this recipe"
        )
    
    db.delete(recipe)
    db.commit()


@router.post("/search", response_model=List[RecipeSchema])
def search_recipes(
    search_params: RecipeSearch,
    db: Session = Depends(get_db)
):
    """
    Search recipes with filters
    
    Args:
        search_params: Search parameters
        db: Database session
        
    Returns:
        List of matching recipes
    """
    query = db.query(Recipe)
    
    # Apply filters
    # NOTE: .ilike() is for case-insensitive search in most SQL dialects
    if search_params.query:
        query = query.filter(Recipe.title.ilike(f"%{search_params.query}%"))
    
    if search_params.cuisine_type:
        query = query.filter(Recipe.cuisine_type == search_params.cuisine_type)
    
    if search_params.meal_type:
        query = query.filter(Recipe.meal_type == search_params.meal_type)
    
    if search_params.difficulty_level:
        query = query.filter(Recipe.difficulty_level == search_params.difficulty_level)
    
    if search_params.max_prep_time:
        query = query.filter(Recipe.prep_time <= search_params.max_prep_time)
    
    if search_params.max_cook_time:
        query = query.filter(Recipe.cook_time <= search_params.max_cook_time)
    
    recipes = query.all()
    return recipes