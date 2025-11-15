'use client'; 

import { useState } from 'react'; 
import Link from 'next/link';
import { Package, FlaskConical, Calendar, Bot, Menu, X } from 'lucide-react'; 

/**
 * Global application navigation bar.
 */
export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Pantry', href: '/pantry', icon: Package },
    { name: 'Recipes', href: '/recipes', icon: FlaskConical },
    { name: 'Meal Plan', href: '/meal-plan', icon: Calendar },
    { name: 'AI Recommendations', href: '/recommendations', icon: Bot },
  ];

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };
  
  const handleNavigationClick = () => {
      setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Home Link */}
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="text-3xl font-extrabold text-indigo-600 hover:text-indigo-800 transition-colors" 
              onClick={handleNavigationClick} 
            >
              Gopam
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden sm:ml-6 sm:flex sm:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:bg-gray-50 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors"
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              onClick={handleMobileMenuToggle} 
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" aria-label="Close menu" />
              ) : (
                <Menu className="h-6 w-6" aria-label="Open menu" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content, conditionally rendered */}
      <div className={`${isMobileMenuOpen ? 'flex flex-col w-full' : 'hidden'} sm:hidden`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              // FIX: Replaced 'block' with 'w-full' to resolve cssConflict warning. 
              // The 'flex items-center' is kept for icon alignment.
              className="text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 w-full px-3 py-2 rounded-md text-base font-medium flex items-center transition-colors"
              onClick={handleNavigationClick} 
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}