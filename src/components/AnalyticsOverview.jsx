import React, { useEffect, useState } from "react";

const AnalyticsOverview = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Define an async function inside useEffect
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/analytics");

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    // Call the async function
    fetchAnalytics();
  }, []);

  return (
    <div className="analytics-overview mb-6 grid grid-cols-2 gap-4">
      {loading && <div className="col-span-2 text-gray-500">Loading analytics...</div>}
      {error && <div className="col-span-2 text-red-500">{error}</div>}
      {!loading &&
        !error &&
        stats.map((stat) => (
          <div key={stat.label} className="p-4 bg-gray-100 rounded shadow">
            <div className="text-lg font-semibold">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
    </div>
  );
};

export default AnalyticsOverview;
