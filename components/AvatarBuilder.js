/**
 * Avatar Builder Module
 * @module AvatarBuilder
 */
/**
 * Calculates avatar state from selected features.
 * @param {Object} features - Avatar features
 * @returns {Object} Avatar state
 */
function getAvatarState({ skin, hair, outfit, pronoun, accessory, wheelchair, wheelchairColour, wheelchairSize }) {
  // Avatar properties are independent; changing one does not require changing another.
  return { skin, hair, outfit, pronoun, accessory, wheelchair, wheelchairColour, wheelchairSize };
}
// ...existing code...

export function showAvatarBuilder(container, userData = {}) {
  // Modular UI templates
  function inputRow(label, inputHtml) {
    return `<div class="input-row"><label>${label} ${inputHtml}</label></div>`;
  }
  function helpButton() {
    return `<button id="avatar-help" aria-label="Help" title="Help">❓</button>`;
  }
  function privacyNotice() {
    return `<div id="privacy-notice" style="font-size:0.9em;color:#555;margin:8px 0;">Your avatar data is private and only used for educational purposes. <button id="export-avatar" aria-label="Export Avatar" title="Export Avatar">Export</button></div>`;
  }
  // Responsive and theme switching
  let themeSwitcher = `<select id="theme-switcher" aria-label="Theme">
    <option value="default">Default</option>
    <option value="dark">Dark</option>
    <option value="high-contrast">High Contrast</option>
  </select>`;
  container.innerHTML = `
    <section id="avatar-builder" class="au-section" aria-label="Avatar Builder" role="form">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h2>Avatar Builder</h2>
        ${helpButton()}
        ${themeSwitcher}
      </div>
      <div id="avatar-preview" aria-live="polite"></div>
      ${inputRow('Skin Tone:', '<input type="color" id="skin-tone" value="#fbeee6" aria-label="Skin Tone" />')}
      ${inputRow('Hair Colour:', '<input type="color" id="hair-colour" value="#333333" aria-label="Hair Colour" />')}
      ${inputRow('Outfit:', `<select id="outfit-select" aria-label="Outfit">
        <option value="casual">Casual</option>
        <option value="formal">Formal</option>
        <option value="seasonal">Seasonal</option>
        <option value="event">Event</option>
      </select>`)}
      ${inputRow('Pronouns:', `<select id="pronoun-select" aria-label="Pronouns">
        <option value="she/her">She/Her</option>
        <option value="he/him">He/Him</option>
        <option value="they/them">They/Them</option>
      </select>`)}
      <fieldset>
        <legend>Disability Representation & Assistive Technology</legend>
        ${inputRow('Hearing Device', '<input type="checkbox" id="hearing-device" aria-label="Hearing Device" />')}
        ${inputRow('Prosthetic Limb', '<input type="checkbox" id="prosthetic-limb" aria-label="Prosthetic Limb" />')}
        ${inputRow('Wheelchair', '<input type="checkbox" id="wheelchair" aria-label="Wheelchair" />')}
        ${inputRow('Wheelchair Colour', '<input type="color" id="wheelchair-colour" value="#1976d2" aria-label="Wheelchair Colour" />')}
        ${inputRow('Wheelchair Size', '<input type="range" id="wheelchair-size" min="50" max="150" value="100" aria-label="Wheelchair Size" />')}
        ${inputRow('Crutches', '<input type="checkbox" id="crutches" aria-label="Crutches" />')}
        ${inputRow('White Cane', '<input type="checkbox" id="white-cane" aria-label="White Cane" />')}
        ${inputRow('Low Vision', '<input type="checkbox" id="low-vision" aria-label="Low Vision" />')}
        ${inputRow('Motor Tics', '<input type="checkbox" id="motor-tics" aria-label="Motor Tics" />')}
        ${inputRow('Non-human Avatar', '<input type="checkbox" id="non-human-avatar" aria-label="Non-human Avatar" />')}
      </fieldset>
      <fieldset>
        <legend>Peripherals & Interface</legend>
        ${inputRow('Accessory:', `<select id="accessory-select" aria-label="Accessory">
          <option value="none">None</option>
          <option value="glasses">Glasses</option>
          <option value="hat">Hat</option>
          <option value="bag">Bag</option>
          <option value="rainbow-tshirt">Rainbow T-shirt (Autism)</option>
          <option value="infinity-symbol">Infinity Symbol</option>
        </select>`)}
        ${inputRow('Social Energy Bubble', '<input type="checkbox" id="social-bubble" aria-label="Social Energy Bubble" />')}
      </fieldset>
      <div style="margin:8px 0;">
        <button id="randomize-avatar" aria-label="Randomize Avatar" title="Randomize Avatar">🎲 Randomize</button>
        <button id="undo-avatar" aria-label="Undo" title="Undo">↩️ Undo</button>
        <button id="redo-avatar" aria-label="Redo" title="Redo">↪️ Redo</button>
        <button id="save-preset" aria-label="Save Preset" title="Save Preset">💾 Save Preset</button>
        <button id="load-preset" aria-label="Load Preset" title="Load Preset">📂 Load Preset</button>
        <button id="reset-avatar" aria-label="Reset Avatar" title="Reset Avatar">🔄 Reset</button>
      </div>
      <button id="save-avatar" aria-label="Save Avatar">Save Avatar</button>
      <button onclick="window.route('dashboard')">Return to Dashboard</button>
      ${privacyNotice()}
      <div class="lesson-plan-au">
        <h3>Lesson Plan: Inclusive Avatar Builder (Australian Curriculum, NSW Inclusive Education)</h3>
        <p>Objective: Support identity, diversity, and inclusion for all students, including those with disability and accessibility needs.</p>
        <ul>
          <li>Enable flexible customisation of body parts and assistive technology.</li>
          <li>Prioritise human avatars, but offer non-human options to reduce stigma.</li>
          <li>Allow simulation of disability-related behaviours only by user preference.</li>
          <li>Provide high-quality, realistic assistive technology and peripherals.</li>
          <li>Distribute disability features across the interface, not in a separate category.</li>
          <li>Make reasonable adjustments and allow easy toggling of features.</li>
        </ul>
        <p>Educator Notes: Encourage respectful representation, consult with students and families, and use evidence-based inclusive practices. Ensure every student is known, valued, and cared for. Reference NSW DoE and ACARA guidelines.</p>
      </div>
      <div id="avatar-description" style="margin-top:12px;" aria-live="polite"></div>
      <div id="avatar-prompt" style="margin-top:12px;"></div>
      <div id="avatar-summary" style="margin-top:12px;">
        <button id="toggle-summary" aria-label="Show Summary">Show Summary</button>
        <div id="summary-panel" style="display:none;"></div>
      </div>
    </section>
  `;
  // Keyboard navigation for all controls
  Array.from(container.querySelectorAll('input,select,button')).forEach(el => {
    el.tabIndex = 0;
  });
  // Tooltips for each customization option
  container.querySelectorAll('label,select,button').forEach(el => {
    if (el.title === undefined || el.title === "") {
      el.title = el.getAttribute('aria-label') || el.textContent;
    }
  });
  // Responsive theme switching
  document.getElementById('theme-switcher').onchange = e => {
    document.body.className = e.target.value;
  };
  // Help/info button
  document.getElementById('avatar-help').onclick = () => {
    alert('Each avatar feature supports identity, accessibility, and self-expression. Hover over options for more info.');
  };
  // Privacy notice export
  document.getElementById('export-avatar').onclick = exportAvatar;
  // Collapsible summary
  document.getElementById('toggle-summary').onclick = () => {
    const panel = document.getElementById('summary-panel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    if (panel.style.display === 'block') panel.innerHTML = getAvatarSummary();
  };
  // Event delegation for input changes
  container.addEventListener('input', e => {
    if (['skin-tone','hair-colour','wheelchair-colour','wheelchair-size'].includes(e.target.id)) {
      debounce(renderAvatar, 100)();
    }
  });
  container.addEventListener('change', e => {
    if (['outfit-select','pronoun-select','accessory-select','wheelchair'].includes(e.target.id)) {
      renderAvatar();
    }
  });
  // Button events
  document.getElementById('randomize-avatar').onclick = randomizeAvatar;
  document.getElementById('undo-avatar').onclick = undoAvatar;
  document.getElementById('redo-avatar').onclick = redoAvatar;
  document.getElementById('save-preset').onclick = () => savePresetPrompt();
  document.getElementById('load-preset').onclick = () => loadPresetPrompt();
  document.getElementById('reset-avatar').onclick = resetAvatar;
  document.getElementById('save-avatar').onclick = saveAvatar;
  renderAvatar();
}

let avatarHistory = [];
let avatarHistoryIndex = -1;
let avatarPresets = JSON.parse(localStorage.getItem('avatarPresets') || '[]');
let educatorPrompts = [
  'Why did you choose this style?',
  'How does this accessory help you?',
  'What does your avatar say about you?',
  'Would you like to try a new feature?'
];
let promptIndex = 0;

function renderAvatar() {
  // Render avatar based on independent state properties
  const preview = document.getElementById('avatar-preview');
  const state = getAvatarState({
    skin: document.getElementById('skin-tone').value,
    hair: document.getElementById('hair-colour').value,
    outfit: document.getElementById('outfit-select').value,
    pronoun: document.getElementById('pronoun-select').value,
    accessory: document.getElementById('accessory-select').value,
    wheelchair: document.getElementById('wheelchair').checked,
    wheelchairColour: document.getElementById('wheelchair-colour').value,
    wheelchairSize: document.getElementById('wheelchair-size').value
  });
  // Layered SVG avatar for accessibility and scalability
  let bodyType = 'default';
  let pose = 'standing';
  let mirror = false;
  let layers = [];
  layers.push(`<circle cx="60" cy="60" r="55" fill="${state.skin}" />`);
  layers.push(`<ellipse cx="60" cy="40" rx="30" ry="25" fill="${state.hair}" />`);
  if (state.accessory !== 'none') layers.push(`<text x="60" y="70" text-anchor="middle" font-size="14" fill="#1976d2">${state.accessory}</text>`);
  if (state.wheelchair) layers.push(`<rect x="30" y="100" width="60" height="15" rx="7" fill="${state.wheelchairColour}" />`);
  // Facial expressions
  layers.push(`<circle cx="60" cy="60" r="5" fill="#fff" />`); // face center
  // Body type and pose
  if (bodyType === 'default' && pose === 'standing') {
    layers.push(`<rect x="50" y="80" width="20" height="30" fill="${state.outfit === 'casual' ? '#8bc34a' : '#607d8b'}" />`);
  }
  // Mirror mode
  let transform = mirror ? 'scale(-1,1) translate(-120,0)' : '';
  let svg = `<svg width="240" height="240" viewBox="0 0 120 120" aria-label="Avatar Preview" role="img" style="max-width:100%;height:auto;${mirror ? 'transform:scaleX(-1);' : ''}">
    <g transform="${transform}">
      ${layers.join('\n      ')}
      <text x="60" y="110" text-anchor="middle" font-size="16" fill="#333">${state.pronoun}</text>
      <text x="60" y="90" text-anchor="middle" font-size="14" fill="#333">${state.outfit}</text>
    </g>
  </svg>`;
  preview.innerHTML = svg + `<div style='margin-top:8px;'>
    <button id='zoom-avatar'>Zoom</button>
    <button id='rotate-avatar'>Rotate</button>
    <button id='animate-avatar'>Animate</button>
    <button id='mirror-avatar'>Mirror</button>
    <button id='drag-accessory'>Drag Accessory</button>
    <button id='body-type'>Body Type</button>
    <button id='pose'>Pose</button>
    <button id='preview-action'>Preview Action</button>
    <button id='mute-sound'>Mute</button>
    <input id='resize-preview' type='range' min='120' max='480' value='240' aria-label='Resize Preview' />
  </div>`;
  // Accessibility: text description and ARIA live region
  let desc = `Skin: ${state.skin}, Hair: ${state.hair}, Outfit: ${state.outfit}, Pronoun: ${state.pronoun}`;
  if (state.accessory !== 'none') desc += `, Accessory: ${state.accessory}`;
  if (state.wheelchair) desc += `, Wheelchair: ${state.wheelchairColour}, Size: ${state.wheelchairSize}`;
  preview.setAttribute('aria-live', 'polite');
  preview.setAttribute('alt', desc);
  document.getElementById('avatar-description').textContent = desc;
  // Educational prompt (rotating)
  document.getElementById('avatar-prompt').textContent = educatorPrompts[promptIndex % educatorPrompts.length];
  promptIndex++;
  // History for undo/redo
  avatarHistory = avatarHistory.slice(0, avatarHistoryIndex + 1);
  avatarHistory.push(JSON.stringify(state));
  avatarHistoryIndex++;
  // Collapsible summary
  document.getElementById('summary-panel').innerHTML = getAvatarSummary();
  // Interactivity controls
  document.getElementById('zoom-avatar').onclick = () => preview.style.transform = 'scale(1.5)';
  document.getElementById('rotate-avatar').onclick = () => preview.style.transform = 'rotate(20deg)';
  document.getElementById('mirror-avatar').onclick = () => {
    mirror = !mirror;
    renderAvatar();
  };
  document.getElementById('drag-accessory').onclick = () => {
    // Drag-and-drop accessory logic (simplified)
    alert('Drag accessory to reposition (feature coming soon).');
  };
  document.getElementById('body-type').onclick = () => {
    bodyType = bodyType === 'default' ? 'slim' : 'default';
    renderAvatar();
  };
  document.getElementById('pose').onclick = () => {
    pose = pose === 'standing' ? 'sitting' : 'standing';
    renderAvatar();
  };
  document.getElementById('preview-action').onclick = () => animateAvatarAction();
  document.getElementById('mute-sound').onclick = () => muteSound = !muteSound;
  document.getElementById('resize-preview').oninput = e => {
    preview.querySelector('svg').setAttribute('width', e.target.value);
    preview.querySelector('svg').setAttribute('height', e.target.value);
  };
  // Keyboard accessibility
  Array.from(preview.querySelectorAll('button,input')).forEach(el => {
    el.tabIndex = 0;
  });
  // Animation status ARIA live
  preview.setAttribute('aria-live', 'polite');
  // Sound effect
  if (!window.muteSound) playSound('assets/sounds/avatar-change.mp3');
}

let muteSound = false;

function animateAvatarAction() {
  // Example: waving animation using requestAnimationFrame
  const preview = document.getElementById('avatar-preview');
  const svg = preview.querySelector('svg');
  if (!svg) return;
  let frame = 0;
  function wave() {
    frame++;
    svg.style.transform = `rotate(${Math.sin(frame/5)*10}deg)`;
    if (frame < 30) requestAnimationFrame(wave);
    else svg.style.transform = '';
  }
  wave();
  // Sound effect for action
  if (!muteSound) playSound('assets/sounds/avatar-action.mp3');
  // ARIA live update
  preview.setAttribute('aria-live', 'assertive');
  preview.setAttribute('alt', 'Avatar is waving');
}

function getAvatarSummary() {
  const state = getAvatarState({
    skin: document.getElementById('skin-tone').value,
    hair: document.getElementById('hair-colour').value,
    outfit: document.getElementById('outfit-select').value,
    pronoun: document.getElementById('pronoun-select').value,
    accessory: document.getElementById('accessory-select').value,
    wheelchair: document.getElementById('wheelchair').checked,
    wheelchairColour: document.getElementById('wheelchair-colour').value,
    wheelchairSize: document.getElementById('wheelchair-size').value
  });
  return `<ul>
    <li>Skin: ${state.skin}</li>
    <li>Hair: ${state.hair}</li>
    <li>Outfit: ${state.outfit}</li>
    <li>Pronoun: ${state.pronoun}</li>
    <li>Accessory: ${state.accessory}</li>
    <li>Wheelchair: ${state.wheelchair ? 'Yes' : 'No'} (${state.wheelchairColour}, Size: ${state.wheelchairSize})</li>
  </ul>`;
}

function randomizeAvatar() {
  document.getElementById('skin-tone').value = getRandomColor();
  document.getElementById('hair-colour').value = getRandomColor();
  document.getElementById('outfit-select').selectedIndex = Math.floor(Math.random() * document.getElementById('outfit-select').options.length);
  document.getElementById('pronoun-select').selectedIndex = Math.floor(Math.random() * document.getElementById('pronoun-select').options.length);
  document.getElementById('accessory-select').selectedIndex = Math.floor(Math.random() * document.getElementById('accessory-select').options.length);
  document.getElementById('wheelchair').checked = Math.random() > 0.5;
  document.getElementById('wheelchair-colour').value = getRandomColor();
  document.getElementById('wheelchair-size').value = Math.floor(Math.random() * 101) + 50;
  renderAvatar();
}

function getRandomColor() {
  return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
}

function undoAvatar() {
  if (avatarHistoryIndex > 0) {
    avatarHistoryIndex--;
    loadAvatarState(JSON.parse(avatarHistory[avatarHistoryIndex]));
  }
}

function redoAvatar() {
  if (avatarHistoryIndex < avatarHistory.length - 1) {
    avatarHistoryIndex++;
    loadAvatarState(JSON.parse(avatarHistory[avatarHistoryIndex]));
  }
}

function loadAvatarState(state) {
  document.getElementById('skin-tone').value = state.skin;
  document.getElementById('hair-colour').value = state.hair;
  document.getElementById('outfit-select').value = state.outfit;
  document.getElementById('pronoun-select').value = state.pronoun;
  document.getElementById('accessory-select').value = state.accessory;
  document.getElementById('wheelchair').checked = state.wheelchair;
  document.getElementById('wheelchair-colour').value = state.wheelchairColour;
  document.getElementById('wheelchair-size').value = state.wheelchairSize;
  renderAvatar();
}

function savePresetPrompt() {
  const name = prompt('Name your preset:');
  if (!name) return;
  const state = getAvatarState({
    skin: document.getElementById('skin-tone').value,
    hair: document.getElementById('hair-colour').value,
    outfit: document.getElementById('outfit-select').value,
    pronoun: document.getElementById('pronoun-select').value,
    accessory: document.getElementById('accessory-select').value,
    wheelchair: document.getElementById('wheelchair').checked,
    wheelchairColour: document.getElementById('wheelchair-colour').value,
    wheelchairSize: document.getElementById('wheelchair-size').value
  });
  avatarPresets.push({ name, state });
  localStorage.setItem('avatarPresets', JSON.stringify(avatarPresets));
  alert('Preset saved!');
}

function loadPresetPrompt() {
  if (avatarPresets.length === 0) return alert('No presets found.');
  const names = avatarPresets.map((p, i) => `${i + 1}: ${p.name}`).join('\n');
  const idx = parseInt(prompt(`Choose preset:\n${names}`), 10) - 1;
  if (isNaN(idx) || idx < 0 || idx >= avatarPresets.length) return;
  if (confirm('Load this preset?')) {
    loadAvatarState(avatarPresets[idx].state);
    alert('Preset loaded!');
  }
}

function resetAvatar() {
  if (!confirm('Reset avatar to default?')) return;
  document.getElementById('skin-tone').value = '#fbeee6';
  document.getElementById('hair-colour').value = '#333333';
  document.getElementById('outfit-select').value = 'casual';
  document.getElementById('pronoun-select').value = 'they/them';
  document.getElementById('accessory-select').value = 'none';
  document.getElementById('wheelchair').checked = false;
  document.getElementById('wheelchair-colour').value = '#1976d2';
  document.getElementById('wheelchair-size').value = 100;
  renderAvatar();
}

function saveAvatar() {
  const state = getAvatarState({
    skin: document.getElementById('skin-tone').value,
    hair: document.getElementById('hair-colour').value,
    outfit: document.getElementById('outfit-select').value,
    pronoun: document.getElementById('pronoun-select').value,
    accessory: document.getElementById('accessory-select').value,
    wheelchair: document.getElementById('wheelchair').checked,
    wheelchairColour: document.getElementById('wheelchair-colour').value,
    wheelchairSize: document.getElementById('wheelchair-size').value
  });
  alert('Avatar saved!');
  // Integrate with Firebase
  // import { saveAvatarData } from '../firebase.js';
  // saveAvatarData(userId, state);
  // Log avatar changes for educator review (compliance)
  if (window.logAvatarChange) window.logAvatarChange(state);
  // Placeholder for cloud sync
  // syncAvatarToCloud(state);
  playSound('assets/sounds/avatar-save.mp3');
}

function playSound(src) {
  const audio = new Audio(src);
  audio.play();
}

// Debounce utility
function debounce(fn, ms) {
  let timer;
  return function() {
    clearTimeout(timer);
    timer = setTimeout(fn, ms);
  };
}

// Export avatar as image or PDF
function exportAvatar() {
  const preview = document.getElementById('avatar-preview');
  const svg = preview.querySelector('svg');
  if (!svg) return alert('No avatar to export.');
  // Export as image
  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svg);
  const blob = new Blob([svgStr], {type: 'image/svg+xml'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'avatar.svg';
  a.click();
  // Optionally, export as PDF (requires jsPDF)
  // const doc = new jsPDF();
  // doc.text('Your Avatar', 10, 10);
  // doc.addImage(url, 'SVG', 10, 20, 100, 100);
  // doc.save('avatar.pdf');
}
