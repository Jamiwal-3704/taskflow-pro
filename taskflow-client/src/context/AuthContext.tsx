import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import ENDPOINTS from '../api/endpoints';
import type { User } from '../types/user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
  updateProfile: (displayName?: string, usageType?: number, avatarUrl?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get<User>(ENDPOINTS.AUTH.ME);
        setUser(response.data);
      } catch (error) {
        console.error('Session restoration failed:', error);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post<{ token: string; user: User }>(ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    setIsLoading(true);
    try {
      const response = await api.post<{ token: string; user: User }>(ENDPOINTS.AUTH.REGISTER, {
        email,
        password,
        displayName,
      });
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (displayName?: string, usageType?: number, avatarUrl?: string) => {
    try {
      const response = await api.put<User>(ENDPOINTS.USERS.UPDATE_PROFILE, {
        displayName,
        usageType,
        avatarUrl,
      });
      setUser(response.data);
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export default AuthContext;
