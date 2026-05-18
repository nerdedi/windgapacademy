// ...existing code...

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useUser } from "../app/UserContext";
import { useGamification } from "../contexts/GamificationContext";

const XP_PER_LEVEL = 200;

async function safeFetch(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export function Dashboard() {
  const [users, setUsers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [apiAvailable, setApiAvailable] = useState(true);

  const { xp, badges, streak } = useGamification();
  const { user } = useUser();

  const level = Math.floor(xp / XP_PER_LEVEL) + 1;

  useEffect(() => {
    Promise.all([
      safeFetch("/api/users"),
      safeFetch("/api/assignments"),
      safeFetch("/api/materials"),
    ]).then(([u, a, m]) => {
      setUsers(u);
      setAssignments(a);
      setMaterials(m);
      if (!u.length && !a.length && !m.length) setApiAvailable(false);
    });
  }, []);

  return (
    <div className="dashboard p-6 bg-gray-50 min-h-screen max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#0B6E8F]">Dashboard</h1>
        {user && (
          <span className="text-sm text-gray-500">
            Signed in as <strong>{user.id}</strong> · Role: {user.role ?? "learner"}
          </span>
        )}
      </div>

      {/* Live gamification stats — always visible */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total XP", value: xp, icon: "⭐", border: "border-yellow-400" },
          { label: "Level", value: level, icon: "🏅", border: "border-teal-400" },
          { label: "Day Streak", value: streak, icon: "🔥", border: "border-orange-400" },
          { label: "Badges", value: badges.length, icon: "🎖️", border: "border-purple-400" },
        ].map(({ label, value, icon, border }) => (
          <div key={label} className={`bg-white rounded-lg shadow p-5 border-l-4 ${border}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl">{icon}</span>
              <span className="text-2xl font-bold text-gray-800">{value}</span>
            </div>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Backend data — shown if API is reachable */}
      {!apiAvailable ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-sm text-yellow-800">
          ℹ️ The backend server isn&apos;t reachable right now. Your game progress is still saved
          locally. Start the backend with <code className="font-mono">node backend/app.js</code> to
          see assignments and materials here.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">👥 Users</h2>
            {users.length === 0 ? (
              <p className="text-sm text-gray-400">No users to display.</p>
            ) : (
              <ul className="space-y-1">
                {users.map((u) => (
                  <li key={u.id} className="text-sm py-1 border-b last:border-0">
                    {u.name} <span className="text-xs text-gray-400 ml-1">({u.role})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">📋 Assignments</h2>
            {assignments.length === 0 ? (
              <p className="text-sm text-gray-400">No assignments yet.</p>
            ) : (
              <ul className="space-y-1">
                {assignments.map((a) => (
                  <li key={a.id} className="text-sm py-1 border-b last:border-0">
                    {a.title}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">📁 Study Materials</h2>
            {materials.length === 0 ? (
              <p className="text-sm text-gray-400">No materials uploaded yet.</p>
            ) : (
              <ul className="space-y-1">
                {materials.map((m) => (
                  <li key={m.id} className="text-sm py-1 border-b last:border-0">
                    {m.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Quick navigation */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">🚀 Quick Navigation</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { to: "/games", label: "🎮 Games" },
            { to: "/courses", label: "📚 Courses" },
            { to: "/lessons", label: "📖 Lessons" },
            { to: "/leaderboard", label: "🏆 Leaderboard" },
            { to: "/avatar", label: "👤 Avatar" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="px-4 py-2 bg-[#0B6E8F] text-white rounded-lg text-sm font-medium hover:bg-[#095a75]"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
