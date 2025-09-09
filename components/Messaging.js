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
  modal.innerHTML = `<h2>Welcome to Messaging!</h2><p>Communicate safely and effectively. Use the settings to personalize your experience.</p><button id='close-onboarding' tabindex="0">Close</button>`;
  document.body.appendChild(modal);
  const closeBtn = document.getElementById("close-onboarding");
  if (closeBtn) {
    // use safeRun to protect against unexpected errors
    safeRun(() => {
      closeBtn.onclick = () => modal.remove();
      closeBtn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") closeBtn.click();
      });
    });
  }
}

function setAccessibility() {
  const msgEl = document.getElementById("messaging");
  if (msgEl) {
    msgEl.setAttribute("role", "region");
    msgEl.setAttribute("aria-label", "Messaging");
  }
}

function _backupProgress(progress) {
  localStorage.setItem("messagingProgress", JSON.stringify(progress));
}
function _syncProgress() {
  return JSON.parse(localStorage.getItem("messagingProgress") || "{}");
}

function _updateLeaderboard() {
  // ...leaderboard logic (placeholder)
}

function _sendFeedback(feedback) {
  // send feedback to server (best-effort). Shows confirmation in UI when possible.
  try {
    if (!feedback) return Promise.resolve(false);
    // best-effort: post to /api/feedback if available
    return fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedback }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Feedback endpoint error");
        return true;
      })
      .catch((err) => {
        console.warn("sendFeedback failed:", err);
        return false;
      });
  } catch (e) {
    console.warn("sendFeedback error:", e);
    return Promise.resolve(false);
  }
}

function _logEvent() {
  // ...analytics logic (placeholder)
}

function safeRun(fn) {
  try {
    fn();
  } catch (e) {
    console.error("Error:", e);
  }
}

function _showSettings() {
  // ...settings modal logic (placeholder)
}

// Note: avoid running on import. Call `showMessaging(container)` from app code
// to initialize messaging UI, onboarding and accessibility. The previous
// DOMContentLoaded side-effect was removed so this module is safe to import
// in server-side or test environments.
// Messaging & Chat Module
// Chat moderation, educator review, logs, terms acceptance

export function showMessaging(container, unreadCount = 0) {
  if (!container) return;
  // initialize optional onboarding and accessibility when mounting the UI
  safeRun(() => {
    showOnboarding();
    setAccessibility();
  });
  // ephemeral prompt helper
  let promptTimer = null;
  function showTemporaryPrompt(message, timeout = 3000) {
    try {
      const el = container.querySelector("#messaging-prompt");
      if (!el) return;
      el.textContent = message;
      if (promptTimer) clearTimeout(promptTimer);
      promptTimer = setTimeout(() => {
        el.textContent = "";
        promptTimer = null;
      }, timeout);
    } catch (e) {
      /* noop */
    }
  }
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
  if (helpBtn) {
    helpBtn.setAttribute("tabindex", "0");
    safeRun(() => {
      helpBtn.onclick = () =>
        showTemporaryPrompt(
          "Messaging is safe, private, and educator-reviewed. Use the chat and notification centre for learning support.",
        );
      helpBtn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") helpBtn.click();
      });
    });
  }
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
  // simple rate limiting and message controls
  const COOLDOWN_MS = 1500;
  const MAX_MSG_LENGTH = 500;
  let lastSentAt = 0;

  function logMessage(msg) {
    // Best-effort log for educator review; server endpoint optional
    try {
      if (!msg) return;
      if (typeof fetch === "function") {
        fetch("/api/logMessage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: msg, ts: Date.now() }),
        }).catch(() => {
          /* ignore */
        });
      } else {
        console.log("Logged message:", msg);
      }
    } catch (e) {
      /* noop */
    }
  }

  if (sendBtn && chatInput && chatArea) {
    const sendCurrentMessage = () => {
      const now = Date.now();
      if (now - lastSentAt < COOLDOWN_MS) {
        const waitSec = Math.ceil((COOLDOWN_MS - (now - lastSentAt)) / 1000);
        showTemporaryPrompt("Please wait " + waitSec + "s before sending another message.");
        return;
      }
      const msg = chatInput.value && chatInput.value.trim();
      if (!msg) return;
      if (msg.length > MAX_MSG_LENGTH) {
        showTemporaryPrompt("Message too long (max " + MAX_MSG_LENGTH + " chars).");
        return;
      }
      lastSentAt = now;
      chatArea.insertAdjacentHTML("beforeend", `<div class="chat-msg">${msg}</div>`);
      chatInput.value = "";
      logMessage(msg);
      showTemporaryPrompt("Message sent");
    };

    safeRun(() => {
      sendBtn.addEventListener("click", sendCurrentMessage);
      // keyboard accessibility: Enter or Space on the send button
      sendBtn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") sendBtn.click();
      });
      // allow pressing Enter inside the input to send
      chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          sendCurrentMessage();
        }
      });
    });
  }

  // lightweight startMessaging behaviors (kept minimal for lint safety)
  function playSound(src) {
    try {
      /* graceful: only attempt in browser and when src provided */
      if (!src) return;
      if (typeof Audio === "function") {
        const a = new Audio(src);
        a.addEventListener("error", () => {
          // audio failed to load/play; ignore silently
        });
        a.play().catch(() => {
          /* ignore play errors */
        });
      }
    } catch (e) {
      /* noop */
    }
  }

  // expose a simple review hook
  safeRun(() => {
    window.reviewChat = () => playSound("/assets/sounds/review.mp3");
  });
}

// keep default export for compatibility
export default showMessaging;
