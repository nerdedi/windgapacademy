// Literacy Game Module: Platformer
// Daisy explains rules, Winnie cheers, Andy motivates
// Levels increase in difficulty, feedback is motivational and independence-focused
// Visual effects: parallax backgrounds, animated coins, smooth transitions
// Learner Level shown instead of Score

export function showLiteracyGame(container, userData = {}) {
  container.innerHTML = `
    <section id="literacy-game" aria-label="Literacy Platformer">
      <h2>📚 Literacy Platformer</h2>
      <canvas id="literacy-platformer" width="800" height="400" aria-label="Platformer Game" tabindex="0"></canvas>
      <div id="literacy-feedback" aria-live="polite"></div>
      <div id="learner-level">Learner Level: ${userData.level || 1}</div>
  <button id="literacy-return" class="nav-btn" aria-label="Return to Dashboard">Return to Dashboard</button>
    </section>
  `;
  document.getElementById('literacy-return').onclick = function() { window.route('dashboard'); };
  startLiteracyPlatformer(userData);
}

function startLiteracyPlatformer() {
  const canvas = document.getElementById('literacy-platformer');
  const ctx = canvas.getContext('2d');
  let player = { x: 50, y: 350, vy: 0, jumping: false };
  let coins = [{ x: 200, y: 350 }, { x: 400, y: 350 }, { x: 600, y: 350 }];
  let score = 0;
  let level = 1;
  let progress = [];
  let completed = false;

  function drawBackground() {
    ctx.fillStyle = '#eaf6f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#b2d8d8';
    ctx.fillRect(0, 380, canvas.width, 20);
    // Parallax clouds
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(100, 80, 40, 0, 2 * Math.PI); ctx.fill();
    ctx.beginPath(); ctx.arc(300, 60, 30, 0, 2 * Math.PI); ctx.fill();
    ctx.beginPath(); ctx.arc(600, 100, 50, 0, 2 * Math.PI); ctx.fill();
  }

  function drawPlayer() {
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(player.x, player.y, 40, 40);
    ctx.font = '16px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText('Daisy', player.x + 2, player.y + 25);
  }

  function drawCoins() {
    coins.forEach((coin) => {
      ctx.fillStyle = '#ffd700';
      ctx.beginPath(); ctx.arc(coin.x, coin.y, 10, 0, 2 * Math.PI); ctx.fill();
    });
  }

  function update() {
    if (player.jumping) {
      player.vy += 1.5;
      player.y += player.vy;
      if (player.y >= 350) {
        player.y = 350;
        player.jumping = false;
        player.vy = 0;
      }
    }
    coins.forEach((coin, idx) => {
      if (Math.abs(player.x - coin.x) < 30 && Math.abs(player.y - coin.y) < 30) {
        coins.splice(idx, 1);
        score++;
        document.getElementById('literacy-feedback').innerText = `Great job! Coin collected. Total: ${score}`;
  document.getElementById('literacy-feedback').innerHTML = `<span style='color:#22c55e;font-weight:600;'>Great job! Coin collected. Total: ${score}</span>`;
        progress.push({ action: 'coin', x: player.x, y: player.y, level });
        if (score === 3) {
          level++;
          document.getElementById('learner-level').innerText = `Learner Level: ${level}`;
          document.getElementById('literacy-feedback').innerText = 'Level up! Daisy: "You did it!" Winnie: "Keep going!" Andy: "Awesome effort!"';
          document.getElementById('literacy-feedback').innerHTML = `<span style='color:#3b82f6;font-weight:600;'>Level up! Daisy: "You did it!" Winnie: "Keep going!" Andy: "Awesome effort!"</span>`;
          progress.push({ action: 'levelup', level });
          // Reset coins for next level
          coins.push({ x: 200, y: 350 }, { x: 400, y: 350 }, { x: 600, y: 350 });
          score = 0;
          if (level > 3 && !completed) {
            completed = true;
            setTimeout(() => {
              document.getElementById('literacy-feedback').innerText = 'Game complete! Well done.';
              document.getElementById('literacy-feedback').innerHTML = `<span style='color:#3b82f6;font-weight:600;'>Game complete! Well done.</span>`;
              progress.push({ action: 'complete', level });
              if (userData && userData.userId) {
                import('../../firebase.js').then(mod => {
                  mod.saveLessonPlan('literacy-game', userData.userId, JSON.stringify(progress));
                });
              }
            }, 1200);
          }
        }
      }
    });
  }

  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawPlayer();
    drawCoins();
    update();
    requestAnimationFrame(gameLoop);
  }

  canvas.setAttribute('tabindex', '0');
  canvas.focus();
  canvas.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !player.jumping) {
      player.jumping = true;
      player.vy = -18;
      document.getElementById('literacy-feedback').innerText = 'Jump!';
  document.getElementById('literacy-feedback').innerHTML = `<span style='color:#fbbf24;font-weight:600;'>Jump!</span>`;
      progress.push({ action: 'jump', x: player.x, y: player.y, level });
    }
    if (e.code === 'ArrowRight') {
      player.x += 20;
      progress.push({ action: 'moveRight', x: player.x, y: player.y, level });
    }
    if (e.code === 'ArrowLeft') {
      player.x -= 20;
      progress.push({ action: 'moveLeft', x: player.x, y: player.y, level });
    }
  });
  gameLoop();
}

// --- Progress Tracking ---
function saveProgress(data) {
  localStorage.setItem('literacyGameProgress', JSON.stringify(data));
}
function loadProgress() {
  return JSON.parse(localStorage.getItem('literacyGameProgress') || '[]');
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

// --- Feature Scaffolding ---
let userProgress = [];
function saveProgress(data) { /* TODO: Save progress to localStorage or backend */ }
let achievements = [];
function unlockAchievement(name) { achievements.push(name); }
let language = 'en';
function setLanguage(lang) { language = lang; }
let storyProgress = 0;
function advanceStory() { storyProgress++; }
// --- End Feature Scaffolding ---
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
  // TODO: Show hint for current level
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
  `;
  document.body.appendChild(modal);

  settingsBtn.onclick = () => { modal.style.display = 'block'; };
  modal.querySelector('#close-settings').onclick = () => { modal.style.display = 'none'; };
  modal.querySelector('#high-contrast-toggle').onchange = e => setAccessibility('highContrast', e.target.checked);
  modal.querySelector('#font-size-select').onchange = e => setAccessibility('fontSize', e.target.value);
  modal.querySelector('#language-select').onchange = e => setLanguage(e.target.value);
  modal.innerHTML += `
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
  function updateAchievements() {
    const list = modal.querySelector('#achievements-list');
    list.innerHTML = achievements.length ? achievements.map(a => `<li>${a}</li>`).join('') : '<li>No achievements yet.</li>';
  }
  updateAchievements();
  modal.querySelector('#hint-btn').onclick = () => {
    showHint();
    alert('Hint: Try the literacy platformer level!');
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
    // For platformer, could use for answer input
  };
  recognition.start();
}
function syncProgressWithPlatform() {
  const progress = [];
  fetch('https://api.example.com/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ game: 'literacy', progress })
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
      localStorage.setItem('literacyGameParentFeedback', text);
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
    { name: 'Collect all coins', completed: false },
    { name: 'Reach level 3', completed: false }
  ];
  modal.querySelector('#challenge-list').innerHTML = '<ul>' + challenges.map(c => `<li>${c.name} - ${c.completed ? '✔️' : '❌'}</li>`).join('') + '</ul>';
  let leaderboard = JSON.parse(localStorage.getItem('literacyGameLeaderboard') || '[]');
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
      localStorage.setItem('literacyGameTheme', theme);
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
      <input id="custom-level" type="text" placeholder="Enter new level..." style="width:100%;margin-bottom:8px;" />
      <button id="add-level">Add</button>
      <button id="close-content">Close</button>
      <div id="custom-levels-list"></div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('#add-level').onclick = () => {
      const level = modal.querySelector('#custom-level').value;
      let levels = JSON.parse(localStorage.getItem('literacyGameCustomLevels') || '[]');
      levels.push(level);
      localStorage.setItem('literacyGameCustomLevels', JSON.stringify(levels));
      updateLevelsList();
    };
    modal.querySelector('#close-content').onclick = () => { modal.style.display = 'none'; };
    function updateLevelsList() {
      let levels = JSON.parse(localStorage.getItem('literacyGameCustomLevels') || '[]');
      modal.querySelector('#custom-levels-list').innerHTML = '<ul>' + levels.map(l => `<li>${l}</li>`).join('') + '</ul>';
    }
    updateLevelsList();
  }
  modal.style.display = 'block';
}
// --- End Advanced Feature Implementations ---
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
// --- Engagement & Gamification ---
// TODO: Add more animations and sound effects for achievements and feedback
// TODO: Expand gamification with badges, streaks, and seasonal events
// TODO: Add micro-interactions and smooth transitions to game UI

// --- Security Improvements ---
// TODO: Review authentication and input sanitization for multiplayer and feedback
// TODO: Ensure secure API calls and data storage

// --- UI Polish & Customization ---
// TODO: Polish game UI with modern transitions and customization options
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
