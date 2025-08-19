// Daily/weekly challenges and streak rewards
export function showChallenges(container, userData = {}) {
  container.innerHTML = `
    <section id="challenges" aria-label="Challenges">
      <h2>🎯 Daily & Weekly Challenges</h2>
      <ul>
        <li>Complete a literacy game today <span>+10 pts</span></li>
        <li>Log in 5 days in a row <span>Streak!</span></li>
      </ul>
      <div id="challenge-feedback" aria-live="polite"></div>
    </section>
  `;
}
