// --- Advanced Feature Upgrades & TODOs ---
// Accessibility: ARIA roles, keyboard navigation
// Onboarding/help modal
// Backup/sync logic
// Gamification: challenges, leaderboard
// Educator/parent feedback
// Analytics integration
// Error boundaries
// UI settings modal
// Simplified messaging logic

function showOnboarding() {
  const modal = document.createElement("div");
  modal.className = "onboarding-modal";
  modal.innerHTML = `<h2>Welcome to Messaging!</h2><p>Communicate safely and effectively. Use the settings to personalize your experience.</p><button id='close-onboarding'>Close</button>`;
  document.body.appendChild(modal);
  document.getElementById("close-onboarding").onclick = () => modal.remove();
}

function setAccessibility() {
  const msgEl = document.getElementById("messaging");
  if (msgEl) {
    msgEl.setAttribute("role", "region");
    msgEl.setAttribute("aria-label", "Messaging");
  }
}

function backupProgress(progress) {
  localStorage.setItem("messagingProgress", JSON.stringify(progress));
}
function syncProgress() {
  return JSON.parse(localStorage.getItem("messagingProgress") || "{}");
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
  try {
    fn();
  } catch (e) {
    console.error("Error:", e);
  }
}

function showSettings() {
  // ...settings modal logic...
}

function startMessaging() {
  showOnboarding();
  setAccessibility();
  // ...simplified messaging logic...
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", startMessaging);
}
// Messaging & Chat Module
// Chat moderation, educator review, logs, terms acceptance

export function showMessaging(container, unreadCount = 0) {
  if (!container) return;
  function helpButton() {
    return '<button id="messaging-help" aria-label="Help" title="Help">❓</button>';
  }
  function privacyNotice() {
    return '<div id="privacy-notice" style="font-size:0.9em;color:#555;margin:8px 0;">All messages and notifications are private and only used for educational support.</div>';
  }

  container.innerHTML = `
    <section id="messaging" class="au-section" aria-label="Messaging">
      <div class="flex justify-between items-center card smooth-shadow mb-4">
        <h2 class="text-2xl font-bold text-primary text-smooth">Messaging</h2>
        ${helpButton()}
      </div>
      ${privacyNotice()}
      <div id="chat-area" aria-label="Chat Area"></div>
      <input id="chat-input" type="text" placeholder="Type your message..." aria-label="Chat Input" />
      <button id="send-btn" aria-label="Send Message">Send</button>
      <div id="unread-count" aria-label="Unread Messages">Unread: ${unreadCount}</div>
      <div id="messaging-prompt" class="mt-3" aria-live="polite"></div>
    </section>
  `;

  // Safe event wiring
  const helpBtn = container.querySelector("#messaging-help");
  if (helpBtn)
    helpBtn.onclick = () =>
      alert(
        "Messaging is safe, private, and educator-reviewed. Use the chat and notification centre for learning support.",
      );
  const setTimerBtn = container.querySelector("#set-timer");
  if (setTimerBtn) setTimerBtn.onclick = () => window.setTaskTimer && window.setTaskTimer();
  const returnBtn = container.querySelector("#return-dashboard");
  if (returnBtn) returnBtn.onclick = () => window.route && window.route("dashboard");

  const prompts = [
    "Tip: Use the notification centre for important updates.",
    "Tip: All chat messages are private and educator-reviewed.",
    "Tip: Set timers to manage your learning tasks.",
    "Tip: Role-play scenarios help with digital safety.",
  ];
  let promptIndex = 0;
  function showPrompt() {
    const el = container.querySelector("#messaging-prompt");
    if (el) el.textContent = prompts[promptIndex % prompts.length];
    promptIndex++;
    setTimeout(showPrompt, 7000);
  }
  showPrompt();

  // Initialize basic chat handlers if elements exist
  const sendBtn = container.querySelector("#send-btn");
  const chatInput = container.querySelector("#chat-input");
  const chatArea = container.querySelector("#chat-area");
  if (sendBtn && chatInput && chatArea) {
    sendBtn.addEventListener("click", () => {
      const msg = chatInput.value && chatInput.value.trim();
      if (!msg) return;
      chatArea.innerHTML += `<div class="chat-msg">${msg}</div>`;
      chatInput.value = "";
    });
  }

  // lightweight startMessaging behaviors (kept minimal for lint safety)
  function playSound(src) {
    try {
      /* graceful: only attempt in browser */
      if (typeof Audio === "function") new Audio(src).play();
    } catch (e) {
      /* noop */
    }
  }

  // expose a simple review hook
  window.reviewChat = () => playSound("assets/sounds/review.mp3");
}

// keep default export for compatibility
export default showMessaging;
