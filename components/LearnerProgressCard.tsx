import React from "react";

import EducatorNotes from "./EducatorNotes";
import ExportReportButton from "./ExportReportButton";
import PDFPreview from "./PDFPreview";
import SupportFlag from "./SupportFlag";
import type { ProgressData } from "./types";

type Goal = {
  id: string;
  description: string;
  progress: number;
};

type Learner = {
  id: string;
  name: string;
  goals?: Goal[];
};

export default function LearnerProgressCard({ learner }) {
  React.useEffect(() => {
    if (!learner) return;
    const summary = `${learner.name}. Progress in ${Object.keys(learner.progress).join(", ")}.`;
    const utterance = new window.SpeechSynthesisUtterance(summary);
    window.speechSynthesis.speak(utterance);
  }, [learner]);

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h2 className="text-xl font-semibold">{learner.name}</h2>
      {learner.progress &&
        Object.entries(learner.progress).map(([subject, topics]) => (
          <div key={subject}>
            <h3 className="font-bold mt-2">{subject}</h3>
            {Object.entries(topics as Record<string, ProgressData>).map(([topic, data]) => (
              <div key={topic} className="ml-4 text-sm">
                <p>
                  {topic}: {data.completed ? "✅ Completed" : "❌ Incomplete"}
                </p>
                <p>XP: {data.xp}</p>
                <p>Badge: {data.badge || "None"}</p>
                <p className="text-xs text-gray-500">
                  ACSF Level: {(data as any).acsfLevel || "N/A"}
                </p>
                <p className="text-xs text-blue-600">
                  NDIS Support: {(data as any).ndisSupportType || "N/A"}
                </p>
                <SupportFlag needsHelp={data.needsHelp} />
              </div>
            ))}
          </div>
        ))}
      <div role="region" aria-label="Learner Progress Summary">
        <ExportReportButton learner={learner} />
        <PDFPreview learner={learner} />
        <EducatorNotes learnerId={learner.id} />
      </div>
    </div>
  );
}
