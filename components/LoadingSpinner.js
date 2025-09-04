import {
  applyButtonAnimation,
  applyHeadingAnimation,
  setAriaAttributes,
} from "../utils/uiUtils.js";
import {
  applyButtonAnimation,
  applyHeadingAnimation,
  setAriaAttributes,
} from "../utils/uiUtils.js";
// Loading spinner component
export function showLoadingSpinner(container) {
  container.innerHTML =
    "<div id='loading-spinner' class='loading-spinner' aria-label='Loading'><div class='spinner'></div><button id='loading-btn' class='nav-btn'>Cancel</button><h2 id='loading-heading' style='display:none;'>Loading</h2></div>";
  // Animate button and heading
  applyButtonAnimation(document.getElementById("loading-btn"));
  applyHeadingAnimation(document.getElementById("loading-heading"));
  // Accessibility
  setAriaAttributes(document.getElementById("loading-spinner"), {
    role: "status",
    label: "Loading Spinner",
  });
  // Example usage for main button:
  const btn = document.getElementById("loading-btn");
  applyButtonAnimation(btn);
  // Example usage for heading:
  const heading = document.getElementById("loading-heading");
  applyHeadingAnimation(heading);
}
