import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ChevronRight, Home } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Generate dynamic breadcrumb items based on current path
  const pathnames = location.pathname.split('/').filter((x) => x);

  const getBreadcrumbTitle = (part: string) => {
    switch (part) {
      case 'dashboard':
        return 'Dashboard';
      case 'managers':
        return 'Managers';
      case 'employees':
        return 'Employees';
      case 'customers':
        return 'Customers';
      case 'new':
        return 'Create / Register';
      case 'customer':
        return 'Customer';
      case 'home':
        return 'Overview';
      default:
        return part.charAt(0).toUpperCase() + part.slice(1);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Header */}
        <Header onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        {/* Breadcrumb strip */}
        {pathnames.length > 0 && (
          <div className="flex items-center gap-2 border-b bg-muted/20 px-6 py-2.5 text-xs text-muted-foreground">
            <Link
              to="/dashboard"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Home className="h-3.5 w-3.5" />
              <span>App</span>
            </Link>
            {pathnames.map((segment, index) => {
              const url = `/${pathnames.slice(0, index + 1).join('/')}`;
              const isLast = index === pathnames.length - 1;
              return (
                <React.Fragment key={url}>
                  <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
                  {isLast ? (
                    <span className="font-semibold text-foreground">
                      {getBreadcrumbTitle(segment)}
                    </span>
                  ) : (
                    <Link
                      to={url}
                      className="hover:text-foreground transition-colors"
                    >
                      {getBreadcrumbTitle(segment)}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
