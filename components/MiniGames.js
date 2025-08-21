// Mini-games for skill reinforcement
export function showMiniGames(container) {
  container.innerHTML = `
    <section id="mini-games" aria-label="Mini Games">
      <h2>🎮 Mini Games</h2>
      <button id="play-memory">Play Memory Game</button>
      <button id="play-quiz">Play Quick Quiz</button>
      <div id="mini-game-feedback" aria-live="polite"></div>
    </section>
  `;
  document.getElementById("play-memory").onclick = function() {
    document.getElementById("mini-game-feedback").innerText = "Memory game coming soon!";
  };
  document.getElementById("play-quiz").onclick = function() {
    document.getElementById("mini-game-feedback").innerText = "Quiz game coming soon!";
  };
}
