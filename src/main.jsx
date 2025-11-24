import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AnalyticsProvider } from "./analytics";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import { LearningPreferencesProvider } from "./context/LearningPreferencesContext";
import { AuthProvider } from "./contexts/AuthContext";

// Global styles
import "./index.css";
import "./styles/accessibility.css";
import "./styles/adaptive.css";
import "./styles/neurodivergent.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <AccessibilityProvider>
          <LearningPreferencesProvider>
            <AnalyticsProvider>
              <App />
            </AnalyticsProvider>
          </LearningPreferencesProvider>
        </AccessibilityProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
