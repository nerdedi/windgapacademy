// Communication Game Module
// Practice communication skills with animated feedback
// Visual and tactile learning options

export function showCommunicationGame(container, userData = {}) {
  container.innerHTML = `
    <section id="communication-game" aria-label="Communication Game">
      <h2>💬 Communication Game</h2>
      <div id="conversation-area" aria-live="polite"></div>
      <button id="comm-return" aria-label="Return to Dashboard">Return to Dashboard</button>
    </section>
  `;
  document.getElementById('comm-return').onclick = function() { window.route('dashboard'); };
  startCommunicationGame(userData);
}

function startCommunicationGame(userData) {
  var area = document.getElementById('conversation-area');
  var prompts = [
    'Greet Daisy politely.',
    'Ask Winnie for help.',
    'Thank Andy for his support.'
  ];
  var answers = ['hello', 'help', 'thank'];
  var feedbacks = [
    'Daisy: "Lovely greeting!"',
    'Winnie: "I am happy to help!"',
    'Andy: "You are very welcome!"'
  ];
  var current = 0;
  var progress = [];
  function renderPrompt() {
      area.innerHTML = `<p>${prompts[current]}</p>
        <input id='comm-input' type='text' placeholder='Type your response...' aria-label='Type your response' style='margin-bottom:8px;' />
        <button id='comm-submit' class='nav-btn' aria-label='Send'>Send</button>
        <div id='comm-feedback' aria-live='polite' style='margin-top:8px;'></div>`;
    var input = document.getElementById('comm-input');
    var submit = document.getElementById('comm-submit');
    input.focus();
    input.onkeydown = function(e) { if (e.key === 'Enter') submit.click(); };
    submit.onclick = function() {
      var val = input.value.trim().toLowerCase();
      var feedback = '';
      if (val.includes(answers[current])) {
        feedback = feedbacks[current];
        progress.push({ prompt: prompts[current], response: val, correct: true });
      } else {
        feedback = 'Try again!';
        progress.push({ prompt: prompts[current], response: val, correct: false });
      }
        document.getElementById('comm-feedback').innerHTML = `<span style='color:#ef4444;font-weight:600;'>${feedback}</span>`;
      if (feedback !== 'Try again!' && current < prompts.length - 1) {
        current++;
        setTimeout(renderPrompt, 1200);
      } else if (feedback !== 'Try again!' && current === prompts.length - 1) {
        setTimeout(function() {
          area.innerHTML = '<p>Game complete! Well done.</p>';
          if (userData && userData.userId) {
            import('../../firebase.js').then(function(mod) {
              mod.saveLessonPlan('communication-game', userData.userId, JSON.stringify(progress));
            });
          }
        }, 1200);
      }
    };
  }
  renderPrompt();
}
