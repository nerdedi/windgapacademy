// Accessibility Features Module
// Pure function to calculate accessibility state
function getAccessibilityState({ largeFont, dyslexiaFont, easyRead, colourBlind }) {
  // Each accessibility option is independent; no hidden dependencies.
  return {
    fontSize: largeFont ? '1.3em' : '',
    dyslexiaFont,
    easyRead,
    colourBlind
  };
}
// Easy Read, Dyslexic font, Colour-blind modes, Large font, Audio input, Narration, Immersive reader

  function helpButton() {
    return `<button id="accessibility-help" aria-label="Help" title="Help">❓</button>`;
  }
  function privacyNotice() {
    return `<div id="privacy-notice" style="font-size:0.9em;color:#555;margin:8px 0;">All accessibility settings are private and only used for supporting your learning experience.</div>`;
  }
    container.innerHTML = `
      <section id="accessibility-options" class="au-section" aria-label="Accessibility Options">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <h2>Accessibility Options</h2>
          ${helpButton()}
        </div>
        <div class="accessibility-framework" aria-label="Accessibility Framework">
          <h3>Universal Design & Emotional Wellbeing</h3>
          <ul>
            <li>Accessibility features are based on universal design for learning (Module 5).</li>
            <li>Supports classroom strategies for students with learning difficulties.</li>
            <li>Options for emotional wellbeing and resilience (Module 6).</li>
          </ul>
          <p>All accessibility options are aligned to the six-module framework for supporting diverse learners.</p>
        </div>
        <div class="accessibility-toggles" aria-label="Accessibility Toggles">
          <label><input type="checkbox" id="large-font-toggle" aria-label="Large Font" /> Large Font</label>
          <label><input type="checkbox" id="dyslexia-font-toggle" aria-label="Dyslexic Font" /> Dyslexic Font</label>
          <label><input type="checkbox" id="easy-read-toggle" aria-label="Easy Read" /> Easy Read</label>
          <label><input type="checkbox" id="colour-blind-toggle" aria-label="Colour-blind Mode" /> Colour-blind Mode</label>
        </div>
        <div id="accessibility-feedback" style="margin-top:12px;" aria-live="polite"></div>
  // Interactive logic
  setTimeout(function() {
    var largeFontToggle = container.querySelector('#large-font-toggle');
    var dyslexiaFontToggle = container.querySelector('#dyslexia-font-toggle');
    var easyReadToggle = container.querySelector('#easy-read-toggle');
    var colourBlindToggle = container.querySelector('#colour-blind-toggle');
    var feedbackDiv = container.querySelector('#accessibility-feedback');
    function updateAccessibility() {
      document.body.style.fontSize = largeFontToggle.checked ? '1.3em' : '';
      document.body.classList.toggle('dyslexia-font', dyslexiaFontToggle.checked);
      document.body.classList.toggle('easy-read', easyReadToggle.checked);
      document.body.classList.toggle('colour-blind', colourBlindToggle.checked);
      feedbackDiv.textContent = 'Accessibility settings updated.';
      setTimeout(function() { feedbackDiv.textContent = ''; }, 2000);
      if (userId) {
        var prefs = {
          largeFont: largeFontToggle.checked,
          dyslexiaFont: dyslexiaFontToggle.checked,
          easyRead: easyReadToggle.checked,
          colourBlind: colourBlindToggle.checked
        };
        import('../firebase.js').then(function(mod) {
          mod.saveLessonPlan('accessibility', userId, JSON.stringify(prefs));
        });
      }
    }
    [largeFontToggle, dyslexiaFontToggle, easyReadToggle, colourBlindToggle].forEach(function(toggle) {
      if (toggle) toggle.addEventListener('change', updateAccessibility);
    });
    var helpBtn = container.querySelector('#accessibility-help');
    if (helpBtn) {
      helpBtn.onclick = function() {
        alert('Accessibility options support your learning experience. All actions are private and educator-reviewed.');
      };
    }
  }, 0);
      <button id="audio-input-btn" aria-label="Audio Input">Audio Input</button>
      <button id="narrate-btn" aria-label="Narrate">Narrate</button>
      <button id="immersive-reader-btn" aria-label="Immersive Reader">Immersive Reader</button>
      <button id="return-dashboard" aria-label="Return to Dashboard">Return to Dashboard</button>
      ${privacyNotice()}
      <div class="lesson-plan-au">
        <h3>Lesson Plan: Accessibility (Australian Curriculum)</h3>
        <p>Objective: Support diverse learners in Australian schools with accessible digital tools.</p>
        <ul>
          <li>Introduce accessibility options and their benefits.</li>
          <li>Demonstrate features using Australian examples and spelling.</li>
          <li>Discuss inclusion in the classroom and online learning.</li>
        </ul>
        <p>Educator Notes: Use Easy Read and narration for students with additional needs. Refer to ACARA guidelines for inclusion.</p>
      </div>
      <div id="accessibility-prompt" style="margin-top:12px;" aria-live="polite"></div>
    </section>
  `;
  const state = { largeFont: false, dyslexiaFont: false, easyRead: false, colourBlind: false };
  function updateAccessibility() {
    // Update DOM based on independent state values
    const newState = getAccessibilityState(state);
    document.body.style.fontSize = newState.fontSize;
    document.body.classList.toggle('dyslexia-font', newState.dyslexiaFont);
    document.body.classList.toggle('easy-read', newState.easyRead);
    document.body.classList.toggle('colour-blind', newState.colourBlind);
    // Log accessibility changes for educator review
    if (window.logEducatorAction) window.logEducatorAction({ type: 'accessibilityChange', state: newState });
  }
  // Keyboard navigation for all toggles and buttons
  Array.from(container.querySelectorAll('button,input')).forEach(el => { el.tabIndex = 0; });
  // Help/info button
  document.getElementById('accessibility-help').onclick = () => {
    alert('Accessibility options support diverse learners. All settings are private and educator-reviewed.');
  };
  document.getElementById('large-font-toggle').onchange = e => { state.largeFont = e.target.checked; updateAccessibility(); playSound('assets/sounds/font-change.mp3'); animateEffect('font-grow'); };
  document.getElementById('dyslexia-font-toggle').onchange = e => { state.dyslexiaFont = e.target.checked; updateAccessibility(); playSound('assets/sounds/dyslexia.mp3'); animateEffect('font-wobble'); };
  document.getElementById('easy-read-toggle').onchange = e => { state.easyRead = e.target.checked; updateAccessibility(); playSound('assets/sounds/easy-read.mp3'); animateEffect('easy-read-glow'); };
  document.getElementById('colour-blind-toggle').onchange = e => { state.colourBlind = e.target.checked; updateAccessibility(); playSound('assets/sounds/colour-blind.mp3'); animateEffect('colour-blind-flash'); };
  document.getElementById('audio-input-btn').onclick = () => { startAudioInput(); playSound('assets/sounds/audio-input.mp3'); };
  document.getElementById('narrate-btn').onclick = () => { window.narrate('Accessibility options are now active.'); playSound('assets/sounds/narrate.mp3'); };
  document.getElementById('immersive-reader-btn').onclick = () => { startImmersiveReader(); playSound('assets/sounds/immersive-reader.mp3'); };
  document.getElementById('return-dashboard').onclick = () => window.route('dashboard');
  updateAccessibility();
  // Rotating educational prompt
  const prompts = [
    'Tip: Try Easy Read for simplified text.',
    'Tip: Dyslexic font can help with reading comfort.',
    'Tip: All accessibility settings are private and educator-reviewed.',
    'Tip: Use Immersive Reader for enhanced support.'
  ];
  let promptIndex = 0;
  function showPrompt() {
    document.getElementById('accessibility-prompt').textContent = prompts[promptIndex % prompts.length];
    promptIndex++;
    setTimeout(showPrompt, 7000);
  }
  showPrompt();
function playSound(src) {
  const audio = new Audio(src);
  audio.play();
}

function animateEffect(effect) {
  // Add CSS animation classes to body or relevant element
  document.body.classList.add(effect);
  setTimeout(() => document.body.classList.remove(effect), 1000);
}

function toggleColourBlindMode() {
  document.body.classList.toggle('colour-blind');
}

function startAudioInput() {
  alert('Audio input started. Speak your answer.');
  // Web Speech API logic can be added here
}

function startImmersiveReader() {
  alert('Immersive Reader activated.');
  // Integration with Microsoft Immersive Reader or similar can be added here
}
