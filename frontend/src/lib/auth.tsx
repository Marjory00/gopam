// frontend/src/lib/auth.tsx

'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// --- 1. Define Types ---

// Interface for the user object stored in the context
interface User {
    id: number;
    email: string;
    fullName: string;
}

// Interface for the Auth Context state and actions
interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    user: User | null;
    login: (token: string, user: User) => void;
    logout: () => void;
}

// --- 2. Create Context ---

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- 3. Create Auth Provider Component ---

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    // State to hold the authentication data
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    // FIX: A simple way to check authentication status
    const isAuthenticated = !!token; 

    // Action to handle successful login (stores token and user info)
    const login = (newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        // NOTE: In a real app, you would save the token/user to localStorage here
        // localStorage.setItem('authToken', newToken);
    };

    // Action to handle logout
    const logout = () => {
        setToken(null);
        setUser(null);
        // localStorage.removeItem('authToken');
    };

    const contextValue: AuthContextType = {
        isAuthenticated,
        token,
        user,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// --- 4. Create Custom Hook ---

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};