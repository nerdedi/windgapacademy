import { applyButtonAnimation, applyHeadingAnimation } from "../../utils/uiUtils.js";

// Money Skills Game Module
// --- Australian Money Skills Game: Sophisticated Logic & Mechanics ---
const AUD_COINS = [5, 10, 20, 50, 100, 200]; // cents
const AUD_NOTES = [5, 10, 20, 50, 100]; // dollars

function getRandomAmount() {
  // Generate a random amount between $0.05 and $99.95
  const dollars = Math.floor(Math.random() * 100);
  const cents = AUD_COINS[Math.floor(Math.random() * AUD_COINS.length)];
  return dollars + cents / 100;
}

function renderCurrencyOptions(container) {
  const currencyDiv = container.querySelector("#currency-options");
  if (!currencyDiv) return;
  currencyDiv.innerHTML = "<h4>Select coins and notes to match the amount</h4>";
  AUD_COINS.forEach((coin) => {
    const btn = document.createElement("button");
    btn.className = "coin-btn";
    btn.textContent = `$${(coin / 100).toFixed(2)}`;
    btn.onclick = () => selectCurrency(coin / 100);
    currencyDiv.appendChild(btn);
  });
  AUD_NOTES.forEach((note) => {
    const btn = document.createElement("button");
    btn.className = "note-btn";
    btn.textContent = `$${note}`;
    btn.onclick = () => selectCurrency(note);
    currencyDiv.appendChild(btn);
  });
}

let selectedTotal = 0;
let targetAmount = 0;

function selectCurrency(value) {
  selectedTotal += value;
  updateGameStatus();
}

function updateGameStatus() {
  const statusDiv = document.getElementById("money-skills-content");
  if (!statusDiv) return;
  statusDiv.innerHTML = `<p>Target: $${targetAmount.toFixed(2)}</p><p>Selected: $${selectedTotal.toFixed(2)}</p>`;
  if (Math.abs(selectedTotal - targetAmount) < 0.01) {
    statusDiv.innerHTML += '<p class="success">Correct! You matched the amount!</p>';
    selectedTotal = 0;
    setTimeout(startNewRound, 1500);
  } else if (selectedTotal > targetAmount) {
    statusDiv.innerHTML += '<p class="error">Too much! Try again.</p>';
    selectedTotal = 0;
    setTimeout(startNewRound, 1500);
  }
}

function startNewRound() {
  targetAmount = getRandomAmount();
  selectedTotal = 0;
  updateGameStatus();
}

// Practice money handling and budgeting with Australian currency visuals

export function showMoneySkillsGame(container, userData = {}) {
  // --- i18n & Language Switching ---
  const i18n = {
    en: {
      title: "Money Skills Game",
      return: "Return to Dashboard",
      onboarding: "Welcome! Practice money handling and budgeting.",
      faq: "FAQ: Learn about Australian currency and budgeting.",
      backup: "Backup your progress to the cloud.",
      sync: "Sync your achievements with your educator.",
      placeholder: "Feature coming soon!",
    },
    es: {
      title: "Juego de Habilidades Monetarias",
      return: "Volver al Panel",
      onboarding: "¡Bienvenido! Practica el manejo de dinero y el presupuesto.",
      faq: "FAQ: Aprende sobre la moneda australiana y el presupuesto.",
      backup: "Respalda tu progreso en la nube.",
      sync: "Sincroniza tus logros con tu educador.",
      placeholder: "¡Función próximamente!",
    },
    ar: {
      title: "لعبة المهارات المالية",
      return: "العودة إلى لوحة التحكم",
      onboarding: "مرحبًا! تدرب على التعامل مع المال والميزانية.",
      faq: "الأسئلة الشائعة: تعرف على العملة الأسترالية والميزانية.",
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

  container.innerHTML = `<section id="money-skills-game" aria-label="Money Skills Game" class="card fade-in max-w-2xl mx-auto my-8">
    <h2 class="text-3xl font-bold text-primary text-smooth flex items-center gap-2 mb-4">
      <svg class="h-8 w-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12H9v-2h2v2zm0-4H9V7h2v3z"/></svg>
      ${i18n[currentLang].title}
    </h2>
    <div id="money-challenge"></div>
    <div id="money-skills-content">
      <div id="currency-options"></div>
      <progress id="progress-bar" value="50" max="100" aria-label="Progress"></progress>
      <p>Sample money skills content goes here.</p>
      <button id="start-money-skills" class="btn-primary" aria-label="Start Money Skills">Start</button>
    </div>
    <img src="assets/images/aud_notes.png" alt="Australian Currency" loading="lazy" class="rounded-xl shadow mb-4" />
    <button id="money-return" class="btn-primary nav-btn mt-4" aria-label="Return to Dashboard">${i18n[currentLang].return}</button>
    <button id="settings-btn" class="btn-secondary ml-2" aria-label="Settings">⚙️</button>
  </section>`;
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
          <button id="achievements-btn">Achievements</button>
          <button id="feedback-btn">Feedback</button>
          <button id="analytics-btn">Analytics</button>
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
  };
  addTooltips();
  const moneyReturnBtn = document.getElementById("money-return");
  if (moneyReturnBtn) {
    moneyReturnBtn.onclick = function () {
      window.route("dashboard");
    };
  }
  // Game logic stubbed; implement as needed
  // Example usage for main button:
  const btn = document.getElementById("money-btn");
  if (btn) applyButtonAnimation(btn);
  // Example usage for heading:
  const heading = document.getElementById("money-heading");
  if (heading) applyHeadingAnimation(heading);
}

// --- Feature Implementations ---
function openParentFeedback() {
  // TODO: Implement parent feedback modal
  console.warn("openParentFeedback not implemented");
}
function showThemeCustomization() {
  // TODO: Implement theme customization UI
  console.warn("showThemeCustomization not implemented");
}
function showChallengesAndLeaderboard() {
  // TODO: Implement challenges and leaderboard
  console.warn("showChallengesAndLeaderboard not implemented");
}
function enableSignLanguageAvatar() {
  // TODO: Implement sign language avatar
  console.warn("enableSignLanguageAvatar not implemented");
}
function enableARVRMode() {
  // TODO: Implement AR/VR mode
  console.warn("enableARVRMode not implemented");
}
function enableOfflineMode() {
  // TODO: Implement offline mode
  console.warn("enableOfflineMode not implemented");
}
function setLanguage(lang) {
  // TODO: Implement language setting
  console.warn("setLanguage not implemented");
}
function showLanguageSelector() {
  // TODO: Implement language selector UI
  console.warn("showLanguageSelector not implemented");
}
function startOnboarding() {
  // TODO: Implement onboarding flow
  console.warn("startOnboarding not implemented");
}
function backupData() {
  // TODO: Implement data backup
  console.warn("backupData not implemented");
}
// TODO: Ensure secure API calls and data storage

// --- UI Polish & Customization ---
// TODO: Polish game UI with modern transitions and customization options

// --- Analytics & Educator Tools ---
function trackEvent(event, data) {
  // Integrate with analytics service or log locally
  console.log("Analytics Event:", event, data);
}
function showAnalyticsDashboard() {
  // Simple dashboard stub
  alert("Analytics dashboard coming soon!");
}
// --- Educator Tools ---
function showEducatorDashboard() {
  // Simple educator dashboard stub
  alert("Educator dashboard coming soon!");
}
function openContentCreationTools() {
  // TODO: Implement content creation tools
}
// --- Community Features ---
function showCommunityFeatures() {
  // Simple community stub
  alert("Community features (forums, chat, collaboration) coming soon!");
}
