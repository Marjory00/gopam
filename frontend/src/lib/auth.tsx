// frontend/src/lib/auth.ts
// Custom hook and context for handling MOCK authentication state

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginRequest } from './types'; 
// NOTE: We are removing API imports (login, fetchCurrentUser) to bypass the backend
import { useRouter } from 'next/navigation';

// --- 1. Define MOCK Data ---

const MOCK_TOKEN = 'MOCK_TOKEN_FOR_GOPAM_PROJECT';

const MOCK_USER: User = {
    id: 999,
    email: 'mockuser@gopam.dev',
    username: 'MockUser',
    full_name: 'Project Mockup User',
    is_active: true,
    created_at: new Date().toISOString(),
};

// --- 2. Define Context State ---

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    // Keep login/logout functions, but they will be mocked
    login: (credentials: LoginRequest) => Promise<void>; 
    logout: (redirect?: boolean) => void;
}

// Default value for the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- 3. Auth Provider Component ---

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    
    // --- State Initialization (BYPASS LOGIN) ---
    useEffect(() => {
        // Automatically set the mock state
        setUser(MOCK_USER);
        setToken(MOCK_TOKEN);
        // Simulate a brief loading period
        setTimeout(() => {
            setIsLoading(false);
        }, 100); 
    }, []);

    // --- Core Logic (Mocked) ---

    // Mock login function: just logs the attempt
    const handleLogin = async (credentials: LoginRequest) => {
        console.log(`MOCK Login attempt for: ${credentials.email}`);
        // In the mock, we assume success and redirect instantly
        router.push('/recipes');
    };

    // Mock logout function: clears state
    const handleLogout = (redirect = true) => {
        setUser(null);
        setToken(null);
        if (redirect) {
            router.push('/login');
        }
    };

    const value = {
        isAuthenticated: !!user && !!token,
        user,
        token,
        isLoading,
        error: null, // No errors in mock mode
        login: handleLogin,
        logout: handleLogout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// --- 4. Custom Hook ---

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};