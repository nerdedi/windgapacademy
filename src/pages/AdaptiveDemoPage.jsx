// Portions of this file were generated with the assistance of GitHub Copilot

import React, { useState } from "react";
import { AdaptiveUIProvider } from "../adaptive";
import { AnalyticsProvider } from "../analytics";
import AdaptiveUIDemo from "./AdaptiveUIDemo";

/**
 * AdaptiveDemoPage - Demonstration page for the Adaptive UI System
 * 
 * This page showcases the Adaptive UI System capabilities by allowing
 * users to explore different configurations and see how the UI adapts.
 */
const AdaptiveDemoPage = () => {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [adaptationsEnabled, setAdaptationsEnabled] = useState(true);
  
  return (
    <AnalyticsProvider
      enabled={analyticsEnabled}
      privacySettings={{
        allowLearningAnalysis: true,
        allowPersonalization: true,
        allowThirdPartySharing: false
      }}
    >
      <AdaptiveUIProvider enabled={adaptationsEnabled}>
        <div className="adaptive-demo-page">
          <header className="adaptive-demo-page__header">
            <h1>Adaptive UI System Demo</h1>
            <p>
              This demo showcases the Windgap Academy's Adaptive UI System,
              which personalizes the user interface based on learning styles,
              device capabilities, and usage patterns.
            </p>
            
            <div className="adaptive-demo-page__controls">
              <label>
                <input
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={() => setAnalyticsEnabled(!analyticsEnabled)}
                />
                Analytics Enabled
              </label>
              
              <label>
                <input
                  type="checkbox"
                  checked={adaptationsEnabled}
                  onChange={() => setAdaptationsEnabled(!adaptationsEnabled)}
                />
                Adaptations Enabled
              </label>
            </div>
          </header>
          
          <main>
            <AdaptiveUIDemo />
          </main>
          
          <footer className="adaptive-demo-page__footer">
            <p>
              Windgap Academy &copy; {new Date().getFullYear()} - 
              Adaptive UI System v1.0.0
            </p>
          </footer>
        </div>
      </AdaptiveUIProvider>
    </AnalyticsProvider>
  );
};

export default AdaptiveDemoPage;