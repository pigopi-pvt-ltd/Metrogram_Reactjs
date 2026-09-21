import type {
  CustomerProfile,
  EmployeeProfile,
  ManagerProfile,
  SuperAdminProfile,
  User,
  UserRole,
} from '@/types';

// Generic raw backend item shape
export interface RawBackendItem {
  _id?: string;
  id?: string;
  user?: {
    _id?: string;
    id?: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    role?: UserRole;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  role?: UserRole;
  isActive?: boolean;
  profileModel?: string;
  profile?: unknown;
  department?: string;
  branch?: string;
  managedEmployees?: string[] | unknown[];
  maxTeamSize?: number;
  employeeCode?: string;
  designation?: string;
  manager?: unknown;
  joiningDate?: string;
  customerCode?: string;
  membershipType?: 'REGULAR' | 'PREMIUM' | 'VIP';
  loyaltyPoints?: number;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  createdBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Normalizes any manager document (from /api/managers or /api/users?role=MANAGER)
 * into a uniform User model with user._id and profile metadata.
 */
export function normalizeManager(input: unknown): User {
  const raw = (input || {}) as RawBackendItem;
  const userId = raw.user?._id || raw.user?.id || raw._id || raw.id || '';
  const profileId = raw.user ? raw._id || raw.id || '' : (raw.profile as { _id?: string })?._id || '';

  const firstName = raw.user?.firstName || raw.firstName || '';
  const lastName = raw.user?.lastName || raw.lastName || '';
  const fullName =
    raw.user?.fullName ||
    raw.fullName ||
    `${firstName} ${lastName}`.trim() ||
    'Manager';

  const rawProfile = (raw.profile || {}) as Record<string, unknown>;
  const department = raw.department || (rawProfile.department as string) || '';
  const branch = raw.branch || (rawProfile.branch as string) || '';
  const maxTeamSize =
    raw.maxTeamSize ?? (rawProfile.maxTeamSize as number) ?? 15;
  const managedEmployees =
    raw.managedEmployees ||
    (rawProfile.managedEmployees as string[]) ||
    [];

  const profile: ManagerProfile = {
    _id: profileId,
    department,
    branch,
    managedEmployees: managedEmployees as string[],
    maxTeamSize,
  };

  return {
    _id: userId,
    firstName,
    lastName,
    fullName,
    email: raw.user?.email || raw.email || '',
    phoneNumber: raw.user?.phoneNumber || raw.phoneNumber || '',
    role: 'MANAGER',
    isActive: raw.user?.isActive ?? raw.isActive ?? true,
    profile,
    profileModel: 'Manager',
    createdBy: raw.createdBy || null,
    createdAt: raw.user?.createdAt || raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
}

/**
 * Normalizes any employee document (from /api/employees or /api/users?role=EMPLOYEE)
 * into a uniform User model with user._id and profile metadata.
 */
export function normalizeEmployee(input: unknown): User {
  const raw = (input || {}) as RawBackendItem;
  const userId = raw.user?._id || raw.user?.id || raw._id || raw.id || '';
  const profileId = raw.user ? raw._id || raw.id || '' : (raw.profile as { _id?: string })?._id || '';

  const firstName = raw.user?.firstName || raw.firstName || '';
  const lastName = raw.user?.lastName || raw.lastName || '';
  const fullName =
    raw.user?.fullName ||
    raw.fullName ||
    `${firstName} ${lastName}`.trim() ||
    'Employee';

  const rawProfile = (raw.profile || {}) as Record<string, unknown>;
  const employeeCode =
    raw.employeeCode || (rawProfile.employeeCode as string) || '';
  const designation =
    raw.designation || (rawProfile.designation as string) || '';
  const department =
    raw.department || (rawProfile.department as string) || '';
  const manager = raw.manager ?? rawProfile.manager ?? null;
  const joiningDate =
    raw.joiningDate || (rawProfile.joiningDate as string) || '';

  const profile: EmployeeProfile = {
    _id: profileId,
    employeeCode,
    designation,
    department,
    manager: manager as string | ManagerProfile | null,
    joiningDate,
  };

  return {
    _id: userId,
    firstName,
    lastName,
    fullName,
    email: raw.user?.email || raw.email || '',
    phoneNumber: raw.user?.phoneNumber || raw.phoneNumber || '',
    role: 'EMPLOYEE',
    isActive: raw.user?.isActive ?? raw.isActive ?? true,
    profile,
    profileModel: 'Employee',
    createdBy: raw.createdBy || null,
    createdAt: raw.user?.createdAt || raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
}

/**
 * Normalizes any customer document (from /api/customers or /api/users?role=CUSTOMER)
 * into a uniform User model with user._id and profile metadata.
 */
export function normalizeCustomer(input: unknown): User {
  const raw = (input || {}) as RawBackendItem;
  const userId = raw.user?._id || raw.user?.id || raw._id || raw.id || '';
  const profileId = raw.user ? raw._id || raw.id || '' : (raw.profile as { _id?: string })?._id || '';

  const firstName = raw.user?.firstName || raw.firstName || '';
  const lastName = raw.user?.lastName || raw.lastName || '';
  const fullName =
    raw.user?.fullName ||
    raw.fullName ||
    `${firstName} ${lastName}`.trim() ||
    'Customer';

  const rawProfile = (raw.profile || {}) as Record<string, unknown>;
  const customerCode =
    raw.customerCode || (rawProfile.customerCode as string) || '';
  const membershipType =
    raw.membershipType ||
    (rawProfile.membershipType as 'REGULAR' | 'PREMIUM' | 'VIP') ||
    'REGULAR';
  const loyaltyPoints =
    raw.loyaltyPoints ?? (rawProfile.loyaltyPoints as number) ?? 0;
  const address = raw.address || (rawProfile.address as typeof raw.address) || {};

  const profile: CustomerProfile = {
    _id: profileId,
    customerCode,
    membershipType,
    loyaltyPoints,
    address,
  };

  return {
    _id: userId,
    firstName,
    lastName,
    fullName,
    email: raw.user?.email || raw.email || '',
    phoneNumber: raw.user?.phoneNumber || raw.phoneNumber || '',
    role: 'CUSTOMER',
    isActive: raw.user?.isActive ?? raw.isActive ?? true,
    profile,
    profileModel: 'Customer',
    createdBy: raw.createdBy || null,
    createdAt: raw.user?.createdAt || raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
}

/**
 * Normalizes any user document (from /api/users, /api/auth/me, /api/auth/login)
 */
export function normalizeUser(input: unknown): User {
  const raw = (input || {}) as RawBackendItem;

  // If it's a manager profile with nested user
  if (raw.department && raw.branch && raw.user) {
    return normalizeManager(raw);
  }
  // If it's an employee profile with nested user
  if (raw.employeeCode && raw.user) {
    return normalizeEmployee(raw);
  }
  // If it's a customer profile with nested user
  if (raw.customerCode && raw.user) {
    return normalizeCustomer(raw);
  }

  const userId = raw._id || raw.id || raw.user?._id || raw.user?.id || '';
  const firstName = raw.firstName || raw.user?.firstName || '';
  const lastName = raw.lastName || raw.user?.lastName || '';
  const fullName =
    raw.fullName ||
    raw.user?.fullName ||
    `${firstName} ${lastName}`.trim() ||
    'User';

  const role: UserRole = raw.role || raw.user?.role || 'SUPER_ADMIN';

  let profile = (raw.profile as SuperAdminProfile | ManagerProfile | EmployeeProfile | CustomerProfile) || undefined;
  if (!profile && role === 'SUPER_ADMIN') {
    profile = {
      _id: `prof-${userId}`,
      adminLevel: 'PRIMARY_BOSS',
      permissions: ['*'],
      systemNotes: '',
    };
  }

  return {
    _id: userId,
    firstName,
    lastName,
    fullName,
    email: raw.email || raw.user?.email || '',
    phoneNumber: raw.phoneNumber || raw.user?.phoneNumber || '',
    role,
    isActive: raw.isActive ?? raw.user?.isActive ?? true,
    profile,
    profileModel: raw.profileModel,
    createdBy: raw.createdBy || null,
    createdAt: raw.createdAt || raw.user?.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
}
