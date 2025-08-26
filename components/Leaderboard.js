// Leaderboard/Achievements Component
export function showLeaderboard(container) {
  container.innerHTML = `
      <div class="achievements-bg" style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:-1;background:url('/assets/backgrounds/achievements-bg.svg') center/cover no-repeat;"></div>
      <section id="leaderboard" class="card shadow-xl p-8 rounded-2xl mx-auto my-16 max-w-2xl relative bg-white/80 backdrop-blur-lg">
        <h2 id="leaderboard-heading" class="text-3xl font-bold text-primary mb-6">🏆 Leaderboard</h2>
        <button id="refresh-leaderboard" class="btn-primary nav-btn">Refresh</button>
        <div id="leaderboard-list"></div>
      </section>
    `;
    // Animate heading and button
    applyHeadingAnimation(document.getElementById('leaderboard-heading'));
    applyButtonAnimation(document.getElementById('refresh-leaderboard'));
    // Accessibility
    setAriaAttributes(document.getElementById('leaderboard'), { role: 'region', label: 'Leaderboard' });
}
