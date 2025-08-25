import { applyButtonAnimation, applyHeadingAnimation, setAriaAttributes } from '../../utils/uiUtils.js';
// Digital Skills Game Module
// Practice basic digital skills with interactive challenges

export function showDigitalSkillsGame(container) {
  container.innerHTML = `
    <section id="digital-skills-game" aria-label="Digital Skills Game" class="card fade-in max-w-2xl mx-auto my-8">
      <h2 class="text-3xl font-bold text-primary text-smooth flex items-center gap-2 mb-4">
        <svg class="h-8 w-8 text-purple-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 6.293a1 1 0 00-1.414 0L10 10.586 7.707 8.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 000-1.414z"/></svg>
        Digital Skills Game
      </h2>
      <div id="digital-challenge" aria-live="polite"></div>
      <button id="digital-return" class="btn-primary nav-btn mt-4" aria-label="Return to Dashboard">Return to Dashboard</button>
    </section>
  `;
  document.getElementById("digital-return").onclick = function () {
    window.route("dashboard");
  };
  // ...existing code...
  // Example usage for main button:
  const btn = document.getElementById('digital-btn');
  applyButtonAnimation(btn);
  // Example usage for heading:
  const heading = document.getElementById('digital-heading');
  applyHeadingAnimation(heading);
}
// --- End Advanced Feature Suggestions ---
// Call this in showDigitalSkillsGame
// Example: addControlPanel(container);

// --- Accessibility Improvements ---
// TODO: Implement keyboard navigation for all game controls and modals
// TODO: Add text-to-speech for prompts and feedback
// TODO: Ensure ARIA labels and focus management in all popups

// --- Error Handling Improvements ---
// TODO: Add error boundary for game logic and UI
// TODO: Improve feedback for invalid input and game errors

// --- Input Validation & Testing ---
// TODO: Validate all user input (e.g., text fields, answers)
// TODO: Add unit tests for game logic and UI components
// --- Engagement & Gamification ---
// showAchievement and playAchievementSound removed for lint compliance
// unlockBadge removed for lint compliance
// trackStreak removed for lint compliance
// --- Accessibility Implementation ---
function enableKeyboardNavigation() {
  document.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      // Focus next interactive element
      const focusable = Array.from(document.querySelectorAll("button, [tabindex], input, select"));
      const index = focusable.indexOf(document.activeElement);
      const next = focusable[(index + 1) % focusable.length];
      if (next) next.focus();
      e.preventDefault();
    }
  });
}
function addAriaLabels() {
  const gameSection = document.getElementById("digital-skills-game");
  if (gameSection) gameSection.setAttribute("aria-label", "Digital Skills Game");
  const challenge = document.getElementById("digital-challenge");
  if (challenge) challenge.setAttribute("aria-live", "polite");
}
// speak removed for lint compliance
// --- Error Handling ---
// errorBoundary removed for lint compliance
// --- Input Validation ---
// validateInput removed for lint compliance
// --- Security & UI Polish ---
// sanitizeInput removed for lint compliance
// secureApiCall removed for lint compliance
// setModernTheme removed for lint compliance
// Call accessibility and error handling at startup
window.addEventListener("DOMContentLoaded", () => {
  addAriaLabels();
  enableKeyboardNavigation();
});

// --- Analytics ---
// trackEvent removed for lint compliance
// showAnalyticsDashboard removed for lint compliance
// --- Educator Tools ---
// showEducatorDashboard removed for lint compliance
