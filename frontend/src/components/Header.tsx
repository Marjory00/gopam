// frontend/src/components/Header.tsx

'use client'; // <-- FIX: Marks this component as a client component to allow for 'onClick' handlers and interactivity.

import Link from 'next/link';
import { Package, FlaskConical, Calendar, Bot, Menu } from 'lucide-react';

/**
 * Global application navigation bar.
 */
export function Header() {
  const navItems = [
    { name: 'Pantry', href: '/pantry', icon: Package },
    { name: 'Recipes', href: '/recipes', icon: FlaskConical },
    { name: 'Meal Plan', href: '/meal-plan', icon: Calendar },
    { name: 'AI Recommendations', href: '/recommendations', icon: Bot },
  ];

  const handleMobileMenuClick = () => {
    // FIX: Using console.log instead of alert for smoother placeholder
    console.log('Mobile menu toggle clicked (Functionality not implemented yet).');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Home Link */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-3xl font-extrabold text-indigo-600 hover:text-indigo-800 transition-colors">
              Gopam
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden sm:ml-6 sm:flex sm:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                // Use hover:text-indigo-600 for consistency with logo color
                className="text-gray-600 hover:bg-gray-50 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors"
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button (Placeholder) */}
          <div className="sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={handleMobileMenuClick}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}