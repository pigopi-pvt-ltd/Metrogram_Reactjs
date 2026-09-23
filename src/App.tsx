import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';

import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

import { LoginPage } from '@/pages/auth/LoginPage';
import { LandingPage } from '@/pages/landing/LandingPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { ManagersPage } from '@/pages/managers/ManagersPage';
import { EmployeesPage } from '@/pages/employees/EmployeesPage';
import { CustomersPage } from '@/pages/customers/CustomersPage';
import { CustomerRegisterPage } from '@/pages/customers/CustomerRegisterPage';
import { CustomerPortalPage } from '@/pages/customer-portal/CustomerPortalPage';
import { NotFoundPage } from '@/pages/not-found/NotFoundPage';

export function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="metrogram-theme">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Public Login Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Authenticated Application Routes wrapped in AppLayout */}
            <Route element={<AppLayout />}>
              {/* Dashboard Route: Super Admin, Manager, Employee */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'MANAGER', 'EMPLOYEE']}>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Managers Management: Super Admin Only */}
              <Route
                path="/managers"
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                    <ManagersPage />
                  </ProtectedRoute>
                }
              />

              {/* Employee Management: Super Admin & Manager */}
              <Route
                path="/employees"
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'MANAGER']}>
                    <EmployeesPage />
                  </ProtectedRoute>
                }
              />

              {/* Customer Directory: Super Admin, Manager & Employee */}
              <Route
                path="/customers"
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'MANAGER', 'EMPLOYEE']}>
                    <CustomersPage />
                  </ProtectedRoute>
                }
              />

              {/* Customer Register Page: Super Admin, Manager, Employee */}
              <Route
                path="/customers/new"
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'MANAGER', 'EMPLOYEE']}>
                    <CustomerRegisterPage />
                  </ProtectedRoute>
                }
              />

              {/* Customer Portal: Customer Only */}
              <Route
                path="/customer/home"
                element={
                  <ProtectedRoute allowedRoles={['CUSTOMER']}>
                    <CustomerPortalPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors closeButton />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
