import React from "react";

// Use the existing GoalTracker.jsx implementation
import GoalTracker from "../GoalTracker";

export default function GoalTrackerWrapper({ learnerId }: { learnerId: string }) {
  return <GoalTracker learnerId={learnerId} />;
}
