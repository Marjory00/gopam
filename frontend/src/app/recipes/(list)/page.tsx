// frontend/src/app/recipes/(list)/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Utensils, Plus, Loader2, XCircle } from 'lucide-react';

// Import custom components and utility functions
import { useAuth } from '@/lib/auth';
import { getRecipes } from '@/lib/api'; // Assuming this function exists in '@/lib/api'
import { Recipe } from '@/lib/types'; // Assuming Recipe type is defined here
import RecipeCard from '@/components/RecipeCard'; 

/**
 * Component for viewing and managing all available recipes.
 */
export default function RecipesPage() {
    const { token } = useAuth(); // We need the token for authenticated API calls
    
    // --- State Management ---
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Data Fetching: Get all recipes ---
    useEffect(() => {
        // Only attempt to fetch if we have a token (user is logged in)
        if (!token) {
            setError("Please log in to view the recipes.");
            setIsLoading(false);
            return;
        }

        async function fetchRecipes() {
            try {
                setError(null);
                const data = await getRecipes(token);
                setRecipes(data);
            } catch (err: any) {
                const errorMessage = err.response?.data?.detail || err.message || 'Failed to load recipes.';
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        }

        fetchRecipes();
    }, [token]);

    // --- Render Logic ---
    
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                
                {/* --- Header --- */}
                <header className="mb-8 pb-4 border-b border-gray-200 flex justify-between items-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
                        <Utensils className="w-8 h-8 mr-3 text-indigo-600" /> All Recipes
                    </h1>
                    <Link href="/recipes/new" passHref>
                        <button className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center">
                            <Plus className="w-5 h-5 mr-2" />
                            Add New Recipe
                        </button>
                    </Link>
                </header>
                
                {/* --- Loading State --- */}
                {isLoading && (
                    <div className="min-h-[40vh] flex items-center justify-center">
                        <Loader2 className="w-8 h-8 mr-3 animate-spin text-indigo-600" />
                        <p className="text-xl text-gray-700">Loading your recipes...</p>
                    </div>
                )}

                {/* --- Error Display --- */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 flex items-center">
                        <XCircle className="w-5 h-5 mr-3"/>
                        **Error:** {error}
                    </div>
                )}

                {/* --- Empty State --- */}
                {!isLoading && !error && recipes.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl shadow-md">
                        <Utensils className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                        <p className="text-xl text-gray-500">No recipes found. Be the first to add one!</p>
                        <Link href="/recipes/new" passHref>
                            <button className="mt-4 px-6 py-3 bg-green-500 text-white font-bold rounded-lg shadow-lg hover:bg-green-600 transition-colors">
                                Start Adding Recipes
                            </button>
                        </Link>
                    </div>
                )}
                
                {/* --- Recipes Grid --- */}
                {recipes.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {recipes.map((recipe) => (
                            <RecipeCard 
                                key={recipe.id} 
                                recipe={recipe as Recipe} // Ensure type consistency
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}