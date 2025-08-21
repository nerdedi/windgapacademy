// Tooltip logic
export function showTooltip(target, message) {
  const tip = document.createElement("div");
  tip.className = "tooltip";
  tip.innerText = message;
  document.body.appendChild(tip);
  const rect = target.getBoundingClientRect();
  tip.style.top = `${rect.bottom + 8}px`;
  tip.style.left = `${rect.left}px`;
  setTimeout(() => tip.remove(), 2500);
}
