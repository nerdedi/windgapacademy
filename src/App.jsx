import React, { useState, useEffect } from "react";

import { loginUser, auth } from "../firebase.js";

import AppRouter from "./app/Router";
import { UserProvider, useUser } from "./app/UserContext";
import SimulationManager from "./simulation/SimulationManager";

function MainApp() {
  const [showLogin, setShowLogin] = useState(true);
  const [inputId, setInputId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user, setUser } = useUser();

  async function handleLogin() {
    setError("");
    if (!inputId || !inputId.trim()) {
      setError("User ID / Email is required.");
      return;
    }

    const id = inputId.trim();
    try {
      // If Firebase auth is available and input looks like an email, attempt Firebase login
      if (auth && inputId.includes("@")) {
        try {
          await loginUser(inputId, password || "");
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error("Firebase login failed", e);
          setError("Firebase login failed: " + (e?.message || ""));
          return;
        }
      }

      // set user via UserContext; UserProvider listens to Firebase auth if enabled
      if (setUser) {
        setUser({ id });
      }
      setShowLogin(false);
      await SimulationManager.fetchProgressFromBackend(id).catch((e) => {
        // handle fetch errors without crashing the UI
        // eslint-disable-next-line no-console
        console.error("Failed to fetch progress for", id, e);
        setError("Failed to fetch progress.");
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setError("Login failed.");
    }
  }

  useEffect(() => {
    // Save progress when user.id changes.
    const id = user?.id;
    if (id) {
      SimulationManager.saveProgressToBackend(id).catch((e) => {
        // eslint-disable-next-line no-console
        console.error("Failed to save progress", e);
      });
    }
  }, [user?.id]);

  if (showLogin) {
    return (
      <main className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <div className="flex flex-col items-center justify-center gap-2">
          <input
            type="text"
            placeholder="Email or User ID"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            aria-label="User ID or Email"
            className="border p-2 rounded w-64"
          />
          {inputId.includes("@") && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password"
              className="border p-2 rounded w-64"
            />
          )}
          <button
            onClick={handleLogin}
            className="mt-2 bg-[#A32C2B] text-white px-4 py-2 rounded font-semibold"
          >
            Login
          </button>
        </div>
        {error && <p className="text-red-600 mt-3">{error}</p>}
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
