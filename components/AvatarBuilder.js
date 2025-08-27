/**
 * Returns a normalized avatar state object with all expected properties.
 * @param {Object} features - Partial avatar features.
 * @returns {Object} Avatar state with all properties.
 */
export function getAvatarState(features = {}) {
  return {
    skin: features.skin,
    hair: features.hair,
    outfit: features.outfit,
    pronoun: features.pronoun,
    accessory: features.accessory,
    wheelchair: features.wheelchair,
    wheelchairColour: features.wheelchairColour,
    wheelchairSize: features.wheelchairSize,
  };
}
import { applyHeadingAnimation, applyButtonAnimation, setAriaAttributes } from '../utils/uiUtils.js';
/**
 * Avatar Builder Module
 * @module AvatarBuilder
 */
/**
 * Renders the Avatar Builder UI.
 * @param {HTMLElement} container - The container to render the UI into.
 * @param {Object} userData - User data for personalization.
 */

export function showAvatarBuilder(container, userData = {}) {
  container.innerHTML = `
    <div class="avatarbuilder-bg" style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:-1;background:url('/assets/backgrounds/avatarbuilder-bg.svg') center/cover no-repeat;"></div>
    <section id="avatar-builder" class="card shadow-xl p-8 rounded-2xl mx-auto my-16 max-w-3xl relative bg-white/80 backdrop-blur-lg grid grid-cols-4 gap-6">
      <div class="col-span-4 flex items-center justify-between mb-4">
        <h2 id="avatar-heading" class="text-3xl font-bold text-primary">Avatar Builder</h2>
        <div class="live-preview-window rounded-xl shadow-lg bg-gradient-to-br from-yellow-100 to-blue-100 flex items-center justify-center" style="width:120px;height:120px;">
          <img id="avatar-preview" src="/assets/images/avatar-default.png" alt="Avatar Preview" class="w-24 h-24 rounded-full" />
          <div class="avatar-overlay"></div>
        </div>
      </div>
      <aside class="col-span-1 flex flex-col gap-4">
        <div class="feature-card bg-white rounded shadow p-4">Hair</div>
        <div class="feature-card bg-white rounded shadow p-4">Outfits</div>
        <div class="feature-card bg-white rounded shadow p-4">Accessories</div>
        <div class="feature-card bg-white rounded shadow p-4">Facial Features</div>
        <div class="feature-card bg-white rounded shadow p-4">Body Type</div>
        <div class="feature-card bg-white rounded shadow p-4">Wheelchair</div>
      </aside>
      <main class="col-span-2 flex flex-col items-center justify-center"></main>
        <div id="customization-area" class="drag-drop-area bg-gray-100 rounded shadow p-4">Drag & Drop Customization</div>
      </main>
      <aside class="col-span-1 flex flex-col gap-4">
        <div class="color-picker bg-white rounded shadow p-4">Colour Pickers</div>
        <div class="unlockable-packs bg-white rounded shadow p-4 mt-4">Unlockable Style Packs</div>
      </aside>
      <div class="col-span-4 flex gap-4 mt-6">
        <button id="avatar-save" class="btn-primary nav-btn">Save Avatar</button>
        <button id="avatar-reset" class="btn-secondary nav-btn">Reset</button>
        <button id="avatar-apply" class="btn-secondary nav-btn">Apply</button>
        <button id="avatar-random" class="btn-secondary nav-btn">Randomise</button>
      </div>
    </section>
  `;
  // All event listeners and state logic should be implemented in a separate function or class, not here.
          }

// ...existing code...
