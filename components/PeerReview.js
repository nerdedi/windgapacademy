// Peer review and rating system
export function showPeerReview(container) {
  container.innerHTML = `
    <section id='peer-review' aria-label='Peer Review'>
      <h2>⭐ Peer Review</h2>
      <button id='rate-resource'>Rate Resource</button>
      <div id='review-feedback' aria-live='polite'></div>
    </section>
  `;
  document.getElementById('rate-resource').onclick = function() {
    document.getElementById('review-feedback').innerText = 'Resource rated!';
  };
}
