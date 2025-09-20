import React, { createContext, useState, useContext, useEffect } from "react";

// Default accessibility settings based on neurodiversity accommodations
const defaultSettings = {
  // Visual accommodations
  visualMode: "standard", // standard, high-contrast, reduced-colors, dyslexia-friendly
  fontType: "default", // default, open-dyslexic, sans-serif, serif
  fontSize: "medium", // small, medium, large, x-large
  lineSpacing: "normal", // normal, wide, wider
  usePictorialReminders: true,
  useChecklists: true,
  useFlowcharts: true,
  useWrittenInstructions: true,

  // Preparation accommodations
  showAdvanceNotice: true,
  showLessonPreviews: true,

  // Communication accommodations
  preferredCommunicationMode: "mixed", // text, visual, audio, mixed
  extendedProcessingTime: false,
  simplifiedLanguage: false,

  // Work style accommodations
  reduceInterruptions: false,

  // Sensory accommodations
  reduceBrightness: false,
  reduceMotion: false,
  allowAudioControl: true,
  muteBackground: false,

  // Structural & organizational accommodations
  showProgressIndicators: true,
  breakDownTasks: true,
  showOneStepAtATime: false,
  provideTaskChecklists: true,
  provideTimelines: true,
  showFeedbackImmediately: true,
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
    } else {
      document.body.classList.remove("high-contrast");
    }

    // Apply reduced motion
    if (settings.reduceMotion) {
      document.body.classList.add("reduce-motion");
    } else {
      document.body.classList.remove("reduce-motion");
    }

    // Apply dyslexia-friendly mode
    if (settings.visualMode === "dyslexia-friendly") {
      document.body.classList.add("dyslexia-friendly");
    } else {
      document.body.classList.remove("dyslexia-friendly");
    }

    // Apply reduced brightness
    if (settings.reduceBrightness) {
      document.body.classList.add("reduce-brightness");
    } else {
      document.body.classList.remove("reduce-brightness");
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
