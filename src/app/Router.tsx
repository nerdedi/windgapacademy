import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import CalmSpaceSimulation from "../../components/CalmSpaceSimulation.jsx";
import ClubhouseSimulation from "../../components/ClubhouseSimulation.jsx";
import KitchenSimulation from "../../components/KitchenSimulation.jsx";
import SupermarketSimulation from "../../components/SupermarketSimulation.jsx";
import ZooSimulation from "../../components/ZooSimulation.jsx";

export default function AppRouter() {
  return (
    <Router>
      <nav
        aria-label="Simulation Areas"
        style={{
          marginBottom: "1rem",
          padding: "1rem",
          background: "#e3e3e3",
          borderRadius: "8px",
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
        }}
      >
        <a href="/supermarket" style={{ textDecoration: "none", fontWeight: "bold" }}>
          Supermarket
        </a>
        <a href="/clubhouse" style={{ textDecoration: "none", fontWeight: "bold" }}>
          Clubhouse
        </a>
        <a href="/kitchen" style={{ textDecoration: "none", fontWeight: "bold" }}>
          Kitchen
        </a>
        <a href="/calmspace" style={{ textDecoration: "none", fontWeight: "bold" }}>
          CalmSpace
        </a>
        <a href="/zoo" style={{ textDecoration: "none", fontWeight: "bold" }}>
          Zoo
        </a>
      </nav>
      <Routes>
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
