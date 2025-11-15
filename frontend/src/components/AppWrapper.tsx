// frontend/src/components/AppWrapper.tsx

'use client';

import React from 'react';
import { AuthProvider } from '@/lib/auth'; // Our mocked AuthProvider
import Navigation from '@/components/Navigation'; // Assuming you have a Navigation bar component

interface AppWrapperProps {
    children: React.ReactNode;
}

/**
 * Client component to wrap the entire app with necessary contexts.
 */
export default function AppWrapper({ children }: AppWrapperProps) {
    return (
        <AuthProvider>
            <Navigation /> {/* Include the navigation bar here so it can access the user state */}
            <main>{children}</main>
        </AuthProvider>
    );
}