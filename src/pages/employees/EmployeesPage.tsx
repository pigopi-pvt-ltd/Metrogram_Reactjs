import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { employeeService } from '@/services/employee.service';
import { managerService } from '@/services/manager.service';
import type { EmployeeProfile, ManagerProfile, User } from '@/types';
import { DataTable, type ColumnDef } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { EmployeeModal, type EmployeeFormValues } from '@/components/employees/EmployeeModal';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Briefcase,
  Building2,
  UserCheck,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { CopyButton } from '@/components/shared/CopyButton';

export const EmployeesPage: React.FC = () => {
  const { user, role } = useAuth();
  const [employees, setEmployees] = useState<User[]>([]);
  const [managers, setManagers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete dialog state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await employeeService.getAll({ search: searchQuery });
      let list = Array.isArray(res.data) ? res.data : (res as { data?: User[] }).data || [];

      // If logged in as Manager, filter to department or managed employees
      if (role === 'MANAGER') {
        const mgrDept = (user?.profile as ManagerProfile)?.department;
        if (mgrDept) {
          list = list.filter((e) => (e.profile as EmployeeProfile)?.department === mgrDept);
        }
      }

      setEmployees(list);
    } catch {
      // Handled
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, role, user]);

  const fetchManagers = useCallback(async () => {
    try {
      const res = await managerService.getAll();
      const list = Array.isArray(res.data) ? res.data : (res as { data?: User[] }).data || [];
      setManagers(list);
    } catch {
      // Handled
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
    fetchManagers();
  }, [fetchEmployees, fetchManagers]);

  const handleOpenAdd = () => {
    setSelectedEmployee(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (employee: User) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
  };

  const handleOpenDelete = (employee: User) => {
    setEmployeeToDelete(employee);
    setDeleteOpen(true);
  };

  const handleStatusToggle = async (employee: User, newStatus: boolean) => {
    try {
      await employeeService.toggleStatus(employee._id, newStatus);
      toast.success(
        `Employee ${employee.firstName} marked as ${newStatus ? 'Active' : 'Inactive'}`
      );
      fetchEmployees();
    } catch {
      // Error handled
    }
  };

  const handleModalSubmit = async (values: EmployeeFormValues) => {
    setIsSubmitting(true);
    try {
      if (selectedEmployee) {
        await employeeService.update(selectedEmployee._id, values);
        toast.success(`Employee ${values.firstName} ${values.lastName} updated successfully!`);
      } else {
        await employeeService.create(values);
        toast.success(`Employee ${values.firstName} ${values.lastName} created successfully!`);
      }
      setModalOpen(false);
      fetchEmployees();
    } catch {
      // Error handled
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return;
    setIsDeleting(true);
    try {
      await employeeService.delete(employeeToDelete._id);
      toast.success(
        `Employee ${employeeToDelete.firstName} ${employeeToDelete.lastName} was deleted`
      );
      setDeleteOpen(false);
      setEmployeeToDelete(null);
      fetchEmployees();
    } catch {
      // Error handled
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper to resolve manager name
  const getManagerDisplay = (managerRef: unknown) => {
    if (!managerRef) return 'None';
    if (typeof managerRef === 'object' && managerRef !== null) {
      const obj = managerRef as { department?: string; branch?: string; firstName?: string; lastName?: string; user?: { firstName?: string; lastName?: string } };
      if (obj.user?.firstName) {
        return `${obj.user.firstName} ${obj.user.lastName || ''}`.trim();
      }
      if (obj.firstName) {
        return `${obj.firstName} ${obj.lastName || ''}`.trim();
      }
      if (obj.department) {
        return obj.branch ? `${obj.department} (${obj.branch})` : obj.department;
      }
      return 'Manager';
    }
    const idStr = String(managerRef);
    const found = managers.find(
      (m) => m._id === idStr || (m.profile as { _id?: string })?._id === idStr
    );
    return found ? found.fullName || `${found.firstName} ${found.lastName}` : 'Assigned Manager';
  };

  const columns: ColumnDef<User>[] = [
    {
      key: 'name',
      header: 'Employee Name',
      render: (e) => {
        const name = e.fullName || `${e.firstName} ${e.lastName}`;
        return (
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <span>{name}</span>
            <CopyButton text={name} label="Employee Name" className="opacity-70 hover:opacity-100" />
          </div>
        );
      },
    },
    {
      key: 'email',
      header: 'Email Address',
      render: (e) => (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>{e.email}</span>
          <CopyButton text={e.email} label="Email" className="opacity-70 hover:opacity-100" />
        </div>
      ),
    },
    {
      key: 'code',
      header: 'Staff / Emp Code',
      render: (e) => {
        const code = (e.profile as EmployeeProfile)?.employeeCode;
        return (
          <div className="flex items-center gap-1.5">
            <code className="text-xs font-mono bg-muted/60 px-1.5 py-0.5 rounded text-foreground font-semibold">
              {code || 'N/A'}
            </code>
            {code && <CopyButton text={code} label="Employee Code" className="opacity-70 hover:opacity-100" />}
          </div>
        );
      },
    },
    {
      key: 'designation',
      header: 'Designation',
      render: (e) => (
        <div className="flex items-center gap-1.5 text-xs font-medium">
          <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{(e.profile as EmployeeProfile)?.designation || 'Specialist'}</span>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      render: (e) => (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{(e.profile as EmployeeProfile)?.department || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'manager',
      header: 'Supervising Manager',
      render: (e) => (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{getManagerDisplay((e.profile as EmployeeProfile)?.manager)}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (e) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={e.isActive}
            onCheckedChange={(checked) => handleStatusToggle(e, checked)}
            aria-label="Toggle employee status"
          />
          <StatusBadge isActive={e.isActive} />
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (e) => (
        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleOpenEdit(e)} className="gap-2">
                <Edit className="h-3.5 w-3.5" />
                <span>Edit Employee</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleOpenDelete(e)}
                className="gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Employee</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Briefcase className="h-5 w-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {role === 'MANAGER' ? 'Team Staff Management' : 'Employee Directory'}
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {role === 'MANAGER'
              ? 'Manage personnel assigned under your supervisory department.'
              : 'Enterprise-wide employee roster, role designations, and manager bindings.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => fetchEmployees()} className="gap-1.5">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleOpenAdd} size="sm" className="gap-1.5 shadow-xs">
            <Plus className="h-4 w-4" />
            Add New Employee
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={employees}
        isLoading={isLoading}
        searchPlaceholder="Search by name, employee code, designation..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        emptyTitle="No employees found"
        emptyDescription="Add staff members to your department or team roster."
        emptyActionLabel="Add Employee"
        onEmptyAction={handleOpenAdd}
      />

      {/* Employee Add / Edit Modal */}
      <EmployeeModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        employee={selectedEmployee}
        managers={managers}
        onSubmit={handleModalSubmit}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Employee Record"
        description={`Are you sure you want to delete ${employeeToDelete?.fullName || employeeToDelete?.firstName}? Their customer assignments may need to be transferred.`}
        confirmLabel="Delete Employee"
        cancelLabel="Cancel"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};
