export interface ErrorReport {
  id: string;
  timestamp: Date;
  type: "error" | "warning" | "info";
  category: "game" | "ui" | "audio" | "physics" | "ai" | "network" | "system";
  message: string;
  stack?: string;
  context?: any;
  userAgent?: string;
  url?: string;
  userId?: string;
  sessionId?: string;
  severity: "low" | "medium" | "high" | "critical";
  resolved?: boolean;
}

export interface ErrorHandlerConfig {
  enableLogging: boolean;
  enableReporting: boolean;
  enableRecovery: boolean;
  maxRetries: number;
  retryDelay: number;
  reportingEndpoint?: string;
}

export class ErrorHandler {
  private config: ErrorHandlerConfig;
  private errors: ErrorReport[] = [];
  private recoveryStrategies: Map<string, Function> = new Map();
  private sessionId: string;

  constructor(config: Partial<ErrorHandlerConfig> = {}) {
    this.config = {
      enableLogging: true,
      enableReporting: true,
      enableRecovery: true,
      maxRetries: 3,
      retryDelay: 1000,
      ...config,
    };

    this.sessionId = this.generateSessionId();
    this.setupGlobalErrorHandlers();
    this.setupRecoveryStrategies();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupGlobalErrorHandlers(): void {
    // Handle uncaught JavaScript errors
    window.addEventListener("error", (event) => {
      this.handleError({
        type: "error",
        category: "system",
        message: event.message,
        stack: event.error?.stack,
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
        severity: "high",
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.handleError({
        type: "error",
        category: "system",
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        context: { reason: event.reason },
        severity: "high",
      });
    });

    // Handle console errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      this.handleError({
        type: "error",
        category: "system",
        message: args.join(" "),
        severity: "medium",
      });
      originalConsoleError.apply(console, args);
    };
  }

  private setupRecoveryStrategies(): void {
    // Game recovery strategies
    this.recoveryStrategies.set("game-crash", () => {
      console.log("Attempting game recovery...");
      // Reset game state
      localStorage.removeItem("game-state");
      // Reload game component
      window.location.reload();
    });

    this.recoveryStrategies.set("audio-failure", () => {
      console.log("Attempting audio recovery...");
      // Reinitialize audio context
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContext.resume();
      } catch (error) {
        console.error("Audio recovery failed:", error);
      }
    });

    this.recoveryStrategies.set("network-error", async () => {
      console.log("Attempting network recovery...");
      // Retry network requests with exponential backoff
      let retries = 0;
      while (retries < this.config.maxRetries) {
        try {
          await new Promise((resolve) =>
            setTimeout(resolve, this.config.retryDelay * Math.pow(2, retries)),
          );
          // Test network connectivity
          await fetch("/api/health", { method: "HEAD" });
          console.log("Network recovery successful");
          break;
        } catch (error) {
          retries++;
          if (retries >= this.config.maxRetries) {
            console.error("Network recovery failed after maximum retries");
          }
        }
      }
    });

    this.recoveryStrategies.set("memory-leak", () => {
      console.log("Attempting memory cleanup...");
      // Force garbage collection if available
      if ((window as any).gc) {
        (window as any).gc();
      }
      // Clear caches
      this.clearCaches();
    });

    this.recoveryStrategies.set("ui-freeze", () => {
      console.log("Attempting UI recovery...");
      // Reset UI state
      document.body.style.pointerEvents = "auto";
      // Remove any stuck modals or overlays
      const modals = document.querySelectorAll("[data-modal], .modal, .overlay");
      modals.forEach((modal) => modal.remove());
    });
  }

  public handleError(errorData: Partial<ErrorReport>): void {
    const error: ErrorReport = {
      id: this.generateErrorId(),
      timestamp: new Date(),
      type: "error",
      category: "system",
      severity: "medium",
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: this.sessionId,
      resolved: false,
      ...errorData,
      message: errorData.message || "Unknown error occurred",
    };

    this.errors.push(error);

    if (this.config.enableLogging) {
      this.logError(error);
    }

    if (this.config.enableReporting) {
      this.reportError(error);
    }

    if (this.config.enableRecovery) {
      this.attemptRecovery(error);
    }

    // Trigger error event for listeners
    this.triggerErrorEvent(error);
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private logError(error: ErrorReport): void {
    const logLevel = this.getLogLevel(error.severity);
    const logMessage = `[${error.category.toUpperCase()}] ${error.message}`;

    switch (logLevel) {
      case "error":
        console.error(logMessage, error);
        break;
      case "warn":
        console.warn(logMessage, error);
        break;
      case "info":
        console.info(logMessage, error);
        break;
      default:
        console.log(logMessage, error);
    }
  }

  private getLogLevel(severity: ErrorReport["severity"]): string {
    switch (severity) {
      case "critical":
      case "high":
        return "error";
      case "medium":
        return "warn";
      case "low":
        return "info";
      default:
        return "log";
    }
  }

  private async reportError(error: ErrorReport): Promise<void> {
    if (!this.config.reportingEndpoint) return;

    try {
      await fetch(this.config.reportingEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(error),
      });
    } catch (reportingError) {
      console.error("Failed to report error:", reportingError);
    }
  }

  private attemptRecovery(error: ErrorReport): void {
    const recoveryKey = this.getRecoveryKey(error);
    const recoveryStrategy = this.recoveryStrategies.get(recoveryKey);

    if (recoveryStrategy) {
      try {
        recoveryStrategy();
        error.resolved = true;
        console.log(`Recovery attempted for error: ${error.id}`);
      } catch (recoveryError) {
        console.error("Recovery strategy failed:", recoveryError);
        this.handleError({
          type: "error",
          category: "system",
          message: `Recovery failed for error ${error.id}: ${recoveryError.message}`,
          severity: "high",
        });
      }
    }
  }

  private getRecoveryKey(error: ErrorReport): string {
    // Determine recovery strategy based on error characteristics
    if (error.message.includes("network") || error.message.includes("fetch")) {
      return "network-error";
    }
    if (error.message.includes("audio") || error.message.includes("sound")) {
      return "audio-failure";
    }
    if (error.message.includes("memory") || error.message.includes("heap")) {
      return "memory-leak";
    }
    if (error.message.includes("game") || error.category === "game") {
      return "game-crash";
    }
    if (error.message.includes("ui") || error.message.includes("render")) {
      return "ui-freeze";
    }
    return "default";
  }

  private clearCaches(): void {
    // Clear various caches
    try {
      if ("caches" in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        });
      }
    } catch (error) {
      console.error("Failed to clear caches:", error);
    }
  }

  private triggerErrorEvent(error: ErrorReport): void {
    const event = new CustomEvent("windgap-error", {
      detail: error,
    });
    window.dispatchEvent(event);
  }

  // Public API
  public logWarning(
    message: string,
    category: ErrorReport["category"] = "system",
    context?: any,
  ): void {
    this.handleError({
      type: "warning",
      category,
      message,
      context,
      severity: "low",
    });
  }

  public logInfo(
    message: string,
    category: ErrorReport["category"] = "system",
    context?: any,
  ): void {
    this.handleError({
      type: "info",
      category,
      message,
      context,
      severity: "low",
    });
  }

  public getErrors(filter?: Partial<ErrorReport>): ErrorReport[] {
    if (!filter) return [...this.errors];

    return this.errors.filter((error) => {
      return Object.entries(filter).every(([key, value]) => {
        return error[key as keyof ErrorReport] === value;
      });
    });
  }

  public getErrorStats(): {
    total: number;
    byCategory: Record<string, number>;
    bySeverity: Record<string, number>;
    resolved: number;
    unresolved: number;
  } {
    const stats = {
      total: this.errors.length,
      byCategory: {} as Record<string, number>,
      bySeverity: {} as Record<string, number>,
      resolved: 0,
      unresolved: 0,
    };

    this.errors.forEach((error) => {
      // Count by category
      stats.byCategory[error.category] = (stats.byCategory[error.category] || 0) + 1;

      // Count by severity
      stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1;

      // Count resolved/unresolved
      if (error.resolved) {
        stats.resolved++;
      } else {
        stats.unresolved++;
      }
    });

    return stats;
  }

  public clearErrors(): void {
    this.errors = [];
  }

  public addRecoveryStrategy(key: string, strategy: Function): void {
    this.recoveryStrategies.set(key, strategy);
  }

  public removeRecoveryStrategy(key: string): void {
    this.recoveryStrategies.delete(key);
  }

  // Performance monitoring
  public monitorPerformance(): void {
    // Monitor FPS
    let lastTime = performance.now();
    let frameCount = 0;

    const checkFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        const fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;

        if (fps < 30) {
          this.handleError({
            type: "warning",
            category: "system",
            message: `Low FPS detected: ${fps}`,
            severity: "medium",
            context: { fps },
          });
        }
      }

      requestAnimationFrame(checkFPS);
    };

    requestAnimationFrame(checkFPS);

    // Monitor memory usage
    if ("memory" in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        const usedMB = memory.usedJSHeapSize / 1024 / 1024;
        const limitMB = memory.jsHeapSizeLimit / 1024 / 1024;

        if (usedMB > limitMB * 0.9) {
          this.handleError({
            type: "warning",
            category: "system",
            message: `High memory usage: ${usedMB.toFixed(2)}MB / ${limitMB.toFixed(2)}MB`,
            severity: "high",
            context: { usedMB, limitMB },
          });
        }
      }, 5000);
    }
  }

  public dispose(): void {
    this.errors = [];
    this.recoveryStrategies.clear();
  }
}

export default ErrorHandler;
