// Communication Game Module
// Practice communication skills with animated feedback
// Visual and tactile learning options

export function showCommunicationGame(container, userData = {}) {
  container.innerHTML = `
    <section id="communication-game" aria-label="Communication Game">
      <h2>💬 Communication Game</h2>
      <div id="conversation-area" aria-live="polite"></div>
      <button id="comm-return" aria-label="Return to Dashboard">Return to Dashboard</button>
    </section>
  `;
  document.getElementById('comm-return').onclick = function() { window.route('dashboard'); };
  startCommunicationGame(userData);
}

function startCommunicationGame(userData) {
  var area = document.getElementById('conversation-area');
  var prompts = [
    'Greet Daisy politely.',
    'Ask Winnie for help.',
    'Thank Andy for his support.'
  ];
  var answers = ['hello', 'help', 'thank'];
  var feedbacks = [
    'Daisy: "Lovely greeting!"',
    'Winnie: "I am happy to help!"',
    'Andy: "You are very welcome!"'
  ];
  var current = 0;
  var progress = loadProgress();
  if (progress.length > 0) {
    current = progress.length;
    progress.forEach(function(item, index) {
      area.innerHTML += `<p>${item.prompt} <strong>${item.response}</strong> - ${item.correct ? '✔️' : '❌'}</p>`;
    });
  }
  function renderPrompt() {
      area.innerHTML += `<p>${prompts[current]}</p>
        <input id='comm-input' type='text' placeholder='Type your response...' aria-label='Type your response' style='margin-bottom:8px;' />
        <button id='comm-submit' class='nav-btn' aria-label='Send'>Send</button>
        <div id='comm-feedback' aria-live='polite' style='margin-top:8px;'></div>`;
    var input = document.getElementById('comm-input');
    var submit = document.getElementById('comm-submit');
    input.focus();
    input.onkeydown = function(e) { if (e.key === 'Enter') submit.click(); };
    submit.onclick = function() {
      var val = input.value.trim().toLowerCase();
      var feedback = '';
      if (val.includes(answers[current])) {
        feedback = feedbacks[current];
        progress.push({ prompt: prompts[current], response: val, correct: true });
        saveProgress(progress);
      } else {
        feedback = 'Try again!';
        progress.push({ prompt: prompts[current], response: val, correct: false });
        saveProgress(progress);
      }
        document.getElementById('comm-feedback').innerHTML = `<span style='color:#ef4444;font-weight:600;'>${feedback}</span>`;
      if (feedback !== 'Try again!' && current < prompts.length - 1) {
        current++;
        setTimeout(renderPrompt, 1200);
      } else if (feedback !== 'Try again!' && current === prompts.length - 1) {
        setTimeout(function() {
          area.innerHTML += '<p>Game complete! Well done.</p>';
          if (userData && userData.userId) {
            import('../../firebase.js').then(function(mod) {
              mod.saveLessonPlan('communication-game', userData.userId, JSON.stringify(progress));
            });
          }
        }, 1200);
      }
    };
  }
  renderPrompt();
}

// --- Progress Tracking ---
function saveProgress(data) {
  localStorage.setItem('commGameProgress', JSON.stringify(data));
}
function loadProgress() {
  return JSON.parse(localStorage.getItem('commGameProgress') || '[]');
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
  // TODO: Show achievement UI
}
// --- Audio Narration & Sound Effects ---
function playAudio(src) {
  const audio = new Audio(src);
  audio.play();
}
// --- Hints & Help System ---
function showHint() {
  // TODO: Show hint for current prompt
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
  // TODO: Update UI language
}
// --- Story Mode ---
let storyProgress = 0;
function advanceStory() {
  storyProgress++;
  // TODO: Show next story segment
}
// --- End Feature Scaffolding ---
// --- UI Control Panel Integration ---
function addControlPanel(container) {
  // Floating button
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

  // Modal panel
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

  // Button logic
  settingsBtn.onclick = () => { modal.style.display = 'block'; };
  modal.querySelector('#close-settings').onclick = () => { modal.style.display = 'none'; };

  // Accessibility logic
  modal.querySelector('#high-contrast-toggle').onchange = e => setAccessibility('highContrast', e.target.checked);
  modal.querySelector('#font-size-select').onchange = e => setAccessibility('fontSize', e.target.value);
  modal.querySelector('#language-select').onchange = e => setLanguage(e.target.value);

  // Achievements logic
  function updateAchievements() {
    const list = modal.querySelector('#achievements-list');
    list.innerHTML = achievements.length ? achievements.map(a => `<li>${a}</li>`).join('') : '<li>No achievements yet.</li>';
  }
  updateAchievements();

  // Hint logic
  modal.querySelector('#hint-btn').onclick = () => {
    showHint();
    alert('Hint: Try greeting Daisy politely!');
  };

  // Progress logic
  function updateProgress() {
    const summary = modal.querySelector('#progress-summary');
    const progress = loadProgress();
    summary.textContent = progress.length ? `Completed: ${progress.length} steps.` : 'No progress yet.';
  }
  updateProgress();

  // Advanced features logic
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
// 1. Voice recognition for interactive communication tasks
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
    const input = document.getElementById('comm-input');
    if (input) input.value = transcript;
  };
  recognition.start();
}

// 2. External platform progress sync (stub)
function syncProgressWithPlatform() {
  const progress = loadProgress();
  fetch('https://api.example.com/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ game: 'communication', progress })
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
      localStorage.setItem('commGameParentFeedback', text);
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
  // Example challenge
  const challenges = [
    { name: 'Greet Daisy 3 times', completed: false },
    { name: 'Thank Andy', completed: false }
  ];
  modal.querySelector('#challenge-list').innerHTML = '<ul>' + challenges.map(c => `<li>${c.name} - ${c.completed ? '✔️' : '❌'}</li>`).join('') + '</ul>';
  // Leaderboard from localStorage
  let leaderboard = JSON.parse(localStorage.getItem('commGameLeaderboard') || '[]');
  modal.querySelector('#leaderboard-list').innerHTML = '<h4>Leaderboard</h4><ul>' + leaderboard.map(e => `<li>${e.name}: ${e.score}</li>`).join('') + '</ul>';
  modal.style.display = 'block';
}

// 5. AR/VR support for immersive learning (A-Frame stub)
function enableARVRMode() {
  if (!document.getElementById('arvr-scene')) {
    const scene = document.createElement('a-scene');
    scene.id = 'arvr-scene';
    scene.innerHTML = `<a-box position="0 1 -3" color="#4CC3D9"></a-box>`;
    document.body.appendChild(scene);
    alert('AR/VR mode enabled (A-Frame stub).');
  }
}

// 6. Offline mode (service worker registration)
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
      localStorage.setItem('commGameTheme', theme);
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
      <input id="custom-prompt" type="text" placeholder="Enter new prompt..." style="width:100%;margin-bottom:8px;" />
      <button id="add-prompt">Add</button>
      <button id="close-content">Close</button>
      <div id="custom-prompts-list"></div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('#add-prompt').onclick = () => {
      const prompt = modal.querySelector('#custom-prompt').value;
      let prompts = JSON.parse(localStorage.getItem('commGameCustomPrompts') || '[]');
      prompts.push(prompt);
      localStorage.setItem('commGameCustomPrompts', JSON.stringify(prompts));
      updatePromptsList();
    };
    modal.querySelector('#close-content').onclick = () => { modal.style.display = 'none'; };
    function updatePromptsList() {
      let prompts = JSON.parse(localStorage.getItem('commGameCustomPrompts') || '[]');
      modal.querySelector('#custom-prompts-list').innerHTML = '<ul>' + prompts.map(p => `<li>${p}</li>`).join('') + '</ul>';
    }
    updatePromptsList();
  }
  modal.style.display = 'block';
}
// --- End Advanced Feature Implementations ---
