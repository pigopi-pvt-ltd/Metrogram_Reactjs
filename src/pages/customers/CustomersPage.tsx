import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { customerService } from '@/services/customer.service';
import type { CustomerProfile, MembershipTier, User } from '@/types';
import { DataTable, type ColumnDef } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MembershipBadge } from '@/components/shared/MembershipBadge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { CustomerModal, type CustomerFormValues } from '@/components/customers/CustomerModal';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  MapPin,
  Sparkles,
  RefreshCw,
  Filter,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const CustomersPage: React.FC = () => {
  const { role } = useAuth();
  const navigate = useNavigate();

  const [customers, setCustomers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('ALL');

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete dialog state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await customerService.getAll({
        search: searchQuery,
        membershipType: tierFilter !== 'ALL' ? (tierFilter as MembershipTier) : undefined,
      });
      const list = Array.isArray(res.data) ? res.data : (res as { data?: User[] }).data || [];
      setCustomers(list);
    } catch {
      // Handled
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, tierFilter]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleOpenAdd = () => {
    if (role === 'EMPLOYEE') {
      navigate('/customers/new');
    } else {
      setSelectedCustomer(null);
      setModalOpen(true);
    }
  };

  const handleOpenEdit = (customer: User) => {
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  const handleOpenDelete = (customer: User) => {
    setCustomerToDelete(customer);
    setDeleteOpen(true);
  };

  const handleStatusToggle = async (customer: User, newStatus: boolean) => {
    try {
      await customerService.toggleStatus(customer._id, newStatus);
      toast.success(
        `Customer ${customer.firstName} marked as ${newStatus ? 'Active' : 'Inactive'}`
      );
      fetchCustomers();
    } catch {
      // Error handled
    }
  };

  const handleModalSubmit = async (values: CustomerFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        phoneNumber: values.phoneNumber,
        customerCode: values.customerCode,
        membershipType: values.membershipType,
        loyaltyPoints: values.loyaltyPoints,
        isActive: values.isActive,
        address: {
          street: values.street,
          city: values.city,
          state: values.state,
          zipCode: values.zipCode,
          country: values.country,
        },
      };

      if (selectedCustomer) {
        await customerService.update(selectedCustomer._id, payload);
        toast.success(`Customer ${values.firstName} ${values.lastName} updated successfully!`);
      } else {
        await customerService.create(payload);
        toast.success(`Customer ${values.firstName} ${values.lastName} registered successfully!`);
      }
      setModalOpen(false);
      fetchCustomers();
    } catch {
      // Error handled
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!customerToDelete) return;
    setIsDeleting(true);
    try {
      await customerService.delete(customerToDelete._id);
      toast.success(
        `Customer ${customerToDelete.firstName} ${customerToDelete.lastName} was deleted`
      );
      setDeleteOpen(false);
      setCustomerToDelete(null);
      fetchCustomers();
    } catch {
      // Error handled
    } finally {
      setIsDeleting(false);
    }
  };

  const formatAddress = (profile?: CustomerProfile) => {
    if (!profile?.address) return 'No address on file';
    const parts = [
      profile.address.city,
      profile.address.state,
      profile.address.country,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'No address on file';
  };

  const columns: ColumnDef<User>[] = [
    {
      key: 'name',
      header: 'Customer Details',
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
      key: 'code',
      header: 'Customer ID',
      render: (c) => (
        <code className="text-xs font-mono bg-muted/60 px-1.5 py-0.5 rounded text-foreground font-semibold">
          {(c.profile as CustomerProfile)?.customerCode || 'N/A'}
        </code>
      ),
    },
    {
      key: 'tier',
      header: 'Membership Tier',
      render: (c) => (
        <MembershipBadge
          tier={(c.profile as CustomerProfile)?.membershipType || 'REGULAR'}
        />
      ),
    },
    {
      key: 'loyaltyPoints',
      header: 'Loyalty Rewards',
      render: (c) => (
        <div className="flex items-center gap-1.5 font-bold text-foreground">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>{((c.profile as CustomerProfile)?.loyaltyPoints || 0).toLocaleString()} pts</span>
        </div>
      ),
    },
    {
      key: 'address',
      header: 'Location',
      render: (c) => (
        <div className="flex items-center gap-1 text-xs text-muted-foreground max-w-[180px] truncate">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{formatAddress(c.profile as CustomerProfile)}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (c) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={c.isActive}
            onCheckedChange={(checked) => handleStatusToggle(c, checked)}
            aria-label="Toggle customer status"
          />
          <StatusBadge isActive={c.isActive} />
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (c) => (
        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleOpenEdit(c)} className="gap-2">
                <Edit className="h-3.5 w-3.5" />
                <span>Edit Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleOpenDelete(c)}
                className="gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Customer</span>
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
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <UserCheck className="h-5 w-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Customer Directory
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Browse, manage, and provision customer accounts with VIP, Premium, and Regular tiers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => fetchCustomers()} className="gap-1.5">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleOpenAdd} size="sm" className="gap-1.5 shadow-xs">
            <Plus className="h-4 w-4" />
            Register Customer
          </Button>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 max-w-xs w-full">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          <Select value={tierFilter} onValueChange={setTierFilter}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Filter by Membership" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Membership Tiers</SelectItem>
              <SelectItem value="VIP">VIP Members Only</SelectItem>
              <SelectItem value="PREMIUM">Premium Members Only</SelectItem>
              <SelectItem value="REGULAR">Regular Members Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={customers}
        isLoading={isLoading}
        searchPlaceholder="Search customers by name, code, email, city..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        emptyTitle="No customers found"
        emptyDescription="Register customers to begin tracking loyalty points and servicing accounts."
        emptyActionLabel="Register Customer"
        onEmptyAction={handleOpenAdd}
      />

      {/* Customer Add / Edit Modal */}
      <CustomerModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        customer={selectedCustomer}
        onSubmit={handleModalSubmit}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Customer Account"
        description={`Are you sure you want to delete ${customerToDelete?.fullName || customerToDelete?.firstName}? Their membership history and loyalty points will be permanently cleared.`}
        confirmLabel="Delete Customer"
        cancelLabel="Cancel"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};
