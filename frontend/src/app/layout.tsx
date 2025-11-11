// frontend/src/app/layout.tsx

import type { Metadata } from "next";
import "../styles/globals.css";

// FIX 1: Import the new AuthProvider
import { AuthProvider } from '@/lib/auth'; 

// Assuming you will create these components in frontend/src/components/
import { Header } from '@/components/Header'; 
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
    title: "Gopam | AI-Powered Recipe & Ingredient Management",
    description: "Intelligent recipe matching and pantry management.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            {/* Use the Tailwind font classes defined in globals.css */}
            <body className="antialiased min-h-screen flex flex-col">
                {/* FIX 2: Wrap the application content with the AuthProvider */}
                <AuthProvider> 
                    
                    {/* --- 1. Header/Navigation Bar --- */}
                    <Header /> 

                    {/* --- 2. Main Content Area --- */}
                    <main className="flex-grow">
                        {children}
                    </main>

                    {/* --- 3. Footer --- */}
                    <Footer />

                </AuthProvider>
            </body>
        </html>
    );
}