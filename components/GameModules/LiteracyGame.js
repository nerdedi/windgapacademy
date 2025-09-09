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
  modal.innerHTML = `<h2>Welcome to Literacy Game!</h2><p>Practice literacy skills interactively. Use the settings to customize your experience.</p><button id='close-onboarding'>Close</button>`;
  document.body.appendChild(modal);
  document.getElementById("close-onboarding").onclick = () => modal.remove();
}

// Example: Add ARIA attributes
function setAccessibility() {
  const gameEl = document.getElementById("literacy-game");
  if (gameEl) {
    gameEl.setAttribute("role", "region");
    gameEl.setAttribute("aria-label", "Literacy Game");
  }
}

// Example: Add backup/sync logic
function _backupProgress(progress) {
  localStorage.setItem("literacyProgress", JSON.stringify(progress));
}
function _syncProgress() {
  return JSON.parse(localStorage.getItem("literacyProgress") || "{}");
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
  showOnboarding();
  setAccessibility();
  // ...game logic...
}

// Run game on DOMContentLoaded
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", startGame);
}
// Literacy Game Module: Platformer
// --- i18n & Language Switching ---
const i18n = {
  en: {
    title: "Literacy Game",
    return: "Return to Dashboard",
    onboarding: "Welcome! Practice literacy skills in a fun platformer.",
    faq: "FAQ: Learn about reading, writing, and comprehension.",
    backup: "Backup your progress to the cloud.",
    sync: "Sync your achievements with your educator.",
    placeholder: "Feature coming soon!",
  },
  es: {
    title: "Juego de Alfabetización",
    return: "Volver al Panel",
    onboarding: "¡Bienvenido! Practica habilidades de alfabetización en un juego de plataformas.",
    faq: "FAQ: Aprende sobre lectura, escritura y comprensión.",
    backup: "Respalda tu progreso en la nube.",
    sync: "Sincroniza tus logros con tu educador.",
    placeholder: "¡Función próximamente!",
  },
  ar: {
    title: "لعبة محو الأمية",
    return: "العودة إلى لوحة التحكم",
    onboarding: "مرحبًا! تدرب على مهارات القراءة والكتابة في لعبة منصات ممتعة.",
    faq: "الأسئلة الشائعة: تعرف على القراءة والكتابة والفهم.",
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
function _backupProgress() {
  alert(i18n[currentLang].backup);
}
function _syncProgress() {
  alert(i18n[currentLang].sync);
}
// Daisy explains rules, Winnie cheers, Andy motivates
// Levels increase in difficulty, feedback is motivational and independence-focused
// Visual effects: parallax backgrounds, animated coins, smooth transitions
// Learner Level shown instead of Score

// --- Progress Tracking ---
function _showSettings() {
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
function openParentFeedback() {
  let modal = document.getElementById("parent-feedback-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "parent-feedback-modal";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.className = "card fade-in max-w-lg mx-auto";
    modal.style.zIndex = "1002";
    modal.innerHTML = `
      <h3>Parent/Guardian Feedback</h3>
  <textarea id="feedback-text" rows="4" class="w-full input" placeholder="Enter feedback..."></textarea>
  <br><button id="send-feedback" class="btn-primary nav-btn">Send</button>
  <button id="close-feedback" class="nav-btn bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded transition">Close</button>
    `;
    document.body.appendChild(modal);
    modal.querySelector("#send-feedback").onclick = () => {
      const text = modal.querySelector("#feedback-text").value;
      localStorage.setItem("literacyGameParentFeedback", text);
      alert("Feedback sent!");
    };
    modal.querySelector("#close-feedback").onclick = () => {
      modal.style.display = "none";
    };
  }
  modal.style.display = "block";
}
function showChallengesAndLeaderboard() {
  let modal = document.getElementById("challenges-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "challenges-modal";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.className = "card fade-in max-w-lg mx-auto";
    modal.style.zIndex = "1002";
    modal.innerHTML = `
      <h3>Challenges & Leaderboard</h3>
  <div id="challenge-list" class="mb-2"></div>
  <div id="leaderboard-list" class="mb-2"></div>
  <button id="close-challenges" class="nav-btn bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded transition">Close</button>
    `;
    document.body.appendChild(modal);
    modal.querySelector("#close-challenges").onclick = () => {
      modal.style.display = "none";
    };
  }
  const challenges = [
    { name: "Collect all coins", completed: false },
    { name: "Reach level 3", completed: false },
  ];
  modal.querySelector("#challenge-list").innerHTML =
    "<ul>" +
    challenges.map((c) => `<li>${c.name} - ${c.completed ? "✔️" : "❌"}</li>`).join("") +
    "</ul>";
  let leaderboard = JSON.parse(localStorage.getItem("literacyGameLeaderboard") || "[]");
  modal.querySelector("#leaderboard-list").innerHTML =
    "<h4>Leaderboard</h4><ul>" +
    leaderboard.map((e) => `<li>${e.name}: ${e.score}</li>`).join("") +
    "</ul>";
  modal.style.display = "block";
}
function enableARVRMode() {
  if (!document.getElementById("arvr-scene")) {
    const scene = document.createElement("a-scene");
    scene.id = "arvr-scene";
    scene.innerHTML = '<a-box position="0 1 -3" color="#4CC3D9"></a-box>';
    document.body.appendChild(scene);
    alert("AR/VR mode enabled (A-Frame stub).");
  }
}
function enableOfflineMode() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(() => {
        alert("Offline mode enabled!");
      })
      .catch(() => alert("Offline mode registration failed."));
  }
}
function showThemeCustomization() {
  let modal = document.getElementById("theme-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "theme-modal";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.background = "#fff";
    modal.style.border = "2px solid #1976d2";
    modal.style.borderRadius = "12px";
    modal.style.padding = "24px";
    modal.style.zIndex = "1002";
    modal.innerHTML = `
      <h3>Theme Customization</h3>
  <select id="theme-select" class="border rounded px-2 py-1">
        <option value="default">Default</option>
        <option value="dark">Dark</option>
        <option value="pastel">Pastel</option>
      </select>
  <button id="apply-theme" class="nav-btn bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition">Apply</button>
  <button id="close-theme" class="nav-btn bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded transition">Close</button>
    `;
    document.body.appendChild(modal);
    modal.querySelector("#apply-theme").onclick = () => {
      const theme = modal.querySelector("#theme-select").value;
      localStorage.setItem("literacyGameTheme", theme);
      document.body.className = theme;
      alert("Theme applied!");
    };
    modal.querySelector("#close-theme").onclick = () => {
      modal.style.display = "none";
    };
  }
  modal.style.display = "block";
}
function enableSignLanguageAvatar() {
  let overlay = document.getElementById("sign-avatar-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "sign-avatar-overlay";
    overlay.style.position = "fixed";
    overlay.style.bottom = "24px";
    overlay.style.right = "24px";
    overlay.style.width = "120px";
    overlay.style.height = "120px";
    overlay.style.background = "#fff";
    overlay.style.border = "2px solid #1976d2";
    overlay.style.borderRadius = "12px";
    overlay.style.zIndex = "1002";
    overlay.innerHTML =
      '<img src="/assets/sign-avatar.gif" alt="Sign Language Avatar" style="width:100%;height:100%;object-fit:contain;" />';
    document.body.appendChild(overlay);
  }
  overlay.style.display = "block";
}
function openContentCreationTools() {
  let modal = document.getElementById("content-creation-modal");
  function updateLevelsList() {
    let levels = JSON.parse(localStorage.getItem("literacyGameCustomLevels") || "[]");
    modal.querySelector("#custom-levels-list").innerHTML =
      "<ul>" + levels.map((l) => `<li>${l}</li>`).join("") + "</ul>";
  }
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "content-creation-modal";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.background = "#fff";
    modal.style.border = "2px solid #1976d2";
    modal.style.borderRadius = "12px";
    modal.style.padding = "24px";
    modal.style.zIndex = "1002";
    modal.innerHTML = `
      <h3>Custom Content Creation</h3>
  <input id="custom-level" type="text" placeholder="Enter new level..." class="w-full mb-2" />
  <button id="add-level" class="nav-btn bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition">Add</button>
  <button id="close-content" class="nav-btn bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded transition">Close</button>
      <div id="custom-levels-list"></div>
    `;
    document.body.appendChild(modal);
    modal.querySelector("#add-level").onclick = () => {
      const level = modal.querySelector("#custom-level").value;
      let levels = JSON.parse(localStorage.getItem("literacyGameCustomLevels") || "[]");
      levels.push(level);
      localStorage.setItem("literacyGameCustomLevels", JSON.stringify(levels));
      updateLevelsList();
    };
    modal.querySelector("#close-content").onclick = () => {
      modal.style.display = "none";
    };
    updateLevelsList();
  }
  modal.style.display = "block";
}

// --- End Advanced Feature Implementations ---

// Export main game functions for use elsewhere
export function showLiteracyGame(container, userData = {}) {
  container.innerHTML = `
    <div class="card">
      <h2 class="text-2xl font-bold mb-4">Literacy Game</h2>
      <p>Welcome to the Literacy Game module!</p>
      <!-- Add literacy game UI here -->
    </div>
  `;
  // Add your literacy game logic here
  // Example usage for main button:
  const btn = document.getElementById("literacy-btn");
  applyButtonAnimation(btn);
  // Example usage for heading:
  const heading = document.getElementById("literacy-heading");
  applyHeadingAnimation(heading);
}

export {
  openParentFeedback,
  showChallengesAndLeaderboard,
  enableARVRMode,
  enableOfflineMode,
  showThemeCustomization,
  enableSignLanguageAvatar,
  openContentCreationTools,
};
