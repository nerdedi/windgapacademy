import jsPDF from "jspdf";
import React from "react";

type TopicData = {
  completed?: boolean;
  xp?: number;
  badge?: string;
};

type Learner = {
  name: string;
  progress?: {
    [subject: string]: {
      [topic: string]: TopicData;
    };
  };
};

export default function ExportReportButton({ learner }: { learner: Learner }) {
  const handleExport = () => {
    const doc = new jsPDF();
    doc.text(`Learner: ${learner.name}`, 10, 10);
    let y = 20;
    Object.entries(learner.progress || {}).forEach(([subject, topics]) => {
      doc.text(`${subject}`, 10, y);
      y += 8;
      Object.entries(topics).forEach(([topic, data]) => {
        const topicData = data as TopicData;
        doc.text(
          `- ${topic}: ${topicData.completed ? "Completed" : "Incomplete"}, XP: ${topicData.xp || 0}, Badge: ${topicData.badge || "None"}`,
          10,
          y,
        );
        y += 6;
      });
    });
    doc.save(`${learner.name}-report.pdf`);
  };

  return (
    <button onClick={handleExport} className="mt-2 btn-secondary">
      Export PDF Report
    </button>
  );
}
