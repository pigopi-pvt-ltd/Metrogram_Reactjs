import api from '@/lib/api';
import type {
  ApiResponse,
  CreateEmployeePayload,
  EmployeeProfile,
  PaginatedResponse,
  UpdateEmployeePayload,
  User,
} from '@/types';
import { normalizeEmployee } from '@/lib/normalizers';
import { INITIAL_EMPLOYEES } from '@/lib/mockData';

export interface GetEmployeesParams {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  managerId?: string;
  isActive?: boolean;
}

const EMPLOYEES_STORAGE_KEY = 'metrogram_employees_data';

const getStoredEmployees = (): User[] => {
  const saved = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as unknown[];
      return parsed.map(normalizeEmployee);
    } catch {
      return INITIAL_EMPLOYEES;
    }
  }
  localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(INITIAL_EMPLOYEES));
  return INITIAL_EMPLOYEES;
};

const saveStoredEmployees = (employees: User[]) => {
  localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(employees));
};

export const employeeService = {
  // GET /api/employees
  getAll: async (params?: GetEmployeesParams): Promise<PaginatedResponse<User> | ApiResponse<User[]>> => {
    try {
      const response = await api.get<{ success: boolean; data: unknown[] }>('/employees', {
        params,
      });

      const rawList = Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data)
        ? response.data
        : [];

      let list = rawList.map(normalizeEmployee);

      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (e) =>
            e.firstName.toLowerCase().includes(q) ||
            e.lastName.toLowerCase().includes(q) ||
            e.email.toLowerCase().includes(q) ||
            e.fullName.toLowerCase().includes(q) ||
            (e.profile as EmployeeProfile | undefined)?.employeeCode?.toLowerCase().includes(q) ||
            (e.profile as EmployeeProfile | undefined)?.designation?.toLowerCase().includes(q) ||
            (e.profile as EmployeeProfile | undefined)?.department?.toLowerCase().includes(q)
        );
      }
      if (params?.department) {
        list = list.filter((e) => (e.profile as EmployeeProfile | undefined)?.department === params.department);
      }
      if (params?.isActive !== undefined) {
        list = list.filter((e) => e.isActive === params.isActive);
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
      let list = getStoredEmployees();
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (e) =>
            e.firstName.toLowerCase().includes(q) ||
            e.lastName.toLowerCase().includes(q) ||
            e.email.toLowerCase().includes(q) ||
            e.fullName.toLowerCase().includes(q) ||
            (e.profile as EmployeeProfile | undefined)?.employeeCode?.toLowerCase().includes(q) ||
            (e.profile as EmployeeProfile | undefined)?.designation?.toLowerCase().includes(q) ||
            (e.profile as EmployeeProfile | undefined)?.department?.toLowerCase().includes(q)
        );
      }
      if (params?.department) {
        list = list.filter((e) => (e.profile as EmployeeProfile | undefined)?.department === params.department);
      }
      if (params?.isActive !== undefined) {
        list = list.filter((e) => e.isActive === params.isActive);
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

  // GET /api/employees/:userId
  getById: async (userId: string): Promise<ApiResponse<User>> => {
    try {
      const response = await api.get<{ success: boolean; data: unknown }>(`/employees/${userId}`);
      const raw = response.data?.data || response.data;
      return {
        success: true,
        data: normalizeEmployee(raw),
      };
    } catch {
      const list = getStoredEmployees();
      const found = list.find((e) => e._id === userId);
      if (found) {
        return { success: true, data: found };
      }
      throw new Error('Employee not found');
    }
  },

  // POST /api/users/employee
  create: async (payload: CreateEmployeePayload): Promise<ApiResponse<User>> => {
    try {
      const payloadObj = payload as unknown as Record<string, unknown>;
      const body = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        password: payload.password,
        phoneNumber: payload.phoneNumber,
        employeeCode: payload.employeeCode,
        designation: payload.designation,
        department: payload.department,
        manager: payload.managerId || (payloadObj.manager as string) || undefined,
        joiningDate: payload.joiningDate,
      };

      const response = await api.post<{ success: boolean; message?: string; data: unknown }>(
        '/users/employee',
        body
      );
      const raw = response.data?.data || response.data;
      const normalized = normalizeEmployee(raw);
      return {
        success: true,
        data: normalized,
        message: response.data?.message || 'Employee created successfully',
      };
    } catch {
      const list = getStoredEmployees();
      const newEmployee = normalizeEmployee({
        _id: `usr-emp-${Date.now()}`,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        role: 'EMPLOYEE',
        isActive: true,
        employeeCode: payload.employeeCode,
        designation: payload.designation,
        department: payload.department,
        manager: payload.managerId || null,
        joiningDate: payload.joiningDate || new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });
      const updatedList = [newEmployee, ...list];
      saveStoredEmployees(updatedList);
      return { success: true, data: newEmployee, message: 'Employee created successfully' };
    }
  },

  // PUT /api/users/:id
  update: async (userId: string, payload: UpdateEmployeePayload): Promise<ApiResponse<User>> => {
    try {
      const payloadObj = payload as unknown as Record<string, unknown>;
      const body = {
        ...payload,
        manager: payload.managerId ?? (payloadObj.manager as string),
      };

      const response = await api.put<{ success: boolean; message?: string; data: unknown }>(
        `/users/${userId}`,
        body
      );
      const raw = response.data?.data || response.data;
      const normalized = normalizeEmployee(raw);
      return {
        success: true,
        data: normalized,
        message: response.data?.message || 'Employee updated successfully',
      };
    } catch {
      const list = getStoredEmployees();
      const index = list.findIndex((e) => e._id === userId);
      if (index === -1) throw new Error('Employee not found');

      const existing = list[index];
      const existingProfile = (existing.profile as EmployeeProfile) || {};
      const updated = normalizeEmployee({
        ...existing,
        ...payload,
        profile: {
          ...existingProfile,
          employeeCode: payload.employeeCode ?? existingProfile.employeeCode,
          designation: payload.designation ?? existingProfile.designation,
          department: payload.department ?? existingProfile.department,
          manager: payload.managerId ?? existingProfile.manager,
        },
      });
      list[index] = updated;
      saveStoredEmployees(list);
      return { success: true, data: updated, message: 'Employee updated successfully' };
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
        data: normalizeEmployee(raw),
        message: response.data?.message || `Status updated to ${isActive ? 'Active' : 'Inactive'}`,
      };
    } catch {
      const list = getStoredEmployees();
      const index = list.findIndex((e) => e._id === userId);
      if (index === -1) throw new Error('Employee not found');

      list[index] = { ...list[index], isActive, updatedAt: new Date().toISOString() };
      saveStoredEmployees(list);
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
      const list = getStoredEmployees();
      const filtered = list.filter((e) => e._id !== userId);
      saveStoredEmployees(filtered);
      return { success: true, message: 'Employee deleted successfully', data: { message: 'Deleted' } };
    }
  },
};
