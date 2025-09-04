import React from "react";

type Goal = { title: string; progress: number };

export function LearnerCard({ name, goals = [] }: { name: string; goals?: Goal[] }) {
  return (
    <div className="learner-card">
      <h3>{name}</h3>
      <ul>
        {goals.map((g, i) => (
          <li key={i}>
            {g.title}: {g.progress}%
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProgressDashboard() {
  return (
    <div>
      <h2>Progress Dashboard</h2>
      <LearnerCard name="Jenna Luu" goals={[{ title: "Use public transport", progress: 40 }]} />
    </div>
  );
}
