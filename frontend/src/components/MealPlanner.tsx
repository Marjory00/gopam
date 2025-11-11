// frontend/src/components/MealPlanner.tsx

import React, { useState } from 'react';
import { ShoppingCart, RefreshCw, Loader2 } from 'lucide-react';

// NOTE: Placeholder for your actual Button component (assuming shadcn/ui or similar)
// If you don't have this, replace it with a standard <button> tag.
import { Button } from '@/components/ui/button'; 

// --- 1. Define Types and Mock Data ---

interface Meal {
    id: number;
    name: string;
    description: string;
}

interface DayPlan {
    day: string;
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
}

const MOCK_MEAL_PLAN: DayPlan[] = [
    {
        day: "Monday",
        breakfast: { id: 1, name: "Oatmeal with Berries", description: "Quick and healthy start." },
        lunch: { id: 2, name: "Chicken Salad Sandwich", description: "High-protein lunch." },
        dinner: { id: 3, name: "Lentil Soup", description: "Vegetarian comfort food." },
    },
    {
        day: "Tuesday",
        breakfast: { id: 4, name: "Scrambled Eggs", description: "Classic protein boost." },
        lunch: { id: 5, name: "Leftover Lentil Soup", description: "Easy reheat." },
        dinner: { id: 6, name: "Taco Tuesday", description: "Ground turkey tacos." },
    },
    {
        day: "Wednesday",
        breakfast: { id: 7, name: "Yogurt Parfait", description: "Layered with granola and honey." },
        lunch: { id: 8, name: "Tuna Wrap", description: "Quick prep with canned tuna." },
        dinner: { id: 9, name: "Pasta Primavera", description: "Fresh seasonal vegetables." },
    },
    // ... add more days for a full week
];

// --- 2. Meal Planner Component ---

export function MealPlanner() {
    const [isLoading, setIsLoading] = useState(false);
    const [mealPlan, setMealPlan] = useState<DayPlan[]>(MOCK_MEAL_PLAN);

    const generateNewPlan = async () => {
        setIsLoading(true);
        // Simulate an API call to your FastAPI backend /api/ai/generate_plan
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        
        // In a real app, this is where you'd fetch data.
        // For now, we'll just clear the plan to show the refresh worked.
        setMealPlan([]); 
        setIsLoading(false);
        alert("New plan generation initiated! (Currently showing empty state)");
    };

    return (
        <div className="p-6 max-w-7xl mx-auto bg-white shadow-xl rounded-lg mt-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                🍽️ Weekly Meal Planner
            </h1>

            {/* --- Control Panel --- */}
            <div className="flex justify-between items-center border-b pb-4 mb-6">
                <p className="text-lg text-gray-600">Plan for the week ahead.</p>
                <div className="space-x-3">
                    <Button 
                        variant="outline" 
                        onClick={() => alert("Shopping list generated!")}
                        className="flex items-center space-x-2 border-gray-300 hover:bg-gray-100"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        <span>Shopping List</span>
                    </Button>
                    <Button 
                        onClick={generateNewPlan} 
                        disabled={isLoading}
                        className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <RefreshCw className="w-5 h-5" />
                        )}
                        <span>{isLoading ? "Generating..." : "Generate New Plan"}</span>
                    </Button>
                </div>
            </div>

            {/* --- Meal Plan Grid --- */}
            <div className="grid grid-cols-4 gap-4 font-semibold text-center text-gray-700 bg-gray-50 p-2 rounded-t-lg border-b">
                <div>Day</div>
                <div>Breakfast</div>
                <div>Lunch</div>
                <div>Dinner</div>
            </div>
            
            <div className="border border-t-0 rounded-b-lg">
                {mealPlan.length === 0 && !isLoading ? (
                    <div className="p-10 text-center text-gray-500">
                        No meal plan generated yet. Click "Generate New Plan" to start!
                    </div>
                ) : (
                    mealPlan.map((dayPlan, index) => (
                        <div 
                            key={dayPlan.day} 
                            className={`grid grid-cols-4 gap-4 p-4 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b last:border-b-0`}
                        >
                            <div className="font-bold text-indigo-700">{dayPlan.day}</div>
                            <div className="text-sm">
                                <span className="font-medium">{dayPlan.breakfast.name}</span>
                                <p className="text-xs text-gray-500">{dayPlan.breakfast.description}</p>
                            </div>
                            <div className="text-sm">
                                <span className="font-medium">{dayPlan.lunch.name}</span>
                                <p className="text-xs text-gray-500">{dayPlan.lunch.description}</p>
                            </div>
                            <div className="text-sm">
                                <span className="font-medium">{dayPlan.dinner.name}</span>
                                <p className="text-xs text-gray-500">{dayPlan.dinner.description}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}