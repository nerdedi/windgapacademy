// --- Advanced Feature Upgrades & TODOs ---
// Accessibility: ARIA roles, keyboard navigation
// Onboarding/help modal
// Backup/sync logic
// Gamification: challenges, leaderboard
// Educator/parent feedback
// Analytics integration
// Error boundaries
// UI settings modal
// Comprehensive game logic

// Example: Add onboarding modal
function showOnboarding() {
  const modal = document.createElement("div");
  modal.className = "onboarding-modal";
  modal.innerHTML = `<h2>Welcome to Employability Game!</h2><p>Practice employability skills interactively. Use the settings to customize your experience.</p><button id='close-onboarding'>Close</button>`;
  document.body.appendChild(modal);
  document.getElementById("close-onboarding").onclick = () => modal.remove();
}

// Example: Add ARIA attributes
function setAccessibility() {
  const gameEl = document.getElementById("employability-game");
  if (gameEl) {
    gameEl.setAttribute("role", "region");
    gameEl.setAttribute("aria-label", "Employability Game");
  }
}

// Example: Add backup/sync logic
function backupProgress(progress) {
  localStorage.setItem("employabilityProgress", JSON.stringify(progress));
}
function syncProgress() {
  return JSON.parse(localStorage.getItem("employabilityProgress") || "{}");
}

// Example: Gamification
function updateLeaderboard(score) {
  // ...leaderboard logic...
}

// Example: Educator/parent feedback
function sendFeedback(feedback) {
  // ...send feedback to server...
}

// Example: Analytics
function logEvent(event) {
  // ...analytics logic...
}

// Example: Error boundary
function safeRun(fn) {
  try {
    fn();
  } catch (e) {
    console.error("Error:", e);
  }
}

// Example: UI settings modal
function showSettings() {
  // ...settings modal logic...
}

// Comprehensive game logic placeholder
function startGame() {
  showOnboarding();
  setAccessibility();
  // ...game logic...
}

// Run game on DOMContentLoaded
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", startGame);
}
// --- i18n & Language Switching ---
const i18n = {
  en: {
    title: "Employability Game",
    return: "Return to Dashboard",
    onboarding: "Welcome! Practice employability skills for real-world success.",
    faq: "FAQ: Learn about job skills, interviews, and teamwork.",
    backup: "Backup your progress to the cloud.",
    sync: "Sync your achievements with your educator.",
    placeholder: "Feature coming soon!",
  },
  es: {
    title: "Juego de Empleabilidad",
    return: "Volver al Panel",
    onboarding: "¡Bienvenido! Practica habilidades de empleabilidad para el éxito real.",
    faq: "FAQ: Aprende sobre habilidades laborales, entrevistas y trabajo en equipo.",
    backup: "Respalda tu progreso en la nube.",
    sync: "Sincroniza tus logros con tu educador.",
    placeholder: "¡Función próximamente!",
  },
  ar: {
    title: "لعبة التوظيف",
    return: "العودة إلى لوحة التحكم",
    onboarding: "مرحبًا! تدرب على مهارات التوظيف للنجاح في العالم الحقيقي.",
    faq: "الأسئلة الشائعة: تعرف على مهارات العمل والمقابلات والعمل الجماعي.",
    backup: "انسخ تقدمك إلى السحابة.",
    sync: "زامن إنجازاتك مع المعلم.",
    placeholder: "الميزة قادمة قريبًا!",
  },
};
let currentLang = "en";
function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.body.dir = ["ar"].includes(lang) ? "rtl" : "ltr";
  addTooltips();
}

// --- Tooltips ---
function addTooltips() {
  document.querySelectorAll("button, [aria-label]").forEach((el) => {
    if (el.title || el.getAttribute("aria-label")) {
      el.setAttribute("tabindex", "0");
      el.onfocus = el.onmouseover = function () {
        let tip = document.createElement("div");
        tip.className = "tooltip";
        tip.textContent = el.title || el.getAttribute("aria-label");
        tip.style.position = "absolute";
        tip.style.background = "#333";
        tip.style.color = "#fff";
        tip.style.padding = "4px 8px";
        tip.style.borderRadius = "4px";
        tip.style.top = el.getBoundingClientRect().top - 30 + "px";
        tip.style.left = el.getBoundingClientRect().left + "px";
        tip.style.zIndex = 9999;
        tip.id = "active-tooltip";
        document.body.appendChild(tip);
      };
      el.onblur = el.onmouseout = function () {
        let tip = document.getElementById("active-tooltip");
        if (tip) tip.remove();
      };
    }
  });
}

// --- Onboarding & FAQ Modals ---
function showOnboarding() {
  let modal = document.getElementById("onboarding-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "onboarding-modal";
    modal.style =
      "position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.5);z-index:2000;display:flex;align-items:center;justify-content:center;";
    modal.innerHTML = `<div style='background:#fff;padding:2em;border-radius:1em;max-width:400px;text-align:center;'>
      <h3>Onboarding</h3>
      <p>${i18n[currentLang].onboarding}</p>
      <button id='close-onboarding' class='btn-primary'>Close</button>
    </div>`;
    document.body.appendChild(modal);
    document.getElementById("close-onboarding").onclick = () => modal.remove();
  }
}
function showFAQ() {
  let modal = document.getElementById("faq-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "faq-modal";
    modal.style =
      "position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.5);z-index:2000;display:flex;align-items:center;justify-content:center;";
    modal.innerHTML = `<div style='background:#fff;padding:2em;border-radius:1em;max-width:400px;text-align:left;'>
      <h3>FAQ</h3>
      <ul><li>${i18n[currentLang].faq}</li></ul>
      <button id='close-faq' class='btn-primary'>Close</button>
    </div>`;
    document.body.appendChild(modal);
    document.getElementById("close-faq").onclick = () => modal.remove();
  }
}

// --- Backup & Sync Placeholders ---
function backupProgress() {
  alert(i18n[currentLang].backup);
}
function syncProgress() {
  alert(i18n[currentLang].sync);
}
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
      <h2 class="card animate-anticipate text-2xl font-bold text-primary text-smooth">💼 Employability Game</h2>
      <div id="employability-challenge" aria-live="polite"></div>
      <button id="employ-return" class="nav-btn" aria-label="Return to Dashboard">Return to Dashboard</button>
    </section>
  `;
  const returnBtn = document.getElementById("employ-return");
  applyButtonAnimation(returnBtn);
  returnBtn.onclick = function () {
    window.route("dashboard");
  };
  startEmployabilityGame(userData);
  // Example usage for main button:
  const btn = document.getElementById("employ-btn");
  applyButtonAnimation(btn);
  // Example usage for heading:
  const heading = document.getElementById("employ-heading");
  applyHeadingAnimation(heading);
}

/**
 * Apply standardized button animation.
 * @param {HTMLElement} btn - The button element to animate.
 */
function applyButtonAnimation(btn) {
  if (!btn) return;
  btn.classList.add("btn-primary", "animate-ease-in-out");
  if (window.gsap) {
    gsap.from(btn, { scale: 0.8, duration: 0.6, ease: "elastic.out(1, 0.5)" });
  }
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
      applyButtonAnimation(btn);
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
function showSettings() {
  let modal = document.getElementById("settings-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "settings-modal";
    modal.style =
      "position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);background:#fff;border:2px solid #1976d2;border-radius:12px;padding:24px;z-index:1001;min-width:320px;";
    modal.innerHTML = `
      <h3>Game Settings</h3>
      <div>
        <label>Language: <select id="language-select">
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="ar">Arabic</option>
        </select></label>
      </div>
      <hr>
      <div>
        <button id="onboarding-btn">Onboarding</button>
        <button id="faq-btn">FAQ</button>
        <button id="backup-btn">Backup Progress</button>
        <button id="sync-btn">Sync Progress</button>
        <button id="close-settings">Close</button>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById("close-settings").onclick = () => modal.remove();
    document.getElementById("onboarding-btn").onclick = showOnboarding;
    document.getElementById("faq-btn").onclick = showFAQ;
    document.getElementById("backup-btn").onclick = backupProgress;
    document.getElementById("sync-btn").onclick = syncProgress;
    document.getElementById("language-select").onchange = (e) => {
      setLanguage(e.target.value);
      modal.remove();
    };
  } else {
    modal.style.display = "block";
  }
  addTooltips();
}
window.addEventListener("DOMContentLoaded", () => {
  addTooltips();
  const settingsBtn = document.createElement("button");
  settingsBtn.id = "settings-btn";
  settingsBtn.className = "btn-secondary ml-2";
  settingsBtn.setAttribute("aria-label", "Settings");
  settingsBtn.textContent = "⚙️";
  document.body.appendChild(settingsBtn);
  settingsBtn.onclick = showSettings;
});
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
