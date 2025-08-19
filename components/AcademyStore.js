// Academy Store Module
// Spend tokens, buy items, track purchases

// Pure functions for store logic
function getItemCost(item) {
  return item === 'Badge' ? 5 : item === 'Outfit' ? 10 : 3;
// ...existing code...
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
  } catch (e) {}
}
function animateEffect(effect) {
  const storeItems = document.getElementById('store-items');
  if (storeItems) {
    storeItems.classList.add(effect);
    setTimeout(() => storeItems.classList.remove(effect), 700);
  }
}

export function showAcademyStore(container, tokens = 0, userId = null) {
  function helpButton() {
    return `<button id="store-help" aria-label="Help" title="Help">❓</button>`;
  }
  function privacyNotice() {
    return `<div id="privacy-notice" style="font-size:0.9em;color:#555;margin:8px 0;">All store actions are private and only used for educational financial literacy.</div>`;
  }
  container.innerHTML = `
    <section id="academy-store" class="au-section" aria-label="Academy Store">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h2>Academy Store</h2>
        ${helpButton()}
      </div>
      <div id="store-tokens" aria-label="Token Count">Tokens: ${tokens}</div>
      <div id="store-items" aria-label="Store Items">
        <button class="store-item" data-item="Badge" aria-label="Buy Badge">Buy Badge (5 tokens)</button>
        <button class="store-item" data-item="Outfit" aria-label="Buy Outfit">Buy Outfit (10 tokens)</button>
        <button class="store-item" data-item="Sticker" aria-label="Buy Sticker">Buy Sticker (3 tokens)</button>
      </div>
      <div id="store-feedback" style="margin-top:12px;" aria-live="polite"></div>
      ${privacyNotice()}
    </section>
  // Interactive logic
  setTimeout(function() {
    var tokenDiv = container.querySelector('#store-tokens');
    var feedbackDiv = container.querySelector('#store-feedback');
    var itemBtns = container.querySelectorAll('.store-item');
    var currentTokens = tokens;
    for (var i = 0; i < itemBtns.length; i++) {
      itemBtns[i].onclick = function() {
        var item = this.getAttribute('data-item');
        var cost = getItemCost(item);
        if (canAfford(currentTokens, cost)) {
          currentTokens = deductTokens(currentTokens, cost);
          tokenDiv.textContent = 'Tokens: ' + currentTokens;
          feedbackDiv.textContent = 'Purchased ' + item + '!';
          playSound('assets/sounds/purchase.mp3');
          animateEffect('purchase-success');
          if (userId) {
            import('../firebase.js').then(function(mod) {
              mod.savePurchase(userId, item);
            });
          }
        } else {
          feedbackDiv.textContent = 'Not enough tokens for ' + item + '.';
          playSound('assets/sounds/error.mp3');
          animateEffect('purchase-fail');
        }
        setTimeout(function() { feedbackDiv.textContent = ''; }, 3000);
      };
    }
    var helpBtn = container.querySelector('#store-help');
    if (helpBtn) {
      helpBtn.onclick = function() {
        alert('Spend tokens to buy items. All actions are private and educator-reviewed.');
      };
    }
  }, 0);
      <div id="store-tokens" aria-label="Token Balance">Tokens: ${tokens}</div>
      <div id="store-items" aria-label="Store Items">
        <button id="buy-badge" aria-label="Buy Badge">Buy Badge (5 tokens)</button>
        <button id="buy-outfit" aria-label="Buy Outfit">Buy Outfit (10 tokens)</button>
        <button id="buy-accessory" aria-label="Buy Accessory">Buy Accessory (3 tokens)</button>
      </div>
      <button id="return-dashboard" aria-label="Return to Dashboard">Return to Dashboard</button>
      ${privacyNotice()}
      <div class="lesson-plan-au">
        <h3>Lesson Plan: Academy Store (Australian Curriculum)</h3>
        <p>Objective: Teach financial literacy and decision-making in Australian schools.</p>
        <ul>
          <li>Discuss budgeting, saving, and spending tokens.</li>
          <li>Connect to Mathematics and Economics curriculum.</li>
          <li>Reflect on needs vs wants and ethical choices.</li>
        </ul>
        <p>Educator Notes: Use the store to model real-world financial decisions, using Australian currency and examples.</p>
      </div>
      <div id="store-prompt" style="margin-top:12px;" aria-live="polite"></div>
    </section>
  `;
  // Keyboard navigation for all buttons
  Array.from(container.querySelectorAll('button')).forEach(el => { el.tabIndex = 0; });
  // Help/info button
  const storeHelp = document.getElementById('store-help');
  if (storeHelp) storeHelp.onclick = () => {
    alert('The Academy Store teaches financial literacy. All actions are private and educator-reviewed.');
  };

  let currentTokens = tokens;
  function buyItem(item) {
    playSound('assets/sounds/store-buy.mp3');
    animateEffect('store-flash');
    // import { savePurchase } from '../firebase.js';
    // savePurchase(userId, item);
    if (window.logEducatorAction) window.logEducatorAction({ type: 'buyItem', item });
    let cost = getItemCost(item);
    if (!canAfford(currentTokens, cost)) {
      alert('Not enough tokens!');
      return;
    }
    currentTokens = deductTokens(currentTokens, cost);
    const storeTokens = document.getElementById('store-tokens');
    if (storeTokens) storeTokens.textContent = `Tokens: ${currentTokens}`;
    alert(`Purchased: ${item}`);
    const purchases = document.getElementById('store-items');
    if (purchases) purchases.innerHTML += `<div class='purchase'>${item} purchased!</div>`;
  }

  const buyBadgeBtn = document.getElementById('buy-badge');
  if (buyBadgeBtn) buyBadgeBtn.onclick = () => buyItem('Badge');
  const buyOutfitBtn = document.getElementById('buy-outfit');
  if (buyOutfitBtn) buyOutfitBtn.onclick = () => buyItem('Outfit');
  const buyAccessoryBtn = document.getElementById('buy-accessory');
  if (buyAccessoryBtn) buyAccessoryBtn.onclick = () => buyItem('Avatar Accessory');
  const returnDashboardBtn = document.getElementById('return-dashboard');
  if (returnDashboardBtn) returnDashboardBtn.onclick = () => window.route('dashboard');

  // Rotating educational prompt
  const prompts = [
    'Tip: Budget your tokens before making a purchase.',
    'Tip: All store actions are private and educator-reviewed.',
    'Tip: Needs vs wants—make ethical choices.',
    'Tip: Financial literacy helps with real-world decisions.'
  ];
  let promptIndex = 0;
  function showPrompt() {
    const storePrompt = document.getElementById('store-prompt');
    if (storePrompt) storePrompt.textContent = prompts[promptIndex % prompts.length];
    promptIndex++;
    setTimeout(showPrompt, 7000);
  }
  showPrompt();
}
  showPrompt();
}
