// Custom badges for achievements and participation
export function showBadges(container) {
  container.innerHTML = `
    <section id="badges" aria-label="Badges">
      <h2>🏅 Your Badges</h2>
      <div class="achievement-badge">Literacy Star</div>
      <div class="achievement-badge">Numeracy Pro</div>
      <div class="achievement-badge">Participation</div>
    </section>
  `;
}
