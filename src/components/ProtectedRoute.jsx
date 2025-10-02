import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

/**
 * ProtectedRoute component - Protects routes based on authentication and role requirements
 *
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children Child components to render if conditions are met
 * @param {string[]} [props.requiredRoles] Optional array of roles that are allowed to access this route
 * @returns {React.ReactNode} The protected route
 */
const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-800 text-lg font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check email verification if required
  if (user && !user.emailVerified && location.pathname !== "/verify-email") {
    return <Navigate to="/verify-email" state={{ from: location.pathname }} replace />;
  }

  // Check roles if specified
  if (requiredRoles.length > 0) {
    const userRole = user.role || "student"; // Default to student if no role is specified
    const hasRequiredRole = requiredRoles.includes(userRole);

    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" state={{ from: location.pathname }} replace />;
    }
  }

  // Render children if all checks pass
  return children;
};

export default ProtectedRoute;
