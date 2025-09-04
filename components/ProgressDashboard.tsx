import React from "react";
import type { Learner } from "./types";
import type { Goal } from "./curriculumTypes";

export default function ProgressDashboard({ learners }: { learners: Learner[] }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Progress Overview</h1>
      {learners.map((learner) => (
        <div key={learner.id} className="bg-gray-100 p-4 rounded mb-4">
          <h2>{learner.name}</h2>
          {(learner.goals || []).map((goal: Goal, i: number) => (
            <div key={i}>
              <p>{goal.title}</p>
              <progress value={goal.progress} max="100" className="w-full h-4" />
              <p>{goal.progress}% complete</p>
              {goal.progress < 50 && (
                <p className="text-red-600">⚠️ Area of Difficulty</p>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
