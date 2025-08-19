// User onboarding flow
export function showOnboarding(container) {
  container.innerHTML = `
    <section id='onboarding' aria-label='Onboarding'>
      <h2>👋 Welcome to Windgap Academy!</h2>
      <p>Let's take a quick tour of the platform.</p>
      <button id='start-tour'>Start Tour</button>
    </section>
  `;
  document.getElementById('start-tour').onclick = function() {
    alert('Tour started!');
  };
}
