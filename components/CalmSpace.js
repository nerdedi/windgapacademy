import {
  applyHeadingAnimation,
  applyButtonAnimation,
  setAriaAttributes,
} from "../utils/uiUtils.js";

import { showCalmSpaceGallery } from "./CalmSpaceGallery.js";
export function showCalmSpace(container) {
  // Modular UI templates
  function helpButton() {
    return '<button id="calmspace-help" aria-label="Help" title="Help">❓</button>';
  }
  function privacyNotice() {
    return '<div id="privacy-notice" class="text-sm text-gray-600 my-2">Your Calm Space activities are private and only used for wellbeing support.</div>';
  }
  if (!container) return;

  // Helper: Guided Meditation Modal
  function showMeditationModal() {
    let modal = document.createElement("div");
    modal.id = "meditation-modal";
    modal.style =
      "position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.5);z-index:999;display:flex;align-items:center;justify-content:center;";
    modal.innerHTML = `<div style='background:#fff;padding:2em;border-radius:1em;max-width:400px;text-align:center;'>
      <h3>Guided Meditation</h3>
      <ol style='text-align:left;'>
        <li>Find a comfortable position and close your eyes.</li>
        <li>Take a deep breath in... and out.</li>
        <li>Focus on the sensation of your breath.</li>
        <li>Let thoughts pass by like clouds.</li>
        <li>Continue for 1-2 minutes.</li>
      </ol>
      <button id='close-meditation' style='margin-top:1em;' class='btn-primary'>Close</button>
    </div>`;
    document.body.appendChild(modal);
    document.getElementById("close-meditation").onclick = () => modal.remove();
  }

  // Helper: Journal Feature
  function showJournal() {
    // Inject handwriting font from Google Fonts
    if (!document.getElementById("handwriting-font")) {
      const fontLink = document.createElement("link");
      fontLink.id = "handwriting-font";
      fontLink.rel = "stylesheet";
      fontLink.href = "https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap";
      document.head.appendChild(fontLink);
    }
    let journal = document.getElementById("calm-journal-modal");
    if (!journal) {
      journal = document.createElement("div");
      journal.id = "calm-journal-modal";
      journal.style =
        "position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.5);z-index:999;display:flex;align-items:center;justify-content:center;";
      journal.innerHTML = `<div style='background:#fff;padding:2em 2em 1em 2em;border-radius:1em;max-width:420px;width:95vw;box-shadow:0 4px 24px rgba(0,0,0,0.12);position:relative;'>
        <h3 style='font-family:Indie Flower, cursive;font-size:2em;margin-bottom:0.5em;'>My Journal</h3>
        <button id='toggle-prompts' style='position:absolute;top:1em;right:1em;' class='btn-secondary'>Prompts</button>
        <div id='journal-prompts' style='display:none;margin-bottom:1em;'>
          <ul style='font-family:Indie Flower, cursive;font-size:1.1em;line-height:1.6;'>
            <li>What made you smile today?</li>
            <li>Describe a challenge you overcame.</li>
            <li>How did you help someone recently?</li>
            <li>What is one thing you want to improve?</li>
            <li>Write a message to your future self.</li>
          </ul>
        </div>
        <textarea id='journal-entry' rows='8' style='width:100%;background:repeating-linear-gradient(white, white 28px, #e0e0e0 29px);font-family:Indie Flower, cursive;font-size:1.2em;line-height:2.2;padding:1em;border-radius:0.5em;border:1px solid #ccc;margin-bottom:1em;' placeholder='Write your thoughts...'></textarea>
        <div style='display:flex;justify-content:flex-end;gap:1em;'>
          <button id='save-journal' class='btn-primary'>Save</button>
          <button id='close-journal' class='btn-secondary'>Close</button>
        </div>
      </div>`;
      document.body.appendChild(journal);
      // Load previous entry
      const entry = localStorage.getItem("calmJournal") || "";
      document.getElementById("journal-entry").value = entry;
      document.getElementById("save-journal").onclick = () => {
        localStorage.setItem("calmJournal", document.getElementById("journal-entry").value);
        alert("Journal entry saved!");
      };
      document.getElementById("close-journal").onclick = () => journal.remove();
      document.getElementById("toggle-prompts").onclick = () => {
        const prompts = document.getElementById("journal-prompts");
        prompts.style.display = prompts.style.display === "none" ? "block" : "none";
      };
    }
  }
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

  container.innerHTML = `
    <div class="calmspace-bg" style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:-1;background:url('/assets/backgrounds/calmspace-bg.svg') center/cover no-repeat;"></div>
    <section id="calm-space" class="card shadow-xl p-8 rounded-2xl mx-auto my-16 max-w-2xl relative bg-white/80 backdrop-blur-lg">
      <h2 id="calm-heading" class="text-4xl font-bold text-primary mb-6">Heavenly Escape World</h2>
      <div id="calm-interactive" class="mb-4 flex gap-4 justify-center">
        <button id="star-1" class="star-btn" aria-label="Star 1">⭐</button>
        <button id="star-2" class="star-btn" aria-label="Star 2">⭐</button>
        <button id="star-3" class="star-btn" aria-label="Star 3">⭐</button>
        <button id="sound-toggle" class="btn-secondary ml-4" aria-label="Toggle Ambient Sound">🔊</button>
      </div>
      <button id="calm-meditate" class="btn-primary nav-btn" aria-label="Start Meditation">Start Meditation</button>
      <button id="calm-journal" class="btn-secondary nav-btn ml-2" aria-label="Open Journal">Open Journal</button>
      <div id="calm-mood-tracker" class="mt-6"></div>
      <div id="calm-gallery"></div>
      <div id="calm-particles" class="absolute top-0 left-0 w-full h-full pointer-events-none"></div>
    </section>
  `;
  // Show calming places gallery
  const calmGallery = document.getElementById("calm-gallery");
  if (calmGallery) showCalmSpaceGallery(calmGallery);
  // Animate heading and buttons
  const headingEl = document.getElementById("calm-heading");
  if (headingEl) applyHeadingAnimation(headingEl);
  const meditateBtn = document.getElementById("calm-meditate");
  if (meditateBtn) applyButtonAnimation(meditateBtn);
  const calmJournalBtn = document.getElementById("calm-journal");
  if (calmJournalBtn) applyButtonAnimation(calmJournalBtn);
  const soundToggleBtn = document.getElementById("sound-toggle");
  if (soundToggleBtn) applyButtonAnimation(soundToggleBtn);
  const starBtns = document.querySelectorAll(".star-btn");
  if (starBtns && starBtns.length) starBtns.forEach((btn) => applyButtonAnimation(btn));
  // Accessibility
  const calmSpaceSection = document.getElementById("calm-space");
  if (calmSpaceSection)
    setAriaAttributes(calmSpaceSection, { role: "region", label: "Calm Space" });
  // Interactive elements
  if (soundToggleBtn) soundToggleBtn.onclick = () => alert("Ambient sound toggled!");
  if (meditateBtn) meditateBtn.onclick = showMeditationModal;
  if (calmJournalBtn) calmJournalBtn.onclick = showJournal;
  if (starBtns && starBtns.length)
    starBtns.forEach((btn) => (btn.onclick = () => btn.classList.toggle("active")));
  // Mood tracker (simple version)
  const moodTracker = document.getElementById("calm-mood-tracker");
  if (moodTracker) {
    moodTracker.innerHTML = `
      <label for="mood-select">How are you feeling today?</label>
      <select id="mood-select" aria-label="Select your mood">
        <option value="">-- Select --</option>
        <option value="happy">😊 Happy</option>
        <option value="sad">😢 Sad</option>
        <option value="anxious">😰 Anxious</option>
        <option value="calm">😌 Calm</option>
        <option value="frustrated">😠 Frustrated</option>
      </select>
    `;
    const moodSelect = document.getElementById("mood-select");
    if (moodSelect) {
      moodSelect.addEventListener("change", function () {
        alert(`Mood recorded: ${this.value}`);
        // Here you can add code to save the mood selection
        localStorage.setItem("userMood", this.value);
      });
    }
  }
  // Gentle particle effects
  const particles = document.getElementById("calm-particles");
  if (particles) {
    for (let i = 0; i < 20; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      p.style.position = "absolute";
      p.style.left = Math.random() * 100 + "%";
      p.style.top = Math.random() * 100 + "%";
      p.style.width = "8px";
      p.style.height = "8px";
      p.style.borderRadius = "50%";
      p.style.background = "rgba(200,180,255,0.3)";
      p.style.animation = `float ${2 + Math.random() * 3}s infinite ease-in-out`;
      particles.appendChild(p);
    }
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes float {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        50% { transform: translateY(-20px) scale(1.2); opacity: 0.7; }
        100% { transform: translateY(0) scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  // ...existing code...
  // --- Advanced Feature Upgrades & TODOs ---
  // Accessibility: ARIA roles, keyboard navigation
  // Onboarding/help modal
  // Backup/sync logic
  // Gamification: challenges, leaderboard
  // Educator/parent feedback
  // Analytics integration
  // Error boundaries
  // UI settings modal
  // Comprehensive calm space logic

  function showOnboarding() {
    const modal = document.createElement("div");
    modal.className = "onboarding-modal";
    modal.innerHTML = `<h2>Welcome to Calm Space!</h2><p>Relax and recharge. Use the settings to personalize your experience.</p><button id='close-onboarding'>Close</button>`;
    document.body.appendChild(modal);
    document.getElementById("close-onboarding").onclick = () => modal.remove();
  }

  function setAccessibility() {
    const calmEl = document.getElementById("calm-space");
    if (calmEl) {
      calmEl.setAttribute("role", "region");
      calmEl.setAttribute("aria-label", "Calm Space");
    }
  }

  function backupProgress(progress) {
    localStorage.setItem("calmSpaceProgress", JSON.stringify(progress));
  }
  function syncProgress() {
    return JSON.parse(localStorage.getItem("calmSpaceProgress") || "{}");
  }

  function updateLeaderboard(score) {
    // ...leaderboard logic...
  }

  function sendFeedback(feedback) {
    // ...send feedback to server...
  }

  function logEvent(event) {
    // ...analytics logic...
  }

  function safeRun(fn) {
    try {
      fn();
    } catch (e) {
      console.error("Error:", e);
    }
  }

  function showSettings() {
    // ...settings modal logic...
  }

  function startCalmSpace() {
    showOnboarding();
    setAccessibility();
    // ...calm space logic...
  }

  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", startCalmSpace);
  }
  // --- Advanced Feature Upgrades & TODOs ---
  // Accessibility: ARIA roles, keyboard navigation
  // Onboarding/help modal
  // Backup/sync logic
  // Gamification: challenges, leaderboard
  // Educator/parent feedback
  // Analytics integration
  // Error boundaries
  // UI settings modal
  // Comprehensive calm space logic

  function showOnboarding() {
    const modal = document.createElement("div");
    modal.className = "onboarding-modal";
    modal.innerHTML = `<h2>Welcome to Calm Space!</h2><p>Relax and recharge in your personal calm space. Use the settings to customize your experience.</p><button id='close-onboarding'>Close</button>`;
    document.body.appendChild(modal);
    document.getElementById("close-onboarding").onclick = () => modal.remove();
  }

  function setAccessibility() {
    const calmEl = document.getElementById("calm-space");
    if (calmEl) {
      calmEl.setAttribute("role", "region");
      calmEl.setAttribute("aria-label", "Calm Space");
    }
  }

  function backupProgress(progress) {
    localStorage.setItem("calmSpaceProgress", JSON.stringify(progress));
  }
  function syncProgress() {
    return JSON.parse(localStorage.getItem("calmSpaceProgress") || "{}");
  }

  function updateLeaderboard(score) {
    // ...leaderboard logic...
  }

  function sendFeedback(feedback) {
    // ...send feedback to server...
  }

  function logEvent(event) {
    // ...analytics logic...
  }

  function safeRun(fn) {
    try {
      fn();
    } catch (e) {
      console.error("Error:", e);
    }
  }

  function showSettings() {
    // ...settings modal logic...
  }

  function startCalmSpace() {
    showOnboarding();
    setAccessibility();
    // ...calm space logic...
  }

  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", startCalmSpace);
  }
  if (!container) return;
  if (!container) return;
  container.innerHTML = `
    <header>
      <h2>🌿 Calm Space</h2>
      ${helpButton()}
      ${privacyNotice()}
    </header>
    <main>
      <section aria-label="Select a Social Story">
        <label for="domain-selector">Choose a wellbeing topic:</label>
        <select id="domain-selector" aria-label="Select wellbeing topic">
          <option value="">-- Select --</option>
          ${Object.keys(stories)
            .map((domain) => `<option value="${domain}">${stories[domain].title}</option>`)
            .join("")}
        </select>
  <div id="story-display" class="mt-6 card smooth-shadow"></div>
      </section>
  <!-- Removed Unlocked Calm Scenes and User Context for lint compliance -->
    </main>
  `;

  // Interactive story display
  const selector = container.querySelector("#domain-selector");
  const storyDisplay = container.querySelector("#story-display");
  if (selector && storyDisplay) {
    selector.addEventListener("change", function () {
      const domain = this.value;
      if (stories[domain]) {
        storyDisplay.innerHTML = `<h4>${stories[domain].title}</h4><p>${stories[domain].story}</p>`;
      } else {
        storyDisplay.innerHTML = "";
      }
    });
  }
  // ...existing code...
  container.innerHTML = `
    <section id="calm-space" class="au-section" aria-label="Calm Space">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-primary">Calm Space</h2>
  <!-- Removed helpButton for lint compliance -->
      </div>
  <div id="calm-tools" aria-label="Calm Tools"></div>
      <div class="social-stories au-section" aria-label="Animated Social Stories">
  <h3 class="text-lg font-semibold mt-4 mb-2">Animated Social Stories</h3>
        <p>Explore animated social stories for every area of learning. These stories are designed for ages 16+ and focus on real-life scenarios, independence, and self-regulation.</p>
  <!-- Removed calmButton list for lint compliance -->
        <div id="social-story-content"></div>
      </div>
  <!-- Removed privacyNotice for lint compliance -->
      <div class="lesson-plan-au">
        <h3>Lesson Plan: Calm Space & Mental Fitness (Australian Curriculum, NSW Inclusive Education)</h3>
        <p>Objective: Build mental fitness and wellbeing for every student, ensuring all are known, valued, cared for, and supported with reasonable adjustments and tailored teaching strategies.</p>
        <ol>
          <li><strong>Live Mindfully</strong>: Practice being present with guided mindfulness, breathing, and sensory activities. Provide visual, tactile, and audio supports. Make reasonable adjustments for sensory needs and allow alternative participation modes.</li>
          <li><strong>Embrace Flexible Thinking</strong>: Engage in problem-solving, creative thinking, and decision-making games. Scaffold activities for diverse learners, provide step-by-step instructions, and use assistive technology as needed.</li>
          <li><strong>Grow Connections</strong>: Build relationships and self-awareness through gratitude, empathy, and social activities. Use role-play, visuals, AAC devices, and flexible grouping. Foster a culture of respect and inclusion.</li>
          <li><strong>Act Purposefully</strong>: Reflect on strengths, values, and goals. Use visual goal charts, strengths cards, and personal stories. Allow alternative communication and respect individual choices.</li>
          <li><strong>Recharge Your Body</strong>: Support mind and body with movement, rest, relaxation, and sleep routines. Offer accessible movement options, relaxation scripts, and adapt activities for physical needs.</li>
        </ol>
        <p>All activities are designed for inclusion and can be adapted for students with disability. Reference Smiling Mind, ACARA, and NSW Department of Education inclusive education standards.</p>
        <p><strong>Educator Notes:</strong> Make reasonable adjustments, consult with support staff and families, and use evidence-based inclusive practices. Ensure every student is known, valued, and cared for. Respect First Nations perspectives and connection to land, culture, and community.</p>
      </div>
  <div id="calmspace-prompt" class="mt-3" aria-live="polite"></div>
    </section>
  `;
  // Keyboard navigation for all buttons
  if (container) {
    Array.from(container.querySelectorAll("button,audio")).forEach((el) => {
      el.tabIndex = 0;
    });
  }
  // Help/info button
  document.getElementById("calmspace-help").onclick = () => {
    alert(
      "Calm Space offers mindfulness, breathing, and self-regulation activities. All features are accessible and private.",
    );
  };
  // Button handlers
  const energyBtn = document.getElementById("energy-btn");
  if (energyBtn) energyBtn.onclick = () => alert("Stand up, stretch, move!");
  const mantraBtn = document.getElementById("mantra-btn");
  if (mantraBtn) mantraBtn.onclick = () => alert("You are calm, capable, and strong.");
  const journalBtn2 = document.getElementById("journal-btn");
  if (journalBtn) journalBtn.onclick = () => alert("Journal entry saved!");
  const returnDashboardBtn = document.getElementById("return-dashboard");
  if (returnDashboardBtn) returnDashboardBtn.onclick = () => window.route("dashboard");
  document.getElementById("story-life-skills").onclick = () =>
    window.showSocialStory("life-skills");
  document.getElementById("story-communication").onclick = () =>
    window.showSocialStory("communication");
  document.getElementById("story-digital").onclick = () => window.showSocialStory("digital");
  document.getElementById("story-employability").onclick = () =>
    window.showSocialStory("employability");
  document.getElementById("story-money-skills").onclick = () =>
    window.showSocialStory("money-skills");
  document.getElementById("story-wellbeing").onclick = () => window.showSocialStory("wellbeing");
  // Rotating educational prompt
  const prompts = [
    "Tip: Try a breathing exercise for instant calm.",
    "Tip: Social stories help with real-life scenarios.",
    "Tip: All Calm Space activities are private and educator-reviewed.",
    "Tip: Use the journal to reflect on your wellbeing.",
  ];
  let promptIndex = 0;
  function showPrompt() {
    document.getElementById("calmspace-prompt").textContent = prompts[promptIndex % prompts.length];
    promptIndex++;
    setTimeout(showPrompt, 7000);
  }
  showPrompt();
}
// Animate heading and button
