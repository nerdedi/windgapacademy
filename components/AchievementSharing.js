import { applyButtonAnimation, applyHeadingAnimation, setAriaAttributes } from '../utils/uiUtils.js';
// Achievement sharing (export badges/certificates)
export function showAchievementSharing(container) {
  container.innerHTML = `
    <section id='achievement-sharing' aria-label='Achievement Sharing'>
      <h2>🎉 Share Your Achievements</h2>
      <button id='export-badge'>Export Badge</button>
      <button id='export-certificate'>Export Certificate</button>
      <div id='achievement-status' aria-live='polite'></div>
    </section>
  `;
    container.innerHTML = `
      <div class="achievements-bg" style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:-1;background:url('/assets/backgrounds/achievements-bg.svg') center/cover no-repeat;"></div>
      <section id="achievements" class="card shadow-xl p-8 rounded-2xl mx-auto my-16 max-w-3xl relative bg-white/80 backdrop-blur-lg grid grid-cols-4 gap-6">
        <div class="col-span-3">
          <h2 id="achievements-heading" class="text-3xl font-bold text-primary mb-6">Achievements & Badges</h2>
          <div id="trophy-case" class="trophy-case bg-white rounded shadow p-4 mb-4">Trophy Case</div>
          <div id="badge-wall" class="badge-wall bg-white rounded shadow p-4 mb-4">Badge Wall</div>
        </div>
        <aside class="col-span-1 flex flex-col gap-4">
          <div id="leaderboard" class="leaderboard bg-white rounded shadow p-4">Leaderboard</div>
          <div id="shareable-cards" class="shareable-cards bg-white rounded shadow p-4 mt-4">Shareable Achievement Cards</div>
        </aside>
        <div class="col-span-4 flex gap-4 mt-6">
          <button id="share-achievement" class="btn-primary nav-btn">Share</button>
        </div>
      </section>
    `;
    // Animate heading and button
    applyHeadingAnimation(document.getElementById('achievements-heading'));
    applyButtonAnimation(document.getElementById('share-achievement'));
    // Accessibility
    setAriaAttributes(document.getElementById('achievements'), { role: 'region', label: 'Achievements & Badges' });
    // Animate heading and button
    applyHeadingAnimation(document.getElementById('achievements-heading'));
    applyButtonAnimation(document.getElementById('share-achievement'));
    // Accessibility
    setAriaAttributes(document.getElementById('achievements'), { role: 'region', label: 'Achievements & Badges' });
}
