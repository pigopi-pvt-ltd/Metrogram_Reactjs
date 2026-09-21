import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardService } from '@/services/dashboard.service';
import { managerService } from '@/services/manager.service';
import { employeeService } from '@/services/employee.service';
import { customerService } from '@/services/customer.service';
import type {
  CustomerProfile,
  DashboardStatsResponse,
  ManagerProfile,
  User,
} from '@/types';
import { StatCard } from '@/components/shared/StatCard';
import { RoleBadge } from '@/components/shared/RoleBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MembershipBadge } from '@/components/shared/MembershipBadge';
import { DataTable, type ColumnDef } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  Briefcase,
  UserCheck,
  Activity,
  Plus,
  ShieldCheck,
  Building2,
  MapPin,
  TrendingUp,
  Award,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ManagerModal, type ManagerFormValues } from '@/components/managers/ManagerModal';
import { EmployeeModal, type EmployeeFormValues } from '@/components/employees/EmployeeModal';
import { CustomerModal, type CustomerFormValues } from '@/components/customers/CustomerModal';
import { toast } from 'sonner';

export const DashboardPage: React.FC = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Modals state for quick action triggers
  const [managerModalOpen, setManagerModalOpen] = useState(false);
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [allManagers, setAllManagers] = useState<User[]>([]);
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);

  const fetchStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const res = await dashboardService.getStats(user);
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch {
      // Error handled
    } finally {
      setIsLoadingStats(false);
    }
  }, [user]);

  const fetchManagersList = useCallback(async () => {
    try {
      const res = await managerService.getAll();
      const list = Array.isArray(res.data) ? res.data : (res as { data?: User[] }).data || [];
      setAllManagers(list);
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    fetchStats();
    if (role === 'SUPER_ADMIN' || role === 'MANAGER') {
      fetchManagersList();
    }
  }, [fetchStats, fetchManagersList, role]);

  // Modal Submit Handlers
  const handleCreateManager = async (values: ManagerFormValues) => {
    setIsSubmittingModal(true);
    try {
      await managerService.create(values);
      toast.success(`Manager ${values.firstName} ${values.lastName} created successfully!`);
      setManagerModalOpen(false);
      fetchStats();
      fetchManagersList();
    } catch {
      // Error toasted in service/api
    } finally {
      setIsSubmittingModal(false);
    }
  };

  const handleCreateEmployee = async (values: EmployeeFormValues) => {
    setIsSubmittingModal(true);
    try {
      await employeeService.create(values);
      toast.success(`Employee ${values.firstName} ${values.lastName} created successfully!`);
      setEmployeeModalOpen(false);
      fetchStats();
    } catch {
      // Error toasted in service/api
    } finally {
      setIsSubmittingModal(false);
    }
  };

  const handleCreateCustomer = async (values: CustomerFormValues) => {
    setIsSubmittingModal(true);
    try {
      await customerService.create({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        phoneNumber: values.phoneNumber,
        customerCode: values.customerCode,
        membershipType: values.membershipType,
        loyaltyPoints: values.loyaltyPoints,
        address: {
          street: values.street,
          city: values.city,
          state: values.state,
          zipCode: values.zipCode,
          country: values.country,
        },
      });
      toast.success(`Customer ${values.firstName} ${values.lastName} registered successfully!`);
      setCustomerModalOpen(false);
      fetchStats();
    } catch {
      // Error toasted
    } finally {
      setIsSubmittingModal(false);
    }
  };

  // User activity column definitions
  const userActivityColumns: ColumnDef<User>[] = [
    {
      key: 'name',
      header: 'User',
      render: (u) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">
            {u.fullName || `${u.firstName} ${u.lastName}`}
          </span>
          <span className="text-xs text-muted-foreground">{u.email}</span>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (u) => <RoleBadge role={u.role} />,
    },
    {
      key: 'status',
      header: 'Status',
      render: (u) => <StatusBadge isActive={u.isActive} />,
    },
    {
      key: 'createdAt',
      header: 'Joined Date',
      render: (u) => (
        <span className="text-xs text-muted-foreground">
          {new Date(u.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      ),
    },
  ];

  // Customer column definitions for manager/employee view
  const recentCustomerColumns: ColumnDef<User>[] = [
    {
      key: 'name',
      header: 'Customer',
      render: (c) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">
            {c.fullName || `${c.firstName} ${c.lastName}`}
          </span>
          <span className="text-xs text-muted-foreground">{c.email}</span>
        </div>
      ),
    },
    {
      key: 'customerCode',
      header: 'Code',
      render: (c) => (
        <code className="text-xs font-mono font-medium">
          {(c.profile as CustomerProfile)?.customerCode || 'N/A'}
        </code>
      ),
    },
    {
      key: 'tier',
      header: 'Tier',
      render: (c) => (
        <MembershipBadge
          tier={(c.profile as CustomerProfile)?.membershipType || 'REGULAR'}
        />
      ),
    },
    {
      key: 'points',
      header: 'Points',
      render: (c) => (
        <span className="font-semibold text-foreground">
          {((c.profile as CustomerProfile)?.loyaltyPoints || 0).toLocaleString()} pts
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (c) => <StatusBadge isActive={c.isActive} />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Welcome back, {user?.firstName}!
            </h1>
            {role && <RoleBadge role={role} />}
          </div>
          <p className="text-sm text-muted-foreground">
            {role === 'SUPER_ADMIN' && 'Comprehensive platform oversight, department analytics, and user governance.'}
            {role === 'MANAGER' && 'Departmental leadership, team quota management, and customer satisfaction.'}
            {role === 'EMPLOYEE' && 'Direct customer servicing, client onboarding, and loyalty reward administration.'}
          </p>
        </div>

        {/* Quick Action Buttons for Super Admin & Employee */}
        <div className="flex items-center gap-2">
          {role === 'SUPER_ADMIN' && (
            <>
              <Button onClick={() => setManagerModalOpen(true)} size="sm" className="gap-1.5 shadow-xs">
                <Plus className="h-4 w-4" /> Add Manager
              </Button>
              <Button onClick={() => setEmployeeModalOpen(true)} variant="outline" size="sm" className="gap-1.5 shadow-xs">
                <Plus className="h-4 w-4" /> Add Employee
              </Button>
              <Button onClick={() => setCustomerModalOpen(true)} variant="secondary" size="sm" className="gap-1.5 shadow-xs">
                <Plus className="h-4 w-4" /> Add Customer
              </Button>
            </>
          )}

          {role === 'MANAGER' && (
            <>
              <Button onClick={() => setEmployeeModalOpen(true)} size="sm" className="gap-1.5 shadow-xs">
                <Plus className="h-4 w-4" /> Add Team Member
              </Button>
              <Button onClick={() => setCustomerModalOpen(true)} variant="outline" size="sm" className="gap-1.5 shadow-xs">
                <Plus className="h-4 w-4" /> Add Customer
              </Button>
            </>
          )}

          {role === 'EMPLOYEE' && (
            <Button onClick={() => navigate('/customers/new')} size="sm" className="gap-1.5 shadow-xs">
              <Plus className="h-4 w-4" /> Register New Customer
            </Button>
          )}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 1. SUPER ADMIN VIEW */}
      {/* ────────────────────────────────────────────────────────── */}
      {role === 'SUPER_ADMIN' && (
        <>
          {/* 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Managers"
              value={stats?.summary?.totalManagers ?? 4}
              description="Across all departments"
              icon={<Users className="h-5 w-5 text-blue-500" />}
              isLoading={isLoadingStats}
            />
            <StatCard
              title="Total Employees"
              value={stats?.summary?.totalEmployees ?? 5}
              description="Active team staff"
              icon={<Briefcase className="h-5 w-5 text-emerald-500" />}
              isLoading={isLoadingStats}
            />
            <StatCard
              title="Total Customers"
              value={stats?.summary?.totalCustomers ?? 5}
              description="Registered client base"
              icon={<UserCheck className="h-5 w-5 text-amber-500" />}
              isLoading={isLoadingStats}
            />
            <StatCard
              title="Active Ratio"
              value={`${stats?.summary?.activeRatioPercentage ?? 85}%`}
              description={`${stats?.summary?.activeUsers ?? 12} of ${stats?.summary?.totalUsers ?? 15} accounts active`}
              icon={<Activity className="h-5 w-5 text-purple-500" />}
              isLoading={isLoadingStats}
              trend={{
                value: 'Healthy',
                isPositive: true,
              }}
            />
          </div>

          {/* Quick Shortcuts & Recent Registrations Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Table Area (2 Cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold tracking-tight">Recent Platform Registrations</h3>
                  <p className="text-xs text-muted-foreground">Latest accounts provisioned in MetroGram</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/managers')} className="text-xs gap-1">
                  View All Directory <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>

              <DataTable
                columns={userActivityColumns}
                data={stats?.recentActivity || []}
                isLoading={isLoadingStats}
                emptyTitle="No recent user activity"
                emptyDescription="New manager, employee, or customer accounts will appear here."
              />
            </div>

            {/* Quick Action Launcher Card (1 Col) */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold tracking-tight">Administrative Controls</h3>
              <Card className="bg-card/70 border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-purple-500" />
                    Rapid Management
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Quickly launch administrative workflows
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  <button
                    onClick={() => setManagerModalOpen(true)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border bg-muted/30 hover:bg-accent transition-colors text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-blue-500/15 text-blue-600 flex items-center justify-center font-bold">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Add Manager</div>
                        <div className="text-xs text-muted-foreground">Provision department leader</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => setEmployeeModalOpen(true)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border bg-muted/30 hover:bg-accent transition-colors text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-600 flex items-center justify-center font-bold">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Add Employee</div>
                        <div className="text-xs text-muted-foreground">Assign to department manager</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => setCustomerModalOpen(true)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border bg-muted/30 hover:bg-accent transition-colors text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center font-bold">
                        <UserCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Add Customer</div>
                        <div className="text-xs text-muted-foreground">Assign VIP / Premium tier</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* 2. MANAGER VIEW */}
      {/* ────────────────────────────────────────────────────────── */}
      {role === 'MANAGER' && (
        <>
          {/* Manager Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Assigned Department"
              value={stats?.managerInfo?.department || (user?.profile as ManagerProfile)?.department || 'Operations & Logistics'}
              description="Operational division"
              icon={<Building2 className="h-5 w-5 text-blue-500" />}
              isLoading={isLoadingStats}
            />
            <StatCard
              title="Office Branch"
              value={stats?.managerInfo?.branch || (user?.profile as ManagerProfile)?.branch || 'Downtown Headquarters'}
              description="Regional location"
              icon={<MapPin className="h-5 w-5 text-purple-500" />}
              isLoading={isLoadingStats}
            />
            <StatCard
              title="Team Members"
              value={`${stats?.managerInfo?.teamSize ?? stats?.summary?.totalDepartmentEmployees ?? 0} / ${stats?.managerInfo?.maxTeamSize ?? (user?.profile as ManagerProfile)?.maxTeamSize ?? 15}`}
              description="Active team capacity"
              icon={<Briefcase className="h-5 w-5 text-emerald-500" />}
              isLoading={isLoadingStats}
            />
            <StatCard
              title="Total Customers"
              value={stats?.summary?.totalCustomers ?? stats?.summary?.totalCustomersServiced ?? 0}
              description="Serviced in directory"
              icon={<UserCheck className="h-5 w-5 text-amber-500" />}
              isLoading={isLoadingStats}
            />
          </div>

          {/* Team Capacity Progress Bar */}
          <Card className="p-6">
            {(() => {
              const currentTeam = stats?.managerInfo?.teamSize ?? stats?.summary?.totalDepartmentEmployees ?? 0;
              const maxTeam = stats?.managerInfo?.maxTeamSize ?? (user?.profile as ManagerProfile)?.maxTeamSize ?? 15;
              const percent = maxTeam > 0 ? Math.round((currentTeam / maxTeam) * 100) : 0;
              return (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <h4 className="text-sm font-semibold">Team Quota Utilization</h4>
                    </div>
                    <span className="text-xs font-bold text-muted-foreground">
                      {percent}% capacity ({currentTeam} of {maxTeam} members)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500 rounded-full"
                      style={{ width: `${Math.min(percent, 100)}%` }}
                    />
                  </div>
                </>
              );
            })()}
          </Card>

          {/* Recent Customers Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold tracking-tight">Recent Client Registrations</h3>
                <p className="text-xs text-muted-foreground">Customers managed under department services</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/customers')} className="text-xs gap-1">
                View All Directory <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            <DataTable
              columns={recentCustomerColumns}
              data={stats?.recentCustomers || []}
              isLoading={isLoadingStats}
              emptyTitle="No recent customers"
              emptyDescription="Customers created in your division will appear here."
            />
          </div>
        </>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* 3. EMPLOYEE VIEW */}
      {/* ────────────────────────────────────────────────────────── */}
      {role === 'EMPLOYEE' && (
        <>
          {/* Employee KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Customers in Directory"
              value={stats?.summary?.totalCustomers ?? 5}
              description="Platform wide directory"
              icon={<Users className="h-5 w-5 text-blue-500" />}
              isLoading={isLoadingStats}
            />
            <StatCard
              title="Created By Me"
              value={stats?.summary?.customersCreatedByMe ?? 3}
              description="Directly registered accounts"
              icon={<Award className="h-5 w-5 text-emerald-500" />}
              isLoading={isLoadingStats}
              trend={{
                value: '+2 this month',
                isPositive: true,
              }}
            />
            <StatCard
              title="Active Customer Ratio"
              value={`${stats?.summary?.activeCustomersRatio ?? 90}%`}
              description="Good standing accounts"
              icon={<Sparkles className="h-5 w-5 text-amber-500" />}
              isLoading={isLoadingStats}
            />
          </div>

          {/* Quick Register Banner */}
          <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-primary" />
                  Quick Customer Onboarding
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1">
                  Onboard a new client, configure their membership tier (Regular, Premium, VIP), and grant portal access.
                </CardDescription>
              </div>
              <Button onClick={() => navigate('/customers/new')} className="gap-2 shrink-0">
                <Plus className="h-4 w-4" />
                Register Customer
              </Button>
            </CardHeader>
          </Card>

          {/* Recent Customers Directory */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold tracking-tight">Recent Customer Directory</h3>
                <p className="text-xs text-muted-foreground">Clients registered across the platform</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/customers')} className="text-xs gap-1">
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            <DataTable
              columns={recentCustomerColumns}
              data={stats?.recentCustomers || []}
              isLoading={isLoadingStats}
              emptyTitle="No registered customers"
              emptyDescription="Click register customer above to add your first customer."
            />
          </div>
        </>
      )}

      {/* Reusable Action Modals */}
      <ManagerModal
        open={managerModalOpen}
        onOpenChange={setManagerModalOpen}
        onSubmit={handleCreateManager}
        isLoading={isSubmittingModal}
      />

      <EmployeeModal
        open={employeeModalOpen}
        onOpenChange={setEmployeeModalOpen}
        managers={allManagers}
        onSubmit={handleCreateEmployee}
        isLoading={isSubmittingModal}
      />

      <CustomerModal
        open={customerModalOpen}
        onOpenChange={setCustomerModalOpen}
        onSubmit={handleCreateCustomer}
        isLoading={isSubmittingModal}
      />
    </div>
  );
};
