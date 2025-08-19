// Enhanced error handling and recovery
export function showErrorRecovery(container, errorMsg) {
  container.innerHTML = `
    <section id="error-recovery" aria-label="Error Recovery">
      <h2>⚠️ Error</h2>
      <p>${errorMsg}</p>
      <button id="retry-btn">Retry</button>
      <button id="contact-btn">Contact Support</button>
    </section>
  `;
  document.getElementById('retry-btn').onclick = function() {
    location.reload();
  };
  document.getElementById('contact-btn').onclick = function() {
    window.open('mailto:info@windgapacademy.edu.au');
  };
}
