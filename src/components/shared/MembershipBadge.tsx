import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { MembershipTier } from '@/types';
import { Sparkles, Crown, Shield } from 'lucide-react';

interface MembershipBadgeProps {
  tier: MembershipTier | string;
  className?: string;
}

export const MembershipBadge: React.FC<MembershipBadgeProps> = ({ tier, className }) => {
  switch (tier) {
    case 'VIP':
      return (
        <Badge variant="purple" className={`gap-1 font-semibold ${className || ''}`}>
          <Crown className="h-3 w-3 text-purple-400" />
          VIP Tier
        </Badge>
      );
    case 'PREMIUM':
      return (
        <Badge variant="warning" className={`gap-1 font-semibold ${className || ''}`}>
          <Sparkles className="h-3 w-3 text-amber-500" />
          Premium
        </Badge>
      );
    case 'REGULAR':
    default:
      return (
        <Badge variant="secondary" className={`gap-1 font-medium ${className || ''}`}>
          <Shield className="h-3 w-3 text-muted-foreground" />
          Regular
        </Badge>
      );
  }
};
