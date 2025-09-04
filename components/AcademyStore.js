// --- Advanced Feature Upgrades & TODOs ---
// Accessibility: ARIA roles, keyboard navigation
// Onboarding/help modal
// Backup/sync logic
// Gamification: challenges, leaderboard
// Educator/parent feedback
// Analytics integration
// Error boundaries
// UI settings modal
// Comprehensive academy store logic

function showOnboarding() {
  const modal = document.createElement("div");
  modal.className = "onboarding-modal";
  modal.innerHTML = `<h2>Welcome to Academy Store!</h2><p>Browse and purchase educational resources. Use the settings to personalize your experience.</p><button id='close-onboarding'>Close</button>`;
  document.body.appendChild(modal);
  document.getElementById("close-onboarding").onclick = () => modal.remove();
}

function setAccessibility() {
  const storeEl = document.getElementById("academy-store");
  if (storeEl) {
    storeEl.setAttribute("role", "region");
    storeEl.setAttribute("aria-label", "Academy Store");
  }
}

function backupProgress(progress) {
  localStorage.setItem("academyStoreProgress", JSON.stringify(progress));
}
function syncProgress() {
  return JSON.parse(localStorage.getItem("academyStoreProgress") || "{}");
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

function startAcademyStore() {
  showOnboarding();
  setAccessibility();
  // ...academy store logic...
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", startAcademyStore);
}
// --- Advanced Feature Upgrades & TODOs ---
// Accessibility: ARIA roles, keyboard navigation
// Onboarding/help modal
// Backup/sync logic
// Gamification: challenges, leaderboard
// Educator/parent feedback
// Analytics integration
// Error boundaries
// UI settings modal
// Comprehensive store logic

// Example: Add onboarding modal
function showOnboarding() {
  const modal = document.createElement("div");
  modal.className = "onboarding-modal";
  modal.innerHTML = `<h2>Welcome to Academy Store!</h2><p>Browse and purchase educational resources. Use the settings to customize your experience.</p><button id='close-onboarding'>Close</button>`;
  document.body.appendChild(modal);
  document.getElementById("close-onboarding").onclick = () => modal.remove();
}

// Example: Add ARIA attributes
function setAccessibility() {
  const storeEl = document.getElementById("academy-store");
  if (storeEl) {
    storeEl.setAttribute("role", "region");
    storeEl.setAttribute("aria-label", "Academy Store");
  }
}

// Example: Add backup/sync logic
function backupCart(cart) {
  localStorage.setItem("academyStoreCart", JSON.stringify(cart));
}
function syncCart() {
  return JSON.parse(localStorage.getItem("academyStoreCart") || "[]");
}

// Example: Gamification
function updateLeaderboard(purchases) {
  // ...leaderboard logic...
}

// Example: Educator/parent feedback
function sendFeedback(feedback) {
  // ...send feedback to server...
}

// Example: Analytics
function logEvent(event) {
  // ...analytics logic...
}

// Example: Error boundary
function safeRun(fn) {
  try {
    fn();
  } catch (e) {
    console.error("Error:", e);
  }
}

// Example: UI settings modal
function showSettings() {
  // ...settings modal logic...
}

// Comprehensive store logic placeholder
function startStore() {
  showOnboarding();
  setAccessibility();
  // ...store logic...
}

// Run store on DOMContentLoaded
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", startStore);
}
// Academy Store Module
// Spend tokens, buy items, track purchases
// Academy Store Module
// Spend tokens, buy items, track purchases

function getItemCost(item) {
  return item === "Badge" ? 5 : item === "Outfit" ? 10 : 3;
}
function canAfford(tokens, cost) {
  return tokens >= cost;
}
function deductTokens(tokens, cost) {
  return tokens - cost;
}
function playSound(src) {
  try {
    const audio = new Audio(src);
    audio.play();
  } catch (e) {
    console.error("Audio play error:", e);
  }
}
function animateEffect(effect) {
  const storeItems = document.getElementById("store-items");
  if (storeItems) {
    storeItems.classList.add(effect);
    setTimeout(() => storeItems.classList.remove(effect), 700);
  }
}

function showAcademyStore(container, tokens = 0) {
  function helpButton() {
    return '<button id="store-help" aria-label="Help" title="Help">❓</button>';
  }
  function privacyNotice() {
    return '<div id="privacy-notice" class="text-sm text-gray-600 my-2">All store actions are private and only used for educational financial literacy.</div>';
  }
  container.innerHTML = `
    <section id="academy-store" class="au-section" aria-label="Academy Store">
      <div class="flex justify-between items-center card smooth-shadow mb-4">
        <h2 class="text-2xl font-bold text-primary text-smooth">Academy Store</h2>
        ${helpButton()}
      </div>
      <div id="store-tokens" aria-label="Token Count">Tokens: ${tokens}</div>
      <div id="store-items" aria-label="Store Items">
        <button class="btn-primary store-item" data-item="Badge" aria-label="Buy Badge">Buy Badge (5 tokens)</button>
        <button class="btn-primary store-item" data-item="Outfit" aria-label="Buy Outfit">Buy Outfit (10 tokens)</button>
        <button class="btn-primary store-item" data-item="Sticker" aria-label="Buy Sticker">Buy Sticker (3 tokens)</button>
      </div>
      <div id="store-feedback" class="mt-3" aria-live="polite"></div>
      ${privacyNotice()}
    </section>
  `;
  // Interactive logic
  setTimeout(function () {
    var tokenDiv = container.querySelector("#store-tokens");
    var feedbackDiv = container.querySelector("#store-feedback");
    var itemBtns = container.querySelectorAll(".store-item");
    var currentTokens = tokens;
    for (var i = 0; i < itemBtns.length; i++) {
      itemBtns[i].onclick = function () {
        var item = this.getAttribute("data-item");
        var cost = getItemCost(item);
        if (canAfford(currentTokens, cost)) {
          currentTokens = deductTokens(currentTokens, cost);
          tokenDiv.textContent = "Tokens: " + currentTokens;
          feedbackDiv.textContent = "Purchased " + item + "!";
          playSound("assets/sounds/purchase.mp3");
          animateEffect("purchase-success");
        } else {
          feedbackDiv.textContent = "Not enough tokens for " + item + ".";
          playSound("assets/sounds/error.mp3");
          animateEffect("purchase-fail");
        }
        setTimeout(function () {
          feedbackDiv.textContent = "";
        }, 3000);
      };
    }
    var helpBtn = container.querySelector("#store-help");
    if (helpBtn) {
      helpBtn.onclick = function () {
        alert("Spend tokens to buy items. All actions are private and educator-reviewed.");
      };
    }
  }, 0);
}
// Export alias for compatibility with app.js import
const showTokenSystem = showAcademyStore;
export { showAcademyStore, showTokenSystem };
