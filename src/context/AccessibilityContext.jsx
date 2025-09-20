import React, { createContext, useState, useContext, useEffect } from "react";

// Default accessibility settings based on neurodiversity accommodations
const defaultSettings = {
  // Visual accommodations
  visualMode: "standard", // standard, high-contrast, reduced-colors, dyslexia-friendly, autism-friendly
  fontType: "default", // default, open-dyslexic, sans-serif, serif
  fontSize: "medium", // small, medium, large, x-large
  lineSpacing: "normal", // normal, wide, wider
  usePictorialReminders: true,
  useChecklists: true,
  useFlowcharts: true,
  useWrittenInstructions: true,
  textAlignment: "left", // left, justified, centered
  paragraphSpacing: "normal", // normal, increased, maximum
  highlightImportantInfo: false,
  colorCodeCategories: false,

  // Preparation accommodations
  showAdvanceNotice: true,
  showLessonPreviews: true,
  previewAllContentFirst: false,
  showEstimatedDuration: true,
  provideClearStructure: true,

  // Communication accommodations
  preferredCommunicationMode: "mixed", // text, visual, audio, mixed
  extendedProcessingTime: false,
  simplifiedLanguage: false,
  symbolSupport: false, // Uses symbols/icons alongside text
  narrationSpeed: "normal", // slow, normal, fast

  // Work style accommodations
  reduceInterruptions: false,
  allowHyperfocusMode: false, // Removes distractions completely
  provideTimers: true, // Optional timers for task completion
  allowFlexibleDeadlines: true,

  // Sensory accommodations
  reduceBrightness: false,
  reduceMotion: false,
  allowAudioControl: true,
  muteBackground: false,
  reduceVisualClutter: false,
  provideStimBreaks: false, // Provides scheduled breaks for stimming/self-regulation

  // Structural & organizational accommodations
  showProgressIndicators: true,
  breakDownTasks: true,
  showOneStepAtATime: false,
  provideTaskChecklists: true,
  provideTimelines: true,
  showFeedbackImmediately: true,

  // Interest-based learning accommodations
  allowInterestConnections: true, // Connect learning to special interests
  gamifyContent: false, // Apply game mechanics to learning
  showRealWorldApplications: true, // Show how content applies to real world
  allowPersonalization: true, // Personalize examples to interests

  // Executive function support
  showTimeEstimates: true,
  provideMemorySupports: true, // Working memory supports
  offerChoices: true, // Provide choices rather than open-ended tasks
  includeTemplates: true, // Provide templates/models for work
  useVisualSchedules: true,

  // Engagement & motivation
  provideImmediateFeedback: true,
  celebrateSmallWins: true,
  useSpecialInterests: true, // Leverage special interests in examples
  allowAlternateInputMethods: false, // Voice, drawing, etc. instead of typing

  // Learning modes preferences
  primaryLearningMode: "mixed", // visual, auditory, kinesthetic, reading/writing, mixed
  visualLearningStrength: 3, // 1-5 scale
  auditoryLearningStrength: 3, // 1-5 scale
  kinestheticLearningStrength: 3, // 1-5 scale
  readingWritingStrength: 3, // 1-5 scale
};

// Create the context
const AccessibilityContext = createContext();

// Provider component
export const AccessibilityProvider = ({ children }) => {
  // Get settings from localStorage or use defaults
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem("windgap_accessibility");
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("windgap_accessibility", JSON.stringify(settings));

    // Apply global CSS variables based on settings
    document.documentElement.style.setProperty(
      "--font-size-base",
      settings.fontSize === "small"
        ? "0.875rem"
        : settings.fontSize === "medium"
          ? "1rem"
          : settings.fontSize === "large"
            ? "1.125rem"
            : "1.25rem",
    );

    document.documentElement.style.setProperty(
      "--line-height-base",
      settings.lineSpacing === "normal" ? "1.5" : settings.lineSpacing === "wide" ? "1.8" : "2",
    );

    // Apply paragraph spacing
    document.documentElement.style.setProperty(
      "--paragraph-spacing",
      settings.paragraphSpacing === "normal"
        ? "1rem"
        : settings.paragraphSpacing === "increased"
          ? "1.5rem"
          : "2rem",
    );

    // Apply font family
    document.documentElement.style.setProperty(
      "--font-family-base",
      settings.fontType === "default"
        ? "var(--font-family-default)"
        : settings.fontType === "open-dyslexic"
          ? "'OpenDyslexic', sans-serif"
          : settings.fontType === "sans-serif"
            ? "Arial, Helvetica, sans-serif"
            : "'Times New Roman', Times, serif",
    );

    // Apply contrast mode
    if (settings.visualMode === "high-contrast") {
      document.body.classList.add("high-contrast");
      document.body.classList.remove("reduced-colors", "dyslexia-friendly", "autism-friendly");
    } else if (settings.visualMode === "reduced-colors") {
      document.body.classList.add("reduced-colors");
      document.body.classList.remove("high-contrast", "dyslexia-friendly", "autism-friendly");
    } else if (settings.visualMode === "dyslexia-friendly") {
      document.body.classList.add("dyslexia-friendly");
      document.body.classList.remove("high-contrast", "reduced-colors", "autism-friendly");
    } else if (settings.visualMode === "autism-friendly") {
      document.body.classList.add("autism-friendly");
      document.body.classList.remove("high-contrast", "reduced-colors", "dyslexia-friendly");
    } else {
      document.body.classList.remove(
        "high-contrast",
        "reduced-colors",
        "dyslexia-friendly",
        "autism-friendly",
      );
    }

    // Apply reduced motion
    if (settings.reduceMotion) {
      document.body.classList.add("reduce-motion");
    } else {
      document.body.classList.remove("reduce-motion");
    }

    // Apply reduced brightness
    if (settings.reduceBrightness) {
      document.body.classList.add("reduce-brightness");
    } else {
      document.body.classList.remove("reduce-brightness");
    }

    // Apply reduced visual clutter
    if (settings.reduceVisualClutter) {
      document.body.classList.add("reduce-visual-clutter");
    } else {
      document.body.classList.remove("reduce-visual-clutter");
    }

    // Apply hyperfocus mode
    if (settings.allowHyperfocusMode) {
      document.body.classList.add("hyperfocus-mode");
    } else {
      document.body.classList.remove("hyperfocus-mode");
    }

    // Apply text alignment
    document.documentElement.style.setProperty("--text-align", settings.textAlignment);

    // Apply color coding for categories
    if (settings.colorCodeCategories) {
      document.body.classList.add("color-code-categories");
    } else {
      document.body.classList.remove("color-code-categories");
    }

    // Apply highlight important info
    if (settings.highlightImportantInfo) {
      document.body.classList.add("highlight-important");
    } else {
      document.body.classList.remove("highlight-important");
    }
  }, [settings]);

  // Update a single setting
  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Reset to default settings
  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Custom hook for using the accessibility context
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
};
