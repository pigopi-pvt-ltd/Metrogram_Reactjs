import api from '@/lib/api';
import type {
  ApiResponse,
  CreateCustomerPayload,
  CustomerProfile,
  MembershipTier,
  PaginatedResponse,
  UpdateCustomerPayload,
  User,
} from '@/types';
import { normalizeCustomer } from '@/lib/normalizers';
import { INITIAL_CUSTOMERS } from '@/lib/mockData';

export interface GetCustomersParams {
  page?: number;
  limit?: number;
  search?: string;
  membershipType?: MembershipTier;
  isActive?: boolean;
}

const CUSTOMERS_STORAGE_KEY = 'metrogram_customers_data';

const getStoredCustomers = (): User[] => {
  const saved = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as unknown[];
      return parsed.map(normalizeCustomer);
    } catch {
      return INITIAL_CUSTOMERS;
    }
  }
  localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(INITIAL_CUSTOMERS));
  return INITIAL_CUSTOMERS;
};

const saveStoredCustomers = (customers: User[]) => {
  localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
};

export const customerService = {
  // GET /api/customers
  getAll: async (params?: GetCustomersParams): Promise<PaginatedResponse<User> | ApiResponse<User[]>> => {
    try {
      const response = await api.get<{ success: boolean; data: unknown[] }>('/customers', {
        params,
      });

      const rawList = Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data)
        ? response.data
        : [];

      let list = rawList.map(normalizeCustomer);

      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (c) =>
            c.firstName.toLowerCase().includes(q) ||
            c.lastName.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.fullName.toLowerCase().includes(q) ||
            (c.profile as CustomerProfile | undefined)?.customerCode?.toLowerCase().includes(q) ||
            (c.profile as CustomerProfile | undefined)?.address?.city?.toLowerCase().includes(q)
        );
      }
      if (params?.membershipType) {
        list = list.filter(
          (c) => (c.profile as CustomerProfile | undefined)?.membershipType === params.membershipType
        );
      }
      if (params?.isActive !== undefined) {
        list = list.filter((c) => c.isActive === params.isActive);
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
      let list = getStoredCustomers();
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (c) =>
            c.firstName.toLowerCase().includes(q) ||
            c.lastName.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.fullName.toLowerCase().includes(q) ||
            (c.profile as CustomerProfile | undefined)?.customerCode?.toLowerCase().includes(q) ||
            (c.profile as CustomerProfile | undefined)?.address?.city?.toLowerCase().includes(q)
        );
      }
      if (params?.membershipType) {
        list = list.filter(
          (c) => (c.profile as CustomerProfile | undefined)?.membershipType === params.membershipType
        );
      }
      if (params?.isActive !== undefined) {
        list = list.filter((c) => c.isActive === params.isActive);
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

  // GET /api/customers/:userId
  getById: async (userId: string): Promise<ApiResponse<User>> => {
    try {
      const response = await api.get<{ success: boolean; data: unknown }>(`/customers/${userId}`);
      const raw = response.data?.data || response.data;
      return {
        success: true,
        data: normalizeCustomer(raw),
      };
    } catch {
      const list = getStoredCustomers();
      const found = list.find((c) => c._id === userId);
      if (found) {
        return { success: true, data: found };
      }
      throw new Error('Customer not found');
    }
  },

  // POST /api/users/customer
  create: async (payload: CreateCustomerPayload): Promise<ApiResponse<User>> => {
    try {
      const response = await api.post<{ success: boolean; message?: string; data: unknown }>(
        '/users/customer',
        payload
      );
      const raw = response.data?.data || response.data;
      const normalized = normalizeCustomer(raw);
      return {
        success: true,
        data: normalized,
        message: response.data?.message || 'Customer created successfully',
      };
    } catch {
      const list = getStoredCustomers();
      const newCustomer = normalizeCustomer({
        _id: `usr-cust-${Date.now()}`,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        role: 'CUSTOMER',
        isActive: true,
        customerCode: payload.customerCode || `CUST-${Math.floor(10000 + Math.random() * 90000)}`,
        membershipType: payload.membershipType || 'REGULAR',
        loyaltyPoints: payload.loyaltyPoints ?? 100,
        address: payload.address || { country: 'United States' },
        createdAt: new Date().toISOString(),
      });
      const updatedList = [newCustomer, ...list];
      saveStoredCustomers(updatedList);
      return { success: true, data: newCustomer, message: 'Customer registered successfully' };
    }
  },

  register: async (payload: CreateCustomerPayload): Promise<ApiResponse<User>> => {
    return customerService.create(payload);
  },

  // PUT /api/users/:id
  update: async (userId: string, payload: UpdateCustomerPayload): Promise<ApiResponse<User>> => {
    try {
      const response = await api.put<{ success: boolean; message?: string; data: unknown }>(
        `/users/${userId}`,
        payload
      );
      const raw = response.data?.data || response.data;
      const normalized = normalizeCustomer(raw);
      return {
        success: true,
        data: normalized,
        message: response.data?.message || 'Customer updated successfully',
      };
    } catch {
      const list = getStoredCustomers();
      const index = list.findIndex((c) => c._id === userId);
      if (index === -1) throw new Error('Customer not found');

      const existing = list[index];
      const existingProfile = (existing.profile as CustomerProfile) || {};
      const updated = normalizeCustomer({
        ...existing,
        ...payload,
        profile: {
          ...existingProfile,
          customerCode: payload.customerCode ?? existingProfile.customerCode,
          membershipType: payload.membershipType ?? existingProfile.membershipType,
          loyaltyPoints: payload.loyaltyPoints ?? existingProfile.loyaltyPoints,
          address: payload.address ?? existingProfile.address,
        },
      });
      list[index] = updated;
      saveStoredCustomers(list);
      return { success: true, data: updated, message: 'Customer updated successfully' };
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
        data: normalizeCustomer(raw),
        message: response.data?.message || `Status updated to ${isActive ? 'Active' : 'Inactive'}`,
      };
    } catch {
      const list = getStoredCustomers();
      const index = list.findIndex((c) => c._id === userId);
      if (index === -1) throw new Error('Customer not found');

      list[index] = { ...list[index], isActive, updatedAt: new Date().toISOString() };
      saveStoredCustomers(list);
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
      const list = getStoredCustomers();
      const filtered = list.filter((c) => c._id !== userId);
      saveStoredCustomers(filtered);
      return { success: true, message: 'Customer deleted successfully', data: { message: 'Deleted' } };
    }
  },
};
