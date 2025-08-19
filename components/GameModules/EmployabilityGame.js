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
  document.getElementById('employ-return').onclick = function() { window.route('dashboard'); };
  startEmployabilityGame(userData);
}

function startEmployabilityGame(userData) {
  var area = document.getElementById('employability-challenge');
  var scenarios = [
    'Prepare Daisy for a job interview.',
    'Help Winnie write her resume.',
    'Coach Andy on workplace communication.'
  ];
  var current = 0;
  var progress = [];
  function renderScenario() {
    area.innerHTML = `<p>${scenarios[current]}</p>
      <button id='employ-btn' class='nav-btn' aria-label='Complete Task'>Complete Task</button>
      <div id='employ-feedback' aria-live='polite' style='margin-top:8px;'></div>`;
    var btn = document.getElementById('employ-btn');
    btn.focus();
    btn.onkeydown = function(e) { if (e.key === 'Enter') btn.click(); };
    btn.onclick = function() {
  document.getElementById('employ-feedback').innerHTML = `<span style='color:#22c55e;font-weight:600;'>Task completed!</span>`;
      progress.push({ scenario: scenarios[current], completed: true });
      if (current < scenarios.length - 1) {
        current++;
        setTimeout(renderScenario, 1200);
      } else {
        setTimeout(function() {
          area.innerHTML = '<p>Game complete! Well done.</p>';
          if (userData && userData.userId) {
            import('../../firebase.js').then(function(mod) {
              mod.saveLessonPlan('employability-game', userData.userId, JSON.stringify(progress));
            });
          }
        }, 1200);
      }
    };
  }
  renderScenario();
}
