// Communication Game Module — consolidated & cleaned
// Practice communication skills with animated feedback

// ============== SHARED UTILITIES (top-level scope) ==============

// Escape HTML to prevent XSS
function escapeHTML(str = "") {
  return str.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
}

// Input validation - check real characters, not escaped
function validateInput(input) {
  const forbidden = ["<", ">", "{", "}", "$", ";"];
  return !forbidden.some((char) => input.includes(char));
}

// Progress tracking - shared at module level
function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem("commGameProgress") || "[]");
  } catch {
    return [];
  }
}

function saveProgress(data) {
  localStorage.setItem("commGameProgress", JSON.stringify(data));
}

function getAchievements() {
  try {
    return JSON.parse(localStorage.getItem("commGameAchievements") || "[]");
  } catch {
    return [];
  }
}

// RTL language support
const RTL_LANGS = ["ar", "he", "fa", "ur"];

function updateRTL(lang) {
  document.documentElement.dir = RTL_LANGS.includes(lang) ? "rtl" : "ltr";
}

// Speech synthesis with proper BCP-47 tags
function getSpeechLang(lang) {
  const langMap = { en: "en-US", es: "es-ES", zh: "zh-CN", ar: "ar-SA" };
  return langMap[lang] || "en-US";
}

// ============== i18n TRANSLATIONS ==============
const i18n = {
  en: {
    greet: "Greet Daisy warmly and sincerely.",
    askHelp: "Ask Winnie for help in a creative way.",
    thank: "Thank Andy for his support with a heartfelt message.",
    challenge1: "Spread Kindness: Make Daisy smile three different ways!",
    challenge2: "Gratitude Guru: Thank Andy with a creative compliment!",
    challenge3: "Teamwork Triumph: Collaborate with Winnie to solve a fun puzzle!",
    achievement: "Achievement unlocked!",
    error: "Oops! Something went wrong. Please try again.",
    invalid: "Invalid input. Please avoid special characters.",
    complete: "Game complete! Well done.",
    return: "Return to Dashboard",
    settings: "Game Settings",
    parentFeedback: "Parent/Guardian Feedback",
    challenges: "Challenges & Leaderboard",
    theme: "Theme Customization",
    signAvatar: "Sign Language Avatar",
    contentCreate: "Custom Content Creation",
    hint: "Hint: Try greeting Daisy with a smile!",
    onboarding: "Welcome! Let's explore communication together.",
    onboardingTour: "Take a guided tour of the game.",
    help: "Need help? Hover over any button for tips.",
    backup: "Backup your progress to the cloud.",
    sync: "Sync your achievements with your educator.",
    faq: "FAQ: Find answers to common questions.",
    placeholder: "Feature coming soon!",
  },
  es: {
    greet: "Saluda a Daisy con calidez y sinceridad.",
    askHelp: "Pide ayuda a Winnie de forma creativa.",
    thank: "Agradece a Andy con un mensaje sincero.",
    challenge1: "Difunde Bondad: ¡Haz sonreír a Daisy de tres maneras!",
    challenge2: "Gurú de Gratitud: ¡Agradece a Andy con un cumplido creativo!",
    challenge3: "Triunfo en Equipo: ¡Colabora con Winnie para resolver un rompecabezas!",
    achievement: "¡Logro desbloqueado!",
    error: "¡Ups! Algo salió mal. Por favor, inténtalo de nuevo.",
    invalid: "Entrada no válida. Por favor, evita caracteres especiales.",
    complete: "¡Juego completado! Bien hecho.",
    return: "Volver al Panel",
    onboarding: "¡Bienvenido! Exploremos la comunicación juntos.",
    onboardingTour: "Haz un recorrido guiado del juego.",
    help: "¿Necesitas ayuda? Pasa el cursor sobre cualquier botón.",
    backup: "Respalda tu progreso en la nube.",
    sync: "Sincroniza tus logros con tu educador.",
    faq: "FAQ: Encuentra respuestas a preguntas comunes.",
    placeholder: "¡Función próximamente!",
  },
  zh: {
    greet: "真诚地问候黛西。",
    askHelp: "以有创意的方式向温妮寻求帮助。",
    thank: "用真挚的话语感谢安迪。",
    challenge1: "传播善意：用三种不同的方式让黛西微笑！",
    challenge2: "感恩大师：用创意赞美感谢安迪！",
    challenge3: "团队胜利：与温妮合作解决有趣的谜题！",
    achievement: "成就解锁！",
    error: "哎呀！出了点问题。请再试一次。",
    invalid: "输入无效。请避免特殊字符。",
    complete: "游戏完成！干得好。",
    return: "返回仪表板",
    onboarding: "欢迎！让我们一起探索沟通。",
    onboardingTour: "参加游戏导览。",
    help: "需要帮助？将鼠标悬停在任何按钮上以获取提示。",
    backup: "将进度备份到云端。",
    sync: "与教育者同步成就。",
    faq: "常见问题：找到常见问题的答案。",
    placeholder: "功能即将推出！",
  },
};

// i18n helper with fallback
function t(lang, key) {
  return (i18n[lang] && i18n[lang][key]) || i18n.en[key] || key;
}

// ============== MAIN EXPORT FUNCTION ==============
export function showCommunicationGame(container, userData = {}) {
  if (!container) return;

  let currentLang = "en";

  // ---------- Tooltips with scroll offset ----------
  function removeTooltip() {
    const existing = document.getElementById("active-tooltip");
    if (existing) existing.remove();
  }

  function addTooltips() {
    document
      .querySelectorAll("#communication-game button, #communication-game [aria-label]")
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

  // ---------- Text-to-Speech ----------
  function speak(text) {
    if ("speechSynthesis" in window) {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = getSpeechLang(currentLang);
      window.speechSynthesis.speak(utter);
    }
  }

  // ---------- Accessibility options ----------
  const accessibilityOptions = {
    highContrast: false,
    fontSize: "medium",
  };

  function setAccessibility(option, value) {
    accessibilityOptions[option] = value;
    if (option === "highContrast") {
      document.body.classList.toggle("high-contrast", value);
    }
    if (option === "fontSize") {
      document.body.style.fontSize = value;
    }
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
        <h3 class="text-xl font-bold mb-4">${escapeHTML(t(currentLang, "onboardingTour"))}</h3>
        <p class="mb-4">${escapeHTML(t(currentLang, "onboarding"))}</p>
        <ul class="text-left mb-4 space-y-2">
          <li>• ${escapeHTML(t(currentLang, "help"))}</li>
          <li>• ${escapeHTML(t(currentLang, "faq"))}</li>
        </ul>
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
          <li><strong>How do I play?</strong> Answer prompts and complete challenges!</li>
          <li><strong>How do I change language?</strong> Use the settings panel.</li>
          <li><strong>How do I backup progress?</strong> Use the backup button in settings.</li>
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

  // ---------- Backup & Sync ----------
  function backupProgress() {
    alert(t(currentLang, "backup"));
  }

  function syncProgressAction() {
    alert(t(currentLang, "sync"));
  }

  // ---------- Update progress display ----------
  function updateProgressDisplay() {
    const summary = document.querySelector("#progress-summary");
    if (summary) {
      const progress = loadProgress();
      summary.textContent = progress.length
        ? `Completed: ${progress.length} steps.`
        : "No progress yet.";
    }
  }

  // ---------- Main game content ----------
  container.innerHTML = `
    <section id="communication-game" class="card fade-in max-w-2xl mx-auto my-8 p-6" role="region" aria-label="Communication Game">
      <h2 class="text-3xl font-bold text-primary flex items-center gap-2 mb-6">
        <svg class="h-8 w-8 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5zm2 2v2h2V7H6zm4 0v2h2V7h-2z"/>
        </svg>
        Communication Game
      </h2>
      <div id="conversation-area" class="min-h-[200px]" aria-live="polite"></div>
      <button id="comm-return" class="btn-primary mt-4">Return to Dashboard</button>
    </section>`;

  // Return button - use hash navigation instead of undefined window.route
  const returnBtn = document.getElementById("comm-return");
  if (returnBtn) {
    returnBtn.onclick = () => {
      window.location.hash = "/dashboard";
      if (window.showDashboard) window.showDashboard();
    };
  }

  // ---------- Settings Button (guard against duplicates) ----------
  if (!document.getElementById("comm-settings-btn")) {
    const settingsBtn = document.createElement("button");
    settingsBtn.id = "comm-settings-btn";
    settingsBtn.textContent = "⚙️";
    settingsBtn.setAttribute("aria-label", "Settings");
    settingsBtn.className =
      "fixed top-6 right-6 z-40 text-2xl bg-white border border-gray-300 rounded-full w-12 h-12 cursor-pointer hover:bg-gray-100 transition-colors";
    document.body.appendChild(settingsBtn);

    // Settings modal (guard against duplicates)
    if (!document.getElementById("comm-settings-modal")) {
      const modal = document.createElement("div");
      modal.id = "comm-settings-modal";
      modal.className =
        "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-blue-600 rounded-xl p-6 z-50 min-w-[320px] shadow-2xl hidden";
      modal.innerHTML = `
        <h3 class="text-lg font-bold mb-4">Game Settings</h3>
        <div class="space-y-3">
          <label class="flex items-center gap-2">
            <input type="checkbox" id="high-contrast-toggle"> High Contrast
          </label>
          <label class="block">
            <span class="text-sm">Font Size:</span>
            <select id="font-size-select" class="ml-2 border rounded px-2 py-1">
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="x-large">Extra Large</option>
            </select>
          </label>
          <label class="block">
            <span class="text-sm">Language:</span>
            <select id="language-select" class="ml-2 border rounded px-2 py-1">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="zh">Chinese</option>
            </select>
          </label>
        </div>
        <hr class="my-4">
        <div class="space-y-2">
          <button id="hint-btn" class="btn-secondary text-sm w-full">Show Hint</button>
          <button id="onboarding-btn" class="btn-secondary text-sm w-full">Onboarding</button>
          <button id="faq-btn" class="btn-secondary text-sm w-full">FAQ</button>
          <button id="backup-btn" class="btn-secondary text-sm w-full">Backup Progress</button>
          <button id="sync-btn" class="btn-secondary text-sm w-full">Sync Progress</button>
        </div>
        <div class="mt-4">
          <h4 class="font-semibold">Progress</h4>
          <div id="progress-summary" class="text-sm text-gray-600">No progress yet.</div>
        </div>
        <button id="close-settings" class="btn-primary mt-4 w-full">Close</button>`;
      document.body.appendChild(modal);

      // Settings button handlers
      settingsBtn.onclick = () => {
        modal.classList.remove("hidden");
        updateProgressDisplay();
        addTooltips();
      };

      modal.querySelector("#close-settings").onclick = () => modal.classList.add("hidden");
      modal.querySelector("#onboarding-btn").onclick = showOnboarding;
      modal.querySelector("#faq-btn").onclick = showFAQ;
      modal.querySelector("#backup-btn").onclick = backupProgress;
      modal.querySelector("#sync-btn").onclick = syncProgressAction;
      modal.querySelector("#hint-btn").onclick = () => alert(t(currentLang, "hint"));

      // Accessibility handlers
      modal.querySelector("#high-contrast-toggle").onchange = (e) =>
        setAccessibility("highContrast", e.target.checked);
      modal.querySelector("#font-size-select").onchange = (e) =>
        setAccessibility("fontSize", e.target.value);
      modal.querySelector("#language-select").onchange = (e) => setLanguage(e.target.value);
    }
  }

  // ---------- Game Logic ----------
  function startCommunicationGame() {
    const area = document.getElementById("conversation-area");
    if (!area) return;

    const prompts = [t(currentLang, "greet"), t(currentLang, "askHelp"), t(currentLang, "thank")];
    const answers = ["hello", "help", "thank"];
    const feedbacks = [
      'Daisy: "You made my day!"',
      'Winnie: "That was a creative request!"',
      'Andy: "Your gratitude means a lot!"',
    ];

    let current = 0;
    let progress = loadProgress();

    // Resume from saved progress
    if (progress.length > 0) {
      current = Math.min(progress.length, prompts.length - 1);
      progress.forEach((item) => {
        area.innerHTML += `<p class="mb-2">${escapeHTML(item.prompt)} <strong>${escapeHTML(item.response)}</strong> - ${item.correct ? "✔️" : "❌"}</p>`;
      });
    }

    function renderPrompt() {
      if (current >= prompts.length) {
        area.innerHTML += `<p class="text-green-600 font-bold mt-4">${escapeHTML(t(currentLang, "complete"))}</p>`;
        speak(t(currentLang, "complete"));
        // Save to Firebase if user is logged in
        if (userData && userData.userId) {
          import("/firebase.js")
            .then(
              (mod) =>
                mod.saveLessonPlan &&
                mod.saveLessonPlan("communication-game", userData.userId, JSON.stringify(progress)),
            )
            .catch(console.error);
        }
        return;
      }

      area.innerHTML += `
        <div class="mt-4 p-4 bg-blue-50 rounded-lg">
          <p class="mb-2 font-medium">${escapeHTML(prompts[current])}</p>
          <input id="comm-input" type="text" placeholder="Type your response..." class="w-full border rounded px-3 py-2 mb-2" aria-label="Type your response" />
          <button id="comm-submit" class="btn-primary">Send</button>
          <div id="comm-feedback" class="mt-2" aria-live="polite"></div>
        </div>`;

      const input = document.getElementById("comm-input");
      const submit = document.getElementById("comm-submit");
      input.focus();

      input.onkeydown = (e) => {
        if (e.key === "Enter") submit.click();
      };

      submit.onclick = () => {
        const val = input.value.trim().toLowerCase();
        const feedbackEl = document.getElementById("comm-feedback");

        if (!validateInput(val)) {
          feedbackEl.innerHTML = `<span class="text-red-500 font-semibold">${escapeHTML(t(currentLang, "invalid"))}</span>`;
          speak(t(currentLang, "invalid"));
          return;
        }

        let feedback;
        if (val.includes(answers[current])) {
          feedback = feedbacks[current];
          progress.push({ prompt: prompts[current], response: val, correct: true });
          saveProgress(progress);
          speak(feedback);
          feedbackEl.innerHTML = `<span class="text-green-600 font-semibold">${escapeHTML(feedback)}</span>`;
          current++;
          setTimeout(renderPrompt, 1200);
        } else {
          feedback = "Try again!";
          progress.push({ prompt: prompts[current], response: val, correct: false });
          saveProgress(progress);
          speak(feedback);
          feedbackEl.innerHTML = `<span class="text-orange-500 font-semibold">${feedback}</span>`;
        }

        updateProgressDisplay();
      };
    }

    try {
      renderPrompt();
    } catch (e) {
      console.error("Game error:", e);
      area.innerHTML = `<p class="text-red-500">${escapeHTML(t(currentLang, "error"))}</p>`;
    }
  }

  // Initialize
  addTooltips();
  startCommunicationGame();
}
