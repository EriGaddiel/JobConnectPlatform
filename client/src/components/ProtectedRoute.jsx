import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from "@/components/ui/skeleton"; // For a loading state

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Optional: Show a full-page loader or a more sophisticated skeleton UI
    return (
      <div className="flex items-center justify-center min-h-screen">
        {/* Example of a simple page loader */}
        <div className="p-8 space-y-4">
            <Skeleton className="h-12 w-1/2 mx-auto" />
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect them to the /auth page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check for role authorization if allowedRoles are provided
  if (allowedRoles && allowedRoles.length > 0) {
    if (!user || !user.role || !allowedRoles.includes(user.role)) {
      // User is authenticated but does not have the required role
      // Redirect to a 'Forbidden' page or back to their default dashboard
      // For simplicity, redirecting to their default dashboard:
      let defaultDashboardPath = "/dashboard"; // jobSeeker default
      if (user?.role === "employer") defaultDashboardPath = "/employer/dashboard";
      if (user?.role === "admin") defaultDashboardPath = "/admin/dashboard";

      // Or, could redirect to a dedicated /unauthorized page
      // return <Navigate to="/unauthorized" replace />;
      console.warn(`User with role '${user?.role}' tried to access a route restricted to roles: ${allowedRoles.join(', ')}`);
      return <Navigate to={defaultDashboardPath} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
