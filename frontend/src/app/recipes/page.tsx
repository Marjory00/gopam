// frontend/src/app/recipes/page.tsx

"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, Timer, Clock, Utensils, Package, PlusCircle, Filter } from 'lucide-react';

// FIX 1: Import the necessary types, API functions, and Auth hook
import { useAuth } from '@/lib/auth';
import { fetchAllRecipes } from '@/lib/api';
import { Recipe } from '@/lib/types';

// --- Component: RecipeCard ---

interface RecipeCardProps {
    recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    // Total time in minutes
    const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

    // Helper to determine badge color based on difficulty
    const getDifficultyClass = (level: string | null) => {
        switch (level?.toLowerCase()) {
            case 'easy':
                return 'bg-green-100 text-green-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'hard':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        // FIX 2: Use correct Link structure for Next.js navigation
        <Link href={`/recipes/${recipe.id}`} className="block h-full">
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col">
                {/* Image Placeholder with fallback */}
                <div className="bg-gray-100 h-40 w-full flex items-center justify-center text-gray-500 font-medium">
                    {recipe.image_url ? (
                        <img 
                            src={recipe.image_url} 
                            alt={recipe.title} 
                            className="w-full h-full object-cover" 
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src='https://placehold.co/600x400/D1D5DB/4B5563?text=Recipe+Image'; }}
                        />
                    ) : (
                        <Utensils className="w-10 h-10" />
                    )}
                </div>

                <div className="p-4 flex flex-col flex-grow">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 truncate" title={recipe.title}>
                        {recipe.title}
                    </h2>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
                        {recipe.description || 'No description available.'}
                    </p>

                    {/* Tags derived from API fields */}
                    <div className="flex flex-wrap gap-2 text-xs font-semibold mt-auto mb-3">
                        <span className={`px-2 py-1 rounded-full ${getDifficultyClass(recipe.difficulty_level)}`}>
                            {recipe.difficulty_level || 'N/A'}
                        </span>
                        {recipe.cuisine_type && (
                            <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                {recipe.cuisine_type}
                            </span>
                        )}
                        {recipe.meal_type && (
                            <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                                {recipe.meal_type}
                            </span>
                        )}
                    </div>
                    
                    <div className="pt-3 border-t border-gray-100 flex justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span className="font-semibold text-gray-700">{totalTime} min</span>
                        </div>
                        <div className="flex items-center">
                            <Timer className="w-4 h-4 mr-1" />
                            <span className="font-semibold text-gray-700">Serves {recipe.servings || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};


// --- Main Page Component ---

const RecipesPage = () => {
    // FIX 3: Initialize state for data fetching
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    // Use cuisine_type for the primary filter
    const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null); 

    const { token, isAuthenticated } = useAuth(); 

    // Fetch recipes on mount
    useEffect(() => {
        if (!isAuthenticated || !token) {
            setIsLoading(false);
            return;
        }

        const loadRecipes = async () => {
            try {
                setIsLoading(true);
                const data = await fetchAllRecipes(token);
                setRecipes(data);
                setError(null);
            } catch (err: any) {
                const errorMessage = err.response?.data?.detail || err.message || 'Failed to fetch recipes.';
                setError(errorMessage);
                setRecipes([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadRecipes();
    }, [isAuthenticated, token]);

    // Filtering recipes
    const filteredRecipes = useMemo(() => {
        let list = recipes;

        // 1. Filter by Search Term (title or description)
        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            list = list.filter(recipe =>
                recipe.title.toLowerCase().includes(lowerSearchTerm) ||
                (recipe.description?.toLowerCase().includes(lowerSearchTerm) ?? false)
            );
        }

        // 2. Filter by Selected Cuisine Type
        if (selectedCuisine) {
            list = list.filter(recipe => recipe.cuisine_type === selectedCuisine);
        }

        return list;
    }, [recipes, searchTerm, selectedCuisine]);

    // Extract all unique cuisine types for the filter buttons
    const uniqueCuisines = useMemo(() => {
        const allCuisines = recipes
            .map(recipe => recipe.cuisine_type)
            .filter((c): c is string => c !== null && c !== undefined);
        return Array.from(new Set(allCuisines)).sort();
    }, [recipes]);


    // FIX 4: Placeholder for AI generation (no alert())
    const handleAIRecipeGeneration = () => {
        console.log("AI Recipe Generator button clicked. Functionality TBD.");
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Removed Next/head import */}
            
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                
                {/* --- Header --- */}
                <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
                    <h1 className="text-4xl font-extrabold text-indigo-700 flex items-center">
                        <Utensils className="w-8 h-8 mr-3 text-red-500" /> Recipe Library
                    </h1>
                    <button
                        onClick={handleAIRecipeGeneration}
                        className="px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600 transition-colors flex items-center"
                    >
                        <PlusCircle className="w-5 h-5 mr-2" />
                        AI Recipe Generator
                    </button>
                </header>

                <p className="mb-8 text-lg text-gray-600">
                    Browse your collection or use the filters and search to find meals quickly.
                </p>

                {/* --- Search and Filter Area --- */}
                <div className="bg-white p-6 rounded-xl shadow-xl mb-10 border border-indigo-100">
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search recipes by name or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-500 mr-1" />
                        <span className="font-semibold text-gray-700 mr-2">Filter by Cuisine:</span>
                        
                        {/* All Cuisine Button */}
                        <button
                            onClick={() => setSelectedCuisine(null)}
                            className={`px-3 py-1 text-sm font-medium rounded-full transition-all ${!selectedCuisine ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-indigo-100'}`}
                        >
                            All Cuisines
                        </button>
                        
                        {/* Dynamic Cuisine Buttons */}
                        {uniqueCuisines.map(cuisine => (
                            <button
                                key={cuisine}
                                onClick={() => setSelectedCuisine(cuisine)}
                                className={`px-3 py-1 text-sm font-medium rounded-full transition-all ${selectedCuisine === cuisine ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-indigo-100'}`}
                            >
                                {cuisine}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- Recipe List --- */}
                <h3 className="text-2xl font-semibold mb-4 text-gray-700">Found Recipes ({filteredRecipes.length})</h3>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                        **Error Fetching Recipes:** {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="text-center p-10 text-xl text-gray-500">
                        <Package className="w-6 h-6 animate-spin mx-auto mb-3" />
                        Loading recipes...
                    </div>
                ) : filteredRecipes.length === 0 ? (
                    <div className="text-center p-10 border-dashed border-2 border-gray-300 rounded-lg">
                        <p className="text-xl text-gray-500">No recipes found matching your criteria.</p>
                        <p className="mt-2 text-gray-400">Try adjusting your search term or filter.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRecipes.map(recipe => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RecipesPage;
