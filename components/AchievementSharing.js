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
      <section id="achievements" class="card bg-white shadow-xl p-8 rounded-2xl animated-bg">
        <h2 id="achievements-heading" class="text-3xl font-bold text-primary mb-6">Achievements & Badges</h2>
        <div id="badge-wall" class="mb-4 animated-badge-wall"></div>
        <button id="share-achievement" class="btn-primary nav-btn" aria-label="Share Achievement">Share</button>
        <div id="leaderboard" class="mt-6"></div>
      </section>
    `;
    // Animate heading and button
    applyHeadingAnimation(document.getElementById('achievements-heading'));
    applyButtonAnimation(document.getElementById('share-achievement'));
    // Accessibility
    setAriaAttributes(document.getElementById('achievements'), { role: 'region', label: 'Achievements & Badges' });
}
