/**
 * Lesson Model - Defines the structure for all lesson content
 *
 * This structure is used across all lesson types and difficulty levels
 */

export const DIFFICULTY_LEVELS = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
};

export const CONTENT_TYPES = {
  TEXT: "text",
  VIDEO: "video",
  INTERACTIVE: "interactive",
  QUIZ: "quiz",
  ACTIVITY: "activity",
  ASSESSMENT: "assessment",
};

export const LEARNING_STYLES = {
  VISUAL: "visual",
  AUDITORY: "auditory",
  READING: "reading",
  KINESTHETIC: "kinesthetic",
};

/**
 * Standard lesson model template
 */
export const createLessonTemplate = ({
  id,
  title,
  description,
  category,
  subcategory,
  difficultyLevel,
  duration, // in minutes
  learningObjectives,
  prerequisites = [],
  content,
  activities,
  assessments,
  resources = [],
  accessibilityFeatures = {},
  neurodivergentConsiderations = {},
}) => ({
  id,
  title,
  description,
  category,
  subcategory,
  difficultyLevel,
  duration,
  learningObjectives,
  prerequisites,
  content,
  activities,
  assessments,
  resources,
  accessibilityFeatures,
  neurodivergentConsiderations,
  progress: 0,
  completed: false,
});
