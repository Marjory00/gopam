// frontend/src/lib/types.ts

// --- 1. USER & AUTHENTICATION ---

/**
 * Defines the user object as returned by the /api/users/me endpoint.
 */
export interface User {
    id: number;
    email: string;
    username: string; // Added username for completeness (often returned)
    full_name: string | null;
    is_active: boolean;
    created_at: string; // ISO date string
}

/**
 * Defines the payload for the login request (Form Data or JSON).
 */
export interface LoginRequest {
    email: string;
    password: string;
}

/**
 * Defines the response from the /api/auth/login endpoint (the Token object).
 */
export interface TokenResponse { // Renamed from AuthResponse for clarity with backend schema 'Token'
    access_token: string;
    token_type: string; // Should be "bearer"
}

// --- 2. INGREDIENTS & PANTRY ---

/**
 * Defines a master ingredient object.
 */
export interface Ingredient {
    id: number;
    name: string;
    unit: string | null; // Unit suggestion/default
    is_pantry_staple: boolean;
}

/**
 * Defines the structure for creating a new PantryItem.
 */
export interface PantryItemCreate { // Renamed for clarity: matches 'PantryItemCreate' schema
    ingredient_id: number;
    quantity: number; // Must be a float/number
    unit: string;
    expiration_date?: string | null; // Optional ISO date string
}

/**
 * Defines the structure of a PantryItem as returned by the API (includes nested Ingredient).
 */
export interface PantryItem {
    id: number;
    user_id: number;
    quantity: number;
    unit: string;
    expiration_date: string | null;
    added_at: string;
    
    // Nested Ingredient details
    ingredient: Ingredient; 
}


// --- 3. RECIPES ---

/**
 * Defines the nested association object for reading a Recipe.
 */
export interface RecipeIngredientSchema {
    quantity: number;
    unit: string;
    ingredient: Ingredient; // Nested ingredient details
}

/**
 * Defines the essential recipe data returned in a list view (used by RecipeCard).
 * We keep this minimal for lists, but use the full Recipe below for details.
 */
export interface RecipeList extends Omit<RecipeDetail, 'recipe_ingredients' | 'instructions'> {
    // This is the core 'Recipe' interface we defined earlier, adjusted to align with the backend's full 'Recipe' object structure.
}

/**
 * Defines the full Recipe object returned by the API (used by the Detail Page).
 * Note: Includes 'recipe_ingredients' which holds the full Ingredient object.
 */
export interface RecipeDetail { // Renamed from Recipe to RecipeDetail for clarity
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
    instructions: string; // Instructions are mandatory (non-null) for a full recipe
    cuisine_type: string | null;
    meal_type: string | null;
    nutrition_data: string | null;
    
    // List of association objects with nested Ingredient details
    recipe_ingredients: RecipeIngredientSchema[]; 
}

/**
 * Defines the structure for creating a new recipe.
 * NOTE: The backend expects a simple list of references for ingredients here, not the full IngredientReference object.
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
    
    // FIX: Simplified the ingredient list to match typical RecipeCreate payload
    // where you only pass the necessary details for the association.
    ingredients: {
        ingredient_id: number;
        quantity: number;
        unit: string;
    }[]; 
}

/**
 * Defines the schema for searching and filtering recipes.
 */
export interface RecipeSearch {
    query?: string | null;
    cuisine_type?: string | null;
    meal_type?: string | null;
    difficulty_level?: string | null;
    max_prep_time?: number | null;
    max_cook_time?: number | null;
}

// --- 4. UTILITY & AI ---

/**
 * Defines the expected response for the FastAPI root health check.
 */
export interface HealthCheckResponse {
    message: string;
}

/**
 * Defines the structure for a recommended recipe result from the AI engine.
 */
export interface RecommendedRecipe {
    recipe: RecipeList; // Use RecipeList for the nested object
    match_score: number; // Score (0.0 to 1.0) - changed to 0-1 for standard API scores
    missing_ingredients: Ingredient[]; // List of ingredient objects the user lacks
}