import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * ProtectedRoute component
 * Restricts access to authenticated users only
 * Redirects unauthenticated users to login page
 */
const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If roles are required, check if the user has the necessary role
  if (requiredRoles.length > 0) {
    // The role information should come from your user object or a separate authorization service
    const userRole = user.role || "student"; // Default to student if no role is specified

    if (!requiredRoles.includes(userRole)) {
      // Redirect to unauthorized page if user doesn't have the required role
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // User is authenticated and has the required role (if any), render the children
  return children;
};

export default ProtectedRoute;
