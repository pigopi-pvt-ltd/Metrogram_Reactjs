import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  isActive: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ isActive, className }) => {
  return (
    <Badge
      variant={isActive ? 'success' : 'secondary'}
      className={`gap-1.5 font-medium ${className || ''}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isActive ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground'
        }`}
      />
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  );
};
