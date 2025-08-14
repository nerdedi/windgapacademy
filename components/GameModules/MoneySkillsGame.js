// Money Skills Game Module
// Practice money handling and budgeting with Australian currency visuals

export function showMoneySkillsGame(container, userData = {}) {
  container.innerHTML = `
    <section id="money-skills-game">
      <h2>💰 Money Skills Game</h2>
      <div id="money-challenge"></div>
      <img src="assets/images/aud_notes.png" alt="Australian Currency" />
      <button onclick="window.route('dashboard')">Return to Dashboard</button>
    </section>
  `;
  startMoneySkillsGame();
}

function startMoneySkillsGame() {
  const area = document.getElementById('money-challenge');
  let questions = [
    { q: 'How much is a $5 note plus a $2 coin?', a: '7' },
    { q: 'If Daisy buys apples for $3 and bread for $2, how much does she spend?', a: '5' },
    { q: 'Andy has $10 and spends $4. How much is left?', a: '6' }
  ];
  let current = 0;
  area.innerHTML = `<p>${questions[current].q}</p><input id='money-input' type='number' /><button id='money-submit'>Submit</button><div id='money-feedback'></div>`;
  document.getElementById('money-submit').onclick = () => {
    const val = document.getElementById('money-input').value.trim();
    if (val === questions[current].a) {
      document.getElementById('money-feedback').innerText = 'Correct!';
      if (current < questions.length - 1) {
        current++;
        setTimeout(() => {
          area.innerHTML = `<p>${questions[current].q}</p><input id='money-input' type='number' /><button id='money-submit'>Submit</button><div id='money-feedback'></div>`;
          document.getElementById('money-submit').onclick = arguments.callee;
        }, 1200);
      }
    } else {
      document.getElementById('money-feedback').innerText = 'Try again!';
    }
  };
}
