/**
 * Windgap Academy Professional Learner Dashboard
 *
 * Features:
 * - Comprehensive learning analytics and progress tracking
 * - Interactive 3D learning environment
 * - Personalized content recommendations
 * - Real-time performance metrics
 * - Achievement system and gamification
 * - Social learning features
 * - Adaptive difficulty adjustment
 * - Multi-modal learning support
 */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Suspense } from "react";

// Import professional components
import LearnerDashboardUI from "../../components/ui/LearnerDashboard";
import { ErrorBoundary } from "../components/ErrorBoundary";
import LoadingScreen from "../components/LoadingScreen";

// Import utilities and hooks
import { useAuth } from "../hooks/useAuth";
import { useAnalytics } from "../hooks/useAnalytics";
import { useNotifications } from "../hooks/useNotifications";
import { useLearningProgress } from "../hooks/useLearningProgress";
import { useGameState } from "../hooks/useGameState";
import monitoring from "../utils/monitoring";

// Import AI and sound systems
// AI Engine removed for simplified build
import { SoundManager } from "../audio/SoundManager";

const LearnerDashboard = () => {
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardMode, setDashboardMode] = useState("overview"); // overview, learning, games, progress, social
  const [selectedModule, setSelectedModule] = useState(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const [learningEnvironment, setLearningEnvironment] = useState("default");
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState([]);

  // Custom hooks
  const { user, isAuthenticated } = useAuth();
  const { trackEvent, getAnalytics } = useAnalytics();
  const { notifications, markAsRead } = useNotifications();
  const { progress, updateProgress, getRecommendations } = useLearningProgress();
  const { gameStates, achievements, updateGameState } = useGameState();

  // AI and sound instances
  const [aiEngine] = useState(() => new AIEngine());
  const [soundManager] = useState(() => new SoundManager());

  // Initialize dashboard
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setIsLoading(true);

        // Initialize AI engine
        await aiEngine.initialize();

        // Initialize sound system
        await soundManager.initialize();

        // Load user progress and analytics
        await Promise.all([
          loadUserProgress(),
          loadPersonalizedContent(),
          loadAchievements(),
          loadNotifications(),
        ]);

        // Track dashboard visit
        trackEvent("dashboard_visit", {
          userId: user?.id,
          timestamp: Date.now(),
          mode: dashboardMode,
        });

        // Start performance monitoring
        monitoring.monitorPerformance();

        setIsLoading(false);
      } catch (error) {
        console.error("Dashboard initialization failed:", error);
        monitoring.logError("Dashboard initialization error:", error);
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      initializeDashboard();
    }
  }, [isAuthenticated, user?.id, dashboardMode, trackEvent]);

  // Load user progress
  const loadUserProgress = useCallback(async () => {
    try {
      const progressData = await getAnalytics(user?.id);
      // Process and update progress state
      console.log("Progress loaded:", progressData);
    } catch (error) {
      console.error("Failed to load progress:", error);
    }
  }, [user?.id, getAnalytics]);

  // Load personalized content recommendations
  const loadPersonalizedContent = useCallback(async () => {
    try {
      const recommendations = await getRecommendations(user?.id);
      setPersonalizedRecommendations(recommendations);
    } catch (error) {
      console.error("Failed to load recommendations:", error);
    }
  }, [user?.id, getRecommendations]);

  // Load achievements
  const loadAchievements = useCallback(async () => {
    try {
      // Load user achievements from game state
      console.log("Achievements loaded:", achievements);
    } catch (error) {
      console.error("Failed to load achievements:", error);
    }
  }, [achievements]);

  // Load notifications
  const loadNotifications = useCallback(async () => {
    try {
      // Notifications are loaded via the hook
      console.log("Notifications loaded:", notifications);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  }, [notifications]);

  // Handle module selection
  const handleModuleSelect = useCallback(
    (module) => {
      setSelectedModule(module);
      setDashboardMode("learning");

      trackEvent("module_selected", {
        moduleId: module.id,
        moduleName: module.name,
        userId: user?.id,
        timestamp: Date.now(),
      });

      // Play selection sound
      soundManager.playSound("ui_select");
    },
    [trackEvent, user?.id, soundManager],
  );

  // Handle achievement unlock
  const handleAchievementUnlock = useCallback(
    (achievement) => {
      setShowAchievements(true);

      trackEvent("achievement_unlocked", {
        achievementId: achievement.id,
        achievementName: achievement.name,
        userId: user?.id,
        timestamp: Date.now(),
      });

      // Play achievement sound
      soundManager.playSound("achievement_unlock");

      // Show achievement notification
      setTimeout(() => setShowAchievements(false), 5000);
    },
    [trackEvent, user?.id, soundManager],
  );

  // Memoized dashboard content
  const dashboardContent = useMemo(() => {
    switch (dashboardMode) {
      case "overview":
        return (
          <DashboardOverview
            user={user}
            progress={progress}
            recommendations={personalizedRecommendations}
            achievements={achievements}
            onModuleSelect={handleModuleSelect}
            onModeChange={setDashboardMode}
          />
        );
      case "learning":
        return (
          <LearningEnvironment
            selectedModule={selectedModule}
            environment={learningEnvironment}
            onEnvironmentChange={setLearningEnvironment}
            onProgressUpdate={updateProgress}
            aiEngine={aiEngine}
            soundManager={soundManager}
          />
        );
      case "games":
        return (
          <GamesSection
            gameStates={gameStates}
            onGameStateUpdate={updateGameState}
            onAchievementUnlock={handleAchievementUnlock}
            soundManager={soundManager}
          />
        );
      case "progress":
        return <ProgressAnalytics progress={progress} analytics={getAnalytics} user={user} />;
      case "social":
        return (
          <SocialLearning user={user} achievements={achievements} onInteraction={trackEvent} />
        );
      default:
        return <DashboardOverview />;
    }
  }, [
    dashboardMode,
    user,
    progress,
    personalizedRecommendations,
    achievements,
    selectedModule,
    learningEnvironment,
    gameStates,
    handleModuleSelect,
    updateProgress,
    updateGameState,
    handleAchievementUnlock,
    aiEngine,
    soundManager,
    getAnalytics,
    trackEvent,
  ]);

  // Loading state
  if (isLoading) {
    return (
      <LoadingScreen
        message="Initializing your learning environment..."
        progress={75}
        tips={[
          "Your personalized content is being prepared",
          "AI tutoring system is starting up",
          "Loading your progress and achievements",
        ]}
      />
    );
  }

  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Windgap Academy</h1>
          <p className="text-lg text-gray-600 mb-8">
            Please sign in to access your learning dashboard
          </p>
          <button className="btn btn-primary">Sign In</button>
        </div>
      </motion.div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Professional Navigation Header */}
        <DashboardHeader
          user={user}
          currentMode={dashboardMode}
          onModeChange={setDashboardMode}
          notifications={notifications}
          onNotificationRead={markAsRead}
        />

        {/* Main Dashboard Content */}
        <main className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={dashboardMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {dashboardContent}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Achievement Notification */}
        <AnimatePresence>
          {showAchievements && (
            <AchievementNotification onClose={() => setShowAchievements(false)} />
          )}
        </AnimatePresence>

        {/* 3D Background Environment */}
        <div className="fixed inset-0 -z-10 opacity-20">
          <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
            <Suspense fallback={null}>
              <Environment preset="sunset" />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.5}
              />

              <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
                <Text3D font="/fonts/Inter_Bold.json" size={1} height={0.1} position={[-3, 2, 0]}>
                  Learn
                  <meshStandardMaterial color="#14b8a6" />
                </Text3D>
              </Float>

              <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.7}>
                <Text3D font="/fonts/Inter_Bold.json" size={0.8} height={0.1} position={[2, -1, 0]}>
                  Grow
                  <meshStandardMaterial color="#f59e0b" />
                </Text3D>
              </Float>

              <Float speed={0.8} rotationIntensity={0.7} floatIntensity={0.3}>
                <Text3D
                  font="/fonts/Inter_Bold.json"
                  size={0.6}
                  height={0.1}
                  position={[-1, -2, 0]}
                >
                  Achieve
                  <meshStandardMaterial color="#ef4444" />
                </Text3D>
              </Float>
            </Suspense>
          </Canvas>
        </div>

        {/* Legacy Dashboard Component (for backward compatibility) */}
        <div className="sr-only">
          <LearnerDashboardUI />
        </div>
      </div>
    </ErrorBoundary>
  );
};

// Dashboard Header Component
const DashboardHeader = ({
  user,
  currentMode,
  onModeChange,
  notifications,
  onNotificationRead,
}) => (
  <header className="bg-white shadow-soft border-b border-gray-200">
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={user?.avatar || "/images/default-avatar.png"}
            alt={user?.name || "User"}
            className="w-10 h-10 rounded-full border-2 border-primary-500"
          />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Welcome back, {user?.name || "Learner"}!
            </h1>
            <p className="text-sm text-gray-600">Ready to continue your learning journey?</p>
          </div>
        </div>

        <nav className="flex items-center space-x-2">
          {["overview", "learning", "games", "progress", "social"].map((mode) => (
            <button
              key={mode}
              onClick={() => onModeChange(mode)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentMode === mode
                  ? "bg-primary-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </nav>
      </div>
    </div>
  </header>
);

// Placeholder components (would be implemented separately)
const DashboardOverview = ({
  user,
  progress,
  recommendations,
  achievements,
  onModuleSelect,
  onModeChange,
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="lg:col-span-2">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Learning Overview</h2>
      {/* Overview content */}
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      {/* Quick actions */}
    </div>
  </div>
);

const LearningEnvironment = ({
  selectedModule,
  environment,
  onEnvironmentChange,
  onProgressUpdate,
  aiEngine,
  soundManager,
}) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">Learning Environment</h2>
    {/* Learning environment content */}
  </div>
);

const GamesSection = ({ gameStates, onGameStateUpdate, onAchievementUnlock, soundManager }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">Educational Games</h2>
    {/* Games content */}
  </div>
);

const ProgressAnalytics = ({ progress, analytics, user }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">Progress Analytics</h2>
    {/* Analytics content */}
  </div>
);

const SocialLearning = ({ user, achievements, onInteraction }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">Social Learning</h2>
    {/* Social content */}
  </div>
);

const AchievementNotification = ({ onClose }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-6 border border-yellow-200 z-50"
  >
    <div className="flex items-center space-x-3">
      <div className="text-2xl">🏆</div>
      <div>
        <h3 className="font-semibold text-gray-900">Achievement Unlocked!</h3>
        <p className="text-sm text-gray-600">You've earned a new badge</p>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
        ×
      </button>
    </div>
  </motion.div>
);

export default LearnerDashboard;
