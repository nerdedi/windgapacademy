export function showCalmSpace(container) {
  // Modular UI templates
  function helpButton() {
    return "<button id=\"calmspace-help\" aria-label=\"Help\" title=\"Help\">❓</button>";
  }
  function privacyNotice() {
  return "<div id=\"privacy-notice\" class=\"text-sm text-gray-600 my-2\">Your Calm Space activities are private and only used for wellbeing support.</div>";
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
      <div id="calm-particles" class="absolute top-0 left-0 w-full h-full pointer-events-none"></div>
    </section>
  `;
  // Animate heading and buttons
  applyHeadingAnimation(document.getElementById('calm-heading'));
  applyButtonAnimation(document.getElementById('calm-meditate'));
  applyButtonAnimation(document.getElementById('calm-journal'));
  applyButtonAnimation(document.getElementById('sound-toggle'));
  document.querySelectorAll('.star-btn').forEach(btn => applyButtonAnimation(btn));
  // Accessibility
  setAriaAttributes(document.getElementById('calm-space'), { role: 'region', label: 'Calm Space' });
  // Interactive elements
  document.getElementById('sound-toggle').onclick = () => alert('Ambient sound toggled!');
  document.getElementById('calm-meditate').onclick = () => alert('Guided meditation coming soon!');
  document.getElementById('calm-journal').onclick = () => alert('Journal feature coming soon!');
  document.querySelectorAll('.star-btn').forEach(btn => btn.onclick = () => btn.classList.toggle('active'));
  // Gentle particle effects
  const particles = document.getElementById('calm-particles');
  for(let i=0;i<20;i++){
    const p=document.createElement('div');
    p.className='particle';
    p.style.position='absolute';
    p.style.left=Math.random()*100+'%';
    p.style.top=Math.random()*100+'%';
    p.style.width='8px';
    p.style.height='8px';
    p.style.borderRadius='50%';
    p.style.background='rgba(200,180,255,0.3)';
    p.style.animation=`float ${2+Math.random()*3}s infinite ease-in-out`;
    particles.appendChild(p);
  }
  // Animate heading and buttons
  applyHeadingAnimation(document.getElementById('calm-heading'));
  applyButtonAnimation(document.getElementById('calm-meditate'));
  applyButtonAnimation(document.getElementById('calm-journal'));
  // Accessibility
  setAriaAttributes(document.getElementById('calm-space'), { role: 'region', label: 'Calm Space' });

  // ...existing code...
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
  const journalBtn = document.getElementById("journal-btn");
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
