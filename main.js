// Main entry point for Windgap Academy browser app
import { addAriaLabels, enableKeyboardNavigation } from "./js/accessibility.js";
import { showFeature } from "./js/showFeature.js";
import { themes } from "./js/themes.js";

document.body.style.backgroundColor = themes.windgap.light;
window.showFeature = showFeature;
addAriaLabels();
enableKeyboardNavigation();

// Ensure buttons work after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Windgap Academy initialized');
});
