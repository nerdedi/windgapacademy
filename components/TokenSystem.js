// Token System Module
// Earn tokens, spend in store, track achievements

  function helpButton() {
    return `<button id="token-help" aria-label="Help" title="Help">❓</button>`;
  }
  function privacyNotice() {
    return `<div id="privacy-notice" style="font-size:0.9em;color:#555;margin:8px 0;">All token actions are private and only used for educational motivation.</div>`;
  }
    container.innerHTML = ` 
    <section id="token-system" class="au-section" aria-label="Token System">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h2>Token System</h2>
        ${helpButton()}
      </div>
      <div id="token-count" aria-label="Token Count">Tokens: ${tokens}</div>
      <button id="earn-token" aria-label="Earn Token">Earn Token</button>
      <button id="go-store" aria-label="Go to Store">Go to Store</button>
      <button id="return-dashboard" aria-label="Return to Dashboard">Return to Dashboard</button>
      ${privacyNotice()}
      <div class="lesson-plan-au">
        <h3>Lesson Plan: Token System (Australian Curriculum)</h3>
        <p>Objective: Motivate and reward positive behaviour and achievement in Australian schools.</p>
        <ul>
          <li>Discuss fair and inclusive reward systems.</li>
          <li>Connect to Personal and Social Capability curriculum.</li>
          <li>Reflect on intrinsic and extrinsic motivation in the classroom.</li>
        </ul>
        <p>Educator Notes: Use tokens to reinforce positive behaviour and achievement, aligned to Australian values.</p>
      </div>
      <div id="token-prompt" style="margin-top:12px;" aria-live="polite"></div>
    </section>
  `;
  // Keyboard navigation for all buttons
    Array.from(container.querySelectorAll('button')).forEach(function(el) { el.tabIndex = 0; });
  // Help/info button
    var helpBtn = container.querySelector('#token-help');
    if (helpBtn) {
      helpBtn.onclick = function() {
        alert('Tokens motivate and reward positive behaviour. All actions are private and educator-reviewed.');
      };
    }
    var tokenCountDiv = container.querySelector('#token-count');
    var tokenPromptDiv = container.querySelector('#token-prompt');
    var earnTokenBtn = container.querySelector('#earn-token');
    var goStoreBtn = container.querySelector('#go-store');
    var returnDashboardBtn = container.querySelector('#return-dashboard');
    var currentTokens = tokens;
    if (earnTokenBtn && tokenCountDiv && tokenPromptDiv) {
      earnTokenBtn.onclick = function() {
        currentTokens++;
        tokenCountDiv.textContent = 'Tokens: ' + currentTokens;
        tokenPromptDiv.textContent = 'Great job! You earned a token for positive behaviour.';
        setTimeout(function() { tokenPromptDiv.textContent = ''; }, 3000);
      };
    }
    if (goStoreBtn) {
      goStoreBtn.onclick = function() {
        window.route('academy-store');
      };
    }
    if (returnDashboardBtn) {
      returnDashboardBtn.onclick = function() {
        window.route('dashboard');
      };
    }
  document.getElementById('earn-token').onclick = () => earnToken();
  document.getElementById('go-store').onclick = () => window.route('academy-store');
  document.getElementById('return-dashboard').onclick = () => window.route('dashboard');
  // Rotating educational prompt
  const prompts = [
    'Tip: Earn tokens for achievements and positive behaviour.',
    'Tip: All token actions are private and educator-reviewed.',
    'Tip: Visit the store to spend your tokens.',
    'Tip: Achievements unlock new rewards.'
  ];
  let promptIndex = 0;
  function showPrompt() {
    document.getElementById('token-prompt').textContent = prompts[promptIndex % prompts.length];
    promptIndex++;
    setTimeout(showPrompt, 7000);
  }
  showPrompt();

function earnToken() {
  playSound('assets/sounds/token-earn.mp3');
  animateEffect('token-pop');
  // import { saveTokens } from '../firebase.js';
  // saveTokens(userId, tokens);
  // Log token earning for educator review
  if (window.logEducatorAction) window.logEducatorAction({ type: 'earnToken' });
  let tokens = parseInt(document.getElementById('token-count').textContent.split(':')[1]) || 0;
  tokens = addToken(tokens);
  document.getElementById('token-count').textContent = `Tokens: ${tokens}`;
  if (isAchievementUnlocked(tokens, 10)) {
    alert('Achievement unlocked: 10 tokens!');
  }
  // Integrate with backend or Firebase here
}

// Pure functions
function addToken(tokens) {
  // Token count is independent; adding a token does not affect other state.
  return tokens + 1;
}
function isAchievementUnlocked(tokens, threshold) {
  // Achievement logic is clear and based only on token count.
  return tokens === threshold;
}
