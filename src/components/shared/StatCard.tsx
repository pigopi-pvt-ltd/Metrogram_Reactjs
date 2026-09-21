import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  isLoading?: boolean;
  badge?: React.ReactNode;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  isLoading = false,
  badge,
  className,
}) => {
  return (
    <Card className={`overflow-hidden relative transition-all duration-200 hover:shadow-md ${className || ''}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <div className="h-9 w-9 rounded-lg bg-muted/60 flex items-center justify-center text-foreground">
            {icon}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2 pt-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-36" />
          </div>
        ) : (
          <div className="pt-2">
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold tracking-tight text-foreground">{value}</div>
              {badge && <div>{badge}</div>}
            </div>

            {(description || trend) && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                {trend && (
                  <span
                    className={`font-semibold ${
                      trend.isPositive
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-destructive'
                    }`}
                  >
                    {trend.value}
                  </span>
                )}
                {description && <span>{description}</span>}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
