/**
 * AdaptiveMathLearningPage component
 *
 * This page acts as a container for the adaptive math learning experience,
 * providing navigation, context, and layout for the AdaptiveQuestBasedMathGame.
 */

import { Link } from "react-router-dom";
import AdaptiveQuestBasedMathGame from "../examples/AdaptiveQuestBasedMathGame";

const AdaptiveMathLearningPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img src="/assets/windgap-logo.png" alt="Windgap Academy" className="h-10 w-auto" />
                <span className="ml-3 text-xl font-bold text-gray-900">Math Adventures</span>
              </Link>
            </div>
            <nav className="flex space-x-4">
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/exercises/math"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                All Exercises
              </Link>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                Help
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Adaptive Math Learning</h1>
          <p className="mt-2 text-lg text-gray-600">
            Explore mathematical concepts through adaptive exercises and engaging quests. Your
            journey will adjust based on your performance and learning needs.
          </p>
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">🧠</span>
              <h2 className="text-xl font-semibold">Adaptive Learning</h2>
            </div>
            <p className="text-gray-600">
              Exercises automatically adjust to your skill level, providing just the right amount of
              challenge to keep you engaged and learning effectively.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">🗺️</span>
              <h2 className="text-xl font-semibold">Quest-Based Progression</h2>
            </div>
            <p className="text-gray-600">
              Learn through an adventure! Complete quests, earn rewards, and track your progress
              through the math curriculum in an engaging, game-like experience.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">📊</span>
              <h2 className="text-xl font-semibold">Progress Tracking</h2>
            </div>
            <p className="text-gray-600">
              See your growth over time with detailed analytics. Identify your strengths and areas
              for improvement to focus your learning efforts effectively.
            </p>
          </div>
        </div>

        {/* The Adaptive Quest Game */}
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <AdaptiveQuestBasedMathGame />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Windgap Academy</h3>
              <p className="text-gray-300">
                Making education accessible, engaging, and effective for all learners.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Learning Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Math Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Parent Resources
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Educator Guides
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Help & Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Feedback
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Windgap Academy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdaptiveMathLearningPage;
