import React from "react";

const Panel = ({ title, children }) => (
  <section className="bg-white p-4 rounded shadow">
    <h3 className="font-semibold mb-2">{title}</h3>
    <div className="text-sm text-gray-600">{children}</div>
  </section>
);

const LearnerDashboard = () => {
  return (
    <div>
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-6">
          <h2 className="text-3xl font-semibold">Learner Dashboard</h2>
          <p className="text-sm text-gray-600">
            Your personal learning space — goals, progress and resources.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Panel title="My NDIS Goals">
            View your active goals, current status, and recent educator comments. Navigate to
            detailed goal pages to see progress and next steps.
          </Panel>
          <Panel title="My Learning Plan">
            Overview of your personalised learning plan. See upcoming lessons, assigned resources,
            and key milestones.
          </Panel>
          <Panel title="Progress Tracker">
            See recent milestones, progress percentages and upcoming targets.
          </Panel>
          <Panel title="Resources & Supports">
            Access curated learning materials and support documents tailored to your goals.
          </Panel>
        </div>

        <div className="mt-6">
          <Panel title="Quick Links">
            <ul>
              <li>
                <a className="text-blue-600" href="/progress">
                  View Progress
                </a>
              </li>
              <li>
                <a className="text-blue-600" href="/materials">
                  Open Materials
                </a>
              </li>
              <li>
                <a className="text-blue-600" href="/support">
                  Contact Support
                </a>
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default LearnerDashboard;
