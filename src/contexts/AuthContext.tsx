import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { LoginResponse, User, UserRole, LoginCredentials } from '@/types';
import { authService } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
  login: (credentials: LoginCredentials) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUserState: (updatedUser: User) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 1. Initial Session Check on App Mount via GET /auth/me
  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await authService.getCurrentUser();
      if (response && response.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch {
      // 401 means no valid cookie is present
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 2. Login Flow (Cookie is automatically set in HTTP-only header by the server response)
  const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    setIsLoading(true);
    try {
      const data = await authService.login(credentials);
      if (data && data.user) {
        setUser(data.user);
      }
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Logout Flow (Calls backend to expire the cookie and resets state)
  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const updateUserState = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        role: user?.role ?? null,
        login,
        logout,
        checkAuth,
        updateUserState,
        refreshUser: checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
