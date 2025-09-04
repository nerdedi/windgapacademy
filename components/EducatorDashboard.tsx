import { motion } from "framer-motion";
import React, { useState } from "react";
import { useLearnerData } from "../hooks/useLearnerData";
import DashboardFilters from "./DashboardFilters";
import LearnerProgressCard from "./LearnerProgressCard";
import PrintView from "./PrintView";
import SubjectAnalytics from "./SubjectAnalytics";
import type { Learner } from "./types";

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
        onFilter={(type, value) => setFilters((prev) => ({ ...prev, [type]: value }))}
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
          transition={{ duration: 0.3 }}
        >
          <LearnerProgressCard learner={learner} />
        </motion.div>
      ))}
    </div>
  );
}
