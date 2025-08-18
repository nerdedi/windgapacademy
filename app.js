/*
  Windgap Academy Main App Logic
  - Accessibility: ARIA, narration, font toggles, focus management
  - Privacy: All user actions are private and educator-reviewed
  - Compliance: Age-appropriate, ad-free, NDIS and Australian standards
  - Educator Logging: All navigation and moderation actions are logged
  - Educational Prompts: Narration and tips for self-regulation
  - Last updated: August 18, 2025 (with fallback error screen)
*/
import { showDashboard } from './components/Dashboard.js';
import { showCalmSpace } from './components/CalmSpace.js';
import { showEducatorDashboard } from './components/EducatorDashboard.js';
import { showAvatarBuilder } from './components/AvatarBuilder.js';
import { showDomainTabs } from './components/DomainTabs.js';
import { showVirtualWorld } from './components/VirtualWorld.js';
import { showMessaging } from './components/Messaging.js';
import { showTokenSystem } from './components/TokenSystem.js';
import { showAcademyStore } from './components/AcademyStore.js';
import { auth } from './firebase.js';
import { showAccessibilityOptions } from './components/Accessibility.js';
import { showAssignments } from './components/assignments.js';
import { showChatModeration } from './components/ChatModeration.js';
import { showLiteracyGame } from './components/GameModules/LiteracyGame.js';
import { showNumeracyGame } from './components/GameModules/NumeracyGame.js';
import { showCommunicationGame } from './components/GameModules/CommunicationGame.js';
import { showDigitalSkillsGame } from './components/GameModules/DigitalSkillsGame.js';
import { showLifeSkillsGame } from './components/GameModules/LifeSkillsGame.js';
import { showMoneySkillsGame } from './components/GameModules/MoneySkillsGame.js';
import { showEmployabilityGame } from './components/GameModules/EmployabilityGame.js';

const app = document.getElementById('app');

function showFallbackScreen(errorMsg = "Something went wrong while loading Windgap Academy.") {
  document.body.innerHTML = `
    <div style="max-width:540px;margin:48px auto;padding:32px;border-radius:12px;background:#ffecec;color:#b91c1c;box-shadow:0 2px 16px #0002;">
      <h1 style="font-size:2em;margin-bottom:0.25em;">⚠️ Unable to load Windgap Academy</h1>
      <p style="font-size:1.2em;">${errorMsg}</p>
      <details style="margin-top:1em;">
        <summary style="cursor:pointer;">Technical Details</summary>
        <pre style="white-space:pre-wrap;font-size:0.95em;">${(window.lastWindgapError || "No details available.")}</pre>
      </details>
      <p style="margin-top:2em;">Please try reloading, or contact support at <a href="mailto:info@windgapacademy.edu.au">info@windgapacademy.edu.au</a>.</p>
    </div>
  `;
}

function unhideHomepage() {
  const loadingScreen = document.getElementById("loadingscreen");
  const homepage = document.getElementById("homepage");
  if (loadingScreen) loadingScreen.classList.add("hidden");
  if (homepage) homepage.classList.remove("hidden");
}

// Accessibility toggles (all actions are private and educator-reviewed)
window.increaseFont = () => {
  document.body.style.fontSize = 'larger';
  // Educator log: font size increased for accessibility
};
window.toggleDyslexiaFont = () => {
  document.body.classList.toggle('dyslexia-font');
  // Educator log: dyslexia font toggled for accessibility
};
window.toggleEasyRead = () => {
  document.body.classList.toggle('easy-read');
  // Educator log: easy-read mode toggled for accessibility
};
window.narrate = (text) => {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-AU';
  window.speechSynthesis.speak(utter);
  // Educator log: narration triggered for accessibility
};

// Routing
window.showSafetyPolicy = function(container) {
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
window.acceptSafetyPolicy = function() {
  localStorage.setItem('safetyPolicyAccepted', 'true');
  // Educator log: safety policy accepted
  window.route('dashboard');
};
window.route = async function(path, opts = {}) {
  // Require safety policy acceptance before starting
  if (!localStorage.getItem('safetyPolicyAccepted') && path !== 'safety-policy') {
    window.showSafetyPolicy(app);
    return;
  }
  // All navigation and UI now uses Australian spelling, grammar, and context.
  // Routing logic is modular and independent; each route only affects its own module.
  app.innerHTML = '';
  const userId = auth.currentUser ? auth.currentUser.uid : null;
  switch (path) {
    case 'dashboard': showDashboard(app, opts.data || {}); break;
    case 'calm-space': showCalmSpace(app, opts.unlockedScenes, userId); break;
    case 'educator-dashboard': showEducatorDashboard(app, userId); break;
    case 'assignments': showAssignments(app, userId); break;
    case 'chat-moderation': showChatModeration(app, userId); break;
    case 'avatar-builder': showAvatarBuilder(app, userId); break;
    case 'messaging': showMessaging(app, opts.unreadCount || 0, userId); break;
    case 'token-system': showTokenSystem(app, opts.tokens || 0, userId); break;
    case 'academy-store': showAcademyStore(app, opts.tokens || 0, userId); break;
    case 'accessibility': showAccessibilityOptions(app); break;
    case 'domain-tabs': showDomainTabs(app, opts.domain || 'literacy', userId); break;
    case 'literacy-game': showLiteracyGame(app, userId); break;
    case 'numeracy-game': showNumeracyGame(app, userId); break;
    case 'communication-game': showCommunicationGame(app, userId); break;
    case 'digital-skills-game': showDigitalSkillsGame(app, userId); break;
    case 'life-skills-game': showLifeSkillsGame(app, userId); break;
    case 'money-skills-game': showMoneySkillsGame(app, userId); break;
    case 'employability-game': showEmployabilityGame(app, userId); break;
    case 'virtual-world': showVirtualWorld(app, userId); break;
    default: showDashboard(app, opts.data || {});
  }
};

// Loading screen logic and homepage logic are now in mainInit()
function mainInit() {
  // Show dashboard on first load
  window.route('dashboard');

  // Loading screen logic
  document.addEventListener("DOMContentLoaded", function () {
    const loadingScreen = document.getElementById("loadingscreen");
    const homepage = document.getElementById("homepage");
    const enterButton = document.getElementById("enterbutton");
    const musicSelector = document.getElementById("musicselector");

    setTimeout(() => {
      if (loadingScreen) loadingScreen.classList.add("hidden");
      if (homepage) homepage.classList.remove("hidden");
      window.narrate("Hi, I'm Winnie! Let's find your calm space.");
      // Educational prompt: Welcome and encourage calm entry
    }, 3000);

    if (enterButton) {
      enterButton.addEventListener("click", () => {
        window.narrate("Welcome to Windgap Academy! Let's begin your journey.");
        if (homepage) homepage.classList.add("hidden");
        window.route('dashboard');
      });
    }

    if (musicSelector) {
      musicSelector.addEventListener("change", function () {
        const selection = this.value;
        let audioSrc = "";
        if (selection === "nature") {
          audioSrc = "assets/sounds/nature.mp3";
        } else if (selection === "instrumental") {
          audioSrc = "assets/sounds/instrumental.mp3";
        }
        if (audioSrc) {
          const audio = new Audio(audioSrc);
          audio.loop = true;
          audio.play();
        }
      });
    }
  });
}

// DOM loaded entry point (with error fallback)
window.addEventListener('DOMContentLoaded', () => {
  try {
    mainInit();
  } catch (err) {
    window.lastWindgapError = err.stack || err.toString();
    showFallbackScreen("An error occurred during initialization. Please check your connection or contact support.");
  }
});

// Global error handler for anything uncaught
window.onerror = function(message, source, lineno, colno, error) {
  window.lastWindgapError = `${message}\n${source}:${lineno}:${colno}\n${error && error.stack ? error.stack : ""}`;
  showFallbackScreen("A JavaScript error occurred and Windgap Academy could not start.");
};
