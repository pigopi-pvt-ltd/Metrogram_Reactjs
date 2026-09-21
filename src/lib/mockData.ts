import type {
  CustomerProfile,
  DashboardStatsResponse,
  EmployeeProfile,
  ManagerProfile,
  SuperAdminProfile,
  User,
} from '@/types';

export const INITIAL_SUPER_ADMIN: User = {
  _id: '66ee8e001234567890abc999',
  firstName: 'Boss',
  lastName: 'Admin',
  fullName: 'Boss Admin',
  email: 'boss@company.com',
  phoneNumber: '+1234567890',
  role: 'SUPER_ADMIN',
  isActive: true,
  profile: {
    _id: '66ee8e001234567890abc888',
    adminLevel: 'PRIMARY_BOSS',
    permissions: ['*'],
    systemNotes: 'Master System Admin',
  } as SuperAdminProfile,
  createdAt: '2026-09-21T11:00:00.000Z',
  updatedAt: '2026-09-21T11:00:00.000Z',
};

export const INITIAL_MANAGERS: User[] = [
  {
    _id: '66ee8e011234567890abc001',
    firstName: 'John',
    lastName: 'Davis',
    fullName: 'John Davis',
    email: 'manager.ops@company.com',
    phoneNumber: '+1987654321',
    role: 'MANAGER',
    isActive: true,
    profile: {
      _id: '66ee8e011234567890abcdef',
      department: 'Operations & Logistics',
      branch: 'Downtown Headquarters',
      managedEmployees: ['66ee8e021234567890abc010', '66ee8e021234567890abc011'],
      maxTeamSize: 15,
    } as ManagerProfile,
    createdAt: '2026-09-21T11:01:20.123Z',
    updatedAt: '2026-09-21T11:01:20.125Z',
  },
  {
    _id: '66ee90011234567890abc111',
    firstName: 'Sarah',
    lastName: 'Wilson',
    fullName: 'Sarah Wilson',
    email: 'manager.sales@company.com',
    phoneNumber: '+1999888777',
    role: 'MANAGER',
    isActive: true,
    profile: {
      _id: '66ee90011234567890abc222',
      department: 'Sales & Relations',
      branch: 'West Coast Regional',
      managedEmployees: ['66ee90021234567890abc335'],
      maxTeamSize: 20,
    } as ManagerProfile,
    createdAt: '2026-09-21T11:01:20.125Z',
    updatedAt: '2026-09-21T11:01:20.125Z',
  },
];

export const INITIAL_EMPLOYEES: User[] = [
  {
    _id: '66ee8e021234567890abc002',
    firstName: 'Alex',
    lastName: 'Morgan',
    fullName: 'Alex Morgan',
    email: 'employee.alex@company.com',
    phoneNumber: '+1555123456',
    role: 'EMPLOYEE',
    isActive: true,
    profile: {
      _id: '66ee8e021234567890abc010',
      employeeCode: 'EMP-1001',
      designation: 'Senior Operations Associate',
      department: 'Operations & Logistics',
      manager: '66ee8e011234567890abcdef',
      joiningDate: '2026-09-21T11:01:22.456Z',
    } as EmployeeProfile,
    createdBy: {
      _id: '66ee8e011234567890abc001',
      firstName: 'John',
      lastName: 'Davis',
      email: 'manager.ops@company.com',
      role: 'MANAGER',
    },
    createdAt: '2026-09-21T11:01:22.456Z',
    updatedAt: '2026-09-21T11:01:22.458Z',
  },
  {
    _id: '66ee8e021234567890abc004',
    firstName: 'Lisa',
    lastName: 'Ray',
    fullName: 'Lisa Ray',
    email: 'employee.lisa@company.com',
    phoneNumber: '+1555234567',
    role: 'EMPLOYEE',
    isActive: true,
    profile: {
      _id: '66ee8e021234567890abc011',
      employeeCode: 'EMP-1002',
      designation: 'Logistics Specialist',
      department: 'Operations & Logistics',
      manager: '66ee8e011234567890abcdef',
      joiningDate: '2026-09-21T11:01:22.456Z',
    } as EmployeeProfile,
    createdBy: {
      _id: '66ee8e011234567890abc001',
      firstName: 'John',
      lastName: 'Davis',
      email: 'manager.ops@company.com',
      role: 'MANAGER',
    },
    createdAt: '2026-09-21T11:01:22.456Z',
    updatedAt: '2026-09-21T11:01:22.458Z',
  },
  {
    _id: '66ee90021234567890abc335',
    firstName: 'David',
    lastName: 'Kim',
    fullName: 'David Kim',
    email: 'employee.david@company.com',
    phoneNumber: '+1555345678',
    role: 'EMPLOYEE',
    isActive: true,
    profile: {
      _id: '66ee90021234567890abc445',
      employeeCode: 'EMP-2001',
      designation: 'Client Relations Associate',
      department: 'Sales & Relations',
      manager: '66ee90011234567890abc222',
      joiningDate: '2026-09-21T11:01:22.456Z',
    } as EmployeeProfile,
    createdBy: {
      _id: '66ee90011234567890abc111',
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'manager.sales@company.com',
      role: 'MANAGER',
    },
    createdAt: '2026-09-21T11:01:22.456Z',
    updatedAt: '2026-09-21T11:01:22.458Z',
  },
];

export const INITIAL_CUSTOMERS: User[] = [
  {
    _id: '66ee8e031234567890abc003',
    firstName: 'Emma',
    lastName: 'Watson',
    fullName: 'Emma Watson',
    email: 'customer.emma@gmail.com',
    phoneNumber: '+1444123456',
    role: 'CUSTOMER',
    isActive: true,
    profile: {
      _id: '66ee8e031234567890abc020',
      customerCode: 'CUST-8001',
      membershipType: 'VIP',
      loyaltyPoints: 350,
      address: {
        street: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'OR',
        zipCode: '97477',
        country: 'USA',
      },
    } as CustomerProfile,
    createdBy: {
      _id: '66ee8e021234567890abc002',
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'employee.alex@company.com',
      role: 'EMPLOYEE',
    },
    createdAt: '2026-09-21T11:01:25.789Z',
    updatedAt: '2026-09-21T11:01:25.791Z',
  },
  {
    _id: '66ee90031234567890abc555',
    firstName: 'Michael',
    lastName: 'Scott',
    fullName: 'Michael Scott',
    email: 'customer.michael@gmail.com',
    phoneNumber: '+1555666777',
    role: 'CUSTOMER',
    isActive: true,
    profile: {
      _id: '66ee90031234567890abc666',
      customerCode: 'CUST-8002',
      membershipType: 'PREMIUM',
      loyaltyPoints: 180,
      address: {
        street: '1725 Slough Avenue',
        city: 'Scranton',
        state: 'PA',
        zipCode: '18503',
        country: 'USA',
      },
    } as CustomerProfile,
    createdBy: {
      _id: '66ee8e021234567890abc002',
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'employee.alex@company.com',
      role: 'EMPLOYEE',
    },
    createdAt: '2026-09-21T11:01:25.789Z',
    updatedAt: '2026-09-21T11:01:25.791Z',
  },
  {
    _id: '66ee90031234567890abc557',
    firstName: 'Clara',
    lastName: 'Oswald',
    fullName: 'Clara Oswald',
    email: 'customer.clara@gmail.com',
    phoneNumber: '+1555777888',
    role: 'CUSTOMER',
    isActive: true,
    profile: {
      _id: '66ee90031234567890abc668',
      customerCode: 'CUST-8003',
      membershipType: 'REGULAR',
      loyaltyPoints: 50,
      address: {
        street: '221B Baker Street',
        city: 'London',
        state: 'Greater London',
        zipCode: 'NW1 6XE',
        country: 'UK',
      },
    } as CustomerProfile,
    createdBy: {
      _id: '66ee90021234567890abc335',
      firstName: 'David',
      lastName: 'Kim',
      email: 'employee.david@company.com',
      role: 'EMPLOYEE',
    },
    createdAt: '2026-09-21T11:01:25.789Z',
    updatedAt: '2026-09-21T11:01:25.791Z',
  },
];

export function getMockDashboardStats(user: User): DashboardStatsResponse {
  const managers = INITIAL_MANAGERS;
  const employees = INITIAL_EMPLOYEES;
  const customers = INITIAL_CUSTOMERS;

  if (user.role === 'SUPER_ADMIN') {
    const totalActive =
      managers.filter((m) => m.isActive).length +
      employees.filter((e) => e.isActive).length +
      customers.filter((c) => c.isActive).length +
      1;

    const totalUsers = managers.length + employees.length + customers.length + 1;

    return {
      role: 'SUPER_ADMIN',
      summary: {
        totalUsers: totalUsers,
        totalManagers: managers.length,
        totalEmployees: employees.length,
        totalCustomers: customers.length,
        activeUsers: totalActive,
        inactiveUsers: totalUsers - totalActive,
      },
      recentActivity: [...managers, ...employees, ...customers]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    };
  }

  if (user.role === 'MANAGER') {
    const managerProfile = user.profile as ManagerProfile | undefined;
    const deptEmployees = employees.filter(
      (e) => (e.profile as EmployeeProfile)?.department === managerProfile?.department
    );

    return {
      role: 'MANAGER',
      managerInfo: {
        department: managerProfile?.department || 'Operations & Logistics',
        branch: managerProfile?.branch || 'Downtown Headquarters',
        teamSize: deptEmployees.length,
        maxTeamSize: managerProfile?.maxTeamSize || 15,
      },
      summary: {
        totalDepartmentEmployees: deptEmployees.length,
        totalCustomers: customers.length,
        activeEmployees: deptEmployees.filter((e) => e.isActive).length,
      },
      recentEmployees: deptEmployees.slice(0, 5),
      recentCustomers: customers.slice(0, 5),
    };
  }

  if (user.role === 'EMPLOYEE') {
    const employeeProfile = user.profile as EmployeeProfile | undefined;
    const createdByMe = customers.filter(
      (c) => c.createdBy?._id === user._id || c.createdBy?.email === user.email
    );

    return {
      role: 'EMPLOYEE',
      employeeInfo: {
        employeeCode: employeeProfile?.employeeCode || 'EMP-1001',
        designation: employeeProfile?.designation || 'Senior Operations Associate',
        department: employeeProfile?.department || 'Operations & Logistics',
      },
      summary: {
        totalCustomers: customers.length,
        customersCreatedByMe: createdByMe.length || 2,
      },
      recentCustomers: customers.slice(0, 5),
    };
  }

  // CUSTOMER
  const customerProfile = user.profile as CustomerProfile | undefined;
  return {
    role: 'CUSTOMER',
    summary: {
      loyaltyPoints: customerProfile?.loyaltyPoints || 350,
    },
    customerInfo: {
      customerCode: customerProfile?.customerCode || 'CUST-8001',
      membershipType: customerProfile?.membershipType || 'VIP',
      loyaltyPoints: customerProfile?.loyaltyPoints || 350,
      address: customerProfile?.address || {
        street: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'OR',
        zipCode: '97477',
        country: 'USA',
      },
    },
  };
}
