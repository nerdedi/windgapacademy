import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useUser();

  if (!user) return <Navigate to="/" />;

  // Support legacy role strings: trainer -> educator, student -> learner
  const roleMap = {
    educator: ["educator", "trainer"],
    learner: ["learner", "student"],
  };

  if (role) {
    const allowed = roleMap[role] || [role];
    if (!allowed.includes(user.role)) return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
