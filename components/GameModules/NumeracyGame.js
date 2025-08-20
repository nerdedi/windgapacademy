// Numeracy Game Module: Supermarket Simulator
// Drag and drop items, pay with correct money, animated Daisy explains, Winnie cheers
// Feedback on mistakes encourages perseverance
// All visuals are Australian currency

export function showNumeracyGame(container, userData = {}) {
  container.innerHTML = `
    <section id="supermarket-sim" aria-label="Supermarket Simulator">
      <h2>🔢 Supermarket Simulator</h2>
      <canvas id="shop-map" width="600" height="400" aria-label="Shop Map" tabindex="0"></canvas>
      <div id="shopping-list" aria-live="polite">Milk, Apples, Bread</div>
      <div id="cart" aria-live="polite"></div>
      <div id="checkout" aria-live="polite"></div>
  <img src="assets/images/aud_notes.png" alt="Australian Currency" loading="lazy" />
      <button id="numeracy-return" class="nav-btn" aria-label="Return to Dashboard">Return to Dashboard</button>
    </section>
  `;
  document.getElementById('numeracy-return').onclick = function() { window.route('dashboard'); };
  startSupermarketSim(userData);
}

function startSupermarketSim() {
  const canvas = document.getElementById('shop-map');
  const ctx = canvas.getContext('2d');
  let items = [
    { name: 'Milk', x: 100, y: 100, price: 2.5 },
    { name: 'Apples', x: 250, y: 100, price: 3.0 },
    { name: 'Bread', x: 400, y: 100, price: 2.0 }
  ];
  let cart = [];
  let dragging = null;
  let progress = [];
  let completed = false;

  function drawShop() {
    ctx.fillStyle = '#eaf6f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '18px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText('Supermarket', 250, 40);
    items.forEach(item => {
      ctx.fillStyle = '#fff';
      ctx.fillRect(item.x, item.y, 80, 40);
      ctx.strokeRect(item.x, item.y, 80, 40);
      ctx.fillStyle = '#333';
      ctx.fillText(item.name, item.x + 10, item.y + 25);
      ctx.fillText(`$${item.price.toFixed(2)}`, item.x + 10, item.y + 38);
    });
  }

  function drawCart() {
  const cartDiv = document.getElementById('cart');
  cartDiv.innerHTML = '<strong>Cart:</strong> ' + cart.map(i => i.name).join(', ');
  progress.push({ action: 'cartUpdate', cart: cart.map(i => i.name) });
  }

  function drawCheckout() {
    const checkoutDiv = document.getElementById('checkout');
    let total = cart.reduce((sum, i) => sum + i.price, 0);
  checkoutDiv.innerHTML = `<strong>Total:</strong> $${total.toFixed(2)} <button id='pay-btn' class='nav-btn' aria-label='Pay'>Pay</button>`;
    document.getElementById('pay-btn').onclick = () => {
      if (total === 7.5) {
        progress.push({ action: 'pay', total, correct: true });
        checkoutDiv.innerHTML += `<div style='color:#22c55e;font-weight:600;margin-top:8px;'>Correct! Daisy: "Great shopping!" Winnie: "You paid the right amount!"</div>`;
        if (!completed) {
          completed = true;
          setTimeout(() => {
            checkoutDiv.innerHTML += `<div style='color:#3b82f6;font-weight:600;margin-top:8px;'>Game complete! Well done.</div>`;
            progress.push({ action: 'complete' });
            if (userData && userData.userId) {
              import('../../firebase.js').then(mod => {
                mod.saveLessonPlan('numeracy-game', userData.userId, JSON.stringify(progress));
              });
            }
          }, 1200);
        }
      } else {
        progress.push({ action: 'pay', total, correct: false });
        checkoutDiv.innerHTML += `<div style='color:#ef4444;font-weight:600;margin-top:8px;'>Try again! Andy: "Check your cart and total."</div>`;
      }
    };
  }

  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    items.forEach(item => {
      if (mx > item.x && mx < item.x + 80 && my > item.y && my < item.y + 40) {
        dragging = item;
      }
    });
  });
  canvas.addEventListener('mouseup', (e) => {
    if (dragging) {
      cart.push(dragging);
      drawCart();
      drawCheckout();
      dragging = null;
    }
  });

  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawShop();
    requestAnimationFrame(gameLoop);
  }
  drawCart();
  drawCheckout();
  gameLoop();

  // --- Progress Tracking ---
  function saveProgress(data) {
    localStorage.setItem('numeracyGameProgress', JSON.stringify(data));
  }
  function loadProgress() {
    return JSON.parse(localStorage.getItem('numeracyGameProgress') || '[]');
  }

  // --- Accessibility Options ---
  let accessibilityOptions = { highContrast: false, textToSpeech: false, fontSize: 'medium', keyboardOnly: false };
  function setAccessibility(option, value) {
    accessibilityOptions[option] = value;
    if (option === 'highContrast') {
      document.body.classList.toggle('high-contrast', value);
    }
    if (option === 'fontSize') {
      document.body.style.fontSize = value;
    }
    // TODO: Implement text-to-speech and keyboard-only navigation
  }

  // --- Achievements ---
  let achievements = [];
  function unlockAchievement(name) {
    achievements.push(name);
  }
  // --- Audio Narration & Sound Effects ---
  function playAudio(src) {
    const audio = new Audio(src);
    audio.play();
  }
  // --- Hints & Help System ---
  function showHint() {
    // TODO: Show hint for current task
  }
  // --- Multiplayer/Collaboration ---
  function startMultiplayer() {
    // TODO: Setup multiplayer mode
  }
  // --- Educator Dashboard & Analytics ---
  function logActivity(activity) {
    // TODO: Send activity log to educator dashboard
  }
  // --- Avatar Rewards ---
  function unlockAvatarFeature(feature) {
    // TODO: Unlock avatar customization
  }
  // --- Mini Games ---
  function launchMiniGame(name) {
    // TODO: Launch mini game
  }
  // --- Feedback & Reflection ---
  function showReflectionPrompt() {
    // TODO: Show reflection prompt after game
  }
  // --- Localization & Language Support ---
  let language = 'en';
  function setLanguage(lang) {
    language = lang;
  }
  // --- Story Mode ---
  let storyProgress = 0;
  function advanceStory() {
    storyProgress++;
  }
  // --- UI Control Panel Integration ---
function addControlPanel(container) {
  const settingsBtn = document.createElement('button');
  settingsBtn.id = 'settings-btn';
  settingsBtn.textContent = '⚙️';
  settingsBtn.style.position = 'fixed';
  settingsBtn.style.top = '24px';
  settingsBtn.style.right = '24px';
  settingsBtn.style.zIndex = '1000';
  settingsBtn.style.fontSize = '1.5em';
  settingsBtn.style.background = '#fff';
  settingsBtn.style.border = '1px solid #ccc';
  settingsBtn.style.borderRadius = '50%';
  settingsBtn.style.width = '48px';
  settingsBtn.style.height = '48px';
  settingsBtn.style.cursor = 'pointer';
  document.body.appendChild(settingsBtn);

  const modal = document.createElement('div');
  modal.id = 'settings-modal';
  modal.style.position = 'fixed';
  modal.style.top = '50%';
  modal.style.left = '50%';
  modal.style.transform = 'translate(-50%, -50%)';
  modal.style.background = '#fff';
  modal.style.border = '2px solid #1976d2';
  modal.style.borderRadius = '12px';
  modal.style.padding = '24px';
  modal.style.zIndex = '1001';
  modal.style.display = 'none';
  modal.style.minWidth = '320px';
  modal.innerHTML = `
    <h3>Game Settings</h3>
    <div>
      <label><input type="checkbox" id="high-contrast-toggle"> High Contrast</label>
      <label>Font Size: <select id="font-size-select">
        <option value="medium">Medium</option>
        <option value="large">Large</option>
        <option value="x-large">Extra Large</option>
      </select></label>
      <label>Language: <select id="language-select">
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="zh">Chinese</option>
      </select></label>
    </div>
    <hr>
    <div>
      <h4>Achievements</h4>
      <ul id="achievements-list"></ul>
    </div>
    <div>
      <button id="hint-btn">Show Hint</button>
      <button id="close-settings">Close</button>
    </div>
    <div>
      <h4>Progress</h4>
      <div id="progress-summary"></div>
    </div>
    <hr>
    <div>
      <button id="voice-btn">Voice Recognition</button>
      <button id="sync-btn">Sync Progress</button>
      <button id="parent-feedback-btn">Parent Feedback</button>
      <button id="challenges-btn">Challenges/Leaderboard</button>
      <button id="arvr-btn">AR/VR Mode</button>
      <button id="offline-btn">Offline Mode</button>
      <button id="theme-btn">Theme Customization</button>
      <button id="sign-avatar-btn">Sign Language Avatar</button>
      <button id="content-create-btn">Content Creation</button>
    </div>
  `;
  document.body.appendChild(modal);

  settingsBtn.onclick = () => { modal.style.display = 'block'; };
  modal.querySelector('#close-settings').onclick = () => { modal.style.display = 'none'; };
  modal.querySelector('#high-contrast-toggle').onchange = e => setAccessibility('highContrast', e.target.checked);
  modal.querySelector('#font-size-select').onchange = e => setAccessibility('fontSize', e.target.value);
  modal.querySelector('#language-select').onchange = e => setLanguage(e.target.value);
  function updateAchievements() {
    const list = modal.querySelector('#achievements-list');
    list.innerHTML = achievements.length ? achievements.map(a => `<li>${a}</li>`).join('') : '<li>No achievements yet.</li>';
  }
  updateAchievements();
  modal.querySelector('#hint-btn').onclick = () => {
    showHint();
    alert('Hint: Try the supermarket simulator task!');
  };
  function updateProgress() {
    const summary = modal.querySelector('#progress-summary');
    const progress = loadProgress();
    summary.textContent = progress.length ? `Completed: ${progress.length} steps.` : 'No progress yet.';
  }
  updateProgress();
  modal.querySelector('#voice-btn').onclick = enableVoiceRecognition;
  modal.querySelector('#sync-btn').onclick = syncProgressWithPlatform;
  modal.querySelector('#parent-feedback-btn').onclick = openParentFeedback;
  modal.querySelector('#challenges-btn').onclick = showChallengesAndLeaderboard;
  modal.querySelector('#arvr-btn').onclick = enableARVRMode;
  modal.querySelector('#offline-btn').onclick = enableOfflineMode;
  modal.querySelector('#theme-btn').onclick = showThemeCustomization;
  modal.querySelector('#sign-avatar-btn').onclick = enableSignLanguageAvatar;
  modal.querySelector('#content-create-btn').onclick = openContentCreationTools;
}

// --- Advanced Feature Implementations ---
function enableVoiceRecognition() {
  if (!('webkitSpeechRecognition' in window)) {
    alert('Speech recognition not supported in this browser.');
    return;
  }
  const recognition = new webkitSpeechRecognition();
  recognition.lang = language;
  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    alert('You said: ' + transcript);
    // Optionally, auto-fill input fields
  };
  recognition.start();
}
function syncProgressWithPlatform() {
  const progress = [];
  fetch('https://api.example.com/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ game: 'numeracy', progress })
  }).then(r => r.json()).then(data => {
    alert('Progress synced!');
  }).catch(() => alert('Sync failed.'));
}
function openParentFeedback() {
  let modal = document.getElementById('parent-feedback-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'parent-feedback-modal';
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.background = '#fff';
    modal.style.border = '2px solid #1976d2';
    modal.style.borderRadius = '12px';
    modal.style.padding = '24px';
    modal.style.zIndex = '1002';
    modal.innerHTML = `
      <h3>Parent/Guardian Feedback</h3>
      <textarea id="feedback-text" rows="4" style="width:100%" placeholder="Enter feedback..."></textarea>
      <br><button id="send-feedback">Send</button>
      <button id="close-feedback">Close</button>
    `;
    document.body.appendChild(modal);
    modal.querySelector('#send-feedback').onclick = () => {
      const text = modal.querySelector('#feedback-text').value;
      localStorage.setItem('numeracyGameParentFeedback', text);
      alert('Feedback sent!');
    };
    modal.querySelector('#close-feedback').onclick = () => { modal.style.display = 'none'; };
  }
  modal.style.display = 'block';
}
function showChallengesAndLeaderboard() {
  let modal = document.getElementById('challenges-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'challenges-modal';
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.background = '#fff';
    modal.style.border = '2px solid #1976d2';
    modal.style.borderRadius = '12px';
    modal.style.padding = '24px';
    modal.style.zIndex = '1002';
    modal.innerHTML = `
      <h3>Challenges & Leaderboard</h3>
      <div id="challenge-list"></div>
      <div id="leaderboard-list"></div>
      <button id="close-challenges">Close</button>
    `;
    document.body.appendChild(modal);
    modal.querySelector('#close-challenges').onclick = () => { modal.style.display = 'none'; };
  }
  const challenges = [
    { name: 'Buy all items', completed: false },
    { name: 'Pay correct total', completed: false }
  ];
  modal.querySelector('#challenge-list').innerHTML = '<ul>' + challenges.map(c => `<li>${c.name} - ${c.completed ? '✔️' : '❌'}</li>`).join('') + '</ul>';
  let leaderboard = JSON.parse(localStorage.getItem('numeracyGameLeaderboard') || '[]');
  modal.querySelector('#leaderboard-list').innerHTML = '<h4>Leaderboard</h4><ul>' + leaderboard.map(e => `<li>${e.name}: ${e.score}</li>`).join('') + '</ul>';
  modal.style.display = 'block';
}
function enableARVRMode() {
  if (!document.getElementById('arvr-scene')) {
    const scene = document.createElement('a-scene');
    scene.id = 'arvr-scene';
    scene.innerHTML = `<a-box position="0 1 -3" color="#4CC3D9"></a-box>`;
    document.body.appendChild(scene);
    alert('AR/VR mode enabled (A-Frame stub).');
  }
}
function enableOfflineMode() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(() => {
      alert('Offline mode enabled!');
    }).catch(() => alert('Offline mode registration failed.'));
  }
}
function showThemeCustomization() {
  let modal = document.getElementById('theme-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'theme-modal';
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.background = '#fff';
    modal.style.border = '2px solid #1976d2';
    modal.style.borderRadius = '12px';
    modal.style.padding = '24px';
    modal.style.zIndex = '1002';
    modal.innerHTML = `
      <h3>Theme Customization</h3>
      <select id="theme-select">
        <option value="default">Default</option>
        <option value="dark">Dark</option>
        <option value="pastel">Pastel</option>
      </select>
      <button id="apply-theme">Apply</button>
      <button id="close-theme">Close</button>
    `;
    document.body.appendChild(modal);
    modal.querySelector('#apply-theme').onclick = () => {
      const theme = modal.querySelector('#theme-select').value;
      localStorage.setItem('numeracyGameTheme', theme);
      document.body.className = theme;
      alert('Theme applied!');
    };
    modal.querySelector('#close-theme').onclick = () => { modal.style.display = 'none'; };
  }
  modal.style.display = 'block';
}
function enableSignLanguageAvatar() {
  let overlay = document.getElementById('sign-avatar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'sign-avatar-overlay';
    overlay.style.position = 'fixed';
    overlay.style.bottom = '24px';
    overlay.style.right = '24px';
    overlay.style.width = '120px';
    overlay.style.height = '120px';
    overlay.style.background = '#fff';
    overlay.style.border = '2px solid #1976d2';
    overlay.style.borderRadius = '12px';
    overlay.style.zIndex = '1002';
    overlay.innerHTML = '<img src="/assets/sign-avatar.gif" alt="Sign Language Avatar" style="width:100%;height:100%;object-fit:contain;" />';
    document.body.appendChild(overlay);
  }
  overlay.style.display = 'block';
}
function openContentCreationTools() {
  let modal = document.getElementById('content-creation-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'content-creation-modal';
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.background = '#fff';
    modal.style.border = '2px solid #1976d2';
    modal.style.borderRadius = '12px';
    modal.style.padding = '24px';
    modal.style.zIndex = '1002';
    modal.innerHTML = `
      <h3>Custom Content Creation</h3>
      <input id="custom-item" type="text" placeholder="Enter new item..." style="width:100%;margin-bottom:8px;" />
      <button id="add-item">Add</button>
      <button id="close-content">Close</button>
      <div id="custom-items-list"></div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('#add-item').onclick = () => {
      const item = modal.querySelector('#custom-item').value;
      let items = JSON.parse(localStorage.getItem('numeracyGameCustomItems') || '[]');
      items.push(item);
      localStorage.setItem('numeracyGameCustomItems', JSON.stringify(items));
      updateItemsList();
    };
    modal.querySelector('#close-content').onclick = () => { modal.style.display = 'none'; };
    function updateItemsList() {
      let items = JSON.parse(localStorage.getItem('numeracyGameCustomItems') || '[]');
      modal.querySelector('#custom-items-list').innerHTML = '<ul>' + items.map(i => `<li>${i}</li>`).join('') + '</ul>';
    }
    updateItemsList();
  }
  modal.style.display = 'block';
}
// --- End Advanced Feature Suggestions ---

// --- Security & UI Polish Implementation ---
function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}
function secureApiCall(url, options) {
  // TODO: Add authentication and token handling
  return fetch(url, options);
}
function setModernTheme(theme) {
  document.body.className = theme;
}

// --- Accessibility & Error Handling Implementation ---
function enableKeyboardNavigation() {
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      const focusable = Array.from(document.querySelectorAll('button, [tabindex], input, select'));
      const index = focusable.indexOf(document.activeElement);
      const next = focusable[(index + 1) % focusable.length];
      if (next) next.focus();
      e.preventDefault();
    }
  });
}
function addAriaLabels() {
  document.body.setAttribute('aria-label', 'Numeracy Game');
}
function errorBoundary(fn) {
  try {
    fn();
  } catch (err) {
    alert('An error occurred: ' + err.message);
  }
}
addAriaLabels();
enableKeyboardNavigation();

// --- Engagement & Gamification ---
// TODO: Add more animations and sound effects for achievements and feedback
// TODO: Expand gamification with badges, streaks, and seasonal events
// TODO: Add micro-interactions and smooth transitions to game UI

// --- Security Improvements ---
// TODO: Review authentication and input sanitization for multiplayer and feedback
// TODO: Ensure secure API calls and data storage

// --- UI Polish & Customization ---
// TODO: Polish game UI with modern transitions and customization options

// --- Accessibility Improvements ---
// TODO: Implement keyboard navigation for all game controls and modals
// TODO: Add text-to-speech for prompts and feedback
// TODO: Ensure ARIA labels and focus management in all popups

// --- Error Handling Improvements ---
// TODO: Add error boundary for game logic and UI
// TODO: Improve feedback for invalid input and game errors

// --- Input Validation & Testing ---
// TODO: Validate all user input (e.g., text fields, answers)
// TODO: Add unit tests for game logic and UI components

// --- Analytics & Educator Tools ---
// TODO: Add advanced analytics and educator dashboard integration
// TODO: Expand educator content creation and reporting tools

// --- Community & Collaboration ---
// TODO: Expand forums, group projects, and peer review features
// TODO: Add safe chat moderation and reporting tools
// TODO: Improve collaboration and messaging components

// --- Internationalization & Localization ---
// TODO: Add more languages and RTL support
// TODO: Expand localization for all game UI and content

// --- Onboarding & Help ---
// TODO: Add interactive onboarding and guided tours for new users
// TODO: Expand help/support with tooltips and FAQ

// --- Backup & Sync ---
// TODO: Add cloud backup and restore for game progress
// TODO: Improve external platform sync and data export/import

// --- Input Validation & Engagement Implementation ---
function validateInput(input) {
  return typeof input === 'string' && input.trim().length > 0;
}
function showAchievement(msg) {
  const div = document.createElement('div');
  div.textContent = msg;
  div.style.position = 'fixed';
  div.style.top = '20px';
  div.style.right = '20px';
  div.style.background = '#22c55e';
  div.style.color = '#fff';
  div.style.padding = '12px 24px';
  div.style.borderRadius = '8px';
  div.style.zIndex = '1002';
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 2000);
}

// --- Analytics, Educator Tools, Community, Internationalization, Onboarding, Backup/Sync Implementation ---
function trackEvent(event, data) {
  // TODO: Integrate with analytics service
  console.log('Event:', event, data);
}
function showEducatorDashboard() {
  // TODO: Show educator dashboard and reporting tools
}
function showCommunityFeatures() {
  // TODO: Show forums, chat, and collaboration tools
}
function setLanguage(lang) {
  // TODO: Implement language selection and RTL support
  document.documentElement.lang = lang;
}
function startOnboarding() {
  // TODO: Show guided tour and help tooltips
}
function backupData() {
  // TODO: Implement cloud backup and restore
}

}
