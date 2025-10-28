// Portions of this file were generated with the assistance of GitHub Copilot

import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { useAnalytics } from "../analytics";
import { useStore } from "../stores";

// Create the context
const AdaptiveUIContext = createContext();

/**
 * AdaptiveUIProvider - Context provider for adaptive UI functionality
 *
 * This component provides dynamic UI adaptation based on user behavior,
 * learning patterns, and device capabilities. It leverages analytics data
 * to personalize the interface and improve user experience.
 */
export const AdaptiveUIProvider = ({ children }) => {
  // Access analytics data
  const { insights, recommendations, isInitialized: analyticsInitialized } = useAnalytics();

  // Access global state
  const userData = useStore((state) => state.userData);
  const userPreferences = useStore((state) => state.userPreferences);

  // States for adaptive UI features
  const [colorScheme, setColorScheme] = useState("default");
  const [layoutDensity, setLayoutDensity] = useState("medium");
  const [fontSize, setFontSize] = useState("medium");
  const [motionReduced, setMotionReduced] = useState(false);
  const [contrastEnhanced, setContrastEnhanced] = useState(false);
  const [textToSpeechEnabled, setTextToSpeechEnabled] = useState(false);
  const [adaptationsEnabled, setAdaptationsEnabled] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [adaptiveFeatures, setAdaptiveFeatures] = useState({});
  const [deviceCapabilities, setDeviceCapabilities] = useState({});
  const [uiComplexity, setUiComplexity] = useState("medium");
  const [userPatterns, setUserPatterns] = useState({});

  // Effect to detect device capabilities
  useEffect(() => {
    const detectDeviceCapabilities = () => {
      const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 768;
      const isSlowConnection =
        navigator.connection &&
        (navigator.connection.effectiveType === "2g" ||
          navigator.connection.effectiveType === "slow-2g");
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const prefersLightTheme = window.matchMedia("(prefers-color-scheme: light)").matches;
      const prefersDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const prefersHighContrast = window.matchMedia("(prefers-contrast: more)").matches;
      const devicePixelRatio = window.devicePixelRatio || 1;

      setDeviceCapabilities({
        isTouch,
        isSmallScreen,
        isSlowConnection,
        prefersReducedMotion,
        prefersLightTheme,
        prefersDarkTheme,
        prefersHighContrast,
        devicePixelRatio,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        isLandscape: window.innerWidth > window.innerHeight,
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        ),
      });

      // Apply initial adaptations based on device
      if (prefersReducedMotion) {
        setMotionReduced(true);
      }

      if (prefersHighContrast) {
        setContrastEnhanced(true);
      }

      if (isSmallScreen) {
        setLayoutDensity("compact");
        setFontSize("large");
      }

      if (prefersDarkTheme) {
        setColorScheme("dark");
      } else if (prefersLightTheme) {
        setColorScheme("light");
      }
    };

    // Detect capabilities
    detectDeviceCapabilities();

    // Add event listener for window resize to update capabilities
    const handleResize = () => {
      setDeviceCapabilities((prev) => ({
        ...prev,
        isSmallScreen: window.innerWidth < 768,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        isLandscape: window.innerWidth > window.innerHeight,
      }));
    };

    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Effect to load user preferences
  useEffect(() => {
    if (userPreferences) {
      // Apply user's saved preferences
      if (userPreferences.colorScheme) {
        setColorScheme(userPreferences.colorScheme);
      }

      if (userPreferences.layoutDensity) {
        setLayoutDensity(userPreferences.layoutDensity);
      }

      if (userPreferences.fontSize) {
        setFontSize(userPreferences.fontSize);
      }

      if (userPreferences.motionReduced !== undefined) {
        setMotionReduced(userPreferences.motionReduced);
      }

      if (userPreferences.contrastEnhanced !== undefined) {
        setContrastEnhanced(userPreferences.contrastEnhanced);
      }

      if (userPreferences.textToSpeechEnabled !== undefined) {
        setTextToSpeechEnabled(userPreferences.textToSpeechEnabled);
      }

      if (userPreferences.adaptationsEnabled !== undefined) {
        setAdaptationsEnabled(userPreferences.adaptationsEnabled);
      }

      if (userPreferences.uiComplexity) {
        setUiComplexity(userPreferences.uiComplexity);
      }
    }
  }, [userPreferences]);

  // Effect to adapt UI based on analytics insights
  useEffect(() => {
    if (!analyticsInitialized || !adaptationsEnabled || !insights) return;

    try {
      // Extract learning patterns
      const learningStyle = insights.learningStyle || "balanced";
      const engagementScore = insights.engagementScore || 5;
      const strengths = insights.strengths || [];
      const weaknesses = insights.weaknesses || [];
      const preferredContentTypes = insights.preferredContentTypes || {};

      // Update user patterns
      setUserPatterns({
        learningStyle,
        engagementScore,
        strengths,
        weaknesses,
        preferredContentTypes,
        lastActive: insights.lastActive,
        totalTimeSpent: insights.totalTimeSpent,
      });

      // Adapt UI based on learning style
      switch (learningStyle) {
        case "visual":
          // Visual learners prefer more visuals, animations, and diagrams
          setAdaptiveFeatures((prev) => ({
            ...prev,
            emphasizeVisuals: true,
            showDiagrams: true,
            showAnimations: !motionReduced,
            textDensity: "low",
          }));
          break;

        case "auditory":
          // Auditory learners prefer spoken content and discussions
          setAdaptiveFeatures((prev) => ({
            ...prev,
            emphasizeAudio: true,
            showTextTranscripts: true,
            textToSpeechPriority: true,
            discussionFeatures: true,
          }));

          // Enable text-to-speech if not explicitly disabled
          if (textToSpeechEnabled === undefined) {
            setTextToSpeechEnabled(true);
          }
          break;

        case "kinesthetic":
          // Kinesthetic learners prefer interactive elements
          setAdaptiveFeatures((prev) => ({
            ...prev,
            emphasizeInteractivity: true,
            showExercises: true,
            gamificationElements: true,
            practicalExamples: true,
          }));
          break;

        case "social":
          // Social learners prefer collaborative features
          setAdaptiveFeatures((prev) => ({
            ...prev,
            emphasizeCollaboration: true,
            showDiscussions: true,
            peerFeedback: true,
            groupActivities: true,
          }));
          break;

        case "balanced":
        default:
          // Balanced learners get a mix of all features
          setAdaptiveFeatures((prev) => ({
            ...prev,
            balancedPresentation: true,
            mixedContentTypes: true,
          }));
          break;
      }

      // Adapt UI complexity based on engagement
      if (engagementScore < 3) {
        // Low engagement - simplify UI to reduce cognitive load
        setUiComplexity("simple");
      } else if (engagementScore > 7) {
        // High engagement - can handle more complex UI
        setUiComplexity("advanced");
      }

      // Adjust for focus mode based on topic difficulty
      const difficultTopics = weaknesses.length > 2;
      if (difficultTopics) {
        setFocusMode(true);
      }
    } catch (error) {
      console.error("Error adapting UI based on analytics:", error);
      // Fallback to default UI
      resetToDefault();
    }
  }, [insights, adaptationsEnabled, motionReduced, textToSpeechEnabled]);

  // Reset to default settings
  const resetToDefault = useCallback(() => {
    setColorScheme("default");
    setLayoutDensity("medium");
    setFontSize("medium");
    setMotionReduced(false);
    setContrastEnhanced(false);
    setTextToSpeechEnabled(false);
    setFocusMode(false);
    setUiComplexity("medium");
    setAdaptiveFeatures({});
  }, []);

  // Toggle adaptations
  const toggleAdaptations = useCallback(() => {
    setAdaptationsEnabled((prev) => !prev);
  }, []);

  // Update specific setting
  const updateSetting = useCallback((setting, value) => {
    switch (setting) {
      case "colorScheme":
        setColorScheme(value);
        break;
      case "layoutDensity":
        setLayoutDensity(value);
        break;
      case "fontSize":
        setFontSize(value);
        break;
      case "motionReduced":
        setMotionReduced(value);
        break;
      case "contrastEnhanced":
        setContrastEnhanced(value);
        break;
      case "textToSpeechEnabled":
        setTextToSpeechEnabled(value);
        break;
      case "focusMode":
        setFocusMode(value);
        break;
      case "uiComplexity":
        setUiComplexity(value);
        break;
      default:
        console.warn(`Unknown setting: ${setting}`);
    }

    // Update user preferences in global state
    if (useStore.setState) {
      useStore.setState((state) => ({
        userPreferences: {
          ...state.userPreferences,
          [setting]: value,
        },
      }));
    }
  }, []);

  // Get appropriate components based on user's learning style and preferences
  const getAdaptedComponents = useCallback(
    (componentType, options = {}) => {
      // If adaptations are disabled, return default component
      if (!adaptationsEnabled) {
        return { component: "default", props: {} };
      }

      const learningStyle = userPatterns.learningStyle || "balanced";

      // Select component based on type and learning style
      switch (componentType) {
        case "lessonContent":
          if (learningStyle === "visual") {
            return {
              component: "visualLessonContent",
              props: {
                emphasizeImages: true,
                diagramsEnabled: true,
                ...options,
              },
            };
          } else if (learningStyle === "auditory") {
            return {
              component: "auditoryLessonContent",
              props: {
                audioEnabled: true,
                transcriptsVisible: true,
                ...options,
              },
            };
          } else if (learningStyle === "kinesthetic") {
            return {
              component: "interactiveLessonContent",
              props: {
                interactivityLevel: "high",
                exercisesEnabled: true,
                ...options,
              },
            };
          }
          break;

        case "navigation":
          if (uiComplexity === "simple") {
            return {
              component: "simpleNavigation",
              props: {
                simplified: true,
                ...options,
              },
            };
          } else if (uiComplexity === "advanced") {
            return {
              component: "advancedNavigation",
              props: {
                showAllOptions: true,
                ...options,
              },
            };
          }
          break;

        case "assessments":
          if (learningStyle === "visual") {
            return {
              component: "visualAssessment",
              props: {
                imageBasedQuestions: true,
                ...options,
              },
            };
          } else if (learningStyle === "auditory") {
            return {
              component: "auditoryAssessment",
              props: {
                audioQuestions: true,
                ...options,
              },
            };
          } else if (learningStyle === "kinesthetic") {
            return {
              component: "interactiveAssessment",
              props: {
                dragAndDrop: true,
                ...options,
              },
            };
          }
          break;

        // Add more component types as needed
      }

      // Default return if no specific adaptation is available
      return { component: "default", props: options };
    },
    [adaptationsEnabled, userPatterns.learningStyle, uiComplexity],
  );

  // Get CSS classes based on current adaptive settings
  const getAdaptiveClasses = useCallback(
    (baseClass = "") => {
      const classes = [baseClass];

      // Add classes based on settings
      if (colorScheme !== "default") {
        classes.push(`theme-${colorScheme}`);
      }

      if (layoutDensity !== "medium") {
        classes.push(`density-${layoutDensity}`);
      }

      if (fontSize !== "medium") {
        classes.push(`font-size-${fontSize}`);
      }

      if (motionReduced) {
        classes.push("motion-reduced");
      }

      if (contrastEnhanced) {
        classes.push("high-contrast");
      }

      if (focusMode) {
        classes.push("focus-mode");
      }

      if (uiComplexity !== "medium") {
        classes.push(`complexity-${uiComplexity}`);
      }

      return classes.filter(Boolean).join(" ");
    },
    [
      colorScheme,
      layoutDensity,
      fontSize,
      motionReduced,
      contrastEnhanced,
      focusMode,
      uiComplexity,
    ],
  );

  // Context value
  const contextValue = {
    // Settings
    colorScheme,
    layoutDensity,
    fontSize,
    motionReduced,
    contrastEnhanced,
    textToSpeechEnabled,
    adaptationsEnabled,
    focusMode,
    uiComplexity,

    // User data
    userPatterns,
    deviceCapabilities,
    adaptiveFeatures,

    // Functions
    updateSetting,
    resetToDefault,
    toggleAdaptations,
    getAdaptedComponents,
    getAdaptiveClasses,
  };

  return (
    <AdaptiveUIContext.Provider value={contextValue}>
      <div className={getAdaptiveClasses("adaptive-ui-root")}>{children}</div>
    </AdaptiveUIContext.Provider>
  );
};

// Custom hook for using adaptive UI
export const useAdaptiveUI = () => {
  const context = useContext(AdaptiveUIContext);
  if (!context) {
    throw new Error("useAdaptiveUI must be used within an AdaptiveUIProvider");
  }
  return context;
};

export default AdaptiveUIContext;
