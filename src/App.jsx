import React, { useState, useEffect } from 'react';
import AppRouter from './app/Router';
import { UserProvider, useUser } from './app/UserContext';
import SimulationManager from './simulation/SimulationManager';

function MainApp() {
  const [showLogin, setShowLogin] = useState(true);
  const [inputId, setInputId] = useState('');
  const { userId, setUserId } = useUser();

  async function handleLogin() {
    if (inputId.trim()) {
      setUserId(inputId.trim());
      setShowLogin(false);
      await SimulationManager.fetchProgressFromBackend(inputId.trim());
    }
  }

  useEffect(() => {
    if (userId) {
      SimulationManager.saveProgressToBackend(userId);
    }
  }, [userId, SimulationManager.state]);

  if (showLogin) {
    return (
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Enter User ID"
          value={inputId}
          onChange={e => setInputId(e.target.value)}
          aria-label="User ID"
        />
        <button onClick={handleLogin} style={{ marginLeft: '1rem' }}>Login</button>
      </main>
    );
  }

  return <AppRouter />;
}

export default function AppWithProvider() {
  return (
    <UserProvider>
      <MainApp />
    </UserProvider>
  );
}
