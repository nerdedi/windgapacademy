// Transition animation logic
export function animateTransition(container, animation = "fade") {
  container.classList.add(`transition-${animation}`);
  setTimeout(() => container.classList.remove(`transition-${animation}`), 600);
}
