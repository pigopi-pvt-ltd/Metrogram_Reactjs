import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { UserRole } from '@/types';
import { ShieldCheck, Users, Briefcase, UserCheck } from 'lucide-react';

interface RoleBadgeProps {
  role: UserRole | string;
  showIcon?: boolean;
  className?: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, showIcon = true, className }) => {
  switch (role) {
    case 'SUPER_ADMIN':
      return (
        <Badge variant="purple" className={`gap-1 font-medium ${className || ''}`}>
          {showIcon && <ShieldCheck className="h-3 w-3" />}
          Super Admin
        </Badge>
      );
    case 'MANAGER':
      return (
        <Badge variant="info" className={`gap-1 font-medium ${className || ''}`}>
          {showIcon && <Users className="h-3 w-3" />}
          Manager
        </Badge>
      );
    case 'EMPLOYEE':
      return (
        <Badge variant="success" className={`gap-1 font-medium ${className || ''}`}>
          {showIcon && <Briefcase className="h-3 w-3" />}
          Employee
        </Badge>
      );
    case 'CUSTOMER':
      return (
        <Badge variant="warning" className={`gap-1 font-medium ${className || ''}`}>
          {showIcon && <UserCheck className="h-3 w-3" />}
          Customer
        </Badge>
      );
    default:
      return <Badge variant="secondary">{role}</Badge>;
  }
};
