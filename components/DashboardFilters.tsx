import React from "react";

type DashboardFiltersProps = {
  subjects: string[];
  learners: Array<{ id: string; name: string }>;
  onFilter: (type: "subject" | "learner", value: string) => void; // used in props, no need to remove
};

export default function DashboardFilters({ subjects, learners, onFilter }: DashboardFiltersProps) {
  return (
    <div className="flex gap-4 mb-4">
      <select onChange={(e) => onFilter("subject", e.target.value)} className="border p-2 rounded">
        <option value="">All Subjects</option>
        {subjects.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <select onChange={(e) => onFilter("learner", e.target.value)} className="border p-2 rounded">
        <option value="">All Learners</option>
        {learners.map((l) => (
          <option key={l.id} value={l.id}>
            {l.name}
          </option>
        ))}
      </select>
    </div>
  );
}
