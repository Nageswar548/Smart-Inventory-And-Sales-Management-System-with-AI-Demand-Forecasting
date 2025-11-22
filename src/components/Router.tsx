import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import { MemberProtectedRoute } from '@/components/ui/member-protected-route';

// Import pages
import Layout from '@/components/Layout';
import HomePage from '@/components/pages/HomePage';
import ProfilePage from '@/components/pages/ProfilePage';
import DashboardPage from '@/components/pages/DashboardPage';
import InventoryPage from '@/components/pages/InventoryPage';
import SalesPage from '@/components/pages/SalesPage';
import ForecastingPage from '@/components/pages/ForecastingPage';
import NotificationsPage from '@/components/pages/NotificationsPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <>
            <ScrollToTop />
            <HomePage />
          </>
        ),
      },
      {
        path: "profile",
        element: (
          <MemberProtectedRoute>
            <ScrollToTop />
            <ProfilePage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to access your dashboard">
            <ScrollToTop />
            <DashboardPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "inventory",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to manage inventory">
            <ScrollToTop />
            <InventoryPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "sales",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to view sales">
            <ScrollToTop />
            <SalesPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "forecasting",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to view forecasting">
            <ScrollToTop />
            <ForecastingPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "notifications",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to view notifications">
            <ScrollToTop />
            <NotificationsPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
