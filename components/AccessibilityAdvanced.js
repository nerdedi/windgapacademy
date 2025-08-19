// Advanced accessibility: text-to-speech, color/font settings, keyboard shortcuts
export function showAccessibilityAdvanced(container) {
  container.innerHTML = `
    <section id="accessibility-advanced" aria-label="Advanced Accessibility">
      <h2>🦻 Advanced Accessibility</h2>
      <button id="tts-btn">Text to Speech</button>
      <button id="color-btn">Change Color Scheme</button>
      <button id="font-btn">Change Font Size</button>
      <button id="shortcut-btn">Show Keyboard Shortcuts</button>
      <div id="accessibility-feedback" aria-live="polite"></div>
    </section>
  `;
  document.getElementById('tts-btn').onclick = function() {
    window.narrate('This is a sample text for text-to-speech.');
    document.getElementById('accessibility-feedback').innerText = 'Text-to-speech activated.';
  };
  document.getElementById('color-btn').onclick = function() {
    window.setTheme('high-contrast');
    document.getElementById('accessibility-feedback').innerText = 'High contrast theme applied.';
  };
  document.getElementById('font-btn').onclick = function() {
    document.body.style.fontSize = 'x-large';
    document.getElementById('accessibility-feedback').innerText = 'Font size increased.';
  };
  document.getElementById('shortcut-btn').onclick = function() {
    document.getElementById('accessibility-feedback').innerText = 'Shortcuts: Tab to navigate, Enter to select.';
  };
}
