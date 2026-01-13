// Main entry point for Windgap Academy browser app
import { addAriaLabels, enableKeyboardNavigation } from "./js/accessibility.js";
import { showFeature } from "./js/showFeature.js";
import { themes } from "./js/themes.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("Windgap Academy initialized");

  // Apply theme safely
  if (document.body) {
    document.body.style.backgroundColor = themes?.windgap?.light || "#ffffff";
  }

  // Initialize accessibility features
  addAriaLabels();
  enableKeyboardNavigation();

  // Bind feature logic without polluting global scope
  const featureButtons = document.querySelectorAll("[data-feature]");
  featureButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const feature = btn.getAttribute("data-feature");
      if (feature) showFeature(feature);
    });
  });
});
