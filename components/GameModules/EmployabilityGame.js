// Employability Game Module
// Practice job skills and interview scenarios

export function showEmployabilityGame(container, userData = {}) {
  container.innerHTML = `
    <section id="employability-game">
      <h2>💼 Employability Game</h2>
      <div id="employability-challenge"></div>
      <button onclick="window.route('dashboard')">Return to Dashboard</button>
    </section>
  `;
  startEmployabilityGame();
}

function startEmployabilityGame() {
  const area = document.getElementById('employability-challenge');
  let scenarios = [
    'Prepare Daisy for a job interview.',
    'Help Winnie write her resume.',
    'Coach Andy on workplace communication.'
  ];
  let current = 0;
  area.innerHTML = `<p>${scenarios[current]}</p><button id='employ-btn'>Complete Task</button><div id='employ-feedback'></div>`;
  document.getElementById('employ-btn').onclick = () => {
    document.getElementById('employ-feedback').innerText = 'Task completed!';
    if (current < scenarios.length - 1) {
      current++;
      setTimeout(() => {
        area.innerHTML = `<p>${scenarios[current]}</p><button id='employ-btn'>Complete Task</button><div id='employ-feedback'></div>`;
        document.getElementById('employ-btn').onclick = arguments.callee;
      }, 1200);
    }
  };
}
