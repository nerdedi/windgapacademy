import { applyHeadingAnimation, applyButtonAnimation, setAriaAttributes } from '../utils/uiUtils.js';

export function showAvatarBuilder(container, userData = {}) {
  container.innerHTML = `
    <div class="avatarbuilder-bg" style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:-1;background:url('/assets/backgrounds/avatarbuilder-bg.svg') center/cover no-repeat;"></div>
    <section id="avatar-builder" class="card shadow-xl p-8 rounded-2xl mx-auto my-16 max-w-3xl relative bg-white/80 backdrop-blur-lg grid grid-cols-4 gap-6">
      <div class="col-span-4 flex items-center justify-between mb-4">
        <h2 id="avatar-heading" class="text-3xl font-bold text-primary">Avatar Builder</h2>
        <div class="live-preview-window rounded-xl shadow-lg bg-gradient-to-br from-yellow-100 to-blue-100 flex items-center justify-center" style="width:120px;height:120px;">
          <img id="avatar-preview" src="/assets/images/avatar-default.png" alt="Avatar Preview" class="w-24 h-24 rounded-full" />
        </div>
      </div>
      <aside class="col-span-1 flex flex-col gap-4">
        <div class="feature-card bg-white rounded shadow p-4">Hair</div>
        <div class="feature-card bg-white rounded shadow p-4">Outfits</div>
        <div class="feature-card bg-white rounded shadow p-4">Accessories</div>
      </aside>
      <main class="col-span-2 flex flex-col items-center justify-center">
        <div id="customization-area" class="drag-drop-area bg-gray-100 rounded shadow p-4">Drag & Drop Customization</div>
      </main>
      <aside class="col-span-1 flex flex-col gap-4">
        <div class="color-picker bg-white rounded shadow p-4">Color Pickers</div>
        <div class="unlockable-packs bg-white rounded shadow p-4 mt-4">Unlockable Style Packs</div>
      </aside>
      <div class="col-span-4 flex gap-4 mt-6">
        <button id="avatar-save" class="btn-primary nav-btn">Save Avatar</button>
        <button id="avatar-random" class="btn-secondary nav-btn">Randomize</button>
      </div>
    </section>
  `;
  // Animate heading and buttons
  applyHeadingAnimation(document.getElementById('avatar-heading'));
  applyButtonAnimation(document.getElementById('avatar-save'));
  applyButtonAnimation(document.getElementById('avatar-random'));
  // Accessibility
  setAriaAttributes(document.getElementById('avatar-builder'), { role: 'region', label: 'Avatar Builder' });
  setTimeout(renderAvatar, 100);
  // Add your avatar builder logic here
}
  export default showAvatarBuilder;
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
  // Set avatar preview image and styles
  preview.src = "/assets/images/avatar-default.png";
  preview.style.background = state.skin;
  preview.style.borderColor = state.hair;
}

// Example usage: render avatar when DOM is loaded
if (typeof document !== 'undefined') {
  document.addEventListener("DOMContentLoaded", renderAvatar);
}
