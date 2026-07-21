'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  setAuthenticated: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = 'portfolio-admin-auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    if (typeof window !== 'undefined') {
      const auth = window.localStorage.getItem(AUTH_KEY) === 'true';
      setIsAuthenticated(auth);
      setIsLoading(false);
    }
  }, []);

  const logout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(AUTH_KEY);
      window.localStorage.removeItem('portfolio-admin-token');
      window.localStorage.removeItem('admin-token');
      setIsAuthenticated(false);
    }
  };

  const setAuth = (value: boolean) => {
    setIsAuthenticated(value);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, logout, setAuthenticated: setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
