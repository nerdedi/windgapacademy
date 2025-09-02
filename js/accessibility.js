// Accessibility helpers
export function addAriaLabels() {
  const nav = document.querySelector("nav");
  if (nav) nav.setAttribute("aria-label", "Main Navigation");
  const main = document.querySelector("main");
  if (main) main.setAttribute("role", "main");
  const footer = document.querySelector("footer");
  if (footer) footer.setAttribute("aria-label", "Footer Information");
  const app = document.getElementById("app");
  if (app) app.setAttribute("aria-label", "Windgap Academy Main App");
}

export function enableKeyboardNavigation() {
  document.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      const focusable = Array.from(document.querySelectorAll("button, [tabindex], input, select"));
      const index = focusable.indexOf(document.activeElement);
      const next = focusable[(index + 1) % focusable.length];
      if (next) next.focus();
      e.preventDefault();
    }
  });
}
