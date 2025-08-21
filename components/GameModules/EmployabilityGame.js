// Employability Game Module
// Practice job skills and interview scenarios

export function showEmployabilityGame(container, userData = {}) {
  container.innerHTML = `
    <section id="employability-game" aria-label="Employability Game">
      <h2>💼 Employability Game</h2>
      <div id="employability-challenge" aria-live="polite"></div>
  <button id="employ-return" class="nav-btn" aria-label="Return to Dashboard">Return to Dashboard</button>
    </section>
  `;
  document.getElementById("employ-return").onclick = function() { window.route("dashboard"); };
  startEmployabilityGame(userData);
}

function startEmployabilityGame(userData) {
  var area = document.getElementById("employability-challenge");
  var scenarios = [
    "Prepare Daisy for a job interview.",
    "Help Winnie write her resume.",
    "Coach Andy on workplace communication."
  ];
  var current = 0;
  var progress = loadProgress();
  if (progress.length > 0) {
    current = progress.findIndex(p => !p.completed);
    if (current === -1) current = scenarios.length; // All completed
  }
  function renderScenario() {
    if (current < scenarios.length) {
      area.innerHTML = `<p>${scenarios[current]}</p>
        <button id='employ-btn' class='nav-btn' aria-label='Complete Task'>Complete Task</button>
        <div id='employ-feedback' aria-live='polite' style='margin-top:8px;'></div>`;
      var btn = document.getElementById("employ-btn");
      btn.focus();
      btn.onkeydown = function(e) { if (e.key === "Enter") btn.click(); };
      btn.onclick = function() {
        document.getElementById("employ-feedback").innerHTML = "<span style='color:#22c55e;font-weight:600;'>Task completed!</span>";
        progress[current] = { scenario: scenarios[current], completed: true };
        saveProgress(progress);
        if (current < scenarios.length - 1) {
          current++;
          setTimeout(renderScenario, 1200);
        } else {
          setTimeout(function() {
            area.innerHTML = "<p>Game complete! Well done.</p>";
            if (userData && userData.userId) {
              import("../../firebase.js").then(function(mod) {
                mod.saveLessonPlan("employability-game", userData.userId, JSON.stringify(progress));
              });
            }
          }, 1200);
        }
      };
    } else {
      area.innerHTML = "<p>Game complete! Well done.</p>";
    }
  }
  renderScenario();
}

// --- Progress Tracking ---
function saveProgress(data) {
  localStorage.setItem("employGameProgress", JSON.stringify(data));
}
function loadProgress() {
  return JSON.parse(localStorage.getItem("employGameProgress") || "[]");
}
// --- Accessibility Options ---
let accessibilityOptions = { highContrast: false, textToSpeech: false, fontSize: "medium", keyboardOnly: false };
function setAccessibility(option, value) {
  accessibilityOptions[option] = value;
  if (option === "highContrast") {
    document.body.classList.toggle("high-contrast", value);
  }
  if (option === "fontSize") {
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
  // TODO: Show hint for current scenario
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
let language = "en";
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
  const settingsBtn = document.createElement("button");
  settingsBtn.id = "settings-btn";
  settingsBtn.textContent = "⚙️";
  settingsBtn.style.position = "fixed";
  settingsBtn.style.top = "24px";
  settingsBtn.style.right = "24px";
  settingsBtn.style.zIndex = "1000";
  settingsBtn.style.fontSize = "1.5em";
  settingsBtn.style.background = "#fff";
  settingsBtn.style.border = "1px solid #ccc";
  settingsBtn.style.borderRadius = "50%";
  settingsBtn.style.width = "48px";
  settingsBtn.style.height = "48px";
  settingsBtn.style.cursor = "pointer";
  document.body.appendChild(settingsBtn);

  const modal = document.createElement("div");
  modal.id = "settings-modal";
  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.background = "#fff";
  modal.style.border = "2px solid #1976d2";
  modal.style.borderRadius = "12px";
  modal.style.padding = "24px";
  modal.style.zIndex = "1001";
  modal.style.display = "none";
  modal.style.minWidth = "320px";
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

  settingsBtn.onclick = () => { modal.style.display = "block"; };
  modal.querySelector("#close-settings").onclick = () => { modal.style.display = "none"; };
  modal.querySelector("#high-contrast-toggle").onchange = e => setAccessibility("highContrast", e.target.checked);
  modal.querySelector("#font-size-select").onchange = e => setAccessibility("fontSize", e.target.value);
  modal.querySelector("#language-select").onchange = e => setLanguage(e.target.value);
  function updateAchievements() {
    const list = modal.querySelector("#achievements-list");
    list.innerHTML = achievements.length ? achievements.map(a => `<li>${a}</li>`).join("") : "<li>No achievements yet.</li>";
  }
  updateAchievements();
  modal.querySelector("#hint-btn").onclick = () => {
    showHint();
    alert("Hint: Complete the employability scenario!");
  };
  function updateProgress() {
    const summary = modal.querySelector("#progress-summary");
    const progress = loadProgress();
    summary.textContent = progress.length ? `Completed: ${progress.length} steps.` : "No progress yet.";
  }
  updateProgress();
  modal.querySelector("#voice-btn").onclick = enableVoiceRecognition;
  modal.querySelector("#sync-btn").onclick = syncProgressWithPlatform;
  modal.querySelector("#parent-feedback-btn").onclick = openParentFeedback;
  modal.querySelector("#challenges-btn").onclick = showChallengesAndLeaderboard;
  modal.querySelector("#arvr-btn").onclick = enableARVRMode;
  modal.querySelector("#offline-btn").onclick = enableOfflineMode;
  modal.querySelector("#theme-btn").onclick = showThemeCustomization;
  modal.querySelector("#sign-avatar-btn").onclick = enableSignLanguageAvatar;
  modal.querySelector("#content-create-btn").onclick = openContentCreationTools;
}

// --- Advanced Feature Suggestions ---
// 1. Voice recognition for interactive employability tasks
function enableVoiceRecognition() {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Speech recognition not supported in this browser.");
    return;
  }
  const recognition = new webkitSpeechRecognition();
  recognition.lang = language;
  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    alert("You said: " + transcript);
    const input = document.getElementById("employ-input");
    if (input) input.value = transcript;
  };
  recognition.start();
}
// 2. External platform progress sync
function syncProgressWithPlatform() {
  const progress = loadProgress();
  fetch("https://api.example.com/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ game: "employability", progress })
  }).then(r => r.json()).then(data => {
    alert("Progress synced!");
  }).catch(() => alert("Sync failed."));
}
// 3. Parent/guardian feedback and messaging
function openParentFeedback() {
  let modal = document.getElementById("parent-feedback-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "parent-feedback-modal";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.background = "#fff";
    modal.style.border = "2px solid #1976d2";
    modal.style.borderRadius = "12px";
    modal.style.padding = "24px";
    modal.style.zIndex = "1002";
    modal.innerHTML = `
      <h3>Parent/Guardian Feedback</h3>
      <textarea id="feedback-text" rows="4" style="width:100%" placeholder="Enter feedback..."></textarea>
      <br><button id="send-feedback">Send</button>
      <button id="close-feedback">Close</button>
    `;
    document.body.appendChild(modal);
    modal.querySelector("#send-feedback").onclick = () => {
      const text = modal.querySelector("#feedback-text").value;
      localStorage.setItem("employGameParentFeedback", text);
      alert("Feedback sent!");
    };
    modal.querySelector("#close-feedback").onclick = () => { modal.style.display = "none"; };
  }
  modal.style.display = "block";
}
// 4. Daily/weekly challenges and leaderboards
function showChallengesAndLeaderboard() {
  let modal = document.getElementById("challenges-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "challenges-modal";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.background = "#fff";
    modal.style.border = "2px solid #1976d2";
    modal.style.borderRadius = "12px";
    modal.style.padding = "24px";
    modal.style.zIndex = "1002";
    modal.innerHTML = `
      <h3>Challenges & Leaderboard</h3>
      <div id="challenge-list"></div>
      <div id="leaderboard-list"></div>
      <button id="close-challenges">Close</button>
    `;
    document.body.appendChild(modal);
    modal.querySelector("#close-challenges").onclick = () => { modal.style.display = "none"; };
  }
  const challenges = [
    { name: "Complete all scenarios", completed: false },
    { name: "Write a resume", completed: false }
  ];
  modal.querySelector("#challenge-list").innerHTML = "<ul>" + challenges.map(c => `<li>${c.name} - ${c.completed ? "✔️" : "❌"}</li>`).join("") + "</ul>";
  let leaderboard = JSON.parse(localStorage.getItem("employGameLeaderboard") || "[]");
  modal.querySelector("#leaderboard-list").innerHTML = "<h4>Leaderboard</h4><ul>" + leaderboard.map(e => `<li>${e.name}: ${e.score}</li>`).join("") + "</ul>";
  modal.style.display = "block";
}
// 5. AR/VR support for immersive learning
function enableARVRMode() {
  if (!document.getElementById("arvr-scene")) {
    const scene = document.createElement("a-scene");
    scene.id = "arvr-scene";
    scene.innerHTML = "<a-box position=\"0 1 -3\" color=\"#4CC3D9\"></a-box>";
    document.body.appendChild(scene);
    alert("AR/VR mode enabled (A-Frame stub).");
  }
}
// 6. Offline mode
function enableOfflineMode() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js").then(() => {
      alert("Offline mode enabled!");
    }).catch(() => alert("Offline mode registration failed."));
  }
}
// 7. Customizable themes and backgrounds
function showThemeCustomization() {
  let modal = document.getElementById("theme-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "theme-modal";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.background = "#fff";
    modal.style.border = "2px solid #1976d2";
    modal.style.borderRadius = "12px";
    modal.style.padding = "24px";
    modal.style.zIndex = "1002";
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
    modal.querySelector("#apply-theme").onclick = () => {
      const theme = modal.querySelector("#theme-select").value;
      localStorage.setItem("employGameTheme", theme);
      document.body.className = theme;
      alert("Theme applied!");
    };
    modal.querySelector("#close-theme").onclick = () => { modal.style.display = "none"; };
  }
  modal.style.display = "block";
}
// 8. Sign language avatars/accessibility overlays
function enableSignLanguageAvatar() {
  let overlay = document.getElementById("sign-avatar-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "sign-avatar-overlay";
    overlay.style.position = "fixed";
    overlay.style.bottom = "24px";
    overlay.style.right = "24px";
    overlay.style.width = "120px";
    overlay.style.height = "120px";
    overlay.style.background = "#fff";
    overlay.style.border = "2px solid #1976d2";
    overlay.style.borderRadius = "12px";
    overlay.style.zIndex = "1002";
    overlay.innerHTML = "<img src=\"/assets/sign-avatar.gif\" alt=\"Sign Language Avatar\" style=\"width:100%;height:100%;object-fit:contain;\" />";
    document.body.appendChild(overlay);
  }
  overlay.style.display = "block";
}
// 9. Educator content creation tools
function openContentCreationTools() {
  let modal = document.getElementById("content-creation-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "content-creation-modal";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.background = "#fff";
    modal.style.border = "2px solid #1976d2";
    modal.style.borderRadius = "12px";
    modal.style.padding = "24px";
    modal.style.zIndex = "1002";
    modal.innerHTML = `
      <h3>Custom Content Creation</h3>
      <input id="custom-scenario" type="text" placeholder="Enter new scenario..." style="width:100%;margin-bottom:8px;" />
      <button id="add-scenario">Add</button>
      <button id="close-content">Close</button>
      <div id="custom-scenarios-list"></div>
    `;
    document.body.appendChild(modal);
    modal.querySelector("#add-scenario").onclick = () => {
      const scenario = modal.querySelector("#custom-scenario").value;
      let scenarios = JSON.parse(localStorage.getItem("employGameCustomScenarios") || "[]");
      scenarios.push(scenario);
      localStorage.setItem("employGameCustomScenarios", JSON.stringify(scenarios));
      updateScenariosList();
    };
    modal.querySelector("#close-content").onclick = () => { modal.style.display = "none"; };
    function updateScenariosList() {
      let scenarios = JSON.parse(localStorage.getItem("employGameCustomScenarios") || "[]");
      modal.querySelector("#custom-scenarios-list").innerHTML = "<ul>" + scenarios.map(s => `<li>${s}</li>`).join("") + "</ul>";
    }
    updateScenariosList();
  }
  modal.style.display = "block";
}

// --- Accessibility & Error Handling Implementation ---
function enableKeyboardNavigation() {
  document.addEventListener("keydown", function(e) {
    if (e.key === "Tab") {
      const focusable = Array.from(document.querySelectorAll("button, [tabindex], input, select"));
      const index = focusable.indexOf(document.activeElement);
      const next = focusable[(index + 1) % focusable.length];
      if (next) next.focus();
      e.preventDefault();
    }
  });
}
function addAriaLabels() {
  document.body.setAttribute("aria-label", "Employability Game");
}
function errorBoundary(fn) {
  try {
    fn();
  } catch (err) {
    alert("An error occurred: " + err.message);
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
  return typeof input === "string" && input.trim().length > 0;
}
function showAchievement(msg) {
  const div = document.createElement("div");
  div.textContent = msg;
  div.style.position = "fixed";
  div.style.top = "20px";
  div.style.right = "20px";
  div.style.background = "#22c55e";
  div.style.color = "#fff";
  div.style.padding = "12px 24px";
  div.style.borderRadius = "8px";
  div.style.zIndex = "1002";
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 2000);
}
// TODO: Validate all user input (e.g., text fields, answers)
// TODO: Add unit tests for game logic and UI components
// --- End Advanced Feature Suggestions ---

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
function trackEvent(event, data) {
  // Integrate with analytics service or log locally
  console.log("Analytics Event:", event, data);
}
function showAnalyticsDashboard() {
  // Simple dashboard stub
  alert("Analytics dashboard coming soon!");
}
// --- Educator Tools ---
function showEducatorDashboard() {
  // Simple educator dashboard stub
  alert("Educator dashboard coming soon!");
}
function openContentCreationTools() {
  // TODO: Implement content creation tools
}
// --- Community Features ---
function showCommunityFeatures() {
  // Simple community stub
  alert("Community features (forums, chat, collaboration) coming soon!");
}
// --- Internationalization ---
function setLanguage(lang) {
  document.documentElement.lang = lang;
  // TODO: Add RTL support and translations
}
function showLanguageSelector() {
  const modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.background = "#fff";
  modal.style.border = "2px solid #1976d2";
  modal.style.borderRadius = "12px";
  modal.style.padding = "24px";
  modal.style.zIndex = "1002";
  modal.innerHTML = "<h3>Select Language</h3><select id='lang-select'><option value='en'>English</option><option value='es'>Spanish</option><option value='ar'>Arabic (RTL)</option></select><button id='apply-lang'>Apply</button><button id='close-lang'>Close</button>";
  document.body.appendChild(modal);
  modal.querySelector("#apply-lang").onclick = () => {
    setLanguage(modal.querySelector("#lang-select").value);
    modal.remove();
  };
  modal.querySelector("#close-lang").onclick = () => modal.remove();
}
// --- Onboarding & Help ---
function startOnboarding() {
  alert("Welcome! Guided tour and help tooltips coming soon.");
}
// --- Backup & Sync ---
function backupData() {
  alert("Cloud backup and restore coming soon!");
}
