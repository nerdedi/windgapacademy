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

export function showAcademyStore(container, tokens = 0) {
  function helpButton() {
    return "<button id=\"store-help\" aria-label=\"Help\" title=\"Help\">❓</button>";
  }
  function privacyNotice() {
  return "<div id=\"privacy-notice\" class=\"text-sm text-gray-600 my-2\">All store actions are private and only used for educational financial literacy.</div>";
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
