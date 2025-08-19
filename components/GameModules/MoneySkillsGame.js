// Money Skills Game Module
// Practice money handling and budgeting with Australian currency visuals

export function showMoneySkillsGame(container, userData = {}) {
  container.innerHTML = `
    <section id="money-skills-game" aria-label="Money Skills Game">
      <h2>💰 Money Skills Game</h2>
      <div id="money-challenge"></div>
  <img src="assets/images/aud_notes.png" alt="Australian Currency" loading="lazy" />
      <button id="money-return" class="nav-btn" aria-label="Return to Dashboard">Return to Dashboard</button>
    </section>
  `;
  document.getElementById('money-return').onclick = function() { window.route('dashboard'); };
  startMoneySkillsGame(userData);
}

function startMoneySkillsGame() {
  const area = document.getElementById('money-challenge');
  let questions = [
    { q: 'How much is a $5 note plus a $2 coin?', a: '7' },
    { q: 'If Daisy buys apples for $3 and bread for $2, how much does she spend?', a: '5' },
    { q: 'Andy has $10 and spends $4. How much is left?', a: '6' }
  ];
  let current = 0;
  let progress = [];
  let completed = false;
  function renderQuestion() {
    area.innerHTML = `<p aria-live='polite'>${questions[current].q}</p>
      <input id='money-input' type='number' aria-label='Answer' style='margin-bottom:8px;' />
      <button id='money-submit' class='nav-btn' aria-label='Submit'>Submit</button>
      <div id='money-feedback' aria-live='polite' style='margin-top:8px;'></div>`;
    document.getElementById('money-submit').onclick = function() {
      const val = document.getElementById('money-input').value.trim();
      const feedback = document.getElementById('money-feedback');
      if (val === questions[current].a) {
        feedback.innerHTML = `<span style='color:#22c55e;font-weight:600;'>Correct!</span>`;
        progress.push({ question: questions[current].q, answer: val, correct: true });
        if (current < questions.length - 1) {
          current++;
          setTimeout(renderQuestion, 1200);
        } else if (!completed) {
          completed = true;
          setTimeout(() => {
            feedback.innerHTML = `<span style='color:#3b82f6;font-weight:600;'>Game complete! Well done.</span>`;
            progress.push({ action: 'complete' });
            if (userData && userData.userId) {
              import('../../firebase.js').then(mod => {
                mod.saveLessonPlan('money-skills-game', userData.userId, JSON.stringify(progress));
              });
            }
          }, 1200);
        }
      } else {
        feedback.innerHTML = `<span style='color:#ef4444;font-weight:600;'>Try again!</span>`;
        progress.push({ question: questions[current].q, answer: val, correct: false });
      }
    };
  }
  renderQuestion();
}
