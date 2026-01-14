import React, { useEffect, useState } from "react";

import GameProvider from "../components/GameModules/GameManager";
import { auth, loginUser } from "../firebase.js";

import { validateEmail, validatePassword } from "./app/authUtils";
import ErrorBoundary from "./app/ErrorBoundary";
import AppRouter from "./app/Router";
import { useRoute } from "./app/routing";
import { UserProvider, useUser } from "./app/UserContext";
import { GamificationProvider } from "./contexts/GamificationContext";
import { LessonProvider } from "./contexts/LessonContext";
import SimulationManager from "./simulation/SimulationManager";

function MainApp() {
  const [showLogin, setShowLogin] = useState(true);
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
      <main
        role="main"
        className="min-h-screen bg-gradient-to-br from-[#5ED1D2] via-[#A32C2B] to-[#FBBF24] flex items-center justify-center p-8"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#0B6E8F] mb-2">Windgap Academy</h1>
            <p className="text-gray-600">Accessible Learning for Every Mind</p>
          </div>

          <h2 className="text-2xl font-bold text-[#A32C2B] mb-6 text-center">Welcome Back!</h2>

          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="email-input" className="block text-sm font-medium text-gray-700 mb-1">
                Email or User ID
              </label>
              <input
                id="email-input"
                type="text"
                placeholder="Enter your email or user ID"
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                aria-label="User ID or Email"
                className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-[#5ED1D2] focus:outline-none transition-colors"
              />
            </div>

            {inputId.includes("@") && (
              <div>
                <label
                  htmlFor="password-input"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password-input"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-label="Password"
                  className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-[#5ED1D2] focus:outline-none transition-colors"
                />
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={isLoading}
              aria-busy={isLoading}
              className={`w-full mt-2 py-3 rounded-lg font-bold text-lg transition-all ${
                isLoading
                  ? "bg-gray-400 text-white cursor-wait"
                  : "bg-[#A32C2B] text-white hover:bg-[#8a2424] hover:shadow-lg"
              }`}
            >
              {isLoading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
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
                "🚀 Sign In"
              )}
            </button>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            <div className="text-center mt-4 pt-4 border-t border-gray-200">
              <p className="text-gray-600 mb-3">Don't have an account?</p>
              <button
                onClick={() => {
                  // For demo: allow any user ID to "create" an account
                  if (inputId.trim()) {
                    handleLogin();
                  } else {
                    setError("Please enter an email or user ID to create an account.");
                  }
                }}
                className="w-full py-3 rounded-lg font-bold text-[#5ED1D2] border-2 border-[#5ED1D2] hover:bg-[#5ED1D2] hover:text-white transition-all"
              >
                ✨ Create New Account
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Tip: Enter any username to explore as a guest, or use your email for full account
              features.
            </p>
          </div>
        </div>
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
          <GamificationProvider>
            <ErrorBoundary>
              <MainApp />
            </ErrorBoundary>
          </GamificationProvider>
        </LessonProvider>
      </GameProvider>
    </UserProvider>
  );
}
