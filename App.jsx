import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const GameZone = lazy(() => import('./pages/GameZone'));
const CalmSpace = lazy(() => import('./pages/CalmSpace'));
const Avatar = lazy(() => import('./pages/Avatar'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/game" element={<GameZone />} />
        <Route path="/calm" element={<CalmSpace />} />
        <Route path="/avatar" element={<Avatar />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
