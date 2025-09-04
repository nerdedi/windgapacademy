import { getFirestore, doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";

export default function GoalSetting({ learnerId }: { learnerId: string }) {
  const [goal, setGoal] = useState("");
  const handleSave = () => {
    const db = getFirestore();
    setDoc(doc(db, "goals", learnerId), { goal, progress: 0 });
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2>Set a Personal Goal</h2>
      <input
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="E.g. Use public transport independently"
        className="w-full p-2 border rounded"
      />
      <button onClick={handleSave} className="btn-primary mt-2">
        Save Goal
      </button>
    </div>
  );
}
