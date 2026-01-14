import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
// Ensure legacy global helper stubs are loaded early
import "./utils/legacyStubs";

// Hide static HTML content when React app loads
// The index.html has legacy static content that should be hidden when React takes over
function hideStaticContent() {
  // Hide the main static content container and all its children
  const mainContent = document.getElementById("main-content");
  if (mainContent) mainContent.style.display = "none";

  // Hide all sections, header, nav, and footer from static HTML
  document
    .querySelectorAll(
      "body > header, body > nav, body > main, body > section, body > footer, #main-content, .hero-section, #about, #features",
    )
    .forEach((el) => {
      if (el && !el.closest("#root")) {
        el.style.display = "none";
      }
    });

  // Also hide any content that's not inside #root
  document.querySelectorAll("header, nav, main, section, footer").forEach((el) => {
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
