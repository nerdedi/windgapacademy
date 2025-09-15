import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Import components
import AppleQualityHomepage from "./components/AppleQualityHomepage";
import PremiumGameHub from "./components/PremiumGameHub";
import SimpleCityBuilder from "./components/SimpleCityBuilder";

// Professional loading component
function ProfessionalLoader() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg font-medium">Loading Experience...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Suspense fallback={<ProfessionalLoader />}>
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<AppleQualityHomepage />} />
          <Route path="/home" element={<AppleQualityHomepage />} />
          <Route path="/games" element={<PremiumGameHub />} />
          <Route path="/city-builder" element={<SimpleCityBuilder />} />

          {/* Redirects */}
          <Route path="/game" element={<Navigate to="/games" replace />} />
          <Route path="/working-city" element={<Navigate to="/city-builder" replace />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
