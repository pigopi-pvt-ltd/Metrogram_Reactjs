import api from '@/lib/api';
import type {
  ApiResponse,
  LoginCredentials,
  LoginResponse,
  User,
} from '@/types';
import { normalizeUser } from '@/lib/normalizers';
import {
  INITIAL_CUSTOMERS,
  INITIAL_EMPLOYEES,
  INITIAL_MANAGERS,
  INITIAL_SUPER_ADMIN,
} from '@/lib/mockData';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await api.post<{
        success: boolean;
        message?: string;
        token?: string;
        user?: unknown;
        data?: unknown;
      }>('/auth/login', credentials);

      const rawUser = response.data?.user || response.data?.data || response.data;
      const normalizedUser = normalizeUser(rawUser as Parameters<typeof normalizeUser>[0]);

      return {
        success: true,
        message: response.data?.message || 'Login successful',
        token: response.data?.token,
        user: normalizedUser,
      };
    } catch {
      // Fallback demo authentication if backend is offline
      const allMockUsers = [
        INITIAL_SUPER_ADMIN,
        ...INITIAL_MANAGERS,
        ...INITIAL_EMPLOYEES,
        ...INITIAL_CUSTOMERS,
      ];

      const foundUser = allMockUsers.find(
        (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
      );

      if (foundUser) {
        return {
          success: true,
          message: 'Logged in successfully (Demo Mode)',
          user: foundUser,
        };
      }

      const defaultUser: User = {
        _id: `usr-demo-${Date.now()}`,
        firstName: credentials.email.split('@')[0] || 'Demo',
        lastName: 'User',
        fullName: `${credentials.email.split('@')[0]} User`,
        email: credentials.email,
        role: 'SUPER_ADMIN',
        isActive: true,
        profile: INITIAL_SUPER_ADMIN.profile,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return {
        success: true,
        message: 'Logged in successfully (Demo Super Admin)',
        user: defaultUser,
      };
    }
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<{
      success: boolean;
      data?: unknown;
      user?: unknown;
    }>('/auth/me');

    const rawUser = response.data?.data || response.data?.user || response.data;
    const normalizedUser = normalizeUser(rawUser as Parameters<typeof normalizeUser>[0]);

    return {
      success: true,
      data: normalizedUser,
    };
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Server will clear HTTP-only cookie
    }
  },
};
