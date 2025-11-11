
// frontend/src/components/Footer.tsx

import React from 'react';

/**
 * Global application footer component.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-10">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          {/* Copyright Info */}
          <p className="order-2 md:order-1 mt-4 md:mt-0">
            &copy; {currentYear} Gopam AI System. All rights reserved.
          </p>

          {/* Links/Project Info */}
          <div className="order-1 md:order-2 space-x-4">
            <a href="#" className="hover:text-indigo-400 transition-colors">
              About
            </a>
            <a href="#" className="hover:text-indigo-400 transition-colors">
              API Docs
            </a>
            <a 
              href="https://github.com/tramar/gopam" // Placeholder link
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-indigo-400 transition-colors"
            >
              GitHub (tramar)
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}