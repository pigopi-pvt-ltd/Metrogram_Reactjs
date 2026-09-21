import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { FileQuestion, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { role, isAuthenticated } = useAuth();

  const getHomeLink = () => {
    if (!isAuthenticated) return '/login';
    if (role === 'CUSTOMER') return '/customer/home';
    return '/dashboard';
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-6 text-center">
      <div className="relative flex max-w-md flex-col items-center rounded-2xl border bg-card p-8 shadow-xl">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <FileQuestion className="h-8 w-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-primary">
          404 Error
        </span>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">
          Page Not Found
        </h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          The route you are attempting to reach does not exist or has been relocated within the MetroGram RBAC platform.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full">
          <Button asChild className="w-full gap-2">
            <Link to={getHomeLink()}>
              <Home className="h-4 w-4" />
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
