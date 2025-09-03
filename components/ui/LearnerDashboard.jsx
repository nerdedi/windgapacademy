import React from "react";

const Panel = ({ title, children }) => (
  <section className="bg-white p-4 rounded shadow">
    <h3 className="font-semibold mb-2">{title}</h3>
    <div className="text-sm text-gray-600">{children}</div>
  </section>
);

const LearnerDashboard = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-6">
        <h2 className="text-3xl font-semibold">Learner Dashboard</h2>
        <p className="text-sm text-gray-600">Your personal learning space — goals, progress and resources.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel title="My NDIS Goals">View your active goals, current status, and recent educator comments.</Panel>

        <Panel title="Progress Tracker">See recent milestones, progress percentages and upcoming targets.</Panel>

        <Panel title="Resources & Supports">Access curated learning materials and support documents tailored to your goals.</Panel>
      </div>

      <div className="mt-6">
        <Panel title="Quick Links">
          <ul>
            <li>
              <a className="text-blue-600" href="/progress">View Progress</a>
            </li>
            <li>
              <a className="text-blue-600" href="/materials">Open Resources</a>
            </li>
            <li>
              <a className="text-blue-600" href="/support">Contact Support</a>
            </li>
          </ul>
        </Panel>
      </div>
    </div>
  );
};

export default LearnerDashboard;
import React from 'react';

export default function LearnerDashboard() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Learner Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="p-4 bg-white rounded shadow">
          <h3 className="font-medium">My NDIS Goals</h3>
          <p className="mt-2 text-sm text-gray-600">See your active goals, progress checkpoints, and next steps.</p>
        </section>

        <section className="p-4 bg-white rounded shadow">
          <h3 className="font-medium">Progress Tracker</h3>
          <p className="mt-2 text-sm text-gray-600">A simple visual timeline of achievements and supports used.</p>
        </section>

        <section className="p-4 bg-white rounded shadow">
          <h3 className="font-medium">Resources & Supports</h3>
          <p className="mt-2 text-sm text-gray-600">Recommended learning materials and community supports tailored for you.</p>
        </section>

        <section className="p-4 bg-white rounded shadow">
          <h3 className="font-medium">Quick Links</h3>
          <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
            <li>View assigned supports</li>
            <li>Request review</li>
            <li>Download my report</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
