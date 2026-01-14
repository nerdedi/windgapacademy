// Main entry point for Windgap Academy browser app
import { addAriaLabels, enableKeyboardNavigation } from "./js/accessibility.js";
import { showFeature } from "./js/showFeature.js";
import { themes } from "./js/themes.js";

function applyThemeSafely() {
  const defaultBg = "#ffffff";
  try {
    const bg =
      themes && themes.windgap && typeof themes.windgap.light === "string"
        ? themes.windgap.light
        : defaultBg;
    if (document.body) {
      document.body.style.backgroundColor = bg;
    }
  } catch (err) {
    console.warn("Failed to apply theme:", err);
    if (document.body) document.body.style.backgroundColor = defaultBg;
  }
}

function initializeAccessibility() {
  try {
    if (typeof addAriaLabels === "function") {
      addAriaLabels();
    } else {
      console.warn("addAriaLabels is not a function or not exported");
    }

    if (typeof enableKeyboardNavigation === "function") {
      enableKeyboardNavigation();
    } else {
      console.warn("enableKeyboardNavigation is not a function or not exported");
    }
  } catch (err) {
    console.error("Accessibility initialization error:", err);
  }
}

function bindFeatureClicks() {
  // Event delegation for robustness - works even with dynamically added buttons
  document.addEventListener("click", (evt) => {
    const btn = evt.target.closest("[data-feature]");
    if (!btn) return;

    const feature = btn.dataset?.feature || btn.getAttribute("data-feature");
    if (!feature) return;

    try {
      if (typeof showFeature === "function") {
        showFeature(feature);
      } else {
        console.warn("showFeature is not a function or not exported");
      }
    } catch (err) {
      console.error(`Error executing feature "${feature}":`, err);
    }
  });
}

function init() {
  console.log("Windgap Academy initialized");

  // Apply theme with fallback
  applyThemeSafely();

  // Initialize accessibility features with guards
  initializeAccessibility();

  // Bind feature logic with event delegation
  bindFeatureClicks();
}

// Ensure init runs whether or not DOMContentLoaded has already fired
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
