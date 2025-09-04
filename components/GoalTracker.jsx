import { getFirestore, doc, setDoc } from "firebase/firestore";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

import { app } from "../src/lib/firebaseClient.js";

export default function GoalTracker({ learnerId = "demo-learner", initialGoals = [] }) {
  const [goals, setGoals] = useState(initialGoals || []);
  const [newGoal, setNewGoal] = useState("");

  useEffect(() => {
    if (initialGoals) setGoals(initialGoals);
  }, [initialGoals]);

  const handleAdd = () => {
    if (!newGoal) return;
    const g = { id: Date.now().toString(), text: newGoal };
    const next = [...goals, g];
    setGoals(next);
    setNewGoal("");
  };

  const handleSaveGoals = async () => {
    try {
      const db = getFirestore(app);
      await setDoc(doc(db, "learners", learnerId), { goals });
      alert("Goals saved");
    } catch (e) {
      console.error(e);
      alert("Failed to save goals");
    }
  };

  return (
    <div className="p-4">
      <h3>Goal Tracker for {learnerId}</h3>
      <div className="flex">
        <input
          className="border p-2 flex-1"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="New goal"
        />
        <button onClick={handleAdd} className="btn ml-2">
          Add
        </button>
        <button onClick={handleSaveGoals} className="btn ml-2">
          Save Goals
        </button>
      </div>
      <ul className="mt-2">
        {goals.map((g) => (
          <li key={g.id}>{g.text}</li>
        ))}
      </ul>
    </div>
  );
}

GoalTracker.propTypes = {
  learnerId: PropTypes.string,
  initialGoals: PropTypes.array,
};
