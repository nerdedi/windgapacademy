// --- Lifecycle Logger ---
if (!window.__WINDGAP_LOGS__) window.__WINDGAP_LOGS__ = [];
function windgapLog(msg, data) {
  try {
    window.__WINDGAP_LOGS__.push({ ts: Date.now(), msg, data });
  } catch (e) {
    console.error('Unexpected error in main app logic:', e);
  }
}
// ...existing code...
// --- Dynamic Script Inspection & Debugging ---
async function getScriptContent(url) {
  try {
    // Always use GET for script content, but validate URL
    if (!url || typeof url !== 'string' || !/^https?:\/\//.test(url)) {
      console.error('Invalid URL for fetch:', url);
      return null;
    }
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/javascript,application/javascript,text/plain,*/*'
      }
    });
    if (!response.ok) {
      console.error('Fetch failed with status:', response.status);
      return null;
    }
  } catch (e) {
    console.error(`Failed to fetch script content from ${url}:`, e);
    return null;
  }
}
// ...existing code...
// ...existing code...
async function getStackTraceUrls() {
async function getStackTraceUrls() {
  const stack = new Error().stack;
  if (!stack) {
    return [];
  }
  const urls = stack.split('\n')
    .map(line => {
      const match = line.match(/(http[s]?:\/\/[^\s]+)/);
      return match ? match[1].replace(/:\d+:\d+$/, '') : null;
  return [...new Set(urls)]; // Get unique URLs
}
async function getData() {

async function getData() {
  const scriptUrls = await getStackTraceUrls();
  const featureLoaderUrl = scriptUrls.find(url => url.includes('featureLoader.js'));

  if (!featureLoaderUrl) {
    return { scriptContent: 'Could not find featureLoader.js in stack trace.', stackTraceUrls: scriptUrls };
  }

  return {
    scriptContent: scriptContent,
    featureLoaderUrl: featureLoaderUrl,
    stackTraceUrls: scriptUrls
  };
}
// Firebase via CDN for browser compatibility
  };
// Firebase via CDN for browser compatibility
// Use ES module import for Firebase. See firebase.js for initialization.
// ...imports removed for build compatibility. Use require or move to src/ for ESM/React code.
  // Login form logic
  // (Removed duplicate declaration of loginForm)
  if (footer) footer.setAttribute("aria-label", "Footer Information");
  const app = document.getElementById("app");
  if (app) {
    app.setAttribute("aria-label", "Windgap Academy Main App");
    app.setAttribute("role", "application");
  }
  // Keyboard navigation
  // Throttled keyboard navigation for performance
  let lastTabTime = 0;
  document.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      const now = Date.now();
      if (now - lastTabTime < 50) return;
      lastTabTime = now;
      const focusable = Array.from(document.querySelectorAll("button, [tabindex], input, select, a"));
      const index = focusable.indexOf(document.activeElement);
      const next = focusable[(index + 1) % focusable.length];
      if (next) next.focus();
      e.preventDefault();
    }
  });
  // Narration hook (for future screen reader integration)
  window.narrate = function (text) {
    try {
      if (!text || typeof text !== 'string') return;
      if ('speechSynthesis' in window) {
        const speak = () => {
          const utter = new SpeechSynthesisUtterance(text);
          window.speechSynthesis.speak(utter);
        };
        const voices = window.speechSynthesis.getVoices();
        if (!voices.length) {
          window.speechSynthesis.onvoiceschanged = speak;
        } else {
          speak();
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Narration failed', e);
    }
  };
  // Only authenticated users see dashboard and modules
  showDashboard(app, {});
  // Debug toggle logic
  const debugToggle = document.getElementById('debug-toggle');
  if (debugToggle) {
    debugToggle.setAttribute('role', 'switch');
    debugToggle.setAttribute('aria-checked', debugToggle.checked ? 'true' : 'false');
    debugToggle.onchange = (e) => {
      const checked = !!debugToggle.checked;
      debugToggle.setAttribute('aria-checked', checked ? 'true' : 'false');
      setDebug(checked);
      logDebug('Debug mode:', checked);
      if (checked) {
        showDebugInfo();
      } else {
        hideDebugInfo();
      }
    };
  }
  // Login form logic
  const loginForm = document.getElementById('login-form')
  if (loginForm) {
    // Password visibility toggle - safe DOM checks and keyboard accessibility
    const passwordInput = document.getElementById('login-password');
    const togglePassword = document.getElementById('toggle-password');
    if (togglePassword && passwordInput) {
      togglePassword.setAttribute('role', 'button');
      togglePassword.setAttribute('aria-pressed', 'false');
      togglePassword.tabIndex = 0;
      const updateToggle = (show) => {
        togglePassword.classList.toggle('active', show);
        togglePassword.setAttribute('aria-pressed', show ? 'true' : 'false');
        passwordInput.type = show ? 'text' : 'password';
        togglePassword.textContent = show ? '🙈' : '👁️';
      };
      const toggleHandler = () => updateToggle(passwordInput.type === 'password');
      togglePassword.addEventListener('click', toggleHandler);
      togglePassword.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          toggleHandler();
        }
      });
    }
    loginForm.onsubmit = async (e) => {
      e.preventDefault();
      const emailEl = document.getElementById('login-email');
      const email = emailEl ? (emailEl.value || '') : '';
      const password = passwordInput ? (passwordInput.value || '') : '';
      const errorDiv = document.getElementById('login-error');
      if (errorDiv) errorDiv.style.display = 'none';
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        if (errorDiv) {
          errorDiv.textContent = 'Please enter a valid email address.';
          errorDiv.style.display = 'block';
        }
        return;
      }
      if (password.length < 6) {
        if (errorDiv) {
          errorDiv.textContent = 'Password must be at least 6 characters.';
          errorDiv.style.display = 'block';
        }
        return;
      }
      try {
        loginUser(email, password)
          .then((userCredential) => {
            app.innerHTML =
              '<header class="flex items-center justify-between px-8 py-4 bg-white shadow">' +
              '<div class="flex items-center gap-3">' +
                '<img src="assets/logo.png" alt="Windgap Academy Logo" class="h-14 w-auto animate-float" />' +
                '<span class="text-2xl font-bold text-[#A32C2B]">Windgap Academy</span>' +
              '</div>' +
              '<div class="flex items-center gap-4">' +
                '<img src="assets/windgap-logo.png" alt="User Avatar" class="h-10 w-10 rounded-full border-2 border-[#A32C2B]" id="user-avatar" />' +
                '<span class="font-semibold text-[#A32C2B]" id="welcome-user">Welcome, Guest!</span>' +
              '</div>' +
              '</header>' +
              '<nav class="sticky top-0 z-50 bg-white shadow flex items-center justify-between px-8 py-4">' +
              '<div class="flex items-center gap-3">' +
                '<img src="assets/logo.png" alt="Windgap Academy Logo" class="h-14 w-auto animate-float" />' +
                '<span class="text-2xl font-bold text-[#A32C2B]">Windgap Academy</span>' +
              '</div>' +
              '<div class="flex gap-6">' +
                '<a href="#home" data-route="home" class="btn-secondary" aria-label="Home">Home</a>' +
                '<a href="#signin" data-route="signin" class="btn-secondary" aria-label="Sign In">Sign In</a>' +
                '<a href="#accessibility" data-route="accessibility" class="btn-secondary" aria-label="Accessibility">Accessibility</a>' +
                '<a href="#support" data-route="support" class="btn-secondary" aria-label="Support">Support</a>' +
              '</div>' +
              '</nav>' +
              '<div class="hero-section relative flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-[#5ED1D2] via-[#A32C2B] to-[#FBBF24] overflow-hidden">' +
              '<div class="carousel w-full max-w-2xl mb-6 flex items-center justify-center" id="featured-carousel-main">' +
                '<button class="carousel-control" aria-label="Previous Module">&#8592;</button>' +
                '<div class="carousel-slide flex-1 text-center">' +
                  '<h3 class="text-2xl font-bold text-white">Math Quest</h3>' +
                  '<p class="text-white">Sharpen your math skills in a fun adventure!</p>' +
                '</div>' +
                '<button class="carousel-control" aria-label="Next Module">&#8594;</button>' +
              '</div>' +
              '<div class="progress-tracker w-full max-w-md mb-4 flex flex-col gap-2" id="progress-tracker-main">' +
                '<div class="flex items-center justify-between"><span>Math Quest</span><span>80%</span></div>' +
                '<div class="w-full bg-gray-200 rounded-full h-2"><div class="bg-[#A32C2B] h-2 rounded-full" style="width:80%"></div></div>' +
                '<div class="flex items-center justify-between"><span>Reading Adventure</span><span>60%</span></div>' +
                '<div class="w-full bg-gray-200 rounded-full h-2"><div class="bg-[#5ED1D2] h-2 rounded-full" style="width:60%"></div></div>' +
              '</div>' +
              '<div class="leaderboard w-full max-w-md mb-4 bg-white/80 rounded-lg shadow p-4" id="homepage-leaderboard-main">' +
                '<h3 class="text-xl font-bold text-[#A32C2B] mb-2">Top Learners</h3>' +
                '<div class="carousel w-full max-w-2xl mb-6" id="featured-carousel-leaderboard"></div>' +
                '<div class="badges flex gap-3 mb-4" id="achievement-badges"></div>' +
                '<div class="progress-tracker w-full max-w-md mb-4" id="progress-tracker-leaderboard"></div>' +
                '<div class="leaderboard w-full max-w-md mb-4" id="homepage-leaderboard-main"></div>' +
                '<div class="challenge-block w-full max-w-md mb-4" id="daily-challenge"></div>' +
                '<div class="welcome-message text-lg text-white font-semibold mb-2" id="personal-welcome"></div>' +
                '<div class="news-ticker bg-white/80 text-[#A32C2B] px-4 py-2 rounded-full shadow mb-4" id="news-ticker">Loading updates...</div>' +
                '<div class="accessibility-toggles flex gap-3 mb-4" id="accessibility-toggles">' +
                  '<button onclick="window.increaseFont()" class="btn-secondary">A+</button>' +
                  '<button onclick="window.toggleDyslexiaFont()" class="btn-secondary">Dyslexia Font</button>' +
                  '<button onclick="window.toggleEasyRead()" class="btn-secondary">Easy Read</button>' +
                '</div>' +
                '<div class="avatar-customization w-full max-w-md mb-4" id="avatar-customization"></div>' +
                '<div class="social-sharing flex gap-3 mb-4" id="social-sharing">' +
                  '<button class="btn-secondary">Share</button>' +
                  '<button class="btn-secondary">Invite Friends</button>' +
                '</div>' +
                '<div class="feedback-support w-full max-w-md mb-4" id="feedback-support">' +
                  '<a href="#feedback" class="btn-secondary">Feedback</a>' +
                  '<a href="#support" class="btn-secondary">Support</a>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div style="margin:2em 0;text-align:center;">' +
              '<img src="assets/images/main-characters-windgap.png" alt="Main Characters: Andy, Daisy, Natalie, Winnie" style="max-width:100%;height:auto;border:2px solid #A32C2B;border-radius:16px;background:#f8f8f8;object-fit:contain;" />' +
              '<div style="color:#A32C2B;font-weight:bold;margin-top:0.5em;">Main Characters: Andy, Daisy, Natalie, Winnie (left to right)</div>' +
            '</div>' +
            '<section class="flex flex-col items-center my-12">' +
              '<h2 class="text-3xl font-bold mb-4">Ready to start learning?</h2>' +
              '<button class="cta">Get Started</button>' +
            '</section>' +
            '<footer class="w-full bg-white py-6 mt-12 shadow text-center text-[#A32C2B]">' +
              '<div class="flex flex-col md:flex-row items-center justify-center gap-6">' +
                '<a href="#privacy" class="underline">Privacy Policy</a>' +
                '<a href="#terms" class="underline">Terms of Service</a>' +
                '<a href="#contact" class="underline">Contact</a>' +
              '</div>' +
              '<div class="mt-2 text-sm">&copy; 2025 Windgap Academy. All rights reserved.</div>' +
            '</footer>' +
            '<nav style="margin: 2em 0; text-align: center;">' +
              '<button onclick="showFeature(\'avatar\')">Avatar Creator</button>' +
              '<button onclick="showFeature(\'stairs\')">Climbing Stairs Animation</button>' +
              '<button onclick="showFeature(\'island\')">Max Area of Island Animation</button>' +
              '<button onclick="showFeature(\'cube\')">Cube Map 3D Demo <span class="coming-soon" aria-hidden="true">(Coming Soon)</span></button>' +
              '<button onclick="showFeature(\'kitchen\')">Healthy Kitchen Challenge <span class="coming-soon" aria-hidden="true">(Coming Soon)</span></button>' +
              '<button onclick="showFeature(\'foodcollector\')">Food Collector Environment</button>' +
              '<button onclick="showFeature(\'zoo\')">Academy Zoo Environment</button>' +
              '<button onclick="showFeature(\'fluid\')">Fluid Simulation <span class="coming-soon" aria-hidden="true">(Coming Soon)</span></button>' +
              '<button onclick="showFeature(\'dashboard\')">Results Dashboard</button>' +
              '<button onclick="showFeature(\'whiteboard\')">Whiteboard</button>' +
            '</nav>' +
            '<main>' +
              '<div id="feature-container" style="width: 100%; min-height: 500px; background: #fff; border-radius: 12px; box-shadow: 0 2px 16px #0001; margin: auto; max-width: 1200px; padding: 2em;"></div>' +
            '</main>';
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
    // ...existing code...
  window.addEventListener("routeChange", () => {
    if (Math.random() < 0.1) btn.click(); // 10% chance to prompt feedback
  });
}

// Performance Monitoring Implementation
  });

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
    window.lastWindgapError = 'Initialization error: ' + (err && err.stack ? err.stack : err);
    showFallbackScreen('An error occurred during initialization. Please check your connection or contact support.');
  }
});

// Global error handler for anything uncaught
window.onerror = function (message, source, lineno, colno, error) {
  window.lastWindgapError = message + '\n' + source + ':' + lineno + ':' + colno + '\n' + (error && error.stack ? error.stack : '');
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

// Import modules
import { themes } from './js/themes.js';
import { setupVideoPlayer } from './js/videoPlayer.js';
import { addAriaLabels, enableKeyboardNavigation } from './js/accessibility.js';
import { showFeature } from './js/showFeature.js';
document.body.style.backgroundColor = themes.windgap.light;
setupVideoPlayer();

// Example: Use Windgap theme colors for homepage background and elements
document.body.style.backgroundColor = themes.windgap.light;

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
  showFeature(feature);
}
addAriaLabels();
enableKeyboardNavigation();
addAriaLabels();
enableKeyboardNavigation();

// --- Input Validation & Engagement Implementation ---
// Global error handler for uncaught errors
// Firebase initialization (ensure SDK is loaded before this runs)
// Firebase is initialized via ES module in firebase.js
// Safe DOM queries
// Safe DOM queries for ticker (now unique ID)
const ticker = document.getElementById('news-ticker');
if (ticker) {
  ticker.textContent = "Welcome to Windgap Academy!";
} else {
  console.error("Element #news-ticker not found.");
}

// Example: update progress tracker and leaderboard with new unique IDs
const progressMain = document.getElementById('progress-tracker-main');
const leaderboardMain = document.getElementById('homepage-leaderboard-main');
const featuredCarouselMain = document.getElementById('featured-carousel-main');
const featuredCarouselLeaderboard = document.getElementById('featured-carousel-leaderboard');
const progressLeaderboard = document.getElementById('progress-tracker-leaderboard');
// Add any additional logic for these elements as needed
// (No extra closing braces needed here)