// Main entry point for Windgap Academy browser app
import { addAriaLabels, enableKeyboardNavigation } from "./js/accessibility.js";
import { showFeature } from "./js/showFeature.js";
import { themes } from "./js/themes.js";
import { setupVideoPlayer } from "./js/videoPlayer.js";

document.body.style.backgroundColor = themes.windgap.light;
setupVideoPlayer();
window.showFeature = showFeature;
addAriaLabels();
enableKeyboardNavigation();
