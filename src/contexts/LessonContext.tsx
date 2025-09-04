import React, { createContext, useContext, useState, useCallback } from "react";

import { setUserDoc } from "../app/firestoreClient.js";

type Step = {
  id: string;
  type: string;
  content?: string;
  src?: string;
  options?: any[];
};

type LessonState = {
  subject: string | null;
  topic: string | null;
  stepIndex: number;
  steps: Step[];
  understood: boolean | null;
};

type LessonContextType = {
  state: LessonState;
  setLesson: (subject: string, topic: string, steps: Step[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  setUnderstood: (u: boolean) => void;
};

const defaultState: LessonState = {
  subject: null,
  topic: null,
  stepIndex: 0,
  steps: [],
  understood: null,
};

const LessonContext = createContext<LessonContextType | undefined>(undefined);

export function useLesson() {
  const ctx = useContext(LessonContext);
  if (!ctx) throw new Error("useLesson must be used within LessonProvider");
  return ctx;
}

export const LessonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<LessonState>(defaultState);

  const setLesson = useCallback((subject: string, topic: string, steps: Step[]) => {
    setState({ subject, topic, steps, stepIndex: 0, understood: null });
  }, []);

  const nextStep = useCallback(() => {
    setState((s) => ({ ...s, stepIndex: Math.min(s.steps.length - 1, s.stepIndex + 1) }));
  }, []);

  const prevStep = useCallback(() => {
    setState((s) => ({ ...s, stepIndex: Math.max(0, s.stepIndex - 1) }));
  }, []);

  const goToStep = useCallback((index: number) => {
    setState((s) => ({
      ...s,
      stepIndex: Math.max(0, Math.min(index, s.steps.length - 1)),
    }));
  }, []);

  const setUnderstood = (u: boolean) => {
    setState((prev) => {
      const subjectKey = prev.subject || "unknown";
      const topicKey = prev.topic || "unknown";
      // best-effort persist without blocking UI; do not await inside state updater
      (async () => {
        try {
          const uid = (window as any).__CURRENT_USER_ID__;
          if (uid) {
            await setUserDoc(uid, {
              progress: { [subjectKey]: { [topicKey]: { understood: u } } },
            });
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn("Could not persist lesson progress", e);
        }
      })();
      return { ...prev, understood: u };
    });
  };

  return (
    <LessonContext.Provider
      value={{ state, setLesson, nextStep, prevStep, goToStep, setUnderstood }}
    >
      {children}
    </LessonContext.Provider>
  );
};
