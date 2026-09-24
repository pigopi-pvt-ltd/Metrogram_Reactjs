import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  UserCheck,
  UserPlus,
  Shield,
  Layers,
  Home,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role } = useAuth();
  const location = useLocation();

  const getNavItems = (): NavItem[] => {
    switch (role) {
      case "SUPER_ADMIN":
        return [
          {
            title: "Dashboard",
            href: "/dashboard",
            icon: <LayoutDashboard className="h-4 w-4" />,
          },
          {
            title: "Managers",
            href: "/managers",
            icon: <Users className="h-4 w-4" />,
          },
          {
            title: "Employees",
            href: "/employees",
            icon: <Briefcase className="h-4 w-4" />,
          },
          {
            title: "Customers",
            href: "/customers",
            icon: <UserCheck className="h-4 w-4" />,
          },
        ];

      case "MANAGER":
        return [
          {
            title: "Dashboard",
            href: "/dashboard",
            icon: <LayoutDashboard className="h-4 w-4" />,
          },
          {
            title: "Team Employees",
            href: "/employees",
            icon: <Briefcase className="h-4 w-4" />,
          },
          {
            title: "Customers",
            href: "/customers",
            icon: <UserCheck className="h-4 w-4" />,
          },
        ];

      case "EMPLOYEE":
        return [
          {
            title: "Dashboard",
            href: "/dashboard",
            icon: <LayoutDashboard className="h-4 w-4" />,
          },
          {
            title: "Register Customer",
            href: "/customers/new",
            icon: <UserPlus className="h-4 w-4" />,
          },
          {
            title: "Customer Directory",
            href: "/customers",
            icon: <UserCheck className="h-4 w-4" />,
          },
        ];

      case "CUSTOMER":
        return [
          {
            title: "My Portal",
            href: "/customer/home",
            icon: <Home className="h-4 w-4" />,
          },
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between border-r bg-card/60 backdrop-blur-md">
      {/* Brand Header */}
      <div className="flex flex-col">
        <div className="flex h-16 items-center justify-between px-6 border-b">
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <img
              src="/logo.png"
              alt="MetroGram"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </NavLink>

          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-4">
          <div className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Navigation
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;

              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <span
                    className={
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    }
                  >
                    {item.icon}
                  </span>
                  <span>{item.title}</span>
                  {item.badge && (
                    <span className="ml-auto rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer / System Info */}
      {/* <div className="p-4 border-t bg-muted/20 m-3 rounded-xl border"> */}
      {/*   <div className="flex items-center gap-2.5"> */}
      {/*     <div className="p-2 rounded-lg bg-background border shadow-2xs text-muted-foreground"> */}
      {/*       <Shield className="h-4 w-4" /> */}
      {/*     </div> */}
      {/*     <div className="flex flex-col"> */}
      {/*       <span className="text-xs font-semibold text-foreground"> */}
      {/*         MetroGram Guard */}
      {/*       </span> */}
      {/*       <span className="text-[10px] text-muted-foreground"> */}
      {/*         RBAC Enforced */}
      {/*       </span> */}
      {/*     </div> */}
      {/*   </div> */}
      {/* </div> */}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
