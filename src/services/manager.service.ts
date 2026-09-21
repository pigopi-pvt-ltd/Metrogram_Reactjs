import api from '@/lib/api';
import type {
  ApiResponse,
  CreateManagerPayload,
  ManagerProfile,
  PaginatedResponse,
  UpdateManagerPayload,
  User,
} from '@/types';
import { normalizeManager } from '@/lib/normalizers';
import { INITIAL_MANAGERS } from '@/lib/mockData';

export interface GetManagersParams {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  branch?: string;
  isActive?: boolean;
}

const MANAGERS_STORAGE_KEY = 'metrogram_managers_data';

const getStoredManagers = (): User[] => {
  const saved = localStorage.getItem(MANAGERS_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as unknown[];
      return parsed.map(normalizeManager);
    } catch {
      return INITIAL_MANAGERS;
    }
  }
  localStorage.setItem(MANAGERS_STORAGE_KEY, JSON.stringify(INITIAL_MANAGERS));
  return INITIAL_MANAGERS;
};

const saveStoredManagers = (managers: User[]) => {
  localStorage.setItem(MANAGERS_STORAGE_KEY, JSON.stringify(managers));
};

export const managerService = {
  // GET /api/managers
  getAll: async (params?: GetManagersParams): Promise<PaginatedResponse<User> | ApiResponse<User[]>> => {
    try {
      const response = await api.get<{ success: boolean; data: unknown[] }>('/managers', {
        params,
      });

      const rawList = Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data)
        ? response.data
        : [];

      let list = rawList.map(normalizeManager);

      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (m) =>
            m.firstName.toLowerCase().includes(q) ||
            m.lastName.toLowerCase().includes(q) ||
            m.email.toLowerCase().includes(q) ||
            m.fullName.toLowerCase().includes(q) ||
            (m.profile as ManagerProfile | undefined)?.department?.toLowerCase().includes(q)
        );
      }
      if (params?.isActive !== undefined) {
        list = list.filter((m) => m.isActive === params.isActive);
      }

      return {
        success: true,
        count: list.length,
        total: list.length,
        totalPages: 1,
        currentPage: 1,
        data: list,
      };
    } catch {
      // Fallback local store if offline
      let list = getStoredManagers();
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (m) =>
            m.firstName.toLowerCase().includes(q) ||
            m.lastName.toLowerCase().includes(q) ||
            m.email.toLowerCase().includes(q) ||
            (m.profile as ManagerProfile | undefined)?.department?.toLowerCase().includes(q)
        );
      }
      if (params?.isActive !== undefined) {
        list = list.filter((m) => m.isActive === params.isActive);
      }

      return {
        success: true,
        count: list.length,
        total: list.length,
        totalPages: Math.ceil(list.length / (params?.limit || 10)) || 1,
        currentPage: params?.page || 1,
        data: list,
      };
    }
  },

  // GET /api/managers/:userId
  getById: async (userId: string): Promise<ApiResponse<User>> => {
    try {
      const response = await api.get<{ success: boolean; data: unknown }>(`/managers/${userId}`);
      const raw = response.data?.data || response.data;
      return {
        success: true,
        data: normalizeManager(raw),
      };
    } catch {
      const list = getStoredManagers();
      const found = list.find((m) => m._id === userId);
      if (found) {
        return { success: true, data: found };
      }
      throw new Error('Manager not found');
    }
  },

  // POST /api/users/manager
  create: async (payload: CreateManagerPayload): Promise<ApiResponse<User>> => {
    try {
      const response = await api.post<{ success: boolean; message?: string; data: unknown }>(
        '/users/manager',
        payload
      );
      const raw = response.data?.data || response.data;
      const normalized = normalizeManager(raw);
      return {
        success: true,
        data: normalized,
        message: response.data?.message || 'Manager created successfully',
      };
    } catch {
      const list = getStoredManagers();
      const newManager = normalizeManager({
        _id: `usr-mgr-${Date.now()}`,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        role: 'MANAGER',
        isActive: true,
        department: payload.department,
        branch: payload.branch,
        maxTeamSize: payload.maxTeamSize,
        managedEmployees: [],
        createdAt: new Date().toISOString(),
      });
      const updatedList = [newManager, ...list];
      saveStoredManagers(updatedList);
      return { success: true, data: newManager, message: 'Manager created successfully' };
    }
  },

  // PUT /api/users/:id
  update: async (userId: string, payload: UpdateManagerPayload): Promise<ApiResponse<User>> => {
    try {
      const response = await api.put<{ success: boolean; message?: string; data: unknown }>(
        `/users/${userId}`,
        payload
      );
      const raw = response.data?.data || response.data;
      const normalized = normalizeManager(raw);
      return {
        success: true,
        data: normalized,
        message: response.data?.message || 'Manager updated successfully',
      };
    } catch {
      const list = getStoredManagers();
      const index = list.findIndex((m) => m._id === userId);
      if (index === -1) throw new Error('Manager not found');

      const existing = list[index];
      const existingProfile = (existing.profile as ManagerProfile) || {};
      const updated = normalizeManager({
        ...existing,
        ...payload,
        profile: {
          ...existingProfile,
          department: payload.department ?? existingProfile.department,
          branch: payload.branch ?? existingProfile.branch,
          maxTeamSize: payload.maxTeamSize ?? existingProfile.maxTeamSize,
        },
      });
      list[index] = updated;
      saveStoredManagers(list);
      return { success: true, data: updated, message: 'Manager updated successfully' };
    }
  },

  // PATCH /api/users/:id/status
  toggleStatus: async (userId: string, isActive: boolean): Promise<ApiResponse<User>> => {
    try {
      const response = await api.patch<{ success: boolean; message?: string; data: unknown }>(
        `/users/${userId}/status`,
        { isActive }
      );
      const raw = response.data?.data || response.data;
      return {
        success: true,
        data: normalizeManager(raw),
        message: response.data?.message || `Status updated to ${isActive ? 'Active' : 'Inactive'}`,
      };
    } catch {
      const list = getStoredManagers();
      const index = list.findIndex((m) => m._id === userId);
      if (index === -1) throw new Error('Manager not found');

      list[index] = { ...list[index], isActive, updatedAt: new Date().toISOString() };
      saveStoredManagers(list);
      return {
        success: true,
        data: list[index],
        message: `Status updated to ${isActive ? 'Active' : 'Inactive'}`,
      };
    }
  },

  // DELETE /api/users/:id
  delete: async (userId: string): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await api.delete<ApiResponse<{ message: string }>>(`/users/${userId}`);
      return response.data;
    } catch {
      const list = getStoredManagers();
      const filtered = list.filter((m) => m._id !== userId);
      saveStoredManagers(filtered);
      return { success: true, message: 'Manager deleted successfully', data: { message: 'Deleted' } };
    }
  },
};
