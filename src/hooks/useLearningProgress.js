import { useState, useEffect } from "react";

// Simple learning progress hook
export const useLearningProgress = () => {
  const [progress, setProgress] = useState({
    overall: 0,
    subjects: {},
    achievements: [],
    streaks: {},
    loading: true,
  });

  useEffect(() => {
    // Simulate loading progress data
    const timer = setTimeout(() => {
      const mockProgress = {
        overall: 78,
        subjects: {
          mathematics: {
            progress: 85,
            level: "Advanced",
            completedLessons: 24,
            totalLessons: 30,
            lastActivity: new Date(Date.now() - 1000 * 60 * 30),
          },
          science: {
            progress: 72,
            level: "Intermediate",
            completedLessons: 18,
            totalLessons: 25,
            lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
          },
          reading: {
            progress: 91,
            level: "Expert",
            completedLessons: 32,
            totalLessons: 35,
            lastActivity: new Date(Date.now() - 1000 * 60 * 15),
          },
        },
        achievements: [
          {
            id: 1,
            title: "Math Master",
            description: "Completed 20 math lessons",
            icon: "🏆",
            earnedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
            category: "mathematics",
          },
          {
            id: 2,
            title: "Reading Champion",
            description: "Read 50 books this month",
            icon: "📚",
            earnedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
            category: "reading",
          },
          {
            id: 3,
            title: "Science Explorer",
            description: "Completed all chemistry experiments",
            icon: "🔬",
            earnedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
            category: "science",
          },
        ],
        streaks: {
          current: 7,
          longest: 15,
          lastActivity: new Date(),
        },
        loading: false,
      };

      setProgress(mockProgress);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const updateSubjectProgress = (subject, newProgress) => {
    setProgress((prev) => ({
      ...prev,
      subjects: {
        ...prev.subjects,
        [subject]: {
          ...prev.subjects[subject],
          ...newProgress,
          lastActivity: new Date(),
        },
      },
    }));
  };

  const addAchievement = (achievement) => {
    const newAchievement = {
      id: Date.now(),
      earnedAt: new Date(),
      ...achievement,
    };

    setProgress((prev) => ({
      ...prev,
      achievements: [newAchievement, ...prev.achievements],
    }));
  };

  const updateStreak = () => {
    setProgress((prev) => ({
      ...prev,
      streaks: {
        ...prev.streaks,
        current: prev.streaks.current + 1,
        longest: Math.max(prev.streaks.longest, prev.streaks.current + 1),
        lastActivity: new Date(),
      },
    }));
  };

  const getSubjectProgress = (subject) => {
    return (
      progress.subjects[subject] || {
        progress: 0,
        level: "Beginner",
        completedLessons: 0,
        totalLessons: 0,
        lastActivity: null,
      }
    );
  };

  const getRecentAchievements = (limit = 5) => {
    return progress.achievements
      .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt))
      .slice(0, limit);
  };

  return {
    progress,
    updateSubjectProgress,
    addAchievement,
    updateStreak,
    getSubjectProgress,
    getRecentAchievements,
  };
};

export default useLearningProgress;
