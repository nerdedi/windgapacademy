export function showDashboard(container, data = {}) {
  // Modular UI templates
  function navButton(label, route, active = false) {
    return `<button class="nav-btn${active ? ' active' : ''}" onclick="window.route('${route}')" aria-label="${label}">${label}</button>`;
  }
  function helpButton() {
    return `<button id="dashboard-help" aria-label="Help" title="Help">❓</button>`;
  }
  function privacyNotice() {
    return `<div id="privacy-notice" style="font-size:0.9em;color:#555;margin:8px 0;">Your data is private and only used for educational purposes.</div>`;
  }
  container.innerHTML = `
    <header>
      <img src="assets/images/windgap_logo.png" alt="Windgap Foundation Logo" class="logo" />
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h1>🌟 Windgap Academy of Learning</h1>
        ${helpButton()}
      </div>
      <nav aria-label="Main Navigation">
        ${navButton('Home', 'dashboard', true)}
        ${navButton('📚 Literacy', 'literacy')}
        ${navButton('🔢 Numeracy', 'numeracy')}
        ${navButton('💬 Communication', 'communication')}
        ${navButton('💻 Digital Skills', 'digital')}
        ${navButton('🏠 Life Skills', 'life-skills')}
        ${navButton('💰 Money Skills', 'money-skills')}
        ${navButton('💼 Employability', 'employability')}
        ${navButton('🌿 Calm Space', 'calm')}
        ${navButton('🧑‍🏫 Educator', 'educator')}
      </nav>
    </header>
    <main>
      <section id="character-intro" aria-label="Character Introduction">
        <canvas id="daisy-anim" width="100" height="100" tabindex="0" aria-label="Daisy Animation"></canvas>
        <canvas id="winnie-anim" width="100" height="100" tabindex="0" aria-label="Winnie Animation"></canvas>
        <canvas id="andy-anim" width="100" height="100" tabindex="0" aria-label="Andy Animation"></canvas>
      </section>
      <section id="learner-info" aria-label="Learner Information">
        <p>Level: <span id="learner-level">1</span></p>
        <p>Achievements: <span id="learner-achievements">None yet</span></p>
        <p>Assigned Work: <span id="assigned-work">Literacy Lesson</span></p>
      </section>
      <section id="privacy-safety-info" class="au-section" aria-label="Privacy and Safety Information">
        <h3>kidSAFE+ & COPPA Compliant</h3>
        <ul>
          <li>This platform is 100% ad-free and free of in-app purchases.</li>
          <li>All experiences are educational and age-appropriate.</li>
          <li>Social features are strictly moderated and educator-reviewed.</li>
          <li>No personal data is collected beyond educational progress.</li>
          <li>Privacy and safety are prioritised at every step.</li>
          <li>All content and interactions are logged for safety and review.</li>
        </ul>
        <p><strong>Notice:</strong> All tokens and rewards are educational only and have no real-world value.</p>
        ${privacyNotice()}
      </section>
      <section aria-label="Quick Actions">
        ${navButton('Go to Calm Space', 'calm')}
        ${navButton('Play Literacy Game', 'literacy')}
        ${navButton('Play Numeracy Game', 'numeracy')}
      </section>
      <section id="dashboard-prompt" style="margin-top:12px;" aria-live="polite"></section>
    </main>
    <footer>
      <p>&copy; 2025 Windgap Academy. All rights reserved.</p>
    </footer>
  `;
  animateCharacters();
  // Keyboard navigation for nav buttons
  Array.from(container.querySelectorAll('button,canvas')).forEach(el => { el.tabIndex = 0; });
  // Help/info button
  document.getElementById('dashboard-help').onclick = () => {
    alert('Welcome to Windgap Academy! Use the navigation buttons to explore learning domains. All features are accessible and safe.');
  };
  // Rotating educational prompt
  const prompts = [
    'Tip: Try Calm Space for self-regulation activities.',
    'Tip: Achievements unlock new learning games!',
    'Tip: All your progress is private and educator-reviewed.',
    'Tip: Use the Educator tab for lesson plans and support.'
  ];
  let promptIndex = 0;
  function showPrompt() {
    document.getElementById('dashboard-prompt').textContent = prompts[promptIndex % prompts.length];
    promptIndex++;
    setTimeout(showPrompt, 7000);
  }
  showPrompt();
}
function animateCharacters() {
  ['daisy','winnie','andy'].forEach((name,i) => {
    const canvas=document.getElementById(`${name}-anim`);
    if(canvas){
      const ctx=canvas.getContext('2d');
      ctx.fillStyle=['#ffe4e1','#90caf9','#e0f7fa'][i];
      ctx.beginPath(); ctx.arc(50,50,40,0,2*Math.PI); ctx.fill();
      ctx.font="16px Arial"; ctx.fillStyle="#333"; ctx.fillText(name.charAt(0).toUpperCase()+name.slice(1),25,55);
    }
  });
}
