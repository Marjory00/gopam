// frontend/src/components/RecipeCard.tsx

import React from 'react';
import { Timer } from 'lucide-react';

// Define the type for a Recipe, consistent with the rest of the application
interface Recipe {
  id: number;
  name: string;
  description: string;
  tags: string[];
  prepTime: string;
}

/**
 * Reusable component to display a single Recipe Card.
 * @param recipe - The recipe data object.
 */
export function RecipeCard({ recipe }: { recipe: Recipe }) {
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
            onClick={() => alert(`Viewing full recipe details for: ${recipe.name}`)}
            className="px-3 py-1 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors shadow"
          >
            View Recipe
          </button>
        </div>
      </div>
    </div>
  );
}