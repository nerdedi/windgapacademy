// ...existing code...

import React, { useEffect, useState } from "react";

export function Dashboard() {
  const [users, setUsers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    fetch("/api/users").then(res => res.json()).then(setUsers);
    fetch("/api/assignments").then(res => res.json()).then(setAssignments);
    fetch("/api/materials").then(res => res.json()).then(setMaterials);
  }, []);

  return (
    <div className="dashboard p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Users</h2>
          <ul>
            {users.map(u => (
              <li key={u.id} className="py-1">{u.name} <span className="text-xs text-gray-500">({u.role})</span></li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Assignments</h2>
          <ul>
            {assignments.map(a => (
              <li key={a.id} className="py-1">{a.title}</li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Study Materials</h2>
          <ul>
            {materials.map(m => (
              <li key={m.id} className="py-1">{m.title}</li>
            ))}
          </ul>
        </div>
      </div>
      {/* Add more dashboard widgets and analytics here */}
    </div>
  );
}
