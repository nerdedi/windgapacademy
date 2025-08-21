// Mood tracking and wellbeing
export function showMoodTracking(container) {
  container.innerHTML = `
    <section id='mood-tracking' aria-label='Mood Tracking'>
      <h2>😊 Mood Tracking</h2>
      <button id='log-mood'>Log Mood</button>
      <div id='mood-feedback' aria-live='polite'></div>
    </section>
  `;
  document.getElementById("log-mood").onclick = function() {
    document.getElementById("mood-feedback").innerText = "Mood logged!";
  };
}
