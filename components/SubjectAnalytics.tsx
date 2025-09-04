import React from "react";

import type { Learner, ProgressData } from "./types";

type SubjectAnalyticsProps = {
  learners: Learner[];
};

const SubjectAnalytics: React.FC<SubjectAnalyticsProps> = ({ learners }) => {
  const subjectStats: Record<
    string,
    {
      totalXP: number;
      badgeCount: number;
      engaged: number;
      acsfLevels: Set<string>;
      ndisTypes: Set<string>;
    }
  > = {};
  (learners || []).forEach((learner) => {
    Object.entries(learner.progress || {}).forEach(([subject, topics]) => {
      if (!subjectStats[subject])
        subjectStats[subject] = {
          totalXP: 0,
          badgeCount: 0,
          engaged: 0,
          acsfLevels: new Set(),
          ndisTypes: new Set(),
        };
      Object.entries(topics as Record<string, ProgressData>).forEach(([_, data]) => {
        subjectStats[subject].totalXP += data.xp;
        if (data.badge) subjectStats[subject].badgeCount += 1;
        if (data.completed) subjectStats[subject].engaged += 1;
        if ((data as any).acsfLevel) subjectStats[subject].acsfLevels.add((data as any).acsfLevel);
        if ((data as any).ndisSupportType)
          subjectStats[subject].ndisTypes.add((data as any).ndisSupportType);
      });
    });
  });
  return (
    <div className="mb-6" aria-label="Subject Analytics">
      <h2 className="text-xl font-bold mb-2">Subject Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(subjectStats).map(([subject, stats]) => (
          <div key={subject} className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold">{subject}</h3>
            <p>Total XP: {stats.totalXP}</p>
            <p>Badges Earned: {stats.badgeCount}</p>
            <p>Learners Engaged: {stats.engaged}</p>
            <p className="text-xs text-gray-500">
              ACSF Levels: {[...stats.acsfLevels].join(", ") || "N/A"}
            </p>
            <p className="text-xs text-blue-600">
              NDIS Types: {[...stats.ndisTypes].join(", ") || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectAnalytics;
