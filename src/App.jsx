import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Import providers
import { AuthProvider } from "./context/AuthContext";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Import accessibility components
import AccessibilitySettings from "./components/AccessibilitySettings";

// Import styles
import "./styles/accessibility.css";

// Import curriculum builder with save state
import CurriculumBuilderWithSaveState from "../components/curriculum/CurriculumBuilderWithSaveState";

// Import lesson modules
import DigitalLiteracyLesson from "./components/lessonModules/DigitalLiteracyLesson";
import DigitalLiteracyLessonEnhanced from "./components/lessonModules/DigitalLiteracyLessonEnhanced";
import LanguagePhonicsLesson from "./components/lessonModules/LanguagePhonicsLesson";
import LifeSkillsLesson from "./components/lessonModules/LifeSkillsLesson";
import LiteracyReadingLesson from "./components/lessonModules/LiteracyReadingLesson";
import NumeracyCountingMoneyLesson from "./components/lessonModules/NumeracyCountingMoneyLesson";

// Import components
import LLNDHomepage from "./components/LLNDHomepage";
import LearnerDashboard from "./components/StudentDashboard";
import LoginPage from "./components/LoginPage";

// Lazy-loaded authentication pages
const VerifyEmailPage = lazy(() => import("./components/VerifyEmailPage"));
const SetupMFAPage = lazy(() => import("./components/SetupMFAPage"));
const ResetPasswordPage = lazy(() => import("./components/ResetPasswordPage"));
const UnauthorizedPage = lazy(() => import("./components/UnauthorizedPage"));

// Import demo pages
import AnimationSystemDemo from "./pages/AnimationSystemDemo";
import AdaptiveDemoPage from "./pages/AdaptiveDemoPage";

// Import provider wrappers
import { AnalyticsProvider } from "./analytics";

// Import styles
import "./styles/adaptive.css";

// Professional loading component
function ProfessionalLoader() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg font-medium">Loading Experience...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <AnalyticsProvider>
          <div className="App">
            <Suspense fallback={<ProfessionalLoader />}>
              <AccessibilitySettings />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LLNDHomepage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <LearnerDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/setup-mfa"
                  element={
                    <ProtectedRoute>
                      <SetupMFAPage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Routes with Role Requirements */}
                <Route
                  path="/curriculum-builder"
                  element={
                    <ProtectedRoute requiredRoles={["educator", "admin"]}>
                      <CurriculumBuilderWithSaveState />
                    </ProtectedRoute>
                  }
                />

                {/* LLND Lesson Modules */}
                <Route
                  path="/lesson/language-phonics"
                  element={
                    <ProtectedRoute>
                      <LanguagePhonicsLesson />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/lesson/literacy-reading"
                  element={
                    <ProtectedRoute>
                      <LiteracyReadingLesson />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/lesson/numeracy-money"
                  element={
                    <ProtectedRoute>
                      <NumeracyCountingMoneyLesson />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/lesson/life-skills"
                  element={
                    <ProtectedRoute>
                      <LifeSkillsLesson />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/lesson/digital-literacy"
                  element={
                    <ProtectedRoute>
                      <DigitalLiteracyLesson />
                    </ProtectedRoute>
                  }
                />

                {/* Enhanced lesson with neurodiversity accommodations */}
                <Route
                  path="/lesson/digital-literacy-enhanced"
                  element={
                    <ProtectedRoute>
                      <DigitalLiteracyLessonEnhanced />
                    </ProtectedRoute>
                  }
                />

                {/* Demo pages */}
                <Route path="/animation-demo" element={<AnimationSystemDemo />} />
                <Route path="/adaptive-demo" element={<AdaptiveDemoPage />} />

                {/* Module routes */}
                <Route
                  path="/module/:moduleId"
                  element={
                    <ProtectedRoute>
                      <div className="p-8 text-center">
                        <h1 className="text-2xl font-bold mb-4">Module Coming Soon</h1>
                        <p className="text-gray-600 mb-4">This LLND module is being developed.</p>
                        <button
                          onClick={() => window.history.back()}
                          className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                          Go Back
                        </button>
                      </div>
                    </ProtectedRoute>
                  }
                />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </div>
        </AnalyticsProvider>
      </AuthProvider>
    </AccessibilityProvider>
  );
}
export default App;
