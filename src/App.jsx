import { Analytics } from "@vercel/analytics/react";
import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import "./styles/accessibility.css";
import "./styles/adaptive.css";
import "./styles/neurodivergent.css";

// Critical components loaded immediately
import AccessibilitySettings from "./components/AccessibilitySettings";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy-load ALL routes for optimal code splitting
const HomeModern = lazy(() => import("./components/HomeModern"));
const LLNDHomepage = lazy(() => import("./components/LLNDHomepage"));
const LoginPage = lazy(() => import("./components/LoginPage"));
const LearnerDashboard = lazy(() => import("./components/StudentDashboard"));

// Authentication pages
const VerifyEmailPage = lazy(() => import("./components/VerifyEmailPage"));
const SetupMFAPage = lazy(() => import("./components/SetupMFAPage"));
const ResetPasswordPage = lazy(() => import("./components/ResetPasswordPage"));
const UnauthorizedPage = lazy(() => import("./components/UnauthorizedPage"));

// Curriculum and lessons
const CurriculumBuilderWithSaveState = lazy(
  () => import("./components/curriculum/CurriculumBuilderWithSaveState.jsx"),
);
const DigitalLiteracyLesson = lazy(
  () => import("./components/lessonModules/DigitalLiteracyLesson"),
);
const DigitalLiteracyLessonEnhanced = lazy(
  () => import("./components/lessonModules/DigitalLiteracyLessonEnhanced"),
);
const LanguagePhonicsLesson = lazy(
  () => import("./components/lessonModules/LanguagePhonicsLesson"),
);
const LifeSkillsLesson = lazy(() => import("./components/lessonModules/LifeSkillsLesson"));
const LiteracyReadingLesson = lazy(
  () => import("./components/lessonModules/LiteracyReadingLesson"),
);
const NumeracyCountingMoneyLesson = lazy(
  () => import("./components/lessonModules/NumeracyCountingMoneyLesson"),
);

// Demo and feature pages
const AboutPage = lazy(() => import("./pages/AboutPage"));
const AdaptiveDemoPage = lazy(() => import("./pages/AdaptiveDemoPage"));
const AdaptiveMathLearningPage = lazy(() => import("./pages/AdaptiveMathLearningPage"));
const AIAssistantPage = lazy(() => import("./pages/AIAssistantPage"));
const AnimationSystemDemo = lazy(() => import("./pages/AnimationSystemDemo"));
const AutomationDemo = lazy(() => import("./pages/AutomationDemo.jsx"));
const ExecutiveFunctionDemo = lazy(() => import("./pages/ExecutiveFunctionDemo"));
const LearningPage = lazy(() => import("./pages/LearningPage"));
const MathExercisesPage = lazy(() => import("./pages/MathExercisesPage"));
const NeurodivergentLearningPage = lazy(() => import("./pages/NeurodivergentLearningPage"));
const FractionMastery = lazy(() => import("./exercises/FractionMastery"));

// Tools pages
const CharacterAnimationPage = lazy(() => import("./pages/Tools/CharacterAnimation"));
const FluidSimulationPage = lazy(() => import("./pages/Tools/FluidSimulation"));
const RippleEffectPage = lazy(() => import("./pages/Tools/RippleEffect"));
const WebGLEffectsPage = lazy(() => import("./pages/Tools/WebGLEffects"));
const WhiteboardPage = lazy(() => import("./pages/Tools/Whiteboard"));
const ToolsPage = lazy(() => import("./pages/ToolsPage"));

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
    <div className="App">
      <Analytics />
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
          <Route path="/math/adaptive-quest/:conceptId" element={<AdaptiveMathLearningPage />} />
          <Route
            path="/math/fraction-mastery"
            element={
              <Suspense fallback={<ProfessionalLoader />}>
                <FractionMastery />
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
  );
}

export default App;
