// frontend/src/app/recommendations/page.tsx

'use client';

import { useState } from 'react';
import Head from 'next/head';
import { Bot, AlertTriangle, CheckCircle, ShoppingCart, Eye, Package } from 'lucide-react';

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
    missingIngredients: ["Cilantro", "Lime", "Curry Paste"] 
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
    missingIngredients: ["Yeast", "Mozzarella", "Tomato Sauce"] 
  },
  { 
    id: 104, 
    name: "Pantry Black Bean Burgers", 
    description: "Hearty vegetarian burgers made with basic pantry staples.", 
    matchScore: 78, 
    missingIngredients: ["Bread Crumbs"] 
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
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>AI Recommendations - Gopam</title>
      </Head>
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">

        {/* --- Header --- */}
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-4xl font-extrabold text-indigo-700 flex items-center">
            <Bot className="w-8 h-8 mr-3 text-orange-500" /> AI Recipe Recommendations
          </h1>
        </header>

        <p className="mb-8 text-lg text-gray-600">
          These recipes are dynamically generated and ranked by the percentage of ingredients currently available in your pantry. Cook smarter, waste less!
        </p>

        {/* --- Pantry Snapshot Card --- */}
        <div className="bg-white p-6 rounded-xl shadow-xl mb-10 border-l-4 border-orange-500">
          <p className="font-bold text-gray-800 flex items-center mb-1">
            <Package className="w-5 h-5 mr-2 text-orange-500" /> Current Pantry Snapshot:
          </p>
          <p className="text-sm text-gray-600">
            Based on your latest inventory sync (e.g., Chicken, Garlic, Onions, Canned Tomatoes). Remember to update your Pantry page for the most accurate results.
          </p>
        </div>

        {/* --- Recommendation List --- */}
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Top Matches ({recommendations.length})</h3>
        
        <div className="grid grid-cols-1 gap-6">
          {recommendations.map(recipe => (
            <RecommendationCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Recommendation Card Component
function RecommendationCard({ recipe }: { recipe: RecommendedRecipe }) {
  const getMatchColor = (score: number) => {
    if (score === 100) return 'bg-green-600';
    if (score >= 80) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col md:flex-row">
      {/* Left side: Match Score */}
      <div className={`md:w-32 shrink-0 flex flex-row md:flex-col items-center justify-center p-4 text-white font-extrabold transition-colors ${getMatchColor(recipe.matchScore)}`}>
        <div className="text-4xl">{recipe.matchScore}%</div>
        <div className="text-sm ml-2 md:ml-0 md:mt-1">Pantry Match</div>
      </div>
      
      {/* Right side: Recipe Details */}
      <div className="p-5 grow">
        <h4 className="text-2xl font-bold text-gray-800 mb-1">{recipe.name}</h4>
        <p className="text-gray-600 mb-3 text-sm">{recipe.description}</p>
        
        {/* Missing Ingredients Section */}
        {recipe.missingIngredients.length > 0 ? (
          <div className="mt-3 p-3 bg-red-50 border-l-4 border-red-400 rounded flex flex-col sm:flex-row sm:items-center">
            <p className="text-sm font-semibold text-red-800 flex items-center shrink-0 mb-1 sm:mb-0">
              <AlertTriangle className="w-4 h-4 mr-2" /> Missing Ingredients:
            </p>
            <p className="text-xs text-red-700 sm:ml-2">
              {recipe.missingIngredients.join(', ')}
            </p>
          </div>
        ) : (
          <div className="mt-3 p-3 bg-green-50 border-l-4 border-green-400 rounded flex items-center">
            <CheckCircle className="w-4 h-4 mr-2 text-green-700" />
            <p className="text-sm font-semibold text-green-800">
              You have everything! Ready to cook.
            </p>
          </div>
        )}

        <div className="mt-4 flex justify-end space-x-3">
          <button
            onClick={() => alert(`Viewing missing ingredients and shopping list additions for: ${recipe.name}`)}
            className="text-orange-600 hover:text-orange-800 text-sm font-medium transition-colors flex items-center p-2 rounded-lg hover:bg-orange-50"
          >
            <ShoppingCart className="w-4 h-4 mr-1" /> Shopping List
          </button>
          <button
            onClick={() => alert(`Viewing full recipe: ${recipe.name}`)}
            className="px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition-colors shadow-md flex items-center"
          >
            <Eye className="w-4 h-4 mr-2" /> View Recipe
          </button>
        </div>
      </div>
    </div>
  );
}