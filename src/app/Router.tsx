import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SupermarketSimulation from '../../components/SupermarketSimulation';
import ClubhouseSimulation from '../../components/ClubhouseSimulation';
import KitchenSimulation from '../../components/KitchenSimulation';
import CalmSpaceSimulation from '../../components/CalmSpaceSimulation';
import ZooSimulation from '../../components/ZooSimulation';

export default function AppRouter() {
  return (
    <Router>
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
