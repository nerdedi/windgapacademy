// CalmSpace Module — consolidated & cleaned

// Social story data
const stories = {
  "life-skills": {
    title: "Life Skills & Independence",
    story:
      "Animated scenario: Navigating public transport, budgeting for groceries, and managing daily routines as a young adult. Includes realistic dialogue and decision points.",
  },
  communication: {
    title: "Communication & Relationships",
    story:
      "Animated scenario: Handling conflict with a housemate, advocating for yourself at work, and building healthy relationships. Includes role-play and practical tips.",
  },
  digital: {
    title: "Digital Safety & Online Behaviour",
    story:
      "Animated scenario: Responding to online bullying, protecting privacy, and making safe choices online. Based on eSafety.gov.au guidelines.",
  },
  employability: {
    title: "Employability & Workplace Skills",
    story:
      "Animated scenario: Applying for a job, preparing for interviews, and managing workplace challenges. Includes realistic feedback and self-advocacy.",
  },
  "money-skills": {
    title: "Money Skills & Financial Independence",
    story:
      "Animated scenario: Managing a bank account, paying bills, and saving for goals. Includes practical strategies and common pitfalls.",
  },
  wellbeing: {
    title: "Wellbeing & Mental Health",
    story:
      "Animated scenario: Coping with stress, seeking help, and building resilience. Includes mindfulness and self-care techniques.",
  },
};

// Helper: Guided Meditation Modal
function showMeditationModal() {
  const existing = document.getElementById("meditation-modal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "meditation-modal";
  modal.className = "fixed inset-0 bg-black/50 z-50 flex items-center justify-center";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "meditation-title");
  modal.innerHTML = `
    <div class="bg-white p-8 rounded-xl max-w-md text-center shadow-2xl">
      <h3 id="meditation-title" class="text-2xl font-bold mb-4">Guided Meditation</h3>
      <ol class="text-left space-y-2 mb-6">
        <li>1. Find a comfortable position and close your eyes.</li>
        <li>2. Take a deep breath in... and out.</li>
        <li>3. Focus on the sensation of your breath.</li>
        <li>4. Let thoughts pass by like clouds.</li>
        <li>5. Continue for 1-2 minutes.</li>
      </ol>
      <button id="close-meditation" class="btn-primary">Close</button>
    </div>`;
  document.body.appendChild(modal);

  const closeBtn = document.getElementById("close-meditation");
  closeBtn.focus();
  closeBtn.onclick = () => modal.remove();
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };
}

// Helper: Journal Feature
function showJournal() {
  // Inject handwriting font
  if (!document.getElementById("handwriting-font")) {
    const fontLink = document.createElement("link");
    fontLink.id = "handwriting-font";
    fontLink.rel = "stylesheet";
    fontLink.href = "https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap";
    document.head.appendChild(fontLink);
  }

  const existing = document.getElementById("calm-journal-modal");
  if (existing) existing.remove();

  const journal = document.createElement("div");
  journal.id = "calm-journal-modal";
  journal.className = "fixed inset-0 bg-black/50 z-50 flex items-center justify-center";
  journal.setAttribute("role", "dialog");
  journal.setAttribute("aria-modal", "true");
  journal.setAttribute("aria-labelledby", "journal-title");
  journal.innerHTML = `
    <div class="bg-white p-6 rounded-xl max-w-md w-full mx-4 shadow-2xl relative">
      <h3 id="journal-title" class="text-2xl font-bold mb-4" style="font-family: 'Indie Flower', cursive;">My Journal</h3>
      <button id="toggle-prompts" class="absolute top-4 right-4 btn-secondary text-sm">Prompts</button>
      <div id="journal-prompts" class="hidden mb-4 p-3 bg-purple-50 rounded-lg" style="font-family: 'Indie Flower', cursive;">
        <ul class="space-y-1 text-sm">
          <li>• What made you smile today?</li>
          <li>• Describe a challenge you overcame.</li>
          <li>• How did you help someone recently?</li>
          <li>• What is one thing you want to improve?</li>
          <li>• Write a message to your future self.</li>
        </ul>
      </div>
      <textarea id="journal-entry" rows="8" class="w-full p-4 rounded-lg border border-gray-300 mb-4" style="font-family: 'Indie Flower', cursive; font-size: 1.1em; line-height: 1.8; background: repeating-linear-gradient(white, white 28px, #e0e0e0 29px);" placeholder="Write your thoughts..." aria-label="Journal entry"></textarea>
      <div class="flex justify-end gap-3">
        <button id="save-journal" class="btn-primary">Save</button>
        <button id="close-journal" class="btn-secondary">Close</button>
      </div>
    </div>`;
  document.body.appendChild(journal);

  // Load previous entry
  const entryEl = document.getElementById("journal-entry");
  entryEl.value = localStorage.getItem("calmJournal") || "";
  entryEl.focus();

  document.getElementById("save-journal").onclick = () => {
    localStorage.setItem("calmJournal", entryEl.value);
    alert("Journal entry saved!");
  };
  document.getElementById("close-journal").onclick = () => journal.remove();
  document.getElementById("toggle-prompts").onclick = () => {
    const prompts = document.getElementById("journal-prompts");
    prompts.classList.toggle("hidden");
  };
  journal.onclick = (e) => {
    if (e.target === journal) journal.remove();
  };
}

// Progress backup/sync
function backupProgress(progress) {
  localStorage.setItem("calmSpaceProgress", JSON.stringify(progress));
}
function syncProgress() {
  return JSON.parse(localStorage.getItem("calmSpaceProgress") || "{}");
}

// Main export function
export function showCalmSpace(container) {
  if (!container) return;

  container.innerHTML = `
    <div class="calmspace-bg fixed inset-0 -z-10" style="background: url('/assets/backgrounds/calmspace-bg.svg') center/cover no-repeat;"></div>
    <section id="calm-space" class="card shadow-xl p-8 rounded-2xl mx-auto my-16 max-w-2xl relative bg-white/80 backdrop-blur-lg" role="region" aria-label="Calm Space">
      <h2 id="calm-heading" class="text-4xl font-bold text-primary mb-6">Heavenly Escape World</h2>

      <div id="calm-interactive" class="mb-4 flex gap-4 justify-center flex-wrap">
        <button id="star-1" class="star-btn text-2xl hover:scale-110 transition-transform" aria-label="Star 1">⭐</button>
        <button id="star-2" class="star-btn text-2xl hover:scale-110 transition-transform" aria-label="Star 2">⭐</button>
        <button id="star-3" class="star-btn text-2xl hover:scale-110 transition-transform" aria-label="Star 3">⭐</button>
        <button id="sound-toggle" class="btn-secondary ml-4" aria-label="Toggle Ambient Sound">🔊</button>
      </div>

      <div class="flex gap-3 justify-center mb-6 flex-wrap">
        <button id="calm-meditate" class="btn-primary">Start Meditation</button>
        <button id="calm-journal" class="btn-secondary">Open Journal</button>
        <button id="calmspace-help" class="btn-secondary" aria-label="Help">❓ Help</button>
      </div>

      <div id="calm-mood-tracker" class="mt-6 p-4 bg-white/50 rounded-lg"></div>

      <div class="social-stories mt-6 p-4 bg-purple-50/50 rounded-lg">
        <h3 class="text-lg font-semibold mb-3">Animated Social Stories</h3>
        <p class="text-sm text-gray-600 mb-4">Explore animated social stories for every area of learning. Designed for ages 16+ focusing on real-life scenarios, independence, and self-regulation.</p>
        <label for="domain-selector" class="block text-sm font-medium mb-2">Choose a wellbeing topic:</label>
        <select id="domain-selector" class="w-full p-2 rounded border border-gray-300 mb-4" aria-label="Select wellbeing topic">
          <option value="">-- Select --</option>
          ${Object.keys(stories)
            .map((domain) => `<option value="${domain}">${stories[domain].title}</option>`)
            .join("")}
        </select>
        <div id="story-display" class="p-4 bg-white rounded-lg min-h-[60px]"></div>
      </div>

      <div id="calm-gallery" class="mt-6"></div>
      <div id="calm-particles" class="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden"></div>

      <div class="text-sm text-gray-500 mt-4 text-center">Your Calm Space activities are private and only used for wellbeing support.</div>
    </section>
  `;

  // Mood tracker
  const moodTracker = document.getElementById("calm-mood-tracker");
  if (moodTracker) {
    moodTracker.innerHTML = `
      <label for="mood-select" class="block text-sm font-medium mb-2">How are you feeling today?</label>
      <select id="mood-select" class="w-full p-2 rounded border border-gray-300" aria-label="Select your mood">
        <option value="">-- Select --</option>
        <option value="happy">😊 Happy</option>
        <option value="sad">😢 Sad</option>
        <option value="anxious">😰 Anxious</option>
        <option value="calm">😌 Calm</option>
        <option value="frustrated">😠 Frustrated</option>
      </select>`;

    const moodSelect = document.getElementById("mood-select");
    if (moodSelect) {
      const savedMood = localStorage.getItem("userMood");
      if (savedMood) moodSelect.value = savedMood;
      moodSelect.onchange = function () {
        localStorage.setItem("userMood", this.value);
        if (this.value) alert(`Mood recorded: ${this.options[this.selectedIndex].text}`);
      };
    }
  }

  // Story selector
  const selector = document.getElementById("domain-selector");
  const storyDisplay = document.getElementById("story-display");
  if (selector && storyDisplay) {
    selector.onchange = function () {
      const domain = this.value;
      if (stories[domain]) {
        storyDisplay.innerHTML = `<h4 class="font-semibold mb-2">${stories[domain].title}</h4><p class="text-sm text-gray-700">${stories[domain].story}</p>`;
      } else {
        storyDisplay.innerHTML =
          '<p class="text-gray-400 text-sm">Select a topic to view the social story.</p>';
      }
    };
  }

  // Button handlers - direct binding (no setTimeout race)
  const meditateBtn = document.getElementById("calm-meditate");
  if (meditateBtn) meditateBtn.onclick = showMeditationModal;

  const journalBtn = document.getElementById("calm-journal");
  if (journalBtn) journalBtn.onclick = showJournal;

  const helpBtn = document.getElementById("calmspace-help");
  if (helpBtn) {
    helpBtn.onclick = () =>
      alert(
        "Calm Space offers mindfulness, breathing, and self-regulation activities. All features are accessible and private.",
      );
  }

  const soundToggleBtn = document.getElementById("sound-toggle");
  if (soundToggleBtn) soundToggleBtn.onclick = () => alert("Ambient sound toggled!");

  // Star buttons
  document.querySelectorAll(".star-btn").forEach((btn) => {
    btn.onclick = () => btn.classList.toggle("active");
  });

  // Particle effects
  const particles = document.getElementById("calm-particles");
  if (particles) {
    for (let i = 0; i < 20; i++) {
      const p = document.createElement("div");
      p.className = "particle absolute rounded-full";
      p.style.cssText = `left: ${Math.random() * 100}%; top: ${Math.random() * 100}%; width: 8px; height: 8px; background: rgba(200,180,255,0.3); animation: float ${2 + Math.random() * 3}s infinite ease-in-out;`;
      particles.appendChild(p);
    }

    if (!document.getElementById("calm-particle-style")) {
      const style = document.createElement("style");
      style.id = "calm-particle-style";
      style.textContent = `@keyframes float { 0%, 100% { transform: translateY(0) scale(1); opacity: 1; } 50% { transform: translateY(-20px) scale(1.2); opacity: 0.7; } }`;
      document.head.appendChild(style);
    }
  }

  // Keyboard navigation
  container.querySelectorAll("button, select").forEach((el) => {
    el.tabIndex = 0;
  });
}
