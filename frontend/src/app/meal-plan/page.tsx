// frontend/src/app/meal-plan/page.tsx
'use client';

import { useState } from 'react';
import Head from 'next/head';
import { MealPlanner } from '@/components/MealPlanner'; // Assuming path based on tsconfig paths
import { Button } from '@/components/ui/button'; // Placeholder for a generic UI button component
import { ShoppingCart, RefreshCw } from 'lucide-react'; // Placeholder for Lucide icons

// Define the shape of the data for a meal plan entry
interface MealPlan {
  day: string;
  meals: { time: 'Breakfast' | 'Lunch' | 'Dinner'; recipeId: number | null; recipeTitle: string | null }[];
}

// Placeholder function to fetch the weekly meal plan
async function fetchWeeklyMealPlan(): Promise<MealPlan[]> {
  // In a real application, this would use the 'api.ts' client to call the backend endpoint:
  // GET /api/meal-plan/weekly
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API latency
  
  // Mock Data
  return [
    { day: 'Monday', meals: [
      { time: 'Breakfast', recipeId: null, recipeTitle: null },
      { time: 'Lunch', recipeId: 4, recipeTitle: 'AI Salad Surprise' },
      { time: 'Dinner', recipeId: 10, recipeTitle: 'Pantry Pasta' },
    ]},
    { day: 'Tuesday', meals: [
      { time: 'Breakfast', recipeId: null, recipeTitle: null },
      { time: 'Lunch', recipeId: null, recipeTitle: null },
      { time: 'Dinner', recipeId: 15, recipeTitle: 'Taco Tuesday' },
    ]},
    { day: 'Wednesday', meals: [{ time: 'Breakfast', recipeId: null, recipeTitle: null }, { time: 'Lunch', recipeId: null, recipeTitle: null }, { time: 'Dinner', recipeId: null, recipeTitle: null }] },
    { day: 'Thursday', meals: [{ time: 'Breakfast', recipeId: null, recipeTitle: null }, { time: 'Lunch', recipeId: null, recipeTitle: null }, { time: 'Dinner', recipeId: null, recipeTitle: null }] },
    { day: 'Friday', meals: [{ time: 'Breakfast', recipeId: null, recipeTitle: null }, { time: 'Lunch', recipeId: null, recipeTitle: null }, { time: 'Dinner', recipeId: null, recipeTitle: null }] },
    { day: 'Saturday', meals: [{ time: 'Breakfast', recipeId: null, recipeTitle: null }, { time: 'Lunch', recipeId: null, recipeTitle: null }, { time: 'Dinner', recipeId: null, recipeTitle: null }] },
    { day: 'Sunday', meals: [{ time: 'Breakfast', recipeId: null, recipeTitle: null }, { time: 'Lunch', recipeId: null, recipeTitle: null }, { time: 'Dinner', recipeId: null, recipeTitle: null }] },
  ];
}

/**
 * Meal Planning Page component.
 * Features drag-and-drop planning, AI suggestions, and shopping list generation.
 */
export default function MealPlanPage() {
  const [mealPlan, setMealPlan] = useState<MealPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // In a real app, this would use React Query (or a similar data fetching library)
  // to manage loading state and caching.
  useState(() => {
    fetchWeeklyMealPlan().then(data => {
      setMealPlan(data);
      setIsLoading(false);
    });
  });

  const handleGenerateShoppingList = () => {
    alert('Generating shopping list based on the current meal plan!');
    // Incomplete plan deduction: items in the meal plan MINUS items in the pantry.
    // Call: POST /api/meal-plan/shopping-list
  };

  const handleGenerateAISuggestions = () => {
    alert('Requesting AI meal plan suggestions based on pantry and preferences!');
    // Call: POST /api/ai/meal-plan-suggest
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Meal Plan - Gopam</title>
      </Head>

      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-4xl font-extrabold text-indigo-700">
            Weekly Meal Planner
          </h1>
          <div className="space-x-3 flex">
            {/* AI Suggestion Button */}
            <Button 
              onClick={handleGenerateAISuggestions} 
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold flex items-center"
              disabled={isLoading}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              AI Suggestions
            </Button>
            
            {/* Shopping List Button */}
            <Button 
              onClick={handleGenerateShoppingList} 
              className="bg-green-500 hover:bg-green-600 text-white font-semibold flex items-center"
              disabled={isLoading}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Generate Shopping List
            </Button>
          </div>
        </header>

        <section className="bg-white shadow-xl rounded-lg p-6">
          {isLoading ? (
            <div className="text-center py-20 text-gray-500">
              Loading meal plan...
            </div>
          ) : (
            <>
              <p className="mb-6 text-gray-600">
                Drag and drop recipes from your saved list (not implemented yet) to plan your week, or use AI to fill the gaps!
              </p>
              {/* MealPlanner component placeholder */}
              <MealPlanner 
                weeklyPlan={mealPlan} 
                onPlanUpdate={setMealPlan} 
              />
              {/* Nutritional Balance Overview Placeholder */}
              <div className="mt-8 pt-4 border-t border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Nutritional Overview
                </h3>
                <p className="text-gray-500">
                  Total weekly calories, protein, and fat will be displayed here, analyzed by the AI engine.
                </p>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}