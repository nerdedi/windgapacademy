import React from "react";

const Panel = ({ title, children }) => (
  <section className="bg-white p-4 rounded shadow">
    <h3 className="font-semibold mb-2">{title}</h3>
    <div className="text-sm text-gray-600">{children}</div>
  </section>
);

const EducatorDashboard = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-6">
        <h2 className="text-3xl font-semibold">Educator Dashboard</h2>
        <p className="text-sm text-gray-600">Manage learners, goals and funding plans.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel title="NDIS Goal Tracker">
          View and manage NDIS-aligned goals for your learners. Navigate to detailed goal
          pages to update status and add educator notes.
        </Panel>

        <Panel title="Funding Management">
          Track funding allocations, used amounts, and prepare justifications for future
          funding requests.
        </Panel>

        <Panel title="Progress Monitoring">
          Visualise learner progress, milestones and measurable outcomes. Export reports for
          meetings and plans.
        </Panel>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Panel title="Quick Actions">
          <ul>
            <li>
              <a className="text-blue-600" href="/assignments/new">
                Create Assignment
              </a>
            </li>
            <li>
              <a className="text-blue-600" href="/users">
                Manage Learners
              </a>
            </li>
            <li>
              <a className="text-blue-600" href="/reports">
                Generate Report
              </a>
            </li>
          </ul>
        </Panel>

        <Panel title="Recent Activity">
          <p>No recent activity to show. Activity logs will appear here.</p>
        </Panel>
      </div>
    </div>
  );
};

export default EducatorDashboard;
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
