import React from "react";

export default function GoalTracker({ learnerId = "demo", goals = [] }) {
  return (
    <div className="p-4">
      <h3>Goal Tracker for {learnerId}</h3>
      <ul>
        {goals.map((g, i) => (
          <li key={i}>
            {g.title} - {g.progress}%
          </li>
        ))}
      </ul>
    </div>
  );
}
