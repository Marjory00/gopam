
// client/src/app/recommendations/page.tsx

'use client';

import { useState } from 'react';

interface RecommendedRecipe {
  id: number;
  name: string;
  description: string;
  matchScore: number; // Percentage of ingredients available in the pantry
  missingIngredients: string[];
}

// Placeholder data simulating AI results
const initialRecommendations: RecommendedRecipe[] = [
  { 
    id: 101, 
    name: "Spicy Coconut Curry", 
    description: "A warming curry that uses common spices and canned coconut milk.", 
    matchScore: 85, 
    missingIngredients: ["Cilantro", "Lime"] 
  },
  { 
    id: 102, 
    name: "One-Pan Roast Chicken & Potatoes", 
    description: "A simple, minimal-cleanup recipe, great for weeknights.", 
    matchScore: 100, 
    missingIngredients: [] 
  },
  { 
    id: 103, 
    name: "Homemade Pizza Dough", 
    description: "Basic recipe for baking your own pizza base.", 
    matchScore: 55, 
    missingIngredients: ["Yeast", "Mozzarella"] 
  },
];

/**
 * AI Recommendation Results Page
 * Displays recipes ranked by how well they match the user's current pantry inventory.
 */
export default function RecommendationsPage() {
  const [recommendations] = useState<RecommendedRecipe[]>(
    // Sort results by matchScore descending
    initialRecommendations.sort((a, b) => b.matchScore - a.matchScore)
  );

  return (
    <div className="recommendations-page">
      <h2 className="text-4xl font-extrabold mb-6 text-orange-700">AI Recipe Recommendations [ICON: AI]</h2>
      <p className="mb-8 text-gray-600">
        These recipes are ranked by the percentage of ingredients currently available in your pantry.
      </p>

      {/* --- Filter/Search Area Placeholder --- */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8 border-l-4 border-orange-500">
        <p className="font-semibold">Pantry Snapshot:</p>
        <p className="text-sm text-gray-600">Based on your latest inventory sync (e.g., Chicken, Garlic, Canned Tomatoes).</p>
      </div>

      {/* --- Recommendation List --- */}
      <h3 className="text-2xl font-semibold mb-4 text-gray-700">Top Matches ({recommendations.length})</h3>
      
      <div className="grid grid-cols-1 gap-6">
        {recommendations.map(recipe => (
          <RecommendationCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

// Recommendation Card Component
function RecommendationCard({ recipe }: { recipe: RecommendedRecipe }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex">
      {/* Left side: Match Score */}
      <div className={`w-32 shrink-0 flex flex-col items-center justify-center p-4 text-white font-bold 
                      ${recipe.matchScore === 100 ? 'bg-green-600' : 
                        recipe.matchScore >= 75 ? 'bg-orange-500' : 'bg-red-500'}`}>
        <div className="text-4xl">{recipe.matchScore}%</div>
        <div className="text-sm">Pantry Match</div>
      </div>
      
      {/* Right side: Recipe Details */}
      <div className="p-5 grow">
        <h4 className="text-2xl font-bold text-gray-800 mb-1">{recipe.name}</h4>
        <p className="text-gray-600 mb-3 text-sm">{recipe.description}</p>
        
        {/* Missing Ingredients Section */}
        {recipe.missingIngredients.length > 0 ? (
          <div className="mt-3 p-3 bg-red-50 border-l-4 border-red-400 rounded">
            <p className="text-sm font-semibold text-red-800 flex items-center">
              [ICON: Warning] Missing Ingredients:
            </p>
            <p className="text-xs text-red-700 mt-1">
              {recipe.missingIngredients.join(', ')}
            </p>
          </div>
        ) : (
          <div className="mt-3 p-3 bg-green-50 border-l-4 border-green-400 rounded">
            <p className="text-sm font-semibold text-green-800 flex items-center">
              [ICON: Check] You have everything!
            </p>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => alert(`View shopping list for ${recipe.name}`)}
            className="text-orange-600 hover:text-orange-800 text-sm font-medium transition-colors mr-4"
          >
            [ICON: Cart] View Shopping List
          </button>
          <button
            onClick={() => alert(`Viewing full recipe: ${recipe.name}`)}
            className="px-4 py-2 bg-indigo-500 text-white font-semibold rounded hover:bg-indigo-600 transition-colors"
          >
            [ICON: View] View Recipe
          </button>
        </div>
      </div>
    </div>
  );
}