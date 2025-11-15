// frontend/src/app/recipes/[recipes_id]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Utensils, Clock, User, Soup, ListChecks, Loader2, XCircle } from 'lucide-react';

// Import custom components and utility functions
import { useAuth } from '@/lib/auth';
import { getRecipeById } from '@/lib/api'; // Assuming this function exists in '@/lib/api'
import { RecipeDetail } from '@/lib/types'; // Assuming RecipeDetail type is defined here

/**
 * Defines the structure for the dynamic URL parameters.
 */
interface Params {
    recipes_id: string;
}

/**
 * Component for viewing the detailed information of a single recipe.
 */
export default function RecipeDetailPage() {
    const { token } = useAuth();
    const params = useParams<Params>();
    const recipeId = params.recipes_id;

    // --- State Management ---
    const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Data Fetching: Get single recipe by ID ---
    useEffect(() => {
        if (!token || !recipeId) {
            if (!token) setError("You must be logged in to view recipe details.");
            setIsLoading(false);
            return;
        }

        async function fetchRecipe() {
            try {
                setError(null);
                const data = await getRecipeById(token, Number(recipeId));
                setRecipe(data);
            } catch (err: any) {
                const errorMessage = err.response?.data?.detail || err.message || 'Failed to load recipe details.';
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        }

        fetchRecipe();
    }, [token, recipeId]);

    // --- Render Logic: Loading/Error ---

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 mr-3 animate-spin text-indigo-600" />
                <p className="text-xl text-gray-700">Loading recipe details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto py-10 px-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-8 rounded-lg relative text-center">
                    <XCircle className="w-10 h-10 mx-auto mb-3"/>
                    <h2 className="text-2xl font-bold mb-2">Error Loading Recipe</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }
    
    if (!recipe) {
        return (
            <div className="max-w-4xl mx-auto py-10 px-4 text-center">
                 <Utensils className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                <p className="text-xl text-gray-500">Recipe not found.</p>
            </div>
        );
    }

    // --- Render Logic: Detail View ---

    // Calculate total time
    const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                
                {/* Recipe Header */}
                <header className="mb-8">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-2">
                        {recipe.title}
                    </h1>
                    <p className="text-xl text-gray-600 border-b pb-4 mb-4">
                        {recipe.description}
                    </p>
                </header>

                {/* Image and Metadata Block */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    <div className="lg:col-span-2">
                        <img
                            src={recipe.image_url || '/placeholder-food.jpg'}
                            alt={recipe.title}
                            className="w-full h-96 object-cover rounded-xl shadow-lg"
                        />
                    </div>
                    
                    <aside className="bg-white p-6 rounded-xl shadow-md border border-indigo-100">
                        <h2 className="text-2xl font-bold text-indigo-700 mb-4 border-b pb-2">Details</h2>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-center">
                                <Clock className="w-5 h-5 mr-3 text-blue-500" />
                                **Total Time:** {totalTime > 0 ? `${totalTime} minutes` : 'N/A'}
                            </li>
                            <li className="flex items-center">
                                <Utensils className="w-5 h-5 mr-3 text-green-500" />
                                **Servings:** {recipe.servings || 'N/A'}
                            </li>
                            <li className="flex items-center">
                                <User className="w-5 h-5 mr-3 text-purple-500" />
                                **Difficulty:** {recipe.difficulty_level || 'N/A'}
                            </li>
                            <li className="flex items-center">
                                <Soup className="w-5 h-5 mr-3 text-orange-500" />
                                **Cuisine:** {recipe.cuisine_type || 'General'}
                            </li>
                        </ul>
                    </aside>
                </div>

                {/* Ingredients and Instructions Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    
                    {/* Ingredients List */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center border-b pb-2">
                            <ListChecks className="w-6 h-6 mr-3 text-teal-600" /> Ingredients
                        </h2>
                        <ul className="space-y-3 list-disc pl-5 text-gray-700">
                            {recipe.ingredients.length > 0 ? (
                                recipe.ingredients.map((item, index) => (
                                    <li key={index} className="text-lg">
                                        {item.name}: **{item.quantity}** {item.unit}
                                    </li>
                                ))
                            ) : (
                                <li className="text-gray-500">No ingredients listed.</li>
                            )}
                        </ul>
                    </div>

                    {/* Instructions */}
                    <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center border-b pb-2">
                            <Utensils className="w-6 h-6 mr-3 text-yellow-600" /> Instructions
                        </h2>
                        {recipe.instructions ? (
                            <ol className="space-y-5 text-gray-700">
                                {recipe.instructions.split('\n').map((step, index) => (
                                    step.trim() ? (
                                        <li key={index} className="text-lg flex">
                                            <span className="font-bold text-yellow-600 mr-3">{index + 1}.</span>
                                            <span className="flex-grow">{step.trim()}</span>
                                        </li>
                                    ) : null
                                ))}
                            </ol>
                        ) : (
                            <p className="text-gray-500 text-lg">No instructions provided for this recipe.</p>
                        )}
                    </div>
                </div>
                
            </div>
        </div>
    );
}