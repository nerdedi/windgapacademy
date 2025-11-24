import { useAuth } from "@contexts/AuthContext";
import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";

/**
 * ProtectedRoute component
 * Restricts access to authenticated users only
 * Redirects unauthenticated users to login page
 *
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children Children components to render if authenticated
 * @param {Array<string>} props.requiredRoles Optional roles required to access this route
 * @param {string} props.redirectTo Path to redirect to if not authenticated
 * @returns {React.ReactNode} Protected route
 */
const ProtectedRoute = ({ children, requiredRoles = [], redirectTo = "/login" }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // If roles are required, check if the user has any of the required roles
  if (requiredRoles.length > 0) {
    const userRoles = user.roles || ["student"]; // Default to student if no roles are specified
    const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRequiredRole) {
      // Redirect to unauthorized page if user doesn&apos;t have any required role
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // User is authenticated and has the required role (if any), render the children
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRoles: PropTypes.arrayOf(PropTypes.string),
  redirectTo: PropTypes.string,
};

export default ProtectedRoute;
