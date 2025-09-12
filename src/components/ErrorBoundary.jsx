import React from "react";
import { motion } from "framer-motion";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // Report error to global error handler if available
    if (window.WindgapPlatform?.errorHandler) {
      window.WindgapPlatform.errorHandler.handleError({
        type: "error",
        category: "ui",
        message: `React Error Boundary: ${error.message}`,
        stack: error.stack,
        context: {
          componentStack: errorInfo.componentStack,
          errorBoundary: true,
        },
        severity: "high",
      });
    }

    // Dispatch error event
    window.dispatchEvent(
      new CustomEvent("windgap:error:boundary", {
        detail: { error, errorInfo, errorId: this.state.errorId },
      }),
    );
  }

  handleRetry = () => {
    // Reset error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });

    // Attempt to recover by reloading the page
    window.location.reload();
  };

  handleReportError = () => {
    const { error, errorInfo, errorId } = this.state;

    // Create error report
    const errorReport = {
      id: errorId,
      timestamp: new Date().toISOString(),
      error: {
        message: error?.message,
        stack: error?.stack,
        name: error?.name,
      },
      errorInfo: {
        componentStack: errorInfo?.componentStack,
      },
      userAgent: navigator.userAgent,
      url: window.location.href,
      platform: "Windgap Academy",
      version: window.WindgapPlatform?.version || "unknown",
    };

    // Copy to clipboard
    navigator.clipboard
      .writeText(JSON.stringify(errorReport, null, 2))
      .then(() => {
        alert("Error report copied to clipboard. Please send this to support.");
      })
      .catch(() => {
        // Fallback: show error report in a new window
        const reportWindow = window.open("", "_blank");
        reportWindow.document.write(`
          <html>
            <head><title>Error Report</title></head>
            <body>
              <h1>Windgap Academy Error Report</h1>
              <pre>${JSON.stringify(errorReport, null, 2)}</pre>
              <p>Please copy this information and send it to support.</p>
            </body>
          </html>
        `);
      });
  };

  render() {
    if (this.state.hasError) {
      const { error, errorId } = this.state;

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
          <motion.div
            className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 max-w-2xl w-full text-white shadow-2xl border border-white border-opacity-20"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Error Icon */}
            <motion.div
              className="text-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-3xl font-bold mb-2">Oops! Something went wrong</h1>
              <p className="text-lg opacity-90">
                We encountered an unexpected error in the application.
              </p>
            </motion.div>

            {/* Error Details */}
            <motion.div
              className="bg-black bg-opacity-30 rounded-lg p-4 mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="font-semibold mb-2">Error Details:</h3>
              <p className="text-sm font-mono opacity-80 mb-2">ID: {errorId}</p>
              <p className="text-sm opacity-80">{error?.message || "Unknown error occurred"}</p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <button
                onClick={this.handleRetry}
                className="flex-1 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                Retry
              </button>

              <button
                onClick={this.handleReportError}
                className="flex-1 bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>📋</span>
                Report Error
              </button>

              <button
                onClick={() => (window.location.href = "/")}
                className="flex-1 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>🏠</span>
                Go Home
              </button>
            </motion.div>

            {/* Additional Help */}
            <motion.div
              className="mt-6 text-center text-sm opacity-70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p>
                If this problem persists, please contact our support team with the error ID above.
              </p>
            </motion.div>

            {/* Development Mode Details */}
            {process.env.NODE_ENV === "development" && (
              <motion.details
                className="mt-6 bg-black bg-opacity-30 rounded-lg p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <summary className="cursor-pointer font-semibold mb-2">
                  🔧 Development Details
                </summary>
                <div className="text-xs font-mono opacity-80 whitespace-pre-wrap">
                  <strong>Error:</strong>
                  {error?.stack || error?.message || "No error details available"}
                  {this.state.errorInfo?.componentStack && (
                    <>
                      <br />
                      <br />
                      <strong>Component Stack:</strong>
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </div>
              </motion.details>
            )}
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
