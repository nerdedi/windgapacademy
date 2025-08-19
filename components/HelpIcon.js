// Help icon logic
export function addHelpIcon(container, helpText) {
  const icon = document.createElement('span');
  icon.className = 'help-icon';
  icon.innerText = '❓';
  icon.tabIndex = 0;
  icon.setAttribute('aria-label', 'Help');
  icon.onclick = () => alert(helpText);
  container.appendChild(icon);
}
