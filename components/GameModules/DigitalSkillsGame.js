// Digital Skills Game Module
// Practice basic digital skills with interactive challenges

export function showDigitalSkillsGame(container, userData = {}) {
  container.innerHTML = `
    <section id="digital-skills-game" aria-label="Digital Skills Game">
      <h2>💻 Digital Skills Game</h2>
      <div id="digital-challenge" aria-live="polite"></div>
      <button id="digital-return" class="nav-btn" aria-label="Return to Dashboard">Return to Dashboard</button>
    </section>
  `;
  document.getElementById('digital-return').onclick = function() { window.route('dashboard'); };
  startDigitalSkillsGame(userData);
}

function startDigitalSkillsGame(userData) {
  var area = document.getElementById('digital-challenge');
  var challenges = [
    'Click the button to open the browser.',
    'Type your name in the field below.',
    'Drag the file to the upload area.'
  ];
  var current = 0;
  var progress = loadProgress();
  function renderChallenge() {
    if (current === 0) {
  area.innerHTML = `<p>${challenges[current]}</p><button id='digital-btn' class='nav-btn' aria-label='Open Browser'>Open Browser</button><div id='digital-feedback' aria-live='polite' style='margin-top:8px;'></div>`;
      var btn = document.getElementById('digital-btn');
      btn.focus();
      btn.onkeydown = function(e) { if (e.key === 'Enter') btn.click(); };
      btn.onclick = function() {
  document.getElementById('digital-feedback').innerHTML = `<span style='color:#22c55e;font-weight:600;'>Browser opened!</span>`;
        progress.push({ challenge: challenges[current], completed: true });
        current++;
        setTimeout(renderChallenge, 1200);
      };
    } else if (current === 1) {
  area.innerHTML = `<p>${challenges[current]}</p><input id='digital-input' type='text' placeholder='Your name...' aria-label='Your name' style='margin-bottom:8px;' /><button id='digital-submit' class='nav-btn' aria-label='Submit'>Submit</button><div id='digital-feedback' aria-live='polite' style='margin-top:8px;'></div>`;
      var input = document.getElementById('digital-input');
      var submit = document.getElementById('digital-submit');
      input.focus();
      input.onkeydown = function(e) { if (e.key === 'Enter') submit.click(); };
      submit.onclick = function() {
        if (input.value.trim()) {
          document.getElementById('digital-feedback').innerHTML = `<span style='color:#22c55e;font-weight:600;'>Name entered!</span>`;
          progress.push({ challenge: challenges[current], completed: true, value: input.value.trim() });
          current++;
          setTimeout(renderChallenge, 1200);
        } else {
          document.getElementById('digital-feedback').innerHTML = `<span style='color:#ef4444;font-weight:600;'>Please enter your name.</span>`;
        }
      };
    } else if (current === 2) {
  area.innerHTML = `<p>${challenges[current]}</p><div id='upload-area' style='width:200px;height:60px;border:2px dashed #3b82f6;text-align:center;line-height:60px;' aria-label='Drop file here' tabindex='0'>Drop file here</div><div id='digital-feedback' aria-live='polite' style='margin-top:8px;'></div>`;
      var uploadArea = document.getElementById('upload-area');
      uploadArea.focus();
      uploadArea.ondrop = function() {
  document.getElementById('digital-feedback').innerHTML = `<span style='color:#22c55e;font-weight:600;'>File uploaded!</span>`;
        progress.push({ challenge: challenges[current], completed: true });
        setTimeout(function() {
          area.innerHTML = '<p>Game complete! Well done.</p>';
          if (userData && userData.userId) {
            import('../../firebase.js').then(function(mod) {
              mod.saveLessonPlan('digital-skills-game', userData.userId, JSON.stringify(progress));
            });
          }
        }, 1200);
      };
      uploadArea.onkeydown = function(e) { if (e.key === 'Enter') uploadArea.ondrop(); };
  }
  renderChallenge();
}
// --- Progress Tracking ---
function saveProgress(data) {
  localStorage.setItem('digitalGameProgress', JSON.stringify(data));
}
function loadProgress() {
  return JSON.parse(localStorage.getItem('digitalGameProgress') || '[]');
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
  // TODO: Show hint for current challenge
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
    alert('Hint: Try the digital challenge step!');
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
// --- Advanced Feature Suggestions ---
// 1. Voice recognition for interactive digital skills tasks
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
    const input = document.getElementById('digital-input');
    if (input) input.value = transcript;
  };
  recognition.start();
}
// 2. External platform progress sync
function syncProgressWithPlatform() {
  const progress = loadProgress();
  fetch('https://api.example.com/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ game: 'digital-skills', progress })
  }).then(r => r.json()).then(data => {
    alert('Progress synced!');
  }).catch(() => alert('Sync failed.'));
}
// 3. Parent/guardian feedback and messaging
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
      localStorage.setItem('digitalGameParentFeedback', text);
      alert('Feedback sent!');
    };
    modal.querySelector('#close-feedback').onclick = () => { modal.style.display = 'none'; };
  }
  modal.style.display = 'block';
}
// 4. Daily/weekly challenges and leaderboards
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
    { name: 'Open the browser 3 times', completed: false },
    { name: 'Upload a file', completed: false }
  ];
  modal.querySelector('#challenge-list').innerHTML = '<ul>' + challenges.map(c => `<li>${c.name} - ${c.completed ? '✔️' : '❌'}</li>`).join('') + '</ul>';
  let leaderboard = JSON.parse(localStorage.getItem('digitalGameLeaderboard') || '[]');
  modal.querySelector('#leaderboard-list').innerHTML = '<h4>Leaderboard</h4><ul>' + leaderboard.map(e => `<li>${e.name}: ${e.score}</li>`).join('') + '</ul>';
  modal.style.display = 'block';
}
// 5. AR/VR support for immersive learning
function enableARVRMode() {
  if (!document.getElementById('arvr-scene')) {
    const scene = document.createElement('a-scene');
    scene.id = 'arvr-scene';
    scene.innerHTML = `<a-box position="0 1 -3" color="#4CC3D9"></a-box>`;
    document.body.appendChild(scene);
    alert('AR/VR mode enabled (A-Frame stub).');
  }
}
// 6. Offline mode
function enableOfflineMode() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(() => {
      alert('Offline mode enabled!');
    }).catch(() => alert('Offline mode registration failed.'));
  }
}
// 7. Customizable themes and backgrounds
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
      localStorage.setItem('digitalGameTheme', theme);
      document.body.className = theme;
      alert('Theme applied!');
    };
    modal.querySelector('#close-theme').onclick = () => { modal.style.display = 'none'; };
  }
  modal.style.display = 'block';
}
// 8. Sign language avatars/accessibility overlays
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
// 9. Educator content creation tools
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
      <input id="custom-challenge" type="text" placeholder="Enter new challenge..." style="width:100%;margin-bottom:8px;" />
      <button id="add-challenge">Add</button>
      <button id="close-content">Close</button>
      <div id="custom-challenges-list"></div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('#add-challenge').onclick = () => {
      const challenge = modal.querySelector('#custom-challenge').value;
      let challenges = JSON.parse(localStorage.getItem('digitalGameCustomChallenges') || '[]');
      challenges.push(challenge);
      localStorage.setItem('digitalGameCustomChallenges', JSON.stringify(challenges));
      updateChallengesList();
    };
    modal.querySelector('#close-content').onclick = () => { modal.style.display = 'none'; };
    function updateChallengesList() {
      let challenges = JSON.parse(localStorage.getItem('digitalGameCustomChallenges') || '[]');
      modal.querySelector('#custom-challenges-list').innerHTML = '<ul>' + challenges.map(c => `<li>${c}</li>`).join('') + '</ul>';
    }
    updateChallengesList();
  }
  modal.style.display = 'block';
}
// --- End Advanced Feature Suggestions ---
// Call this in showDigitalSkillsGame
// Example: addControlPanel(container);

}

