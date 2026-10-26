import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import RootErrorBoundary from '../components/common/RootErrorBoundary';
import ProtectedRoute from './ProtectedRoute';

import DashboardPage from '../pages/DashboardPage';
import CustomersPage from '../pages/CustomersPage';
import ProductsPage from '../pages/ProductsPage';
import OrdersPage from '../pages/OrdersPage';
import TeamPage from '../pages/TeamPage';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';

import { getHealthStatus } from '../services/health.api';

/**
 * Creates the Data Router with createBrowserRouter.
 * Includes authentication guards and role-based access control (RBAC).
 */
export const createAppRouter = (queryClient) => {
  return createBrowserRouter([
    // Public Authentication Route
    {
      path: '/login',
      element: <LoginPage />,
      errorElement: <RootErrorBoundary />,
    },

    // Protected SaaS Application Shell
    {
      element: <ProtectedRoute />, // Requires valid authenticated session
      errorElement: <RootErrorBoundary />,
      children: [
        {
          path: '/',
          element: <AppLayout />,
          children: [
            {
              index: true,
              element: <DashboardPage />,
              loader: async () => {
                try {
                  return await queryClient.ensureQueryData({
                    queryKey: ['healthStatus'],
                    queryFn: getHealthStatus,
                  });
                } catch {
                  return null;
                }
              },
            },
            {
              path: 'customers',
              element: <CustomersPage />,
            },
            {
              path: 'products',
              element: <ProductsPage />,
            },
            {
              path: 'orders',
              element: <OrdersPage />,
            },
            {
              path: 'team',
              element: <TeamPage />,
            },
          ],
        },
      ],
    },

    // 404 Catch-All
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ]);
};
