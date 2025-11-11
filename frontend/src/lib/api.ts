// frontend/src/lib/api.ts

import axios, { AxiosInstance, AxiosResponse } from 'axios';

// --- 1. CONFIGURATION ---

// Get the base URL from the environment variables (http://localhost:8000 is the default)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

/**
 * Creates an Axios instance configured for the FastAPI backend.
 * This handles base URL, headers, and credentials.
 */
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
  // If you implement authentication (e.g., sessions or cookies), set this to true
  withCredentials: true, 
});

// --- 2. ERROR HANDLING (OPTIONAL) ---

// Optional: Add an interceptor to handle global errors (e.g., redirecting on 401)
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // Example: If a 401 Unauthorized response is received, log the user out/redirect.
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized request. User might need to log in again.');
      // You could add logic here: e.g., window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


// --- 3. CORE API METHODS (PLACEHOLDERS) ---

// Define the type for the health check response (from your root endpoint)
export interface HealthCheckResponse {
    message: string;
}

// Example types for a generic resource (like a Recipe or PantryItem)
export interface Resource {
    id: number;
    // Add common fields here
}

/**
 * API Client methods for Gopam.
 */
export const GopamAPI = {
  /**
   * Health Check: GET /
   */
  getHealth: (): Promise<AxiosResponse<HealthCheckResponse>> => {
    return api.get('/');
  },

  /**
   * Recipe Endpoints: GET /api/v1/recipes
   */
  recipes: {
    getAll: <T extends Resource>(): Promise<AxiosResponse<T[]>> => {
      // Assuming your FastAPI endpoint for recipes is /api/v1/recipes
      return api.get('/api/v1/recipes'); 
    },
    getById: <T extends Resource>(id: number): Promise<AxiosResponse<T>> => {
      return api.get(`/api/v1/recipes/${id}`);
    },
    // Add create, update, delete methods here
  },

  /**
   * Pantry Endpoints: GET /api/v1/pantry
   */
  pantry: {
    getAll: <T extends Resource>(): Promise<AxiosResponse<T[]>> => {
      // Assuming your FastAPI endpoint for pantry is /api/v1/pantry
      return api.get('/api/v1/pantry');
    },
    // Add getById, create, update, delete methods here
  },

  // Add other modules (meal-plan, ai, users) here...
};

// Export the configured instance for direct use if needed
export default api;