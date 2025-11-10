// client/src/app/pantry/page.tsx

'use client';

import { useState } from 'react';

// Define the type for a pantry item
interface PantryItem {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  addedDate: string;
}

// Placeholder data (will be fetched from FastAPI later)
const initialPantry: PantryItem[] = [
  { id: 1, name: "Chicken Breast", quantity: "1", unit: "lb", addedDate: "2025-11-08" },
  { id: 2, name: "Garlic", quantity: "1", unit: "head", addedDate: "2025-11-05" },
  { id: 3, name: "Onions", quantity: "3", unit: "unit", addedDate: "2025-11-01" },
  { id: 4, name: "Canned Tomatoes", quantity: "2", unit: "cans", addedDate: "2025-11-10" },
];

/**
 * Pantry Inventory Management Page
 * Allows users to view, add, and remove ingredients from their inventory.
 */
export default function PantryPage() {
  const [pantryItems, setPantryItems] = useState<PantryItem[]>(initialPantry);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: '' });

  // Handles input changes for the Add Item form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  // Handles adding a new item (currently client-side only)
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.name && newItem.quantity && newItem.unit) {
      const addedItem: PantryItem = {
        id: Date.now(), // Unique ID generation placeholder
        name: newItem.name,
        quantity: newItem.quantity,
        unit: newItem.unit,
        addedDate: new Date().toISOString().slice(0, 10),
      };
      setPantryItems(prev => [...prev, addedItem]);
      setNewItem({ name: '', quantity: '', unit: '' }); // Clear form
      
      // *** AI Trigger Placeholder ***
      // In the future, this is where we would call a backend function to
      // update the database and potentially trigger a new AI recommendation check.
      console.log(`New item added: ${addedItem.name}. Triggering AI check...`);
    }
  };
  
  // Handles removing an item (currently client-side only)
  const handleRemoveItem = (id: number) => {
    setPantryItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="pantry-manager">
      <h2 className="text-4xl font-extrabold mb-6 text-green-800">Your Pantry Inventory 🧺</h2>
      <p className="mb-8 text-gray-600">
        Keeping this list accurate allows Gopam to provide the best AI-powered recipe recommendations!
      </p>

      {/* --- Add New Item Form --- */}
      <div className="bg-white p-6 rounded-lg shadow-xl mb-10 border border-gray-100">
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Add New Ingredient</h3>
        <form onSubmit={handleAddItem} className="grid grid-cols-4 gap-4 items-end">
          <input
            type="text"
            name="name"
            placeholder="Ingredient Name (e.g., Flour)"
            value={newItem.name}
            onChange={handleInputChange}
            className="p-3 border rounded focus:ring-green-500 focus:border-green-500 col-span-4 sm:col-span-2"
            required
          />
          <input
            type="text"
            name="quantity"
            placeholder="Quantity (e.g., 2)"
            value={newItem.quantity}
            onChange={handleInputChange}
            className="p-3 border rounded focus:ring-green-500 focus:border-green-500"
            required
          />
          <input
            type="text"
            name="unit"
            placeholder="Unit (e.g., cups)"
            value={newItem.unit}
            onChange={handleInputChange}
            className="p-3 border rounded focus:ring-green-500 focus:border-green-500"
            required
          />
          <button
            type="submit"
            className="p-3 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition-colors"
          >
            Add to Pantry
          </button>
        </form>
      </div>

      {/* --- Pantry Item List --- */}
      <h3 className="text-2xl font-semibold mb-4 text-gray-700">Current Stock ({pantryItems.length})</h3>
      <div className="space-y-3">
        {pantryItems.length === 0 ? (
          <p className="text-gray-500 italic p-4 border rounded-lg bg-gray-50">Your pantry is empty! Start adding ingredients above.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pantryItems.map(item => (
              <div 
                key={item.id} 
                className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="text-lg font-bold text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">{item.quantity} {item.unit}</span> | Added: {item.addedDate}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="ml-4 text-red-500 hover:text-red-700 p-2 rounded-full transition-colors"
                  aria-label={`Remove ${item.name}`}
                >
                  {/* Simple Trash Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0-.936-4.788m0-4.041c0-4.473 3.585-8.15 8.058-8.15 4.473 0 8.058 3.585 8.058 8.058v4.041m-16.116 0h16.116m-2.28 0a.75.75 0 0 0-.75-.75h-2.25a.75.75 0 0 0-.75.75v.06a.75.75 0 0 0 .75.75h2.25a.75.75 0 0 0 .75-.75v-.06Zm-.75 0h-2.25m-2.25 0h-2.25a.75.75 0 0 0-.75.75v.06a.75.75 0 0 0 .75.75h2.25a.75.75 0 0 0 .75-.75v-.06Z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}