// client/src/app/layout.tsx

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gopam - AI Recipe Management',
  description: 'AI-Powered Recipe & Ingredient Management System.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-green-700 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Gopam</h1> 
            <nav>
              {/* Added a simple [ICON: Home] text placeholder for now */}
              <a href="/" className="px-3 hover:text-green-200">Home</a>
              {/* Added a simple [ICON: Pantry] text placeholder for now */}
              <a href="/pantry" className="px-3 hover:text-green-200">Pantry</a>
              {/* Added a simple [ICON: Book] text placeholder for now */}
              <a href="/recipes" className="px-3 hover:text-green-200">Recipes</a>
              {/* Added new link for Recommendations page */}
              <a href="/recommendations" className="px-3 hover:text-green-200">Recommendations</a>
            </nav>
          </div>
        </header>
        <main className="container mx-auto p-4 min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-100 p-4 text-center text-gray-600 border-t mt-8">
          © {new Date().getFullYear()} Gopam. All rights reserved.
        </footer>
      </body>
    </html>
  );
}