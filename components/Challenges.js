// Daily/weekly challenges and streak rewards
export function showChallenges(container) {
  container.innerHTML = `
    <section id="challenges" aria-label="Challenges">
  <h2 class="text-2xl font-bold text-primary text-smooth">🎯 Daily & Weekly Challenges</h2>
      <ul>
        <li>Complete a literacy game today <span>+10 pts</span></li>
        <li>Log in 5 days in a row <span>Streak!</span></li>
      </ul>
  <div id="challenge-feedback" class="mt-3 card smooth-shadow" aria-live="polite"></div>
    </section>
  `;
}
