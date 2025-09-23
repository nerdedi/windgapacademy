import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute component - Protects routes based on authentication and role requirements
 *
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children Child components to render if conditions are met
 * @param {string[]} [props.requiredRoles] Optional array of roles that are allowed to access this route
 * @param {string[]} [props.requiredPermissions] Optional array of permissions that are allowed to access this route
 * @param {boolean} [props.requireVerified=false] Whether to require email verification
 * @param {boolean} [props.requireMFA=false] Whether to require multi-factor authentication
 * @returns {React.ReactNode} The protected route
 */
const ProtectedRoute = ({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  requireVerified = false,
  requireMFA = false,
}) => {
  const { currentUser, loading, hasRole, hasPermission } = useAuth();
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
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check email verification if required
  if (requireVerified && !currentUser.emailVerified) {
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  // Check MFA if required
  if (requireMFA && !currentUser.mfaEnabled) {
    return <Navigate to="/setup-mfa" state={{ from: location }} replace />;
  }

  // Check roles if specified
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some((role) => hasRole(role));
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }

  // Check permissions if specified
  if (requiredPermissions.length > 0) {
    const hasRequiredPermission = requiredPermissions.some((permission) =>
      hasPermission(permission),
    );
    if (!hasRequiredPermission) {
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }

  // Render children if all checks pass
  return children;
};

export default ProtectedRoute;
