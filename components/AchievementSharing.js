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
  document.getElementById("export-badge").onclick = function () {
    document.getElementById("achievement-status").innerText = "Badge exported!";
  };
  document.getElementById("export-certificate").onclick = function () {
    document.getElementById("achievement-status").innerText = "Certificate exported!";
  };
}
