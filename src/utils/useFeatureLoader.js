import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * A React hook that modernizes the feature loading system using React patterns
 * instead of direct DOM manipulation.
 *
 * This hook provides:
 * - Feature discovery
 * - Feature loading
 * - Route navigation
 * - Feature activation/deactivation
 *
 * @returns {Object} An object with feature loading utilities
 */
export const useFeatureLoader = () => {
  const navigate = useNavigate();
  const [availableFeatures, setAvailableFeatures] = useState([]);
  const [activeFeature, setActiveFeature] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Define feature routing map using useMemo to avoid dependency issues
  const featureRouteMap = useMemo(
    () => ({
      "fluid-simulation": "/tools/fluid-simulation",
      whiteboard: "/tools/whiteboard",
      "ripple-effect": "/tools/ripple-effect",
      "webgl-effects": "/tools/webgl-effects",
      "character-animation": "/tools/character-animation",
      "adaptive-learning": "/adaptive-demo",
      "executive-function": "/executive-function-demo",
      "neurodivergent-learning": "/neurodivergent-learning",
      "ai-assistant": "/ai-assistant",
      "math-exercises": "/exercises/math",
      "adaptive-math": "/math/adaptive-quest",
      "fraction-mastery": "/math/fraction-mastery",
    }),
    [],
  );

  /**
   * Initialize the feature loader
   */
  useEffect(() => {
    const discoverFeatures = () => {
      try {
        // Define all available features
        const features = [
          {
            id: "fluid-simulation",
            name: "Fluid Simulation",
            description: "Interactive fluid physics simulation using WebGL",
            category: "visualization",
            tags: ["webgl", "physics", "interactive"],
            dependencies: ["three.js", "webgl"],
            path: "/tools/fluid-simulation",
          },
          {
            id: "whiteboard",
            name: "Whiteboard",
            description: "Interactive digital whiteboard for teaching",
            category: "tool",
            tags: ["drawing", "collaboration", "teaching"],
            dependencies: [],
            path: "/tools/whiteboard",
          },
          {
            id: "ripple-effect",
            name: "Ripple Effect",
            description: "Interactive ripple animations using WebGL shaders",
            category: "visualization",
            tags: ["webgl", "animation", "interactive"],
            dependencies: ["three.js", "webgl"],
            path: "/tools/ripple-effect",
          },
          {
            id: "webgl-effects",
            name: "WebGL Effects",
            description: "Various visual effects powered by WebGL",
            category: "visualization",
            tags: ["webgl", "effects", "animation"],
            dependencies: ["three.js", "webgl"],
            path: "/tools/webgl-effects",
          },
          {
            id: "character-animation",
            name: "Character Animation",
            description: "Character animation system for educational games",
            category: "animation",
            tags: ["characters", "education", "games"],
            dependencies: ["three.js"],
            path: "/tools/character-animation",
          },
          {
            id: "adaptive-learning",
            name: "Adaptive Learning",
            description: "Personalized learning experiences",
            category: "learning",
            tags: ["adaptive", "personalization", "education"],
            dependencies: [],
            path: "/adaptive-demo",
          },
          {
            id: "executive-function",
            name: "Executive Function",
            description: "Tools to develop executive function skills",
            category: "learning",
            tags: ["cognition", "skills", "development"],
            dependencies: [],
            path: "/executive-function-demo",
          },
          {
            id: "neurodivergent-learning",
            name: "Neurodivergent Learning",
            description: "Specialized learning approaches",
            category: "learning",
            tags: ["neurodiversity", "inclusion", "education"],
            dependencies: [],
            path: "/neurodivergent-learning",
          },
        ];

        setAvailableFeatures(features);
      } catch (error) {
        console.error("Failed to discover features:", error);
        setError("Failed to discover features");
      }
    };

    discoverFeatures();
  }, []);

  /**
   * Load a feature by its ID
   * @param {string} featureId - The ID of the feature to load
   * @returns {Promise} A promise that resolves when the feature is loaded
   */
  const loadFeature = useCallback(
    (featureId) => {
      if (!featureId) {
        setError("No feature ID provided");
        return Promise.reject("No feature ID provided");
      }

      setIsLoading(true);
      setError(null);

      try {
        const featurePath = featureRouteMap[featureId];

        if (!featurePath) {
          const error = `Feature "${featureId}" not found in route map`;
          setError(error);
          setIsLoading(false);
          return Promise.reject(error);
        }

        // Navigate to the feature's route
        navigate(featurePath);
        setActiveFeature(featureId);
        setIsLoading(false);
        return Promise.resolve(featureId);
      } catch (error) {
        console.error(`Failed to load feature "${featureId}":`, error);
        setError(`Failed to load feature "${featureId}"`);
        setIsLoading(false);
        return Promise.reject(error);
      }
    },
    [navigate, featureRouteMap],
  );

  /**
   * Get a feature by its ID
   * @param {string} featureId - The ID of the feature to get
   * @returns {Object|null} The feature object or null if not found
   */
  const getFeature = useCallback(
    (featureId) => {
      return availableFeatures.find((feature) => feature.id === featureId) || null;
    },
    [availableFeatures],
  );

  /**
   * Get features by category
   * @param {string} category - The category to filter by
   * @returns {Array} An array of features in the specified category
   */
  const getFeaturesByCategory = useCallback(
    (category) => {
      return availableFeatures.filter((feature) => feature.category === category);
    },
    [availableFeatures],
  );

  return {
    availableFeatures,
    activeFeature,
    isLoading,
    error,
    loadFeature,
    getFeature,
    getFeaturesByCategory,
  };
};

export default useFeatureLoader;
