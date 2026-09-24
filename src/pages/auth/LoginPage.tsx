import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Layers,
  ShieldCheck,
  Users,
  Briefcase,
  UserCheck,
  Sun,
  Moon,
  ArrowRight,
  Lock,
  Mail,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import type { UserRole } from '@/types';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface DemoPreset {
  role: UserRole;
  title: string;
  email: string;
  password: string;
  badgeColor: string;
  icon: React.ReactNode;
  desc: string;
}

const DEMO_PRESETS: DemoPreset[] = [
  {
    role: 'SUPER_ADMIN',
    title: 'Boss Admin (Super Admin)',
    email: 'boss@company.com',
    password: 'SuperAdmin@123456',
    badgeColor: 'border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/10',
    icon: <ShieldCheck className="h-4 w-4" />,
    desc: 'Master System Admin',
  },
  {
    role: 'MANAGER',
    title: 'John Davis (Manager)',
    email: 'manager.ops@company.com',
    password: 'Manager@123456',
    badgeColor: 'border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/10',
    icon: <Users className="h-4 w-4" />,
    desc: 'Operations & Logistics (HQ)',
  },
  {
    role: 'MANAGER',
    title: 'Sarah Wilson (Manager)',
    email: 'manager.sales@company.com',
    password: 'Manager@123456',
    badgeColor: 'border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/10',
    icon: <Users className="h-4 w-4" />,
    desc: 'Sales & Relations (West Coast)',
  },
  {
    role: 'EMPLOYEE',
    title: 'Alex Morgan (Employee)',
    email: 'employee.alex@company.com',
    password: 'Employee@123456',
    badgeColor: 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
    icon: <Briefcase className="h-4 w-4" />,
    desc: 'EMP-1001 (Under John Davis)',
  },
  {
    role: 'EMPLOYEE',
    title: 'Lisa Ray (Employee)',
    email: 'employee.lisa@company.com',
    password: 'Employee@123456',
    badgeColor: 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
    icon: <Briefcase className="h-4 w-4" />,
    desc: 'EMP-1002 (Under John Davis)',
  },
  {
    role: 'CUSTOMER',
    title: 'Emma Watson (VIP)',
    email: 'customer.emma@gmail.com',
    password: 'Customer@123456',
    badgeColor: 'border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10',
    icon: <UserCheck className="h-4 w-4" />,
    desc: 'VIP Tier (350 points)',
  },
];

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { setTheme, resolvedTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleDemoFill = (preset: DemoPreset) => {
    setValue('email', preset.email);
    setValue('password', preset.password);
    toast.info(`Filled credentials for ${preset.title}`);
  };

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await login(data);
      toast.success(`Welcome back, ${res.user.firstName}!`);
      
      // Role-based routing redirection
      if (res.user.role === 'CUSTOMER') {
        navigate('/customer/home');
      } else {
        const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
        navigate(from && from !== '/login' ? from : '/dashboard');
      }
    } catch {
      // Error is caught and toasted in api interceptor or fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-background px-4 py-8 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      {/* Top Header Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="rounded-full shadow-xs"
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left column: Branding & Feature Highlights */}
        <div className="hidden lg:flex flex-col space-y-6 lg:col-span-5 pr-4">
          <Link to="/" className="inline-block">
            <img
              src="/logo.png"
              alt="MetroGram"
              className="h-12 w-auto object-contain transition-transform hover:scale-105"
            />
          </Link>

          <p className="text-muted-foreground text-sm leading-relaxed">
            A next-generation role-based access management portal providing strict authorization, granular controls, and real-time operations across departments.
          </p>

          <div className="space-y-3 pt-2">
            {[
              'Multi-role access for Admins, Managers, Employees & Customers',
              'Strict hierarchical authorization with automated guards',
              'Real-time team capacity tracking & customer management',
              'Dynamic theme engine with dark and light modes',
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Role quick selection cards */}
          <div className="pt-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>1-Click Demo Accounts</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_PRESETS.map((preset) => (
                <button
                  key={preset.role}
                  type="button"
                  onClick={() => handleDemoFill(preset)}
                  className="flex flex-col items-start p-2.5 rounded-xl border bg-card/60 hover:bg-accent/70 hover:border-primary/40 transition-all text-left group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] font-semibold ${preset.badgeColor}`}>
                      {preset.icon}
                      {preset.title}
                    </span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <span className="text-[11px] text-muted-foreground line-clamp-1">
                    {preset.email}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Login Card */}
        <div className="lg:col-span-7 flex justify-center">
          <Card className="w-full max-w-md border-border/80 bg-card/90 shadow-2xl backdrop-blur-xl">
            <CardHeader className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 lg:hidden mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                  <Layers className="h-5 w-5" />
                </div>
                <span className="text-lg font-bold">MetroGram</span>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Sign in to your account
              </CardTitle>
              <CardDescription>
                Enter your credentials to access your role-specific workspace
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@metrogram.io"
                      className="pl-9"
                      autoComplete="email"
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-9"
                      autoComplete="current-password"
                      {...register('password')}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive">{errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full mt-2 font-medium"
                  loading={isSubmitting}
                >
                  Sign In to MetroGram
                </Button>
              </form>

              {/* Mobile Quick Demo Presets */}
              <div className="mt-6 pt-4 border-t lg:hidden">
                <p className="text-xs font-semibold text-muted-foreground mb-2">
                  Quick Demo Accounts:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_PRESETS.map((preset) => (
                    <Button
                      key={preset.role}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleDemoFill(preset)}
                      className="text-xs justify-start h-8"
                    >
                      {preset.icon}
                      <span className="truncate">{preset.title}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col items-center justify-center border-t py-4 text-xs text-muted-foreground">
              <span>Protected by MetroGram Enterprise RBAC Security</span>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};
