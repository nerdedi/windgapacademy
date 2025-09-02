// Main entry point for Windgap Academy browser app
import { themes } from './js/themes.js';
import { setupVideoPlayer } from './js/videoPlayer.js';
import { addAriaLabels, enableKeyboardNavigation } from './js/accessibility.js';
import { showFeature } from './js/showFeature.js';

document.body.style.backgroundColor = themes.windgap.light;
setupVideoPlayer();
window.showFeature = showFeature;
addAriaLabels();
enableKeyboardNavigation();
