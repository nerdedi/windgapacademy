import { applyButtonAnimation, applyHeadingAnimation, setAriaAttributes } from '../utils/uiUtils.js';
// Improved error message logic
export function showErrorMessage(container, message) {
  container.innerHTML = `<div id='error-message' class='error-message' role='alert'>${message}
    <button id='error-btn' class='nav-btn'>Dismiss</button>
    <h2 id='error-heading' style='display:none;'>Error</h2>
  </div>`;
  // Animate button and heading
  applyButtonAnimation(document.getElementById('error-btn'));
  applyHeadingAnimation(document.getElementById('error-heading'));
  // Accessibility
  setAriaAttributes(document.getElementById('error-message'), { role: 'alert', label: 'Error Message' });
    // Example usage for main button:
    const btn = document.getElementById('error-btn');
    applyButtonAnimation(btn);
    // Example usage for heading:
    const heading = document.getElementById('error-heading');
    applyHeadingAnimation(heading);
}
