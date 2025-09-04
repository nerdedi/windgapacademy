import { doc, onSnapshot, getFirestore } from "firebase/firestore";
import React, { useEffect, useState } from "react";

import { app } from "../src/lib/firebaseClient.js";

import { useAuth } from "./AuthProvider";

export default function LearnerGoalTracker({ learnerId }) {
  const [goals, setGoals] = useState([]);

  const { user } = useAuth();
  useEffect(() => {
    if (!learnerId || !user) return;
    const db = getFirestore(app);
    const ref = doc(db, "learners", learnerId);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) setGoals(snap.data().goals || []);
    });
    return unsub;
  }, [learnerId, user]);

  return (
    <div>
      <h2>My Goals</h2>
      {goals.map((goal) => (
        <div key={goal.title}>
          <p>{goal.title}</p>
          <progress value={goal.progress} max="100" />
        </div>
      ))}
    </div>
  );
}
