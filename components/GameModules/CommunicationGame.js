// Communication Game Module
// Practice communication skills with animated feedback
// Visual and tactile learning options

export function showCommunicationGame(container, userData = {}) {
  container.innerHTML = `
    <section id="communication-game">
      <h2>💬 Communication Game</h2>
      <div id="conversation-area"></div>
      <button onclick="window.route('dashboard')">Return to Dashboard</button>
    </section>
  `;
  startCommunicationGame();
}

function startCommunicationGame() {
  const area = document.getElementById('conversation-area');
  let prompts = [
    'Greet Daisy politely.',
    'Ask Winnie for help.',
    'Thank Andy for his support.'
  ];
  let current = 0;
  area.innerHTML = `<p>${prompts[current]}</p><input id='comm-input' type='text' placeholder='Type your response...' /><button id='comm-submit'>Send</button><div id='comm-feedback'></div>`;
  document.getElementById('comm-submit').onclick = () => {
    const val = document.getElementById('comm-input').value.trim().toLowerCase();
    let feedback = '';
    if (current === 0 && val.includes('hello')) feedback = 'Daisy: "Lovely greeting!"';
    else if (current === 1 && val.includes('help')) feedback = 'Winnie: "I am happy to help!"';
    else if (current === 2 && val.includes('thank')) feedback = 'Andy: "You are very welcome!"';
    else feedback = 'Try again!';
    document.getElementById('comm-feedback').innerText = feedback;
    if (feedback !== 'Try again!' && current < prompts.length - 1) {
      current++;
      setTimeout(() => {
        area.innerHTML = `<p>${prompts[current]}</p><input id='comm-input' type='text' placeholder='Type your response...' /><button id='comm-submit'>Send</button><div id='comm-feedback'></div>`;
        document.getElementById('comm-submit').onclick = arguments.callee;
      }, 1200);
    }
  };
}
