// frontend/src/lib/api.ts

import axios, { AxiosInstance } from 'axios';
import {
    PantryItem,
    IngredientReference,
    AuthResponse,
    LoginRequest,
    User,
    HealthCheckResponse // Assuming this type is also defined
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
    itemData: IngredientReference // Data includes ingredient_id, quantity, unit, expiration_date
): Promise<PantryItem> => {
    const response = await api.post<PantryItem>('/api/pantry/', itemData, setAuthHeader(token));
    return response.data;
};

/**
 * Removing a pantry item by its unique PantryItem ID.
 * API Route: DELETE /api/pantry/{item_id}
 */
export const removePantryItem = async (token: string, itemId: number): Promise<void> => {
    // A successful delete returns 204 No Content, so we don't expect data.
    await api.delete(`/api/pantry/${itemId}`, setAuthHeader(token));
};


// --- 4. UTILITY / HEALTH CHECK ---

/**
 * Health Check: GET /
 */
export const getHealth = async (): Promise<HealthCheckResponse> => {
    const response = await api.get<HealthCheckResponse>('/');
    return response.data;
};

// Export the configured instance for direct use if needed (e.g., in other interceptors)
export default api;