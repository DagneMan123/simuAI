import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { authApi } from '../lib/api';

export type UserRole = 'EMPLOYER' | 'CANDIDATE' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string; // Changed from optional to required for consistency
  company: string | null;
  role: UserRole; 
}

export interface RegisterData {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  company?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (updatedFields: Partial<User>) => void;
}

// FIX: Added 'export' here so 'import { AuthContext }' works in other files
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    authApi.logout();
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  }, []);

  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('accessToken');
        
        if (storedUser && token) {
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

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const response = await authApi.login(email, password);
      const { user: userData, tokens } = response.data;
      
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      
      // FIX: Changed 'name' to 'fullName' to match the User interface
      const authenticatedUser: User = {
        ...userData,
        fullName: `${userData.firstName} ${userData.lastName}`
      };

      localStorage.setItem('user', JSON.stringify(authenticatedUser));
      setUser(authenticatedUser);
      return authenticatedUser; 
    } catch (error) {
      console.error('Login service error:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authApi.register(data);
      const { user: userData, tokens } = response.data;
      
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      
      // FIX: Changed 'name' to 'fullName' to match the User interface
      const registeredUser: User = {
        ...userData,
        fullName: `${userData.firstName} ${userData.lastName}`
      };

      localStorage.setItem('user', JSON.stringify(registeredUser));
      setUser(registeredUser);
    } catch (error) {
      console.error('Registration service error:', error);
      throw error;
    }
  };

  const updateUser = (updatedFields: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedFields };
    
    // Automatically update fullName if first or last name changes
    if (updatedFields.firstName || updatedFields.lastName) {
        updatedUser.fullName = `${updatedUser.firstName} ${updatedUser.lastName}`;
    }

    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

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