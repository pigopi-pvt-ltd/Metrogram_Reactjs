import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { customerService } from '@/services/customer.service';
import type { MembershipTier } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  UserPlus,
  ArrowLeft,
  Sparkles,
  MapPin,
  Mail,
  User,
  Phone,
  Lock,
} from 'lucide-react';
import { toast } from 'sonner';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phoneNumber: z.string().optional(),
  customerCode: z.string().optional(),
  membershipType: z.enum(['REGULAR', 'PREMIUM', 'VIP']),
  loyaltyPoints: z.number().min(0),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  isActive: z.boolean(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const CustomerRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: 'Password123!',
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
    },
  });

  const membershipType = watch('membershipType');
  const isActive = watch('isActive');

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      await customerService.register({
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
      });

      toast.success(
        `Customer ${values.firstName} ${values.lastName} registered successfully!`
      );
      navigate('/customers');
    } catch {
      // Handled
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button & Title */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/customers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-primary" />
            Client Onboarding Registration
          </h1>
          <p className="text-xs text-muted-foreground">
            Register a new client account into the MetroGram ecosystem
          </p>
        </div>
      </div>

      <Card className="border shadow-lg">
        <CardHeader>
          <CardTitle>Customer Account Details</CardTitle>
          <CardDescription>
            Provide contact credentials, initial loyalty grant, and address information.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Section 1: Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <User className="h-4 w-4 text-primary" />
                Personal & Contact Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" placeholder="Jordan" {...register('firstName')} />
                  {errors.firstName && (
                    <p className="text-xs text-destructive">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" placeholder="Belfort" {...register('lastName')} />
                  {errors.lastName && (
                    <p className="text-xs text-destructive">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="jordan.b@example.com"
                      className="pl-9"
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phoneNumber"
                      placeholder="+1 (555) 234-8901"
                      className="pl-9"
                      {...register('phoneNumber')}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Initial Portal Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    className="pl-9"
                    {...register('password')}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>
            </div>

            {/* Section 2: Membership & Rewards */}
            <div className="space-y-4 pt-2 border-t">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Membership Program & Allocation
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="customerCode">Customer ID / Code</Label>
                  <Input id="customerCode" {...register('customerCode')} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="membershipType">Membership Tier *</Label>
                  <Select
                    value={membershipType}
                    onValueChange={(val) => setValue('membershipType', val as MembershipTier)}
                  >
                    <SelectTrigger id="membershipType">
                      <SelectValue placeholder="Select Tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="REGULAR">Regular Member</SelectItem>
                      <SelectItem value="PREMIUM">Premium Member</SelectItem>
                      <SelectItem value="VIP">VIP Elite Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="loyaltyPoints">Initial Welcome Points</Label>
                  <Input
                    id="loyaltyPoints"
                    type="number"
                    min="0"
                    {...register('loyaltyPoints', { valueAsNumber: true })}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Address Information */}
            <div className="space-y-4 pt-2 border-t">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                Address Information
              </h3>

              <div className="space-y-1.5">
                <Label htmlFor="street">Street Address</Label>
                <Input id="street" placeholder="740 Park Avenue" {...register('street')} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="New York" {...register('city')} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="state">State / Province</Label>
                  <Input id="state" placeholder="NY" {...register('state')} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input id="zipCode" placeholder="10021" {...register('zipCode')} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" placeholder="United States" {...register('country')} />
                </div>
              </div>
            </div>

            {/* Account Status Switch */}
            <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/20">
              <div className="space-y-0.5">
                <Label htmlFor="isActive" className="text-sm font-semibold">
                  Enable Immediate Account Access
                </Label>
                <p className="text-xs text-muted-foreground">
                  The client will be able to log in to the Customer Portal immediately.
                </p>
              </div>
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => setValue('isActive', checked)}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/customers')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" loading={isSubmitting} className="gap-2">
                <UserPlus className="h-4 w-4" />
                Register Client Account
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
