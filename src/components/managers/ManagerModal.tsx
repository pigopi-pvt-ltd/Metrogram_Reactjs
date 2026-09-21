import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { ManagerProfile, User } from '@/types';

const managerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().optional(),
  phoneNumber: z.string().optional(),
  department: z.string().min(2, 'Department is required'),
  branch: z.string().min(2, 'Branch is required'),
  maxTeamSize: z.number().min(1, 'Max team size must be at least 1').max(200, 'Max team size limit is 200'),
  isActive: z.boolean(),
});

export type ManagerFormValues = z.infer<typeof managerSchema>;

interface ManagerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  manager?: User | null;
  onSubmit: (values: ManagerFormValues) => Promise<void>;
  isLoading?: boolean;
}

export const ManagerModal: React.FC<ManagerModalProps> = ({
  open,
  onOpenChange,
  manager,
  onSubmit,
  isLoading = false,
}) => {
  const isEdit = !!manager;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ManagerFormValues>({
    resolver: zodResolver(managerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      department: 'Engineering',
      branch: 'Main HQ',
      maxTeamSize: 10,
      isActive: true,
    },
  });

  const isActive = watch('isActive');

  useEffect(() => {
    if (manager) {
      const profile = manager.profile as ManagerProfile | undefined;
      reset({
        firstName: manager.firstName || '',
        lastName: manager.lastName || '',
        email: manager.email || '',
        password: '',
        phoneNumber: manager.phoneNumber || '',
        department: profile?.department || '',
        branch: profile?.branch || '',
        maxTeamSize: profile?.maxTeamSize || 10,
        isActive: manager.isActive ?? true,
      });
    } else {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
        department: '',
        branch: '',
        maxTeamSize: 10,
        isActive: true,
      });
    }
  }, [manager, reset, open]);

  const onFormSubmit = async (data: ManagerFormValues) => {
    await onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEdit ? 'Edit Manager Profile' : 'Add New Manager'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update manager account details, department assignment, and team limits.'
              : 'Create a new manager account with administrative oversight and team quotas.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-2">
          {/* Name fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="e.g. Alexander"
                {...register('firstName')}
              />
              {errors.firstName && (
                <p className="text-xs text-destructive">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="e.g. Wright"
                {...register('lastName')}
              />
              {errors.lastName && (
                <p className="text-xs text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="alex.wright@metrogram.io"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                placeholder="+1 (555) 019-2834"
                {...register('phoneNumber')}
              />
              {errors.phoneNumber && (
                <p className="text-xs text-destructive">{errors.phoneNumber.message}</p>
              )}
            </div>
          </div>

          {/* Password (if new manager or reset) */}
          <div className="space-y-1.5">
            <Label htmlFor="password">
              {isEdit ? 'New Password (leave blank to retain current)' : 'Account Password'}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={isEdit ? '••••••••' : 'Enter secure password'}
              {...register('password')}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          {/* Profile metadata: Department & Branch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="e.g. Operations, Sales"
                {...register('department')}
              />
              {errors.department && (
                <p className="text-xs text-destructive">{errors.department.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="branch">Branch / Office</Label>
              <Input
                id="branch"
                placeholder="e.g. New York Hub, Chicago"
                {...register('branch')}
              />
              {errors.branch && (
                <p className="text-xs text-destructive">{errors.branch.message}</p>
              )}
            </div>
          </div>

          {/* Max Team Size & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="maxTeamSize">Max Team Capacity</Label>
              <Input
                id="maxTeamSize"
                type="number"
                min="1"
                max="200"
                {...register('maxTeamSize', { valueAsNumber: true })}
              />
              {errors.maxTeamSize && (
                <p className="text-xs text-destructive">{errors.maxTeamSize.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <div className="space-y-0.5">
                <Label htmlFor="isActive" className="text-sm font-medium">Account Active</Label>
                <p className="text-xs text-muted-foreground">Allow login and team access</p>
              </div>
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => setValue('isActive', checked)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              {isEdit ? 'Save Changes' : 'Create Manager'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
