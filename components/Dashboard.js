export function showDashboard(container, data = {}) {
  // Modular UI templates
  function navButton(label, route, active = false) {
    return `<button class="nav-btn${active ? " active" : ""}" onclick="window.route('${route}')" aria-label="${label}">${label}</button>`;
  }
  function helpButton() {
    return "<button id=\"dashboard-help\" aria-label=\"Help\" title=\"Help\">❓</button>";
  }
  function privacyNotice() {
    return "<div id=\"privacy-notice\" style=\"font-size:0.9em;color:#555;margin:8px 0;\">Your data is private and only used for educational purposes.</div>";
  }
  container.innerHTML = `
    <section id="dashboard" class="card bg-white shadow-xl p-8 rounded-2xl animated-bg">
      <h2 id="dashboard-heading" class="text-3xl font-bold text-primary mb-6">Dashboard</h2>
      <div id="dashboard-charts" class="mb-4 animated-charts"></div>
      <button id="dashboard-feedback" class="btn-primary nav-btn" aria-label="Give Feedback">Give Feedback</button>
      <div id="dashboard-progress" class="mt-6"></div>
    </section>
  `;
  // Animate heading and button
  applyHeadingAnimation(document.getElementById('dashboard-heading'));
  applyButtonAnimation(document.getElementById('dashboard-feedback'));
  // Accessibility
  setAriaAttributes(document.getElementById('dashboard'), { role: 'region', label: 'Dashboard' });
  animateCharacters();
  // Keyboard navigation for nav buttons
  Array.from(container.querySelectorAll("button,canvas")).forEach((el) => {
    el.tabIndex = 0;
  });
  // Help/info button
  document.getElementById("dashboard-help").onclick = () => {
    alert(
      "Welcome to Windgap Academy! Use the navigation buttons to explore learning domains. All features are accessible and safe.",
    );
  };
  // Rotating educational prompt
  const prompts = [
    "Tip: Try Calm Space for self-regulation activities.",
    "Tip: Achievements unlock new learning games!",
    "Tip: All your progress is private and educator-reviewed.",
    "Tip: Use the Educator tab for lesson plans and support.",
  ];
  let promptIndex = 0;
  function showPrompt() {
    document.getElementById("dashboard-prompt").textContent = prompts[promptIndex % prompts.length];
    promptIndex++;
    setTimeout(showPrompt, 7000);
  }
  showPrompt();
}
function animateCharacters() {
  ["daisy", "winnie", "andy"].forEach((name, i) => {
    const canvas = document.getElementById(`${name}-anim`);
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = ["#ffe4e1", "#90caf9", "#e0f7fa"][i];
      ctx.beginPath();
      ctx.arc(50, 50, 40, 0, 2 * Math.PI);
      ctx.fill();
      ctx.font = "16px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText(name.charAt(0).toUpperCase() + name.slice(1), 25, 55);
    }
  });
}
