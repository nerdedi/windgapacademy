import React, { useEffect, useState } from "react";

import AnalyticsOverview from "./AnalyticsOverview";
import AssignmentsManager from "./AssignmentsManager";
import UserRequests from "./UserRequests";

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
