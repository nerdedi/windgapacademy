// Help & Support Component: FAQs, contact, live chat
export function showHelpSupport(container) {
  container.innerHTML = `
    <section id="help-support" aria-label="Help & Support">
      <h2>❓ Help & Support</h2>
      <details><summary>FAQs</summary>
        <ul>
          <li>How do I reset my password?</li>
          <li>How do I contact my educator?</li>
        </ul>
      </details>
      <button id="contact-support">Contact Support</button>
      <button id="live-chat">Live Chat</button>
      <div id="support-feedback" aria-live="polite"></div>
    </section>
  `;
  document.getElementById("contact-support").onclick = function() {
    document.getElementById("support-feedback").innerText = "Email sent to support!";
  };
  document.getElementById("live-chat").onclick = function() {
    document.getElementById("support-feedback").innerText = "Live chat started!";
  };
}
