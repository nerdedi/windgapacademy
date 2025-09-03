import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import HomePage from "../pages/HomePage.jsx";
import TrainerDashboard from "../pages/TrainerDashboard.jsx";
import StudentDashboard from "../pages/StudentDashboard.jsx";
import ProtectedRoute from "./ProtectedRoute";
import CalmSpaceSimulation from "../../components/CalmSpaceSimulation.jsx";
import ClubhouseSimulation from "../../components/ClubhouseSimulation.jsx";
import KitchenSimulation from "../../components/KitchenSimulation.jsx";
import SupermarketSimulation from "../../components/SupermarketSimulation.jsx";
import ZooSimulation from "../../components/ZooSimulation.jsx";
import Navbar from "../../components/Navbar.jsx";

export default function AppRouter() {
  return (
    <Router>
      <Navbar />
      <nav aria-label="Simulation Areas" className="mb-4 p-4 bg-gray-200 rounded flex gap-4 justify-center">
        <a href="/supermarket" className="font-bold">Supermarket</a>
        <a href="/clubhouse" className="font-bold">Clubhouse</a>
        <a href="/kitchen" className="font-bold">Kitchen</a>
        <a href="/calmspace" className="font-bold">CalmSpace</a>
        <a href="/zoo" className="font-bold">Zoo</a>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route
          path="/trainer"
          element={
            <ProtectedRoute role="trainer">
              <TrainerDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/assignments" element={<div>Assignments</div>} />
        <Route path="/materials" element={<div>Materials</div>} />
        <Route path="/" element={<Navigate to="/supermarket" />} />
        <Route path="/supermarket" element={<SupermarketSimulation />} />
        <Route path="/clubhouse" element={<ClubhouseSimulation />} />
        <Route path="/kitchen" element={<KitchenSimulation />} />
        <Route path="/calmspace" element={<CalmSpaceSimulation />} />
        <Route path="/zoo" element={<ZooSimulation />} />
      </Routes>
    </Router>
  );
}
