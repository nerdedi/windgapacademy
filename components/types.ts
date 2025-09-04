// Shared types for Educator Dashboard and related components

export type ProgressData = {
  completed: boolean;
  xp: number;
  badge?: string;
  needsHelp?: boolean;
};

export type Learner = {
  goals: never[];
  id: string;
  name: string;
  progress: {
    [subject: string]: {
      [topic: string]: ProgressData;
    };
  };
};
