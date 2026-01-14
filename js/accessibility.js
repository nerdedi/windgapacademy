// Accessibility helpers
export function addAriaLabels() {
  try {
    // Standard semantic elements
    const nav = document.querySelector("nav");
    if (nav && !nav.getAttribute("aria-label")) {
      nav.setAttribute("aria-label", "Main Navigation");
    }

    const main = document.querySelector("main");
    if (main && !main.getAttribute("role")) {
      main.setAttribute("role", "main");
    }

    const footer = document.querySelector("footer");
    if (footer && !footer.getAttribute("aria-label")) {
      footer.setAttribute("aria-label", "Footer Information");
    }

    const app = document.getElementById("app");
    if (app && !app.getAttribute("aria-label")) {
      app.setAttribute("aria-label", "Windgap Academy Main App");
    }

    // Feature buttons - ensure they have proper ARIA attributes
    const featureBtns = document.querySelectorAll("[data-feature]");
    featureBtns.forEach((btn) => {
      if (!btn.getAttribute("role")) btn.setAttribute("role", "button");
      if (!btn.getAttribute("tabindex")) btn.setAttribute("tabindex", "0");
      if (!btn.getAttribute("aria-label")) {
        const feature = btn.dataset.feature || btn.getAttribute("data-feature") || "feature";
        btn.setAttribute("aria-label", `Activate ${feature.replace(/-/g, " ")}`);
      }
    });

    // Game elements
    const gameContainers = document.querySelectorAll("[data-game], .game-container");
    gameContainers.forEach((container) => {
      if (!container.getAttribute("role")) container.setAttribute("role", "application");
      if (!container.getAttribute("aria-label")) {
        container.setAttribute("aria-label", "Educational Game");
      }
    });

    // Form elements
    const inputs = document.querySelectorAll("input:not([aria-label]):not([aria-labelledby])");
    inputs.forEach((input) => {
      const label =
        input.previousElementSibling?.tagName === "LABEL"
          ? input.previousElementSibling
          : document.querySelector(`label[for="${input.id}"]`);
      if (!label && input.placeholder) {
        input.setAttribute("aria-label", input.placeholder);
      }
    });
  } catch (err) {
    console.error("Error adding ARIA labels:", err);
  }
}

export function enableKeyboardNavigation() {
  try {
    // Enhanced keyboard navigation
    document.addEventListener("keydown", function (e) {
      const activeElement = document.activeElement;

      // Handle Tab navigation
      if (e.key === "Tab") {
        const focusable = Array.from(
          document.querySelectorAll(
            "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1']):not([disabled]), [contenteditable]:not([contenteditable='false'])",
          ),
        );

        const currentIndex = focusable.indexOf(activeElement);
        let nextIndex;

        if (e.shiftKey) {
          // Shift+Tab - go backward
          nextIndex = currentIndex <= 0 ? focusable.length - 1 : currentIndex - 1;
        } else {
          // Tab - go forward
          nextIndex = currentIndex >= focusable.length - 1 ? 0 : currentIndex + 1;
        }

        const nextElement = focusable[nextIndex];
        if (nextElement) {
          nextElement.focus();
          e.preventDefault();
        }
      }

      // Handle Enter and Space for feature buttons
      if ((e.key === "Enter" || e.key === " ") && activeElement?.matches("[data-feature]")) {
        activeElement.click();
        e.preventDefault();
      }

      // Handle Escape to close modals or return to main content
      if (e.key === "Escape") {
        const modal = document.querySelector(".modal:not(.hidden), [data-modal].active");
        if (modal) {
          const closeBtn = modal.querySelector(".close-btn, [data-close]");
          if (closeBtn) {
            closeBtn.click();
          } else {
            modal.style.display = "none";
            modal.hidden = true;
          }
          e.preventDefault();
        }
      }

      // Handle Arrow keys for game navigation
      if (activeElement?.closest(".game-container, [data-game]")) {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
          const gameButtons = Array.from(
            activeElement
              .closest(".game-container, [data-game]")
              .querySelectorAll("button:not([disabled])"),
          );
          const currentIndex = gameButtons.indexOf(activeElement);

          let nextIndex = currentIndex;
          if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            nextIndex = (currentIndex + 1) % gameButtons.length;
          } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            nextIndex = currentIndex <= 0 ? gameButtons.length - 1 : currentIndex - 1;
          }

          if (gameButtons[nextIndex]) {
            gameButtons[nextIndex].focus();
            e.preventDefault();
          }
        }
      }
    });

    // Add focus indicators for better visibility
    const style = document.createElement("style");
    style.textContent = `
      *:focus {
        outline: 3px solid #3B82F6 !important;
        outline-offset: 2px !important;
      }

      *:focus:not(:focus-visible) {
        outline: none !important;
      }

      button:focus-visible,
      input:focus-visible,
      select:focus-visible,
      textarea:focus-visible,
      [tabindex]:focus-visible {
        outline: 3px solid #3B82F6 !important;
        outline-offset: 2px !important;
      }
    `;
    document.head.appendChild(style);
  } catch (err) {
    console.error("Error enabling keyboard navigation:", err);
  }
}
