import React, { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

import AdminDashboard from "./AdminDashboard";
import StudentDashboard from "./StudentDashboard";

const DashboardRouter = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div>Please log in to access your dashboard.</div>;
  }

  if (user.role === "admin") {
    return <AdminDashboard />;
  }
  // Support legacy student role; prefer 'learner'
  if (user.role === "learner" || user.role === "student") {
    return <StudentDashboard />;
  }
  return <div>Unknown role.</div>;
};

export default DashboardRouter;
