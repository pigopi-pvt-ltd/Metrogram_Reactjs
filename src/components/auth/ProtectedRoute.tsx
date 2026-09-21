import React from 'react';
import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/types';
import { ShieldAlert, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user, isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Authenticating MetroGram session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-6">
        <div className="relative flex max-w-md flex-col items-center text-center rounded-2xl border bg-card p-8 shadow-lg">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-destructive">
            403 - Access Denied
          </span>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            Unauthorized Access
          </h1>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Your current role (<span className="font-semibold text-foreground">{role}</span>) does not have
            permission to view this section of the MetroGram platform.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full">
            <Button
              asChild
              className="w-full gap-2"
              variant="default"
            >
              <Link to={role === 'CUSTOMER' ? '/customer/home' : '/dashboard'}>
                <Home className="h-4 w-4" />
                {role === 'CUSTOMER' ? 'Go to Customer Portal' : 'Back to Dashboard'}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return children ? <>{children}</> : <Outlet />;
};
