# backend/api/routes/recipes.py
"""
Recipe API routes
Handles recipe creation, retrieval, update, and search

Author: Marjory D. Marquez
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload # NEW: Import joinedload for optimized query
from typing import List, Optional

from database import get_db
from models.user import User
from models.recipe import Recipe
from models.ingredient import Ingredient
from models.recipe_ingredient import RecipeIngredient # NEW: Import the association model
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
    Create a new recipe, correctly handling the RecipeIngredient association object.
    
    Args:
        recipe_data: Recipe creation data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Created recipe object
        
    Raises:
        HTTPException: If one of the required ingredients is not found.
    """
    
    # 1. Create recipe instance without ingredients initially
    # We use model_dump(exclude) to handle the nested ingredients data separately.
    recipe_fields = recipe_data.model_dump(exclude={"ingredients"})
    db_recipe = Recipe(
        **recipe_fields,
        created_by=current_user.id
    )
    
    # 2. Create and append the RecipeIngredient association objects
    for ingredient_ref in recipe_data.ingredients:
        # Check if the ingredient ID exists in the master list
        ingredient_exists = db.query(Ingredient.id).filter(
            Ingredient.id == ingredient_ref.ingredient_id
        ).first()
        
        if not ingredient_exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Ingredient with ID {ingredient_ref.ingredient_id} not found in the master list."
            )
        
        # Create the association object (RecipeIngredient)
        recipe_ingredient = RecipeIngredient(
            ingredient_id=ingredient_ref.ingredient_id,
            quantity=ingredient_ref.quantity,
            unit=ingredient_ref.unit
        )
        
        # Add the association object to the recipe's relationship list
        db_recipe.recipe_ingredients.append(recipe_ingredient)
    
    # 3. Commit the new recipe and its associations
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
    List all recipes with pagination, eagerly loading ingredients for efficiency.
    """
    # FIX: Use joinedload to eagerly load the nested recipe_ingredients relationship 
    # and their nested ingredients, preventing N+1 query problems.
    recipes = db.query(Recipe).options(
        joinedload(Recipe.recipe_ingredients).joinedload(RecipeIngredient.ingredient)
    ).offset(skip).limit(limit).all()
    
    return recipes


@router.get("/{recipe_id}", response_model=RecipeSchema)
def get_recipe(recipe_id: int, db: Session = Depends(get_db)):
    """
    Get a specific recipe by ID, eagerly loading ingredients.
    """
    # FIX: Use joinedload here as well for single-recipe retrieval efficiency.
    recipe = db.query(Recipe).options(
        joinedload(Recipe.recipe_ingredients).joinedload(RecipeIngredient.ingredient)
    ).filter(Recipe.id == recipe_id).first()
    
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
    Update a recipe (only core fields, ingredient update logic is complex and omitted).
    """
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )
    
    # Check if user is authorized to update
    if recipe.created_by != current_user.id: 
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this recipe"
        )
    
    # Update recipe fields using Pydantic's exclude_unset
    update_data = recipe_data.model_dump(exclude_unset=True)
    
    # FIX: Ensure we exclude the 'ingredients' field if it was passed in RecipeUpdate,
    # as updating the association list requires separate, complex logic (clear & re-create).
    update_data.pop('ingredients', None) 
    
    for field, value in update_data.items():
        setattr(recipe, field, value)
    
    db.commit()
    db.refresh(recipe)
    
    # FIX: Eager load ingredients before returning the RecipeSchema
    db.expire_all()
    updated_recipe = db.query(Recipe).options(
        joinedload(Recipe.recipe_ingredients).joinedload(RecipeIngredient.ingredient)
    ).filter(Recipe.id == recipe_id).first()
    
    return updated_recipe


@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_recipe(
    recipe_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a recipe. The 'cascade' setting on the Recipe model handles deleting 
    the associated RecipeIngredient objects automatically.
    """
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )
    
    # Check if user is authorized to delete
    if recipe.created_by != current_user.id:
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
    Search recipes with filters.
    """
    # FIX: Use joinedload for search results to avoid N+1 problem on the list
    query = db.query(Recipe).options(
        joinedload(Recipe.recipe_ingredients).joinedload(RecipeIngredient.ingredient)
    )
    
    # Apply filters based on search parameters
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