// Improved error message logic
export function showErrorMessage(container, message) {
  container.innerHTML = `<div class='error-message' role='alert'>${message}</div>`;
}
