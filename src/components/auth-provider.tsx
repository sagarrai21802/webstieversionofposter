'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '@/lib/auth';
import { setAccessToken, getAccessToken } from '@/lib/api';
import { LoadingScreen } from '@/components/loading';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = getAccessToken();
        
        if (token) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/auth/refresh`,
          {
            method: 'POST',
            credentials: 'include',
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.access_token) {
            setAccessToken(data.access_token);
            setIsAuthenticated(true);
            
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
          }
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    setAccessToken(response.access_token);
    setIsAuthenticated(true);
    
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
  };

  const logout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  if (isLoading) {
    return <LoadingScreen message="Loading..." />;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
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