import React from "react";

import { useGamification } from "../src/contexts/GamificationContext";

export default function ProgressTracker() {
  const { xp, badges, streak } = useGamification();
  return (
    <aside
      aria-label="Progress Tracker"
      id="progress-tracker-component"
      className="p-3 bg-white rounded shadow"
    >
      <div className="font-semibold">XP: {xp}</div>
      <div>Streak: {streak} days</div>
      <div className="mt-2">
        <div className="font-semibold">Badges</div>
        <div className="flex gap-2 mt-1">
          {badges.map((b) => (
            <span key={b} className="badge">
              {b}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
