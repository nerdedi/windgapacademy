import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useAutomationStore } from "./automationStore";

// Character and animation state management store
export const useCurriculumStore = create(
  devtools(
    persist(
      immer((set, get) => ({
        // Character state
        characters: [],
        selectedCharacter: null,
        characterStatus: "idle", // idle, loading, ready, error

        // Animation state
        currentAnimation: "idle",
        animationQueue: [],
        isAnimating: false,
        animationHistory: [],

        // Module generation state
        generationStatus: "idle", // idle, generating, complete, error
        generatedModules: [],
        currentModule: null,

        // Progress tracking
        studentProgress: {},
        completedModules: [],
        currentLearningPath: [],

        // Actions
        setCharacters: (characters) => set({ characters }),

        selectCharacter: (character) =>
          set({
            selectedCharacter: character,
            currentAnimation: "idle",
            animationQueue: [],
          }),

        setCharacterStatus: (status) => set({ characterStatus: status }),

        // Animation management
        playAnimation: (animationId, duration = 3.0, priority = "normal") => {
          const { animationQueue, isAnimating } = get();

          const newAnimation = {
            id: animationId,
            duration,
            priority,
            timestamp: Date.now(),
            status: "queued",
          };

          // High priority animations jump to front of queue
          if (priority === "high") {
            set({
              animationQueue: [newAnimation, ...animationQueue],
              currentAnimation: animationId,
            });
          } else {
            set({
              animationQueue: [...animationQueue, newAnimation],
            });
          }

          // Start processing queue if not already animating
          if (!isAnimating) {
            get().processAnimationQueue();
          }
        },

        processAnimationQueue: async () => {
          const { animationQueue } = get();
          if (animationQueue.length === 0) return;

          set({ isAnimating: true });

          const nextAnimation = animationQueue[0];
          set({
            currentAnimation: nextAnimation.id,
            animationQueue: animationQueue.slice(1),
          });

          // Add to history
          const { animationHistory } = get();
          set({
            animationHistory: [
              ...animationHistory,
              {
                ...nextAnimation,
                status: "playing",
                startTime: Date.now(),
              },
            ],
          });

          // Simulate animation duration
          setTimeout(() => {
            const { animationQueue: currentQueue } = get();

            if (currentQueue.length > 0) {
              get().processAnimationQueue();
            } else {
              set({
                isAnimating: false,
                currentAnimation: "idle",
              });
            }
          }, nextAnimation.duration * 1000);
        },

        clearAnimationQueue: () =>
          set({
            animationQueue: [],
            isAnimating: false,
            currentAnimation: "idle",
          }),

        // Module generation
        setGenerationStatus: (status) => set({ generationStatus: status }),

        // Integration with automation system
        sendToAutomationSystem: (moduleIds) => {
          const { generatedModules } = get();

          // Find the selected modules
          const modulesToAutomate = moduleIds
            ? generatedModules.filter((module) => moduleIds.includes(module.id))
            : generatedModules;

          const automationStore = useAutomationStore.getState();

          // Add modules to automation queue
          automationStore.addToModuleQueue(modulesToAutomate);

          // Start the learning path if not already running
          if (!automationStore.learningPathActive) {
            automationStore.startLearningPath();
          }
        },

        addGeneratedModule: (module) => {
          const { generatedModules } = get();
          set({
            generatedModules: [...generatedModules, module],
            currentModule: module,
          });
        },

        // Progress tracking
        updateStudentProgress: (studentId, moduleId, progress) => {
          const { studentProgress } = get();
          set({
            studentProgress: {
              ...studentProgress,
              [studentId]: {
                ...studentProgress[studentId],
                [moduleId]: progress,
              },
            },
          });
        },

        completeModule: (moduleId, studentId) => {
          const { completedModules, studentProgress } = get();

          set({
            completedModules: [
              ...completedModules,
              {
                moduleId,
                studentId,
                completedAt: new Date().toISOString(),
                score: studentProgress[studentId]?.[moduleId]?.score || 0,
              },
            ],
          });
        },

        // Learning path management
        setLearningPath: (path) => set({ currentLearningPath: path }),

        getNextModuleInPath: (currentModuleId) => {
          const { currentLearningPath } = get();
          const currentIndex = currentLearningPath.findIndex((m) => m.id === currentModuleId);
          return currentIndex >= 0 && currentIndex < currentLearningPath.length - 1
            ? currentLearningPath[currentIndex + 1]
            : null;
        },

        // Analytics and insights
        getAnimationStats: () => {
          const { animationHistory } = get();
          return {
            totalAnimations: animationHistory.length,
            mostUsedAnimation: animationHistory.reduce((acc, anim) => {
              acc[anim.id] = (acc[anim.id] || 0) + 1;
              return acc;
            }, {}),
            averageDuration:
              animationHistory.reduce((sum, anim) => sum + anim.duration, 0) /
              animationHistory.length,
          };
        },

        getStudentInsights: (studentId) => {
          const { completedModules } = get();
          const studentModules = completedModules.filter((m) => m.studentId === studentId);

          return {
            modulesCompleted: studentModules.length,
            averageScore:
              studentModules.reduce((sum, m) => sum + m.score, 0) / studentModules.length,
            learningStreak: get().calculateLearningStreak(studentId),
            preferredSubjects: get().getPreferredSubjects(studentId),
          };
        },

        calculateLearningStreak: (studentId) => {
          const { completedModules } = get();
          const studentModules = completedModules
            .filter((m) => m.studentId === studentId)
            .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

          let streak = 0;
          let currentDate = new Date();

          for (const module of studentModules) {
            const moduleDate = new Date(module.completedAt);
            const daysDiff = Math.floor((currentDate - moduleDate) / (1000 * 60 * 60 * 24));

            if (daysDiff <= streak + 1) {
              streak++;
              currentDate = moduleDate;
            } else {
              break;
            }
          }

          return streak;
        },

        getPreferredSubjects: (studentId) => {
          const { studentProgress } = get();
          const progress = studentProgress[studentId] || {};

          // Analyze completion rates and scores by subject
          const subjectStats = {};
          Object.entries(progress).forEach((entry) => {
            const data = entry[1];
            if (data.subject) {
              if (!subjectStats[data.subject]) {
                subjectStats[data.subject] = { completions: 0, totalScore: 0, count: 0 };
              }
              subjectStats[data.subject].count++;
              if (data.completed) {
                subjectStats[data.subject].completions++;
                subjectStats[data.subject].totalScore += data.score || 0;
              }
            }
          });

          return Object.entries(subjectStats)
            .map(([subject, stats]) => ({
              subject,
              completionRate: stats.completions / stats.count,
              averageScore: stats.totalScore / stats.completions || 0,
              engagement: stats.count,
            }))
            .sort((a, b) => b.completionRate * b.averageScore - a.completionRate * a.averageScore);
        },
      })),
      {
        name: "curriculum-storage",
      },
    ),
  ),
);

// Selectors for optimized re-renders
export const useCharacterState = () =>
  useCurriculumStore((state) => ({
    characters: state.characters,
    selectedCharacter: state.selectedCharacter,
    characterStatus: state.characterStatus,
    selectCharacter: state.selectCharacter,
    setCharacterStatus: state.setCharacterStatus,
  }));

export const useAnimationState = () =>
  useCurriculumStore((state) => ({
    currentAnimation: state.currentAnimation,
    animationQueue: state.animationQueue,
    isAnimating: state.isAnimating,
    playAnimation: state.playAnimation,
    clearAnimationQueue: state.clearAnimationQueue,
    getAnimationStats: state.getAnimationStats,
  }));

export const useModuleState = () =>
  useCurriculumStore((state) => ({
    generationStatus: state.generationStatus,
    generatedModules: state.generatedModules,
    currentModule: state.currentModule,
    setGenerationStatus: state.setGenerationStatus,
    addGeneratedModule: state.addGeneratedModule,
  }));

export const useProgressState = () =>
  useCurriculumStore((state) => ({
    studentProgress: state.studentProgress,
    completedModules: state.completedModules,
    updateStudentProgress: state.updateStudentProgress,
    completeModule: state.completeModule,
    getStudentInsights: state.getStudentInsights,
  }));
