import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LLNDHomepage() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 300);
  }, []);

  const llndModules = [
    {
      icon: "🏠",
      title: "Life Skills",
      description: "Travel Training, Cooking, Hygiene, Shopping & Money Handling",
      count: "10 modules",
    },
    {
      icon: "💼",
      title: "Employment Skills",
      description: "Resume Writing, Interview Practice, Workplace Behaviour",
      count: "6 modules",
    },
    {
      icon: "💻",
      title: "Digital Literacy",
      description: "Using Email, Online Safety, Searching the Web, Using Apps",
      count: "6 modules",
    },
    {
      icon: "🔢",
      title: "Numeracy",
      description: "Recognising Numbers, Money & Budgeting, Time & Calendars",
      count: "8 modules",
    },
    {
      icon: "📖",
      title: "Literacy & Language",
      description: "Reading Signs & Symbols, Following Instructions, Writing",
      count: "10 modules",
    },
    {
      icon: "💭",
      title: "Emotional Regulation",
      description: "Recognising Emotions, Coping Strategies, Mindfulness",
      count: "6 modules",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Apple-style Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-semibold text-black tracking-tight">Windgap Academy</div>
            <div className="flex items-center space-x-8">
              <button
                onClick={() => navigate("/login")}
                className="text-gray-600 hover:text-black transition-all duration-200 text-sm font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Apple-style Hero Section */}
      <section className="pt-32 pb-24 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div
            className={`transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight text-black tracking-tight">
              Learning and Life
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Navigation Development
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Empowering learners with disabilities through interactive, accessible education.
              <br />
              Build life skills, employment readiness, and independence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-200 hover:scale-105 shadow-xl"
              >
                Start Learning
              </button>
              <button
                onClick={() => navigate("/login")}
                className="border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-black px-10 py-4 rounded-full text-lg font-medium transition-all duration-200"
              >
                Learn More
              </button>
            </div>

            {/* LLND Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">7</div>
                <div className="text-gray-500 text-sm">Core Skill Areas</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">46</div>
                <div className="text-gray-500 text-sm">Learning Modules</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
                <div className="text-gray-500 text-sm">Accessible Design</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">NDIS</div>
                <div className="text-gray-500 text-sm">Compliant</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LLND Modules Section */}
      <section className="py-24 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black tracking-tight">
              Comprehensive Learning Modules
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Seven core skill areas designed specifically for learners with disabilities, following
              ACSF standards and NDIS guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {llndModules.map((module, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100"
              >
                <div className="text-4xl mb-4">{module.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-black">{module.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{module.description}</p>
                <div className="text-sm text-blue-600 font-medium">{module.count}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black tracking-tight">
              Designed for Accessibility
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Every feature is built with accessibility in mind, ensuring all learners can succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">♿</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-black">Fully Accessible</h3>
              <p className="text-gray-600 leading-relaxed">
                Screen reader compatible, keyboard navigation, high contrast modes, and adjustable
                text sizes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🎮</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-black">Interactive Learning</h3>
              <p className="text-gray-600 leading-relaxed">
                Gamified lessons, interactive simulations, and hands-on activities that make
                learning engaging.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-black">Progress Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Detailed analytics for learners and educators to track progress and identify areas
                for improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-gray-300 mb-12 font-light">
            Join thousands of learners building essential life skills through our comprehensive LLND
            curriculum.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-black px-10 py-4 rounded-full text-lg font-semibold transition-all duration-200 hover:scale-105 shadow-xl"
            >
              Get Started Today
            </button>
            <button
              onClick={() => navigate("/login")}
              className="border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white px-10 py-4 rounded-full text-lg font-medium transition-all duration-200"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-2xl font-semibold text-black mb-4">Windgap Academy</div>
          <p className="text-gray-600 mb-6">Learning and Life Navigation Development Platform</p>
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            <button
              onClick={() => navigate("/login")}
              className="hover:text-black transition-colors"
            >
              Privacy
            </button>
            <button
              onClick={() => navigate("/login")}
              className="hover:text-black transition-colors"
            >
              Terms
            </button>
            <button
              onClick={() => navigate("/login")}
              className="hover:text-black transition-colors"
            >
              Support
            </button>
            <button
              onClick={() => navigate("/login")}
              className="hover:text-black transition-colors"
            >
              Contact
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LLNDHomepage;
