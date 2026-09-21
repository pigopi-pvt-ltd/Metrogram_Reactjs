import api from '@/lib/api';
import type { ApiResponse, PaginatedResponse, User } from '@/types';
import { normalizeUser } from '@/lib/normalizers';

export interface GetUsersParams {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}

export const userService = {
  // GET /api/users
  getAll: async (params?: GetUsersParams): Promise<PaginatedResponse<User>> => {
    const response = await api.get<{
      success: boolean;
      count?: number;
      total?: number;
      totalPages?: number;
      currentPage?: number;
      data: unknown[];
    }>('/users', { params });

    const rawList = Array.isArray(response.data?.data) ? response.data.data : [];
    const normalizedList = rawList.map(normalizeUser);

    return {
      success: true,
      count: response.data?.count || normalizedList.length,
      total: response.data?.total || normalizedList.length,
      totalPages: response.data?.totalPages || 1,
      currentPage: response.data?.currentPage || 1,
      data: normalizedList,
    };
  },

  // GET /api/users/:id
  getById: async (id: string): Promise<ApiResponse<User>> => {
    const response = await api.get<{ success: boolean; data: unknown }>(`/users/${id}`);
    const raw = response.data?.data || response.data;
    return {
      success: true,
      data: normalizeUser(raw as Parameters<typeof normalizeUser>[0]),
    };
  },

  // PUT /api/users/:id
  update: async (id: string, payload: Record<string, unknown>): Promise<ApiResponse<User>> => {
    const response = await api.put<{ success: boolean; message?: string; data: unknown }>(
      `/users/${id}`,
      payload
    );
    const raw = response.data?.data || response.data;
    return {
      success: true,
      data: normalizeUser(raw as Parameters<typeof normalizeUser>[0]),
      message: response.data?.message || 'User updated successfully',
    };
  },

  // PATCH /api/users/:id/status
  toggleStatus: async (id: string, isActive: boolean): Promise<ApiResponse<User>> => {
    const response = await api.patch<{ success: boolean; message?: string; data: unknown }>(
      `/users/${id}/status`,
      { isActive }
    );
    const raw = response.data?.data || response.data;
    return {
      success: true,
      data: normalizeUser(raw as Parameters<typeof normalizeUser>[0]),
      message: response.data?.message || `Status updated to ${isActive ? 'Active' : 'Inactive'}`,
    };
  },

  // DELETE /api/users/:id
  delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/users/${id}`);
    return response.data;
  },
};
