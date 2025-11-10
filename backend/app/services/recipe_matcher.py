
"""
Recipe Matcher Service
Matches recipes with available pantry ingredients

Author: Marjory D. Marquez
"""

from typing import List, Dict, Any
from app.models.recipe import Recipe


class RecipeMatcher:
    """
    Service for matching recipes based on available ingredients
    """
    
    def __init__(self, match_threshold: float = 0.5):
        """
        Initialize recipe matcher
        
        Args:
            match_threshold: Minimum match percentage to include recipe
        """
        self.match_threshold = match_threshold
    
    def match_recipes(
        self,
        available_ingredients: List[int],
        recipes: List[Recipe]
    ) -> List[Dict[str, Any]]:
        """
        Match recipes with available ingredients
        
        Args:
            available_ingredients: List of available ingredient IDs
            recipes: List of all recipes to match against
            
        Returns:
            List of matching recipes with match scores
        """
        recommendations = []
        
        for recipe in recipes:
            # Get recipe ingredients
            recipe_ingredient_ids = [ing.id for ing in recipe.ingredients]
            
            if not recipe_ingredient_ids:
                continue
            
            # Calculate match percentage
            matching_count = sum(
                1 for ing_id in recipe_ingredient_ids
                if ing_id in available_ingredients
            )
            
            match_percentage = matching_count / len(recipe_ingredient_ids)
            
            # Only include if above threshold
            if match_percentage >= self.match_threshold:
                missing_ingredients = [
                    ing.name for ing in recipe.ingredients
                    if ing.id not in available_ingredients
                ]
                
                recommendations.append({
                    "recipe_id": recipe.id,
                    "title": recipe.title,
                    "description": recipe.description,
                    "image_url": recipe.image_url,
                    "match_percentage": round(match_percentage * 100, 2),
                    "matching_ingredients": matching_count,
                    "total_ingredients": len(recipe_ingredient_ids),
                    "missing_ingredients": missing_ingredients,
                    "prep_time": recipe.prep_time,
                    "cook_time": recipe.cook_time,
                    "difficulty_level": recipe.difficulty_level
                })
        
        # Sort by match percentage (highest first)
        recommendations.sort(key=lambda x: x["match_percentage"], reverse=True)
        
        return recommendations
    
    def find_exact_matches(
        self,
        available_ingredients: List[int],
        recipes: List[Recipe]
    ) -> List[Recipe]:
        """
        Find recipes that can be made with exactly the available ingredients
        
        Args:
            available_ingredients: List of available ingredient IDs
            recipes: List of all recipes
            
        Returns:
            List of recipes with 100% match
        """
        exact_matches = []
        
        for recipe in recipes:
            recipe_ingredient_ids = [ing.id for ing in recipe.ingredients]
            
            if set(recipe_ingredient_ids).issubset(set(available_ingredients)):
                exact_matches.append(recipe)
        
        return exact_matches