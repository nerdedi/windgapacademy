import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

// Learning Path Automation Store inspired by warehouse automation concepts
export const useAutomationStore = create(
  subscribeWithSelector((set, get) => ({
    // Learning path "conveyor belt" - represents the automated flow of learning modules
    learningPathActive: false,
    learningPathSpeed: 1.0, // Speed multiplier for content progression
    currentModuleQueue: [], // Queue of modules to be presented to the user
    processingModule: false, // Whether a module is currently being processed

    // Proximity sensor concepts - detecting learner engagement and progress
    engagementSensors: {
      attentionLevel: 0, // 0-100 scale of current user attention
      interactionFrequency: 0, // Rate of user interactions
      timeOnContent: 0, // Time spent on current content
      completionProgress: 0, // Progress through current module (0-100)
    },
    sensorThresholds: {
      attention: 30, // Minimum attention level before intervention
      interaction: 5, // Minimum interactions per minute
      timeOnContent: 60, // Seconds before checking engagement
    },

    // Analytics and history
    moduleHistory: [],
    engagementHistory: [],

    // Actions - inspired by conveyor belt controls
    startLearningPath: () => {
      const { learningPathActive, currentModuleQueue } = get();

      if (!learningPathActive && currentModuleQueue.length > 0) {
        set({
          learningPathActive: true,
          processingModule: false,
        });

        // Start processing the module queue if not already active
        if (!get().processingModule) {
          get().processModuleQueue();
        }
      }
    },

    stopLearningPath: () => {
      set({
        learningPathActive: false,
        processingModule: false,
      });
    },

    setLearningPathSpeed: (speed) => {
      set({ learningPathSpeed: speed });
    },

    addToModuleQueue: (modules) => {
      const { currentModuleQueue } = get();

      // Add new modules to the queue
      if (Array.isArray(modules)) {
        set({
          currentModuleQueue: [...currentModuleQueue, ...modules],
        });
      } else {
        set({
          currentModuleQueue: [...currentModuleQueue, modules],
        });
      }

      // Start processing if the path is active and we're not already processing
      const { learningPathActive, processingModule } = get();
      if (learningPathActive && !processingModule) {
        get().processModuleQueue();
      }
    },

    processModuleQueue: async () => {
      const { currentModuleQueue, learningPathActive } = get();
      if (currentModuleQueue.length === 0 || !learningPathActive) return;

      set({ processingModule: true });

      const nextModule = currentModuleQueue[0];
      set({
        currentModuleQueue: currentModuleQueue.slice(1),
      });

      // Add to history
      const { moduleHistory } = get();
      set({
        moduleHistory: [
          ...moduleHistory,
          {
            ...nextModule,
            status: "active",
            startTime: Date.now(),
          },
        ],
      });

      // Simulate module processing time based on learning path speed
      const processingTime = ((nextModule.estimatedDuration || 5) * 1000) / get().learningPathSpeed;

      setTimeout(() => {
        // Check if learning path is still active before continuing
        if (get().learningPathActive) {
          // Process next module if available
          const { currentModuleQueue } = get();
          if (currentModuleQueue.length > 0) {
            get().processModuleQueue();
          } else {
            set({
              processingModule: false,
              learningPathActive: false, // Auto-stop when queue is empty
            });
          }
        } else {
          set({ processingModule: false });
        }
      }, processingTime);
    },

    clearModuleQueue: () => {
      set({
        currentModuleQueue: [],
        processingModule: false,
        learningPathActive: false,
      });
    },

    // Sensor-related actions - inspired by proximity sensor
    updateEngagementSensors: (sensorData) => {
      set({
        engagementSensors: {
          ...get().engagementSensors,
          ...sensorData,
        },
      });

      // Record engagement history
      const { engagementHistory } = get();
      set({
        engagementHistory: [
          ...engagementHistory,
          {
            ...get().engagementSensors,
            timestamp: Date.now(),
          },
        ].slice(-50), // Keep only the last 50 records
      });

      // Check thresholds and trigger interventions if needed
      get().checkEngagementThresholds();
    },

    checkEngagementThresholds: () => {
      const { engagementSensors, sensorThresholds, learningPathActive } = get();

      // Only check thresholds if the learning path is active
      if (!learningPathActive) return;

      // Check if any thresholds are crossed
      if (
        engagementSensors.attentionLevel < sensorThresholds.attention ||
        engagementSensors.interactionFrequency < sensorThresholds.interaction
      ) {
        // Intervention needed - could pause the learning path or adjust speed
        if (engagementSensors.attentionLevel < sensorThresholds.attention / 2) {
          // Severe attention issue - stop the path
          get().stopLearningPath();
        } else {
          // Moderate attention issue - slow down the path
          get().setLearningPathSpeed(0.5);
        }
      } else {
        // Engagement is good, resume normal speed if it was slowed
        if (get().learningPathSpeed < 1.0) {
          get().setLearningPathSpeed(1.0);
        }
      }
    },

    setSensorThresholds: (thresholds) => {
      set({
        sensorThresholds: {
          ...get().sensorThresholds,
          ...thresholds,
        },
      });
    },

    // Analytics and insights
    getEngagementAnalytics: () => {
      const { engagementHistory } = get();

      if (engagementHistory.length === 0) {
        return {
          averageAttention: 0,
          averageInteraction: 0,
          averageTimeOnContent: 0,
          attentionTrend: "stable",
        };
      }

      // Calculate averages
      const averageAttention =
        engagementHistory.reduce((sum, record) => sum + record.attentionLevel, 0) /
        engagementHistory.length;
      const averageInteraction =
        engagementHistory.reduce((sum, record) => sum + record.interactionFrequency, 0) /
        engagementHistory.length;
      const averageTimeOnContent =
        engagementHistory.reduce((sum, record) => sum + record.timeOnContent, 0) /
        engagementHistory.length;

      // Calculate trends (simplified)
      const recentAttention =
        engagementHistory.slice(-5).reduce((sum, record) => sum + record.attentionLevel, 0) / 5;
      let attentionTrend = "stable";

      if (recentAttention > averageAttention * 1.2) {
        attentionTrend = "increasing";
      } else if (recentAttention < averageAttention * 0.8) {
        attentionTrend = "decreasing";
      }

      return {
        averageAttention,
        averageInteraction,
        averageTimeOnContent,
        attentionTrend,
      };
    },

    getLearningPathMetrics: () => {
      const { moduleHistory } = get();

      return {
        totalModulesCompleted: moduleHistory.length,
        averageDuration:
          moduleHistory.reduce((sum, module) => {
            const duration = module.endTime ? module.endTime - module.startTime : 0;
            return sum + duration;
          }, 0) / (moduleHistory.length || 1),
        completionRate:
          moduleHistory.filter((m) => m.status === "completed").length /
          (moduleHistory.length || 1),
      };
    },
  })),
);

// Selectors for optimized re-renders
export const useLearningPathControls = () =>
  useAutomationStore((state) => ({
    learningPathActive: state.learningPathActive,
    learningPathSpeed: state.learningPathSpeed,
    currentModuleQueue: state.currentModuleQueue,
    startLearningPath: state.startLearningPath,
    stopLearningPath: state.stopLearningPath,
    setLearningPathSpeed: state.setLearningPathSpeed,
    addToModuleQueue: state.addToModuleQueue,
    clearModuleQueue: state.clearModuleQueue,
  }));

export const useEngagementSensors = () =>
  useAutomationStore((state) => ({
    engagementSensors: state.engagementSensors,
    sensorThresholds: state.sensorThresholds,
    updateEngagementSensors: state.updateEngagementSensors,
    setSensorThresholds: state.setSensorThresholds,
    checkEngagementThresholds: state.checkEngagementThresholds,
  }));

export const useAutomationAnalytics = () =>
  useAutomationStore((state) => ({
    moduleHistory: state.moduleHistory,
    engagementHistory: state.engagementHistory,
    getEngagementAnalytics: state.getEngagementAnalytics,
    getLearningPathMetrics: state.getLearningPathMetrics,
  }));
