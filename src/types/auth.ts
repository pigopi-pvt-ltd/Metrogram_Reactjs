export type UserRole = 'SUPER_ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'CUSTOMER';
export type MembershipTier = 'REGULAR' | 'PREMIUM' | 'VIP';

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface SuperAdminProfile {
  _id: string;
  adminLevel: string;
  permissions: string[];
  systemNotes: string;
}

export interface ManagerProfile {
  _id: string;
  department: string;
  branch: string;
  managedEmployees: string[] | EmployeeUser[];
  maxTeamSize: number;
}

export interface EmployeeProfile {
  _id: string;
  employeeCode: string;
  designation: string;
  department: string;
  manager: string | ManagerProfile | null;
  joiningDate: string;
}

export interface CustomerProfile {
  _id: string;
  customerCode: string;
  membershipType: MembershipTier;
  address: Address;
  loyaltyPoints: number;
}

export type ProfileData = SuperAdminProfile | ManagerProfile | EmployeeProfile | CustomerProfile;

export interface EmployeeUser {
  _id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  profile?: EmployeeProfile;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  isActive: boolean;
  profile?: ProfileData;
  profileModel?: string;
  createdBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  count: number;
  total: number;
  totalPages: number;
  currentPage: number;
  data: T[];
}

export interface DashboardStatsResponse {
  role: UserRole;
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
    membershipType: MembershipTier;
    loyaltyPoints: number;
    address: Address;
  };
  recentActivity?: User[];
  recentEmployees?: User[];
  recentCustomers?: User[];
}

export interface CreateManagerPayload {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  department: string;
  branch: string;
  maxTeamSize: number;
  isActive?: boolean;
}

export interface UpdateManagerPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  isActive?: boolean;
  department?: string;
  branch?: string;
  maxTeamSize?: number;
}

export interface CreateEmployeePayload {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  employeeCode: string;
  designation: string;
  department: string;
  managerId?: string;
  joiningDate?: string;
  isActive?: boolean;
}

export interface UpdateEmployeePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  isActive?: boolean;
  employeeCode?: string;
  designation?: string;
  department?: string;
  managerId?: string;
  joiningDate?: string;
}

export interface CreateCustomerPayload {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  customerCode?: string;
  membershipType: MembershipTier;
  loyaltyPoints?: number;
  address?: Address;
  isActive?: boolean;
}

export interface UpdateCustomerPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  isActive?: boolean;
  customerCode?: string;
  membershipType?: MembershipTier;
  loyaltyPoints?: number;
  address?: Address;
}
