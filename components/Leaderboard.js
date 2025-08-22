// Leaderboard/Achievements Component
export function showLeaderboard(container) {
  container.innerHTML = `
    <section id="leaderboard" aria-label="Leaderboard & Achievements">
  <h2 class="text-2xl font-bold text-primary text-smooth">🏆 Achievements</h2>
      <ul id="achievements-list">
        <li>Completed Literacy Game</li>
        <li>Level Up in Numeracy</li>
      </ul>
  <h2 class="text-xl font-semibold text-primary text-smooth mt-4">Leaderboard</h2>
      <ol id="leaderboard-list">
        <li>Natalie - 1200 pts</li>
        <li>Daisy - 1100 pts</li>
        <li>Andy - 900 pts</li>
      </ol>
    </section>
  `;
}
