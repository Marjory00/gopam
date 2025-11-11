// frontend/src/lib/types.ts

// --- 1. CORE ENTITIES ---

/**
 * Base structure for any primary resource (e.g., Recipe, PantryItem)
 * that is stored in the database.
 */
export interface Resource {
  id: number;
  name: string;
  // Add common audit fields here later (e.g., createdAt, ownerId)
}

/**
 * Defines the structure for a Recipe used in the library and meal planner.
 */
export interface Recipe extends Resource {
  description: string;
  tags: string[];
  prepTime: string; // e.g., "15 min"
  servings: number;
  // Placeholder for ingredient details which would be an array of Ingredient
  // ingredients: Ingredient[]; 
}

/**
 * Defines an item currently tracked in the user's pantry/inventory.
 */
export interface PantryItem extends Resource {
  quantity: string; // e.g., "2", "half"
  unit: string;     // e.g., "cups", "lbs", "head"
  addedDate: string; // ISO Date string (YYYY-MM-DD)
  expirationDate: string | null; // ISO Date string, null if non-perishable
}

// --- 2. MEAL PLANNING ---

/**
 * Defines a single meal slot within the MealPlan.
 */
export interface MealSlot {
  time: 'Breakfast' | 'Lunch' | 'Dinner';
  recipeId: number | null;
  recipeTitle: string | null;
  // Could include planned quantity or servings here
}

/**
 * Defines the structure for a day's meal plan entry.
 */
export interface MealPlan {
  day: string; // e.g., "Monday"
  meals: MealSlot[];
}

// --- 3. AI RECOMMENDATIONS ---

/**
 * Defines the structure for a recommended recipe result from the AI engine.
 */
export interface RecommendedRecipe extends Resource {
  description: string;
  matchScore: number; // Percentage (0-100) of ingredients available
  missingIngredients: string[]; // List of ingredient names the user lacks
}

// --- 4. API / UTILITY TYPES ---

/**
 * Defines the expected response for the FastAPI root health check.
 */
export interface HealthCheckResponse {
  message: string;
}

/**
 * Defines the structure for data fetched from a list endpoint.
 * Useful when using a data fetching library like TanStack Query.
 */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}