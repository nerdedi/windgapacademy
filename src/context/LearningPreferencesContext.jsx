import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { useAuth } from "../contexts/AuthContext";

// Default learning preferences
const defaultPreferences = {
  // Learning style strengths (1-5 scale)
  learningStyles: {
    visual: 3,
    auditory: 3,
    kinesthetic: 3,
    readingWriting: 3,
  },

  // Interest areas (can be customized by the user)
  interestAreas: [],

  // Content delivery preferences
  contentDelivery: {
    preferGameBasedLearning: false,
    preferInteractiveLearning: true,
    preferVideoLearning: true,
    preferTextLearning: true,
    preferAudioLearning: false,
    preferSocialLearning: false,
  },

  // Learning pace preferences
  pacePreferences: {
    selfPaced: true,
    extendedTime: false,
    reviewFrequency: "moderate", // low, moderate, high
    repetitionNeeded: "moderate", // low, moderate, high
  },

  // Executive function supports
  executiveFunction: {
    needsTaskBreakdown: true,
    needsTimeManagement: true,
    needsOrganizationalSupport: true,
    needsStarterTemplates: true,
    needsVisualSchedules: true,
  },

  // Engagement patterns
  engagementPatterns: {
    attentionSpan: "moderate", // short, moderate, long
    preferredSessionDuration: 30, // minutes
    breakFrequency: "moderate", // low, moderate, high
    preferredRewardType: "achievement", // achievement, points, badges, social
  },

  // Special interest integration
  specialInterests: [],

  // Previous learning successes
  successfulStrategies: [],

  // Motivational preferences
  motivationPreferences: {
    intrinsicMotivation: "moderate", // low, moderate, high
    respondsToExternalRewards: true,
    respondsToSocialIncentives: false,
    respondsToProgressTracking: true,
    respondsToCompetition: false,
    respondsToCollaboration: false,
  },

  // Previous content engagement history (to be populated automatically)
  contentEngagementHistory: {
    completedLessons: [],
    abandonedLessons: [],
    revisitedLessons: [],
    highEngagementTopics: [],
    lowEngagementTopics: [],
    averageSessionDuration: 0,
  },
};

// Create the context
const LearningPreferencesContext = createContext();

// Provider component
export const LearningPreferencesProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);

  // Load preferences from Firestore if user is logged in
  useEffect(() => {
    const loadPreferences = async () => {
      if (!currentUser) {
        // Use localStorage if not logged in
        const savedPreferences = localStorage.getItem("windgap_learning_preferences");
        if (savedPreferences) {
          setPreferences(JSON.parse(savedPreferences));

          // Check if profile is complete
          const parsedPrefs = JSON.parse(savedPreferences);
          checkProfileCompleteness(parsedPrefs);
        }
        setIsLoading(false);
        return;
      }

      try {
        const db = getFirestore();
        const userPrefsRef = doc(db, "userPreferences", currentUser.uid);
        const userPrefsSnapshot = await getDoc(userPrefsRef);

        if (userPrefsSnapshot.exists()) {
          const userPrefs = userPrefsSnapshot.data();
          setPreferences(userPrefs.learningPreferences || defaultPreferences);

          // Check if profile is complete
          checkProfileCompleteness(userPrefs.learningPreferences || defaultPreferences);
        } else {
          // New user, save default preferences
          await setDoc(userPrefsRef, {
            learningPreferences: defaultPreferences,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      } catch (error) {
        console.error("Error loading learning preferences:", error);
      }

      setIsLoading(false);
    };

    loadPreferences();
  }, [currentUser]);

  // Save preferences whenever they change
  useEffect(() => {
    if (isLoading) return; // Don&apos;t save during initial load

    // Check if profile is complete
    checkProfileCompleteness(preferences);

    // Save to localStorage for all users
    localStorage.setItem("windgap_learning_preferences", JSON.stringify(preferences));

    // Also save to Firestore if logged in
    const saveToFirestore = async () => {
      if (!currentUser) return;

      try {
        const db = getFirestore();
        const userPrefsRef = doc(db, "userPreferences", currentUser.uid);
        await setDoc(
          userPrefsRef,
          {
            learningPreferences: preferences,
            updatedAt: new Date(),
          },
          { merge: true },
        );
      } catch (error) {
        console.error("Error saving learning preferences:", error);
      }
    };

    saveToFirestore();
  }, [preferences, currentUser, isLoading]);

  // Check if the learning profile is complete enough to provide personalized learning
  const checkProfileCompleteness = (prefs) => {
    const hasInterests = prefs.interestAreas.length > 0 || prefs.specialInterests.length > 0;
    const hasLearningStylePreferences = Object.values(prefs.learningStyles).some(
      (val) => val !== 3,
    );
    const hasContentDeliveryPreferences = Object.values(prefs.contentDelivery).some(
      (val) => val === true,
    );

    setProfileComplete(
      hasInterests && (hasLearningStylePreferences || hasContentDeliveryPreferences),
    );
  };

  // Update a specific preference
  const updatePreference = useCallback((path, value) => {
    setPreferences((prev) => {
      // Handle nested path like 'learningStyles.visual'
      if (path.includes(".")) {
        const [category, key] = path.split(".");
        return {
          ...prev,
          [category]: {
            ...prev[category],
            [key]: value,
          },
        };
      }

      // Handle direct properties
      return {
        ...prev,
        [path]: value,
      };
    });
  }, []);

  // Add an interest area
  const addInterestArea = useCallback((interest) => {
    setPreferences((prev) => ({
      ...prev,
      interestAreas: [...prev.interestAreas, interest],
    }));
  }, []);

  // Remove an interest area
  const removeInterestArea = useCallback((interest) => {
    setPreferences((prev) => ({
      ...prev,
      interestAreas: prev.interestAreas.filter((item) => item !== interest),
    }));
  }, []);

  // Add a special interest
  const addSpecialInterest = useCallback((interest) => {
    setPreferences((prev) => ({
      ...prev,
      specialInterests: [...prev.specialInterests, interest],
    }));
  }, []);

  // Remove a special interest
  const removeSpecialInterest = useCallback((interest) => {
    setPreferences((prev) => ({
      ...prev,
      specialInterests: prev.specialInterests.filter((item) => item !== interest),
    }));
  }, []);

  // Add a successful learning strategy
  const addSuccessfulStrategy = useCallback((strategy) => {
    setPreferences((prev) => ({
      ...prev,
      successfulStrategies: [...prev.successfulStrategies, strategy],
    }));
  }, []);

  // Record lesson completion
  const recordLessonCompletion = useCallback((lessonId, engagementMetrics) => {
    setPreferences((prev) => ({
      ...prev,
      contentEngagementHistory: {
        ...prev.contentEngagementHistory,
        completedLessons: [
          ...prev.contentEngagementHistory.completedLessons,
          {
            lessonId,
            completedAt: new Date(),
            engagementMetrics,
          },
        ],
      },
    }));
  }, []);

  // Reset to default preferences
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  return (
    <LearningPreferencesContext.Provider
      value={{
        preferences,
        isLoading,
        profileComplete,
        updatePreference,
        addInterestArea,
        removeInterestArea,
        addSpecialInterest,
        removeSpecialInterest,
        addSuccessfulStrategy,
        recordLessonCompletion,
        resetPreferences,
      }}
    >
      {children}
    </LearningPreferencesContext.Provider>
  );
};

// Custom hook for using the learning preferences context
export const useLearningPreferences = () => {
  const context = useContext(LearningPreferencesContext);
  if (!context) {
    throw new Error("useLearningPreferences must be used within a LearningPreferencesProvider");
  }
  return context;
};
