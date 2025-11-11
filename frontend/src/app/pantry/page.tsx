// frontend/src/app/pantry/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Trash2, PlusCircle, AlarmClock, Package, XCircle } from 'lucide-react'; 

// FIX 1: Import the necessary types, API, and Auth hooks
import { useAuth } from '@/lib/auth'; 
import { fetchPantryItems, addPantryItem, removePantryItem } from '@/lib/api'; 
import { PantryItem as ApiPantryItem, IngredientReference } from '@/lib/types'; 

// Rename the imported type to avoid conflict with the local mock data (for now)
type DisplayPantryItem = ApiPantryItem; 

/**
 * Pantry Inventory Management Page
 * Allows users to view, add, and remove ingredients from their inventory.
 */
export default function PantryPage() {
    const { isAuthenticated, token } = useAuth(); // FIX 2: Use actual auth hook
    const [pantryItems, setPantryItems] = useState<DisplayPantryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // FIX 3: Refactor the new item state to match API requirements (IngredientReference)
    const [newItem, setNewItem] = useState<Omit<IngredientReference, 'ingredient_id'> & { name: string }>({ 
        name: '', 
        quantity: 0, 
        unit: '', 
        // expiration_date is optional and often handled via a date picker's string value
    });

    // --- Data Fetching Effect ---
    useEffect(() => {
        if (!isAuthenticated || !token) {
            setIsLoading(false);
            return;
        }

        const loadPantry = async () => {
            try {
                setIsLoading(true);
                // FIX 4: Call the API utility function
                const data = await fetchPantryItems(token); 
                setPantryItems(data);
                setError(null);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch pantry items.');
                setPantryItems([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadPantry();
    }, [isAuthenticated, token]); 
    // --- END Data Fetching Effect ---

    // Handles input changes for the Add Item form
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: name === 'quantity' ? parseFloat(value) : value }));
    };

    // Handles adding a new item (Now connects to the backend API)
    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // **Simplified for now:** In a real app, 'name' must be converted to 'ingredient_id' 
        // by searching the master ingredient list via another API call.
        // For this fix, we'll assume a mock ID or use a simplified workflow.
        const MOCK_INGREDIENT_ID = 10; // Placeholder for a successful ingredient lookup

        if (newItem.name && newItem.quantity > 0 && newItem.unit) {
            try {
                // FIX 5: Use the API utility to post the new item
                const itemToCreate: IngredientReference = {
                    ingredient_id: MOCK_INGREDIENT_ID, // Needs real lookup logic
                    quantity: newItem.quantity,
                    unit: newItem.unit,
                    expiration_date: newItem.expiration_date || undefined,
                };

                const addedItem = await addPantryItem(token, itemToCreate); 
                
                // NOTE: The addedItem from the API will be a complete ApiPantryItem.
                setPantryItems(prev => [...prev, addedItem]);
                setNewItem({ name: '', quantity: 0, unit: '', expiration_date: '' }); // Clear form
                console.log(`New item added: ${addedItem.ingredient.name}.`);

            } catch (err: any) {
                setError(err.message || 'Failed to add item to pantry.');
            }
        }
    };
    
    // Handles removing an item (Now connects to the backend API)
    const handleRemoveItem = async (id: number) => {
        try {
            // FIX 6: Use the API utility to delete the item
            await removePantryItem(token, id); 
            setPantryItems(prev => prev.filter(item => item.id !== id));
        } catch (err: any) {
            setError(err.message || 'Failed to remove item from pantry.');
        }
    };
    
    // Helper function to check for expiration
    const isExpiring = (dateStr: string | null) => {
        if (!dateStr) return false;
        const expirationTime = new Date(dateStr).getTime();
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        return expirationTime < Date.now() || (expirationTime - Date.now() < oneWeek);
    };

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-bold mb-6">Your Pantry 📦</h1>
                <p className="text-lg text-red-600">Please log in to view your pantry.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* FIX 7: Remove next/head which is deprecated */}
            {/* <Head> <title>Pantry Inventory - Gopam</title> </Head> */}
            <title>Pantry Inventory - Gopam</title>

            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                
                {/* --- Header --- */}
                <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
                    <h1 className="text-4xl font-extrabold text-indigo-700 flex items-center">
                        <Package className="w-8 h-8 mr-3 text-green-600" /> Your Pantry Inventory
                    </h1>
                </header>
                <p className="mb-8 text-lg text-gray-600">
                    Keeping this list accurate allows Gopam to provide the best AI-powered recipe recommendations and prevent food waste!
                </p>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center justify-between">
                        <span className="font-bold mr-2">Error:</span> {error}
                        <button onClick={() => setError(null)}><XCircle className="w-5 h-5 ml-4" /></button>
                    </div>
                )}
                
                {/* --- Add New Item Form --- */}
                <div className="bg-white p-6 rounded-lg shadow-xl mb-10 border border-green-100">
                    <h3 className="text-2xl font-semibold mb-5 text-gray-700">Add New Ingredient</h3>
                    <form onSubmit={handleAddItem} className="grid grid-cols-6 gap-4 items-end">
                        <input
                            type="text"
                            name="name"
                            placeholder="Ingredient Name (e.g., Flour)"
                            value={newItem.name}
                            onChange={handleInputChange}
                            className="p-3 border rounded focus:ring-green-500 focus:border-green-500 col-span-6 md:col-span-2"
                            required
                        />
                        <input
                            type="number" 
                            name="quantity"
                            placeholder="Quantity (e.g., 2)"
                            value={newItem.quantity === 0 ? '' : newItem.quantity}
                            onChange={handleInputChange}
                            className="p-3 border rounded focus:ring-green-500 focus:border-green-500 col-span-3 md:col-span-1"
                            required
                            min="0.1" // FIX: Quantity should be at least a small number
                        />
                        <input
                            type="text"
                            name="unit"
                            placeholder="Unit (e.g., cups)"
                            value={newItem.unit}
                            onChange={handleInputChange}
                            className="p-3 border rounded focus:ring-green-500 focus:border-green-500 col-span-3 md:col-span-1"
                            required
                        />
                        <input
                            type="date"
                            name="expiration_date" // FIX: Match backend schema
                            placeholder="Expiration Date (Optional)"
                            value={newItem.expiration_date || ''}
                            onChange={handleInputChange}
                            className="p-3 border rounded focus:ring-red-500 focus:border-red-500 col-span-3 md:col-span-1 text-gray-700"
                        />
                        <button
                            type="submit"
                            className="p-3 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition-colors col-span-3 md:col-span-1 flex items-center justify-center"
                        >
                            <PlusCircle className="w-5 h-5 mr-2" />
                            Add Item
                        </button>
                    </form>
                </div>

                {/* --- Pantry Item List --- */}
                <h3 className="text-2xl font-semibold mb-4 text-gray-700">
                    Current Stock {isLoading ? '(Loading...)' : `(${pantryItems.length})`}
                </h3>
                
                {isLoading && (
                    <p className="text-center text-gray-500 italic p-4 border rounded-lg bg-white shadow-sm">Loading inventory from the server...</p>
                )}

                {!isLoading && pantryItems.length === 0 ? (
                    <p className="text-gray-500 italic p-4 border rounded-lg bg-gray-100">Your pantry is empty! Start adding ingredients above.</p>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {pantryItems.map(item => {
                            const expiringSoon = isExpiring(item.expiration_date);
                            return (
                                <div 
                                    key={item.id} 
                                    className={`flex justify-between items-center p-4 bg-white border rounded-lg shadow-sm hover:shadow-lg transition-shadow 
                                        ${expiringSoon ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                                >
                                    <div className="flex-grow">
                                        {/* FIX: Use item.ingredient.name from the nested API response */}
                                        <p className="text-lg font-bold text-gray-800">{item.ingredient.name}</p>
                                        <p className="text-sm text-gray-500">
                                            <span className="font-semibold text-green-700">{item.quantity} {item.unit}</span>
                                        </p>
                                        {item.expiration_date && (
                                            <p className={`text-xs mt-1 flex items-center ${expiringSoon ? 'text-red-600 font-bold' : 'text-orange-500'}`}>
                                                <AlarmClock className="w-3 h-3 mr-1" /> 
                                                Expires: {new Date(item.expiration_date).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="ml-4 text-red-500 hover:text-red-700 p-2 rounded-full transition-colors bg-red-100 hover:bg-red-200"
                                        aria-label={`Remove ${item.ingredient.name}`}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}