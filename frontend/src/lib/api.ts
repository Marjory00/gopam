// frontend/src/lib/api.ts

import axios, { AxiosInstance } from 'axios';
import {
    PantryItem,
    IngredientReference,
    AuthResponse,
    LoginRequest,
    User,
    HealthCheckResponse,
    Recipe, // <--- Ensure Recipe is imported
    RecipeCreate, // <--- Ensure RecipeCreate is imported for creation
    RecipeSearch // <--- Ensure RecipeSearch is imported for searching
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
// (No changes needed here)

/**
 * Performs user login.
 * API Route: POST /api/auth/login
 */
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/login', credentials);
    return response.data;
};

/**
 * Fetches the current authenticated user's details.
 * API Route: GET /api/users/me (Standard FastAPI pattern for user retrieval)
 */
export const fetchCurrentUser = async (token: string): Promise<User> => {
    const response = await api.get<User>('/api/users/me', setAuthHeader(token));
    return response.data;
};


// --- 3. PANTRY ENDPOINTS ---
// (No changes needed here)

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
 * The payload (itemData) must match the IngredientReference schema from the backend.
 * API Route: POST /api/pantry/
 */
export const addPantryItem = async (
    token: string, 
    itemData: IngredientReference
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


// --- 4. RECIPE ENDPOINTS (ADDED) ---

/**
 * Fetching all recipes (list) from the backend.
 * API Route: GET /api/recipes/
 */
export const fetchAllRecipes = async (token: string): Promise<Recipe[]> => {
    // Assuming the recipe route is /api/recipes/
    const response = await api.get<Recipe[]>('/api/recipes/', setAuthHeader(token));
    return response.data;
};

/**
 * Fetching a single recipe by ID.
 * API Route: GET /api/recipes/{recipe_id}
 */
export const fetchRecipeById = async (token: string, recipeId: number): Promise<Recipe> => {
    const response = await api.get<Recipe>(`/api/recipes/${recipeId}`, setAuthHeader(token));
    return response.data;
};

/**
 * Creating a new recipe.
 * API Route: POST /api/recipes/
 */
export const createRecipe = async (token: string, recipeData: RecipeCreate): Promise<Recipe> => {
    const response = await api.post<Recipe>('/api/recipes/', recipeData, setAuthHeader(token));
    return response.data;
};

/**
 * Searching recipes with filters.
 * API Route: POST /api/recipes/search
 */
export const searchRecipes = async (token: string, searchParams: RecipeSearch): Promise<Recipe[]> => {
    const response = await api.post<Recipe[]>('/api/recipes/search', searchParams, setAuthHeader(token));
    return response.data;
};


// --- 5. UTILITY / HEALTH CHECK (UPDATED SECTION NUMBER) ---

/**
 * Health Check: GET /
 */
export const getHealth = async (): Promise<HealthCheckResponse> => {
    const response = await api.get<HealthCheckResponse>('/');
    return response.data;
};

// Export the configured instance for direct use if needed
export default api;