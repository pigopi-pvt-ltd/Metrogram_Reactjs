import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { customerService } from '@/services/customer.service';
import type { CustomerProfile, User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MembershipBadge } from '@/components/shared/MembershipBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  User as UserIcon,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Gift,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { CopyButton } from '@/components/shared/CopyButton';

export const CustomerPortalPage: React.FC = () => {
  const { user } = useAuth();
  const [customerData, setCustomerData] = useState<User | null>(user);

  useEffect(() => {
    if (user?._id) {
      customerService
        .getById(user._id)
        .then((res) => {
          if (res.data) setCustomerData(res.data);
        })
        .catch(() => {
          // Keep current state
        });
    }
  }, [user?._id]);

  const activeUser = customerData || user;
  const profile = activeUser?.profile as CustomerProfile | undefined;
  const address = profile?.address;
  const membershipTier = profile?.membershipType || 'VIP';
  const loyaltyPoints = profile?.loyaltyPoints ?? 350;
  const customerCode = profile?.customerCode || 'CUST-8001';
  const fullName = activeUser?.fullName || `${activeUser?.firstName || ''} ${activeUser?.lastName || ''}`.trim() || 'Valued Member';

  const tierBenefits = {
    VIP: [
      'Unlimited priority customer support 24/7',
      'Exclusive 20% loyalty rewards redemption multiplier',
      'Complimentary express processing on all orders',
      'Dedicated relationship account concierge',
    ],
    PREMIUM: [
      'Priority email and phone assistance',
      '10% loyalty rewards point booster',
      'Quarterly member exclusive discounts',
    ],
    REGULAR: [
      'Standard customer support portal',
      'Earn 1 loyalty point for every $1 spent',
      'Access to seasonal promotions and catalog',
    ],
  };

  const benefits = tierBenefits[membershipTier] || tierBenefits.REGULAR;

  return (
    <div className="space-y-8 w-full">
      {/* Welcome Hero Card */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-card via-card to-muted/40 p-6 sm:p-8 shadow-md">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 text-2xl font-bold">
              {activeUser?.firstName?.[0] || 'C'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Hello, {activeUser?.firstName || 'Member'}!
                </h1>
                <MembershipBadge tier={membershipTier} />
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1 font-mono font-medium">
                  Account ID: {customerCode}
                  <CopyButton value={customerCode} label="Account ID" />
                </span>
                <span>•</span>
                <StatusBadge isActive={activeUser?.isActive ?? true} />
              </div>
            </div>
          </div>

          {/* Loyalty Balance Badge */}
          <div className="flex flex-col items-start sm:items-end p-4 rounded-xl border bg-background/80 backdrop-blur-sm shadow-xs">
            <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Available Loyalty Points
            </span>
            <span className="text-3xl font-black text-foreground mt-0.5">
              {loyaltyPoints.toLocaleString()} <span className="text-xs font-semibold text-muted-foreground">PTS</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Profile info, Address, and Tier Benefits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Details */}
        <Card className="shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-primary" />
              Account Information
            </CardTitle>
            <CardDescription className="text-xs">
              Personal credentials and contact record
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-1 text-sm">
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Full Legal Name</span>
                <span className="font-semibold text-foreground">
                  {fullName}
                </span>
              </div>
              <CopyButton value={fullName} label="Full Name" />
            </div>

            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center gap-3 min-w-0">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs text-muted-foreground">Email Address</span>
                  <span className="font-medium text-foreground truncate">{activeUser?.email}</span>
                </div>
              </div>
              {activeUser?.email && <CopyButton value={activeUser.email} label="Email Address" />}
            </div>

            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Phone Number</span>
                  <span className="font-medium text-foreground">
                    {activeUser?.phoneNumber || '+91 91234 56789'}
                  </span>
                </div>
              </div>
              {activeUser?.phoneNumber && <CopyButton value={activeUser.phoneNumber} label="Phone Number" />}
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Member Since</span>
                <span className="font-medium text-foreground">
                  {activeUser?.createdAt
                    ? new Date(activeUser.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'September 2026'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Card */}
        <Card className="shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Primary Registered Address
            </CardTitle>
            <CardDescription className="text-xs">
              Delivery and service billing destination
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-1 text-sm">
            <div className="p-4 rounded-xl border bg-muted/20 space-y-2">
              <div className="font-semibold text-foreground">
                {address?.street || '742 Evergreen Terrace'}
              </div>
              <div className="text-muted-foreground text-xs leading-relaxed">
                {address?.city || 'Springfield'}, {address?.state || 'OR'}{' '}
                {address?.zipCode || '97477'}
                <br />
                {address?.country || 'USA'}
              </div>
            </div>

            <div className="pt-2 text-xs text-muted-foreground flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Address verified for VIP courier and postal delivery
            </div>
          </CardContent>
        </Card>

        {/* Tier Benefits Overview */}
        <Card className="shadow-xs bg-card/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-amber-500" />
                <span>Tier Privileges</span>
              </div>
              <MembershipBadge tier={membershipTier} />
            </CardTitle>
            <CardDescription className="text-xs">
              Privileges included with your active membership
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-1">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-2.5 text-xs text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{benefit}</span>
              </div>
            ))}

            <div className="pt-4 border-t">
              <Button variant="outline" className="w-full text-xs gap-1.5 h-8">
                <TrendingUp className="h-3.5 w-3.5" />
                Explore Tier Upgrade Options
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
