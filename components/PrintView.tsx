import React from "react";

import type { Learner, ProgressData } from "./types";

export default function PrintView({ learners }: { learners: Learner[] }) {
  return (
    <div className="print:bg-white print:p-6 print:text-black">
      {learners.map((learner) => (
        <div key={learner.id} className="mb-6">
          <h2>{learner.name}</h2>
          {Object.entries(learner.progress).map(([subject, topics]) => (
            <div key={subject}>
              <h3>{subject}</h3>
              {Object.entries(topics as Record<string, ProgressData>).map(([topic, data]) => (
                <p key={topic}>
                  {topic}: {data.completed ? "✅" : "❌"}, XP: {data.xp}, Badge:{" "}
                  {data.badge || "None"}, ACSF: {(data as any).acsfLevel}, NDIS:{" "}
                  {(data as any).ndisSupportType}
                </p>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
