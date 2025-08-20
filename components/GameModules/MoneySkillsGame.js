// Money Skills Game Module
// Practice money handling and budgeting with Australian currency visuals

export function showMoneySkillsGame(container, userData = {}) {
  container.innerHTML = `
    <section id="money-skills-game" aria-label="Money Skills Game">
      <h2>💰 Money Skills Game</h2>
      <div id="money-challenge"></div>
  <img src="assets/images/aud_notes.png" alt="Australian Currency" loading="lazy" />
      <button id="money-return" class="nav-btn" aria-label="Return to Dashboard">Return to Dashboard</button>
    </section>
  `;
  document.getElementById('money-return').onclick = function() { window.route('dashboard'); };
  startMoneySkillsGame(userData);
}

function startMoneySkillsGame() {
  const area = document.getElementById('money-challenge');
  let questions = [
    { q: 'How much is a $5 note plus a $2 coin?', a: '7' },
    { q: 'If Daisy buys apples for $3 and bread for $2, how much does she spend?', a: '5' },
    { q: 'Andy has $10 and spends $4. How much is left?', a: '6' }
  ];
  let current = 0;
  let progress = loadProgress();
  let completed = false;
  function renderQuestion() {
    area.innerHTML = `<p aria-live='polite'>${questions[current].q}</p>
      <input id='money-input' type='number' aria-label='Answer' style='margin-bottom:8px;' />
      <button id='money-submit' class='nav-btn' aria-label='Submit'>Submit</button>
      <div id='money-feedback' aria-live='polite' style='margin-top:8px;'></div>`;
    document.getElementById('money-submit').onclick = function() {
      const val = document.getElementById('money-input').value.trim();
      const feedback = document.getElementById('money-feedback');
      if (val === questions[current].a) {
        feedback.innerHTML = `<span style='color:#22c55e;font-weight:600;'>Correct!</span>`;
        progress.push({ question: questions[current].q, answer: val, correct: true });
        saveProgress(progress);
        showAchievement('Correct!');
        if (current < questions.length - 1) {
          current++;
          setTimeout(renderQuestion, 1200);
        } else if (!completed) {
          completed = true;
          setTimeout(() => {
            feedback.innerHTML = `<span style='color:#3b82f6;font-weight:600;'>Game complete! Well done.</span>`;
            progress.push({ action: 'complete' });
            if (userData && userData.userId) {
              import('../../firebase.js').then(mod => {
                mod.saveLessonPlan('money-skills-game', userData.userId, JSON.stringify(progress));
              });
            }
          }, 1200);
        }
      } else {
        feedback.innerHTML = `<span style='color:#ef4444;font-weight:600;'>Try again!</span>`;
        progress.push({ question: questions[current].q, answer: val, correct: false });
        saveProgress(progress);
      }
    };
  }
  renderQuestion();
}

// --- Progress Tracking ---
function saveProgress(data) {
  localStorage.setItem('moneyGameProgress', JSON.stringify(data));
}
function loadProgress() {
  return JSON.parse(localStorage.getItem('moneyGameProgress') || '[]');
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
  // TODO: Show hint for current question
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
    alert('Hint: Try the money skills question!');
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
// 1. Voice recognition for interactive money skills tasks
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
    const input = document.getElementById('money-input');
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
    body: JSON.stringify({ game: 'money-skills', progress })
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
      localStorage.setItem('moneyGameParentFeedback', text);
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
    { name: 'Answer all questions correctly', completed: false },
    { name: 'Complete the game', completed: false }
  ];
  modal.querySelector('#challenge-list').innerHTML = '<ul>' + challenges.map(c => `<li>${c.name} - ${c.completed ? '✔️' : '❌'}</li>`).join('') + '</ul>';
  let leaderboard = JSON.parse(localStorage.getItem('moneyGameLeaderboard') || '[]');
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
      localStorage.setItem('moneyGameTheme', theme);
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
      <input id="custom-question" type="text" placeholder="Enter new question..." style="width:100%;margin-bottom:8px;" />
      <button id="add-question">Add</button>
      <button id="close-content">Close</button>
      <div id="custom-questions-list"></div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('#add-question').onclick = () => {
      const question = modal.querySelector('#custom-question').value;
      let questions = JSON.parse(localStorage.getItem('moneyGameCustomQuestions') || '[]');
      questions.push(question);
      localStorage.setItem('moneyGameCustomQuestions', JSON.stringify(questions));
      updateQuestionsList();
    };
    modal.querySelector('#close-content').onclick = () => { modal.style.display = 'none'; };
    function updateQuestionsList() {
      let questions = JSON.parse(localStorage.getItem('moneyGameCustomQuestions') || '[]');
      modal.querySelector('#custom-questions-list').innerHTML = '<ul>' + questions.map(q => `<li>${q}</li>`).join('') + '</ul>';
    }
    updateQuestionsList();
  }
  modal.style.display = 'block';
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
  document.body.setAttribute('aria-label', 'Money Skills Game');
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

// --- Accessibility Improvements ---
// TODO: Implement keyboard navigation for all game controls and modals
// TODO: Add text-to-speech for prompts and feedback
// TODO: Ensure ARIA labels and focus management in all popups

// --- Error Handling Improvements ---
// TODO: Add error boundary for game logic and UI
// TODO: Improve feedback for invalid input and game errors

// --- Input Validation & Testing ---
function validateInput(input) {
  return typeof input === 'string' && input.trim().length > 0;
}
// --- End Advanced Feature Suggestions ---

// --- Engagement & Gamification ---
// TODO: Add more animations and sound effects for achievements and feedback
// TODO: Expand gamification with badges, streaks, and seasonal events
// TODO: Add micro-interactions and smooth transitions to game UI

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

// --- Security Improvements ---
// TODO: Review authentication and input sanitization for multiplayer and feedback
// TODO: Ensure secure API calls and data storage

// --- UI Polish & Customization ---
// TODO: Polish game UI with modern transitions and customization options

// --- Analytics & Educator Tools ---
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
