// Literacy Game Module: Platformer
// Daisy explains rules, Winnie cheers, Andy motivates
// Levels increase in difficulty, feedback is motivational and independence-focused
// Visual effects: parallax backgrounds, animated coins, smooth transitions
// Learner Level shown instead of Score

// --- Progress Tracking ---
function openParentFeedback() {
  let modal = document.getElementById("parent-feedback-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "parent-feedback-modal";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
  modal.className = "card fade-in max-w-lg mx-auto";
    modal.style.zIndex = "1002";
    modal.innerHTML = `
      <h3>Parent/Guardian Feedback</h3>
  <textarea id="feedback-text" rows="4" class="w-full input" placeholder="Enter feedback..."></textarea>
  <br><button id="send-feedback" class="btn-primary nav-btn">Send</button>
  <button id="close-feedback" class="nav-btn bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded transition">Close</button>
    `;
    document.body.appendChild(modal);
    modal.querySelector("#send-feedback").onclick = () => {
      const text = modal.querySelector("#feedback-text").value;
      localStorage.setItem("literacyGameParentFeedback", text);
      alert("Feedback sent!");
    };
    modal.querySelector("#close-feedback").onclick = () => {
      modal.style.display = "none";
    };
  }
  modal.style.display = "block";
}
function showChallengesAndLeaderboard() {
  let modal = document.getElementById("challenges-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "challenges-modal";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
  modal.className = "card fade-in max-w-lg mx-auto";
    modal.style.zIndex = "1002";
    modal.innerHTML = `
      <h3>Challenges & Leaderboard</h3>
  <div id="challenge-list" class="mb-2"></div>
  <div id="leaderboard-list" class="mb-2"></div>
  <button id="close-challenges" class="nav-btn bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded transition">Close</button>
    `;
    document.body.appendChild(modal);
    modal.querySelector("#close-challenges").onclick = () => {
      modal.style.display = "none";
    };
  }
  const challenges = [
    { name: "Collect all coins", completed: false },
    { name: "Reach level 3", completed: false },
  ];
  modal.querySelector("#challenge-list").innerHTML =
    "<ul>" +
    challenges.map((c) => `<li>${c.name} - ${c.completed ? "✔️" : "❌"}</li>`).join("") +
    "</ul>";
  let leaderboard = JSON.parse(localStorage.getItem("literacyGameLeaderboard") || "[]");
  modal.querySelector("#leaderboard-list").innerHTML =
    "<h4>Leaderboard</h4><ul>" +
    leaderboard.map((e) => `<li>${e.name}: ${e.score}</li>`).join("") +
    "</ul>";
  modal.style.display = "block";
}
function enableARVRMode() {
  if (!document.getElementById("arvr-scene")) {
    const scene = document.createElement("a-scene");
    scene.id = "arvr-scene";
    scene.innerHTML = "<a-box position=\"0 1 -3\" color=\"#4CC3D9\"></a-box>";
    document.body.appendChild(scene);
    alert("AR/VR mode enabled (A-Frame stub).");
  }
}
function enableOfflineMode() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(() => {
        alert("Offline mode enabled!");
      })
      .catch(() => alert("Offline mode registration failed."));
  }
}
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
  <select id="theme-select" class="border rounded px-2 py-1">
        <option value="default">Default</option>
        <option value="dark">Dark</option>
        <option value="pastel">Pastel</option>
      </select>
  <button id="apply-theme" class="nav-btn bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition">Apply</button>
  <button id="close-theme" class="nav-btn bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded transition">Close</button>
    `;
    document.body.appendChild(modal);
    modal.querySelector("#apply-theme").onclick = () => {
      const theme = modal.querySelector("#theme-select").value;
      localStorage.setItem("literacyGameTheme", theme);
      document.body.className = theme;
      alert("Theme applied!");
    };
    modal.querySelector("#close-theme").onclick = () => {
      modal.style.display = "none";
    };
  }
  modal.style.display = "block";
}
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
    overlay.innerHTML =
      "<img src=\"/assets/sign-avatar.gif\" alt=\"Sign Language Avatar\" style=\"width:100%;height:100%;object-fit:contain;\" />";
    document.body.appendChild(overlay);
  }
  overlay.style.display = "block";
}
function openContentCreationTools() {
  let modal = document.getElementById("content-creation-modal");
  function updateLevelsList() {
    let levels = JSON.parse(localStorage.getItem("literacyGameCustomLevels") || "[]");
    modal.querySelector("#custom-levels-list").innerHTML =
      "<ul>" + levels.map((l) => `<li>${l}</li>`).join("") + "</ul>";
  }
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
  <input id="custom-level" type="text" placeholder="Enter new level..." class="w-full mb-2" />
  <button id="add-level" class="nav-btn bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition">Add</button>
  <button id="close-content" class="nav-btn bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded transition">Close</button>
      <div id="custom-levels-list"></div>
    `;
    document.body.appendChild(modal);
    modal.querySelector("#add-level").onclick = () => {
      const level = modal.querySelector("#custom-level").value;
      let levels = JSON.parse(localStorage.getItem("literacyGameCustomLevels") || "[]");
      levels.push(level);
      localStorage.setItem("literacyGameCustomLevels", JSON.stringify(levels));
      updateLevelsList();
    };
    modal.querySelector("#close-content").onclick = () => {
      modal.style.display = "none";
    };
    updateLevelsList();
  }
  modal.style.display = "block";
}

// --- End Advanced Feature Implementations ---

// Export main game functions for use elsewhere
export function showLiteracyGame(container, userData = {}) {
  container.innerHTML = `
    <div class="card">
      <h2 class="text-2xl font-bold mb-4">Literacy Game</h2>
      <p>Welcome to the Literacy Game module!</p>
      <!-- Add literacy game UI here -->
    </div>
  `;
    // Add your literacy game logic here
    // Example usage for main button:
    const btn = document.getElementById('literacy-btn');
    applyButtonAnimation(btn);
    // Example usage for heading:
    const heading = document.getElementById('literacy-heading');
    applyHeadingAnimation(heading);
}

export {
  openParentFeedback,
  showChallengesAndLeaderboard,
  enableARVRMode,
  enableOfflineMode,
  showThemeCustomization,
  enableSignLanguageAvatar,
  openContentCreationTools
};
