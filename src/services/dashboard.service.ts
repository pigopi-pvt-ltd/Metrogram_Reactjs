import api from '@/lib/api';
import type { ApiResponse, DashboardStatsResponse, User } from '@/types';
import { getMockDashboardStats, INITIAL_SUPER_ADMIN } from '@/lib/mockData';
import { normalizeUser, normalizeEmployee, normalizeCustomer } from '@/lib/normalizers';

export const dashboardService = {
  getStats: async (currentUser?: User | null): Promise<ApiResponse<DashboardStatsResponse>> => {
    try {
      const response = await api.get<{
        success: boolean;
        data: {
          role: string;
          summary: Record<string, number>;
          managerInfo?: {
            department: string;
            branch: string;
            teamSize: number;
            maxTeamSize: number;
          };
          employeeInfo?: {
            employeeCode: string;
            designation: string;
            department: string;
          };
          customerInfo?: {
            customerCode: string;
            membershipType: 'REGULAR' | 'PREMIUM' | 'VIP';
            loyaltyPoints: number;
            address: {
              street?: string;
              city?: string;
              state?: string;
              zipCode?: string;
              country?: string;
            };
          };
          recentActivity?: unknown[];
          recentEmployees?: unknown[];
          recentCustomers?: unknown[];
        };
      }>('/dashboard/stats');

      const raw = response.data?.data;
      if (!raw) {
        throw new Error('No dashboard data');
      }

      const normalized: DashboardStatsResponse = {
        role: (raw.role as DashboardStatsResponse['role']) || currentUser?.role || 'SUPER_ADMIN',
        summary: raw.summary || {},
        managerInfo: raw.managerInfo,
        employeeInfo: raw.employeeInfo,
        customerInfo: raw.customerInfo,
        recentActivity: Array.isArray(raw.recentActivity)
          ? raw.recentActivity.map(normalizeUser)
          : undefined,
        recentEmployees: Array.isArray(raw.recentEmployees)
          ? raw.recentEmployees.map(normalizeEmployee)
          : undefined,
        recentCustomers: Array.isArray(raw.recentCustomers)
          ? raw.recentCustomers.map(normalizeCustomer)
          : undefined,
      };

      return {
        success: true,
        data: normalized,
      };
    } catch {
      const activeUser: User = currentUser || INITIAL_SUPER_ADMIN;
      const mockStats = getMockDashboardStats(activeUser);
      return {
        success: true,
        data: mockStats,
      };
    }
  },
};
