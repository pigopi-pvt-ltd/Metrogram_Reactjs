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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { EmployeeProfile, ManagerProfile, User } from '@/types';

const employeeSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().optional(),
  phoneNumber: z.string().optional(),
  employeeCode: z.string().min(2, 'Employee code is required'),
  designation: z.string().min(2, 'Designation is required'),
  department: z.string().min(2, 'Department is required'),
  managerId: z.string().optional(),
  joiningDate: z.string().min(4, 'Joining date is required'),
  isActive: z.boolean(),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface EmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: User | null;
  managers?: User[];
  onSubmit: (values: EmployeeFormValues) => Promise<void>;
  isLoading?: boolean;
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  open,
  onOpenChange,
  employee,
  managers = [],
  onSubmit,
  isLoading = false,
}) => {
  const isEdit = !!employee;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      employeeCode: '',
      designation: '',
      department: 'Engineering',
      managerId: '',
      joiningDate: new Date().toISOString().split('T')[0],
      isActive: true,
    },
  });

  const isActive = watch('isActive');
  const selectedManagerId = watch('managerId');

  useEffect(() => {
    if (employee) {
      const profile = employee.profile as EmployeeProfile | undefined;
      const managerVal = typeof profile?.manager === 'object' && profile?.manager !== null
        ? (profile.manager as ManagerProfile)._id
        : (profile?.manager as string) || '';

      reset({
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        email: employee.email || '',
        password: '',
        phoneNumber: employee.phoneNumber || '',
        employeeCode: profile?.employeeCode || '',
        designation: profile?.designation || '',
        department: profile?.department || '',
        managerId: managerVal,
        joiningDate: profile?.joiningDate ? profile.joiningDate.split('T')[0] : new Date().toISOString().split('T')[0],
        isActive: employee.isActive ?? true,
      });
    } else {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
        employeeCode: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
        designation: '',
        department: 'Operations',
        managerId: managers.length > 0 ? managers[0]._id : '',
        joiningDate: new Date().toISOString().split('T')[0],
        isActive: true,
      });
    }
  }, [employee, managers, reset, open]);

  const onFormSubmit = async (data: EmployeeFormValues) => {
    await onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEdit ? 'Edit Employee Details' : 'Add New Employee'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Modify employee assignment, role designations, and access credentials.'
              : 'Add a new employee and link them to a supervisory manager.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-2">
          {/* Name fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="empFirstName">First Name</Label>
              <Input
                id="empFirstName"
                placeholder="e.g. Sarah"
                {...register('firstName')}
              />
              {errors.firstName && (
                <p className="text-xs text-destructive">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="empLastName">Last Name</Label>
              <Input
                id="empLastName"
                placeholder="e.g. Connor"
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
              <Label htmlFor="empEmail">Email Address</Label>
              <Input
                id="empEmail"
                type="email"
                placeholder="sarah.c@metrogram.io"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="empPhoneNumber">Phone Number</Label>
              <Input
                id="empPhoneNumber"
                placeholder="+1 (555) 342-9981"
                {...register('phoneNumber')}
              />
              {errors.phoneNumber && (
                <p className="text-xs text-destructive">{errors.phoneNumber.message}</p>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="empPassword">
              {isEdit ? 'New Password (leave blank to retain current)' : 'Account Password'}
            </Label>
            <Input
              id="empPassword"
              type="password"
              placeholder={isEdit ? '••••••••' : 'Enter secure password'}
              {...register('password')}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          {/* Employee Code & Designation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="employeeCode">Employee Code</Label>
              <Input
                id="employeeCode"
                placeholder="e.g. EMP-1042"
                {...register('employeeCode')}
              />
              {errors.employeeCode && (
                <p className="text-xs text-destructive">{errors.employeeCode.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="designation">Designation / Title</Label>
              <Input
                id="designation"
                placeholder="e.g. Senior Representative"
                {...register('designation')}
              />
              {errors.designation && (
                <p className="text-xs text-destructive">{errors.designation.message}</p>
              )}
            </div>
          </div>

          {/* Department & Joining Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="empDepartment">Department</Label>
              <Input
                id="empDepartment"
                placeholder="e.g. Customer Success"
                {...register('department')}
              />
              {errors.department && (
                <p className="text-xs text-destructive">{errors.department.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="joiningDate">Joining Date</Label>
              <Input
                id="joiningDate"
                type="date"
                {...register('joiningDate')}
              />
              {errors.joiningDate && (
                <p className="text-xs text-destructive">{errors.joiningDate.message}</p>
              )}
            </div>
          </div>

          {/* Assigned Manager Dropdown */}
          {managers.length > 0 && (
            <div className="space-y-1.5">
              <Label htmlFor="managerSelect">Assigned Manager</Label>
              <Select
                value={selectedManagerId || 'none'}
                onValueChange={(val) => setValue('managerId', val === 'none' ? '' : val)}
              >
                <SelectTrigger id="managerSelect">
                  <SelectValue placeholder="Select supervising manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">-- No Direct Manager --</SelectItem>
                  {managers.map((m) => (
                    <SelectItem key={m._id} value={m._id}>
                      {m.fullName || `${m.firstName} ${m.lastName}`} ({m.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Status switch */}
          <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
            <div className="space-y-0.5">
              <Label htmlFor="empActive" className="text-sm font-medium">Account Active</Label>
              <p className="text-xs text-muted-foreground">Allow employee login and customer servicing</p>
            </div>
            <Switch
              id="empActive"
              checked={isActive}
              onCheckedChange={(checked) => setValue('isActive', checked)}
            />
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
              {isEdit ? 'Save Changes' : 'Create Employee'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
