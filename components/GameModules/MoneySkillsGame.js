import { applyButtonAnimation, applyHeadingAnimation } from "../../utils/uiUtils.js";

// Game variables

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

function _renderCurrencyOptions(container) {
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

export function showMoneySkillsGame(container) {
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
  function _backupProgress() {
    alert(i18n[currentLang].backup);
  }
  function _syncProgress() {
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
          <button id="theme-btn">Theme Customization</button>
          <button id="backup-btn">Backup Progress</button>
          <button id="sync-btn">Sync Progress</button>
          <button id="close-settings">Close</button>
        </div>
      `;
      document.body.appendChild(modal);
      document.getElementById("close-settings").onclick = () => modal.remove();
      document.getElementById("onboarding-btn").onclick = showOnboarding;
      document.getElementById("faq-btn").onclick = showFAQ;
      document.getElementById("backup-btn").onclick = _backupProgress;
      document.getElementById("sync-btn").onclick = _syncProgress;
      document.getElementById("feedback-btn").onclick = openParentFeedback;
      document.getElementById("achievements-btn").onclick = showChallengesAndLeaderboard;
      document.getElementById("theme-btn").onclick = _showThemeCustomization;
      document.getElementById("analytics-btn").onclick = _showAnalyticsDashboard;
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
  const modal = document.createElement("div");
  modal.id = "parent-feedback-modal";
  modal.style = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.7);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  const content = document.createElement("div");
  content.className = "feedback-content";
  content.style = `
    background: white;
    border-radius: 12px;
    padding: 24px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  `;

  content.innerHTML = `
    <h3 class="text-xl font-bold mb-4">Parent/Guardian Feedback</h3>
    <div class="progress-summary mb-4">
      <h4 class="font-semibold mb-2">Progress Summary</h4>
      <div class="progress-bars">
        <div class="flex items-center mb-2">
          <span class="w-36">Currency Recognition:</span>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div class="bg-blue-600 h-2.5 rounded-full" style="width: 85%"></div>
          </div>
          <span class="ml-2">85%</span>
        </div>
        <div class="flex items-center mb-2">
          <span class="w-36">Money Counting:</span>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div class="bg-blue-600 h-2.5 rounded-full" style="width: 70%"></div>
          </div>
          <span class="ml-2">70%</span>
        </div>
        <div class="flex items-center mb-2">
          <span class="w-36">Change Making:</span>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div class="bg-blue-600 h-2.5 rounded-full" style="width: 65%"></div>
          </div>
          <span class="ml-2">65%</span>
        </div>
        <div class="flex items-center mb-2">
          <span class="w-36">Budgeting:</span>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div class="bg-blue-600 h-2.5 rounded-full" style="width: 50%"></div>
          </div>
          <span class="ml-2">50%</span>
        </div>
      </div>
    </div>

    <div class="recent-activities mb-4">
      <h4 class="font-semibold mb-2">Recent Activities</h4>
      <ul class="list-disc pl-5">
        <li>Completed 15 currency recognition exercises (Yesterday)</li>
        <li>Achieved "Quick Change" badge (2 days ago)</li>
        <li>Mastered $5 and $10 notes (3 days ago)</li>
        <li>Started budget planning module (5 days ago)</li>
      </ul>
    </div>

    <div class="recommendations mb-4">
      <h4 class="font-semibold mb-2">Recommended Activities</h4>
      <ul class="list-disc pl-5">
        <li>Practice making change with larger denominations</li>
        <li>Continue working on budget planning exercises</li>
        <li>Try the "Shopping Trip" scenario to apply skills</li>
      </ul>
    </div>

    <div class="parent-tips mb-4">
      <h4 class="font-semibold mb-2">Tips for Parents/Guardians</h4>
      <ul class="list-disc pl-5">
        <li>Involve your child in real shopping experiences to practice money skills</li>
        <li>Create a small allowance system to help practice budgeting</li>
        <li>Review receipts together and discuss costs and savings</li>
        <li>Play store/shopping games at home to reinforce concepts</li>
      </ul>
    </div>

    <div class="contact-educator mb-4">
      <h4 class="font-semibold mb-2">Contact Educator</h4>
      <textarea class="w-full p-2 border border-gray-300 rounded" rows="3" placeholder="Write a message to the educator..."></textarea>
      <button class="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600">Send Message</button>
    </div>

    <div class="export-options mb-4">
      <h4 class="font-semibold mb-2">Export Progress Report</h4>
      <button class="bg-gray-200 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-300">PDF Report</button>
      <button class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">Email Report</button>
    </div>

    <button id="close-feedback-modal" class="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-600">Close</button>
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);

  document.getElementById("close-feedback-modal").addEventListener("click", function () {
    modal.remove();
  });

  // Track that parent feedback was opened
  _trackEvent("parent_feedback_opened", { timestamp: new Date().toISOString() });
}

function _showThemeCustomization() {
  const modal = document.createElement("div");
  modal.id = "theme-customization-modal";
  modal.style = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.7);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  const themes = [
    {
      id: "default",
      name: "Default",
      primary: "#007bff",
      secondary: "#6c757d",
      background: "#ffffff",
    },
    {
      id: "dark",
      name: "Dark Mode",
      primary: "#0d6efd",
      secondary: "#6c757d",
      background: "#121212",
    },
    {
      id: "highcontrast",
      name: "High Contrast",
      primary: "#ffff00",
      secondary: "#000000",
      background: "#000000",
    },
    { id: "calm", name: "Calm", primary: "#4caf50", secondary: "#8bc34a", background: "#f1f8e9" },
    { id: "fun", name: "Fun", primary: "#ff4081", secondary: "#ff9100", background: "#f5f5f5" },
    { id: "focus", name: "Focus", primary: "#3f51b5", secondary: "#9c27b0", background: "#e8eaf6" },
  ];

  // Font options
  const fonts = [
    {
      id: "default",
      name: "Default",
      family: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    },
    { id: "dyslexic", name: "Dyslexic Friendly", family: "OpenDyslexic, Comic Sans MS, cursive" },
    { id: "serif", name: "Serif", family: "Georgia, Times New Roman, serif" },
    { id: "sansserif", name: "Sans Serif", family: "Arial, Helvetica, sans-serif" },
    { id: "monospace", name: "Monospace", family: "Courier New, monospace" },
  ];

  // Animation speed options
  const animationSpeeds = [
    { id: "fast", name: "Fast" },
    { id: "normal", name: "Normal" },
    { id: "slow", name: "Slow" },
    { id: "none", name: "No Animations" },
  ];

  const content = document.createElement("div");
  content.className = "theme-content";
  content.style = `
    background: white;
    border-radius: 12px;
    padding: 24px;
    width: 90%;
    max-width: 700px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  `;

  content.innerHTML = `
    <h3 class="text-xl font-bold mb-4">Customize Your Learning Experience</h3>

    <div class="theme-selection mb-6">
      <h4 class="font-semibold mb-2">Theme</h4>
      <div class="grid grid-cols-3 gap-3">
        ${themes
          .map(
            (theme) => `
          <div class="theme-option cursor-pointer p-3 border rounded hover:border-blue-500" data-theme="${theme.id}">
            <div class="flex space-x-2 mb-2">
              <div class="w-6 h-6 rounded-full" style="background-color: ${theme.primary}"></div>
              <div class="w-6 h-6 rounded-full" style="background-color: ${theme.secondary}"></div>
            </div>
            <div class="theme-bg w-full h-8 mb-2" style="background-color: ${theme.background}"></div>
            <div class="theme-name">${theme.name}</div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>

    <div class="font-selection mb-6">
      <h4 class="font-semibold mb-2">Font Style</h4>
      <div class="grid grid-cols-2 gap-3">
        ${fonts
          .map(
            (font) => `
          <div class="font-option cursor-pointer p-3 border rounded hover:border-blue-500" data-font="${font.id}">
            <div class="font-sample" style="font-family: ${font.family}">
              The quick brown fox jumps over the lazy dog
            </div>
            <div class="font-name mt-2">${font.name}</div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>

    <div class="text-size mb-6">
      <h4 class="font-semibold mb-2">Text Size</h4>
      <div class="flex items-center">
        <span class="mr-2 text-sm">A</span>
        <input type="range" min="12" max="24" value="16" class="w-full" id="text-size-slider">
        <span class="ml-2 text-lg">A</span>
      </div>
      <div class="text-center mt-2">
        <span id="text-size-value">16px</span>
      </div>
    </div>

    <div class="animation-speed mb-6">
      <h4 class="font-semibold mb-2">Animation Speed</h4>
      <div class="grid grid-cols-4 gap-2">
        ${animationSpeeds
          .map(
            (speed) => `
          <div class="animation-option cursor-pointer p-2 border rounded text-center hover:border-blue-500" data-speed="${speed.id}">
            ${speed.name}
          </div>
        `,
          )
          .join("")}
      </div>
    </div>

    <div class="sound-effects mb-6">
      <h4 class="font-semibold mb-2">Sound Effects</h4>
      <div class="flex items-center">
        <input type="checkbox" id="sound-effects-toggle" checked>
        <label for="sound-effects-toggle" class="ml-2">Enable sound effects</label>
      </div>
      <div class="mt-2">
        <label for="sound-volume" class="block">Volume</label>
        <input type="range" min="0" max="100" value="80" class="w-full" id="sound-volume">
      </div>
    </div>

    <div class="button-group flex justify-between mt-6">
      <button id="reset-theme-defaults" class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">Reset to Defaults</button>
      <div>
        <button id="save-theme-settings" class="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600">Save Settings</button>
        <button id="close-theme-modal" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Close</button>
      </div>
    </div>
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);

  // Add event listeners
  document.getElementById("close-theme-modal").addEventListener("click", function () {
    modal.remove();
  });

  document.getElementById("save-theme-settings").addEventListener("click", function () {
    // Save the theme settings to local storage or user preferences
    const selectedTheme =
      document.querySelector(".theme-option.selected")?.dataset.theme || "default";
    const selectedFont = document.querySelector(".font-option.selected")?.dataset.font || "default";
    const textSize = document.getElementById("text-size-slider").value;
    const animationSpeed =
      document.querySelector(".animation-option.selected")?.dataset.speed || "normal";
    const soundEffectsEnabled = document.getElementById("sound-effects-toggle").checked;
    const soundVolume = document.getElementById("sound-volume").value;

    const themeSettings = {
      theme: selectedTheme,
      font: selectedFont,
      textSize: textSize,
      animationSpeed: animationSpeed,
      soundEffectsEnabled: soundEffectsEnabled,
      soundVolume: soundVolume,
    };

    // Save settings to localStorage
    localStorage.setItem("moneyGameThemeSettings", JSON.stringify(themeSettings));

    // Apply the theme immediately
    applyThemeSettings(themeSettings);

    // Track theme customization
    _trackEvent("theme_customized", themeSettings);

    // Show confirmation and close modal
    alert("Your theme settings have been saved!");
    modal.remove();
  });

  document.getElementById("reset-theme-defaults").addEventListener("click", function () {
    // Reset to default theme settings
    localStorage.removeItem("moneyGameThemeSettings");
    alert("Settings reset to defaults. Save to apply changes.");
  });

  // Add click handlers for options
  document.querySelectorAll(".theme-option").forEach((option) => {
    option.addEventListener("click", function () {
      document
        .querySelectorAll(".theme-option")
        .forEach((o) => o.classList.remove("selected", "border-blue-500", "border-2"));
      this.classList.add("selected", "border-blue-500", "border-2");
    });
  });

  document.querySelectorAll(".font-option").forEach((option) => {
    option.addEventListener("click", function () {
      document
        .querySelectorAll(".font-option")
        .forEach((o) => o.classList.remove("selected", "border-blue-500", "border-2"));
      this.classList.add("selected", "border-blue-500", "border-2");
    });
  });

  document.querySelectorAll(".animation-option").forEach((option) => {
    option.addEventListener("click", function () {
      document
        .querySelectorAll(".animation-option")
        .forEach((o) => o.classList.remove("selected", "border-blue-500", "border-2"));
      this.classList.add("selected", "border-blue-500", "border-2");
    });
  });

  document.getElementById("text-size-slider").addEventListener("input", function () {
    document.getElementById("text-size-value").textContent = `${this.value}px`;
  });

  // Load and apply existing theme settings if available
  const existingSettings = localStorage.getItem("moneyGameThemeSettings");
  if (existingSettings) {
    const settings = JSON.parse(existingSettings);

    // Select the existing theme
    if (settings.theme) {
      const themeOption = document.querySelector(`.theme-option[data-theme="${settings.theme}"]`);
      if (themeOption) themeOption.classList.add("selected", "border-blue-500", "border-2");
    }

    // Select the existing font
    if (settings.font) {
      const fontOption = document.querySelector(`.font-option[data-font="${settings.font}"]`);
      if (fontOption) fontOption.classList.add("selected", "border-blue-500", "border-2");
    }

    // Set text size
    if (settings.textSize) {
      const textSizeSlider = document.getElementById("text-size-slider");
      textSizeSlider.value = settings.textSize;
      document.getElementById("text-size-value").textContent = `${settings.textSize}px`;
    }

    // Set animation speed
    if (settings.animationSpeed) {
      const animationOption = document.querySelector(
        `.animation-option[data-speed="${settings.animationSpeed}"]`,
      );
      if (animationOption) animationOption.classList.add("selected", "border-blue-500", "border-2");
    }

    // Set sound effects toggle
    if (Object.prototype.hasOwnProperty.call(settings, "soundEffectsEnabled")) {
      document.getElementById("sound-effects-toggle").checked = settings.soundEffectsEnabled;
    }

    // Set volume
    if (settings.soundVolume) {
      document.getElementById("sound-volume").value = settings.soundVolume;
    }
  } else {
    // Select default options if no settings exist
    document
      .querySelector('.theme-option[data-theme="default"]')
      .classList.add("selected", "border-blue-500", "border-2");
    document
      .querySelector('.font-option[data-font="default"]')
      .classList.add("selected", "border-blue-500", "border-2");
    document
      .querySelector('.animation-option[data-speed="normal"]')
      .classList.add("selected", "border-blue-500", "border-2");
  }
}

// Helper function to apply theme settings
function applyThemeSettings(settings) {
  // Apply theme colors and background
  const themes = {
    default: { primary: "#007bff", secondary: "#6c757d", background: "#ffffff", text: "#212529" },
    dark: { primary: "#0d6efd", secondary: "#6c757d", background: "#121212", text: "#f8f9fa" },
    highcontrast: {
      primary: "#ffff00",
      secondary: "#000000",
      background: "#000000",
      text: "#ffffff",
    },
    calm: { primary: "#4caf50", secondary: "#8bc34a", background: "#f1f8e9", text: "#212529" },
    fun: { primary: "#ff4081", secondary: "#ff9100", background: "#f5f5f5", text: "#212529" },
    focus: { primary: "#3f51b5", secondary: "#9c27b0", background: "#e8eaf6", text: "#212529" },
  };

  const fonts = {
    default: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    dyslexic: "OpenDyslexic, Comic Sans MS, cursive",
    serif: "Georgia, Times New Roman, serif",
    sansserif: "Arial, Helvetica, sans-serif",
    monospace: "Courier New, monospace",
  };

  const theme = themes[settings.theme] || themes.default;
  const fontFamily = fonts[settings.font] || fonts.default;

  // Apply to the game container
  const gameContainer = document.getElementById("money-skills-game");
  if (gameContainer) {
    gameContainer.style.backgroundColor = theme.background;
    gameContainer.style.color = theme.text;
    gameContainer.style.fontFamily = fontFamily;
    gameContainer.style.fontSize = `${settings.textSize}px`;

    // Apply to buttons
    const buttons = gameContainer.querySelectorAll("button");
    buttons.forEach((button) => {
      if (button.classList.contains("btn-primary")) {
        button.style.backgroundColor = theme.primary;
        button.style.color = "#ffffff";
      } else if (button.classList.contains("btn-secondary")) {
        button.style.backgroundColor = theme.secondary;
        button.style.color = "#ffffff";
      }
    });

    // Apply animation speed
    const animationSpeedMap = {
      fast: "0.5",
      normal: "1",
      slow: "2",
      none: "0",
    };

    const speed = animationSpeedMap[settings.animationSpeed] || "1";
    if (speed === "0") {
      // Disable animations
      const style = document.createElement("style");
      style.id = "disable-animations";
      style.innerHTML = `
        #money-skills-game * {
          animation-duration: 0s !important;
          transition-duration: 0s !important;
        }
      `;
      document.head.appendChild(style);
    } else {
      // Enable animations with specified speed
      const existingStyle = document.getElementById("disable-animations");
      if (existingStyle) existingStyle.remove();

      const style = document.createElement("style");
      style.id = "animation-speed";
      style.innerHTML = `
        #money-skills-game * {
          animation-duration: calc(var(--animation-duration, 1s) * ${speed}) !important;
          transition-duration: calc(var(--transition-duration, 0.3s) * ${speed}) !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Handle sound settings
  if (!settings.soundEffectsEnabled) {
    // Create a flag for sound effects
    window.moneyGameSoundDisabled = true;
  } else {
    window.moneyGameSoundDisabled = false;
    if (settings.soundVolume) {
      window.moneyGameSoundVolume = settings.soundVolume / 100; // Convert to 0-1 range
    }
  }
}

function showChallengesAndLeaderboard() {
  const modal = document.createElement("div");
  modal.id = "challenges-leaderboard-modal";
  modal.style = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.7);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  const content = document.createElement("div");
  content.className = "challenges-content";
  content.style = `
    background: white;
    border-radius: 12px;
    padding: 24px;
    width: 90%;
    max-width: 800px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  `;

  // Tab structure for challenges and leaderboard
  content.innerHTML = `
    <div class="tabs-container">
      <div class="tabs flex border-b mb-4">
        <button id="challenges-tab" class="tab-btn px-4 py-2 border-b-2 border-blue-500 font-semibold">Challenges</button>
        <button id="leaderboard-tab" class="tab-btn px-4 py-2 border-b-2 border-transparent">Leaderboard</button>
      </div>

      <div id="challenges-content" class="tab-content">
        <h3 class="text-xl font-bold mb-4">Money Skills Challenges</h3>

        <div class="daily-challenge p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
          <div class="flex justify-between items-center mb-2">
            <h4 class="font-semibold text-lg">Daily Challenge</h4>
            <span class="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">Expires in 8h 23m</span>
          </div>
          <p class="mb-2">Make exact change for $23.45 using the fewest possible coins and notes.</p>
          <div class="progress mt-2">
            <div class="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>0/1</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div class="bg-blue-600 h-2.5 rounded-full" style="width: 0%"></div>
            </div>
          </div>
          <button class="start-challenge mt-3 bg-blue-500 text-white px-4 py-2 rounded">Start Challenge</button>
        </div>

        <h4 class="font-semibold text-lg mb-2">Ongoing Challenges</h4>
        <div class="challenge-list space-y-4">
          <!-- Challenge 1 -->
          <div class="challenge-item p-3 border rounded-lg">
            <div class="flex justify-between items-center">
              <h5 class="font-medium">Budget Master</h5>
              <span class="badge bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Intermediate</span>
            </div>
            <p class="text-sm my-2">Create a budget for a week with $100 allowance.</p>
            <div class="progress mt-2">
              <div class="flex justify-between text-xs">
                <span>Progress</span>
                <span>2/5 steps</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full" style="width: 40%"></div>
              </div>
            </div>
            <button class="continue-challenge mt-2 text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Continue</button>
          </div>

          <!-- Challenge 2 -->
          <div class="challenge-item p-3 border rounded-lg">
            <div class="flex justify-between items-center">
              <h5 class="font-medium">Quick Change</h5>
              <span class="badge bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Beginner</span>
            </div>
            <p class="text-sm my-2">Make correct change in under 15 seconds, 10 times.</p>
            <div class="progress mt-2">
              <div class="flex justify-between text-xs">
                <span>Progress</span>
                <span>7/10 correct</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full" style="width: 70%"></div>
              </div>
            </div>
            <button class="continue-challenge mt-2 text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Continue</button>
          </div>

          <!-- Challenge 3 -->
          <div class="challenge-item p-3 border rounded-lg">
            <div class="flex justify-between items-center">
              <h5 class="font-medium">Shopping Spree</h5>
              <span class="badge bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Advanced</span>
            </div>
            <p class="text-sm my-2">Complete a virtual shopping trip staying within budget.</p>
            <div class="progress mt-2">
              <div class="flex justify-between text-xs">
                <span>Not Started</span>
                <span>0/3 trips</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full" style="width: 0%"></div>
              </div>
            </div>
            <button class="start-challenge mt-2 text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Start</button>
          </div>
        </div>

        <div class="achievements mt-6">
          <h4 class="font-semibold text-lg mb-2">Your Badges</h4>
          <div class="badges-grid grid grid-cols-4 gap-3">
            <div class="badge-item text-center">
              <div class="badge-icon bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                🪙
              </div>
              <div class="badge-name text-sm mt-1">Coin Counter</div>
            </div>
            <div class="badge-item text-center">
              <div class="badge-icon bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                💵
              </div>
              <div class="badge-name text-sm mt-1">Note Expert</div>
            </div>
            <div class="badge-item text-center opacity-40">
              <div class="badge-icon bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                🛒
              </div>
              <div class="badge-name text-sm mt-1">Smart Shopper</div>
              <div class="badge-locked text-xs">(Locked)</div>
            </div>
            <div class="badge-item text-center opacity-40">
              <div class="badge-icon bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                💰
              </div>
              <div class="badge-name text-sm mt-1">Budget Pro</div>
              <div class="badge-locked text-xs">(Locked)</div>
            </div>
          </div>
        </div>
      </div>

      <div id="leaderboard-content" class="tab-content hidden">
        <h3 class="text-xl font-bold mb-4">Money Skills Leaderboard</h3>

        <div class="leaderboard-filters flex mb-4 space-x-2">
          <select class="period-select border rounded p-1">
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
            <option value="alltime">All Time</option>
          </select>
          <select class="challenge-select border rounded p-1">
            <option value="all">All Challenges</option>
            <option value="quick-change">Quick Change</option>
            <option value="budget-master">Budget Master</option>
            <option value="shopping-spree">Shopping Spree</option>
          </select>
        </div>

        <div class="top-players mb-6">
          <div class="flex justify-center space-x-8 text-center">
            <!-- Second Place -->
            <div class="place-item">
              <div class="crown text-gray-400 text-lg">👑</div>
              <div class="avatar bg-blue-100 text-blue-800 w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mx-auto">JD</div>
              <div class="name mt-1">Jamie D.</div>
              <div class="score text-gray-600">925 pts</div>
              <div class="place mt-1 text-gray-500">2nd</div>
            </div>

            <!-- First Place -->
            <div class="place-item">
              <div class="crown text-yellow-400 text-2xl">👑</div>
              <div class="avatar bg-purple-100 text-purple-800 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto">MS</div>
              <div class="name mt-1">Morgan S.</div>
              <div class="score text-gray-600">1,240 pts</div>
              <div class="place mt-1 font-semibold text-yellow-600">1st</div>
            </div>

            <!-- Third Place -->
            <div class="place-item">
              <div class="crown text-yellow-700 text-lg">👑</div>
              <div class="avatar bg-green-100 text-green-800 w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mx-auto">AJ</div>
              <div class="name mt-1">Alex J.</div>
              <div class="score text-gray-600">840 pts</div>
              <div class="place mt-1 text-gray-500">3rd</div>
            </div>
          </div>
        </div>

        <div class="leaderboard-table">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-gray-100">
                <th class="border p-2 text-left">Rank</th>
                <th class="border p-2 text-left">Player</th>
                <th class="border p-2 text-left">Challenges</th>
                <th class="border p-2 text-left">Points</th>
                <th class="border p-2 text-left">Badges</th>
              </tr>
            </thead>
            <tbody>
              <tr class="bg-yellow-50">
                <td class="border p-2">1</td>
                <td class="border p-2">Morgan S.</td>
                <td class="border p-2">15 completed</td>
                <td class="border p-2">1,240</td>
                <td class="border p-2">8</td>
              </tr>
              <tr>
                <td class="border p-2">2</td>
                <td class="border p-2">Jamie D.</td>
                <td class="border p-2">12 completed</td>
                <td class="border p-2">925</td>
                <td class="border p-2">6</td>
              </tr>
              <tr>
                <td class="border p-2">3</td>
                <td class="border p-2">Alex J.</td>
                <td class="border p-2">10 completed</td>
                <td class="border p-2">840</td>
                <td class="border p-2">5</td>
              </tr>
              <tr>
                <td class="border p-2">4</td>
                <td class="border p-2">Sam T.</td>
                <td class="border p-2">8 completed</td>
                <td class="border p-2">720</td>
                <td class="border p-2">5</td>
              </tr>
              <tr>
                <td class="border p-2">5</td>
                <td class="border p-2">Riley P.</td>
                <td class="border p-2">7 completed</td>
                <td class="border p-2">650</td>
                <td class="border p-2">4</td>
              </tr>
              <tr class="bg-blue-50">
                <td class="border p-2">12</td>
                <td class="border p-2">You</td>
                <td class="border p-2">3 completed</td>
                <td class="border p-2">320</td>
                <td class="border p-2">2</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="your-stats mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 class="font-semibold mb-2">Your Statistics</h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="stat-item">
              <div class="stat-label text-sm text-gray-600">Rank</div>
              <div class="stat-value font-semibold">12th</div>
            </div>
            <div class="stat-item">
              <div class="stat-label text-sm text-gray-600">Points</div>
              <div class="stat-value font-semibold">320</div>
            </div>
            <div class="stat-item">
              <div class="stat-label text-sm text-gray-600">Challenges</div>
              <div class="stat-value font-semibold">3/25</div>
            </div>
            <div class="stat-item">
              <div class="stat-label text-sm text-gray-600">Badges</div>
              <div class="stat-value font-semibold">2/12</div>
            </div>
          </div>
          <div class="mt-3">
            <button class="bg-blue-500 text-white px-3 py-1 rounded text-sm">View Detailed Stats</button>
          </div>
        </div>
      </div>
    </div>

    <div class="button-row mt-6 text-center">
      <button id="close-challenges-modal" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Close</button>
    </div>
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);

  // Add event listeners for tabs
  document.getElementById("challenges-tab").addEventListener("click", function () {
    document.getElementById("challenges-content").classList.remove("hidden");
    document.getElementById("leaderboard-content").classList.add("hidden");
    document.getElementById("challenges-tab").classList.add("border-blue-500", "font-semibold");
    document.getElementById("leaderboard-tab").classList.remove("border-blue-500", "font-semibold");
    document.getElementById("challenges-tab").classList.remove("border-transparent");
    document.getElementById("leaderboard-tab").classList.add("border-transparent");
  });

  document.getElementById("leaderboard-tab").addEventListener("click", function () {
    document.getElementById("challenges-content").classList.add("hidden");
    document.getElementById("leaderboard-content").classList.remove("hidden");
    document.getElementById("challenges-tab").classList.remove("border-blue-500", "font-semibold");
    document.getElementById("leaderboard-tab").classList.add("border-blue-500", "font-semibold");
    document.getElementById("challenges-tab").classList.add("border-transparent");
    document.getElementById("leaderboard-tab").classList.remove("border-transparent");
  });

  document.getElementById("close-challenges-modal").addEventListener("click", function () {
    modal.remove();
  });

  // Add event listeners for challenge buttons
  document.querySelectorAll(".start-challenge, .continue-challenge").forEach((button) => {
    button.addEventListener("click", function () {
      const challengeName =
        this.closest(".challenge-item")?.querySelector("h5")?.textContent ||
        this.closest(".daily-challenge")?.querySelector("h4")?.textContent ||
        "Challenge";
      alert(`Starting ${challengeName}. This feature will be fully implemented soon!`);
    });
  });

  // Track that challenges/leaderboard was opened
  _trackEvent("challenges_leaderboard_opened", { timestamp: new Date().toISOString() });
}
function _enableSignLanguageAvatar() {
  // TODO: Implement sign language avatar
  console.warn("enableSignLanguageAvatar not implemented");
}
function _enableARVRMode() {
  // TODO: Implement AR/VR mode
  console.warn("enableARVRMode not implemented");
}
function _enableOfflineMode() {
  // TODO: Implement offline mode
  console.warn("enableOfflineMode not implemented");
}
function _setLanguage() {
  // TODO: Implement language setting
  console.warn("setLanguage not implemented");
}
function _showLanguageSelector() {
  // TODO: Implement language selector UI
  console.warn("showLanguageSelector not implemented");
}
function _startOnboarding() {
  // TODO: Implement onboarding flow
  console.warn("startOnboarding not implemented");
}
function _backupData() {
  // TODO: Implement data backup (prefixed as unused placeholder)
  console.warn("_backupData not implemented");
}
// TODO: Ensure secure API calls and data storage

// --- UI Polish & Customization ---
// TODO: Polish game UI with modern transitions and customization options

// --- Analytics & Educator Tools ---
function _trackEvent(event, data) {
  // Integrate with analytics service or log locally
  console.log("Analytics Event:", event, data);
}
function _showAnalyticsDashboard() {
  // Simple dashboard stub
  alert("Analytics dashboard coming soon!");
}
// --- Educator Tools ---
function _showEducatorDashboard() {
  // Simple educator dashboard stub
  alert("Educator dashboard coming soon!");
}
function _openContentCreationTools() {
  // TODO: Implement content creation tools
}
// --- Community Features ---
function _showCommunityFeatures() {
  // Simple community stub
  alert("Community features (forums, chat, collaboration) coming soon!");
}
