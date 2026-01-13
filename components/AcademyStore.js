// Academy Store Module — consolidated & cleaned
// Spend tokens, buy items, track purchases

// --- Utilities ---
function escapeHTML(str = "") {
  return str.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
}

function safeRun(fn) {
  try {
    fn();
  } catch (e) {
    console.error("Error:", e);
  }
}

// --- Backup / Sync ---
function backupCart(cart = []) {
  localStorage.setItem("academyStoreCart", JSON.stringify(cart));
}

function syncCart() {
  try {
    const raw = localStorage.getItem("academyStoreCart");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function backupProgress(progress = { tokens: 0, purchases: [] }) {
  localStorage.setItem("academyStoreProgress", JSON.stringify(progress));
}

function syncProgress() {
  try {
    const raw = localStorage.getItem("academyStoreProgress");
    return raw ? JSON.parse(raw) : { tokens: 0, purchases: [] };
  } catch {
    return { tokens: 0, purchases: [] };
  }
}

// --- Token store mechanics ---
function getItemCost(item) {
  switch (item) {
    case "Badge":
      return 5;
    case "Outfit":
      return 10;
    case "Sticker":
      return 3;
    default:
      return 0;
  }
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
    audio.play().catch(() => {});
  } catch (e) {
    console.error("Audio play error:", e);
  }
}

function animateEffect(element, effect) {
  if (element) {
    element.classList.add(effect);
    setTimeout(() => element.classList.remove(effect), 700);
  }
}

// --- Main Store UI ---
export function showAcademyStore(container, tokens = 0) {
  if (!container) return;

  container.innerHTML = `
    <section id="academy-store" class="au-section" role="region" aria-label="Academy Store">
      <div class="flex justify-between items-center card smooth-shadow mb-4">
        <h2 class="text-2xl font-bold text-primary text-smooth">Academy Store</h2>
        <button id="store-help" class="btn-secondary" aria-label="Help" title="Help">❓</button>
      </div>
      <div id="store-tokens" class="text-lg font-semibold mb-4" aria-label="Token Count">Tokens: ${tokens}</div>
      <div id="store-items" class="flex flex-wrap gap-3" aria-label="Store Items">
        <button class="btn-primary store-item" data-item="Badge" aria-label="Buy Badge">Buy Badge (5 tokens)</button>
        <button class="btn-primary store-item" data-item="Outfit" aria-label="Buy Outfit">Buy Outfit (10 tokens)</button>
        <button class="btn-primary store-item" data-item="Sticker" aria-label="Buy Sticker">Buy Sticker (3 tokens)</button>
      </div>
      <div id="store-feedback" class="mt-3 text-lg" aria-live="polite"></div>
      <div class="text-sm text-gray-600 my-2">All store actions are private and only used for educational financial literacy.</div>
    </section>
  `;

  // Bind handlers directly (no setTimeout race)
  const tokenDiv = container.querySelector("#store-tokens");
  const feedbackDiv = container.querySelector("#store-feedback");
  const storeItems = container.querySelector("#store-items");
  const itemBtns = container.querySelectorAll(".store-item");
  let currentTokens = tokens;

  itemBtns.forEach((btn) => {
    btn.onclick = function () {
      const item = this.getAttribute("data-item");
      const cost = getItemCost(item);

      if (canAfford(currentTokens, cost)) {
        currentTokens = deductTokens(currentTokens, cost);
        if (tokenDiv) tokenDiv.textContent = "Tokens: " + currentTokens;
        if (feedbackDiv) feedbackDiv.textContent = "Purchased " + escapeHTML(item) + "!";
        playSound("/assets/sounds/purchase.mp3");
        animateEffect(storeItems, "purchase-success");

        // Save progress
        const progress = syncProgress();
        progress.tokens = currentTokens;
        progress.purchases.push({ item, timestamp: Date.now() });
        backupProgress(progress);
      } else {
        if (feedbackDiv)
          feedbackDiv.textContent = "Not enough tokens for " + escapeHTML(item) + ".";
        playSound("/assets/sounds/error.mp3");
        animateEffect(storeItems, "purchase-fail");
      }

      setTimeout(() => {
        if (feedbackDiv) feedbackDiv.textContent = "";
      }, 3000);
    };
  });

  const helpBtn = container.querySelector("#store-help");
  if (helpBtn) {
    helpBtn.onclick = () => {
      alert("Spend tokens to buy items. All actions are private and educator-reviewed.");
    };
  }
}

// Export alias for compatibility
export const showTokenSystem = showAcademyStore;
