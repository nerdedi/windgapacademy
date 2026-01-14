// Feature routing logic
export async function showFeature(feature) {
  try {
    console.log(`Showing feature: ${feature}`);

    // Hide all feature panels first
    const panels = document.querySelectorAll("[data-pane]");
    panels.forEach((panel) => {
      panel.hidden = true;
      panel.style.display = "none";
    });

    // Show the requested feature panel
    const targetPanel = document.querySelector(`[data-pane="${feature}"]`);
    if (targetPanel) {
      targetPanel.hidden = false;
      targetPanel.style.display = "block";

      // Focus management for accessibility
      const firstFocusable = targetPanel.querySelector(
        "button, input, [tabindex]:not([tabindex='-1'])",
      );
      if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100);
      }
    } else {
      console.warn(`No panel found for feature: ${feature}`);

      // Fallback: try to find and execute any window function for the feature
      const featureFunctionName = `launch${feature.charAt(0).toUpperCase() + feature.slice(1)}`;
      if (typeof window[featureFunctionName] === "function") {
        window[featureFunctionName]();
      } else if (typeof window.launchGame === "function" && feature.includes("game")) {
        window.launchGame(feature);
      } else {
        console.error(`Feature "${feature}" not found and no fallback available`);
      }
    }

    // Update URL without page reload (for back button support)
    if (window.history && window.history.pushState) {
      const newUrl = new URL(window.location);
      newUrl.searchParams.set("feature", feature);
      window.history.pushState({ feature }, `Windgap Academy - ${feature}`, newUrl);
    }
  } catch (err) {
    console.error(`Error showing feature "${feature}":`, err);
  }
}

// Handle browser back/forward buttons
if (typeof window !== "undefined") {
  // Attach to window for inline HTML usage
  window.showFeature = showFeature;

  // Handle popstate for back/forward navigation
  window.addEventListener("popstate", (evt) => {
    const urlParams = new URLSearchParams(window.location.search);
    const feature = urlParams.get("feature");
    if (feature && evt.state?.feature) {
      showFeature(feature);
    }
  });

  // Check for initial feature in URL on load
  window.addEventListener("load", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const feature = urlParams.get("feature");
    if (feature) {
      showFeature(feature);
    }
  });
}
