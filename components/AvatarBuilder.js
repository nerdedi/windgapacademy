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
