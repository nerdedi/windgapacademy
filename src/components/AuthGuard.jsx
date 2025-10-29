import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * AuthGuard component that restricts access based on authentication status
 * and user roles or permissions.
 *
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children The components to render if access is granted
 * @param {string[]} props.requiredRoles Array of roles allowed to access the route
 * @param {string[]} props.requiredPermissions Array of permissions required
 * @param {string} props.redirectTo Path to redirect if access is denied (default: "/login")
 */
const AuthGuard = ({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  redirectTo = "/login",
}) => {
  const { currentUser, isLoading, hasRole, hasPermission } = useAuth();

  // Show loading state while authentication state is being determined
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!currentUser) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check roles if specified
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some((role) => hasRole(role));
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check permissions if specified
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requiredPermissions.every((permission) =>
      hasPermission(permission),
    );
    if (!hasRequiredPermissions) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // All checks passed, render the protected component
  return <>{children}</>;
};

export default AuthGuard;
