// === WINDGAP ACADEMY - MAIN APPLICATION ===
// Refactored and improved version with proper architecture

// === CONFIGURATION ===
const CONFIG = {
  DEBUG_MODE: false,
  THROTTLE_DELAY: 50,
  API_ENDPOINTS: {
    auth: "/api/auth",
    user: "/api/user",
  },
  UI: {
    THEME: "windgap",
    ANIMATION_DURATION: 300,
  },
  VALIDATION: {
    EMAIL_REGEX: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
    MIN_PASSWORD_LENGTH: 6,
  },
};
// === UTILITY FUNCTIONS ===
class Utils {
  static throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  static debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  static safeQuerySelector(selector) {
    try {
      return document.querySelector(selector);
    } catch (error) {
      console.error(`Invalid selector: ${selector}`, error);
      return null;
    }
  }

  static createElement(tag, attributes = {}, textContent = "") {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === "className") {
        element.className = value;
      } else {
        element.setAttribute(key, value);
      }
    });
    if (textContent) element.textContent = textContent;
    return element;
  }
}
// === ERROR HANDLING ===
class WindgapError extends Error {
  constructor(message, code = "UNKNOWN", context = {}) {
    super(message);
    this.name = "WindgapError";
    this.code = code;
    this.context = context;
    this.timestamp = Date.now();
  }
}

class ErrorHandler {
  static handle(error, context = "") {
    Logger.error(`Error in ${context}`, {
      message: error.message,
      stack: error.stack,
      code: error.code || "UNKNOWN",
      timestamp: Date.now(),
    });

    // Show user-friendly notification
    NotificationManager.show("Something went wrong. Please try again.", "error");

    // Store for debugging
    window.lastWindgapError = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now(),
    };
  }

  static setupGlobalHandlers() {
    window.onerror = (message, source, lineno, colno, error) => {
      this.handle(
        new WindgapError(message, "GLOBAL_ERROR", {
          source,
          lineno,
          colno,
        }),
        "Global Error Handler",
      );
    };

    window.addEventListener("unhandledrejection", (event) => {
      this.handle(
        new WindgapError(
          event.reason?.message || "Unhandled promise rejection",
          "PROMISE_REJECTION",
        ),
        "Promise Rejection Handler",
      );
    });
  }
}

// === LOGGING SYSTEM ===
class Logger {
  static logs = [];

  static log(message, data = {}) {
    const entry = {
      timestamp: Date.now(),
      level: "info",
      message,
      data,
    };
    this.logs.push(entry);
    if (CONFIG.DEBUG_MODE) {
      console.log(`[WindGap] ${message}`, data);
    }
  }

  static error(message, data = {}) {
    const entry = {
      timestamp: Date.now(),
      level: "error",
      message,
      data,
    };
    this.logs.push(entry);
    console.error(`[WindGap Error] ${message}`, data);
  }

  static warn(message, data = {}) {
    const entry = {
      timestamp: Date.now(),
      level: "warn",
      message,
      data,
    };
    this.logs.push(entry);
    if (CONFIG.DEBUG_MODE) {
      console.warn(`[WindGap Warning] ${message}`, data);
    }
  }

  static getLogs(level = null) {
    return level ? this.logs.filter((log) => log.level === level) : this.logs;
  }

  static clearLogs() {
    this.logs = [];
  }
}

// === NOTIFICATION SYSTEM ===
class NotificationManager {
  static container = null;

  static init() {
    if (!this.container) {
      this.container = Utils.createElement("div", {
        id: "notification-container",
        className: "fixed top-4 right-4 z-50 space-y-2",
      });
      document.body.appendChild(this.container);
    }
  }

  static show(message, type = "info", duration = 5000) {
    this.init();

    const notification = Utils.createElement("div", {
      className: `notification notification-${type} bg-white border-l-4 p-4 rounded shadow-lg transform translate-x-full opacity-0 transition-all duration-300`,
      role: "alert",
    });

    const typeColors = {
      error: "border-red-500 text-red-700",
      success: "border-green-500 text-green-700",
      warning: "border-yellow-500 text-yellow-700",
      info: "border-blue-500 text-blue-700",
    };

    notification.classList.add(...typeColors[type].split(" "));
    notification.textContent = message;

    this.container.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.remove("translate-x-full", "opacity-0");
    }, 10);

    // Auto remove
    setTimeout(() => {
      this.remove(notification);
    }, duration);

    return notification;
  }

  static remove(notification) {
    if (notification && notification.parentNode) {
      notification.classList.add("translate-x-full", "opacity-0");
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  }
}
// === SCRIPT UTILITIES ===
class ScriptManager {
  static async getScriptContent(url) {
    try {
      if (!url || typeof url !== "string" || !/^https?:\/\//.test(url)) {
        throw new WindgapError("Invalid URL for script fetch", "INVALID_URL", { url });
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "text/javascript,application/javascript,text/plain,*/*",
        },
      });

      if (!response.ok) {
        throw new WindgapError(`Fetch failed with status: ${response.status}`, "FETCH_ERROR", {
          url,
          status: response.status,
        });
      }

      return await response.text();
    } catch (error) {
      Logger.error(`Failed to fetch script content from ${url}`, error);
      throw error;
    }
  }

  static getStackTraceUrls() {
    try {
      const stack = new Error().stack;
      if (!stack) return [];

      const urls = stack
        .split("\n")
        .map((line) => {
          const match = line.match(/(https?:\/\/[^\s]+)/);
          return match ? match[1].replace(/:\d+:\d+$/, "") : null;
        })
        .filter(Boolean);

      return [...new Set(urls)];
    } catch (error) {
      Logger.error("Failed to get stack trace URLs", error);
      return [];
    }
  }

  static async getDebugData() {
    try {
      const scriptUrls = this.getStackTraceUrls();
      const featureLoaderUrl = scriptUrls.find((url) => url.includes("featureLoader.js"));

      if (!featureLoaderUrl) {
        return {
          scriptContent: "Could not find featureLoader.js in stack trace.",
          stackTraceUrls: scriptUrls,
        };
      }

      const scriptContent = await this.getScriptContent(featureLoaderUrl);

      return {
        scriptContent,
        featureLoaderUrl,
        stackTraceUrls: scriptUrls,
      };
    } catch (error) {
      Logger.error("Failed to get debug data", error);
      return {
        error: error.message,
        stackTraceUrls: this.getStackTraceUrls(),
      };
    }
  }
}
// === ACCESSIBILITY MANAGER ===
class AccessibilityManager {
  constructor() {
    this.focusableSelector = [
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "a[href]",
      '[tabindex]:not([tabindex="-1"])',
    ].join(", ");

    this.lastTabTime = 0;
    this.init();
  }

  init() {
    this.setupKeyboardNavigation();
    this.addAriaLabels();
    this.setupScreenReaderSupport();
  }

  setupKeyboardNavigation() {
    const throttledKeyHandler = Utils.throttle((e) => {
      if (e.key === "Tab") {
        this.handleTabNavigation(e);
      }
    }, CONFIG.THROTTLE_DELAY);

    document.addEventListener("keydown", throttledKeyHandler);
  }

  handleTabNavigation(e) {
    const focusableElements = Array.from(document.querySelectorAll(this.focusableSelector));
    const currentIndex = focusableElements.indexOf(document.activeElement);

    let nextIndex;
    if (e.shiftKey) {
      nextIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
    } else {
      nextIndex = currentIndex >= focusableElements.length - 1 ? 0 : currentIndex + 1;
    }

    const nextElement = focusableElements[nextIndex];
    if (nextElement) {
      nextElement.focus();
      e.preventDefault();
    }
  }

  addAriaLabels() {
    const elements = [
      { selector: "nav", label: "Main Navigation" },
      { selector: "main", role: "main" },
      { selector: "footer", label: "Footer Information" },
      { selector: "#app", label: "Windgap Academy Main App", role: "application" },
    ];

    elements.forEach(({ selector, label, role }) => {
      const element = Utils.safeQuerySelector(selector);
      if (element) {
        if (label) element.setAttribute("aria-label", label);
        if (role) element.setAttribute("role", role);
      }
    });
  }

  setupScreenReaderSupport() {
    window.narrate = (text) => {
      try {
        if (!text || typeof text !== "string") return;

        if ("speechSynthesis" in window) {
          const speak = () => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.8;
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
          };

          const voices = window.speechSynthesis.getVoices();
          if (!voices.length) {
            window.speechSynthesis.onvoiceschanged = speak;
          } else {
            speak();
          }
        }
      } catch (error) {
        Logger.error("Narration failed", error);
      }
    };
  }
}
// === FORM VALIDATOR ===
class FormValidator {
  constructor() {
    this.validationRules = {
      email: (value) => {
        const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        return emailRegex.test(value) ? "" : "Please enter a valid email address.";
      },
      password: (value) => {
        if (value.length < 6) return "Password must be at least 6 characters.";
        if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter.";
        if (!/[0-9]/.test(value)) return "Password must contain at least one number.";
        return "";
      },
      username: (value) => {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(value)
          ? ""
          : "Username must be 3-20 characters and contain only letters, numbers, and underscores.";
      },
      required: (value) => {
        return value.trim() ? "" : "This field is required.";
      },
      phone: (value) => {
        const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
        return value === "" || phoneRegex.test(value) ? "" : "Please enter a valid phone number.";
      },
    };

    this.init();
  }

  init() {
    this.setupForms();
  }

  setupForms() {
    const forms = document.querySelectorAll('form[data-validate="true"]');
    forms.forEach((form) => this.attachFormValidation(form));
  }

  attachFormValidation(form) {
    // Add novalidate to prevent browser validation
    form.setAttribute("novalidate", "true");

    // Live validation for inputs
    const inputs = form.querySelectorAll("input, select, textarea");
    inputs.forEach((input) => {
      const rules = input.dataset.validate ? input.dataset.validate.split(" ") : [];
      if (rules.length) {
        input.addEventListener("blur", () => this.validateField(input, rules));
        input.addEventListener(
          "input",
          Utils.debounce(() => this.validateField(input, rules), 500),
        );
      }
    });

    // Form submission validation
    form.addEventListener("submit", (e) => {
      let isValid = true;
      inputs.forEach((input) => {
        const rules = input.dataset.validate ? input.dataset.validate.split(" ") : [];
        if (rules.length) {
          const fieldValid = this.validateField(input, rules);
          isValid = isValid && fieldValid;
        }
      });

      if (!isValid) {
        e.preventDefault();
        const firstError = form.querySelector(".error-message");
        if (firstError) {
          const errorInput = firstError.previousElementSibling;
          if (errorInput) errorInput.focus();
        }
      }
    });
  }

  validateField(input, rules) {
    const errorContainer = input.nextElementSibling?.classList.contains("error-message")
      ? input.nextElementSibling
      : null;

    // If no error container exists, create one
    const errorElement = errorContainer || document.createElement("div");
    if (!errorContainer) {
      errorElement.className = "error-message";
      errorElement.style.color = "red";
      errorElement.style.fontSize = "0.8rem";
      errorElement.style.marginTop = "4px";
      input.insertAdjacentElement("afterend", errorElement);
    }

    // Validate against all rules
    let error = "";
    for (const rule of rules) {
      if (this.validationRules[rule]) {
        error = this.validationRules[rule](input.value);
        if (error) break;
      }
    }

    // Update UI based on validation result
    if (error) {
      input.classList.add("invalid");
      input.setAttribute("aria-invalid", "true");
      errorElement.textContent = error;
      errorElement.style.display = "block";
      return false;
    }
    input.classList.remove("invalid");
    input.removeAttribute("aria-invalid");
    errorElement.textContent = "";
    errorElement.style.display = "none";
    return true;
  }

  // Add custom validation rule
  addValidationRule(name, validationFn) {
    if (typeof validationFn !== "function") {
      throw new WindgapError("ValidationError", "Validation rule must be a function");
    }
    this.validationRules[name] = validationFn;
  }

  // Static method to validate a value against a specific rule
  static validate(value, rule) {
    const validator = new FormValidator();
    if (!validator.validationRules[rule]) {
      throw new WindgapError("ValidationError", `Validation rule "${rule}" does not exist`);
    }
    return validator.validationRules[rule](value);
  }
}
// === UI COMPONENTS ===
class UIComponents {
  constructor() {
    this.components = {};
    this.templates = {};
    this.init();
  }

  init() {
    this.registerCommonComponents();
  }

  registerCommonComponents() {
    this.registerComponent("alert", (props = {}) => {
      const { type = "info", message = "", dismissible = true } = props;
      const alertEl = Utils.createElement("div", {
        className: `alert alert-${type} ${dismissible ? "alert-dismissible" : ""}`,
        role: "alert",
      });

      alertEl.textContent = message;

      if (dismissible) {
        const closeBtn = Utils.createElement("button", {
          type: "button",
          className: "close",
          "aria-label": "Close",
        });
        closeBtn.innerHTML = '<span aria-hidden="true">&times;</span>';
        closeBtn.addEventListener("click", () => alertEl.remove());
        alertEl.appendChild(closeBtn);
      }

      return alertEl;
    });

    this.registerComponent("button", (props = {}) => {
      const {
        text = "Button",
        type = "primary",
        onClick = null,
        disabled = false,
        size = "md",
        ariaLabel = "",
      } = props;

      const buttonEl = Utils.createElement(
        "button",
        {
          className: `btn btn-${type} btn-${size}`,
          disabled: disabled ? "disabled" : "",
          "aria-label": ariaLabel || text,
        },
        text,
      );

      if (onClick && typeof onClick === "function") {
        buttonEl.addEventListener("click", onClick);
      }

      return buttonEl;
    });

    this.registerComponent("card", (props = {}) => {
      const {
        title = "",
        content = "",
        footer = "",
        headerClass = "",
        bodyClass = "",
        footerClass = "",
      } = props;

      const cardEl = Utils.createElement("div", {
        className: "card",
      });

      if (title) {
        const headerEl = Utils.createElement(
          "div",
          {
            className: `card-header ${headerClass}`,
          },
          title,
        );
        cardEl.appendChild(headerEl);
      }

      const bodyEl = Utils.createElement("div", {
        className: `card-body ${bodyClass}`,
      });

      if (typeof content === "string") {
        bodyEl.innerHTML = content;
      } else if (content instanceof HTMLElement) {
        bodyEl.appendChild(content);
      }

      cardEl.appendChild(bodyEl);

      if (footer) {
        const footerEl = Utils.createElement("div", {
          className: `card-footer ${footerClass}`,
        });

        if (typeof footer === "string") {
          footerEl.innerHTML = footer;
        } else if (footer instanceof HTMLElement) {
          footerEl.appendChild(footer);
        }

        cardEl.appendChild(footerEl);
      }

      return cardEl;
    });

    this.registerComponent("modal", (props = {}) => {
      const {
        id = `modal-${Date.now()}`,
        title = "Modal Title",
        content = "",
        footer = "",
        size = "md",
        closeOnBackdrop = true,
      } = props;

      const modalEl = Utils.createElement("div", {
        id,
        className: "modal fade",
        tabindex: "-1",
        role: "dialog",
        "aria-labelledby": `${id}-title`,
        "aria-hidden": "true",
      });

      const modalDialog = Utils.createElement("div", {
        className: `modal-dialog modal-${size}`,
      });

      const modalContent = Utils.createElement("div", {
        className: "modal-content",
      });

      // Header
      const modalHeader = Utils.createElement("div", {
        className: "modal-header",
      });

      const modalTitle = Utils.createElement(
        "h5",
        {
          id: `${id}-title`,
          className: "modal-title",
        },
        title,
      );

      const closeButton = Utils.createElement("button", {
        type: "button",
        className: "close",
        "data-dismiss": "modal",
        "aria-label": "Close",
      });
      closeButton.innerHTML = '<span aria-hidden="true">&times;</span>';

      modalHeader.appendChild(modalTitle);
      modalHeader.appendChild(closeButton);

      // Body
      const modalBody = Utils.createElement("div", {
        className: "modal-body",
      });

      if (typeof content === "string") {
        modalBody.innerHTML = content;
      } else if (content instanceof HTMLElement) {
        modalBody.appendChild(content);
      }

      // Footer
      const modalFooter = Utils.createElement("div", {
        className: "modal-footer",
      });

      if (typeof footer === "string") {
        modalFooter.innerHTML = footer;
      } else if (footer instanceof HTMLElement) {
        modalFooter.appendChild(footer);
      }

      // Assemble modal
      modalContent.appendChild(modalHeader);
      modalContent.appendChild(modalBody);
      modalContent.appendChild(modalFooter);
      modalDialog.appendChild(modalContent);
      modalEl.appendChild(modalDialog);

      // Modal functionality
      const openModal = () => {
        document.body.appendChild(modalEl);
        modalEl.style.display = "block";
        modalEl.classList.add("show");
        document.body.classList.add("modal-open");

        const backdrop = Utils.createElement("div", {
          className: "modal-backdrop fade show",
        });
        document.body.appendChild(backdrop);
      };

      const closeModal = () => {
        modalEl.classList.remove("show");
        modalEl.style.display = "none";
        document.body.classList.remove("modal-open");

        const backdrop = document.querySelector(".modal-backdrop");
        if (backdrop) backdrop.remove();

        if (modalEl.parentNode) {
          modalEl.parentNode.removeChild(modalEl);
        }
      };

      closeButton.addEventListener("click", closeModal);

      if (closeOnBackdrop) {
        modalEl.addEventListener("click", (e) => {
          if (e.target === modalEl) closeModal();
        });
      }

      // Expose API
      modalEl.openModal = openModal;
      modalEl.closeModal = closeModal;

      return modalEl;
    });
  }

  registerComponent(name, renderFn) {
    if (typeof renderFn !== "function") {
      throw new WindgapError(
        "ComponentError",
        `Component render function for "${name}" must be a function`,
      );
    }
    this.components[name] = renderFn;
  }

  registerTemplate(name, template) {
    this.templates[name] = template;
  }

  render(name, props = {}, container = null) {
    if (!this.components[name]) {
      throw new WindgapError("ComponentError", `Component "${name}" is not registered`);
    }

    try {
      const component = this.components[name](props);

      if (container) {
        if (typeof container === "string") {
          const el = Utils.safeQuerySelector(container);
          if (el) {
            el.innerHTML = "";
            el.appendChild(component);
          } else {
            throw new WindgapError("RenderError", `Container "${container}" not found`);
          }
        } else if (container instanceof HTMLElement) {
          container.innerHTML = "";
          container.appendChild(component);
        }
      }

      return component;
    } catch (error) {
      Logger.error(`Failed to render component "${name}"`, error);
      ErrorHandler.handle(error, `UIComponents.render("${name}")`);
      throw error;
    }
  }
}
// === ROUTER ===
class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.defaultRoute = "home";
    this.notFoundRoute = "404";
    this.routeChangeEvent = new CustomEvent("routeChange", { bubbles: true });
    this.init();
  }

  init() {
    this.setupEventListeners();

    // Register default routes
    this.registerRoute("404", this.renderNotFound.bind(this));

    // Initial navigation based on URL
    this.navigateToCurrentUrl();
  }

  setupEventListeners() {
    // Handle link clicks
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a[data-route]");
      if (link) {
        e.preventDefault();
        const route = link.getAttribute("data-route");
        this.navigateTo(route);
      }
    });

    // Handle popstate (browser back/forward)
    window.addEventListener("popstate", () => {
      this.navigateToCurrentUrl();
    });
  }

  registerRoute(path, handler, title = "") {
    if (typeof handler !== "function") {
      throw new WindgapError("RouterError", `Route handler for "${path}" must be a function`);
    }
    this.routes[path] = { handler, title };
    return this;
  }

  navigateTo(path, updateHistory = true) {
    try {
      // Get the route handler
      const route = this.routes[path] || this.routes[this.notFoundRoute];

      if (!route) {
        throw new WindgapError(
          "RouterError",
          `No route handler found for "${path}" and no 404 handler defined`,
        );
      }

      // Update browser history
      if (updateHistory) {
        const url = path === this.defaultRoute ? "/" : `#${path}`;
        window.history.pushState({ path }, route.title || document.title, url);
      }

      // Call the route handler
      route.handler(path);

      // Update current route and dispatch event
      this.currentRoute = path;
      document.dispatchEvent(this.routeChangeEvent);

      // Update page title if provided
      if (route.title) {
        document.title = route.title;
      }

      // Update active links
      this.updateActiveLinks();

      return true;
    } catch (error) {
      Logger.error(`Navigation error for route "${path}"`, error);
      ErrorHandler.handle(error, "Router.navigateTo");
      return false;
    }
  }

  navigateToCurrentUrl() {
    let path = this.defaultRoute;

    // Check for hash route
    if (window.location.hash) {
      path = window.location.hash.substring(1);
    }

    return this.navigateTo(path, false);
  }

  updateActiveLinks() {
    // Remove active class from all route links
    document.querySelectorAll("a[data-route]").forEach((link) => {
      link.classList.remove("active");
      link.setAttribute("aria-current", "false");
    });

    // Add active class to current route links
    document.querySelectorAll(`a[data-route="${this.currentRoute}"]`).forEach((link) => {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    });
  }

  renderNotFound() {
    const appEl = Utils.safeQuerySelector("#app");
    if (!appEl) return;

    appEl.innerHTML = `
      <div class="not-found">
        <h1>Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <button class="btn btn-primary" data-route="${this.defaultRoute}">Go Home</button>
      </div>
    `;
  }

  getCurrentRoute() {
    return this.currentRoute;
  }

  reload() {
    const currentRoute = this.currentRoute;
    if (currentRoute) {
      this.navigateTo(currentRoute, false);
    }
  }
}

// === DATA MANAGER ===
class DataManager {
  constructor() {
    this.cache = {};
    this.observers = {};
    this.storagePrefix = "windgap_";
    this.lastFetch = {};
    this.fetchInProgress = {};
    this.init();
  }

  init() {
    // Load cached data from localStorage
    this.loadFromStorage();

    // Setup periodic cache cleanup
    setInterval(() => this.cleanupCache(), 60 * 60 * 1000); // Every hour
  }

  async fetchData(endpoint, params = {}, options = {}) {
    const {
      forceRefresh = false,
      cacheTTL = 5 * 60 * 1000, // 5 minutes default
      cacheKey = null,
      method = "GET",
    } = options;

    // Generate a cache key if not provided
    const key = cacheKey || this.generateCacheKey(endpoint, params);

    // Return cached data if available and not forcing refresh
    if (!forceRefresh && this.cache[key] && Date.now() - this.lastFetch[key] < cacheTTL) {
      return this.cache[key];
    }

    // Prevent duplicate in-flight requests
    if (this.fetchInProgress[key]) {
      return this.fetchInProgress[key];
    }

    try {
      // Prepare request URL and options
      let url = endpoint;
      let fetchOptions = { method };

      // Handle query parameters for GET requests
      if (method === "GET" && Object.keys(params).length) {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([param, value]) => {
          queryParams.append(param, value);
        });
        url = `${url}?${queryParams.toString()}`;
      } else if (method !== "GET" && Object.keys(params).length) {
        // For non-GET requests, add body
        fetchOptions.headers = {
          "Content-Type": "application/json",
        };
        fetchOptions.body = JSON.stringify(params);
      }

      // Track the in-flight request
      this.fetchInProgress[key] = fetch(url, fetchOptions)
        .then((response) => {
          if (!response.ok) {
            throw new WindgapError("FetchError", `Failed to fetch data from ${endpoint}`, {
              status: response.status,
              statusText: response.statusText,
            });
          }
          return response.json();
        })
        .then((data) => {
          // Cache the result
          this.cache[key] = data;
          this.lastFetch[key] = Date.now();
          this.saveToStorage();

          // Notify observers
          this.notifyObservers(key, data);

          // Clean up in-flight tracking
          delete this.fetchInProgress[key];

          return data;
        })
        .catch((error) => {
          // Clean up in-flight tracking on error
          delete this.fetchInProgress[key];
          throw error;
        });

      return this.fetchInProgress[key];
    } catch (error) {
      delete this.fetchInProgress[key];
      Logger.error(`Failed to fetch data from ${endpoint}`, error);
      throw error;
    }
  }

  generateCacheKey(endpoint, params) {
    return `${endpoint}:${JSON.stringify(params)}`;
  }

  getCachedData(cacheKey) {
    return this.cache[cacheKey];
  }

  setCachedData(cacheKey, data) {
    this.cache[cacheKey] = data;
    this.lastFetch[cacheKey] = Date.now();
    this.saveToStorage();
    this.notifyObservers(cacheKey, data);
    return data;
  }

  clearCache(cacheKey = null) {
    if (cacheKey) {
      delete this.cache[cacheKey];
      delete this.lastFetch[cacheKey];
    } else {
      this.cache = {};
      this.lastFetch = {};
    }
    this.saveToStorage();
  }

  cleanupCache() {
    const now = Date.now();
    const expiredKeys = Object.keys(this.lastFetch).filter((key) => {
      // Default TTL is 24 hours
      return now - this.lastFetch[key] > 24 * 60 * 60 * 1000;
    });

    expiredKeys.forEach((key) => {
      delete this.cache[key];
      delete this.lastFetch[key];
    });

    if (expiredKeys.length) {
      this.saveToStorage();
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(`${this.storagePrefix}cache`, JSON.stringify(this.cache));
      localStorage.setItem(`${this.storagePrefix}lastFetch`, JSON.stringify(this.lastFetch));
    } catch (error) {
      Logger.error("Failed to save data to localStorage", error);
    }
  }

  loadFromStorage() {
    try {
      const cache = localStorage.getItem(`${this.storagePrefix}cache`);
      const lastFetch = localStorage.getItem(`${this.storagePrefix}lastFetch`);

      if (cache) this.cache = JSON.parse(cache);
      if (lastFetch) this.lastFetch = JSON.parse(lastFetch);
    } catch (error) {
      Logger.error("Failed to load data from localStorage", error);
      // Reset cache if loading fails
      this.cache = {};
      this.lastFetch = {};
    }
  }

  subscribe(cacheKey, callback) {
    if (!this.observers[cacheKey]) {
      this.observers[cacheKey] = [];
    }
    this.observers[cacheKey].push(callback);

    // Immediately notify with current data if available
    if (this.cache[cacheKey]) {
      callback(this.cache[cacheKey]);
    }

    // Return unsubscribe function
    return () => {
      this.observers[cacheKey] = this.observers[cacheKey].filter((cb) => cb !== callback);
    };
  }

  notifyObservers(cacheKey, data) {
    if (this.observers[cacheKey]) {
      this.observers[cacheKey].forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          Logger.error(`Observer callback error for ${cacheKey}`, error);
        }
      });
    }
  }
}

// Call Phase 4 features at startup
collectUserFeedback();
monitorPerformance();
trackErrorRates();
trackUserEngagement();
scheduleRegularUpdates();

// === APP INITIALIZER ===
class AppInitializer {
  constructor() {
    this.components = {};
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    try {
      Logger.log("Initializing application");

      // Set up global error handling
      ErrorHandler.setupGlobalHandlers();

      // Initialize all component managers
      this.components.accessibility = new AccessibilityManager();
      this.components.formValidator = new FormValidator();
      this.components.uiComponents = new UIComponents();
      this.components.router = new Router();
      this.components.dataManager = new DataManager();

      // Set up routes
      this.setupRoutes();

      // Initialize performance monitoring
      this.initPerformanceMonitoring();

      this.initialized = true;
      Logger.log("Application initialized successfully");

      // Dispatch initialization event
      window.dispatchEvent(new CustomEvent("windgap:initialized"));
    } catch (error) {
      Logger.error("Failed to initialize application", error);
      ErrorHandler.handle(error, "AppInitializer.init");
      this.showFallbackScreen(
        "An error occurred during initialization. Please refresh the page or contact support.",
      );
    }
  }

  setupRoutes() {
    const router = this.components.router;

    // Register routes
    router.registerRoute("home", this.renderHomePage.bind(this), "Windgap Academy - Home");
    router.registerRoute("login", this.renderLoginPage.bind(this), "Windgap Academy - Login");
    router.registerRoute(
      "dashboard",
      this.renderDashboard.bind(this),
      "Windgap Academy - Dashboard",
    );
    router.registerRoute(
      "accessibility",
      this.renderAccessibilityPage.bind(this),
      "Windgap Academy - Accessibility",
    );
    router.registerRoute("support", this.renderSupportPage.bind(this), "Windgap Academy - Support");

    // Add more routes as needed
  }

  renderHomePage() {
    const appEl = Utils.safeQuerySelector("#app");
    if (!appEl) return;

    appEl.innerHTML = `
      <header class="flex items-center justify-between px-8 py-4 bg-white shadow">
        <div class="flex items-center gap-3">
          <img src="assets/logo.png" alt="Windgap Academy Logo" class="h-14 w-auto animate-float" />
          <span class="text-2xl font-bold text-[#A32C2B]">Windgap Academy</span>
        </div>
        <div class="flex items-center gap-4">
          <img src="assets/windgap-logo.png" alt="User Avatar" class="h-10 w-10 rounded-full border-2 border-[#A32C2B]" id="user-avatar" />
          <span class="font-semibold text-[#A32C2B]" id="welcome-user">Welcome, Guest!</span>
        </div>
      </header>
      <nav class="sticky top-0 z-50 bg-white shadow flex items-center justify-between px-8 py-4">
        <div class="flex items-center gap-3">
          <img src="assets/logo.png" alt="Windgap Academy Logo" class="h-14 w-auto animate-float" />
          <span class="text-2xl font-bold text-[#A32C2B]">Windgap Academy</span>
        </div>
        <div class="flex gap-6">
          <a href="#home" data-route="home" class="btn-secondary active" aria-label="Home" aria-current="page">Home</a>
          <a href="#login" data-route="login" class="btn-secondary" aria-label="Login">Login</a>
          <a href="#accessibility" data-route="accessibility" class="btn-secondary" aria-label="Accessibility">Accessibility</a>
          <a href="#support" data-route="support" class="btn-secondary" aria-label="Support">Support</a>
        </div>
      </nav>
      <main role="main">
        <div class="hero-section relative flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-[#5ED1D2] via-[#A32C2B] to-[#FBBF24] overflow-hidden">
          <h1 class="text-4xl font-bold text-white mb-4">Welcome to Windgap Academy</h1>
          <p class="text-xl text-white mb-8">Your adventure in learning starts here!</p>
          <button class="btn btn-primary btn-lg" id="get-started-btn">Get Started</button>
        </div>
        <div class="features-section py-12 px-4">
          <h2 class="text-3xl font-bold text-center mb-8">Featured Learning Modules</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <!-- Feature cards rendered by component system -->
          </div>
        </div>
      </main>
      <footer class="w-full bg-white py-6 mt-12 shadow text-center text-[#A32C2B]">
        <div class="flex flex-col md:flex-row items-center justify-center gap-6">
          <a href="#privacy" class="underline">Privacy Policy</a>
          <a href="#terms" class="underline">Terms of Service</a>
          <a href="#contact" class="underline">Contact</a>
        </div>
        <div class="mt-2 text-sm">&copy; 2025 Windgap Academy. All rights reserved.</div>
      </footer>
    `;

    // Set up the Get Started button
    const getStartedBtn = document.getElementById("get-started-btn");
    if (getStartedBtn) {
      getStartedBtn.addEventListener("click", () => {
        this.components.router.navigateTo("login");
      });
    }

    // Render feature cards using component system
    this.renderFeatureCards();
  }

  renderFeatureCards() {
    const featuresContainer = document.querySelector(".features-section .grid");
    if (!featuresContainer) return;

    const features = [
      {
        title: "Math Quest",
        description: "Sharpen your math skills in a fun adventure!",
        image: "assets/images/math-quest.jpg",
        link: "#math-quest",
      },
      {
        title: "Reading Adventure",
        description: "Improve reading comprehension through interactive stories",
        image: "assets/images/reading-adventure.jpg",
        link: "#reading-adventure",
      },
      {
        title: "Science Explorer",
        description: "Discover the wonders of science through experiments",
        image: "assets/images/science-explorer.jpg",
        link: "#science-explorer",
      },
    ];

    features.forEach((feature) => {
      const card = this.components.uiComponents.render("card", {
        title: feature.title,
        content: `
          <div class="card-img-container mb-4">
            <img src="${feature.image}" alt="${feature.title}" class="w-full h-48 object-cover rounded">
          </div>
          <p class="mb-4">${feature.description}</p>
          <a href="${feature.link}" class="btn btn-secondary">Explore</a>
        `,
      });

      featuresContainer.appendChild(card);
    });
  }

  renderLoginPage() {
    const appEl = Utils.safeQuerySelector("#app");
    if (!appEl) return;

    appEl.innerHTML = `
      <div class="flex min-h-screen">
        <div class="w-full max-w-md m-auto p-6 bg-white rounded-lg shadow-lg">
          <div class="text-center mb-6">
            <img src="assets/logo.png" alt="Windgap Academy Logo" class="h-20 w-auto mx-auto" />
            <h1 class="text-2xl font-bold mt-4 text-[#A32C2B]">Login to Windgap Academy</h1>
          </div>
          <form id="login-form" data-validate="true">
            <div class="mb-4">
              <label for="login-email" class="block mb-2 font-medium">Email</label>
              <input type="email" id="login-email" class="w-full px-4 py-2 border rounded"
                data-validate="email required" />
            </div>
            <div class="mb-6">
              <label for="login-password" class="block mb-2 font-medium">Password</label>
              <div class="relative">
                <input type="password" id="login-password" class="w-full px-4 py-2 border rounded"
                  data-validate="password required" />
                <button type="button" id="toggle-password" class="absolute right-3 top-2.5" tabindex="0"
                  aria-label="Toggle password visibility" aria-pressed="false">👁️</button>
              </div>
            </div>
            <div id="login-error" class="text-red-600 mb-4" style="display: none;"></div>
            <button type="submit" class="w-full py-2 bg-[#A32C2B] text-white rounded">Login</button>
            <div class="text-center mt-4">
              <a href="#forgot-password" class="text-[#A32C2B] text-sm">Forgot Password?</a>
              <p class="mt-2">Don't have an account? <a href="#register" class="text-[#A32C2B]">Sign Up</a></p>
            </div>
          </form>
        </div>
      </div>
    `;

    // Setup password visibility toggle
    const passwordInput = document.getElementById("login-password");
    const togglePassword = document.getElementById("toggle-password");
    if (togglePassword && passwordInput) {
      const updateToggle = (show) => {
        togglePassword.classList.toggle("active", show);
        togglePassword.setAttribute("aria-pressed", show ? "true" : "false");
        passwordInput.type = show ? "text" : "password";
        togglePassword.textContent = show ? "🙈" : "👁️";
      };

      const toggleHandler = () => updateToggle(passwordInput.type === "password");

      togglePassword.addEventListener("click", toggleHandler);
      togglePassword.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          toggleHandler();
        }
      });
    }

    // Set up login form submission
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Form will be validated by FormValidator class
        // This is just the submission handler
        const emailInput = document.getElementById("login-email");
        const passwordInput = document.getElementById("login-password");
        const errorDiv = document.getElementById("login-error");

        if (!emailInput || !passwordInput) return;

        const email = emailInput.value;
        const password = passwordInput.value;

        try {
          // Show loading state
          const submitBtn = loginForm.querySelector('button[type="submit"]');
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Logging in...";
          }

          // Mock API call (replace with actual implementation)
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Simulate successful login
          localStorage.setItem("auth_token", "mock_token");
          localStorage.setItem("user_id", "mock_user_id");

          // Navigate to dashboard
          this.components.router.navigateTo("dashboard");
        } catch (error) {
          // Show error message
          if (errorDiv) {
            errorDiv.textContent = error.message || "Login failed. Please try again.";
            errorDiv.style.display = "block";
          }

          // Reset button state
          const submitBtn = loginForm.querySelector('button[type="submit"]');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Login";
          }

          Logger.error("Login error", error);
        }
      });
    }
  }

  renderDashboard() {
    const appEl = Utils.safeQuerySelector("#app");
    if (!appEl) return;

    // Check if user is logged in
    const authToken = localStorage.getItem("auth_token");
    if (!authToken) {
      // Redirect to login
      this.components.router.navigateTo("login");
      return;
    }

    appEl.innerHTML = `
      <div class="dashboard-layout flex min-h-screen">
        <aside class="sidebar w-64 bg-[#2C3E50] text-white p-4">
          <div class="logo mb-8">
            <img src="assets/logo.png" alt="Windgap Academy Logo" class="h-12 w-auto" />
          </div>
          <nav class="sidebar-nav">
            <ul class="space-y-2">
              <li><a href="#" class="block py-2 px-4 rounded hover:bg-[#34495E] bg-[#34495E]">Dashboard</a></li>
              <li><a href="#" class="block py-2 px-4 rounded hover:bg-[#34495E]">Courses</a></li>
              <li><a href="#" class="block py-2 px-4 rounded hover:bg-[#34495E]">Achievements</a></li>
              <li><a href="#" class="block py-2 px-4 rounded hover:bg-[#34495E]">Reports</a></li>
              <li><a href="#" class="block py-2 px-4 rounded hover:bg-[#34495E]">Settings</a></li>
            </ul>
          </nav>
        </aside>
        <main class="flex-1 p-8 bg-gray-100">
          <header class="mb-8">
            <h1 class="text-3xl font-bold text-[#2C3E50]">Your Dashboard</h1>
            <p class="text-gray-600">Welcome back! Here's your learning summary.</p>
          </header>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white p-6 rounded-lg shadow">
              <h2 class="text-xl font-bold mb-4">Progress</h2>
              <div class="progress-bar mb-4">
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-[#A32C2B] h-2 rounded-full" style="width:65%"></div>
                </div>
                <div class="text-right text-sm text-gray-600">65% Complete</div>
              </div>
              <p>You're making great progress! Keep it up.</p>
            </div>

            <div class="bg-white p-6 rounded-lg shadow">
              <h2 class="text-xl font-bold mb-4">Recent Achievements</h2>
              <ul class="space-y-2">
                <li class="flex items-center">
                  <span class="text-yellow-500 mr-2">⭐</span>
                  <span>Math Master Level 2</span>
                </li>
                <li class="flex items-center">
                  <span class="text-yellow-500 mr-2">⭐</span>
                  <span>Reading Explorer</span>
                </li>
                <li class="flex items-center">
                  <span class="text-yellow-500 mr-2">⭐</span>
                  <span>5-Day Streak</span>
                </li>
              </ul>
            </div>

            <div class="bg-white p-6 rounded-lg shadow">
              <h2 class="text-xl font-bold mb-4">Daily Challenge</h2>
              <p class="mb-4">Solve the math puzzle to earn bonus points!</p>
              <button class="bg-[#A32C2B] text-white py-2 px-4 rounded">Start Challenge</button>
            </div>
          </div>

          <section class="mb-8">
            <h2 class="text-2xl font-bold mb-4">Continue Learning</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Course cards will be rendered here -->
            </div>
          </section>
        </main>
      </div>
    `;

    // Render course cards
    this.renderCourseCards();
  }

  renderCourseCards() {
    const coursesContainer = document.querySelector(".dashboard-layout main section .grid");
    if (!coursesContainer) return;

    const courses = [
      {
        title: "Math Quest: Level 3",
        progress: 80,
        image: "assets/images/math-quest.jpg",
        description: "Continue your math adventure with fractions and decimals.",
      },
      {
        title: "Reading Adventure: Chapter 4",
        progress: 60,
        image: "assets/images/reading-adventure.jpg",
        description: "Explore the enchanted forest and improve reading skills.",
      },
    ];

    courses.forEach((course) => {
      const card = this.components.uiComponents.render("card", {
        title: course.title,
        content: `
          <div class="flex items-start">
            <div class="card-img-container mr-4">
              <img src="${course.image}" alt="${course.title}" class="w-24 h-24 object-cover rounded">
            </div>
            <div>
              <p class="mb-2">${course.description}</p>
              <div class="progress-bar mb-2">
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-[#5ED1D2] h-2 rounded-full" style="width:${course.progress}%"></div>
                </div>
                <div class="text-sm text-gray-600">${course.progress}% Complete</div>
              </div>
              <button class="bg-[#A32C2B] text-white py-1 px-3 rounded text-sm">Continue</button>
            </div>
          </div>
        `,
      });

      coursesContainer.appendChild(card);
    });
  }

  renderAccessibilityPage() {
    const appEl = Utils.safeQuerySelector("#app");
    if (!appEl) return;

    appEl.innerHTML = `
      <header class="flex items-center justify-between px-8 py-4 bg-white shadow">
        <div class="flex items-center gap-3">
          <img src="assets/logo.png" alt="Windgap Academy Logo" class="h-14 w-auto animate-float" />
          <span class="text-2xl font-bold text-[#A32C2B]">Windgap Academy</span>
        </div>
        <nav>
          <a href="#home" data-route="home" class="btn-secondary" aria-label="Home">Home</a>
        </nav>
      </header>
      <main class="max-w-4xl mx-auto p-8">
        <h1 class="text-3xl font-bold mb-6">Accessibility Features</h1>

        <section class="mb-8">
          <h2 class="text-2xl font-bold mb-4">Text Options</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button class="p-4 bg-white shadow rounded text-center" id="increase-font">
              <span class="block text-2xl mb-2">A+</span>
              <span>Increase Font Size</span>
            </button>
            <button class="p-4 bg-white shadow rounded text-center" id="dyslexia-font">
              <span class="block text-2xl mb-2">Aa</span>
              <span>Dyslexia-Friendly Font</span>
            </button>
            <button class="p-4 bg-white shadow rounded text-center" id="high-contrast">
              <span class="block text-2xl mb-2">◐</span>
              <span>High Contrast Mode</span>
            </button>
          </div>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-bold mb-4">Screen Reader Support</h2>
          <p class="mb-4">Our platform works with screen readers. Try the examples below:</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 bg-white shadow rounded">
              <h3 class="font-bold mb-2">Read Aloud Sample</h3>
              <p class="mb-2">Click the button to hear this text read aloud.</p>
              <button class="bg-[#A32C2B] text-white py-2 px-4 rounded" id="read-sample">
                Read Aloud
              </button>
            </div>
            <div class="p-4 bg-white shadow rounded">
              <h3 class="font-bold mb-2">Image Descriptions</h3>
              <p class="mb-2">Images include detailed alt text for screen readers.</p>
              <img src="assets/logo.png" alt="Windgap Academy Logo - A colorful shield-shaped logo with a stylized 'W' in the center, representing learning and growth." class="h-16 w-auto mx-auto" />
            </div>
          </div>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-bold mb-4">Keyboard Navigation</h2>
          <p class="mb-4">Navigate our site using only your keyboard:</p>
          <ul class="list-disc pl-8 mb-4">
            <li>Tab: Move between interactive elements</li>
            <li>Enter/Space: Activate buttons and links</li>
            <li>Arrow Keys: Navigate within components</li>
            <li>Esc: Close dialogs and menus</li>
          </ul>
          <div class="p-4 bg-white shadow rounded">
            <h3 class="font-bold mb-2">Keyboard Navigation Test</h3>
            <p class="mb-2">Try tabbing through these buttons:</p>
            <div class="flex gap-2">
              <button class="bg-[#A32C2B] text-white py-2 px-4 rounded">Button 1</button>
              <button class="bg-[#A32C2B] text-white py-2 px-4 rounded">Button 2</button>
              <button class="bg-[#A32C2B] text-white py-2 px-4 rounded">Button 3</button>
            </div>
          </div>
        </section>
      </main>
    `;

    // Set up accessibility feature buttons
    const increaseFontBtn = document.getElementById("increase-font");
    const dyslexiaFontBtn = document.getElementById("dyslexia-font");
    const highContrastBtn = document.getElementById("high-contrast");
    const readSampleBtn = document.getElementById("read-sample");

    if (increaseFontBtn) {
      increaseFontBtn.addEventListener("click", () => {
        const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        document.documentElement.style.fontSize = `${currentSize * 1.1}px`;
      });
    }

    if (dyslexiaFontBtn) {
      dyslexiaFontBtn.addEventListener("click", () => {
        document.body.classList.toggle("dyslexia-font");
        if (document.body.classList.contains("dyslexia-font")) {
          document.body.style.fontFamily = "OpenDyslexic, sans-serif";
          document.body.style.letterSpacing = "0.05em";
          document.body.style.wordSpacing = "0.1em";
          document.body.style.lineHeight = "1.5";
        } else {
          document.body.style.fontFamily = "";
          document.body.style.letterSpacing = "";
          document.body.style.wordSpacing = "";
          document.body.style.lineHeight = "";
        }
      });
    }

    if (highContrastBtn) {
      highContrastBtn.addEventListener("click", () => {
        document.body.classList.toggle("high-contrast");
        if (document.body.classList.contains("high-contrast")) {
          document.body.style.backgroundColor = "#000";
          document.body.style.color = "#fff";
          Array.from(document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, span, div")).forEach(
            (el) => {
              if (getComputedStyle(el).color !== "rgb(255, 255, 255)") {
                el.dataset.originalColor = getComputedStyle(el).color;
                el.style.color = "#fff";
              }
            },
          );
        } else {
          document.body.style.backgroundColor = "";
          document.body.style.color = "";
          Array.from(document.querySelectorAll("[data-original-color]")).forEach((el) => {
            el.style.color = el.dataset.originalColor;
            delete el.dataset.originalColor;
          });
        }
      });
    }

    if (readSampleBtn) {
      readSampleBtn.addEventListener("click", () => {
        const text =
          "Welcome to Windgap Academy. Our platform is designed to be accessible to all users, with features that support various needs and preferences.";
        window.narrate(text);
      });
    }
  }

  renderSupportPage() {
    const appEl = Utils.safeQuerySelector("#app");
    if (!appEl) return;

    appEl.innerHTML = `
      <header class="flex items-center justify-between px-8 py-4 bg-white shadow">
        <div class="flex items-center gap-3">
          <img src="assets/logo.png" alt="Windgap Academy Logo" class="h-14 w-auto animate-float" />
          <span class="text-2xl font-bold text-[#A32C2B]">Windgap Academy</span>
        </div>
        <nav>
          <a href="#home" data-route="home" class="btn-secondary" aria-label="Home">Home</a>
        </nav>
      </header>
      <main class="max-w-4xl mx-auto p-8">
        <h1 class="text-3xl font-bold mb-6">Support Center</h1>

        <section class="mb-8">
          <h2 class="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div class="space-y-4">
            <div class="p-4 bg-white shadow rounded">
              <h3 class="font-bold mb-2">How do I reset my password?</h3>
              <p>Click on the "Forgot Password" link on the login page, and follow the instructions sent to your email.</p>
            </div>
            <div class="p-4 bg-white shadow rounded">
              <h3 class="font-bold mb-2">Can I use Windgap Academy on my tablet?</h3>
              <p>Yes! Windgap Academy is fully responsive and works on desktops, laptops, tablets, and smartphones.</p>
            </div>
            <div class="p-4 bg-white shadow rounded">
              <h3 class="font-bold mb-2">How do I track my child's progress?</h3>
              <p>Parents can create a linked account to monitor their child's learning journey. Go to Settings > Family Link to set this up.</p>
            </div>
          </div>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-bold mb-4">Contact Support</h2>
          <form id="support-form" data-validate="true" class="p-6 bg-white shadow rounded">
            <div class="mb-4">
              <label for="support-name" class="block mb-2 font-medium">Your Name</label>
              <input type="text" id="support-name" class="w-full px-4 py-2 border rounded"
                data-validate="required" />
            </div>
            <div class="mb-4">
              <label for="support-email" class="block mb-2 font-medium">Email</label>
              <input type="email" id="support-email" class="w-full px-4 py-2 border rounded"
                data-validate="email required" />
            </div>
            <div class="mb-4">
              <label for="support-topic" class="block mb-2 font-medium">Topic</label>
              <select id="support-topic" class="w-full px-4 py-2 border rounded">
                <option value="technical">Technical Issue</option>
                <option value="account">Account Question</option>
                <option value="billing">Billing</option>
                <option value="feedback">Feature Feedback</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div class="mb-6">
              <label for="support-message" class="block mb-2 font-medium">Message</label>
              <textarea id="support-message" rows="5" class="w-full px-4 py-2 border rounded"
                data-validate="required"></textarea>
            </div>
            <button type="submit" class="bg-[#A32C2B] text-white py-2 px-4 rounded">Send Message</button>
          </form>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-4">Additional Resources</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="#tutorials" class="p-4 bg-white shadow rounded text-center block">
              <span class="block text-xl mb-2">📚</span>
              <span>Video Tutorials</span>
            </a>
            <a href="#guides" class="p-4 bg-white shadow rounded text-center block">
              <span class="block text-xl mb-2">📋</span>
              <span>User Guides</span>
            </a>
            <a href="#community" class="p-4 bg-white shadow rounded text-center block">
              <span class="block text-xl mb-2">👥</span>
              <span>Community Forum</span>
            </a>
          </div>
        </section>
      </main>
    `;

    // Set up support form submission
    const supportForm = document.getElementById("support-form");
    if (supportForm) {
      supportForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Form will be validated by FormValidator class

        // Show success message
        const formContainer = supportForm.parentElement;
        if (formContainer) {
          formContainer.innerHTML = `
            <div class="text-center py-8">
              <span class="block text-5xl mb-4">✅</span>
              <h3 class="text-xl font-bold mb-2">Message Sent!</h3>
              <p class="mb-4">Thank you for reaching out. We'll get back to you within 24 hours.</p>
              <button id="new-message-btn" class="bg-[#A32C2B] text-white py-2 px-4 rounded">Send Another Message</button>
            </div>
          `;

          // Add handler to reset the form
          const newMessageBtn = document.getElementById("new-message-btn");
          if (newMessageBtn) {
            newMessageBtn.addEventListener("click", () => {
              this.renderSupportPage();
            });
          }
        }
      });
    }
  }

  showFallbackScreen(message) {
    const appEl = Utils.safeQuerySelector("#app");
    if (!appEl) {
      // If we can't find the app container, try to add to body
      document.body.innerHTML = `
        <div class="error-fallback" style="text-align:center; padding:40px; font-family:sans-serif;">
          <h1 style="color:#A32C2B;">Windgap Academy</h1>
          <p>${message}</p>
          <button onclick="window.location.reload()">Refresh Page</button>
        </div>
      `;
      return;
    }

    appEl.innerHTML = `
      <div class="error-fallback" style="text-align:center; padding:40px;">
        <img src="assets/logo.png" alt="Windgap Academy Logo" style="height:80px; margin-bottom:20px;" />
        <h1 style="color:#A32C2B;">Something went wrong</h1>
        <p>${message}</p>
        <button onclick="window.location.reload()" style="background:#A32C2B; color:white; border:none; padding:10px 20px; border-radius:4px; cursor:pointer;">
          Refresh Page
        </button>
      </div>
    `;
  }

  initPerformanceMonitoring() {
    // Performance monitoring
    const monitorPerformance = () => {
      if (window.performance && window.performance.getEntriesByType) {
        const pageNavigation = window.performance.getEntriesByType("navigation")[0];
        if (pageNavigation) {
          Logger.log("Page load performance", {
            loadTime: pageNavigation.loadEventEnd - pageNavigation.startTime,
            domContentLoaded: pageNavigation.domContentLoadedEventEnd - pageNavigation.startTime,
            firstPaint: pageNavigation.responseEnd - pageNavigation.startTime,
          });
        }
      }
    };

    // Track error rates
    const trackErrorRates = () => {
      // Initialize error tracking
      window._errorCount = window._errorCount || 0;
      window._errorRate = () => {
        return {
          count: window._errorCount,
          rate: window._errorCount / (window._pageViews || 1),
        };
      };
    };

    // Track user engagement
    const trackUserEngagement = () => {
      window._pageViews = window._pageViews || 0;
      window._pageViews++;

      let lastActivity = Date.now();
      document.addEventListener("click", () => (lastActivity = Date.now()));
      document.addEventListener("keydown", () => (lastActivity = Date.now()));
      document.addEventListener("mousemove", () => (lastActivity = Date.now()));
      document.addEventListener("scroll", () => (lastActivity = Date.now()));

      // Track session duration
      window._getSessionDuration = () => {
        return Date.now() - window._sessionStart;
      };

      window._sessionStart = window._sessionStart || Date.now();

      // Track idle time
      window._getIdleTime = () => {
        return Date.now() - lastActivity;
      };
    };

    // Schedule regular updates
    const scheduleRegularUpdates = () => {
      // Check for app updates every hour
      setInterval(
        () => {
          Logger.log("Checking for application updates");
        },
        60 * 60 * 1000,
      );
    };

    // Initialize monitoring
    monitorPerformance();
    trackErrorRates();
    trackUserEngagement();
    scheduleRegularUpdates();
  }
}

// === APPLICATION BOOTSTRAP ===
document.addEventListener("DOMContentLoaded", () => {
  const app = new AppInitializer();
  app.init().catch((error) => {
    console.error("Failed to initialize app:", error);
    // Show basic error screen if initialization fails
    document.body.innerHTML = `
      <div style="text-align:center; padding:40px; font-family:sans-serif;">
        <h1 style="color:#A32C2B;">Windgap Academy</h1>
        <p>Sorry, the application could not be loaded. Please try refreshing the page.</p>
        <button onclick="window.location.reload()">Refresh Page</button>
      </div>
    `;
  });

  // Store instance globally for debugging
  window.WindgapApp = app;
});
