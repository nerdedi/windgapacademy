// Custom badges for achievements and participation
export function showBadges(container) {
  container.innerHTML = `
    <section id="badges" aria-label="Badges">
  <h2 class="text-2xl font-bold text-primary text-smooth">🏅 Your Badges</h2>
  <div class="achievement-badge bg-yellow-100 border border-yellow-400 rounded px-3 py-2 mb-2 text-yellow-800 font-semibold card smooth-shadow">Literacy Star</div>
  <div class="achievement-badge bg-blue-100 border border-blue-400 rounded px-3 py-2 mb-2 text-blue-800 font-semibold">Numeracy Pro</div>
  <div class="achievement-badge bg-green-100 border border-green-400 rounded px-3 py-2 mb-2 text-green-800 font-semibold">Participation</div>
    </section>
  `;
}
