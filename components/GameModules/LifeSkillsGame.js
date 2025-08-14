// Life Skills Game Module
// Practice daily living skills with interactive scenarios

export function showLifeSkillsGame(container, userData = {}) {
  container.innerHTML = `
    <section id="life-skills-game">
      <h2>🏠 Life Skills Game</h2>
      <div id="life-skills-challenge"></div>
      <button onclick="window.route('dashboard')">Return to Dashboard</button>
    </section>
  `;
  startLifeSkillsGame();
}

function startLifeSkillsGame() {
  const area = document.getElementById('life-skills-challenge');
  let scenarios = [
    'Make a healthy breakfast for Daisy.',
    'Help Winnie tidy her room.',
    'Remind Andy to take his medication.'
  ];
  let current = 0;
  area.innerHTML = `<p>${scenarios[current]}</p><button id='life-btn'>Complete Task</button><div id='life-feedback'></div>`;
  document.getElementById('life-btn').onclick = () => {
    document.getElementById('life-feedback').innerText = 'Task completed!';
    if (current < scenarios.length - 1) {
      current++;
      setTimeout(() => {
        area.innerHTML = `<p>${scenarios[current]}</p><button id='life-btn'>Complete Task</button><div id='life-feedback'></div>`;
        document.getElementById('life-btn').onclick = arguments.callee;
      }, 1200);
    }
  };
}
