// UI Manager - centralized UI utilities
// Re-exports from UnifiedUIManager for compatibility

export { UnifiedUIManager } from "../src/components/UnifiedUIManager.js";

// Legacy compatibility layer
export class UIManager {
  constructor() {
    this.notifications = [];
    this.modals = [];
  }

  showNotification(message, type = "info", duration = 3000) {
    const notification = document.createElement("div");
    notification.className = `notification ${type} show`;
    notification.textContent = message;
    notification.setAttribute("role", "alert");
    notification.setAttribute("aria-live", "polite");
    document.body.appendChild(notification);

    this.notifications.push(notification);

    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        notification.remove();
        this.notifications = this.notifications.filter((n) => n !== notification);
      }, 300);
    }, duration);

    return notification;
  }

  showModal(content, options = {}) {
    const { title = "", onClose = null, closable = true } = options;

    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.style.cssText =
      "position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;";

    const modal = document.createElement("div");
    modal.className = "modal";
    modal.style.cssText =
      "background:#fff;border-radius:12px;padding:24px;max-width:500px;width:90%;max-height:80vh;overflow:auto;";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    let html = "";
    if (title) {
      html += `<h2 class="text-xl font-bold mb-4">${title}</h2>`;
    }
    html += `<div class="modal-content">${content}</div>`;
    if (closable) {
      html += `<button class="modal-close mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Close</button>`;
    }

    modal.innerHTML = html;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    this.modals.push(overlay);

    const closeModal = () => {
      overlay.remove();
      this.modals = this.modals.filter((m) => m !== overlay);
      if (onClose) onClose();
    };

    if (closable) {
      modal.querySelector(".modal-close").onclick = closeModal;
      overlay.onclick = (e) => {
        if (e.target === overlay) closeModal();
      };
    }

    return { close: closeModal };
  }

  showLoading(message = "Loading...") {
    return this.showModal(
      `<div class="text-center"><div class="spinner mb-2"></div><p>${message}</p></div>`,
      { closable: false },
    );
  }

  showError(message) {
    return this.showNotification(message, "error", 5000);
  }

  showSuccess(message) {
    return this.showNotification(message, "success", 3000);
  }
}

// Singleton instance
export default new UIManager();
