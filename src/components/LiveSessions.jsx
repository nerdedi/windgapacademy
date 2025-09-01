import React, { useEffect, useState } from 'react';

const LiveSessions = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetch("/api/sessions")
      .then(res => res.json())
      .then(data => {
        setSessions(data);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load live sessions");
        setLoading(false);
      });
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
            <li key={s.id} className="py-1">{s.title} - {s.time}</li>
          ))
        )}
      </ul>
    </div>
  );
};

export default LiveSessions;
