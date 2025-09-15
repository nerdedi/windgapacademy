import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Import components
import LLNDHomepage from "./components/LLNDHomepage";
import LoginPage from "./components/LoginPage";
import LearnerDashboard from "./components/StudentDashboard";

// Import lesson modules
import LanguagePhonicsLesson from "./components/lessonModules/LanguagePhonicsLesson";
import LiteracyReadingLesson from "./components/lessonModules/LiteracyReadingLesson";
import NumeracyCountingMoneyLesson from "./components/lessonModules/NumeracyCountingMoneyLesson";
import LifeSkillsLesson from "./components/lessonModules/LifeSkillsLesson";
import DigitalLiteracyLesson from "./components/lessonModules/DigitalLiteracyLesson";

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
      <Suspense fallback={<ProfessionalLoader />}>
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<LLNDHomepage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<LearnerDashboard />} />

          {/* LLND Lesson Modules */}
          <Route path="/lesson/language-phonics" element={<LanguagePhonicsLesson />} />
          <Route path="/lesson/literacy-reading" element={<LiteracyReadingLesson />} />
          <Route path="/lesson/numeracy-money" element={<NumeracyCountingMoneyLesson />} />
          <Route path="/lesson/life-skills" element={<LifeSkillsLesson />} />
          <Route path="/lesson/digital-literacy" element={<DigitalLiteracyLesson />} />

          {/* Module routes */}
          <Route
            path="/module/:moduleId"
            element={
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
