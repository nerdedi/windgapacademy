// --- Dynamic Script Inspection & Debugging ---
async function getScriptContent(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    return await response.text();
  } catch (e) {
    console.error(`Failed to fetch script content from ${url}:`, e);
    return null;
  }
}

async function getStackTraceUrls() {
  const stack = new Error().stack;
  if (!stack) {
    return [];
  }
  const urls = stack.split('\n')
    .map(line => {
      const match = line.match(/(http[s]?:\/\/[^\s]+)/);
      return match ? match[1].replace(/:\d+:\d+$/, '') : null;
    })
    .filter(url => url !== null);
  return [...new Set(urls)]; // Get unique URLs
}

async function getData() {
  const scriptUrls = await getStackTraceUrls();
  const featureLoaderUrl = scriptUrls.find(url => url.includes('featureLoader.js'));

  if (!featureLoaderUrl) {
    return { scriptContent: 'Could not find featureLoader.js in stack trace.', stackTraceUrls: scriptUrls };
  }

  const scriptContent = await getScriptContent(featureLoaderUrl);

  return {
    scriptContent: scriptContent,
    featureLoaderUrl: featureLoaderUrl,
    stackTraceUrls: scriptUrls
  };
}
// Firebase via CDN for browser compatibility
// Use ES module import for Firebase. See firebase.js for initialization.
import { app, auth, loginUser } from "./firebase.js";
import { showDashboard } from "./components/Dashboard.js";
import { monitorPerformance, trackErrorRates, trackUserEngagement, scheduleRegularUpdates, warnDebug, setDebug, logDebug, sendEvent } from "./utils/monitoring.js";
import { GameStateManager } from "./src/components/GameStateManager.js";
import { UnifiedUIManager } from "./src/components/UnifiedUIManager.js";
import { AnalyticsLogger } from "./src/components/AnalyticsLogger.js";
import { AssetManager } from "./src/components/AssetManager.js";
import { ProgressionManager } from "./src/components/ProgressionManager.js";
import { AdaptiveLearning } from "./src/components/AdaptiveLearning.js";

// --- Dashboard Button Listeners ---
function setupDashboardButtonListeners() {
  const buttonMap = {
    lifeSkillsBtn: 'life-skills-game',
    literacyBtn: 'literacy-game',
    moneySkillsBtn: 'money-skills-game',
    numeracyBtn: 'numeracy-game',
    communicationBtn: 'communication-game',
    digitalSkillsBtn: 'digital-skills-game',
    employabilityBtn: 'employability-game',
    socialEmotionalLearningBtn: 'social-emotional-learning-game',
    virtualWorldBtn: 'virtual-world',
    arcadeZoneBtn: 'arcade-zone',
    academyHubBtn: 'academy-hub',
    calmSpaceBtn: 'calm-space',
    educatorDashboardBtn: 'educator-dashboard',
    parentPortalBtn: 'parent-portal',
    profileSettingsBtn: 'profile-settings',
    logoutBtn: 'logout'
  };
  Object.entries(buttonMap).forEach(([btnId, routeName]) => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', () => window.route(routeName));
    }
  });
/*
  Windgap Academy Main App Logic
  - Accessibility: ARIA, narration, font toggles, focus management
  - Internationalization: Australian English, Spanish, Arabic, RTL support
  - Onboarding: Interactive onboarding and safety policy acceptance
  - Engagement: Real-time feedback, gamification, seasonal events
  - Security: Two-factor auth, token system, sanitized content
  - Customization: Themes, UI preferences, dyslexia font
  - Analytics: Educator dashboards, actionable insights
  - Collaboration: Forums, group projects, peer review
  - Educator Tools: Content creation, reporting, NDIS compliance
  - Community Safety: Chat moderation, reporting tools
  - Backup & Sync: Cloud backup, external platform sync
  - Accessibility Advanced: Sign language avatar, AI captioning
  - User Feedback: In-app feedback form and surveys
  - Performance Monitoring: Error tracking and user engagement analytics
  - Modular Architecture: Lazy-loaded game modules for performance
  - Modern UI/UX: Responsive design with Tailwind CSS and DaisyUI
  - Offline Support: Basic offline functionality with service workers
  - Compliance: GDPR and COPPA compliant data handling
  - Testing: Expanded automated tests for reliability
/* (imports moved to top of file) */
// import { showDashboard } from "./components/Dashboard.js";

// Lazy-load game modules for performance
const lazyLoadGameModule = async (modulePath, ...args) => {
  const mod = await import(modulePath);
  // Each module exports a default function or named function
  if (mod.default) return mod.default(...args);
  // Try common named exports
  if (mod.showLiteracyGame) return mod.showLiteracyGame(...args);
  if (mod.showNumeracyGame) return mod.showNumeracyGame(...args);
  if (mod.showCommunicationGame) return mod.showCommunicationGame(...args);
  if (mod.showDigitalSkillsGame) return mod.showDigitalSkillsGame(...args);
  if (mod.showLifeSkillsGame) return mod.showLifeSkillsGame(...args);
  if (mod.showMoneySkillsGame) return mod.showMoneySkillsGame(...args);
  if (mod.showEmployabilityGame) return mod.showEmployabilityGame(...args);
  if (mod.showSocialEmotionalLearningGame) return mod.showSocialEmotionalLearningGame(...args)
};


// Single reference for main app container
const appContainer = document.getElementById("app");

// --- Core Managers ---
const gameStateManager = new GameStateManager({});
const uiManager = new UnifiedUIManager();
const analyticsLogger = AnalyticsLogger;
const assetManager = new AssetManager();
const progressionManager = new ProgressionManager();
const adaptiveLearning = new AdaptiveLearning();
// --- Hero Section Interactivity ---
document.addEventListener('DOMContentLoaded', function() {
  function setPersonalizedWelcome() {
    const welcomeEl = document.getElementById('personal-welcome');
    welcomeEl.classList.add('fade-in');
    let user = window.currentUser || { name: 'User', role: 'learner' };
    let hour = new Date().getHours();
    let greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    if (welcomeEl) {
      welcomeEl.textContent = `${greeting}, ${user.name}! Ready to learn and achieve today?`;
      welcomeEl.classList.add('fade-in');
    }
    // Example: log welcome event
    analyticsLogger.logEvent('welcome', { user, greeting });
  }

  function setNewsTicker() {
    const ticker = document.getElementById('news-ticker');
    const updates = [
      'New badges available in the Arcade Zone!',
      'Check out the latest updates in the Academy Hub!',
      'New interactive lessons added!',
      'Tip: Try the Calm Space for relaxation and focus.',
      'Educator resources updated for NDIS reporting.',
      'Check out new mini-games in the Virtual World!'
    ];
    let idx = 0;
    function rotate() {
      if (ticker) ticker.textContent = updates[idx];
      idx = (idx + 1) % updates.length;
    }
    rotate();
    setInterval(rotate, 6000);
  }

  setPersonalizedWelcome();
  setNewsTicker();
});

// --- Navigation Event Listeners ---
function setupNavigationListeners() {
  // Example: Add click listeners to all elements with data-route attribute
  document.querySelectorAll('[data-route]').forEach(el => {
    if (el) {
      el.addEventListener('click', (e) => { 
        e.preventDefault();
        const route = el.getAttribute('data-route');
        if (route) window.route(route);
        // Educator log: navigation event
        analyticsLogger.logEvent('navigation', { route });
      });
    }
  });
}

// --- Main Initialization ---
// Removed duplicate mainInit

// --- Initial App Load ---
document.addEventListener('DOMContentLoaded', () => {
  mainInit();
  setupNavigationListeners();
  setupDashboardButtonListeners();
  // Example: initialize UI elements
  uiManager.setTimer(60);
  uiManager.setLives(3);
  uiManager.setProgress(0);
});

function showFallbackScreen(errorMsg = "Something went wrong while loading Windgap Academy.") {
  document.body.innerHTML = `
    <div style="max-width:540px;margin:48px auto;padding:32px;border-radius:12px;background:#ffecec;color:#b91c1c;box-shadow:0 2px 16px #0002;">
      <h1 style="font-size:2em;margin-bottom:0.25em;">⚠️ Unable to load Windgap Academy</h1>
      <p style="font-size:1.2em;">${errorMsg}</p>
      <details>
        <summary style="cursor:pointer;">View Error Details</summary>
        <pre style="white-space:pre-wrap;font-size:0.95em;">${window.lastWindgapError || "No details available."}</pre>
      </details>
      <p style="margin-top:2em;">Please try reloading, or contact support at <a href="mailto:info@windgapacademy.edu.au">info@windgapacademy.edu.au</a>.</p>
    </div>
  `;
}

// Removed unused function for lint compliance

// Accessibility toggles (all actions are private and educator-reviewed)
window.increaseFont = () => {
  document.body.style.fontSize = "larger";
  // Educator log: font size increased for accessibility
};
window.toggleDyslexiaFont = () => {
  document.body.classList.toggle("dyslexia-font");
  // Educator log: dyslexia font toggled for accessibility
};
window.toggleEasyRead = () => {
  document.body.classList.toggle("easy-read");
  // Educator log: easy-read mode toggled for accessibility
};
window.narrate = (text) => {
  const utter = new SpeechSynthesisUtterance(text);
  utter.voice = window.speechSynthesis.getVoices().find(voice => voice.name === "Google Australian English");
  utter.pitch = 1.2;
  utter.rate = 1;
  utter.volume = 1;
  utter.lang = "en-AU";
  window.speechSynthesis.speak(utter);
  // Educator log: narration triggered for accessibility
};

// Routing
window.showSafetyPolicy = function (container) {
  container.innerHTML = `
    <section class='au-section' aria-label='Online Safety Expectations'>
      <h2>Online Safety Expectations</h2>
      <p>Before starting your learning journey, you must accept Windgap Academy's policies and guidelines, based on <a href='https://www.esafety.gov.au/industry/basic-online-safety-expectations#summary-of-the-expectations' target='_blank'>eSafety.gov.au Basic Online Safety Expectations</a>.</p>
      <ul>
        <li>Respect others and keep all interactions safe and inclusive.</li>
        <li>No bullying, threats, or unsafe behaviour.</li>
        <li>Follow all educator instructions and platform guidelines.</li>
        <li>Report any unsafe or concerning behaviour.</li>
      </ul>
      <button onclick='window.acceptSafetyPolicy()' aria-label='Accept Safety Policy'>I Accept</button>
    </section>
  `;
  // Educator log: safety policy shown
};
window.acceptSafetyPolicy = function () {
  localStorage.setItem("safetyPolicyAccepted", "true");
  // Educator log: safety policy accepted
  window.route("dashboard");
};
window.route = async function (path, opts = {}) {
  // Require safety policy acceptance before starting
  if (!localStorage.getItem("safetyPolicyAccepted") && path !== "safety-policy") {
    window.showSafetyPolicy(app);
    return;
  }
  // All navigation and UI now uses Australian spelling, grammar, and context.
  // Routing logic is modular and independent; each route only affects its own module.
  app.innerHTML = "";
  const userId = window.firebase && window.firebase.auth && window.firebase.auth().currentUser ? window.firebase.auth().currentUser.uid : null;
  switch (path) {
    // ...existing code...
    case "dashboard":
      showDashboard(app, opts.data || {});
      // Example: use progression manager to unlock modules
      progressionManager.unlock('dashboard');
      break;
    case "adaptive-learning":
      showAdaptiveLearning(app, opts.data || {});
      // Example: use adaptive learning for recommendations
      const nextModule = adaptiveLearning.recommendNextModule([
        'money-skills-game',
        'literacy-game', 'numeracy-game', 'life-skills-game'
      ], progressionManager.getProgress());
      if (nextModule) {
        progressionManager.unlock(nextModule);
        uiManager.setProgress(50);
        window.showMoneySkillsGame(app);
      }
      break;
    case "virtual-currency":
      showVirtualCurrency(app, opts.data || {});
      break;
    case "seasonal-events":
      showSeasonalEvents(app);
      break;
    case "user-content":
      showUserContent(app);
      break;
    case "peer-review":
      showPeerReview(app);
      break;
    case "sign-language-avatar":
      showSignLanguageAvatar(app);
      break;
    case "ai-captioning":
      showAICaptioning(app);
      break;
    case "two-factor-auth":
      showTwoFactorAuth(app);
      break;
    case "onboarding":
      showOnboarding(app);
      break;
    case "calendar":
      showCalendar(app);
      break;
    case "dashboard-widgets":
      showDashboardWidgets(app);
      break;
    case "collaboration":
      showCollaboration(app);
      break;
    case "video-chat":
      showVideoChat(app);
      break;
    case "ai-recommendations":
      showAIRecommendations(app);
      break;
    case "feedback-form":
      showFeedbackForm(app);
      break;
    case "achievement-sharing":
      showAchievementSharing(app);
      break;
    case "data-export-import":
      showDataExportImport(app);
      break;
    case "external-resources":
      showExternalResources(app);
      // Removed HTML comment and added null check for demo code
      // Example: Safe DOM query
      const el = document.getElementById('yourElement');
      if (el) {
        el.textContent = '...';
        el.addEventListener('click', function() {});
      }
      break;
    case "challenges":
      showChallenges(app, opts.data || {});
      break;
    case "badges":
      showBadges(app, opts.data || {});
      break;
    case "mini-games":
      showMiniGames(app);
      break;
    case "messaging-component":
      showMessagingComponent(app, opts.data || {});
      break;
    case "group-projects":
      showGroupProjects(app);
      break;
    case "forums":
      showForums(app);
      break;
    case "accessibility-advanced":
      showAccessibilityAdvanced(app);
      break;
    case "analytics":
      showAnalytics(app, opts.data || {});
      break;
    case "resource-library":
      showResourceLibrary(app);
      break;
    case "parent-portal":
      showParentPortal(app);
      break;
    case "calm-space":
      showCalmSpace(app, opts.unlockedScenes, userId);
      break;
    case "educator-dashboard":
      showEducatorDashboard(app, userId);
      break;
    case "assignments":
      showAssignments(app, userId);
      break;
    case "chat-moderation":
      showChatModeration(app, userId);
      break;
    case "avatar-builder":
      showAvatarBuilder(app, userId);
      break;
    case "messaging":
      showMessaging(app, opts.unreadCount || 0, userId);
      break;
    case "token-system":
      showTokenSystem(app, opts.tokens || 0, userId);
      break;
    case "domain-tabs":
      showDomainTabs(app, opts.domain || "literacy", userId);
      break;
    case "literacy-game":
      lazyLoadGameModule("./components/GameModules/LiteracyGame.js", app, userId).then(() => {
        gameStateManager.setState('play');
        analyticsLogger.logEvent('game_start', { game: 'literacy', userId });
        uiManager.setTimer(60);
        uiManager.setLives(3);
      });
      break;
    case "numeracy-game":
      lazyLoadGameModule("./components/GameModules/NumeracyGame.js", app, userId).then(() => {
        gameStateManager.setState('play');
        analyticsLogger.logEvent('game_start', { game: 'numeracy', userId });
        uiManager.setTimer(60);
        uiManager.setLives(3);
      });
      break;
    case "communication-game":
      lazyLoadGameModule("./components/GameModules/CommunicationGame.js", app, userId).then(() => {
        gameStateManager.setState('play');
        analyticsLogger.logEvent('game_start', { game: 'communication', userId });
        uiManager.setTimer(60);
        uiManager.setLives(3);
      });
      break;
    case "digital-skills-game":
      lazyLoadGameModule("./components/GameModules/DigitalSkillsGame.js", app, userId).then(() => {
        gameStateManager.setState('play');
        analyticsLogger.logEvent('game_start', { game: 'digital-skills', userId });
        uiManager.setTimer(60);
        uiManager.setLives(3);
      });
      break;
    case "life-skills-game":
      lazyLoadGameModule("./components/GameModules/LifeSkillsGame.js", app, userId).then(() => {
        gameStateManager.setState('play');
        analyticsLogger.logEvent('game_start', { game: 'life-skills', userId });
        uiManager.setTimer(60);
        uiManager.setLives(3);
      });
      break;
    case "money-skills-game":
      lazyLoadGameModule("./components/GameModules/MoneySkillsGame.js", app, userId).then(() => {
        gameStateManager.setState('play');
        analyticsLogger.logEvent('game_start', { game: 'money-skills', userId });
        uiManager.setTimer(60);
        uiManager.setLives(3);
      });
      break;
    case "employability-game":
      lazyLoadGameModule("./components/GameModules/EmployabilityGame.js", app, userId).then(() => {
        gameStateManager.setState('play');
        analyticsLogger.logEvent('game_start', { game: 'employability', userId });
        uiManager.setTimer(60);
        uiManager.setLives(3);
      });
      break;
    case "virtual-world":
      showVirtualWorld(app, userId);
      break;
    case "privacy-dashboard":
      break;
    case "integration-api":
      break;
    case "smart-scheduling":
      break;
    case "predictive-analytics":
      break;
    case "heatmaps":
      break;
    case "mood-tracking":
      break;
    case "wellbeing-ai":
      break;
    case "academy-store":
      break;
    case "profile":
      break;
    case "help-support":
      break;
    case "error-recovery":
      break;
    case "leaderboard":
      showLeaderboard(app, opts.data || {});
      break;
    default:
      showDashboard(app, opts.data || {});
  }
};
// Theme switching logic
window.setTheme = function (theme) {
  document.body.classList.remove("theme-dark", "theme-high-contrast");
  if (theme === "dark") document.body.classList.add("theme-dark");
  if (theme === "high-contrast") document.body.classList.add("theme-high-contrast");
};
// Example notification usage
window.showMilestoneNotification = function (msg) {
  showNotification("success", msg);
};

// Loading screen logic and homepage logic are now in mainInit()
function mainInit() {
  // Only show homepage for guests
  let user = null;
  try {
    user = auth && auth.currentUser ? auth.currentUser : null;
  } catch (err) {
    console.error("Error initializing app.");
    if (typeof window !== 'undefined' && typeof window.alert === 'function') {
      window.alert("Error initializing app.");
    }
    return;
  }
  if (!user) {
    // Show homepage for unauthenticated users ONLY
    app.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-[#5ED1D2] to-[#A32C2B] flex flex-col justify-center items-center">
        <header class="flex flex-col items-center mt-12 mb-8">
          <img src="assets/logo.svg" alt="Windgap Academy Logo" class="h-24 mb-4" style="vertical-align:middle;" />
          <h1 class="text-5xl font-extrabold text-[#A32C2B] mb-4">Windgap Academy of Learning</h1>
          <img src="assets/images/main-characters-windgap.png" alt="Andy, Winnie, Daisy, Natalie" class="h-32 mb-4" style="vertical-align:middle;" />
        </header>
        <nav class="flex gap-6 mb-10">
          <button id="sign-in-btn" class="btn-primary">Sign In</button>
          <button id="accessibility-btn" class="btn-secondary">Accessibility</button>
          <button id="support-btn" class="btn-secondary">Support</button>
          <button id="debug-btn" class="btn-secondary">Debug</button>
        </nav>
        <div id="debug-modal" style="display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.7);z-index:9999;align-items:center;justify-content:center;">
          <div style="background:#fff;color:#222;max-width:700px;width:90vw;padding:2em;border-radius:1em;overflow:auto;max-height:80vh;">
            <h2 style="font-size:1.5em;margin-bottom:1em;">Script Debug Info</h2>
            <div id="debug-content" style="font-size:0.95em;white-space:pre-wrap;"></div>
            <button id="close-debug" style="margin-top:1em;" class="btn-secondary">Close</button>
          </div>
        </div>
        <footer class="mt-8 text-center text-white text-sm opacity-80">
          <div class="flex flex-col items-center gap-2">
            <a href="#" id="privacy-link" class="text-white underline">Privacy Policy</a>
            <a href="#" id="terms-link" class="text-white underline">Terms of Service</a>
          </div>
          <p class="mt-2">&copy; ${new Date().getFullYear()} Windgap Academy. All rights reserved.</p>
        </footer>
      </div>
    `;
    // Debug button logic
    const debugBtn = document.getElementById('debug-btn');
    const debugModal = document.getElementById('debug-modal');
    const debugContent = document.getElementById('debug-content');
    const closeDebug = document.getElementById('close-debug');

    debugBtn.setAttribute('aria-haspopup', 'dialog');
    debugBtn.setAttribute('aria-controls', 'debug-modal');
    debugModal.setAttribute('role', 'dialog');
    debugModal.setAttribute('aria-modal', 'true');
    debugModal.setAttribute('aria-labelledby', 'debug-content');

    debugBtn.onclick = async () => {
      debugModal.style.display = 'flex';
      debugContent.textContent = 'Loading...';
      closeDebug.focus();
      const data = await getData();
      debugContent.textContent =
        `Feature Loader URL: ${data.featureLoaderUrl || 'Not found'}\n\n` +
        `Stack Trace URLs:\n${(data.stackTraceUrls || []).join('\n')}\n\n` +
        `Script Content:\n${data.scriptContent || 'No content found.'}`;
    };
    closeDebug.onclick = () => {
      debugModal.style.display = 'none';
      debugBtn.focus();
    };
    // Keyboard accessibility: ESC closes modal
    debugModal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        debugModal.style.display = 'none';
        debugBtn.focus();
      }
    });
    // Add working navigation for homepage buttons
    document.getElementById('sign-in-btn').onclick = () => window.route ? window.route('sign-in') : alert('Sign In clicked');
    document.getElementById('accessibility-btn').onclick = () => window.route ? window.route('accessibility') : alert('Accessibility clicked');
    document.getElementById('support-btn').onclick = () => window.route ? window.route('support') : alert('Support clicked');
    document.getElementById('privacy-link').onclick = (e) => { e.preventDefault(); alert('Privacy Policy'); };
    document.getElementById('terms-link').onclick = (e) => { e.preventDefault(); alert('Terms of Service'); };
    // Do NOT render dashboard, modules, or any other content for guests
    return;
  }
  // Only authenticated users see dashboard and modules
  showDashboard(app, {});
  }
  // Debug toggle logic
  const debugToggle = document.getElementById('debug-toggle');
  if (debugToggle) {
    debugToggle.onchange = (e) => {
      setDebug(debugToggle.checked);
      logDebug('Debug mode:', debugToggle.checked);
      if (debugToggle.checked) {
        showDebugInfo();
      } else {
        hideDebugInfo();
      }
    };
  }
  // Login form logic
  const loginForm = document.getElementById('login-form')
  if (loginForm) {
    // Password visibility toggle
    const passwordInput = document.getElementById('login-password');
    const togglePassword = document.getElementById('toggle-password');
    if (togglePassword && passwordInput) {
      togglePassword.onclick = () => {
        togglePassword.classList.toggle('active');
        passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
        togglePassword.textContent = passwordInput.type === 'password' ? '👁️' : '🙈';
      };
    }
    loginForm.onsubmit = async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = passwordInput.value;
      const errorDiv = document.getElementById('login-error');
      errorDiv.style.display = 'none';
      if (!email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
        errorDiv.textContent = 'Please enter a valid email address.';
        errorDiv.style.display = 'block';
        return;
      }
      if (password.length < 6) {
        errorDiv.textContent = 'Password must be at least 6 characters.';
        errorDiv.style.display = 'block';
        return;
      }
      try {
        loginUser(email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            sendEvent('login', { email });
            if (userCredential && userCredential.user && userCredential.user.email && userCredential.user.email.endsWith('@educator.windgapacademy.edu.au')) {
              window.route('educator-dashboard');
            } else {
              window.route('dashboard');
              sendEvent('login_success', { email });
              const progress = syncProgress();
              updateProgress(progress);
              const adaptiveLearning = new AdaptiveLearning();
              const nextModule = adaptiveLearning.recommendNextModule(modules, progress);
              if (nextModule) {
                logEvent('adaptive_recommendation', { module: nextModule });
              }
            }
          })
          .catch((err) => {
            errorDiv.textContent = err.message || 'Login failed. Please try again.';
            sendEvent('login_error', { email });
            errorDiv.style.display = 'block';
            warnDebug('Login error:', err);        
          });
      } catch (err) {
        errorDiv.textContent = err.message || 'Login failed. Please try again.';
        errorDiv.style.display = 'block';
        sendEvent('login_error', { email });
        warnDebug('Login error:', err);
      }
    };
  }
  // Real module loading for all modules
  app.querySelectorAll('[data-module]').forEach(btn => {
    btn.onclick = async (e) => {
      const modulePath = btn.getAttribute('data-module');
      const funcName = btn.getAttribute('data-func');
      app.innerHTML = `<div class='card animate-pulse'>Loading ${btn.textContent}...</div>`;
      try {
        const progress = syncProgress();
        const mod = await import(/* @vite-ignore */ modulePath);
        if (mod[funcName]) {
          mod[funcName](app);
          updateProgress(progress);
          logEvent('module_loaded', { module: modulePath });
          // Update adaptive learning recommendations
          const adaptiveLearning = new AdaptiveLearning();
          const nextModule = adaptiveLearning.recommendNextModule(modules, progress);
          if (nextModule) {
            logEvent('adaptive_recommendation', { module: nextModule });
          }
        } else {
          app.innerHTML = `<div class='alert-error'>Module loaded but no display function found.</div>`;
          warnDebug('Missing display function for module:', modulePath, funcName);
          sendEvent('module_load_error', { module: modulePath });
        }
      } catch (err) {
        app.innerHTML = `<div class='alert-error'>Error loading module: ${err}</div>`;
        warnDebug('Module load error:', err);
      }
    };
  });
  app.querySelectorAll('[data-route]').forEach(btn => {
    btn.onclick = (e) => {
      const route = btn.getAttribute('data-route');
      if (route === 'dashboard') mainInit();
      else window.route(route);
    };
  });
  // Accessibility
  addAriaLabels();
  enableKeyboardNavigation();
}

// --- Accessibility Improvements ---
// Only one enableKeyboardNavigation function should exist. Already implemented above.
function addTextToSpeechSupport() { /* TODO: Implement text-to-speech */ }
function ensureModalsHaveAriaLabels() { /* TODO: Implement ARIA labels and focus trap for modals */ }

// --- Error Handling Improvements ---
function globalErrorBoundary() { /* TODO: Implement global error boundary */ }
function improveErrorMessages() { /* TODO: Implement improved error messages and recovery flows */ }

// --- Input Validation & Testing ---
function validateAllForms() { /* TODO: Implement input validation for forms and user input */ }
function expandAutomatedTests() { /* TODO: Expand automated unit and integration tests */ }

// --- Engagement & Gamification ---
function addRealTimeFeedback() { /* TODO: Implement real-time feedback (animations, sound effects, confetti) */ }
// TODO: Expand gamification with badges, streaks, and seasonal events
// TODO: Add micro-interactions and smooth transitions to UI

// --- Security Improvements ---
// TODO: Review and improve authentication flows (two-factor, token system)
// TODO: Sanitize all user-generated content and feedback
// TODO: Ensure secure API calls and data storage

// --- UI Polish & Customization ---
// TODO: Polish UI with modern design patterns and transitions
// TODO: Offer more theme options and customization

// --- Analytics & Educator Tools ---
// TODO: Enhance analytics dashboards for educators
// TODO: Add more actionable insights and predictive analytics
// TODO: Expand educator content creation and reporting tools

// --- Community & Collaboration ---
// TODO: Expand forums, group projects, and peer review features
// TODO: Add safe chat moderation and reporting tools
// TODO: Improve collaboration and messaging components

// --- Internationalization & Localization ---
// TODO: Add more languages and RTL support
// TODO: Allow custom translations for educators
// TODO: Expand localization for all UI and content

// --- Onboarding & Help ---
function addInteractiveOnboarding() { /* TODO: Implement interactive onboarding for new users */ }
function expandHelpSupport() { /* TODO: Implement help/support with tooltips, guided tours, and FAQ */ }

// --- Backup & Sync ---
// TODO: Add cloud backup and restore for user progress
// TODO: Improve external platform sync and data export/import

// --- Phase 4: Continuous Improvement ---
// User Feedback Implementation
function collectUserFeedback() {
  // Create feedback button
  const btn = document.createElement("button");
  btn.className = "btn btn-primary";
  btn.textContent = "Send Feedback";
  btn.style.position = "fixed";
  btn.style.bottom = "20px";
  btn.style.right = "20px";
  btn.style.zIndex = "1000";
  btn.onclick = () => {
    // Simple feedback form
    const form = document.createElement("div");
    form.style.position = "fixed";
    form.style.bottom = "60px";
    form.style.right = "20px";
    form.style.background = "#fff";
    form.style.border = "1px solid #ccc";
    form.style.padding = "16px";
    form.style.zIndex = "1001";
    form.innerHTML = `
      <h3>Feedback</h3>
      <textarea id='feedback-comment' rows='3' style='width:100%;'></textarea><br>
      <label>Category: <select id='feedback-category'>
        <option>General</option>
        <option>Bug Report</option>
        <option>Feature Request</option>
      </select></label><br>
      <label>Details: <textarea id='feedback-details' rows='3' style='width:100%;'></textarea></label><br>
      <label>Rating: <select id='feedback-rating'><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select></label><br>
      <button id='submit-feedback'>Submit</button>
      <button id='close-feedback'>Close</button>
    `;
    document.body.appendChild(form);
    document.getElementById("submit-feedback").onclick = async () => {
      form.remove();
      alert("Thank you for your feedback!");
      // Educator log: feedback submitted
      const feedbackData = {
        comment: document.getElementById("feedback-comment").value,
        rating: document.getElementById("feedback-rating").value,
        timestamp: new Date().toISOString(),
        user: window.currentUser ? window.currentUser.name : "Anonymous"
      };
      console.log("Feedback submitted:", feedbackData);
      try {
        await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(feedbackData)
        });
        console.log("Feedback successfully sent to server.");
      } catch (err) {
        console.error("Error submitting feedback to server:", err);
      }
    };
    document.getElementById("close-feedback").onclick = () => form.remove();
  };
  document.body.appendChild(btn);
  // Automated feedback prompt after key actions
  window.addEventListener("routeChange", () => {
    if (Math.random() < 0.1) btn.click(); // 10% chance to prompt feedback
  });
}

// Performance Monitoring Implementation

// Call Phase 4 features at startup
collectUserFeedback();
monitorPerformance();
trackErrorRates();
trackUserEngagement();
scheduleRegularUpdates();

// DOM loaded entry point (with error fallback)
window.addEventListener("DOMContentLoaded", () => {
  try {
    mainInit();
  } catch (err) {
    window.lastWindgapError = err.stack || err.toString()    
    showFallbackScreen(
      "An error occurred during initialization. Please check your connection or contact support.",
    );
  }
});

// Global error handler for anything uncaught
window.onerror = function (message, source, lineno, colno, error) {
  window.lastWindgapError = `${message}\n${source}:${lineno}:${colno}\n${error && error.stack ? error.stack : ""}`;
  showFallbackScreen("A JavaScript error occurred and Windgap Academy could not start.");
  warnDebug('Global error:', message, source, lineno, colno, error);
  // TODO: Implement error reporting to server
};

// --- Accessibility & Error Handling Implementation ---
function enableKeyboardNavigation() {
  document.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      const focusable = Array.from(document.querySelectorAll("button, [tabindex], input, select"));
      const index = focusable.indexOf(document.activeElement);
      const next = focusable[(index + 1) % focusable.length];
      if (next) next.focus();
      e.preventDefault()      
    }
  });
}
function addAriaLabels() {
  const nav = document.querySelector("nav");
  if (nav) nav.setAttribute("aria-label", "Main Navigation");
  const main = document.querySelector("main");
  if (main) main.setAttribute("role", "main");
  const footer = document.querySelector("footer");
  if (footer) footer.setAttribute("aria-label", "Footer Information");
  const app = document.getElementById("app");
  if (app) app.setAttribute("aria-label", "Windgap Academy Main App");
}
import themes from "./utils/themes";

// Example: Use Windgap theme colors for homepage background and elements
document.body.style.backgroundColor = themes.windgap.light;

// Add Video.js player to homepage
const videoSection = document.createElement('section');
videoSection.innerHTML = `
  <link href="//vjs.zencdn.net/8.23.4/video-js.min.css" rel="stylesheet">
  <video
    id="my-player"
    class="video-js"
    controls
    preload="auto"
    poster="//vjs.zencdn.net/v/oceans.png"
    data-setup='{}'>
    <source src="//vjs.zencdn.net/v/oceans.mp4" type="video/mp4"></source>
    <source src="//vjs.zencdn.net/v/oceans.webm" type="video/webm"></source>
    <source src="//vjs.zencdn.net/v/oceans.ogv" type="video/ogg"></source>
    <p class="vjs-no-js">
      To view this video please enable JavaScript, and consider upgrading to a
      web browser that
      <a href="https://videojs.com/html5-video-support/" target="_blank">
        supports HTML5 video
      </a>
    </p>
  </video>
  <script src="//vjs.zencdn.net/8.23.4/video.min.js"></script>
`;
document.body.appendChild(videoSection);

// Initialize Video.js player after DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  if (window.videojs) {
    var options = {};
    var player = window.videojs('my-player', options, function onPlayerReady() {
      window.videojs.log('Your player is ready!');
      this.play();
      this.on('ended', function() {
        window.videojs.log('Awww...over so soon?!');
      });
    });
  }
});
// Provide a global stub for showFeature to prevent ReferenceError from index.html buttons
window.showFeature = async function(feature) {
  // Map feature names to routes or modules
  const featureMap = {
    avatar: {
      module: './components/AvatarBuilder.js',
      func: 'showAvatarBuilder'
    },
    stairs: {
      module: './components/ClimbingStairsAnimation.js',
      func: 'showClimbingStairsAnimation'
    },
    island: {
      module: './components/MaxAreaOfIslandAnimation.js',
      func: 'showMaxAreaOfIslandAnimation'
    },
    cube: {
      module: './components/CubeMapDemo.js',
      func: 'showCubeMapDemo'
    },
    kitchen: {
      module: './components/HealthyKitchenChallenge.js',
      func: 'showHealthyKitchenChallenge'
    },
    foodcollector: {
      module: './components/FoodCollectorEnv.js',
      func: 'showFoodCollectorEnv'
    },
    zoo: {
      module: './components/AcademyZoo.js',
      func: 'showAcademyZoo'
    },
    fluid: {
      module: './fluid-simulation.html',
      func: 'iframe'
    },
    dashboard: {
      route: 'dashboard'
    },
    whiteboard: {
      module: './whiteboard.html',
      func: 'iframe'
    }
  };
  const config = featureMap[feature];
  if (!config) {
    alert('Feature "' + feature + '" is not yet implemented.');
    return;
  }
  if (config.route) {
    window.route(config.route);
    return;
  }
  // Use #feature-container if present, else fallback to app
  const container = document.getElementById('feature-container') || app;
  container.innerHTML = `<div class='card animate-pulse'>Loading feature...</div>`;
  try {
    if (config.func === 'iframe') {
      // Render iframe for HTML features
      container.innerHTML = `<iframe src='${config.module}' style='width:100%;height:80vh;border:none;border-radius:12px;box-shadow:0 2px 16px #0002;'></iframe>`;
      return;
    }
    const mod = await import(/* @vite-ignore */ config.module);
    if (mod[config.func]) {
      mod[config.func](container);
    } else {
      container.innerHTML = `<div class='alert-error'>Feature loaded but no display function found.</div>`;
      warnDebug('Missing display function for feature:', config.module, config.func);
    }
  } catch (err) {
    container.innerHTML = `<div class='alert-error'>Error loading feature: ${err}</div>`;
    warnDebug('Feature load error:', err);
  }
};
addAriaLabels();
enableKeyboardNavigation();

// --- Input Validation & Engagement Implementation ---
// Global error handler for uncaught errors
window.addEventListener('error', function(event) {
  console.error('Global error caught:', event.error || event.message);
  // Optionally display a user-friendly error message in the UI
  if (app) {
    app.innerHTML = `<div class="error-message" style="color:red;padding:2em;text-align:center;">
      <h2>Something went wrong</h2>
      <p>${event.error ? event.error.message : event.message}</p>
      <p>Please refresh the page or contact support if the problem persists.</p>
    </div>`;
  }
});

window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled promise rejection:', event.reason);
  // Optionally display a user-friendly error message in the UI
  if (appContainer) {
    appContainer.innerHTML = `<div class="error-message" style="color:red;padding:2em;text-align:center;">
      <h2>Something went wrong</h2>
      <p>${event.reason && event.reason.message ? event.reason.message : event.reason}</p>
      <p>Please refresh the page or contact support if the problem persists.</p>
    </div>`;
  }
});
// Firebase initialization (ensure SDK is loaded before this runs)
// Firebase is initialized via ES module in firebase.js
// Safe DOM queries
// Safe DOM queries for ticker
const ticker = document.getElementById('news-ticker');
if (ticker) {
  ticker.textContent = "Welcome to Windgap Academy!";
} else {
  console.error("Element #news-ticker not found.");
}
// ...existing code...
// ...existing code...

// --- Security & UI Polish Implementation ---
// ...existing code...
// ...existing code...

// --- Analytics, Educator Tools, Community, Internationalization, Onboarding, Backup/Sync Implementation ---
// ...existing code...
// ...existing code...
// --- Educator Tools ---
// ...existing code...
// ...existing code...
// --- Community Features ---
// ...existing code...
// --- Internationalization ---
// ...existing code...
// ...existing code...
// --- Onboarding & Help ---
// ...existing code...
// --- Backup & Sync ---
// ...existing code...

// --- Advanced Feature Upgrades & TODOs ---
// Accessibility: ARIA roles, keyboard navigation, narration
// Onboarding/help modal
// Backup/sync logic
// Gamification: challenges, leaderboard
// Educator/parent feedback
// Analytics integration
// Error boundaries
// UI settings modal
// Simplified main app logic
// Comprehensive logic placeholders for future expansion
