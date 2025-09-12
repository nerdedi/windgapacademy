import { useState, useEffect } from "react";

// Simple assessments hook
export const useAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading assessment data
    const timer = setTimeout(() => {
      const mockAssessments = [
        {
          id: 1,
          title: "Math Quiz - Fractions",
          subject: "Mathematics",
          type: "quiz",
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days from now
          totalQuestions: 20,
          timeLimit: 30, // minutes
          status: "active",
          classId: 1,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        },
        {
          id: 2,
          title: "Science Project - Solar System",
          subject: "Science",
          type: "project",
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 week from now
          totalQuestions: 1,
          timeLimit: null,
          status: "active",
          classId: 2,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        },
        {
          id: 3,
          title: "Reading Comprehension Test",
          subject: "English",
          type: "test",
          dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago (overdue)
          totalQuestions: 15,
          timeLimit: 45,
          status: "overdue",
          classId: 3,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
        },
      ];

      const mockSubmissions = [
        {
          id: 1,
          assessmentId: 1,
          studentId: 1,
          studentName: "Sarah Johnson",
          submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
          score: 85,
          totalScore: 100,
          status: "graded",
          timeSpent: 25, // minutes
        },
        {
          id: 2,
          assessmentId: 1,
          studentId: 2,
          studentName: "Tom Wilson",
          submittedAt: new Date(Date.now() - 1000 * 60 * 30),
          score: 92,
          totalScore: 100,
          status: "graded",
          timeSpent: 22,
        },
        {
          id: 3,
          assessmentId: 2,
          studentId: 3,
          studentName: "Emma Davis",
          submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
          score: null,
          totalScore: 100,
          status: "pending",
          timeSpent: null,
        },
      ];

      setAssessments(mockAssessments);
      setSubmissions(mockSubmissions);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const getAssessmentsByClass = (classId) => {
    return assessments.filter((assessment) => assessment.classId === classId);
  };

  const getSubmissionsByAssessment = (assessmentId) => {
    return submissions.filter((submission) => submission.assessmentId === assessmentId);
  };

  const getAssessmentStats = (assessmentId) => {
    const assessmentSubmissions = getSubmissionsByAssessment(assessmentId);
    const gradedSubmissions = assessmentSubmissions.filter((s) => s.status === "graded");

    if (gradedSubmissions.length === 0) {
      return {
        totalSubmissions: assessmentSubmissions.length,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        completionRate: 0,
      };
    }

    const scores = gradedSubmissions.map((s) => s.score);
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

    return {
      totalSubmissions: assessmentSubmissions.length,
      averageScore: Math.round(averageScore),
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores),
      completionRate: Math.round((gradedSubmissions.length / assessmentSubmissions.length) * 100),
    };
  };

  const createAssessment = (newAssessment) => {
    const assessment = {
      id: Date.now(),
      status: "active",
      createdAt: new Date(),
      ...newAssessment,
    };
    setAssessments((prev) => [assessment, ...prev]);
    return assessment;
  };

  const updateAssessment = (assessmentId, updates) => {
    setAssessments((prev) =>
      prev.map((assessment) =>
        assessment.id === assessmentId ? { ...assessment, ...updates } : assessment,
      ),
    );
  };

  const gradeSubmission = (submissionId, score, feedback = "") => {
    setSubmissions((prev) =>
      prev.map((submission) =>
        submission.id === submissionId
          ? {
              ...submission,
              score,
              feedback,
              status: "graded",
              gradedAt: new Date(),
            }
          : submission,
      ),
    );
  };

  const getOverdueAssessments = () => {
    const now = new Date();
    return assessments.filter(
      (assessment) => new Date(assessment.dueDate) < now && assessment.status === "active",
    );
  };

  const getUpcomingAssessments = (days = 7) => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    return assessments.filter((assessment) => {
      const dueDate = new Date(assessment.dueDate);
      return dueDate > now && dueDate <= futureDate && assessment.status === "active";
    });
  };

  return {
    assessments,
    submissions,
    loading,
    getAssessmentsByClass,
    getSubmissionsByAssessment,
    getAssessmentStats,
    createAssessment,
    updateAssessment,
    gradeSubmission,
    getOverdueAssessments,
    getUpcomingAssessments,
  };
};

export default useAssessments;
