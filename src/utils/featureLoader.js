// Portions of this file were generated with the assistance of GitHub Copilot
// Modernized version of js/featureLoader.js using React patterns and hooks

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Custom hook for loading features in the Windgap Academy application
 * @returns {Object} An object containing the showFeature function
 */
export function useFeatureLoader() {
  const navigate = useNavigate();

  /**
   * Show a feature by either navigating to its route or dynamically importing its component
   * @param {string} feature - The feature identifier
   * @param {HTMLElement} container - Optional container to render the feature in
   * @returns {Promise<void>}
   */
  const showFeature = async (feature, container = null) => {
    // Map of features to their corresponding routes
    const featureRoutes = {
      fluid: "/tools/fluid-simulation",
      whiteboard: "/tools/whiteboard",
      ripple: "/tools/ripple-effect",
      webgl: "/tools/webgl-effects",
      character: "/tools/character-animation",
      // Add more routes here as you migrate features to the SPA
    };

    // If feature has a dedicated route, navigate to it
    if (featureRoutes[feature]) {
      navigate(featureRoutes[feature]);
      return;
    }

    // For components that don't have dedicated routes yet
    if (container) {
      try {
        let module;
        switch (feature) {
          // Games
          case "avatar":
            module = await import("../../components/AvatarBuilder.js");
            await invokeModule(module, "showAvatarBuilder", container);
            break;
          case "stairs":
            module = await import("../../components/ClimbingStairsAnimation.js");
            await invokeModule(module, "showClimbingStairsAnimation", container);
            break;
          case "island":
            module = await import("../../components/MaxAreaOfIslandAnimation.js");
            await invokeModule(module, "showMaxAreaOfIslandAnimation", container);
            break;
          case "cube":
            module = await import("../../components/CubeMapDemo.js");
            await invokeModule(module, "showCubeMapDemo", container);
            break;
          case "kitchen":
            module = await import("../../components/HealthyKitchenChallenge.js");
            await invokeModule(module, "showHealthyKitchenChallenge", container);
            break;
          case "foodcollector":
            module = await import("../../components/FoodCollectorEnv.js");
            await invokeModule(module, "showFoodCollectorEnv", container);
            break;
          case "zoo":
            module = await import("../../components/AcademyZoo.js");
            await invokeModule(module, "showAcademyZoo", container);
            break;
          case "dashboard":
            module = await import("../../components/ResultsDashboard.js");
            await invokeModule(module, "showResultsDashboard", container);
            break;
          default:
            console.error(`Unknown feature: ${feature}`);
            if (container) {
              container.innerHTML = `<div class='alert-error'>Unknown feature: ${feature}</div>`;
            }
        }
      } catch (error) {
        console.error(`Error loading feature ${feature}:`, error);
        if (container) {
          container.innerHTML = `<div class='alert-error'>Failed to load feature: ${error.message}</div>`;
        }
      }
    }
  };

  /**
   * Helper to safely invoke a module's function
   * @param {Object} mod - The imported module
   * @param {string} funcName - The function name to invoke
   * @param {HTMLElement} container - The container element
   */
  async function invokeModule(mod, funcName, container) {
    if (mod && typeof mod[funcName] === "function") {
      mod[funcName](container);
    } else if (mod && typeof mod.default === "function") {
      mod.default(container);
    } else if (
      mod &&
      typeof mod.default === "object" &&
      typeof mod.default.constructor === "function"
    ) {
      new mod.default(container);
    } else {
      container.innerHTML = `<div class='alert-error'>Feature loaded but no display function found.</div>`;
      console.warn("Missing display function for feature:", mod, funcName);
    }
  }

  return { showFeature };
}

/**
 * Feature loader component to integrate with legacy code
 * @param {Object} props - Component props
 * @param {string} props.defaultFeature - Default feature to show
 * @returns {JSX.Element} The feature loader component
 */
export function FeatureLoader({ defaultFeature = "avatar" }) {
  const containerRef = useRef(null);
  const { showFeature } = useFeatureLoader();

  useEffect(() => {
    // Expose the showFeature function globally for backward compatibility
    window.showFeature = (feature) => showFeature(feature, containerRef.current);

    // Show default feature
    showFeature(defaultFeature, containerRef.current);

    // Cleanup
    return () => {
      delete window.showFeature;
    };
  }, [defaultFeature, showFeature]);

  return <div id="feature-container" ref={containerRef} className="w-full h-full"></div>;
}
