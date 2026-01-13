import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
// Ensure legacy global helper stubs are loaded early
import "./utils/legacyStubs";

// Hide static HTML content when React app loads
// The index.html has legacy static content that should be hidden when React takes over
function hideStaticContent() {
  // Hide all sections and footer from static HTML
  document
    .querySelectorAll("body > header, body > nav, body > section, body > footer")
    .forEach((el) => {
      if (el && !el.closest("#root")) {
        el.style.display = "none";
      }
    });
  // Hide legacy dashboard view if exists
  const legacyDashboard = document.getElementById("dashboard-view");
  if (legacyDashboard) legacyDashboard.style.display = "none";
  const gameContainer = document.getElementById("game-container");
  if (gameContainer) gameContainer.style.display = "none";
  // Disable legacy auth check
  window.checkAuth = () => {};
}

const container = document.getElementById("root");
if (container) {
  // Hide static HTML before mounting React
  hideStaticContent();

  const root = createRoot(container);
  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
}
