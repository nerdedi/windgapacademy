// Use the existing GoalTracker.jsx implementation
import GoalTracker from "../GoalTracker.jsx";

export default function GoalTrackerWrapper({ learnerId }: { learnerId: string }) {
  return <GoalTracker learnerId={learnerId} />; // Pass learnerId prop to <GoalTracker></GoalTracker> components <HTMLTextAreaElement></HTMLTextAreaElement>
}
