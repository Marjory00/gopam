// frontend/src/components/RecipeCard.tsx

import Link from 'next/link';
import { Clock, Utensils, Sparkles } from 'lucide-react'; // Using Clock and Utensils (and Sparkles for Matcher)

// --- Define the Recipe Type consistent with the Gopam API schema ---
// NOTE: In a real app, this interface should be imported from '@/lib/types'
interface Recipe {
    id: number;
    title: string;
    description: string | null;
    image_url: string | null;
    prep_time: number | null; // Prep time is a number (minutes) in the schema
    cook_time: number | null; // Cook time is a number (minutes)
    servings: number | null;
    difficulty_level: string | null;
    cuisine_type: string | null;
    meal_type: string | null;
}

// Define the props structure
interface RecipeCardProps {
    recipe: Recipe;
    matchScore?: number; // Optional score for the AI Matcher page
}

/**
 * Reusable component to display a single Recipe Card.
 */
export default function RecipeCard({ recipe, matchScore }: RecipeCardProps) {
    // Calculate total time
    const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
    const recipeUrl = `/recipes/${recipe.id}`;
    
    // Determine the primary tag to display (e.g., Cuisine)
    const primaryTag = recipe.cuisine_type || recipe.difficulty_level || recipe.meal_type;

    return (
        // FIX: Use Link component to enable client-side routing instead of using an alert button
        <Link href={recipeUrl} passHref className="block">
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full cursor-pointer">
                
                {/* Image and Match Score (Re-added for complete card design) */}
                <div className="relative h-40">
                    <img
                        src={recipe.image_url || '/placeholder-food.jpg'}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                    />
                    {matchScore !== undefined && (
                        <div className="absolute top-3 left-3 bg-yellow-500 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md flex items-center">
                            <Sparkles className="w-4 h-4 mr-1" />
                            Match: {(matchScore * 100).toFixed(0)}%
                        </div>
                    )}
                </div>

                <div className="p-4 flex flex-col flex-grow">
                    
                    {/* Title (FIX: Using 'title' instead of 'name') */}
                    <h4 className="text-xl font-bold text-indigo-700 mb-2 line-clamp-2">
                        {recipe.title}
                    </h4>
                    
                    {/* Description (FIX: Handle null description) */}
                    <p className="text-gray-600 mb-3 text-sm line-clamp-3 flex-grow">
                        {recipe.description || "No description available."}
                    </p>

                    {/* Tags (FIX: Using structured data instead of undefined 'tags' array) */}
                    <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-gray-100">
                        
                        {/* Time */}
                        {totalTime > 0 && (
                            <div className="text-sm font-medium text-gray-700 flex items-center">
                                {/* FIX: Timer replaced with Clock for Lucide consistency */}
                                <Clock className="w-4 h-4 mr-1 text-blue-500" />
                                <span className="font-normal">{totalTime} min</span>
                            </div>
                        )}
                        
                        {/* Primary Tag */}
                        {primaryTag && (
                            <span className="text-xs font-medium bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                                {primaryTag}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}

// FIX: Change named export to default export for consistent Next.js page usage
// export default RecipeCard;