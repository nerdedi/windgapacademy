import { doc, getDoc } from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";

import { useAuth } from "../context/AuthContext";
import { firestore } from "../firebase";

import EnhancedUnityPlayer from "../unity-integration/EnhancedUnityPlayer";
import ProgressService from "../utils/ProgressService";
import WebGLOptimizer from "../utils/WebGLOptimizer";
import ErrorAlert from "./ui/ErrorAlert";
import LoadingSpinner from "./ui/LoadingSpinner";

import "./UnityEducationalExperience.css";

/**
 * UnityEducationalExperience component that integrates Unity WebGL educational
 * experiences with authentication, curriculum content, and progress tracking
 *
 * @param {Object} props Component props
 * @param {string} props.experienceId ID of the Unity educational experience to load
 * @param {string} props.lessonId ID of the current lesson (optional)
 * @param {string} props.moduleId ID of the current module (optional)
 * @param {Function} props.onProgressUpdate Callback when progress updates (optional)
 * @param {Function} props.onCompletion Callback when experience is completed (optional)
 * @param {number} props.width Width of the Unity container (default: 960)
 * @param {number} props.height Height of the Unity container (default: 600)
 */
const UnityEducationalExperience = ({
  experienceId,
  lessonId,
  moduleId,
  onProgressUpdate,
  onCompletion,
  width = 960,
  height = 600,
}) => {
  // Reference to track the Unity container for performance optimizations
  const unityContainerRef = useRef(null);
  // Get current authenticated user
  const { currentUser } = useAuth();

  // Component state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unityReady, setUnityReady] = useState(false);
  const [experienceData, setExperienceData] = useState(null);
  const [curriculumContent, setCurriculumContent] = useState(null);
  const [userProgress, setUserProgress] = useState(null);

  // Cleanup Unity resources when component unmounts
  useEffect(() => {
    // Store container ref for cleanup to avoid closure issues
    const containerRef = unityContainerRef.current;

    return () => {
      // Find any Unity instances in our container and clean them up
      if (containerRef) {
        const canvas = containerRef.querySelector("canvas");
        if (canvas && canvas.parentNode?.__unityInstance) {
          const unityInstance = canvas.parentNode.__unityInstance;
          // Clean up WebGL resources
          WebGLOptimizer.cleanupResources(unityInstance);
        }
      }
      console.log("Unity educational experience unmounted and resources cleaned up");
    };
  }, []);

  // Build the Unity WebGL URLs based on the experience ID
  const buildUrl = `/unity-builds/${experienceId}`;

  // Fetch the experience data from Firestore
  useEffect(() => {
    const fetchExperienceData = async () => {
      if (!experienceId) {
        setError("No experience ID provided");
        setLoading(false);
        return;
      }

      try {
        const experienceRef = doc(firestore, "unity_experiences", experienceId);
        const experienceDoc = await getDoc(experienceRef);

        if (!experienceDoc.exists()) {
          setError(`Experience ${experienceId} not found`);
          setLoading(false);
          return;
        }

        setExperienceData(experienceDoc.data());

        // Fetch associated curriculum content if lessonId or moduleId provided
        if (lessonId || moduleId) {
          await fetchCurriculumContent();
        }

        // Fetch user progress if user is authenticated
        if (currentUser) {
          await fetchUserProgress();
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching Unity experience data:", err);
        setError("Failed to load Unity experience data. Please try again.");
        setLoading(false);
      }
    };

    fetchExperienceData();
  }, [experienceId, lessonId, moduleId, currentUser]);

  // Fetch curriculum content (lesson/module data)
  const fetchCurriculumContent = async () => {
    try {
      let contentRef;

      if (lessonId) {
        contentRef = doc(firestore, "lessons", lessonId);
      } else if (moduleId) {
        contentRef = doc(firestore, "modules", moduleId);
      } else {
        return;
      }

      const contentDoc = await getDoc(contentRef);

      if (!contentDoc.exists()) {
        console.warn("Curriculum content not found");
        return;
      }

      setCurriculumContent(contentDoc.data());
    } catch (err) {
      console.error("Error fetching curriculum content:", err);
    }
  };

  // Fetch user progress for this experience
  const fetchUserProgress = async () => {
    if (!currentUser) return;

    try {
      // Use ProgressService to get or initialize progress
      const progressData = await ProgressService.getProgress(currentUser.uid, experienceId);

      if (progressData) {
        setUserProgress(progressData);
      } else {
        // Initialize new progress
        const initializedProgress = await ProgressService.initializeProgress(
          currentUser.uid,
          experienceId,
          lessonId,
          moduleId,
        );

        setUserProgress(initializedProgress);
      }
    } catch (err) {
      console.error("Error fetching user progress:", err);
    }
  };

  // Handle when Unity player is fully loaded and ready
  const handleUnityLoaded = useCallback((unityInstance) => {
    setUnityReady(true);
    setLoading(false);

    // Apply WebGL optimizations once Unity is loaded
    if (unityInstance) {
      try {
        // Apply memory usage optimizations
        const isMobile = WebGLOptimizer.isMobileDevice();
        WebGLOptimizer.optimizeMemoryUsage(unityInstance, {
          maxMemory: isMobile ? 268435456 : 536870912, // 256MB for mobile, 512MB for desktop
        });

        // Apply runtime optimizations
        WebGLOptimizer.applyRuntimeOptimizations(unityInstance, {
          throttleOnHidden: true,
          backgroundFPS: 10,
          optimizeForMobile: isMobile,
          reduceMobileTextureQuality: isMobile,
        });

        console.log("WebGL optimizations applied successfully");
      } catch (err) {
        console.warn("Could not apply WebGL optimizations:", err);
      }

      // Send initial data to Unity
      sendUserDataToUnity(unityInstance);
      sendCurriculumDataToUnity(unityInstance);
      sendProgressDataToUnity(unityInstance);
    }
  }, []); // Send user data to Unity
  const sendUserDataToUnity = () => {
    if (!unityReady || !currentUser) return;

    // Prepare user data for Unity (only send what's needed)
    const userData = {
      userId: currentUser.uid,
      displayName: currentUser.displayName || "Student",
      email: currentUser.email,
      photoURL: currentUser.photoURL || null,
      isAuthenticated: true,
    };

    // Send to Unity using the Unity instance
    const unityInstance = document.querySelector("canvas")?.parentNode?.__unityInstance;
    if (unityInstance) {
      unityInstance.SendMessage(
        "WindgapAcademyManager", // GameObject name
        "SetUserData", // Method name
        JSON.stringify(userData), // Data as JSON string
      );
    }
  };

  // Send curriculum content to Unity
  const sendCurriculumDataToUnity = () => {
    if (!unityReady || !curriculumContent) return;

    // Format the curriculum data for Unity
    const moduleData = {
      id: moduleId || lessonId,
      title: curriculumContent.title || "Untitled Module",
      description: curriculumContent.description || "",
      stations: curriculumContent.stations || curriculumContent.activities || [],
    };

    // Send to Unity
    const unityInstance = document.querySelector("canvas")?.parentNode?.__unityInstance;
    if (unityInstance) {
      unityInstance.SendMessage("WindgapAcademyManager", "LoadModule", JSON.stringify(moduleData));
    }
  };

  // Send progress data to Unity
  const sendProgressDataToUnity = () => {
    if (!unityReady || !userProgress) return;

    const unityInstance = document.querySelector("canvas")?.parentNode?.__unityInstance;
    if (unityInstance) {
      unityInstance.SendMessage(
        "WindgapAcademyManager",
        "LoadProgress",
        JSON.stringify(userProgress),
      );
    }
  };

  // Handle messages from Unity
  const handleUnityMessage = useCallback(
    (actionType, data) => {
      switch (actionType) {
        case "PROGRESS_UPDATE":
          handleProgressUpdate(data);
          break;
        case "STATION_COMPLETED":
          handleStationCompleted(data);
          break;
        case "MODULE_COMPLETED":
          handleModuleCompleted(data);
          break;
        case "ERROR":
          console.error("Unity error:", data);
          break;
        default:
          console.log("Unity message:", actionType, data);
      }
    },
    [onProgressUpdate, onCompletion],
  );

  // Handle progress updates from Unity
  const handleProgressUpdate = useCallback(
    (data) => {
      if (!currentUser) return;

      // Update local state
      setUserProgress((prev) => ({
        ...prev,
        progress: data.progress,
        lastUpdated: new Date(),
      }));

      // Update progress in Firestore using ProgressService
      ProgressService.updateProgress(currentUser.uid, experienceId, {
        progress: data.progress,
      });

      // Call the onProgressUpdate callback if provided
      if (onProgressUpdate) {
        onProgressUpdate(data.progress);
      }
    },
    [currentUser, experienceId, onProgressUpdate],
  );

  // Handle station completion
  const handleStationCompleted = useCallback(
    (data) => {
      if (!currentUser || !userProgress) return;

      // Update local state
      setUserProgress((prev) => {
        const completedStations = [...(prev.completedStations || [])];
        if (!completedStations.includes(data.stationId)) {
          completedStations.push(data.stationId);
        }

        return {
          ...prev,
          completedStations,
          lastUpdated: new Date(),
        };
      });

      // Use ProgressService to complete station
      ProgressService.completeStation(currentUser.uid, experienceId, data.stationId, {
        score: data.score,
        timeSpent: data.timeSpent,
      });
    },
    [currentUser, userProgress, experienceId],
  );

  // Handle module completion
  const handleModuleCompleted = useCallback(
    (data) => {
      if (!currentUser) return;

      // Use ProgressService to complete experience
      ProgressService.completeExperience(currentUser.uid, experienceId);

      // Update local state
      setUserProgress((prev) => ({
        ...prev,
        progress: 1,
        completed: true,
        completedAt: new Date(),
      }));

      // Call the onCompletion callback if provided
      if (onCompletion) {
        onCompletion({
          experienceId,
          lessonId,
          moduleId,
          completedAt: new Date(),
        });
      }
    },
    [currentUser, experienceId, lessonId, moduleId, onCompletion],
  );

  // Track time spent in the experience (called periodically)
  const trackTimeSpent = useCallback(
    (minutes) => {
      if (!currentUser || !experienceId) return;

      // Use ProgressService to track time
      ProgressService.trackTimeSpent(currentUser.uid, experienceId, minutes);
    },
    [currentUser, experienceId],
  );

  // Render loading state
  if (loading) {
    return (
      <div className="unity-loading-container" style={{ width, height }}>
        <LoadingSpinner />
        <p>Loading educational experience...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="unity-error-container" style={{ width, height }}>
        <ErrorAlert message={error} />
        <p>Please try refreshing the page or contact support.</p>
      </div>
    );
  }

  // Render Unity player
  return (
    <div className="unity-educational-experience" ref={unityContainerRef}>
      <div className="unity-container">
        <EnhancedUnityPlayer
          buildUrl={buildUrl}
          width={width}
          height={height}
          onUnityLoaded={handleUnityLoaded}
          onUnityMessage={handleUnityMessage}
          onScoreUpdate={handleProgressUpdate}
          onLevelComplete={handleModuleCompleted}
          initialState={{
            userId: currentUser?.uid,
            lessonId,
            moduleId,
            progress: userProgress?.progress || 0,
            deviceType: WebGLOptimizer.isMobileDevice() ? "mobile" : "desktop",
          }}
        />
      </div>

      {unityReady && (
        <div className="unity-controls">
          <div className="unity-progress">
            <label>Progress: </label>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(userProgress?.progress || 0) * 100}%` }}
              />
            </div>
            <span>{Math.round((userProgress?.progress || 0) * 100)}%</span>
          </div>

          <div className="unity-performance-info">
            <span className="performance-note">
              {WebGLOptimizer.isMobileDevice()
                ? "Mobile optimizations applied"
                : "Desktop performance mode"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnityEducationalExperience;
