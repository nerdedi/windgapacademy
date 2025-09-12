import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";

import GameProvider from "../components/GameModules/GameManager";
import { loginUser, auth } from "../firebase.js";

import { validateEmail, validatePassword } from "./app/authUtils";
import ErrorBoundary from "./app/ErrorBoundary";
import AppRouter from "./app/Router";
import useRoute from "./app/routing";
import { UserProvider, useUser } from "./app/UserContext";
// import { GamificationProvider } from "./contexts/GamificationContext";
import { LessonProvider } from "./contexts/LessonContext";
import SimulationManager from "./simulation/SimulationManager";
import { useUI } from "./ui/UISystem";
import LoadingScreen from "./components/LoadingScreen";
import { SoundManager } from "./audio/SoundManager";
import { GameMechanics } from "./core/GameMechanics";

function MainApp() {
  const [showLogin, setShowLogin] = useState(false);
  const [inputId, setInputId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useUser();
  const navigate = useRoute();

  async function handleLogin() {
    setError("");
    setIsLoading(true);
    if (!inputId || !inputId.trim()) {
      setError("User ID / Email is required.");
      setIsLoading(false);
      return;
    }

    const id = inputId.trim();
    try {
      // If input looks like an email, validate format and password before attempting Firebase login
      if (inputId.includes("@")) {
        if (!validateEmail(inputId)) {
          setError("Please enter a valid email address.");
          setIsLoading(false);
          return;
        }
        if (!validatePassword(password)) {
          setError("Password must be at least 6 characters and include a letter and a number.");
          setIsLoading(false);
          return;
        }
      }

      if (auth && inputId.includes("@")) {
        try {
          await loginUser(inputId, password || "");
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error("Firebase login failed", e);
          setError("Firebase login failed: " + (e?.message || ""));
          // clear password on failed login for security
          setPassword("");
          return;
        }
      }

      // set user via UserContext; UserProvider listens to Firebase auth if enabled
      if (setUser) {
        setUser({ id });
      }
      setShowLogin(false);
      // Move focus to main app area for keyboard users
      try {
        const main = document.querySelector('main[role="main"]') || document.querySelector("main");
        if (main && typeof main.focus === "function") main.focus();
      } catch (e) {
        // ignore
      }
      // navigate to home after successful login
      try {
        navigate("/");
      } catch (e) {
        // ignore if navigation isn't available
        // eslint-disable-next-line no-console
        console.debug("Navigation unavailable after login", e);
      }

      await SimulationManager.fetchProgressFromBackend(id).catch((e) => {
        // handle fetch errors without crashing the UI
        // eslint-disable-next-line no-console
        console.error("Failed to fetch progress for", id, e);
        setError("Failed to fetch progress.");
      });

      setIsLoading(false);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setError("Login failed.");
      setPassword("");
      setIsLoading(false);
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
      <main role="main" className="p-8 text-center">
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
            disabled={isLoading}
            aria-busy={isLoading}
            className={`mt-2 px-4 py-2 rounded font-semibold ${isLoading ? "bg-gray-400 text-white cursor-wait" : "bg-[#A32C2B] text-white"}`}
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Signing in...
              </span>
            ) : (
              "Login"
            )}
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
      <GameProvider>
        <LessonProvider>
          {/* <GamificationProvider> */}
          <ErrorBoundary>
            <MainApp />
          </ErrorBoundary>
          {/* </GamificationProvider> */}
        </LessonProvider>
      </GameProvider>
    </UserProvider>
  );
}
