import { applyHeadingAnimation, applyButtonAnimation, setAriaAttributes } from '../utils/uiUtils.js';

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
    <div class="dashboard-bg" style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:-1;background:url('/assets/backgrounds/analytics-bg.svg') center/cover no-repeat;"></div>
    <section id="dashboard" class="card shadow-xl p-8 rounded-2xl mx-auto my-16 max-w-3xl relative bg-white/80 backdrop-blur-lg">
      <h2 id="dashboard-heading" class="text-3xl font-bold text-primary mb-6">Dashboard</h2>
      <div id="dashboard-charts" class="mb-4 flex gap-6 justify-center">
        <div class="chart animated-charts" style="width:180px;height:120px;background:#e0ffe7;border-radius:16px;box-shadow:0 2px 8px #0001;"></div>
        <div class="progress-ring animated-charts" style="width:120px;height:120px;border-radius:50%;background:#ffe0f7;box-shadow:0 2px 8px #0001;"></div>
      </div>
      <button id="dashboard-feedback" class="btn-primary nav-btn" aria-label="Give Feedback">Give Feedback</button>
      <form id="feedback-form" class="mt-6 flex flex-col gap-2">
        <label htmlFor="emoji-rating">Rate your experience:</label>
        <div id="emoji-rating" class="flex gap-2">
          <button type="button" class="emoji-btn" aria-label="Great">😊</button>
          <button type="button" class="emoji-btn" aria-label="Okay">😐</button>
          <button type="button" class="emoji-btn" aria-label="Bad">😞</button>
        </div>
        <textarea id="feedback-comment" rows="2" placeholder="Your feedback..." class="input"></textarea>
        <button type="submit" class="btn-secondary">Submit</button>
      </form>
    </section>
  `;
  // Animate heading and button
  applyHeadingAnimation(document.getElementById('dashboard-heading'));
  applyButtonAnimation(document.getElementById('dashboard-feedback'));
  document.querySelectorAll('.emoji-btn').forEach(btn => applyButtonAnimation(btn));
  applyButtonAnimation(document.querySelector('button.btn-secondary'));
  // Accessibility
  setAriaAttributes(document.getElementById('dashboard'), { role: 'region', label: 'Dashboard' });
  // Feedback form interactivity
  const feedbackForm = document.getElementById('feedback-form');
  if (feedbackForm) {
    feedbackForm.onsubmit = function(e) {
      e.preventDefault();
      alert('Thank you for your feedback!');
    };
  }
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
  const dashboardHelpBtn = document.getElementById("dashboard-help");
  if (dashboardHelpBtn) {
    dashboardHelpBtn.onclick = () => {
      alert(
        "Welcome to Windgap Academy! Use the navigation buttons to explore learning domains. All features are accessible and safe."
      );
    };
  }
  // Rotating educational prompt
  const prompts = [
    "Tip: Try Calm Space for self-regulation activities.",
    "Tip: Achievements unlock new learning games!",
    "Tip: All your progress is private and educator-reviewed.",
    "Tip: Use the Educator tab for lesson plans and support.",
  ];
  let promptIndex = 0;
  function showPrompt() {
    const dashboardPrompt = document.getElementById("dashboard-prompt");
    if (dashboardPrompt) {
      dashboardPrompt.textContent = prompts[promptIndex % prompts.length];
    }
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
