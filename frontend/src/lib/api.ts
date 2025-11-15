// frontend/src/lib/api.ts

import axios, { AxiosInstance } from 'axios';
import {
    PantryItem,
    PantryItemCreate, // FIX: Use the specific create type
    TokenResponse,    // FIX: Use the renamed type
    LoginRequest,
    User,
    HealthCheckResponse,
    RecipeDetail,     // FIX: Use RecipeDetail for fetching single recipes
    RecipeList,       // FIX: Use RecipeList for fetching lists
    RecipeCreate,
    RecipeSearch,
    Ingredient,       // ADDED: Ingredient for master list
    RecommendedRecipe // ADDED: RecommendedRecipe for AI matching
} from './types'; // Import necessary types

// --- 1. CONFIGURATION ---

// Get the base URL from the environment variables (http://localhost:8000 is the default)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

/**
 * Creates an Axios instance configured for the FastAPI backend.
 */
const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false, 
});

// Utility to create the Authorization header object for protected routes
const setAuthHeader = (token: string) => ({
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

// --- 2. AUTHENTICATION ENDPOINTS ---

/**
 * Performs user login.
 * API Route: POST /api/auth/login
 */
export const login = async (credentials: LoginRequest): Promise<TokenResponse> => { // FIX: Use TokenResponse
    const response = await api.post<TokenResponse>('/api/auth/login', credentials);
    return response.data;
};

/**
 * Fetches the current authenticated user's details.
 * API Route: GET /api/users/me
 */
export const fetchCurrentUser = async (token: string): Promise<User> => {
    const response = await api.get<User>('/api/users/me', setAuthHeader(token));
    return response.data;
};


// --- 3. PANTRY ENDPOINTS ---

/**
 * Fetching all pantry items for the current user.
 * API Route: GET /api/pantry/
 */
export const fetchPantryItems = async (token: string): Promise<PantryItem[]> => {
    const response = await api.get<PantryItem[]>('/api/pantry/', setAuthHeader(token));
    return response.data;
};

/**
 * Adding a new pantry item.
 * API Route: POST /api/pantry/
 */
export const addPantryItem = async (
    token: string, 
    itemData: PantryItemCreate // FIX: Use PantryItemCreate
): Promise<PantryItem> => {
    const response = await api.post<PantryItem>('/api/pantry/', itemData, setAuthHeader(token));
    return response.data;
};

/**
 * Removing a pantry item by its unique PantryItem ID.
 * API Route: DELETE /api/pantry/{item_id}
 */
export const removePantryItem = async (token: string, itemId: number): Promise<void> => {
    await api.delete(`/api/pantry/${itemId}`, setAuthHeader(token));
};

// --- 4. INGREDIENT ENDPOINTS (ADDED) ---

/**
 * Fetching the master list of all available ingredients.
 * API Route: GET /api/ingredients/
 */
export const fetchAllIngredients = async (token: string): Promise<Ingredient[]> => {
    const response = await api.get<Ingredient[]>('/api/ingredients/', setAuthHeader(token));
    return response.data;
};


// --- 5. RECIPE ENDPOINTS ---

/**
 * Fetching all recipes (list) from the backend.
 * API Route: GET /api/recipes/
 */
export const fetchAllRecipes = async (token: string): Promise<RecipeList[]> => { // FIX: Use RecipeList
    const response = await api.get<RecipeList[]>('/api/recipes/', setAuthHeader(token));
    return response.data;
};

/**
 * Fetching a single recipe by ID.
 * API Route: GET /api/recipes/{recipe_id}
 */
export const fetchRecipeById = async (token: string, recipeId: number): Promise<RecipeDetail> => { // FIX: Use RecipeDetail
    const response = await api.get<RecipeDetail>(`/api/recipes/${recipeId}`, setAuthHeader(token));
    return response.data;
};

/**
 * Creating a new recipe.
 * API Route: POST /api/recipes/
 */
export const createRecipe = async (token: string, recipeData: RecipeCreate): Promise<RecipeDetail> => { // FIX: Expect RecipeDetail back
    const response = await api.post<RecipeDetail>('/api/recipes/', recipeData, setAuthHeader(token));
    return response.data;
};

/**
 * Searching recipes with filters.
 * API Route: POST /api/recipes/search
 */
export const searchRecipes = async (token: string, searchParams: RecipeSearch): Promise<RecipeList[]> => { // FIX: Expect RecipeList[] back
    const response = await api.post<RecipeList[]>('/api/recipes/search', searchParams, setAuthHeader(token));
    return response.data;
};

// --- 6. AI MATCHING ENDPOINTS (ADDED) ---

/**
 * Gets AI recipe recommendations based on provided ingredient IDs.
 * API Route: POST /api/ai/match
 */
export const getRecipeMatch = async (token: string, ingredientIds: number[]): Promise<RecommendedRecipe[]> => {
    const response = await api.post<RecommendedRecipe[]>(
        '/api/ai/match', 
        { ingredient_ids: ingredientIds }, // Backend expects JSON payload with 'ingredient_ids' key
        setAuthHeader(token)
    );
    return response.data;
};


// --- 7. UTILITY / HEALTH CHECK ---

/**
 * Health Check: GET /
 */
export const getHealth = async (): Promise<HealthCheckResponse> => {
    const response = await api.get<HealthCheckResponse>('/');
    return response.data;
};

// Export the configured instance for direct use if needed
export default api;