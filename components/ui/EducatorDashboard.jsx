import React from 'react';

export default function EducatorDashboard() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Educator Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="p-4 bg-white rounded shadow">
          <h3 className="font-medium">NDIS Goal Tracker</h3>
          <p className="mt-2 text-sm text-gray-600">Create and manage learner NDIS goals, assign supports, and track progress.</p>
        </section>

        <section className="p-4 bg-white rounded shadow">
          <h3 className="font-medium">Funding Management</h3>
          <p className="mt-2 text-sm text-gray-600">View funding allocations, suggested supports, and budget usage for learners.</p>
        </section>

        <section className="p-4 bg-white rounded shadow">
          <h3 className="font-medium">Progress Monitoring</h3>
          <p className="mt-2 text-sm text-gray-600">Track learner progress with visual charts and activity logs.</p>
        </section>

        <section className="p-4 bg-white rounded shadow">
          <h3 className="font-medium">Quick Actions</h3>
          <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
            <li>Create new NDIS goal</li>
            <li>Assign support worker</li>
            <li>Export learner report</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
