// Life Skills Game Module
// Practice daily living skills with interactive scenarios

export function showLifeSkillsGame(container, userData = {}) {
  container.innerHTML = `
    <section id="life-skills-game" aria-label="Life Skills Game">
      <h2>🏠 Life Skills Game</h2>
      <div id="life-skills-challenge" aria-live="polite"></div>
      <button id="life-return" aria-label="Return to Dashboard">Return to Dashboard</button>
    </section>
  `;
  document.getElementById('life-return').onclick = function() { window.route('dashboard'); };
  startLifeSkillsGame(userData);
}

function startLifeSkillsGame(userData) {
  var area = document.getElementById('life-skills-challenge');
  var scenarios = [
    'Make a healthy breakfast for Daisy.',
    'Help Winnie tidy her room.',
    'Remind Andy to take his medication.'
  ];
  var current = 0;
  var progress = [];
  function renderScenario() {
      area.innerHTML = `<p>${scenarios[current]}</p>
        <button id='life-btn' class='nav-btn' aria-label='Complete Task'>Complete Task</button>
        <div id='life-feedback' aria-live='polite' style='margin-top:8px;'></div>`;
    var btn = document.getElementById('life-btn');
    btn.focus();
    btn.onkeydown = function(e) { if (e.key === 'Enter') btn.click(); };
    btn.onclick = function() {
      document.getElementById('life-feedback').innerText = 'Task completed!';
      progress.push({ scenario: scenarios[current], completed: true });
      if (current < scenarios.length - 1) {
        current++;
        setTimeout(renderScenario, 1200);
      } else {
        setTimeout(function() {
          area.innerHTML = '<p>Game complete! Well done.</p>';
          if (userData && userData.userId) {
            import('../../firebase.js').then(function(mod) {
              mod.saveLessonPlan('life-skills-game', userData.userId, JSON.stringify(progress));
            });
          }
        }, 1200);
      }
    };
  }
  renderScenario();
}
