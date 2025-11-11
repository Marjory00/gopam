// frontend/src/app/recipes/page.tsx

'use client';

import { useState, useMemo } from 'react';
import Head from 'next/head';
import { Search, Tags, Timer, FlaskConical, PlusCircle } from 'lucide-react';

// Define the type for a Recipe
interface Recipe {
  id: number;
  name: string;
  description: string;
  tags: string[];
  prepTime: string;
}

// Placeholder Recipe Data (will be fetched from FastAPI later)
const initialRecipes: Recipe[] = [
  { id: 1, name: "Simple Tomato Pasta", description: "A quick and classic weeknight meal using canned ingredients.", tags: ["Italian", "Quick", "Vegetarian"], prepTime: "15 min" },
  { id: 2, name: "Chicken and Veggie Stir-fry", description: "Customizable stir-fry based on available pantry vegetables.", tags: ["Asian", "Healthy", "Dinner"], prepTime: "25 min" },
  { id: 3, name: "Overnight Oats", description: "Easy, healthy breakfast that requires no cooking.", tags: ["Breakfast", "Healthy", "No Cook"], prepTime: "5 min" },
  { id: 4, name: "Garlic Butter Steak", description: "A restaurant-quality steak cooked easily in a cast iron pan.", tags: ["Meat", "Dinner", "Impressive"], prepTime: "10 min" },
  { id: 5, name: "Lentil Soup", description: "Hearty and cheap soup, great for bulk cooking and storage.", tags: ["Vegetarian", "Batch", "Budget"], prepTime: "40 min" },
];

/**
 * Recipe Library Page
 * Allows users to browse, search, and filter stored recipes.
 */
export default function RecipesPage() {
  const [recipes] = useState<Recipe[]>(initialRecipes);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Use memoization to efficiently filter recipes based on search term and tag
  const filteredRecipes = useMemo(() => {
    let list = recipes;

    // 1. Filter by Search Term
    if (searchTerm) {
      list = list.filter(recipe =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Filter by Selected Tag
    if (selectedTag) {
      list = list.filter(recipe => recipe.tags.includes(selectedTag));
    }

    return list;
  }, [recipes, searchTerm, selectedTag]);

  // Extract all unique tags for the filter buttons
  const uniqueTags = useMemo(() => {
    const allTags = recipes.flatMap(recipe => recipe.tags);
    return Array.from(new Set(allTags)).sort();
  }, [recipes]);

  const handleAIRecipeGeneration = () => {
    alert("Triggering AI to generate a recipe based on current pantry and preferences!");
    // In a real app: Navigate to an AI generation form or modal
    // Call: POST /api/ai/generate-recipe
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Recipe Library - Gopam</title>
      </Head>
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        
        {/* --- Header --- */}
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-4xl font-extrabold text-indigo-700 flex items-center">
            <FlaskConical className="w-8 h-8 mr-3 text-indigo-600" /> Recipe Library
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
          Browse your collection or use the AI search to find meals based on ingredients in your pantry.
        </p>

        {/* --- Search and Filter Area --- */}
        <div className="bg-white p-6 rounded-xl shadow-xl mb-10 border border-indigo-100">
          <div className="relative mb-4">
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
            <Tags className="w-5 h-5 text-gray-500 mr-1" />
            <span className="font-semibold text-gray-700 mr-2">Filter by Tag:</span>
            
            {/* All Tag Button */}
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-all ${!selectedTag ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-indigo-100'}`}
            >
              All
            </button>
            
            {/* Dynamic Tag Buttons */}
            {uniqueTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-all ${selectedTag === tag ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-indigo-100'}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* --- Recipe List --- */}
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Found Recipes ({filteredRecipes.length})</h3>
        
        {filteredRecipes.length === 0 ? (
          <p className="text-gray-500 italic p-6 border border-red-200 rounded-lg bg-red-50">
            No recipes found matching your criteria. Try adjusting your search term or tag filter.
          </p>
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

// Simple Recipe Card Component
function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer">
      <div className="p-5">
        <h4 className="text-xl font-bold text-indigo-700 mb-2">{recipe.name}</h4>
        <p className="text-gray-600 mb-3 text-sm min-h-[40px]">{recipe.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-3 border-t border-gray-100 pt-3">
          {recipe.tags.map(tag => (
            <span key={tag} className="text-xs font-medium bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center mt-3">
          <p className="text-sm font-semibold text-gray-700 flex items-center">
            <Timer className="w-4 h-4 mr-1 text-blue-500" />
            Prep: <span className="font-normal ml-1">{recipe.prepTime}</span>
          </p>
          <button
            onClick={() => alert(`Viewing details for: ${recipe.name}`)}
            className="px-3 py-1 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors shadow"
          >
            View Recipe
          </button>
        </div>
      </div>
    </div>
  );
}