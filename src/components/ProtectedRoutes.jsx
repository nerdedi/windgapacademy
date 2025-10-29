import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

/**
 * ProtectedRoute component that provides role-based access control
 *
 * @param {Object} props Component props
 * @param {string[]} props.roles Array of allowed roles
 * @param {string[]} props.permissions Array of required permissions
 * @param {string} props.redirectTo Path to redirect if unauthorized
 * @param {React.ReactNode} props.element The component to render if authorized
 */
export const ProtectedRoute = ({
  roles = [],
  permissions = [],
  redirectTo = "/login",
  element,
}) => {
  const { currentUser, isLoading, hasRole, hasPermission } = useAuth();
  const location = useLocation();

  // Show loading state while authentication state is being determined
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check roles if specified
  if (roles.length > 0) {
    const hasRequiredRole = roles.some((role) => hasRole(role));
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }

  // Check permissions if specified
  if (permissions.length > 0) {
    const hasAllPermissions = permissions.every((permission) => hasPermission(permission));
    if (!hasAllPermissions) {
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }

  // All checks passed, render the protected component
  return element;
};

/**
 * LearnerRoute component for routes that only learners should access
 */
export const LearnerRoute = ({ element, ...rest }) => {
  return <ProtectedRoute {...rest} roles={["learner"]} element={element} />;
};

/**
 * EducatorRoute component for routes that only educators should access
 */
export const EducatorRoute = ({ element, ...rest }) => {
  return <ProtectedRoute {...rest} roles={["educator"]} element={element} />;
};

/**
 * AdminRoute component for routes that only admins should access
 */
export const AdminRoute = ({ element, ...rest }) => {
  return <ProtectedRoute {...rest} roles={["admin"]} element={element} />;
};
