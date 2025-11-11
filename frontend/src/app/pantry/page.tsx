// frontend/src/app/pantry/page.tsx

'use client';

import { useState } from 'react';
import Head from 'next/head';
// Assuming 'lucide-react' is installed, as per a modern Next.js/React stack
import { Trash2, PlusCircle, AlarmClock, Package } from 'lucide-react'; 

// Define the type for a pantry item, including the planned expiration_date
interface PantryItem {
  id: number;
  name: string;
  quantity: string; // Keeping as string for flexibility (e.g., "half a cup")
  unit: string;
  addedDate: string;
  expirationDate: string | null; // Added based on project plan
}

// Placeholder data (will be fetched from FastAPI later)
const initialPantry: PantryItem[] = [
  { id: 1, name: "Chicken Breast", quantity: "1", unit: "lb", addedDate: "2025-11-08", expirationDate: "2025-11-15" },
  { id: 2, name: "Garlic", quantity: "1", unit: "head", addedDate: "2025-11-05", expirationDate: "2026-03-01" },
  { id: 3, name: "Onions", quantity: "3", unit: "unit", addedDate: "2025-11-01", expirationDate: "2025-12-30" },
  { id: 4, name: "Canned Tomatoes", quantity: "2", unit: "cans", addedDate: "2025-11-10", expirationDate: "2026-10-01" },
];

/**
 * Pantry Inventory Management Page
 * Allows users to view, add, and remove ingredients from their inventory.
 */
export default function PantryPage() {
  const [pantryItems, setPantryItems] = useState<PantryItem[]>(initialPantry);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: '', expirationDate: '' });

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
        expirationDate: newItem.expirationDate || null,
      };
      // In a real app: POST /api/pantry
      setPantryItems(prev => [...prev, addedItem]);
      setNewItem({ name: '', quantity: '', unit: '', expirationDate: '' }); // Clear form
      console.log(`New item added: ${addedItem.name}. Triggering AI check...`);
    }
  };
  
  // Handles removing an item (currently client-side only)
  const handleRemoveItem = (id: number) => {
    // In a real app: DELETE /api/pantry/{id}
    setPantryItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Pantry Inventory - Gopam</title>
      </Head>
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
              type="number" // Use number input for better mobile experience
              name="quantity"
              placeholder="Quantity (e.g., 2)"
              value={newItem.quantity}
              onChange={handleInputChange}
              className="p-3 border rounded focus:ring-green-500 focus:border-green-500 col-span-3 md:col-span-1"
              required
              min="0"
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
              name="expirationDate"
              placeholder="Expiration Date (Optional)"
              value={newItem.expirationDate}
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
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Current Stock ({pantryItems.length})</h3>
        <div className="space-y-3">
          {pantryItems.length === 0 ? (
            <p className="text-gray-500 italic p-4 border rounded-lg bg-gray-100">Your pantry is empty! Start adding ingredients above.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {pantryItems.map(item => (
                <div 
                  key={item.id} 
                  className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="flex-grow">
                    <p className="text-lg font-bold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold text-green-700">{item.quantity} {item.unit}</span>
                    </p>
                    {item.expirationDate && (
                      <p className={`text-xs mt-1 flex items-center ${new Date(item.expirationDate) < new Date() ? 'text-red-600 font-bold' : 'text-orange-500'}`}>
                        <AlarmClock className="w-3 h-3 mr-1" /> 
                        Expires: {item.expirationDate}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="ml-4 text-red-500 hover:text-red-700 p-2 rounded-full transition-colors bg-red-100 hover:bg-red-200"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}