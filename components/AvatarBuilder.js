export function showAvatarBuilder(container, userData = {}) {
  container.innerHTML = `
    <div class="card fade-in max-w-2xl mx-auto my-8">
      <h2 class="text-3xl font-bold mb-4 flex items-center gap-2">
        <svg class="h-8 w-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8"/></svg>
        Avatar Builder
      </h2>
      <p class="mb-4">Build your custom avatar here! Express yourself with outfits, accessories, and emotes.</p>
      <div id="avatar-preview" class="w-32 h-32 rounded-full flex items-center justify-center relative animate-bounce mb-4 bg-gradient-to-br from-yellow-100 to-blue-100 shadow-lg"></div>
      <form id="avatar-form" class="grid grid-cols-2 gap-4 mb-4">
        <label>Skin Tone <input id="skin-tone" type="color" value="#ffe0bd" class="input" /></label>
        <label>Hair Colour <input id="hair-colour" type="color" value="#6b4f1d" class="input" /></label>
        <label>Outfit <select id="outfit-select" class="input"><option value="#1976d2">Blue</option><option value="#A32C2B">Red</option><option value="#5ED1D2">Teal</option></select></label>
        <label>Pronoun <select id="pronoun-select" class="input"><option value="They">They</option><option value="She">She</option><option value="He">He</option></select></label>
      </form>
      <button class="btn-secondary" id="save-avatar">Save Avatar</button>
    </div>
  `;
    // Animate heading and buttons
    applyHeadingAnimation(document.getElementById('avatar-heading'));
    applyButtonAnimation(document.getElementById('avatar-save'));
    applyButtonAnimation(document.getElementById('avatar-random'));
    // Accessibility
    setAriaAttributes(document.getElementById('avatar-builder'), { role: 'region', label: 'Avatar Builder' });
    setTimeout(renderAvatar, 100);
    document.getElementById("avatar-form").oninput = renderAvatar;
    document.getElementById("avatar-save").onclick = function() {
      alert("Avatar saved! More customization features coming soon.");
    };
  // Add your avatar builder logic here
}
/**
 * Avatar Builder Module
 * @module AvatarBuilder
 */
/**
 * Calculates avatar state from selected features.
 * @param {Object} features - Avatar features
 * @returns {Object} Avatar state
 */

export function getAvatarState({
  skin,
  hair,
  outfit,
  pronoun,
  accessory,
  wheelchair,
  wheelchairColour,
  wheelchairSize,
}) {
  // Avatar properties are independent; changing one does not require changing another.
  return { skin, hair, outfit, pronoun, accessory, wheelchair, wheelchairColour, wheelchairSize };
}

// ...existing code...

// Call renderAvatar to use the function and avoid unused error
function renderAvatar() {
  // Render avatar based on independent state properties
  const preview = document.getElementById("avatar-preview");
  const state = getAvatarState({
    skin: document.getElementById("skin-tone").value,
    hair: document.getElementById("hair-colour").value,
    outfit: document.getElementById("outfit-select").value,
    pronoun: document.getElementById("pronoun-select").value,
  });
  preview.innerHTML = `<div class="w-30 h-30 rounded-full flex items-center justify-center relative animate-bounce" style="background:${state.skin};">
  <span class="text-2xl" style="color:${state.hair};">👤</span>
    </div>`;
}

// Example usage: render avatar when DOM is loaded
document.addEventListener("DOMContentLoaded", renderAvatar);
