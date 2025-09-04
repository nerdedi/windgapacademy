import { getFirestore, collection, addDoc } from "firebase/firestore";
import React, { useState } from "react";

import modulesData from "../curriculum/llnd-modules.json";
import { app } from "../src/lib/firebaseClient.js";

export default function CurriculumBuilder() {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [acsfLevel, setAcsfLevel] = useState("");
  const [ndisSupport, setNdisSupport] = useState("");
  const [status, setStatus] = useState("");
  const [useServer, setUseServer] = useState(false);

  const handleGenerate = async () => {
    try {
      setStatus("Generating module...");
      if (useServer) {
        const res = await fetch("/api/modules/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subject, topic, acsfLevel, ndisSupport }),
        });
        const j = await res.json();
        setStatus(j.ok ? "Module saved (server)" : "Server save failed");
      } else {
        const db = getFirestore(app);
        await addDoc(collection(db, "modules"), {
          subject,
          topic,
          acsfLevel,
          ndisSupport,
          createdAt: new Date().toISOString(),
        });
        setStatus("Module saved (firestore)");
      }
    } catch (err) {
      console.error(err);
      setStatus("Failed to save module");
    }
  };

  const subjects = Object.keys(modulesData.modules || {});

  return (
    <div>
      <h2>Create Module</h2>
      <label>
        <input
          type="checkbox"
          checked={useServer}
          onChange={(e) => setUseServer(e.target.checked)}
        />
        Use server generation
      </label>
      <div>
        <label>
          Subject
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="">Select subject</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Topic
          <select value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option value="">Select topic</option>
            {(modulesData.modules[subject] || []).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          ACSF Level
          <select value={acsfLevel} onChange={(e) => setAcsfLevel(e.target.value)}>
            <option value="">Select level</option>
            <option>Level 1</option>
            <option>Level 2</option>
            <option>Level 3</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          NDIS Support
          <select value={ndisSupport} onChange={(e) => setNdisSupport(e.target.value)}>
            <option value="">Select support</option>
            <option>Daily Living</option>
            <option>Employment</option>
          </select>
        </label>
      </div>
      <div>
        <button onClick={handleGenerate}>Generate Module</button>
        <div>{status}</div>
      </div>
    </div>
  );
}
