import React from 'react';

import React, { useEffect, useState } from "react";

const AnalyticsOverview = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Example: fetch analytics from API
    fetch("/api/analytics")
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load analytics");
        setLoading(false);
      });
  }, []);

  return (
    <div className="analytics-overview mb-6 grid grid-cols-2 gap-4">
      {loading && <div className="col-span-2 text-gray-500">Loading analytics...</div>}
      {error && <div className="col-span-2 text-red-500">{error}</div>}
      {!loading && !error && stats.map((stat) => (
        <div key={stat.label} className="p-4 bg-gray-100 rounded shadow">
          <div className="text-lg font-bold">{stat.value}</div>
          <div className="text-sm text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsOverview;
