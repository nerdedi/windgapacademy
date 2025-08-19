// Leaderboard/Achievements Component
export function showLeaderboard(container, userData = {}) {
  container.innerHTML = `
    <section id="leaderboard" aria-label="Leaderboard & Achievements">
      <h2>🏆 Achievements</h2>
      <ul id="achievements-list">
        <li>Completed Literacy Game</li>
        <li>Level Up in Numeracy</li>
      </ul>
      <h2>Leaderboard</h2>
      <ol id="leaderboard-list">
        <li>Natalie - 1200 pts</li>
        <li>Daisy - 1100 pts</li>
        <li>Andy - 900 pts</li>
      </ol>
    </section>
  `;
}
