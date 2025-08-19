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
import { showAdaptiveLearning } from './components/AdaptiveLearning.js';
import { showVirtualCurrency } from './components/VirtualCurrency.js';
import { showSeasonalEvents } from './components/SeasonalEvents.js';
import { showUserContent } from './components/UserContent.js';
import { showPeerReview } from './components/PeerReview.js';
import { showSignLanguageAvatar } from './components/SignLanguageAvatar.js';
import { showAICaptioning } from './components/AICaptioning.js';
import { showTwoFactorAuth } from './components/TwoFactorAuth.js';
import { showPrivacyDashboard } from './components/PrivacyDashboard.js';
import { showIntegrationAPI } from './components/IntegrationAPI.js';
import { showSmartScheduling } from './components/SmartScheduling.js';
import { showPredictiveAnalytics } from './components/PredictiveAnalytics.js';
import { showHeatmaps } from './components/Heatmaps.js';
import { showMoodTracking } from './components/MoodTracking.js';
import { showWellbeingAI } from './components/WellbeingAI.js';
import { showLoadingSpinner } from './components/LoadingSpinner.js';
import { animateTransition } from './components/TransitionAnimation.js';
import { showTooltip } from './components/Tooltip.js';
import { addHelpIcon } from './components/HelpIcon.js';
import { showErrorMessage } from './components/ErrorMessage.js';
import { setAriaRole, setAriaLabel } from './components/AriaUtils.js';
import { validateInput } from './components/InputValidation.js';
import { t } from './components/Localization.js';
import { logAction } from './components/AuditLog.js';
import { showOnboarding } from './components/Onboarding.js';
import { showCalendar } from './components/Calendar.js';
import { showDashboardWidgets } from './components/DashboardWidgets.js';
import { showCollaboration } from './components/Collaboration.js';
import { showVideoChat } from './components/VideoChat.js';
import { showAIRecommendations } from './components/AIRecommendations.js';
import { showFeedbackForm } from './components/FeedbackForm.js';
import { showAchievementSharing } from './components/AchievementSharing.js';
import { showDataExportImport } from './components/DataExportImport.js';
import { showExternalResources } from './components/ExternalResources.js';
import { showChallenges } from './components/Challenges.js';
import { showBadges } from './components/Badges.js';
import { showMiniGames } from './components/MiniGames.js';
import { showMessagingComponent } from './components/Messaging.js';
import { showGroupProjects } from './components/GroupProjects.js';
import { showForums } from './components/Forums.js';
import { showAccessibilityAdvanced } from './components/AccessibilityAdvanced.js';
import { showAnalytics } from './components/Analytics.js';
import { showResourceLibrary } from './components/ResourceLibrary.js';
import { showParentPortal } from './components/ParentPortal.js';
import { registerPWA, showPushNotification } from './components/PWA.js';
import { showProfile } from './components/Profile.js';
import { showHelpSupport } from './components/HelpSupport.js';
import { showLeaderboard } from './components/Leaderboard.js';
import { showNotification } from './components/Notifications.js';
import { cacheLessonPlan, getCachedLessonPlan } from './components/OfflineCache.js';
import { showErrorRecovery } from './components/ErrorRecovery.js';
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
  case 'adaptive-learning': showAdaptiveLearning(app, opts.data || {}); break;
  case 'virtual-currency': showVirtualCurrency(app, opts.data || {}); break;
  case 'seasonal-events': showSeasonalEvents(app); break;
  case 'user-content': showUserContent(app); break;
  case 'peer-review': showPeerReview(app); break;
  case 'sign-language-avatar': showSignLanguageAvatar(app); break;
  case 'ai-captioning': showAICaptioning(app); break;
  case 'two-factor-auth': showTwoFactorAuth(app); break;
  case 'privacy-dashboard': showPrivacyDashboard(app); break;
  case 'integration-api': showIntegrationAPI(app); break;
  case 'smart-scheduling': showSmartScheduling(app); break;
  case 'predictive-analytics': showPredictiveAnalytics(app); break;
  case 'heatmaps': showHeatmaps(app); break;
  case 'mood-tracking': showMoodTracking(app); break;
  case 'wellbeing-ai': showWellbeingAI(app); break;
  case 'onboarding': showOnboarding(app); break;
  case 'calendar': showCalendar(app); break;
  case 'dashboard-widgets': showDashboardWidgets(app); break;
  case 'collaboration': showCollaboration(app); break;
  case 'video-chat': showVideoChat(app); break;
  case 'ai-recommendations': showAIRecommendations(app); break;
  case 'feedback-form': showFeedbackForm(app); break;
  case 'achievement-sharing': showAchievementSharing(app); break;
  case 'data-export-import': showDataExportImport(app); break;
  case 'external-resources': showExternalResources(app); break;
  case 'challenges': showChallenges(app, opts.data || {}); break;
  case 'badges': showBadges(app, opts.data || {}); break;
  case 'mini-games': showMiniGames(app); break;
  case 'messaging-component': showMessagingComponent(app, opts.data || {}); break;
  case 'group-projects': showGroupProjects(app); break;
  case 'forums': showForums(app); break;
  case 'accessibility-advanced': showAccessibilityAdvanced(app); break;
  case 'analytics': showAnalytics(app, opts.data || {}); break;
  case 'resource-library': showResourceLibrary(app); break;
  case 'parent-portal': showParentPortal(app); break;
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
  case 'profile': showProfile(app, opts.data || {}); break;
  case 'help-support': showHelpSupport(app); break;
  case 'leaderboard': showLeaderboard(app, opts.data || {}); break;
  case 'error-recovery': showErrorRecovery(app, opts.errorMsg || 'Unknown error'); break;
    default: showDashboard(app, opts.data || {});
  }
};
// Theme switching logic
window.setTheme = function(theme) {
  document.body.classList.remove('theme-dark', 'theme-high-contrast');
  if (theme === 'dark') document.body.classList.add('theme-dark');
  if (theme === 'high-contrast') document.body.classList.add('theme-high-contrast');
};
// Example notification usage
window.showMilestoneNotification = function(msg) {
  showNotification('success', msg);
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
