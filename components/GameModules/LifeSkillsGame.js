import "./LifeSkillsGame.css";

// Life Skills Game Module — consolidated & cleaned
// Practice daily living skills with interactive scenarios

// ============== SHARED UTILITIES ==============

function escapeHTML(str = "") {
  return str.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
}

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem("lifeGameProgress") || "[]");
  } catch {
    return [];
  }
}

function saveProgress(data) {
  localStorage.setItem("lifeGameProgress", JSON.stringify(data));
}

// RTL languages
const RTL_LANGS = ["ar", "he", "fa", "ur"];

function updateRTL(lang) {
  document.documentElement.dir = RTL_LANGS.includes(lang) ? "rtl" : "ltr";
}

// ============== i18n TRANSLATIONS ==============
const i18n = {
  en: {
    title: "Life Skills Game",
    return: "Return to Dashboard",
    onboarding: "Welcome! Practice daily living skills with interactive scenarios.",
    faq: "FAQ: Learn about healthy routines and independence.",
    backup: "Backup your progress to the cloud.",
    sync: "Sync your achievements with your educator.",
    complete: "Game complete! Well done.",
    taskComplete: "Task completed!",
  },
  es: {
    title: "Juego de Habilidades para la Vida",
    return: "Volver al Panel",
    onboarding: "¡Bienvenido! Practica habilidades de la vida diaria.",
    faq: "FAQ: Aprende sobre rutinas saludables e independencia.",
    backup: "Respalda tu progreso en la nube.",
    sync: "Sincroniza tus logros con tu educador.",
    complete: "¡Juego completado! Bien hecho.",
    taskComplete: "¡Tarea completada!",
  },
  ar: {
    title: "لعبة المهارات الحياتية",
    return: "العودة إلى لوحة التحكم",
    onboarding: "مرحبًا! تدرب على مهارات الحياة اليومية مع سيناريوهات تفاعلية.",
    faq: "الأسئلة الشائعة: تعرف على الروتين الصحي والاستقلالية.",
    backup: "انسخ تقدمك إلى السحابة.",
    sync: "زامن إنجازاتك مع المعلم.",
    complete: "اكتملت اللعبة! أحسنت.",
    taskComplete: "تمت المهمة!",
  },
};

function t(lang, key) {
  return (i18n[lang] && i18n[lang][key]) || i18n.en[key] || key;
}

// ============== MAIN EXPORT FUNCTION ==============
export function showLifeSkillsGame(container, userData = {}) {
  if (!container) return;

  let currentLang = "en";

  // ---------- Tooltips with scroll offset ----------
  function removeTooltip() {
    const existing = document.getElementById("active-tooltip");
    if (existing) existing.remove();
  }

  function addTooltips() {
    document
      .querySelectorAll("#life-skills-game button, #life-skills-game [aria-label]")
      .forEach((el) => {
        const label = el.title || el.getAttribute("aria-label");
        if (!label) return;
        el.setAttribute("tabindex", "0");

        const showTip = () => {
          removeTooltip();
          const tip = document.createElement("div");
          tip.id = "active-tooltip";
          tip.className = "tooltip";
          tip.textContent = label;
          tip.style.cssText = `position:absolute;background:#333;color:#fff;padding:4px 8px;border-radius:4px;z-index:9999;font-size:0.875rem;`;
          const rect = el.getBoundingClientRect();
          tip.style.top = window.scrollY + rect.top - 30 + "px";
          tip.style.left = window.scrollX + rect.left + "px";
          document.body.appendChild(tip);
        };

        el.addEventListener("mouseenter", showTip);
        el.addEventListener("focus", showTip);
        el.addEventListener("mouseleave", removeTooltip);
        el.addEventListener("blur", removeTooltip);
      });
  }

  // ---------- Language switching ----------
  function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    updateRTL(lang);
    addTooltips();
  }

  // ---------- Modals ----------
  function showOnboarding() {
    const existingModal = document.getElementById("onboarding-modal");
    if (existingModal) existingModal.remove();

    const modal = document.createElement("div");
    modal.id = "onboarding-modal";
    modal.className = "fixed inset-0 bg-black/50 z-50 flex items-center justify-center";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.innerHTML = `
      <div class="bg-white p-6 rounded-xl max-w-md text-center shadow-2xl">
        <h3 class="text-xl font-bold mb-4">Welcome!</h3>
        <p class="mb-4">${escapeHTML(t(currentLang, "onboarding"))}</p>
        <button id="close-onboarding" class="btn-primary">Close</button>
      </div>`;
    document.body.appendChild(modal);

    const closeBtn = document.getElementById("close-onboarding");
    closeBtn.focus();
    closeBtn.onclick = () => modal.remove();
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };
  }

  function showFAQ() {
    const existingModal = document.getElementById("faq-modal");
    if (existingModal) existingModal.remove();

    const modal = document.createElement("div");
    modal.id = "faq-modal";
    modal.className = "fixed inset-0 bg-black/50 z-50 flex items-center justify-center";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.innerHTML = `
      <div class="bg-white p-6 rounded-xl max-w-md shadow-2xl">
        <h3 class="text-xl font-bold mb-4">FAQ</h3>
        <ul class="space-y-3 text-left">
          <li>${escapeHTML(t(currentLang, "faq"))}</li>
        </ul>
        <button id="close-faq" class="btn-primary mt-4">Close</button>
      </div>`;
    document.body.appendChild(modal);

    const closeBtn = document.getElementById("close-faq");
    closeBtn.focus();
    closeBtn.onclick = () => modal.remove();
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };
  }

  function backupProgress() {
    alert(t(currentLang, "backup"));
  }

  function syncProgressAction() {
    alert(t(currentLang, "sync"));
  }

  // ---------- Main game content ----------
  container.innerHTML = `
    <section id="life-skills-game" class="card fade-in max-w-2xl mx-auto my-8 p-6" role="region" aria-label="Life Skills Game">
      <h2 class="text-3xl font-bold text-primary flex items-center gap-2 mb-6">
        <svg class="h-8 w-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12H9v-2h2v2zm0-4H9V7h2v3z"/>
        </svg>
        ${escapeHTML(t(currentLang, "title"))}
      </h2>
      <div id="life-skills-challenge" class="min-h-[200px]" aria-live="polite"></div>
      <button id="life-return" class="btn-primary mt-4">${escapeHTML(t(currentLang, "return"))}</button>
    </section>`;

  // Return button - use hash navigation
  const returnBtn = document.getElementById("life-return");
  if (returnBtn) {
    returnBtn.onclick = () => {
      window.location.hash = "/dashboard";
      if (window.showDashboard) window.showDashboard();
    };
  }

  // ---------- Settings Button (guard against duplicates) ----------
  if (!document.getElementById("life-settings-btn")) {
    const settingsBtn = document.createElement("button");
    settingsBtn.id = "life-settings-btn";
    settingsBtn.textContent = "⚙️";
    settingsBtn.setAttribute("aria-label", "Settings");
    settingsBtn.className =
      "fixed top-6 right-6 z-40 text-2xl bg-white border border-gray-300 rounded-full w-12 h-12 cursor-pointer hover:bg-gray-100 transition-colors";
    document.body.appendChild(settingsBtn);

    if (!document.getElementById("life-settings-modal")) {
      const modal = document.createElement("div");
      modal.id = "life-settings-modal";
      modal.className =
        "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-green-600 rounded-xl p-6 z-50 min-w-[320px] shadow-2xl hidden";
      modal.innerHTML = `
        <h3 class="text-lg font-bold mb-4">Game Settings</h3>
        <div class="space-y-3">
          <label class="block">
            <span class="text-sm">Language:</span>
            <select id="language-select" class="ml-2 border rounded px-2 py-1">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="ar">Arabic</option>
            </select>
          </label>
        </div>
        <hr class="my-4">
        <div class="space-y-2">
          <button id="onboarding-btn" class="btn-secondary text-sm w-full">Onboarding</button>
          <button id="faq-btn" class="btn-secondary text-sm w-full">FAQ</button>
          <button id="backup-btn" class="btn-secondary text-sm w-full">Backup Progress</button>
          <button id="sync-btn" class="btn-secondary text-sm w-full">Sync Progress</button>
        </div>
        <button id="close-settings" class="btn-primary mt-4 w-full">Close</button>`;
      document.body.appendChild(modal);

      settingsBtn.onclick = () => {
        modal.classList.remove("hidden");
        addTooltips();
      };

      modal.querySelector("#close-settings").onclick = () => modal.classList.add("hidden");
      modal.querySelector("#onboarding-btn").onclick = showOnboarding;
      modal.querySelector("#faq-btn").onclick = showFAQ;
      modal.querySelector("#backup-btn").onclick = backupProgress;
      modal.querySelector("#sync-btn").onclick = syncProgressAction;
      modal.querySelector("#language-select").onchange = (e) => setLanguage(e.target.value);
    }
  }

  // ---------- Game Logic ----------
  function startLifeSkillsGame() {
    const area = document.getElementById("life-skills-challenge");
    if (!area) return;

    const scenarios = [
      "Make a healthy breakfast for Daisy.",
      "Help Winnie tidy her room.",
      "Remind Andy to take his medication.",
    ];

    let current = 0;
    let progress = loadProgress();

    // Resume from saved progress
    if (progress.length > 0) {
      current = Math.min(progress.length, scenarios.length);
      progress.forEach((item) => {
        area.innerHTML += `<p class="mb-2 text-green-600">✔️ ${escapeHTML(item.scenario)}</p>`;
      });
    }

    function renderScenario() {
      if (current >= scenarios.length) {
        area.innerHTML += `<p class="text-green-600 font-bold mt-4">${escapeHTML(t(currentLang, "complete"))}</p>`;
        // Save to Firebase if user is logged in
        if (userData && userData.userId) {
          import("/firebase.js")
            .then(
              (mod) =>
                mod.saveLessonPlan &&
                mod.saveLessonPlan("life-skills-game", userData.userId, JSON.stringify(progress)),
            )
            .catch(console.error);
        }
        return;
      }

      area.innerHTML += `
        <div class="mt-4 p-4 bg-green-50 rounded-lg">
          <p class="mb-2 font-medium">${escapeHTML(scenarios[current])}</p>
          <button id="life-task-btn" class="btn-primary">Complete Task</button>
          <div id="life-feedback" class="mt-2" aria-live="polite"></div>
        </div>`;

      const taskBtn = document.getElementById("life-task-btn");
      taskBtn.focus();

      taskBtn.onkeydown = (e) => {
        if (e.key === "Enter") taskBtn.click();
      };

      taskBtn.onclick = () => {
        const feedbackEl = document.getElementById("life-feedback");
        feedbackEl.innerHTML = `<span class="text-green-600 font-semibold">${escapeHTML(t(currentLang, "taskComplete"))}</span>`;
        progress.push({ scenario: scenarios[current], completed: true });
        saveProgress(progress);
        current++;
        setTimeout(renderScenario, 1200);
      };
    }

    try {
      renderScenario();
    } catch (e) {
      console.error("Game error:", e);
      area.innerHTML = `<p class="text-red-500">Error loading game. Please refresh.</p>`;
    }
  }

  // Initialize
  addTooltips();
  startLifeSkillsGame();
}
