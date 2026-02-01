import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { authApi } from '../lib/api';

// 1. Define User Roles and Interfaces
export type UserRole = 'EMPLOYER' | 'CANDIDATE' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company: string | null;
  role: UserRole; // TypeScript will strictly enforce these three values
}

export interface RegisterData {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: 'EMPLOYER' | 'CANDIDATE';
  company?: string;
}

// 2. Define Context Type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (updatedFields: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Custom Hook for using Auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 4. Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Logout function (Memoized to prevent unnecessary re-renders)
  const logout = useCallback(() => {
    authApi.logout();
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  }, []);

  // Initialize Auth on app load
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('accessToken');
        
        if (storedUser && token) {
          // Type casting 'as User' fixes the role mismatch error
          const parsedUser = JSON.parse(storedUser) as User;
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Session initialization failed:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [logout]);

  // Login Logic (Unified: Role is detected by the server)
  const login = async (email: string, password: string): Promise<User> => {
    try {
      const response = await authApi.login(email, password);
      const { user: userData, tokens } = response.data;
      
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      const authenticatedUser = userData as User;
      setUser(authenticatedUser);
      return authenticatedUser; // Return user so Login page can redirect based on role
    } catch (error) {
      console.error('Login service error:', error);
      throw error;
    }
  };

  // Registration Logic
  const register = async (data: RegisterData) => {
    try {
      const response = await authApi.register(data);
      const { user: userData, tokens } = response.data;
      
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData as User);
    } catch (error) {
      console.error('Registration service error:', error);
      throw error;
    }
  };

  // Handle Partial User Updates (e.g., changing profile settings)
  const updateUser = (updatedFields: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedFields };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  // Performance Optimization: Memoize the context value
  const contextValue = useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  }), [user, isLoading, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};