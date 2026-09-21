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
import type { CustomerProfile, MembershipTier, User } from '@/types';

const customerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().optional(),
  phoneNumber: z.string().optional(),
  customerCode: z.string().optional(),
  membershipType: z.enum(['REGULAR', 'PREMIUM', 'VIP']),
  loyaltyPoints: z.number().min(0, 'Loyalty points cannot be negative'),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  isActive: z.boolean(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: User | null;
  onSubmit: (values: CustomerFormValues) => Promise<void>;
  isLoading?: boolean;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  open,
  onOpenChange,
  customer,
  onSubmit,
  isLoading = false,
}) => {
  const isEdit = !!customer;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      customerCode: '',
      membershipType: 'REGULAR',
      loyaltyPoints: 0,
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      isActive: true,
    },
  });

  const isActive = watch('isActive');
  const membershipType = watch('membershipType');

  useEffect(() => {
    if (customer) {
      const profile = customer.profile as CustomerProfile | undefined;
      reset({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.email || '',
        password: '',
        phoneNumber: customer.phoneNumber || '',
        customerCode: profile?.customerCode || '',
        membershipType: profile?.membershipType || 'REGULAR',
        loyaltyPoints: profile?.loyaltyPoints || 0,
        street: profile?.address?.street || '',
        city: profile?.address?.city || '',
        state: profile?.address?.state || '',
        zipCode: profile?.address?.zipCode || '',
        country: profile?.address?.country || '',
        isActive: customer.isActive ?? true,
      });
    } else {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
        customerCode: `CUST-${Math.floor(10000 + Math.random() * 90000)}`,
        membershipType: 'REGULAR',
        loyaltyPoints: 100,
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
        isActive: true,
      });
    }
  }, [customer, reset, open]);

  const onFormSubmit = async (data: CustomerFormValues) => {
    await onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEdit ? 'Edit Customer Profile' : 'Register New Customer'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update membership tier, loyalty rewards, and address data.'
              : 'Add a customer to the MetroGram platform database.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-2">
          {/* Personal Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="custFirstName">First Name</Label>
              <Input
                id="custFirstName"
                placeholder="e.g. Jordan"
                {...register('firstName')}
              />
              {errors.firstName && (
                <p className="text-xs text-destructive">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="custLastName">Last Name</Label>
              <Input
                id="custLastName"
                placeholder="e.g. Miller"
                {...register('lastName')}
              />
              {errors.lastName && (
                <p className="text-xs text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="custEmail">Email Address</Label>
              <Input
                id="custEmail"
                type="email"
                placeholder="jordan.m@example.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="custPhoneNumber">Phone Number</Label>
              <Input
                id="custPhoneNumber"
                placeholder="+1 (555) 839-2041"
                {...register('phoneNumber')}
              />
              {errors.phoneNumber && (
                <p className="text-xs text-destructive">{errors.phoneNumber.message}</p>
              )}
            </div>
          </div>

          {/* Password (if new or reset) */}
          <div className="space-y-1.5">
            <Label htmlFor="custPassword">
              {isEdit ? 'New Password (leave blank to retain current)' : 'Account Password'}
            </Label>
            <Input
              id="custPassword"
              type="password"
              placeholder={isEdit ? '••••••••' : 'Enter secure customer password'}
              {...register('password')}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          {/* Customer Code, Tier & Points */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="customerCode">Customer Code</Label>
              <Input
                id="customerCode"
                placeholder="CUST-83921"
                {...register('customerCode')}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="membershipType">Membership Tier</Label>
              <Select
                value={membershipType}
                onValueChange={(val) => setValue('membershipType', val as MembershipTier)}
              >
                <SelectTrigger id="membershipType">
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REGULAR">Regular</SelectItem>
                  <SelectItem value="PREMIUM">Premium</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="loyaltyPoints">Loyalty Points</Label>
              <Input
                id="loyaltyPoints"
                type="number"
                min="0"
                {...register('loyaltyPoints', { valueAsNumber: true })}
              />
            </div>
          </div>

          {/* Address Information Section */}
          <div className="rounded-lg border bg-muted/20 p-3 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Address Information
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                placeholder="123 Metro Ave, Suite 400"
                {...register('street')}
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="space-y-1">
                <Label htmlFor="city" className="text-xs">City</Label>
                <Input id="city" placeholder="San Francisco" {...register('city')} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="state" className="text-xs">State</Label>
                <Input id="state" placeholder="CA" {...register('state')} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="zipCode" className="text-xs">Zip Code</Label>
                <Input id="zipCode" placeholder="94105" {...register('zipCode')} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="country" className="text-xs">Country</Label>
                <Input id="country" placeholder="USA" {...register('country')} className="h-8 text-xs" />
              </div>
            </div>
          </div>

          {/* Status switch */}
          <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
            <div className="space-y-0.5">
              <Label htmlFor="custActive" className="text-sm font-medium">Customer Status</Label>
              <p className="text-xs text-muted-foreground">Enable active account and loyalty rewards</p>
            </div>
            <Switch
              id="custActive"
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
              {isEdit ? 'Save Changes' : 'Register Customer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
