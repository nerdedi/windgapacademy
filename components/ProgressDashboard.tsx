import React from "react";

import type { Goal } from "./curriculumTypes";
import type { Learner } from "./types";

function LearnerCard({ learner }: { learner: Learner }) {
  return (
    <div className="bg-gray-100 p-4 rounded mb-4">
      <h2>{learner.name}</h2>
      {(learner.goals ?? []).map((goal: Goal, i: number) => (
        <div key={i}>
          <p>{goal.title}</p>
          <progress value={goal.progress} max="100" className="w-full h-4" />
          <p>{goal.progress}% complete</p>
          {goal.progress < 50 && <p className="text-red-600">⚠️ Area of Difficulty</p>}
        </div>
      ))}
    </div>
  );
}

export default function ProgressDashboard({ learners }: { learners: Learner[] }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Progress Overview</h1>
      {learners && learners.length ? (
        learners.map((l) => <LearnerCard key={l.id} learner={l} />)
      ) : (
        <p>No learners found</p>
      )}
    </div>
  );
}
