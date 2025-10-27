import React, { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { AnalyticsProvider } from "./analytics";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import { LearningPreferencesProvider } from "./context/LearningPreferencesContext";
import { AuthProvider } from "./contexts/AuthContext";

import AccessibilitySettings from "./components/AccessibilitySettings";
import CurriculumBuilderWithSaveState from "./components/curriculum/CurriculumBuilderWithSaveState.jsx";
import HomeModern from "./components/HomeModern";
import DigitalLiteracyLesson from "./components/lessonModules/DigitalLiteracyLesson";
import DigitalLiteracyLessonEnhanced from "./components/lessonModules/DigitalLiteracyLessonEnhanced";
import LanguagePhonicsLesson from "./components/lessonModules/LanguagePhonicsLesson";
import LifeSkillsLesson from "./components/lessonModules/LifeSkillsLesson";
import LiteracyReadingLesson from "./components/lessonModules/LiteracyReadingLesson";
import NumeracyCountingMoneyLesson from "./components/lessonModules/NumeracyCountingMoneyLesson";
import LLNDHomepage from "./components/LLNDHomepage";
import LoginPage from "./components/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import LearnerDashboard from "./components/StudentDashboard";

import AboutPage from "./pages/AboutPage";
import AdaptiveDemoPage from "./pages/AdaptiveDemoPage";
import AdaptiveMathLearningPage from "./pages/AdaptiveMathLearningPage";
import AIAssistantPage from "./pages/AIAssistantPage";
import AnimationSystemDemo from "./pages/AnimationSystemDemo";
import AutomationDemo from "./pages/AutomationDemo.jsx";
import ExecutiveFunctionDemo from "./pages/ExecutiveFunctionDemo";
import LearningPage from "./pages/LearningPage";
import MathExercisesPage from "./pages/MathExercisesPage";
import NeurodivergentLearningPage from "./pages/NeurodivergentLearningPage";
import CharacterAnimationPage from "./pages/Tools/CharacterAnimation";
import FluidSimulationPage from "./pages/Tools/FluidSimulation";
import RippleEffectPage from "./pages/Tools/RippleEffect";
import WebGLEffectsPage from "./pages/Tools/WebGLEffects";
import WhiteboardPage from "./pages/Tools/Whiteboard";
import ToolsPage from "./pages/ToolsPage";

import "./styles/accessibility.css";
import "./styles/adaptive.css";
import "./styles/neurodivergent.css";

// Lazy-loaded authentication pages
const VerifyEmailPage = lazy(() => import("./components/VerifyEmailPage"));
const SetupMFAPage = lazy(() => import("./components/SetupMFAPage"));
const ResetPasswordPage = lazy(() => import("./components/ResetPasswordPage"));
const UnauthorizedPage = lazy(() => import("./components/UnauthorizedPage"));

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
        <LearningPreferencesProvider>
          <AnalyticsProvider>
            <div className="App">
              <Suspense fallback={<ProfessionalLoader />}>
                <AccessibilitySettings />
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomeModern />} />
                  <Route path="/llnd" element={<LLNDHomepage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/verify-email" element={<VerifyEmailPage />} />
                  <Route path="/unauthorized" element={<UnauthorizedPage />} />

                  {/* Demo Routes */}
                  <Route path="/demos/automation" element={<AutomationDemo />} />
                  <Route path="/tools" element={<ToolsPage />} />
                  <Route path="/learning" element={<LearningPage />} />
                  <Route path="/about" element={<AboutPage />} />

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
                  <Route path="/executive-function-demo" element={<ExecutiveFunctionDemo />} />
                  <Route path="/neurodivergent-learning" element={<NeurodivergentLearningPage />} />
                  <Route path="/ai-assistant" element={<AIAssistantPage />} />
                  <Route path="/exercises/math" element={<MathExercisesPage />} />

                  {/* Adaptive Math Learning Routes */}
                  <Route path="/math/adaptive-quest" element={<AdaptiveMathLearningPage />} />
                  <Route
                    path="/math/adaptive-quest/:conceptId"
                    element={<AdaptiveMathLearningPage />}
                  />
                  <Route
                    path="/math/fraction-mastery"
                    element={
                      <Suspense fallback={<ProfessionalLoader />}>
                        {/* We're lazy-loading this component since it's just an example */}
                        {React.createElement(lazy(() => import("./exercises/FractionMastery")))}
                      </Suspense>
                    }
                  />

                  {/* Tools migrated from static demo pages into SPA */}
                  <Route path="/tools/fluid-simulation" element={<FluidSimulationPage />} />
                  <Route path="/tools/whiteboard" element={<WhiteboardPage />} />
                  <Route path="/tools/ripple-effect" element={<RippleEffectPage />} />
                  <Route path="/tools/webgl-effects" element={<WebGLEffectsPage />} />
                  <Route path="/tools/character-animation" element={<CharacterAnimationPage />} />

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
        </LearningPreferencesProvider>
      </AuthProvider>
    </AccessibilityProvider>
  );
}

export default App;
