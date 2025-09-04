import React from "react";

type ProgressData = {
  completed: boolean;
  xp: number;
  badge?: string;
};

type Learner = {
  id: string;
  name: string;
  progress: {
    [subject: string]: {
      [topic: string]: ProgressData;
    };
  };
};

export default function PDFPreview({ learner }: { learner: Learner }) {
  return (
    <div className="border p-4 rounded bg-gray-50 mt-2">
      <h3 className="font-bold">Preview Report</h3>
      <p>Learner: {learner.name}</p>
      {Object.entries(learner.progress).map(([subject, topics]) => (
        <div key={subject}>
          <p className="font-semibold">{subject}</p>
          {Object.entries(topics).map(([topic, data]) => (
            <p key={topic}>- {topic}: {data.completed ? 'Completed' : 'Incomplete'}, XP: {data.xp}, Badge: {data.badge || 'None'}</p>
          ))}
        </div>
      ))}
    </div>
  );
}
