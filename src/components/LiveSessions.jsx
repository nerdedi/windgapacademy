import { useEffect, useState } from "react";

const LiveSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Define an async function inside useEffect
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/sessions");

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }

        const data = await response.json();
        setSessions(data);
      } catch (err) {
        console.error("Failed to fetch live sessions:", err);
        setError("Failed to load live sessions");
      } finally {
        setLoading(false);
      }
    };

    // Call the async function
    fetchSessions();
  }, []);

  return (
    <div className="live-sessions mb-6 bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-2">Live Sessions</h2>
      {loading && <div className="text-gray-500">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <ul>
        {sessions.length === 0 && !loading && !error ? (
          <li>No live sessions scheduled</li>
        ) : (
          sessions.map((s) => (
            <li key={s.id} className="py-1">
              {s.title} - {s.time}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default LiveSessions;
