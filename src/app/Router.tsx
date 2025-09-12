/* eslint-disable import/order */
import React, { Suspense, lazy } from "react";
import { Route, Routes, Navigate, Link } from "react-router-dom";

import Navbar from "../../components/Navbar.jsx";

import ErrorBoundary from "../components/ErrorBoundary.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
const HomePage = lazy(() => import("../components/Home.jsx"));
const EducatorDashboard = lazy(() => import("../pages/EducatorDashboard.jsx"));
const LearnerDashboard = lazy(() => import("../pages/LearnerDashboard.jsx"));
const GamePlayground = lazy(() => import("../../components/GameModules/GamePlayground.jsx"));
const CalmSpaceSimulation = lazy(() => import("../../components/CalmSpaceSimulation.jsx"));
const ClubhouseSimulation = lazy(() => import("../../components/ClubhouseSimulation.jsx"));
const KitchenSimulation = lazy(() => import("../../components/KitchenSimulation.jsx"));
const SupermarketSimulation = lazy(() => import("../../components/SupermarketSimulation.jsx"));
const ZooSimulation = lazy(() => import("../../components/ZooSimulation.jsx"));

export default function AppRouter() {
  return (
    <>
      <Navbar />
      <nav
        aria-label="Simulation Areas"
        className="mb-4 p-4 bg-gray-200 rounded flex gap-4 justify-center"
      >
        <Link to="/supermarket" className="font-bold">
          Supermarket
        </Link>
        <Link to="/clubhouse" className="font-bold">
          Clubhouse
        </Link>
        <Link to="/kitchen" className="font-bold">
          Kitchen
        </Link>
        <Link to="/calmspace" className="font-bold">
          CalmSpace
        </Link>
        <Link to="/zoo" className="font-bold">
          Zoo
        </Link>
      </nav>
      <ErrorBoundary>
        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/signup" element={<Navigate to="/learner-dashboard" replace />} />
            <Route path="/signin" element={<Navigate to="/learner-dashboard" replace />} />
            <Route path="/games" element={<GamePlayground />} />
            <Route
              path="/help"
              element={
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold">Help Center</h1>
                  <p>Coming soon!</p>
                </div>
              }
            />
            <Route
              path="/contact"
              element={
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold">Contact Us</h1>
                  <p>Coming soon!</p>
                </div>
              }
            />
            <Route
              path="/privacy"
              element={
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold">Privacy Policy</h1>
                  <p>Coming soon!</p>
                </div>
              }
            />
            <Route
              path="/terms"
              element={
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold">Terms of Service</h1>
                  <p>Coming soon!</p>
                </div>
              }
            />
            <Route
              path="/analytics"
              element={
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold">Analytics</h1>
                  <p>Coming soon!</p>
                </div>
              }
            />
            <Route
              path="/characters"
              element={
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold">Meet Our Characters</h1>
                  <p>Andy, Daisy, Natalie, and Winnie!</p>
                </div>
              }
            />
            <Route
              path="/character/:name"
              element={
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold">Character Profile</h1>
                  <p>Coming soon!</p>
                </div>
              }
            />

            <Route
              path="/educator"
              element={
                <ProtectedRoute role="educator">
                  <EducatorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/learner"
              element={
                <ProtectedRoute role="learner">
                  <LearnerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/educator-dashboard"
              element={
                <ProtectedRoute role="educator">
                  <EducatorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/learner-dashboard"
              element={
                <ProtectedRoute role="learner">
                  <LearnerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute role="learner">
                  <LearnerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Backwards compatible redirects */}
            <Route path="/trainer" element={<Navigate to="/educator" replace />} />
            <Route path="/student" element={<Navigate to="/learner" replace />} />

            <Route path="/game" element={<GamePlayground />} />
            <Route path="/assignments" element={<div>Assignments</div>} />
            <Route path="/materials" element={<div>Materials</div>} />
            <Route path="/" element={<Navigate to="/supermarket" />} />
            <Route path="/supermarket" element={<SupermarketSimulation />} />
            <Route path="/clubhouse" element={<ClubhouseSimulation />} />
            <Route path="/kitchen" element={<KitchenSimulation />} />
            <Route path="/calmspace" element={<CalmSpaceSimulation />} />
            <Route path="/zoo" element={<ZooSimulation />} />
            {/* catch-all: redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
