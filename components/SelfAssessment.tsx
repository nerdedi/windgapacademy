import React, { useState } from "react";

import { getFirestore, doc, setDoc } from "firebase/firestore";

export default function SelfAssessment({ learnerId }: { learnerId: string }) {
  const [responses, setResponses] = useState<Record<string, string>>({});

  const questions = [
    { skill: "Reading", question: "Can you read a short passage and explain it?" },
    { skill: "Numeracy", question: "Can you count money and make change?" },
    { skill: "Oral Communication", question: "Can you ask for help when needed?" },
  ];

  const handleSubmit = () => {
  const db = getFirestore();
  setDoc(doc(db, "selfAssessments", learnerId), responses);
  };

  return (
    <div className="bg-gray-50 p-4 rounded">
      <h2>Self Assessment</h2>
      {questions.map((q) => (
        <div key={q.skill} className="mb-2">
          <label>{q.question}</label>
          <select
            onChange={(e) => setResponses({ ...responses, [q.skill]: e.target.value })}
            className="ml-2"
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="Sometimes">Sometimes</option>
            <option value="No">No</option>
          </select>
        </div>
      ))}
      <button onClick={handleSubmit} className="btn-primary mt-2">
        Submit
      </button>
    </div>
  );
}
