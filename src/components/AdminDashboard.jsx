import React, { useEffect, useState } from 'react';
import UserRequests from './UserRequests';
import AssignmentsManager from './AssignmentsManager';
import AnalyticsOverview from './AnalyticsOverview';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <AnalyticsOverview />
      <UserRequests />
      <AssignmentsManager />
    </div>
  );
};

export default AdminDashboard;
