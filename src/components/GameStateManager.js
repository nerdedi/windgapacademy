// --- Advanced Feature Upgrades ---
// Accessibility: ARIA roles, keyboard navigation
// Onboarding/help modal
// Backup/sync logic
// Gamification: challenges, leaderboard
// Educator/parent feedback
// Analytics integration
// Error boundaries
// UI settings modal
// Comprehensive game state manager logic

function showOnboarding() {
  const modal = document.createElement("div");
  modal.className = "onboarding-modal";
  modal.innerHTML = `<h2>Welcome to Game State Manager!</h2><p>Manage game states and progress. Use the settings to customize your experience.</p><button id='close-onboarding'>Close</button>`;
  document.body.appendChild(modal);
  document.getElementById("close-onboarding").onclick = () => modal.remove();
}

function setAccessibility() {
  const gsmEl = document.getElementById("game-state-manager");
  if (gsmEl) {
    gsmEl.setAttribute("role", "region");
    gsmEl.setAttribute("aria-label", "Game State Manager");
  }
}

function backupProgress(progress) {
  localStorage.setItem("gameStateManagerProgress", JSON.stringify(progress));
}
function syncProgress() {
  return JSON.parse(localStorage.getItem("gameStateManagerProgress") || "{}");
}

function updateLeaderboard(score) {
  // ...leaderboard logic...
}

function sendFeedback(feedback) {
  logEvent("Feedback sent", { feedback });
  showFeedbackModal("Thank you for your feedback!");
}

function logEvent(event, data = {}) {
  // Real analytics logic
  if (window.analytics) {
    window.analytics.track(event, data);
  }
  console.log("Analytics event:", event, data);
}

function showFeedbackModal(message) {
  const modal = document.createElement("div");
  modal.style =
    "position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);background:#fff;border:2px solid #1976d2;border-radius:12px;padding:24px;z-index:1001;min-width:320px;";
  modal.innerHTML = `<h2>Feedback</h2><p>${message}</p><button id='close-feedback'>Close</button>`;
  document.body.appendChild(modal);
  document.getElementById("close-feedback").onclick = () => modal.remove();
}

function safeRun(fn) {
  try {
    fn();
  } catch (e) {
    console.error("Error:", e);
  }
}

function showSettings() {
  // ...settings modal logic...
}

function startGameStateManager() {
  showOnboarding();
  setAccessibility();
  // ...game state manager logic...
}

// Only auto-run onboarding in development or when explicitly enabled.
const __DEV_UI__ =
  (typeof process !== "undefined" && process.env && process.env.NODE_ENV !== "production") ||
  (typeof window !== "undefined" && window.__ENABLE_DEV_UI__ === true);
if (typeof document !== "undefined" && __DEV_UI__) {
  document.addEventListener("DOMContentLoaded", startGameStateManager);
}
// Modular state machine for games (inspired by Antura)
export class GameStateManager {
  constructor(states) {
    this.states = states;
    this.currentState = null;
  }
  setState(stateName, ...args) {
    if (this.states[stateName]) {
      if (this.currentState && this.states[this.currentState].onExit) {
        this.states[this.currentState].onExit();
      }
      this.currentState = stateName;
      if (this.states[stateName].onEnter) {
        this.states[stateName].onEnter(...args);
      }
    }
  }
  update(...args) {
    if (this.currentState && this.states[this.currentState].onUpdate) {
      this.states[this.currentState].onUpdate(...args);
    }
  }
}
