// Parent/educator feedback forms
export function showFeedbackForm(container) {
  container.innerHTML = `
    <section id='feedback-form' aria-label='Feedback Form'>
      <h2>📝 Feedback</h2>
      <form id='feedback-form-el'>
        <textarea id='feedback-input' placeholder='Your feedback...' aria-label='Feedback'></textarea>
        <button type='submit'>Submit</button>
      </form>
      <div id='feedback-status' aria-live='polite'></div>
    </section>
  `;
  document.getElementById("feedback-form-el").onsubmit = function (e) {
    e.preventDefault();
    document.getElementById("feedback-status").innerText = "Feedback submitted!";
  };
}
