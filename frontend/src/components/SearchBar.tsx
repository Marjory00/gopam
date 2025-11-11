// frontend/src/components/SearchBar.tsx

import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  /** The current value of the search input. */
  searchTerm: string;
  /** Function to call when the input value changes. */
  onSearchChange: (value: string) => void;
  /** Optional placeholder text for the input field. */
  placeholder?: string;
  /** Optional function to call when the search is submitted (e.g., pressing Enter). */
  onSubmit?: (event: React.FormEvent) => void;
}

/**
 * Reusable Search Bar component with a modern, integrated design.
 * @param searchTerm The current search term state.
 * @param onSearchChange The state setter for the search term.
 * @param placeholder Optional placeholder text.
 * @param onSubmit Optional form submission handler.
 */
export function SearchBar({ searchTerm, onSearchChange, placeholder = "Search...", onSubmit }: SearchBarProps) {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
    // Note: Usually, live search in React handles filtering without form submission.
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full shadow-inner 
                   focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 
                   text-gray-700 bg-white hover:border-gray-400"
        aria-label="Search"
      />
    </form>
  );
}