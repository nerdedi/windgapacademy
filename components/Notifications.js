// Notification logic for milestones
export function showNotification(type, message) {
  const notif = document.createElement("div");
  notif.className = `notification ${type} show`;
  notif.setAttribute("tabindex", "0");
  notif.innerText = message;
  document.body.appendChild(notif);
  setTimeout(() => notif.classList.remove("show"), 3000);
  setTimeout(() => notif.remove(), 3500);
}
