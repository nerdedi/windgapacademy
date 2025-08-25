// uiUtils.js - Shared UI animation and style utilities for Windgap Academy

/**
 * Apply standardized animation and styles to a button element.
 * Adds classes and triggers GSAP animation if available.
 * @param {HTMLElement} btn - The button element to animate.
 */
export function applyButtonAnimation(btn) {
  if (!btn) return;
  btn.classList.add("btn-primary", "animate-ease-in-out");
  if (window.gsap) {
    window.gsap.from(btn, { scale: 0.8, duration: 0.6, ease: "elastic.out(1, 0.5)" });
  }
}

/**
 * Apply standardized animation and styles to a heading element.
 * Adds classes for card and anticipation animation.
 * @param {HTMLElement} heading - The heading element to animate.
 */
export function applyHeadingAnimation(heading) {
  if (!heading) return;
  heading.classList.add("card", "animate-anticipate");
}

/**
 * Utility to set ARIA attributes for accessibility.
 * @param {HTMLElement} el - The element to set ARIA attributes on.
 * @param {Object} attrs - Key-value pairs of ARIA attributes.
 */
export function setAriaAttributes(el, attrs = {}) {
  if (!el) return;
  Object.entries(attrs).forEach(([key, value]) => {
    el.setAttribute(`aria-${key}`, value);
  });
}
