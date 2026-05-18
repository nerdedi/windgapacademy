/* eslint-disable import/order */
import React, { Suspense, lazy } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";

import Navbar from "../../components/Navbar.jsx";

import ErrorBoundary from "../components/ErrorBoundary.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

// Inline pages for access/routing errors — no async loading needed
function UnauthorizedPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
      <div className="text-6xl mb-4">🔒</div>
      <h1 className="text-3xl font-bold text-red-700 mb-2">Access Denied</h1>
      <p className="text-gray-600 mb-6 max-w-md">
        You don&apos;t have permission to view this page. Please sign in with the correct account or
        contact your educator for access.
      </p>
      <Link
        to="/"
        className="px-5 py-2 bg-[#0B6E8F] text-white rounded-lg font-semibold hover:bg-[#095a75]"
      >
        ← Back to Home
      </Link>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
      <div className="text-6xl mb-4">🗺️</div>
      <h1 className="text-3xl font-bold text-gray-700 mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-6 max-w-md">
        We couldn&apos;t find what you were looking for. Let&apos;s get you back on track!
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <Link
          to="/"
          className="px-5 py-2 bg-[#0B6E8F] text-white rounded-lg font-semibold hover:bg-[#095a75]"
        >
          🏠 Home
        </Link>
        <Link
          to="/games"
          className="px-5 py-2 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600"
        >
          🎮 Games
        </Link>
        <Link
          to="/courses"
          className="px-5 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600"
        >
          📚 Courses
        </Link>
      </div>
    </div>
  );
}

// Lazy load all major components
const HomePage = lazy(() => import("../pages/HomePage.jsx"));
const EducatorDashboard = lazy(() => import("../pages/EducatorDashboard.jsx"));
const LearnerDashboard = lazy(() => import("../pages/LearnerDashboard.jsx"));
const GamePlayground = lazy(() => import("../../components/GameModules/GamePlayground.jsx"));
const CalmSpaceSimulation = lazy(() => import("../../components/CalmSpaceSimulation.jsx"));
const ClubhouseSimulation = lazy(() => import("../../components/ClubhouseSimulation.jsx"));
const KitchenSimulation = lazy(() => import("../../components/KitchenSimulation.jsx"));
const SupermarketSimulation = lazy(() => import("../../components/SupermarketSimulation.jsx"));
const ZooSimulation = lazy(() => import("../../components/ZooSimulation.jsx"));

// Additional learning components
const VirtualWorld = lazy(() => import("../components/VirtualWorld.jsx"));
const GameArcade = lazy(() => import("../components/GameArcade.jsx"));
const AvatarBuilder = lazy(() => import("../components/AvatarBuilder.jsx"));
const LessonPlayer = lazy(() =>
  import("../components/LessonPlayer.jsx").then((m) => ({ default: m.LessonPlayer })),
);
const Leaderboard = lazy(() =>
  import("../components/Leaderboard.jsx").then((m) => ({ default: m.Leaderboard })),
);
const CourseLibrary = lazy(() =>
  import("../components/CourseLibrary.jsx").then((m) => ({ default: m.CourseLibrary })),
);
const Dashboard = lazy(() =>
  import("../components/Dashboard.jsx").then((m) => ({ default: m.Dashboard })),
);

export default function AppRouter() {
  return (
    <>
      <Navbar />
      <nav
        aria-label="Main Navigation"
        className="mb-4 p-4 bg-gray-100 rounded-lg flex flex-wrap gap-3 justify-center shadow-sm"
      >
        <Link
          to="/"
          className="px-3 py-2 rounded-md bg-white shadow-sm hover:bg-blue-50 font-semibold"
        >
          🏠 Home
        </Link>
        <Link
          to="/courses"
          className="px-3 py-2 rounded-md bg-white shadow-sm hover:bg-blue-50 font-semibold"
        >
          📚 Courses
        </Link>
        <Link
          to="/lessons"
          className="px-3 py-2 rounded-md bg-white shadow-sm hover:bg-blue-50 font-semibold"
        >
          📖 Lessons
        </Link>
        <Link
          to="/games"
          className="px-3 py-2 rounded-md bg-white shadow-sm hover:bg-blue-50 font-semibold"
        >
          🎮 Games
        </Link>
        <Link
          to="/virtual-world"
          className="px-3 py-2 rounded-md bg-white shadow-sm hover:bg-blue-50 font-semibold"
        >
          🌏 Virtual World
        </Link>
        <Link
          to="/leaderboard"
          className="px-3 py-2 rounded-md bg-white shadow-sm hover:bg-blue-50 font-semibold"
        >
          🏆 Leaderboard
        </Link>
        <Link
          to="/avatar"
          className="px-3 py-2 rounded-md bg-white shadow-sm hover:bg-blue-50 font-semibold"
        >
          👤 Avatar
        </Link>
      </nav>

      {/* Simulation quick links */}
      <nav
        aria-label="Simulation Areas"
        className="mb-4 p-3 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg flex flex-wrap gap-2 justify-center"
      >
        <span className="text-sm font-semibold text-gray-600 mr-2">Simulations:</span>
        <Link
          to="/supermarket"
          className="px-2 py-1 text-sm rounded bg-yellow-100 hover:bg-yellow-200"
        >
          🛒 Supermarket
        </Link>
        <Link to="/clubhouse" className="px-2 py-1 text-sm rounded bg-green-100 hover:bg-green-200">
          🏠 Clubhouse
        </Link>
        <Link to="/kitchen" className="px-2 py-1 text-sm rounded bg-orange-100 hover:bg-orange-200">
          🍳 Kitchen
        </Link>
        <Link to="/calmspace" className="px-2 py-1 text-sm rounded bg-blue-100 hover:bg-blue-200">
          🧘 CalmSpace
        </Link>
        <Link to="/zoo" className="px-2 py-1 text-sm rounded bg-pink-100 hover:bg-pink-200">
          🦁 Zoo
        </Link>
      </nav>

      <ErrorBoundary>
        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
          <Routes>
            {/* Main pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Role-based dashboards */}
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

            {/* Learning components */}
            <Route path="/courses" element={<CourseLibrary />} />
            <Route path="/lessons" element={<LessonPlayer />} />
            <Route path="/learn" element={<LessonPlayer />} />

            {/* Games and entertainment */}
            <Route path="/games" element={<GameArcade />} />
            <Route path="/game" element={<GamePlayground />} />
            <Route path="/arcade" element={<GameArcade />} />
            <Route path="/leaderboard" element={<Leaderboard />} />

            {/* Virtual World and Avatar */}
            <Route path="/virtual-world" element={<VirtualWorld />} />
            <Route path="/world" element={<VirtualWorld />} />
            <Route path="/avatar" element={<AvatarBuilder />} />
            <Route path="/avatar-builder" element={<AvatarBuilder />} />

            {/* Simulations */}
            <Route path="/supermarket" element={<SupermarketSimulation />} />
            <Route path="/clubhouse" element={<ClubhouseSimulation />} />
            <Route path="/kitchen" element={<KitchenSimulation />} />
            <Route path="/calmspace" element={<CalmSpaceSimulation />} />
            <Route path="/zoo" element={<ZooSimulation />} />

            {/* Backwards compatible redirects */}
            <Route path="/trainer" element={<Navigate to="/educator" replace />} />
            <Route path="/student" element={<Navigate to="/learner" replace />} />
            <Route path="/assignments" element={<Navigate to="/courses" replace />} />
            <Route path="/materials" element={<Navigate to="/courses" replace />} />

            {/* Error pages */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
