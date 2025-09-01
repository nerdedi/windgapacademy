import React, { useContext } from 'react';
import AdminDashboard from './AdminDashboard';
import StudentDashboard from './StudentDashboard';
import { AuthContext } from '../context/AuthContext';

const DashboardRouter = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div>Please log in to access your dashboard.</div>;
  }

  if (user.role === 'admin') {
    return <AdminDashboard />;
  }
  if (user.role === 'student') {
    return <StudentDashboard />;
  }
  return <div>Unknown role.</div>;
};

export default DashboardRouter;
