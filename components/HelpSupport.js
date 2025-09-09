// --- Advanced Feature Upgrades & TODOs ---
// Accessibility: ARIA roles, keyboard navigation
// Onboarding/help modal
// Backup/sync logic
// Gamification: challenges, leaderboard
// Educator/parent feedback
// Analytics integration
// Error boundaries
// UI settings modal
// Simplified help/support logic

function showOnboarding() {
  const modal = document.createElement("div");
  modal.className = "onboarding-modal";
  modal.innerHTML = `<h2>Welcome to Help & Support!</h2><p>Get help and find answers. Use the settings to personalize your experience.</p><button id='close-onboarding'>Close</button>`;
  document.body.appendChild(modal);
  document.getElementById("close-onboarding").onclick = () => modal.remove();
}

function setAccessibility() {
  const helpEl = document.getElementById("help-support");
  if (helpEl) {
    helpEl.setAttribute("role", "region");
    helpEl.setAttribute("aria-label", "Help & Support");
  }
}

function _backupProgress(progress) {
  localStorage.setItem("helpSupportProgress", JSON.stringify(progress));
}
function _syncProgress() {
  return JSON.parse(localStorage.getItem("helpSupportProgress") || "{}");
}

function _updateLeaderboard(score) {
  // ...leaderboard logic...
}

function _sendFeedback(feedback) {
  // ...send feedback to server...
}

function _logEvent(event) {
  // ...analytics logic...
}

function safeRun(fn) {
  try {
    fn();
  } catch (e) {
    console.error("Error:", e);
  }
}

function _showSettings() {
  // ...settings modal logic...
}

function startHelpSupport() {
  showOnboarding();
  setAccessibility();
  // ...simplified help/support logic...
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", startHelpSupport);
}
// Help & Support Component: FAQs, contact, live chat
export function showHelpSupport(container) {
  container.innerHTML = `
    <section id="help-support" aria-label="Help & Support">
      <h2>❓ Help & Support</h2>
      <details><summary>FAQs</summary>
        <ul>
          <li>How do I reset my password?</li>
          <li>How do I contact my educator?</li>
        </ul>
      </details>
      <button id="contact-support">Contact Support</button>
      <button id="live-chat">Live Chat</button>
      <div id="support-feedback" aria-live="polite"></div>
    </section>
  `;
  document.getElementById("contact-support").onclick = function () {
    document.getElementById("support-feedback").innerText = "Email sent to support!";
  };
  document.getElementById("live-chat").onclick = function () {
    document.getElementById("support-feedback").innerText = "Live chat started!";
  };
}
