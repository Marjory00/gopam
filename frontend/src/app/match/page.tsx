
// frontend/src/app/match/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Utensils, Send, Loader2, XCircle } from 'lucide-react';

// Import types and API functions
import { useAuth } from '@/lib/auth';
import { getIngredients, getRecipeMatch } from '@/lib/api';
import { Ingredient, Recipe, RecipeMatchResult } from '@/lib/types';
import RecipeCard from '@/components/RecipeCard'; // Assuming a reusable RecipeCard component is available

/**
 * Component for finding AI-suggested recipes based on pantry ingredients.
 */
export default function RecipeMatchPage() {
    const { token, isAuthenticated } = useAuth();

    // --- State Management ---
    const [availableIngredients, setAvailableIngredients] = useState<Ingredient[]>([]);
    const [selectedIngredientIds, setSelectedIngredientIds] = useState<number[]>([]);
    const [matchResults, setMatchResults] = useState<RecipeMatchResult[]>([]);
    
    const [isFetchingIngredients, setIsFetchingIngredients] = useState(true);
    const [isLoadingMatch, setIsLoadingMatch] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --- Data Fetching: Get all ingredients (to populate selector) ---
    useEffect(() => {
        if (!isAuthenticated || !token) {
            setError('You must be logged in to use the recipe matcher.');
            setIsFetchingIngredients(false);
            return;
        }

        async function fetchIngredients() {
            try {
                setError(null);
                const data = await getIngredients(token);
                setAvailableIngredients(data);
            } catch (err: any) {
                const errorMessage = err.response?.data?.detail || err.message || 'Failed to load ingredients.';
                setError(errorMessage);
            } finally {
                setIsFetchingIngredients(false);
            }
        }

        fetchIngredients();
    }, [isAuthenticated, token]);

    // --- Handlers ---

    const handleIngredientToggle = (ingredientId: number) => {
        setSelectedIngredientIds(prev =>
            prev.includes(ingredientId)
                ? prev.filter(id => id !== ingredientId) // Remove
                : [...prev, ingredientId] // Add
        );
    };

    const handleMatchSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated || !token) {
            setError('You must be logged in to generate matches.');
            return;
        }

        if (selectedIngredientIds.length === 0) {
            setError('Please select at least one ingredient from your pantry.');
            return;
        }

        try {
            setIsLoadingMatch(true);
            setError(null);
            setMatchResults([]);
            
            // Call the AI matching API
            const results = await getRecipeMatch(token, selectedIngredientIds);
            
            setMatchResults(results);
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Failed to get recipe matches.';
            setError(errorMessage);
        } finally {
            setIsLoadingMatch(false);
        }
    };
    
    // Helper to get selected ingredient names for display/debugging
    const getSelectedNames = () => {
        return availableIngredients
            .filter(ing => selectedIngredientIds.includes(ing.id))
            .map(ing => ing.name);
    };

    // --- Render Logic ---
    
    if (isFetchingIngredients) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 mr-3 animate-spin text-indigo-600" />
                <p className="text-xl text-gray-700">Loading Ingredients...</p>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                
                {/* --- Header --- */}
                <header className="mb-8 pb-4 border-b border-gray-200">
                    <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
                        <Sparkles className="w-8 h-8 mr-3 text-yellow-500" /> AI Recipe Matcher
                    </h1>
                    <p className="text-lg text-gray-600 mt-1">
                        Select the ingredients you currently have, and let our AI suggest the perfect recipes!
                    </p>
                </header>
                
                {/* --- Error Display --- */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 flex items-center">
                        <XCircle className="w-5 h-5 mr-3"/>
                        **Error:** {error}
                    </div>
                )}
                
                {/* --- Ingredient Selection Form --- */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-yellow-100 mb-8">
                    <h2 className="text-2xl font-bold text-yellow-700 mb-4 border-b pb-2 flex items-center"><Utensils className="w-5 h-5 mr-2"/> Your Pantry</h2>
                    
                    <form onSubmit={handleMatchSubmit}>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-80 overflow-y-auto p-2 border rounded-md bg-gray-50">
                            
                            {availableIngredients.length === 0 ? (
                                <p className="col-span-full text-center py-4 text-gray-500">No ingredients available. Check the backend connection or add ingredients first.</p>
                            ) : (
                                availableIngredients.map(ing => (
                                    <button
                                        key={ing.id}
                                        type="button"
                                        onClick={() => handleIngredientToggle(ing.id)}
                                        className={`px-3 py-1 text-sm rounded-full transition-all duration-200 shadow-sm border ${
                                            selectedIngredientIds.includes(ing.id)
                                                ? 'bg-yellow-500 text-white border-yellow-600'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-yellow-50'
                                        }`}
                                    >
                                        {ing.name}
                                    </button>
                                ))
                            )}
                        </div>
                        
                        <div className="mt-6 flex justify-between items-center">
                            <p className="text-sm text-gray-600">
                                Selected: **{selectedIngredientIds.length}** ingredients
                            </p>
                            
                            <button
                                type="submit"
                                disabled={isLoadingMatch || selectedIngredientIds.length === 0}
                                className={`px-6 py-3 bg-yellow-600 text-white font-bold rounded-lg shadow-xl flex items-center transition-colors ${isLoadingMatch || selectedIngredientIds.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-700'}`}
                            >
                                {isLoadingMatch ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Matching...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5 mr-2" />
                                        Find Recipes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
                
                {/* --- Match Results Display --- */}
                <section>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                        <Utensils className="w-6 h-6 mr-2 text-indigo-600" /> Suggested Recipes
                    </h2>

                    {matchResults.length > 0 && (
                        <div className="mb-4 text-green-700 bg-green-100 p-3 rounded-lg border border-green-200">
                            **Success!** Found **{matchResults.length}** recipes based on: {getSelectedNames().join(', ')}.
                        </div>
                    )}

                    {matchResults.length === 0 && !isLoadingMatch && !error ? (
                        <div className="text-center py-10 bg-white rounded-xl shadow-md">
                            <Sparkles className="w-10 h-10 mx-auto text-yellow-400 mb-3" />
                            <p className="text-xl text-gray-500">Select your ingredients above and click "Find Recipes" to see suggestions.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {matchResults.map((match) => (
                                // NOTE: We assume RecipeCard can handle the Recipe object nested in RecipeMatchResult
                                <RecipeCard 
                                    key={match.recipe.id} 
                                    recipe={match.recipe as Recipe} // Cast the nested object to Recipe type
                                    matchScore={match.match_score}
                                />
                            ))}
                        </div>
                    )}
                </section>
                
            </div>
        </div>
    );
}