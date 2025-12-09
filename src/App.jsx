import { Analytics } from "@vercel/analytics/react";
import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import "./styles/accessibility.css";
import "./styles/adaptive.css";
import "./styles/neurodivergent.css";

// Critical components loaded immediately
import AccessibilitySettings from "./components/AccessibilitySettings";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy routes (chunk names help during perf audits)
const HomeModern = lazy(
  () => import(/* webpackChunkName: "home-modern" */ "./components/HomeModern"),
);
const LLNDHomepage = lazy(
  () => import(/* webpackChunkName: "llnd-home" */ "./components/LLNDHomepage"),
);
const LoginPage = lazy(() => import(/* webpackChunkName: "login" */ "./components/LoginPage"));
const LearnerDashboard = lazy(
  () => import(/* webpackChunkName: "dashboard" */ "./components/StudentDashboard"),
);
const VerifyEmailPage = lazy(
  () => import(/* webpackChunkName: "verify-email" */ "./components/VerifyEmailPage"),
);
const SetupMFAPage = lazy(
  () => import(/* webpackChunkName: "setup-mfa" */ "./components/SetupMFAPage"),
);
const ResetPasswordPage = lazy(
  () => import(/* webpackChunkName: "reset-password" */ "./components/ResetPasswordPage"),
);
const UnauthorizedPage = lazy(
  () => import(/* webpackChunkName: "unauthorized" */ "./components/UnauthorizedPage"),
);
const CurriculumBuilderWithSaveState = lazy(
  () =>
    import(
      /* webpackChunkName: "curriculum-builder" */ "./components/curriculum/CurriculumBuilderWithSaveState.jsx"
    ),
);
const DigitalLiteracyLesson = lazy(
  () =>
    import(/* webpackChunkName: "lesson-dl" */ "./components/lessonModules/DigitalLiteracyLesson"),
);
const DigitalLiteracyLessonEnhanced = lazy(
  () =>
    import(
      /* webpackChunkName: "lesson-dl-enhanced" */ "./components/lessonModules/DigitalLiteracyLessonEnhanced"
    ),
);
const LanguagePhonicsLesson = lazy(
  () =>
    import(
      /* webpackChunkName: "lesson-language-phonics" */ "./components/lessonModules/LanguagePhonicsLesson"
    ),
);
const LifeSkillsLesson = lazy(
  () => import(/* webpackChunkName: "lesson-life" */ "./components/lessonModules/LifeSkillsLesson"),
);
const LiteracyReadingLesson = lazy(
  () =>
    import(
      /* webpackChunkName: "lesson-literacy-reading" */ "./components/lessonModules/LiteracyReadingLesson"
    ),
);
const NumeracyCountingMoneyLesson = lazy(
  () =>
    import(
      /* webpackChunkName: "lesson-numeracy-money" */ "./components/lessonModules/NumeracyCountingMoneyLesson"
    ),
);
const AboutPage = lazy(() => import(/* webpackChunkName: "about" */ "./pages/AboutPage"));
const AdaptiveDemoPage = lazy(
  () => import(/* webpackChunkName: "adaptive-demo" */ "./pages/AdaptiveDemoPage"),
);
const AdaptiveMathLearningPage = lazy(
  () => import(/* webpackChunkName: "adaptive-math" */ "./pages/AdaptiveMathLearningPage"),
);
const AIAssistantPage = lazy(
  () => import(/* webpackChunkName: "ai-assistant" */ "./pages/AIAssistantPage"),
);
const AnimationSystemDemo = lazy(
  () => import(/* webpackChunkName: "animation-demo" */ "./pages/AnimationSystemDemo"),
);
const AutomationDemo = lazy(
  () => import(/* webpackChunkName: "automation-demo" */ "./pages/AutomationDemo.jsx"),
);
const ExecutiveFunctionDemo = lazy(
  () => import(/* webpackChunkName: "executive-function-demo" */ "./pages/ExecutiveFunctionDemo"),
);
const LearningPage = lazy(() => import(/* webpackChunkName: "learning" */ "./pages/LearningPage"));
const MathExercisesPage = lazy(
  () => import(/* webpackChunkName: "exercises-math" */ "./pages/MathExercisesPage"),
);
const NeurodivergentLearningPage = lazy(
  () =>
    import(/* webpackChunkName: "neurodivergent-learning" */ "./pages/NeurodivergentLearningPage"),
);
const FractionMastery = lazy(
  () => import(/* webpackChunkName: "fraction-mastery" */ "./exercises/FractionMastery"),
);
const CharacterAnimationPage = lazy(
  () =>
    import(/* webpackChunkName: "tools-character-animation" */ "./pages/Tools/CharacterAnimation"),
);
const FluidSimulationPage = lazy(
  () => import(/* webpackChunkName: "tools-fluid-simulation" */ "./pages/Tools/FluidSimulation"),
);
const RippleEffectPage = lazy(
  () => import(/* webpackChunkName: "tools-ripple-effect" */ "./pages/Tools/RippleEffect"),
);
const WebGLEffectsPage = lazy(
  () => import(/* webpackChunkName: "tools-webgl-effects" */ "./pages/Tools/WebGLEffects"),
);
const WhiteboardPage = lazy(
  () => import(/* webpackChunkName: "tools-whiteboard" */ "./pages/Tools/Whiteboard"),
);
const ToolsPage = lazy(() => import(/* webpackChunkName: "tools" */ "./pages/ToolsPage"));
const WindgapAcademy = lazy(
  () => import(/* webpackChunkName: "windgap-academy" */ "./components/WindgapAcademy"),
);

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

export default function App() {
  return (
    <div className="App">
      <Analytics />
      <Suspense fallback={<ProfessionalLoader />}>
        <AccessibilitySettings />
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomeModern />} />
          <Route path="/academy" element={<WindgapAcademy />} />
          <Route path="/llnd" element={<LLNDHomepage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Demos */}
          <Route path="/demos/automation" element={<AutomationDemo />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/learning" element={<LearningPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Protected */}
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

          {/* Role-gated */}
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
          <Route
            path="/lesson/digital-literacy-enhanced"
            element={
              <ProtectedRoute>
                <DigitalLiteracyLessonEnhanced />
              </ProtectedRoute>
            }
          />

          {/* Animation & Adaptive */}
          <Route path="/animation-demo" element={<AnimationSystemDemo />} />
          <Route path="/adaptive-demo" element={<AdaptiveDemoPage />} />
          <Route path="/executive-function-demo" element={<ExecutiveFunctionDemo />} />
          <Route path="/neurodivergent-learning" element={<NeurodivergentLearningPage />} />
          <Route path="/ai-assistant" element={<AIAssistantPage />} />
          <Route path="/exercises/math" element={<MathExercisesPage />} />

          {/* Adaptive Math Learning */}
          <Route path="/math/adaptive-quest" element={<AdaptiveMathLearningPage />} />
          <Route path="/math/adaptive-quest/:conceptId" element={<AdaptiveMathLearningPage />} />
          <Route path="/math/fraction-mastery" element={<FractionMastery />} />

          {/* Tools */}
          <Route path="/tools/fluid-simulation" element={<FluidSimulationPage />} />
          <Route path="/tools/whiteboard" element={<WhiteboardPage />} />
          <Route path="/tools/ripple-effect" element={<RippleEffectPage />} />
          <Route path="/tools/webgl-effects" element={<WebGLEffectsPage />} />
          <Route path="/tools/character-animation" element={<CharacterAnimationPage />} />

          {/* Modules "coming soon" */}
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

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}
