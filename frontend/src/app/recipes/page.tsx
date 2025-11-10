// client/src/app/recipes/page.tsx

'use client';

import { useState, useMemo } from 'react';

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

  return (
    <div className="recipe-library">
      <h2 className="text-4xl font-extrabold mb-6 text-indigo-800">Recipe Library 📚</h2>
      <p className="mb-8 text-gray-600">
        Browse your collection or use the AI search to find meals based on ingredients in your pantry.
      </p>

      {/* --- Search and Filter Area --- */}
      <div className="bg-white p-6 rounded-lg shadow-xl mb-10 border border-gray-100">
        <input
          type="text"
          placeholder="Search recipes by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-indigo-500 focus:border-indigo-500"
        />

        <div className="flex flex-wrap gap-2">
          <span className="font-semibold text-gray-700 mr-2">Filter by Tag:</span>
          
          {/* All Tag Button */}
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${!selectedTag ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            All
          </button>
          
          {/* Dynamic Tag Buttons */}
          {uniqueTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${selectedTag === tag ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* --- Recipe List --- */}
      <h3 className="text-2xl font-semibold mb-4 text-gray-700">Found Recipes ({filteredRecipes.length})</h3>
      
      {filteredRecipes.length === 0 ? (
        <p className="text-gray-500 italic p-4 border rounded-lg bg-red-50">No recipes found matching your criteria. Try a different search term or tag.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}

// Simple Recipe Card Component
function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="p-5">
        <h4 className="text-xl font-bold text-indigo-700 mb-2">{recipe.name}</h4>
        <p className="text-gray-600 mb-3 text-sm">{recipe.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {recipe.tags.map(tag => (
            <span key={tag} className="text-xs font-medium bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center border-t pt-3 mt-3">
          <p className="text-sm font-semibold text-gray-700">
            Prep Time: <span className="font-normal">{recipe.prepTime}</span>
          </p>
          <button
            onClick={() => alert(`Viewing details for: ${recipe.name}`)}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
          >
            View Recipe →
          </button>
        </div>
      </div>
    </div>
  );
}