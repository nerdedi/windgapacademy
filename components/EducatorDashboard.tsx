import { motion } from "framer-motion";
import { useState } from "react";

import { useLearnerData } from "../hooks/useLearnerData.js";

import DashboardFilters from "./DashboardFilters.js";
import LearnerProgressCard from "./LearnerProgressCard.js";
import PrintView from "./PrintView.js";
import SubjectAnalytics from "./SubjectAnalytics.js";
import type { Learner } from "./types.js";

export default function EducatorDashboard() {
  const learners: Learner[] = useLearnerData();
  const [filters, setFilters] = useState({ subject: "", learner: "" });
  const filteredLearners = learners.filter((l) => {
    if (filters.learner && l.id !== filters.learner) return false;
    if (filters.subject && !l.progress[filters.subject]) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6" aria-label="Educator Dashboard" role="main">
      <h1 className="text-3xl font-bold">Educator Dashboard</h1>
      <DashboardFilters
        subjects={["Literacy", "Numeracy", "Digital", "Emotional Regulation"]}
        learners={learners}
        onFilter={(type: "subject" | "learner", value: string) =>
          setFilters((prev) => ({ ...prev, [type]: value }))
        }
        currentFilters={filters}
      />
      <SubjectAnalytics learners={filteredLearners} />
      <button onClick={() => window.print()} className="btn-secondary mb-4">
        Print Dashboard
      </button>
      <PrintView learners={filteredLearners} />
      {filteredLearners.map((learner) => (
        <motion.div
          key={learner.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="border-b pb-4 mb-4"
          aria-label={`Progress card for ${learner.name}`}
          role="region"
          tabIndex={0}
        >
          <LearnerProgressCard learner={learner} />
          <button onClick={() => window.print()} className="btn-secondary mb-4">
            Print Dashboard
          </button>
        </motion.div>
      ))}
      {filteredLearners.length === 0 && <p>No learners match the selected filters.</p>}
    </div>
  );
}
