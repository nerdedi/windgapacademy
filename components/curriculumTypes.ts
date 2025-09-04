// Curriculum metadata types for LLND, ACSF, NDIS, Inclusive Education

export type CurriculumTopic = {
  topicId: string;
  title: string;
  subject: string;
  acsfSkills: string[];
  acsfLevel: string;
  ndisSupportType: string;
  inclusiveIndicators: string[];
  learningOutcomes: string[];
  assessingCriteria: string[];
};

export type Goal = {
  goalId: string;
  title: string;
  subject: string;
  acsfSkill: string;
  ndisSupportType: string;
  progress: number;
  indicators: string[];
};
