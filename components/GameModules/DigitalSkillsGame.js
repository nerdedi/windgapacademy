import WebGLEffectsUtil from "../../src/utils/WebGLEffects";
import {
  applyButtonAnimation,
  applyHeadingAnimation,
  setAriaAttributes,
} from "../../utils/uiUtils.js";
// Digital Skills Game Module
// Practice basic digital skills with interactive challenges

export function showDigitalSkillsGame(container) {
  // --- i18n & Language Switching ---
  const i18n = {
    en: {
      title: "Digital Skills Game",
      return: "Return to Dashboard",
      onboarding: "Welcome! Practice basic digital skills with interactive challenges.",
      faq: "FAQ: Learn about digital safety and online behaviour.",
      backup: "Backup your progress to the cloud.",
      sync: "Sync your achievements with your educator.",
      placeholder: "Feature coming soon!",
      achievements: "Achievements",
      educatorFeedback: "Educator Feedback",
      parentFeedback: "Parent Feedback",
      analytics: "Analytics",
      error: "An error occurred. Please try again.",
      validate: "Please enter a valid response.",
    },
    es: {
      title: "Juego de Habilidades Digitales",
      return: "Volver al Panel",
      onboarding: "¡Bienvenido! Practica habilidades digitales básicas.",
      faq: "FAQ: Aprende sobre seguridad digital y comportamiento en línea.",
      backup: "Respalda tu progreso en la nube.",
      sync: "Sincroniza tus logros con tu educador.",
      placeholder: "¡Función próximamente!",
      achievements: "Logros",
      educatorFeedback: "Retroalimentación del Educador",
      parentFeedback: "Retroalimentación de Padres",
      analytics: "Analítica",
      error: "Ocurrió un error. Por favor, inténtalo de nuevo.",
      validate: "Por favor, ingresa una respuesta válida.",
    },
    ar: {
      title: "لعبة المهارات الرقمية",
      return: "العودة إلى لوحة التحكم",
      onboarding: "مرحبًا! تدرب على المهارات الرقمية الأساسية.",
      faq: "الأسئلة الشائعة: تعرف على السلامة الرقمية والسلوك عبر الإنترنت.",
      backup: "انسخ تقدمك إلى السحابة.",
      sync: "زامن إنجازاتك مع المعلم.",
      placeholder: "الميزة قادمة قريبًا!",
      achievements: "الإنجازات",
      educatorFeedback: "ملاحظات المعلم",
      parentFeedback: "ملاحظات الوالدين",
      analytics: "تحليلات",
      error: "حدث خطأ. يرجى المحاولة مرة أخرى.",
      validate: "يرجى إدخال إجابة صالحة.",
    },
  };
  let currentLang = "en";
  function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.body.dir = ["ar"].includes(lang) ? "rtl" : "ltr";
    addTooltips();
    renderGame();
  }

  // --- Error Boundary ---
  function errorBoundary(fn) {
    try {
      fn();
    } catch (e) {
      if (typeof window !== "undefined" && typeof window.alert === "function") {
        window.alert(i18n[currentLang].error);
      } else {
        console.error(i18n[currentLang].error);
      }
    }
  }

  // --- Input Validation ---
  function validateInput(input) {
    if (!input || input.trim() === "") {
      alert(i18n[currentLang].validate);
      return false;
    }
    return true;
  }

  // --- Gamification ---
  function showAchievements() {
    let modal = document.getElementById("achievements-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "achievements-modal";
      modal.style =
        "position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.5);z-index:2000;display:flex;align-items:center;justify-content:center;";
      modal.innerHTML = `<div style='background:#fff;padding:2em;border-radius:1em;max-width:400px;text-align:center;'>
        <h3>${i18n[currentLang].achievements}</h3>
        <ul><li>Completed Digital Safety Challenge</li><li>Unlocked Badge: Cyber Hero</li></ul>
        <button id='close-achievements' class='btn-primary'>Close</button>
      </div>`;
      document.body.appendChild(modal);
      document.getElementById("close-achievements").onclick = () => modal.remove();
    }
  }

  // --- Educator/Parent Feedback ---
  function showEducatorFeedback() {
    alert(i18n[currentLang].educatorFeedback + ": Great progress!");
  }
  function showParentFeedback() {
    alert(i18n[currentLang].parentFeedback + ": Keep practicing digital safety!");
  }

  // --- Analytics ---
  function showAnalytics() {
    alert(i18n[currentLang].analytics + ": You completed 3 challenges this week!");
  }

  // --- Main Game Render ---
  function renderGame() {
    addTooltips();
    container.innerHTML = `
      <section id="digital-skills-game" aria-label="Digital Skills Game" class="card fade-in max-w-2xl mx-auto my-8">
        <h2 class="text-3xl font-bold text-primary text-smooth flex items-center gap-2 mb-4">
          <svg class="h-8 w-8 text-purple-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 6.293a1 1 0 00-1.414 0L10 10.586 7.707 8.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 000-1.414z"/></svg>
          ${i18n[currentLang].title}
        </h2>
        <div id="digital-challenge" aria-live="polite"></div>
        <button id="digital-return" class="btn-primary nav-btn mt-4" aria-label="Return to Dashboard">${i18n[currentLang].return}</button>
        <button id="settings-btn" class="btn-secondary ml-2" aria-label="Settings">⚙️</button>
        <button id="achievements-btn" class="btn-secondary ml-2" aria-label="Achievements">🏆</button>
        <button id="educator-btn" class="btn-secondary ml-2" aria-label="Educator Feedback">👩‍🏫</button>
        <button id="parent-btn" class="btn-secondary ml-2" aria-label="Parent Feedback">👨‍👩‍👧‍👦</button>
        <button id="analytics-btn" class="btn-secondary ml-2" aria-label="Analytics">📊</button>
      </section>
    `;
    document.getElementById("settings-btn").onclick = function () {
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
            <button id="help-btn">Help</button>
            <button id="feedback-btn">Feedback</button>
            <button id="reset-btn">Reset Progress</button>
            <button id="backup-btn">Backup Progress</button>
            <button id="sync-btn">Sync Progress</button>
            <button id="close-settings">Close</button>
          </div>
        `;
        document.body.appendChild(modal);
        document.getElementById("close-settings").onclick = () => modal.remove();
        document.getElementById("reset-btn").onclick = resetProgress;
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
    };
    document.getElementById("achievements-btn").onclick = showAchievements;
    document.getElementById("educator-btn").onclick = showEducatorFeedback;
    document.getElementById("parent-btn").onclick = showParentFeedback;
    document.getElementById("analytics-btn").onclick = showAnalytics;
    addTooltips();
    document.getElementById("digital-return").onclick = function () {
      window.route("dashboard");
      addTooltips();
    };
    // Example challenge
    const challengeDiv = document.getElementById("digital-challenge");
    if (challengeDiv) {
      addTooltips();
      challengeDiv.innerHTML = `<p>Solve: What is a strong password?</p><input id="answer" type="text" class="input" placeholder="Your answer..." /><button id="submit-answer" class="btn-primary">Submit</button>`;
      document.getElementById("submit-answer").onclick = function () {
        addTooltips();
        const val = document.getElementById("answer").value;
        if (validateInput(val)) {
          challengeDiv.innerHTML += `<p class='success'>Great! A strong password uses letters, numbers, and symbols.</p>`;
        }
      };
    }
    // Accessibility & ARIA
    setAriaAttributes(document.getElementById("digital-skills-game"), {
      role: "region",
      label: i18n[currentLang].title,
    });
    setAriaAttributes(document.getElementById("digital-challenge"), {
      role: "region",
      label: "Challenge",
    });
    // Keyboard navigation
    enableKeyboardNavigation();
  }
  errorBoundary(renderGame);

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
        <button id='start-onboarding' class='btn-primary'>Start</button>
        <button id='reset-onboarding' class='btn-secondary'>Reset</button>
        <button id='close-onboarding' class='btn-primary'>Close</button>
      </div>`;
      document.body.appendChild(modal);
      document.getElementById("close-onboarding").onclick = () => modal.remove();
      document.getElementById("start-onboarding").onclick = () => {
        modal.remove();
        startOnboarding();
      };
      document.getElementById("reset-onboarding").onclick = () => {
        modal.remove();
        resetOnboarding();
      };
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
  function _backupProgress() {
    alert(i18n[currentLang].backup);
  }
  function _syncProgress() {
    alert(i18n[currentLang].sync);
  }

  container.innerHTML = `
    <section id="digital-skills-game" aria-label="Digital Skills Game" class="card fade-in max-w-2xl mx-auto my-8">
      <h2 class="text-3xl font-bold text-primary text-smooth flex items-center gap-2 mb-4">
        <svg class="h-8 w-8 text-purple-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 6.293a1 1 0 00-1.414 0L10 10.586 7.707 8.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 000-1.414z"/></svg>
        ${i18n[currentLang].title}
      </h2>
      <div id="digital-challenge" aria-live="polite"></div>
      <button id="digital-return" class="btn-primary nav-btn mt-4" aria-label="Return to Dashboard">${i18n[currentLang].return}</button>
      <button id="settings-btn" class="btn-secondary ml-2" aria-label="Settings">⚙️</button>
    </section>
  `;
  const settingsBtn = container.querySelector("#settings-btn");
  if (settingsBtn) {
    settingsBtn.onclick = function () {
      let modal = container.querySelector("#settings-modal");
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
        container.appendChild(modal);
        modal.querySelector("#close-settings").onclick = () => modal.remove();
        modal.querySelector("#onboarding-btn").onclick = showOnboarding;
        modal.querySelector("#faq-btn").onclick = showFAQ;
        modal.querySelector("#backup-btn").onclick = backupProgress;
        modal.querySelector("#sync-btn").onclick = syncProgress;
        modal.querySelector("#language-select").onchange = (e) => {
          setLanguage(e.target.value);
          modal.remove();
        };
      } else {
        modal.style.display = "block";
      }
      addTooltips();
    };
  }
  addTooltips();
  const returnBtn = container.querySelector("#digital-return");
  if (returnBtn) {
    returnBtn.onclick = function () {
      window.route("dashboard");
    };
  }
  // ...existing code...
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
    modal.innerHTML = `<h2>Welcome to Digital Skills Game!</h2><p>Learn digital skills interactively. Use the settings to customize your experience.</p><button id='close-onboarding'>Close</button>`;
    document.body.appendChild(modal);
    document.getElementById("close-onboarding").onclick = () => modal.remove();
  }

  // Example: Add ARIA attributes
  function setAccessibility() {
    const gameEl = document.getElementById("digital-skills-game");
    if (gameEl) {
      gameEl.setAttribute("role", "region");
      gameEl.setAttribute("aria-label", "Digital Skills Game");
    }
  }

  // Example: Backup/sync logic
  function backupProgress(progress) {
    localStorage.setItem("digitalSkillsProgress", JSON.stringify(progress));
  }
  function syncProgress() {
    return JSON.parse(localStorage.getItem("digitalSkillsProgress") || "{}");
  }

  // Example: Gamification
  function _updateLeaderboard(score) {
    // ...leaderboard logic...
  }

  // Example: Educator/parent feedback
  function _sendFeedback(feedback) {
    // ...send feedback to server...
  }

  // Example: Analytics
  function _logEvent(event) {
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
  function _showSettings() {
    // ...settings modal logic...
  }

  // Comprehensive game logic placeholder
  function startGame() {
    // Initialize WebGL effects
    setupWebGLEffects();
    showOnboarding();
    setAccessibility();
    // ...game logic...
  }

  // Setup WebGL effects for the game
  function setupWebGLEffects() {
    // Create a container for WebGL effects
    let effectsContainer = document.getElementById("game-effects-container");
    if (!effectsContainer) {
      effectsContainer = document.createElement("div");
      effectsContainer.id = "game-effects-container";
      effectsContainer.style.position = "absolute";
      effectsContainer.style.top = "0";
      effectsContainer.style.left = "0";
      effectsContainer.style.width = "100%";
      effectsContainer.style.height = "100%";
      effectsContainer.style.pointerEvents = "none";
      effectsContainer.style.zIndex = "10";
      document.body.appendChild(effectsContainer);
    }
  }

  // Add visual effects for achievements
  function showAchievementEffect() {
    // Use the WebGLEffectsUtil to create a particle effect
    WebGLEffectsUtil.initParticleSystem("game-effects-container", {
      particleCount: 100,
      particleSize: 0.1,
      particleColors: [0xffcc00, 0xff6600, 0x3399ff],
      speed: 0.02,
      turbulence: 0.1,
      spread: 50,
      animationDuration: 2,
    });
  }

  // Run game on DOMContentLoaded
  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", startGame);
  }
  // Example usage for main button:
  const btn = document.getElementById("digital-btn");
  applyButtonAnimation(btn);
  // Example usage for heading:
  const heading = document.getElementById("digital-heading");
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
