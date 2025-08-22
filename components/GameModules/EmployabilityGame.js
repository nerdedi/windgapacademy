/**
 * Employability Game Module
 * Practice job skills and interview scenarios
 */

/**
 * Render the Employability Game UI and start the game logic.
 * @param {HTMLElement} container - The DOM element to render the game in.
 * @param {Object} userData - Optional user data for progress tracking.
 */
export function showEmployabilityGame(container, userData = {}) {
  container.innerHTML = `
    <section id="employability-game" aria-label="Employability Game">
  <h2 class="text-2xl font-bold text-primary text-smooth">💼 Employability Game</h2>
      <div id="employability-challenge" aria-live="polite"></div>
  <button id="employ-return" class="btn-primary nav-btn" aria-label="Return to Dashboard">Return to Dashboard</button>
    </section>
  `;
  document.getElementById("employ-return").onclick = function () {
    window.route("dashboard");
  };
  startEmployabilityGame(userData);
}

/**
 * Start the employability game logic and scenario flow.
 * @param {Object} userData - Optional user data for progress tracking.
 */
function startEmployabilityGame(userData) {
  var area = document.getElementById("employability-challenge");
  var scenarios = [
    "Prepare Daisy for a job interview.",
    "Help Winnie write her resume.",
    "Coach Andy on workplace communication.",
  ];
  var current = 0;
  var progress = loadProgress();
  if (progress.length > 0) {
    current = progress.findIndex((p) => !p.completed);
    if (current === -1) current = scenarios.length; // All completed
  }
  function renderScenario() {
    if (current < scenarios.length) {
      area.innerHTML = `<p>${scenarios[current]}</p>
        <button id='employ-btn' class='nav-btn' aria-label='Complete Task'>Complete Task</button>
  <div id='employ-feedback' class='mt-2' aria-live='polite'></div>`;
      var btn = document.getElementById("employ-btn");
      btn.focus();
      btn.onkeydown = function (e) {
        if (e.key === "Enter") btn.click();
      };
      btn.onclick = function () {
        document.getElementById("employ-feedback").innerHTML =
          "<span class='text-green-500 font-semibold'>Task completed!</span>";
        progress[current] = { scenario: scenarios[current], completed: true };
        saveProgress(progress);
        if (current < scenarios.length - 1) {
          current++;
          setTimeout(renderScenario, 1200);
        } else {
          setTimeout(function () {
            area.innerHTML = "<p>Game complete! Well done.</p>";
            if (userData && userData.userId) {
              import("../../firebase.js").then(function (mod) {
                mod.saveLessonPlan("employability-game", userData.userId, JSON.stringify(progress));
              });
            }
          }, 1200);
        }
      };
    } else {
      area.innerHTML = "<p>Game complete! Well done.</p>";
    }
  }
  renderScenario();
}

// --- Progress Tracking ---
/**
 * Save the user's progress to localStorage.
 * @param {Array} data - Progress data to save.
 */
function saveProgress(data) {
  localStorage.setItem("employGameProgress", JSON.stringify(data));
}
/**
 * Load the user's progress from localStorage.
 * @returns {Array} The saved progress data.
 */
function loadProgress() {
  return JSON.parse(localStorage.getItem("employGameProgress") || "[]");
}

// --- Accessibility & Error Handling Implementation ---
/**
 * Enable keyboard navigation for accessibility.
 */
function enableKeyboardNavigation() {
  document.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      const focusable = Array.from(document.querySelectorAll("button, [tabindex], input, select"));
      const index = focusable.indexOf(document.activeElement);
      const next = focusable[(index + 1) % focusable.length];
      if (next) next.focus();
      e.preventDefault();
    }
  });
}
/**
 * Add ARIA labels to the document for accessibility.
 */
function addAriaLabels() {
  document.body.setAttribute("aria-label", "Employability Game");
}
addAriaLabels();
enableKeyboardNavigation();

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
// --- End Advanced Feature Suggestions ---

// --- Engagement & Gamification ---
// TODO: Add more animations and sound effects for achievements and feedback
// TODO: Expand gamification with badges, streaks, and seasonal events
// TODO: Add micro-interactions and smooth transitions to game UI

// --- Security Improvements ---
// TODO: Review authentication and input sanitization for multiplayer and feedback
// TODO: Ensure secure API calls and data storage

// --- UI Polish & Customization ---
// TODO: Polish game UI with modern transitions and customization options

// --- Analytics & Educator Tools ---
// --- Educator Tools ---
// TODO: Implement content creation tools
// --- Onboarding & Help ---
// --- Backup & Sync ---
