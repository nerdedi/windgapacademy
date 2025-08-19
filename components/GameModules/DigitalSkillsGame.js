// Digital Skills Game Module
// Practice basic digital skills with interactive challenges

export function showDigitalSkillsGame(container, userData = {}) {
  container.innerHTML = `
    <section id="digital-skills-game" aria-label="Digital Skills Game">
      <h2>💻 Digital Skills Game</h2>
      <div id="digital-challenge" aria-live="polite"></div>
      <button id="digital-return" class="nav-btn" aria-label="Return to Dashboard">Return to Dashboard</button>
    </section>
  `;
  document.getElementById('digital-return').onclick = function() { window.route('dashboard'); };
  startDigitalSkillsGame(userData);
}

function startDigitalSkillsGame(userData) {
  var area = document.getElementById('digital-challenge');
  var challenges = [
    'Click the button to open the browser.',
    'Type your name in the field below.',
    'Drag the file to the upload area.'
  ];
  var current = 0;
  var progress = [];
  function renderChallenge() {
    if (current === 0) {
  area.innerHTML = `<p>${challenges[current]}</p><button id='digital-btn' class='nav-btn' aria-label='Open Browser'>Open Browser</button><div id='digital-feedback' aria-live='polite' style='margin-top:8px;'></div>`;
      var btn = document.getElementById('digital-btn');
      btn.focus();
      btn.onkeydown = function(e) { if (e.key === 'Enter') btn.click(); };
      btn.onclick = function() {
  document.getElementById('digital-feedback').innerHTML = `<span style='color:#22c55e;font-weight:600;'>Browser opened!</span>`;
        progress.push({ challenge: challenges[current], completed: true });
        current++;
        setTimeout(renderChallenge, 1200);
      };
    } else if (current === 1) {
  area.innerHTML = `<p>${challenges[current]}</p><input id='digital-input' type='text' placeholder='Your name...' aria-label='Your name' style='margin-bottom:8px;' /><button id='digital-submit' class='nav-btn' aria-label='Submit'>Submit</button><div id='digital-feedback' aria-live='polite' style='margin-top:8px;'></div>`;
      var input = document.getElementById('digital-input');
      var submit = document.getElementById('digital-submit');
      input.focus();
      input.onkeydown = function(e) { if (e.key === 'Enter') submit.click(); };
      submit.onclick = function() {
        if (input.value.trim()) {
          document.getElementById('digital-feedback').innerHTML = `<span style='color:#22c55e;font-weight:600;'>Name entered!</span>`;
          progress.push({ challenge: challenges[current], completed: true, value: input.value.trim() });
          current++;
          setTimeout(renderChallenge, 1200);
        } else {
          document.getElementById('digital-feedback').innerHTML = `<span style='color:#ef4444;font-weight:600;'>Please enter your name.</span>`;
        }
      };
    } else if (current === 2) {
  area.innerHTML = `<p>${challenges[current]}</p><div id='upload-area' style='width:200px;height:60px;border:2px dashed #3b82f6;text-align:center;line-height:60px;' aria-label='Drop file here' tabindex='0'>Drop file here</div><div id='digital-feedback' aria-live='polite' style='margin-top:8px;'></div>`;
      var uploadArea = document.getElementById('upload-area');
      uploadArea.focus();
      uploadArea.ondrop = function() {
  document.getElementById('digital-feedback').innerHTML = `<span style='color:#22c55e;font-weight:600;'>File uploaded!</span>`;
        progress.push({ challenge: challenges[current], completed: true });
        setTimeout(function() {
          area.innerHTML = '<p>Game complete! Well done.</p>';
          if (userData && userData.userId) {
            import('../../firebase.js').then(function(mod) {
              mod.saveLessonPlan('digital-skills-game', userData.userId, JSON.stringify(progress));
            });
          }
        }, 1200);
      };
      uploadArea.onkeydown = function(e) { if (e.key === 'Enter') uploadArea.ondrop(); };
  }
  renderChallenge();
}
  }
