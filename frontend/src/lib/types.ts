// frontend/src/lib/types.ts

// --- 1. USER & AUTHENTICATION ---

/**
 * Defines the user object as returned by the /api/users/me endpoint.
 * Corresponds to backend/schemas/user.py -> User
 */
export interface User {
    id: number;
    email: string;
    full_name: string | null;
    is_active: boolean;
    created_at: string; // ISO date string
}

/**
 * Defines the payload for the login request.
 * Corresponds to backend/schemas/user.py -> UserLogin
 */
export interface LoginRequest {
    email: string;
    password: string;
}

/**
 * Defines the response from the /api/auth/login endpoint.
 * Corresponds to backend/schemas/user.py -> Token
 */
export interface AuthResponse {
    access_token: string;
    token_type: string; // Should be "bearer"
}

// --- 2. INGREDIENTS & PANTRY ---

/**
 * Defines a master ingredient object.
 * Corresponds to backend/schemas/ingredient.py -> Ingredient
 */
export interface Ingredient {
    id: number;
    name: string;
    unit: string | null;
    is_pantry_staple: boolean;
}

/**
 * Defines the structure for creating a new PantryItem or an association link.
 * This is the API payload for POST /api/pantry/
 * Corresponds to backend/schemas/pantry.py -> PantryItemCreate
 */
export interface IngredientReference {
    ingredient_id: number;
    quantity: number; // Must be a float/number for the backend
    unit: string;
    expiration_date?: string | null; // Optional ISO date string
}


/**
 * Defines the structure of a PantryItem as returned by the API.
 * This includes the nested Ingredient object.
 * Corresponds to backend/schemas/pantry.py -> PantryItem
 */
export interface PantryItem {
    id: number;
    user_id: number;
    quantity: number;
    unit: string;
    expiration_date: string | null;
    added_at: string;
    
    // Nested Ingredient details from the relationship
    ingredient: Ingredient; 
}


// --- 3. RECIPES ---

/**
 * Defines the nested association object for reading a Recipe.
 * Corresponds to backend/schemas/recipe.py -> RecipeIngredientSchema
 */
export interface RecipeIngredientSchema {
    quantity: number;
    unit: string;
    ingredient: Ingredient; // Nested ingredient details
}

/**
 * Defines the full Recipe object returned by the API.
 * Corresponds to backend/schemas/recipe.py -> Recipe
 */
export interface Recipe {
    id: number;
    created_by: number;
    created_at: string;
    title: string;
    description: string | null;
    image_url: string | null;
    prep_time: number | null; // minutes
    cook_time: number | null; // minutes
    servings: number | null;
    difficulty_level: string | null;
    instructions: string;
    cuisine_type: string | null;
    meal_type: string | null;
    nutrition_data: string | null;
    
    // List of association objects
    recipe_ingredients: RecipeIngredientSchema[]; 
}

/**
 * Defines the structure for creating a new recipe.
 * Corresponds to backend/schemas/recipe.py -> RecipeCreate
 */
export interface RecipeCreate {
    title: string;
    description?: string | null;
    image_url?: string | null;
    prep_time?: number | null;
    cook_time?: number | null;
    servings?: number | null;
    difficulty_level?: string | null;
    instructions: string;
    cuisine_type?: string | null;
    meal_type?: string | null;
    nutrition_data?: string | null;
    
    // List of ingredient references with quantity/unit
    ingredients: IngredientReference[]; 
}

// --- 4. UTILITY & AI ---

/**
 * Defines the expected response for the FastAPI root health check.
 * Corresponds to the simple object returned by the root endpoint.
 */
export interface HealthCheckResponse {
    message: string;
}

// --- 5. AI RECOMMENDATIONS (Placeholder, will need refinement later) ---

/**
 * Defines the structure for a recommended recipe result from the AI engine.
 */
export interface RecommendedRecipe {
    recipe: Recipe;
    match_score: number; // Percentage (0-100) of ingredients available
    missing_ingredients: Ingredient[]; // List of ingredient objects the user lacks
}