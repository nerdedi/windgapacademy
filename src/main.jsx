import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import { SoundManager } from "./audio/SoundManager";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ErrorHandler } from "./core/ErrorHandler";
import { GameMechanics } from "./core/GameMechanics";
import { UIProvider } from "./ui/UISystem";
// Ensure legacy global helper stubs are loaded early
import "./utils/legacyStubs";

// Initialize core platform systems
const initializePlatform = async () => {
  try {
    console.log("🎓 Initializing Windgap Academy Platform...");

    // Initialize error handling system
    const errorHandler = new ErrorHandler({
      enableLogging: true,
      enableReporting: true,
      enableRecovery: true,
      maxRetries: 3,
      retryDelay: 1000,
    });

    // Start performance monitoring
    errorHandler.monitorPerformance();

    // Initialize game mechanics system
    const gameMechanics = new GameMechanics();

    // Initialize audio system
    const soundManager = new SoundManager();
    await soundManager.initialize();

    // Store global platform instances
    window.WindgapPlatform = {
      errorHandler,
      gameMechanics,
      soundManager,
      version: "2.0.0",
      buildDate: new Date().toISOString(),
      initialized: true,
      features: {
        ai: true,
        physics: true,
        audio: true,
        graphics3d: true,
        accessibility: true,
        testing: true,
      },
    };

    // Dispatch platform ready event
    window.dispatchEvent(
      new CustomEvent("windgap:platform:ready", {
        detail: window.WindgapPlatform,
      }),
    );

    console.log("✅ Windgap Academy Platform Initialized Successfully");
    return true;
  } catch (error) {
    console.error("❌ Failed to initialize Windgap Academy Platform:", error);

    // Report initialization error
    if (window.WindgapPlatform?.errorHandler) {
      window.WindgapPlatform.errorHandler.handleError({
        type: "error",
        category: "system",
        message: `Platform initialization failed: ${error.message}`,
        stack: error.stack,
        severity: "critical",
      });
    }

    return false;
  }
};

// Enhanced application rendering with comprehensive error handling
const renderApp = async () => {
  const container = document.getElementById("root");

  if (!container) {
    console.error("❌ Root container not found");
    return;
  }

  const root = createRoot(container);

  // Initialize platform systems
  const initialized = await initializePlatform();

  if (!initialized) {
    // Render fallback UI if initialization fails
    root.render(
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white p-8 max-w-md">
          <div className="text-6xl mb-6">🎓</div>
          <h1 className="text-4xl font-bold mb-4">Windgap Academy</h1>
          <p className="text-lg mb-6 opacity-90">
            Platform initialization failed. Please refresh the page to try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
          >
            🔄 Retry
          </button>
          <p className="text-sm mt-4 opacity-70">
            If the problem persists, please contact support.
          </p>
        </div>
      </div>,
    );
    return;
  }

  // Render main application with comprehensive providers
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <UIProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </UIProvider>
      </ErrorBoundary>
    </React.StrictMode>,
  );
};

// Start the application with comprehensive error handling
renderApp().catch((error) => {
  console.error("💥 Critical error during app startup:", error);

  // Emergency fallback rendering
  const container = document.getElementById("root");
  if (container) {
    container.innerHTML = `
      <div style="
        min-height: 100vh;
        background: linear-gradient(135deg, #1e3a8a, #7c3aed, #1e40af);
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        color: white;
        text-align: center;
        padding: 2rem;
      ">
        <div style="max-width: 500px;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">🎓</div>
          <h1 style="font-size: 2.5rem; margin-bottom: 1rem; font-weight: 700;">
            Windgap Academy
          </h1>
          <p style="font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9;">
            We're experiencing technical difficulties. Please refresh the page or contact support if the problem persists.
          </p>
          <button
            onclick="window.location.reload()"
            style="
              background: #2563eb;
              color: white;
              border: none;
              padding: 1rem 2rem;
              border-radius: 0.75rem;
              font-size: 1rem;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s ease;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            "
            onmouseover="this.style.background='#1d4ed8'; this.style.transform='scale(1.05)'"
            onmouseout="this.style.background='#2563eb'; this.style.transform='scale(1)'"
          >
            🔄 Refresh Page
          </button>
          <p style="font-size: 0.875rem; margin-top: 1.5rem; opacity: 0.7;">
            Error: ${error.message || "Unknown error occurred"}
          </p>
        </div>
      </div>
    `;
  }
});
