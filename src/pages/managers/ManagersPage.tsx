import React, { useState, useEffect, useCallback } from 'react';
import { managerService } from '@/services/manager.service';
import type { ManagerProfile, User } from '@/types';
import { DataTable, type ColumnDef } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { ManagerModal, type ManagerFormValues } from '@/components/managers/ManagerModal';
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
  Users,
  Building2,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { CopyButton } from '@/components/shared/CopyButton';

export const ManagersPage: React.FC = () => {
  const [managers, setManagers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete dialog state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [managerToDelete, setManagerToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchManagers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await managerService.getAll({ search: searchQuery });
      const list = Array.isArray(res.data) ? res.data : (res as { data?: User[] }).data || [];
      setManagers(list);
    } catch {
      // Error toasted in service
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchManagers();
  }, [fetchManagers]);

  const handleOpenAdd = () => {
    setSelectedManager(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (manager: User) => {
    setSelectedManager(manager);
    setModalOpen(true);
  };

  const handleOpenDelete = (manager: User) => {
    setManagerToDelete(manager);
    setDeleteOpen(true);
  };

  const handleStatusToggle = async (manager: User, newStatus: boolean) => {
    try {
      await managerService.toggleStatus(manager._id, newStatus);
      toast.success(
        `Manager ${manager.firstName} marked as ${newStatus ? 'Active' : 'Inactive'}`
      );
      fetchManagers();
    } catch {
      // Error handled
    }
  };

  const handleModalSubmit = async (values: ManagerFormValues) => {
    setIsSubmitting(true);
    try {
      if (selectedManager) {
        await managerService.update(selectedManager._id, values);
        toast.success(`Manager ${values.firstName} ${values.lastName} updated successfully!`);
      } else {
        await managerService.create(values);
        toast.success(`Manager ${values.firstName} ${values.lastName} created successfully!`);
      }
      setModalOpen(false);
      fetchManagers();
    } catch {
      // Error handled
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!managerToDelete) return;
    setIsDeleting(true);
    try {
      await managerService.delete(managerToDelete._id);
      toast.success(
        `Manager ${managerToDelete.firstName} ${managerToDelete.lastName} was removed`
      );
      setDeleteOpen(false);
      setManagerToDelete(null);
      fetchManagers();
    } catch {
      // Error handled
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      key: 'name',
      header: 'Manager Name',
      render: (m) => {
        const name = m.fullName || `${m.firstName} ${m.lastName}`;
        return (
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <span>{name}</span>
            <CopyButton text={name} label="Manager Name" className="opacity-70 hover:opacity-100" />
          </div>
        );
      },
    },
    {
      key: 'email',
      header: 'Email Address',
      render: (m) => (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>{m.email}</span>
          <CopyButton text={m.email} label="Email" className="opacity-70 hover:opacity-100" />
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      render: (m) => (
        <div className="flex items-center gap-1.5 text-xs font-medium">
          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{(m.profile as ManagerProfile)?.department || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'branch',
      header: 'Branch',
      render: (m) => (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{(m.profile as ManagerProfile)?.branch || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'teamSize',
      header: 'Team Capacity',
      render: (m) => {
        const prof = m.profile as ManagerProfile | undefined;
        const currentCount = Array.isArray(prof?.managedEmployees) ? prof.managedEmployees.length : 0;
        const maxLimit = prof?.maxTeamSize || 10;
        return (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground">
              {currentCount} / {maxLimit}
            </span>
            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden hidden sm:block">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${Math.min((currentCount / maxLimit) * 100, 100)}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (m) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={m.isActive}
            onCheckedChange={(checked) => handleStatusToggle(m, checked)}
            aria-label="Toggle manager status"
          />
          <StatusBadge isActive={m.isActive} />
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (m) => (
        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleOpenEdit(m)} className="gap-2">
                <Edit className="h-3.5 w-3.5" />
                <span>Edit Manager</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleOpenDelete(m)}
                className="gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Manager</span>
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
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Users className="h-5 w-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Manager Management
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Super Admin directory for department supervisors, branch quotas, and permissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => fetchManagers()} className="gap-1.5">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleOpenAdd} size="sm" className="gap-1.5 shadow-xs">
            <Plus className="h-4 w-4" />
            Add New Manager
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={managers}
        isLoading={isLoading}
        searchPlaceholder="Search manager name, email, department..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        emptyTitle="No managers found"
        emptyDescription="Get started by creating your first department manager."
        emptyActionLabel="Add Manager"
        onEmptyAction={handleOpenAdd}
      />

      {/* Manager Add / Edit Modal */}
      <ManagerModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        manager={selectedManager}
        onSubmit={handleModalSubmit}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Manager Account"
        description={`Are you sure you want to delete ${managerToDelete?.fullName || managerToDelete?.firstName}? This action cannot be undone and will unassign their supervised staff.`}
        confirmLabel="Delete Manager"
        cancelLabel="Cancel"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};
