// Token System Module
// Earn tokens, spend in store, track achievements

export function showTokenSystem(container) {
  let tokens = 0;
  function helpButton() {
    return "<button id=\"token-help\" aria-label=\"Help\" title=\"Help\">❓</button>";
  }
  function privacyNotice() {
    return "<div id=\"privacy-notice\" style=\"font-size:0.9em;color:#555;margin:8px 0;\">All token actions are private and only used for educational motivation.</div>";
  }
  container.innerHTML = ` 
    <section id="token-system" class="au-section" aria-label="Token System">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-primary">Token System</h2>
        ${helpButton()}
      </div>
      <div id="token-count" aria-label="Token Count">Tokens: ${tokens}</div>
      <button id="earn-token" aria-label="Earn Token">Earn Token</button>
      <button id="go-store" aria-label="Go to Store">Go to Store</button>
      <button id="return-dashboard" aria-label="Return to Dashboard">Return to Dashboard</button>
      ${privacyNotice()}
      <div class="lesson-plan-au">
        <h3>Lesson Plan: Token System (Australian Curriculum)</h3>
        <p>Objective: Motivate and reward positive behaviour and achievement in Australian schools.</p>
        <ul>
          <li>Discuss fair and inclusive reward systems.</li>
          <li>Connect to Personal and Social Capability curriculum.</li>
          <li>Reflect on intrinsic and extrinsic motivation in the classroom.</li>
        </ul>
        <p>Educator Notes: Use tokens to reinforce positive behaviour and achievement, aligned to Australian values.</p>
      </div>
  <div id="token-prompt" class="mt-3" aria-live="polite"></div>
    </section>
  `;
  Array.from(container.querySelectorAll("button")).forEach(function (el) {
    el.tabIndex = 0;
  });
  var helpBtn = container.querySelector("#token-help");
  if (helpBtn) {
    helpBtn.onclick = function () {
      alert(
        "Tokens motivate and reward positive behaviour. All actions are private and educator-reviewed.",
      );
    };
  }
  var tokenCountDiv = container.querySelector("#token-count");
  var tokenPromptDiv = container.querySelector("#token-prompt");
  var earnTokenBtn = container.querySelector("#earn-token");
  var goStoreBtn = container.querySelector("#go-store");
  var returnDashboardBtn = container.querySelector("#return-dashboard");
  if (earnTokenBtn && tokenCountDiv && tokenPromptDiv) {
    earnTokenBtn.onclick = function () {
      tokens++;
      tokenCountDiv.textContent = "Tokens: " + tokens;
      tokenPromptDiv.textContent = "Great job! You earned a token for positive behaviour.";
      setTimeout(function () {
        tokenPromptDiv.textContent = "";
      }, 3000);
      playSound("assets/sounds/token-earn.mp3");
      animateEffect("token-pop");
      if (window.logEducatorAction) window.logEducatorAction({ type: "earnToken" });
      if (isAchievementUnlocked(tokens, 10)) {
        alert("Achievement unlocked: 10 tokens!");
      }
    };
  }
  if (goStoreBtn) {
    goStoreBtn.onclick = function () {
      window.route("academy-store");
    };
  }
  if (returnDashboardBtn) {
    returnDashboardBtn.onclick = function () {
      window.route("dashboard");
    };
  }
  // Rotating educational prompt
  const prompts = [
    "Tip: Earn tokens for achievements and positive behaviour.",
    "Tip: All token actions are private and educator-reviewed.",
    "Tip: Visit the store to spend your tokens.",
    "Tip: Achievements unlock new rewards.",
  ];
  let promptIndex = 0;
  function showPrompt() {
    tokenPromptDiv.textContent = prompts[promptIndex % prompts.length];
    promptIndex++;
    setTimeout(showPrompt, 7000);
  }
  showPrompt();
  function playSound(src) {
    const audio = new Audio(src);
    audio.play();
  }
  function animateEffect(effect) {
    tokenCountDiv.classList.add(effect);
    setTimeout(() => tokenCountDiv.classList.remove(effect), 700);
  }
  function isAchievementUnlocked(tokens, threshold) {
    return tokens === threshold;
  }
}
