import {
  applyButtonAnimation,
  applyHeadingAnimation,
  setAriaAttributes,
} from "../utils/uiUtils.js";
// Mini-games for skill reinforcement
export function showMiniGames(container) {
  container.innerHTML = `
    <section id="mini-games" aria-label="Mini Games">
      <h2>🎮 Mini Games</h2>
      <button id="play-memory">Play Memory Game</button>
      <button id="play-quiz">Play Quick Quiz</button>
      <div id="mini-game-feedback" aria-live="polite"></div>
    </section>
  `;
  // Example usage for main button:
  // Animate both buttons
  applyButtonAnimation(document.getElementById("play-memory"));
  applyButtonAnimation(document.getElementById("play-quiz"));
  // Animate heading
  applyHeadingAnimation(document.getElementById("minigame-heading"));
  // Accessibility
  setAriaAttributes(document.getElementById("mini-games"), { role: "region", label: "Mini Games" });
  // Example usage for heading:
}
