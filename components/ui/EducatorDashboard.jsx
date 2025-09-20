import React from "react";
const Panel = ({ title, children }) => (
  <section className="bg-white p-4 rounded shadow">
    <h3 className="font-semibold mb-2">{title}</h3> {/* Panel title */}
    <div className="text-sm text-gray-600">{children}</div> {/* Panel content */}{" "}
    {/* Render children prop */}
  </section>
);

const EducatorDashboard = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      {" "}
      {/* Centered container with padding */}
      <header className="mb-6">
        {" "}
        {/* Header section */}
        <h2 className="text-3xl font-semibold">Educator Dashboard</h2>
        <p className="text-sm text-gray-600">Manage learners, goals and funding plans.</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {" "}
        {/* 3-column grid on large screens */}
        <Panel title="Learner Management">
          Overview of all learners, their assigned educators, and current status. Quick links to
          learner profiles.
        </Panel>{" "}
        {/* Reusable Panel component */}
        <Panel title="NDIS Goal Tracker">
          {" "}
          {/* Another Panel instance */}
          View and manage NDIS-aligned goals for your learners. Navigate to detailed goal pages to
          update status and add educator notes.
        </Panel>
        <Panel title="Funding Management">
          Track funding allocations, used amounts, and prepare justifications for future funding
          requests.
        </Panel>
        <Panel title="Progress Monitoring">
          Visualise learner progress, milestones and measurable outcomes. Export reports for
          meetings and plans.
        </Panel>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {" "}
        {/* 2-column grid on medium screens */}
        <Panel title="Quick Actions">
          {" "}
          {/* Panel for quick action links */}
          <ul>
            <li>
              <a className="text-blue-600" href="/assignments/new">
                Create New Assignment
              </a>
            </li>
            <li>
              <a className="text-blue-600" href="/users">
                {" "}
                {/* Link to manage users */}
                Manage Learners
              </a>
            </li>
            <li>
              <a className="text-blue-600" href="/reports">
                Generate Reports
              </a>
            </li>
          </ul>
        </Panel>
        <Panel title="Recent Activity">
          {" "}
          {/* Panel for recent activity logs */}
          <p>No recent activity to show. Activity logs will appear here.</p>{" "}
          {/* Placeholder text */}
        </Panel>
      </div>
    </div>
  );
};

export default EducatorDashboard;
