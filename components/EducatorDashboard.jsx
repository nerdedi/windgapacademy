import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";

import { app } from "../src/lib/firebaseClient.js";

import { useAuth } from "./AuthProvider";

export default function EducatorDashboard() {
  const [learners, setLearners] = useState([]);

  const { user } = useAuth();
  useEffect(() => {
    if (!user) return;
    const db = getFirestore(app);
    const col = collection(db, "learners");
    const unsub = onSnapshot(col, (snapshot) => {
      setLearners(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, [user]);

  return (
    <div>
      <h2>Educator Dashboard</h2>
      {learners.map((learner) => (
        <div key={learner.id}>
          <h3>{learner.name}</h3>
          {(learner.goals || []).map((goal) => (
            <div key={goal.title}>
              <p>{goal.title}</p>
              <progress value={goal.progress} max="100" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
