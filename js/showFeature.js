/**
 * Enhanced feature routing with accessibility functions and fallback mechanisms
 * Handles both traditional feature panels and accessibility functions
 * @param {string} feature - The feature name to show/execute
 * @param {Object} options - Optional configuration
 */
export async function showFeature(feature, options = {}) {
  // Create enhanced logger with context
  const logger = {
    info: (msg, data) => console.log(`[ShowFeature] ${msg}`, data || ""),
    warn: (msg, data) => console.warn(`[ShowFeature] ${msg}`, data || ""),
    error: (msg, data) => console.error(`[ShowFeature] ${msg}`, data || ""),
  };

  logger.info(`Showing feature: ${feature}`, { options, timestamp: new Date().toISOString() });

  try {
    // Handle accessibility features first
    const accessibilityFeatures = {
      increaseFont: () => {
        const currentSize = parseInt(document.documentElement.style.fontSize) || 16;
        const newSize = Math.min(currentSize + 2, 24); // Max size 24px
        document.documentElement.style.fontSize = `${newSize}px`;
        localStorage.setItem("windgap-font-size", newSize);
        logger.info(`Font size increased to ${newSize}px`);

        // Show feedback
        showToastNotification(`Font size increased to ${newSize}px`, "success");
        return true;
      },

      decreaseFont: () => {
        const currentSize = parseInt(document.documentElement.style.fontSize) || 16;
        const newSize = Math.max(currentSize - 2, 12); // Min size 12px
        document.documentElement.style.fontSize = `${newSize}px`;
        localStorage.setItem("windgap-font-size", newSize);
        logger.info(`Font size decreased to ${newSize}px`);

        // Show feedback
        showToastNotification(`Font size decreased to ${newSize}px`, "success");
        return true;
      },

      toggleDyslexiaFont: () => {
        const isDyslexiaFont = document.body.classList.contains("dyslexia-font");

        if (isDyslexiaFont) {
          document.body.classList.remove("dyslexia-font");
          localStorage.removeItem("windgap-dyslexia-font");
          showToastNotification("Dyslexia font disabled", "info");
        } else {
          document.body.classList.add("dyslexia-font");
          localStorage.setItem("windgap-dyslexia-font", "true");
          showToastNotification("Dyslexia font enabled", "success");
        }

        logger.info(`Dyslexia font ${isDyslexiaFont ? "disabled" : "enabled"}`);
        return true;
      },

      toggleEasyRead: () => {
        const isEasyRead = document.body.classList.contains("easy-read");

        if (isEasyRead) {
          document.body.classList.remove("easy-read");
          localStorage.removeItem("windgap-easy-read");
          showToastNotification("Easy read mode disabled", "info");
        } else {
          document.body.classList.add("easy-read");
          localStorage.setItem("windgap-easy-read", "true");
          showToastNotification("Easy read mode enabled", "success");
        }

        logger.info(`Easy read mode ${isEasyRead ? "disabled" : "enabled"}`);
        return true;
      },
    };

    // Handle scroll actions
    const scrollActions = {
      scrollToAbout: () => {
        const aboutSection = document.getElementById("about");
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: "smooth", block: "start" });
          logger.info("Scrolled to about section");
          return true;
        }
        logger.warn("About section not found for scrolling");
        return false;
      },

      scrollToTop: () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        logger.info("Scrolled to top");
        return true;
      },
    };

    // Check if it's an accessibility feature
    if (accessibilityFeatures[feature]) {
      return accessibilityFeatures[feature]();
    }

    // Check if it's a scroll action
    if (scrollActions[feature]) {
      return scrollActions[feature]();
    }

    // Hide all feature panels first
    const panels = document.querySelectorAll("[data-pane]");
    panels.forEach((panel) => {
      panel.hidden = true;
      panel.style.display = "none";
      panel.setAttribute("aria-hidden", "true");
    });

    // Hide homepage if showing a feature
    const homepage = document.querySelector('.homepage, #home, [data-page="home"]');
    if (homepage && feature !== "home") {
      homepage.style.display = "none";
      homepage.setAttribute("aria-hidden", "true");
    }

    // Handle traditional feature panels
    const featureHandlers = {
      home: () => {
        if (homepage) {
          homepage.style.display = "block";
          homepage.setAttribute("aria-hidden", "false");
        }
        document.title = "Windgap Academy - Accessible Learning for Every Mind";
        return true;
      },

      signin: () => {
        const signinModal = document.getElementById("signinModal");
        if (signinModal) {
          signinModal.style.display = "flex";
          signinModal.setAttribute("aria-hidden", "false");

          // Focus the first input
          const firstInput = signinModal.querySelector('input[type="email"], input[type="text"]');
          if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
          }
        }
        document.title = "Sign In - Windgap Academy";
        return true;
      },

      signup: () => {
        const signupModal = document.getElementById("signupModal");
        if (signupModal) {
          signupModal.style.display = "flex";
          signupModal.setAttribute("aria-hidden", "false");

          // Focus the first input
          const firstInput = signupModal.querySelector('input[type="email"], input[type="text"]');
          if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
          }
        }
        document.title = "Sign Up - Windgap Academy";
        return true;
      },

      dashboard: () => {
        const dashboard = document.getElementById("dashboard");
        if (dashboard) {
          dashboard.style.display = "block";
          dashboard.setAttribute("aria-hidden", "false");
        }
        document.title = "Dashboard - Windgap Academy";
        return true;
      },
    };

    // Execute feature handler
    if (featureHandlers[feature]) {
      const success = featureHandlers[feature]();
      if (success) {
        // Update URL without page reload
        try {
          const newUrl = feature === "home" ? "/" : `/${feature}`;
          if (window.location.pathname !== newUrl) {
            window.history.pushState({ feature }, document.title, newUrl);
          }
        } catch (e) {
          logger.warn("Failed to update URL", e.message);
        }

        logger.info(`Successfully showed feature: ${feature}`);
        return true;
      }
    }

    // Show the requested feature panel using data-pane
    const targetPanel = document.querySelector(`[data-pane="${feature}"]`);
    if (targetPanel) {
      targetPanel.hidden = false;
      targetPanel.style.display = "block";
      targetPanel.setAttribute("aria-hidden", "false");

      // Focus management for accessibility
      const firstFocusable = targetPanel.querySelector(
        "button, input, [tabindex]:not([tabindex='-1'])",
      );
      if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100);
      }

      logger.info(`Successfully showed panel for feature: ${feature}`);
      return true;
    }

    // Fallback: try to find and execute any window function for the feature
    const featureFunctionName = `launch${feature.charAt(0).toUpperCase() + feature.slice(1)}`;
    if (typeof window[featureFunctionName] === "function") {
      logger.info(`Executing fallback function: ${featureFunctionName}`);
      window[featureFunctionName]();
      return true;
    } else if (typeof window.launchGame === "function" && feature.includes("game")) {
      logger.info(`Executing game launcher for: ${feature}`);
      window.launchGame(feature);
      return true;
    }

    logger.warn(`Feature not found: ${feature}`);
    showToastNotification(`Feature "${feature}" is not available`, "warning");
    return false;
  } catch (error) {
    logger.error("Error in showFeature:", error.message);
    showToastNotification("Sorry, there was an error loading that feature", "error");
    return false;
  }
}

/**
 * Show toast notification for user feedback
 * @param {string} message - The message to show
 * @param {string} type - The type of notification (success, error, warning, info)
 */
export function showToastNotification(message, type = "info") {
  // Remove existing toast
  const existingToast = document.querySelector(".toast-notification");
  if (existingToast) {
    existingToast.remove();
  }

  // Create toast element
  const toast = document.createElement("div");
  toast.className = `toast-notification toast-${type}`;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "polite");
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    max-width: 300px;
    padding: 12px 16px;
    border-radius: 8px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transform: translateX(100%);
    transition: transform 0.3s ease-in-out;
  `;

  // Set colors based on type
  const colors = {
    success: { bg: "#10B981", text: "#FFFFFF" },
    error: { bg: "#EF4444", text: "#FFFFFF" },
    warning: { bg: "#F59E0B", text: "#FFFFFF" },
    info: { bg: "#3B82F6", text: "#FFFFFF" },
  };

  const color = colors[type] || colors.info;
  toast.style.backgroundColor = color.bg;
  toast.style.color = color.text;

  toast.textContent = message;
  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.style.transform = "translateX(0)";
  }, 10);

  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// Handle browser back/forward buttons
if (typeof window !== "undefined") {
  // Attach to window for inline HTML usage
  window.showFeature = showFeature;
  window.showToastNotification = showToastNotification;

  // Handle popstate for back/forward navigation
  window.addEventListener("popstate", (evt) => {
    const feature = evt.state?.feature || "home";
    showFeature(feature);
  });

  // Check for initial feature in URL on load
  window.addEventListener("load", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const feature = urlParams.get("feature") || window.location.pathname.replace("/", "") || "home";
    if (feature && feature !== "home") {
      showFeature(feature);
    }
  });
}
