/**
 * Windgap Academy Error Handler
 * Professional error handling and recovery system
 */

export class ErrorHandler {
  constructor() {
    this.errors = [];
    this.listeners = [];
    this.maxErrors = 100;
  }

  handleError(error, context = {}) {
    const errorInfo = {
      id: Date.now().toString(),
      message: error.message || error,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      type: error.name || "Error",
    };

    this.errors.unshift(errorInfo);

    // Keep only recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Notify listeners
    this.listeners.forEach((listener) => {
      try {
        listener(errorInfo);
      } catch (e) {
        console.error("Error in error handler listener:", e);
      }
    });

    // Log error
    console.error("Windgap Academy Error:", errorInfo);

    return errorInfo;
  }

  addListener(listener) {
    this.listeners.push(listener);
  }

  removeListener(listener) {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  getRecentErrors(count = 10) {
    return this.errors.slice(0, count);
  }

  clearErrors() {
    this.errors = [];
  }
}
