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
