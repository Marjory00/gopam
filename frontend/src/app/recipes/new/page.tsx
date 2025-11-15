// frontend/src/app/recipes/new/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PlusCircle, Utensils, Send, XCircle, Loader2 } from 'lucide-react';

// Import types and API functions
import { useAuth } from '@/lib/auth';
import { createRecipe } from '@/lib/api';
import { RecipeCreate, IngredientReference } from '@/lib/types';

// --- Default Ingredient Setup ---
const initialIngredient: IngredientReference = {
    ingredient_id: 0, // Should be replaced by actual ID from database/user input
    quantity: 1,
    unit: 'unit',
    expiration_date: null, // Not strictly used for RecipeCreate but kept for consistency
};

/**
 * Component for creating a new recipe.
 */
export default function NewRecipePage() {
    const router = useRouter();
    const { token, isAuthenticated } = useAuth();

    // --- State Management ---
    const [recipeData, setRecipeData] = useState<Omit<RecipeCreate, 'ingredients'>>({
        title: '',
        instructions: '',
        description: null,
        image_url: null,
        prep_time: null,
        cook_time: null,
        servings: null,
        difficulty_level: null,
        cuisine_type: null,
        meal_type: null,
        nutrition_data: null,
    });

    const [ingredients, setIngredients] = useState<IngredientReference[]>([initialIngredient]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --- Handlers ---
    
    // Handler for main recipe fields
    const handleRecipeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setRecipeData(prev => ({
            ...prev,
            [name]: value === '' ? null : (name === 'prep_time' || name === 'cook_time' || name === 'servings') ? (value ? parseInt(value) : null) : value,
        }));
    };
    
    // Handler for nested ingredient fields
    const handleIngredientChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newIngredients = [...ingredients];
        
        // Handle number conversion for quantity
        if (name === 'quantity') {
            newIngredients[index] = {
                ...newIngredients[index],
                quantity: parseFloat(value) || 0,
            };
        } else {
            // Handle string fields (unit, ingredient_id as string, expiration_date)
            newIngredients[index] = {
                ...newIngredients[index],
                [name]: name === 'ingredient_id' ? parseInt(value) : value,
            };
        }
        
        setIngredients(newIngredients);
    };

    const addIngredient = () => {
        setIngredients(prev => [...prev, initialIngredient]);
    };

    const removeIngredient = (index: number) => {
        setIngredients(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated || !token) {
            setError('You must be logged in to create a recipe.');
            return;
        }

        // Basic validation: Check for required fields and valid ingredients (ID > 0)
        if (!recipeData.title || !recipeData.instructions) {
            setError('Title and Instructions are required.');
            return;
        }
        const validIngredients = ingredients.filter(ing => ing.ingredient_id > 0 && ing.quantity > 0 && ing.unit.trim() !== '');
        if (validIngredients.length === 0) {
            setError('Please add at least one valid ingredient (with ID, quantity, and unit).');
            return;
        }

        // Final payload construction
        const payload: RecipeCreate = {
            ...recipeData,
            // Ensure numeric fields are correctly null or number
            prep_time: recipeData.prep_time || null,
            cook_time: recipeData.cook_time || null,
            servings: recipeData.servings || null,
            
            ingredients: validIngredients,
        };

        try {
            setIsLoading(true);
            setError(null);
            
            const newRecipe = await createRecipe(token, payload);
            
            // Redirect to the newly created recipe's detail page
            router.push(`/recipes/${newRecipe.id}`);
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Failed to create recipe due to a server error.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Placeholder data for dropdowns (Ideally fetched from /api/ingredients)
    const mockIngredients = [
        { id: 1, name: 'Tomato' },
        { id: 2, name: 'Flour' },
        { id: 3, name: 'Chicken Breast' },
        { id: 4, name: 'Salt' },
        { id: 5, name: 'Olive Oil' },
    ];
    
    const difficultyOptions = ['Easy', 'Medium', 'Hard'];
    const cuisineOptions = ['Italian', 'Asian', 'Mexican', 'American', 'Other'];
    const mealOptions = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'];
    
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                
                {/* --- Header --- */}
                <header className="mb-8 pb-4 border-b border-gray-200">
                    <Link href="/recipes" className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm mb-2">
                        ← Back to Recipe List
                    </Link>
                    <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
                        <PlusCircle className="w-8 h-8 mr-3 text-red-500" /> New Recipe
                    </h1>
                    <p className="text-lg text-gray-600 mt-1">
                        Add a new recipe to your collection.
                    </p>
                </header>
                
                {/* --- Error Display --- */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 flex items-center">
                        <XCircle className="w-5 h-5 mr-3"/>
                        Creation Error: {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* --- 1. Basic Details --- */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
                        <h2 className="text-2xl font-bold text-indigo-700 mb-4 border-b pb-2 flex items-center"><Utensils className="w-5 h-5 mr-2"/> General Information</h2>
                        
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={recipeData.title}
                                onChange={handleRecipeChange}
                                required
                                placeholder="e.g., Spicy Chicken Stir-fry" // Added placeholder
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        
                        <div className="mt-4">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                            <textarea
                                id="description"
                                name="description"
                                value={recipeData.description || ''}
                                onChange={handleRecipeChange}
                                rows={2}
                                placeholder="A brief, appetizing summary of the dish." // Added placeholder
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div className="mt-4">
                            <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">Image URL (Optional)</label>
                            <input
                                type="url"
                                id="image_url"
                                name="image_url"
                                value={recipeData.image_url || ''}
                                onChange={handleRecipeChange}
                                placeholder="https://example.com/image.jpg" // Added placeholder
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                    
                    {/* --- 2. Instructions --- */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
                        <h2 className="text-2xl font-bold text-indigo-700 mb-4 border-b pb-2">Instructions <span className="text-red-500">*</span></h2>
                        <textarea
                            id="instructions"
                            name="instructions"
                            value={recipeData.instructions}
                            onChange={handleRecipeChange}
                            rows={6}
                            required
                            placeholder="Enter instructions, separating steps with a new line."
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    
                    {/* --- 3. Metadata (Times, Servings, Difficulty) --- */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 grid grid-cols-2 md:grid-cols-4 gap-4">
                        
                        {/* Prep Time */}
                        <div>
                            <label htmlFor="prep_time" className="block text-sm font-medium text-gray-700">Prep Time (min)</label>
                            <input
                                type="number"
                                id="prep_time"
                                name="prep_time"
                                value={recipeData.prep_time || ''}
                                onChange={handleRecipeChange}
                                min="0"
                                placeholder="e.g., 15" // Added placeholder
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                        
                        {/* Cook Time */}
                        <div>
                            <label htmlFor="cook_time" className="block text-sm font-medium text-gray-700">Cook Time (min)</label>
                            <input
                                type="number"
                                id="cook_time"
                                name="cook_time"
                                value={recipeData.cook_time || ''}
                                onChange={handleRecipeChange}
                                min="0"
                                placeholder="e.g., 30" // Added placeholder
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                        
                        {/* Servings */}
                        <div>
                            <label htmlFor="servings" className="block text-sm font-medium text-gray-700">Servings</label>
                            <input
                                type="number"
                                id="servings"
                                name="servings"
                                value={recipeData.servings || ''}
                                onChange={handleRecipeChange}
                                min="1"
                                placeholder="e.g., 4" // Added placeholder
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                        
                        {/* Difficulty */}
                        <div>
                            <label htmlFor="difficulty_level" className="block text-sm font-medium text-gray-700">Difficulty</label>
                            <select
                                id="difficulty_level"
                                name="difficulty_level"
                                value={recipeData.difficulty_level || ''}
                                onChange={handleRecipeChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                            >
                                <option value="">Select...</option>
                                {difficultyOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Cuisine */}
                        <div>
                            <label htmlFor="cuisine_type" className="block text-sm font-medium text-gray-700">Cuisine</label>
                            <select
                                id="cuisine_type"
                                name="cuisine_type"
                                value={recipeData.cuisine_type || ''}
                                onChange={handleRecipeChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                            >
                                <option value="">Select...</option>
                                {cuisineOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Meal Type */}
                        <div>
                            <label htmlFor="meal_type" className="block text-sm font-medium text-gray-700">Meal Type</label>
                            <select
                                id="meal_type"
                                name="meal_type"
                                value={recipeData.meal_type || ''}
                                onChange={handleRecipeChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                            >
                                <option value="">Select...</option>
                                {mealOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    {/* --- 4. Ingredients List --- */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
                        <h2 className="text-2xl font-bold text-indigo-700 mb-4 border-b pb-2">Ingredients <span className="text-red-500">*</span></h2>
                        
                        <div className="space-y-4">
                            {ingredients.map((ingredient, index) => (
                                <div key={index} className="flex space-x-2 items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    {/* Ingredient ID (Selection) */}
                                    <div className="flex-grow">
                                        {/* FIX: Use htmlFor to associate label with select */}
                                        <label htmlFor={`ingredient_id-${index}`} className="block text-xs font-medium text-gray-500">Ingredient Name / ID</label>
                                        <select
                                            name="ingredient_id"
                                            id={`ingredient_id-${index}`} // FIX: Added unique ID
                                            value={ingredient.ingredient_id}
                                            onChange={(e) => handleIngredientChange(index, e)}
                                            required
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                        >
                                            <option value="0">Select Ingredient...</option>
                                            {/* NOTE: In a real app, this list would be fetched dynamically and support search/autocomplete. */}
                                            {mockIngredients.map(ing => (
                                                <option key={ing.id} value={ing.id}>{ing.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    {/* Quantity */}
                                    <div className="w-1/6">
                                        {/* FIX: Use htmlFor to associate label with input */}
                                        <label htmlFor={`quantity-${index}`} className="block text-xs font-medium text-gray-500">Quantity</label>
                                        <input
                                            type="number"
                                            name="quantity"
                                            id={`quantity-${index}`} // FIX: Added unique ID
                                            value={ingredient.quantity}
                                            onChange={(e) => handleIngredientChange(index, e)}
                                            required
                                            step="0.1"
                                            min="0.1"
                                            placeholder="1" // Added placeholder
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                                        />
                                    </div>
                                    
                                    {/* Unit */}
                                    <div className="w-1/6">
                                        {/* FIX: Use htmlFor to associate label with input */}
                                        <label htmlFor={`unit-${index}`} className="block text-xs font-medium text-gray-500">Unit</label>
                                        <input
                                            type="text"
                                            name="unit"
                                            id={`unit-${index}`} // FIX: Added unique ID
                                            value={ingredient.unit}
                                            onChange={(e) => handleIngredientChange(index, e)}
                                            required
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                                            placeholder="e.g., cups, lbs, tsp"
                                        />
                                    </div>
                                    
                                    {/* Remove Button */}
                                    <button
                                        type="button"
                                        onClick={() => removeIngredient(index)}
                                        className="mt-4 p-2 text-red-600 hover:text-red-800 transition duration-150"
                                        title="Remove ingredient"
                                    >
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        <button
                            type="button"
                            onClick={addIngredient}
                            className="mt-4 px-4 py-2 border border-dashed border-indigo-400 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition duration-300 flex items-center"
                        >
                            <PlusCircle className="w-5 h-5 mr-2" />
                            Add Ingredient
                        </button>
                    </div>
                    
                    {/* --- 5. Submission --- */}
                    <div className="pt-5 flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-xl flex items-center transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5 mr-2" />
                                    Create Recipe
                                </>
                            )}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}