import React from "react";

import { useAuth } from "./AuthProvider";

export default function RoleGate({ role, children, fallback = null }) {
  const { role: userRole, loading } = useAuth();
  if (loading) return null;
  if (userRole === role) return <>{children}</>;
  return <>{fallback}</>;
}
