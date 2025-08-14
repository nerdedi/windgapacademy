// Academy Store Module
// Spend tokens, buy items, track purchases

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
  document.getElementById('store-help').onclick = () => {
    alert('The Academy Store teaches financial literacy. All actions are private and educator-reviewed.');
  };
  document.getElementById('buy-badge').onclick = () => buyItem('Badge');
  document.getElementById('buy-outfit').onclick = () => buyItem('Outfit');
  document.getElementById('buy-accessory').onclick = () => buyItem('Avatar Accessory');
  document.getElementById('return-dashboard').onclick = () => window.route('dashboard');
  // Rotating educational prompt
  const prompts = [
    'Tip: Budget your tokens before making a purchase.',
    'Tip: All store actions are private and educator-reviewed.',
    'Tip: Needs vs wants—make ethical choices.',
    'Tip: Financial literacy helps with real-world decisions.'
  ];
  let promptIndex = 0;
  function showPrompt() {
    document.getElementById('store-prompt').textContent = prompts[promptIndex % prompts.length];
    promptIndex++;
    setTimeout(showPrompt, 7000);
  }
  showPrompt();

function buyItem(item) {
  playSound('assets/sounds/store-buy.mp3');
  animateEffect('store-flash');
  // import { savePurchase } from '../firebase.js';
  // savePurchase(userId, item);
  // Log purchase for educator review
  if (window.logEducatorAction) window.logEducatorAction({ type: 'buyItem', item });
  let tokens = parseInt(document.getElementById('store-tokens').textContent.split(':')[1]) || 0;
  let cost = getItemCost(item);
  if (!canAfford(tokens, cost)) {
    alert('Not enough tokens!');
    return;
  }
  tokens = deductTokens(tokens, cost);
  document.getElementById('store-tokens').textContent = `Tokens: ${tokens}`;
  alert(`Purchased: ${item}`);
  // Track purchases (could integrate with backend)
  const purchases = document.getElementById('store-items');
  purchases.innerHTML += `<div class='purchase'>${item} purchased!</div>`;
}

// Pure functions
function getItemCost(item) {
  // Item cost is independent; changing one does not affect others.
  return item === 'Badge' ? 5 : item === 'Outfit' ? 10 : 3;
}
function canAfford(tokens, cost) {
  // Affordability is based only on current tokens and item cost.
  return tokens >= cost;
}
function deductTokens(tokens, cost) {
  // Deduct tokens independently; no hidden dependencies.
  return tokens - cost;
}
function playSound(src) {
  const audio = new Audio(src);
  audio.play();
}

function animateEffect(effect) {
  document.getElementById('store-items').classList.add(effect);
  setTimeout(() => document.getElementById('store-items').classList.remove(effect), 700);
}
