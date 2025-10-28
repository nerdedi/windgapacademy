import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AnalyticsProvider } from "./analytics";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import { LearningPreferencesProvider } from "./context/LearningPreferencesContext";
import { AuthProvider } from "./contexts/AuthContext";

// Import global styles
import "../styles/tailwind.css";
import "../styles/themes.css";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
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
