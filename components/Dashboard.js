// --- Advanced Feature Upgrades & TODOs ---
// Accessibility: ARIA roles, keyboard navigation
// Onboarding/help modal
// Backup/sync logic
// Gamification: challenges, leaderboard
// Educator/parent feedback
// Analytics integration
// Error boundaries
// UI settings modal
// Comprehensive dashboard logic

function showOnboarding() {
  const modal = document.createElement('div');
  modal.className = 'onboarding-modal';
  modal.innerHTML = `<h2>Welcome to Dashboard!</h2><p>View your progress and manage your learning. Use the settings to customize your experience.</p><button id='close-onboarding'>Close</button>`;
  document.body.appendChild(modal);
  document.getElementById('close-onboarding').onclick = () => modal.remove();
}

function setAccessibility() {
  const dashEl = document.getElementById('dashboard');
  if (dashEl) {
    dashEl.setAttribute('role', 'region');
    dashEl.setAttribute('aria-label', 'Dashboard');
  }
}

function backupProgress(progress) {
  localStorage.setItem('dashboardProgress', JSON.stringify(progress));
}
function syncProgress() {
  return JSON.parse(localStorage.getItem('dashboardProgress') || '{}');
}

function updateLeaderboard(score) {
  // ...leaderboard logic...
}

function sendFeedback(feedback) {
  // ...send feedback to server...
}

function logEvent(event) {
  // ...analytics logic...
}

function safeRun(fn) {
  try { fn(); } catch (e) { console.error('Error:', e); }
}

function showSettings() {
  // ...settings modal logic...
}

function startDashboard() {
  showOnboarding();
  setAccessibility();
  // ...dashboard logic...
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', startDashboard);
}
import { applyHeadingAnimation, applyButtonAnimation, setAriaAttributes } from '../utils/uiUtils.js';

export function showDashboard(container, data = {}) {
  // Dashboard layout
  // Modular UI templates
  function navButton(label, route, active = false) {
    return `<button class="nav-btn${active ? " active" : ""}" onclick="window.route('${route}')" aria-label="${label}">${label}</button>`;
  }

  function helpButton() {
    return "<button id=\"dashboard-help\" aria-label=\"Help\" title=\"Help\">❓</button>";
  }
  function privacyNotice() {
    return "<div id=\"privacy-notice\" style=\"font-size:0.9em;color:#555;margin:8px 0;\">Your data is private and only used for educational purposes.</div>";
  }
  // --- i18n & Theme ---
  const i18n = {
    en: {
      dashboard: "Dashboard",
      feedback: "Give Feedback",
      rate: "Rate your experience:",
      privacy: "Your data is private and only used for educational purposes.",
      achievements: "Achievements",
      progress: "Progress",
      recent: "Recent Activities",
      educator: "Educator Feedback",
      parent: "Parent Feedback",
      theme: "Theme",
      light: "Light",
      dark: "Dark",
      charts: "Progress Charts",
      tips: "Personalized Tips",
      help: "Help"
    },
    es: {
      dashboard: "Panel",
      feedback: "Dar Retroalimentación",
      rate: "Califica tu experiencia:",
      privacy: "Tus datos son privados y solo se usan con fines educativos.",
      achievements: "Logros",
      progress: "Progreso",
      recent: "Actividades Recientes",
      educator: "Retroalimentación del Educador",
      parent: "Retroalimentación de Padres",
      theme: "Tema",
      light: "Claro",
      dark: "Oscuro",
      charts: "Gráficos de Progreso",
      tips: "Consejos Personalizados",
      help: "Ayuda"
    }
  };
  let currentLang = 'en';
  function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
    renderDashboard();
  }
  function setTheme(theme) {
    document.body.className = theme;
  }
  // --- Responsive, Accessible, Modular Dashboard ---
  function renderDashboard() {
    container.innerHTML = `
      <div class="dashboard-bg" style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:-1;background:url('/assets/backgrounds/analytics-bg.svg') center/cover no-repeat;"></div>
      <section id="dashboard" class="card shadow-xl p-8 rounded-2xl mx-auto my-16 max-w-3xl relative bg-white/80 backdrop-blur-lg" role="region" aria-label="${i18n[currentLang].dashboard}">
        <div class="flex justify-between items-center mb-4">
          <h2 id="dashboard-heading" class="text-3xl font-bold text-primary">${i18n[currentLang].dashboard}</h2>
          <div>
            <label for="theme-select">${i18n[currentLang].theme}:</label>
            <select id="theme-select">
              <option value="light">${i18n[currentLang].light}</option>
              <option value="dark">${i18n[currentLang].dark}</option>
            </select>
            <label for="lang-select" class="ml-2">Language:</label>
            <select id="lang-select">
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
            <button id="dashboard-help" aria-label="${i18n[currentLang].help}" title="${i18n[currentLang].help}">❓</button>
          </div>
        </div>
        <div id="privacy-notice" style="font-size:0.9em;color:#555;margin:8px 0;">${i18n[currentLang].privacy}</div>
        <div id="dashboard-charts" class="mb-4 flex gap-6 justify-center">
          <div class="chart animated-charts" style="width:180px;height:120px;background:#e0ffe7;border-radius:16px;box-shadow:0 2px 8px #0001;"></div>
          <div class="progress-ring animated-charts" style="width:120px;height:120px;border-radius:50%;background:#ffe0f7;box-shadow:0 2px 8px #0001;"></div>
        </div>
        <div class="mb-4">
          <h3>${i18n[currentLang].achievements}</h3>
          <div id="achievements-list" class="flex gap-2"></div>
        </div>
        <div class="mb-4">
          <h3>${i18n[currentLang].progress}</h3>
          <div id="progress-bar" style="height:24px;background:#e0e0e0;border-radius:12px;overflow:hidden;"><div id="progress-fill" style="height:100%;width:60%;background:#1976d2;"></div></div>
        </div>
        <div class="mb-4">
          <h3>${i18n[currentLang].recent}</h3>
          <ul id="recent-activities" class="list-disc pl-6"></ul>
        </div>
        <div class="mb-4">
          <h3>${i18n[currentLang].tips}</h3>
          <div id="dashboard-prompt" class="italic text-secondary"></div>
        </div>
        <button id="dashboard-feedback" class="btn-primary nav-btn" aria-label="${i18n[currentLang].feedback}">${i18n[currentLang].feedback}</button>
        <form id="feedback-form" class="mt-6 flex flex-col gap-2">
          <label htmlFor="emoji-rating">${i18n[currentLang].rate}</label>
          <div id="emoji-rating" class="flex gap-2">
            <button type="button" class="emoji-btn" aria-label="Great">😊</button>
            <button type="button" class="emoji-btn" aria-label="Okay">😐</button>
            <button type="button" class="emoji-btn" aria-label="Bad">😞</button>
          </div>
          <textarea id="feedback-comment" rows="2" placeholder="Your feedback..." class="input"></textarea>
          <button type="submit" class="btn-secondary">Submit</button>
        </form>
      </section>
    `;
    // Animate heading and button
    applyHeadingAnimation(document.getElementById('dashboard-heading'));
    applyButtonAnimation(document.getElementById('dashboard-feedback'));
    document.querySelectorAll('.emoji-btn').forEach(btn => applyButtonAnimation(btn));
    applyButtonAnimation(document.querySelector('button.btn-secondary'));
    // Accessibility
    setAriaAttributes(document.getElementById('dashboard'), { role: 'region', label: i18n[currentLang].dashboard });
    // Feedback form interactivity
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
      feedbackForm.onsubmit = function(e) {
        e.preventDefault();
        alert('Thank you for your feedback!');
      };
    }
    // Theme and language switching
    const themeSelect = container.querySelector('#theme-select');
    if (themeSelect) themeSelect.onchange = (e) => setTheme(e.target.value);
    const langSelect = container.querySelector('#lang-select');
    if (langSelect) langSelect.onchange = (e) => setLanguage(e.target.value);
    // Help/info button
    const dashboardHelpBtn = container.querySelector('#dashboard-help');
    if (dashboardHelpBtn) {
      dashboardHelpBtn.onclick = () => {
        alert(i18n[currentLang].help + ': Use the navigation buttons to explore learning domains. All features are accessible and safe.');
      };
    }
    // Rotating educational prompt
    const prompts = [
      "Tip: Try Calm Space for self-regulation activities.",
      "Tip: Achievements unlock new learning games!",
      "Tip: All your progress is private and educator-reviewed.",
      "Tip: Use the Educator tab for lesson plans and support.",
    ];
    let promptIndex = 0;
    function showPrompt() {
      const dashboardPrompt = document.getElementById("dashboard-prompt");
      if (dashboardPrompt) {
        dashboardPrompt.textContent = prompts[promptIndex % prompts.length];
      }
      promptIndex++;
      setTimeout(showPrompt, 7000);
    }
    showPrompt();
    // Achievements, progress, recent activities, educator/parent feedback
    const achievements = ["First Login", "Completed Money Skills", "Shared Journal", "Top Score"];
    const achievementsList = document.getElementById('achievements-list');
    if (achievementsList) {
      achievements.forEach(a => {
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = a;
        achievementsList.appendChild(badge);
      });
    }
    // Progress bar (simulate with random progress)
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
      progressFill.style.width = (60 + Math.floor(Math.random() * 40)) + '%';
    }
    // Recent activities
    const recent = ["Played Money Skills", "Completed Calm Space", "Joined Group Project", "Unlocked Badge"];
    const recentList = document.getElementById('recent-activities');
    if (recentList) {
      recent.forEach(r => {
        const li = document.createElement('li');
        li.textContent = r;
        recentList.appendChild(li);
      });
    }
    // Keyboard navigation for nav buttons
    Array.from(container.querySelectorAll("button,canvas")).forEach((el) => {
      el.tabIndex = 0;
    });
  }
  renderDashboard();
  animateCharacters();
}
function animateCharacters() {
// --- Data Visualization Example ---
// You can add chart.js or similar for real charts
  ["daisy", "winnie", "andy"].forEach((name, i) => {
    const canvas = document.getElementById(`${name}-anim`);
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = ["#ffe4e1", "#90caf9", "#e0f7fa"][i];
      ctx.beginPath();
      ctx.arc(50, 50, 40, 0, 2 * Math.PI);
      ctx.fill();
      ctx.font = "16px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText(name.charAt(0).toUpperCase() + name.slice(1), 25, 55);
    }
  });
}
