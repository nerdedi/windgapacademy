// Digital Skills Game Module
// Practice basic digital skills with interactive challenges

export function showDigitalSkillsGame(container, userData = {}) {
  container.innerHTML = `
    <section id="digital-skills-game">
      <h2>💻 Digital Skills Game</h2>
      <div id="digital-challenge"></div>
      <button onclick="window.route('dashboard')">Return to Dashboard</button>
    </section>
  `;
  startDigitalSkillsGame();
}

function startDigitalSkillsGame() {
  const area = document.getElementById('digital-challenge');
  let challenges = [
    'Click the button to open the browser.',
    'Type your name in the field below.',
    'Drag the file to the upload area.'
  ];
  let current = 0;
  area.innerHTML = `<p>${challenges[current]}</p><button id='digital-btn'>Open Browser</button><div id='digital-feedback'></div>`;
  document.getElementById('digital-btn').onclick = () => {
    if (current === 0) {
      document.getElementById('digital-feedback').innerText = 'Browser opened!';
      current++;
      setTimeout(() => {
        area.innerHTML = `<p>${challenges[current]}</p><input id='digital-input' type='text' placeholder='Your name...' /><button id='digital-submit'>Submit</button><div id='digital-feedback'></div>`;
        document.getElementById('digital-submit').onclick = () => {
          if (document.getElementById('digital-input').value.trim()) {
            document.getElementById('digital-feedback').innerText = 'Name entered!';
            current++;
            setTimeout(() => {
              area.innerHTML = `<p>${challenges[current]}</p><div id='upload-area' style='width:200px;height:60px;border:2px dashed #3b82f6;text-align:center;line-height:60px;'>Drop file here</div><div id='digital-feedback'></div>`;
              document.getElementById('upload-area').ondrop = () => {
                document.getElementById('digital-feedback').innerText = 'File uploaded!';
              };
            }, 1200);
          }
        };
      }, 1200);
    }
  };
}
