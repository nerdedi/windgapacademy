import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function WindgapAcademyHomepage() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 500);
  }, []);

  const llndModules = [
    {
      icon: "🏠",
      title: "Life Skills",
      description: "Travel Training, Cooking, Hygiene, Shopping & Money Handling, Time Management",
      modules: [
        "Travel Training",
        "Cooking Basics",
        "Hygiene & Personal Care",
        "Shopping & Money Handling",
      ],
    },
    {
      icon: "💼",
      title: "Employment Skills",
      description: "Resume Writing, Interview Practice, Workplace Behaviour, Communication at Work",
      modules: [
        "Resume Writing",
        "Interview Practice",
        "Workplace Behaviour",
        "Time Management at Work",
      ],
    },
    {
      icon: "💻",
      title: "Digital Literacy",
      description: "Using Email, Online Safety, Searching the Web, Using Apps, Filling Out Forms",
      modules: ["Using Email", "Online Safety", "Searching the Web", "Using Apps"],
    },
    {
      icon: "🔢",
      title: "Numeracy",
      description: "Recognising Numbers, Counting & Grouping, Money & Budgeting, Time & Calendars",
      modules: [
        "Recognising Numbers",
        "Counting & Grouping",
        "Money & Budgeting",
        "Time & Calendars",
      ],
    },
    {
      icon: "📖",
      title: "Literacy & Language",
      description: "Reading Signs & Symbols, Following Instructions, Writing Simple Sentences",
      modules: ["Reading Signs & Symbols", "Following Instructions", "Writing Simple Sentences"],
    },
    {
      icon: "💭",
      title: "Emotional Regulation",
      description: "Recognising Emotions, Naming Feelings, Coping Strategies, Mindfulness",
      modules: [
        "Recognising Emotions",
        "Naming Feelings",
        "Coping Strategies",
        "Mindfulness & Breathing",
      ],
    },
  ];

  const stats = [
    { number: "50,000+", label: "Active Students" },
    { number: "500+", label: "Interactive Lessons" },
    { number: "100+", label: "3D Experiences" },
    { number: "95%", label: "Success Rate" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Apple-style Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-semibold text-white tracking-tight">Windgap Academy</div>
            <div className="flex items-center space-x-8">
              <button
                onClick={() => navigate("/login")}
                className="text-gray-300 hover:text-white transition-all duration-200 text-sm font-medium"
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-pink-900/30"></div>
          <div className="absolute inset-0">
            {Array.from({ length: 100 }, (_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animation: `twinkle 4s infinite`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div
            className={`text-center transition-all duration-1000 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Windgap Academy
              </span>
              <br />
              <span className="text-white text-4xl md:text-6xl">The Future of Education</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Experience revolutionary learning through immersive 3D environments, interactive
              courses, and cutting-edge educational technology that transforms how you learn.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <button
                onClick={() => navigate("/courses")}
                className="group relative bg-white text-black px-12 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl"
              >
                <span className="relative z-10">Start Learning</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </button>

              <button
                onClick={() => navigate("/experiences")}
                className="group px-12 py-4 border-2 border-white/20 rounded-full text-lg font-semibold hover:border-white/40 hover:bg-white/5 transition-all duration-300"
              >
                Explore 3D Worlds
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300 inline-block">
                  →
                </span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-sm md:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Revolutionary
              </span>
              <br />
              Learning Platform
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive educational ecosystem with immersive 3D experiences and advanced
              learning analytics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                onClick={() => navigate(feature.link)}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 cursor-pointer"
              >
                <div className="text-6xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                <div className="mt-6 text-blue-400 group-hover:text-blue-300 transition-colors">
                  Learn More →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-5xl md:text-6xl font-bold mb-8">
            Ready to Transform
            <br />
            Your Learning Journey?
          </h2>
          <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
            Join thousands of students experiencing the future of education through immersive
            technology and personalized learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => navigate("/courses")}
              className="bg-white text-black px-16 py-5 rounded-full text-xl font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl"
            >
              Start Your Journey
            </button>
            <button
              onClick={() => navigate("/experiences")}
              className="border-2 border-white px-16 py-5 rounded-full text-xl font-bold hover:bg-white/10 transition-all duration-300"
            >
              Explore 3D Worlds
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                🎓 Windgap Academy
              </div>
              <p className="text-gray-400">
                Revolutionizing education through immersive technology and personalized learning
                experiences.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Learning</h3>
              <div className="space-y-2 text-gray-400">
                <button
                  onClick={() => navigate("/courses")}
                  className="block hover:text-white transition-colors"
                >
                  Courses
                </button>
                <button
                  onClick={() => navigate("/experiences")}
                  className="block hover:text-white transition-colors"
                >
                  3D Experiences
                </button>
                <button
                  onClick={() => navigate("/library")}
                  className="block hover:text-white transition-colors"
                >
                  Library
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <div className="space-y-2 text-gray-400">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="block hover:text-white transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate("/community")}
                  className="block hover:text-white transition-colors"
                >
                  Community
                </button>
                <button
                  onClick={() => navigate("/achievements")}
                  className="block hover:text-white transition-colors"
                >
                  Achievements
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <div className="space-y-2 text-gray-400">
                <a href="#" className="block hover:text-white transition-colors">
                  Help Center
                </a>
                <a href="#" className="block hover:text-white transition-colors">
                  Contact Us
                </a>
                <a href="#" className="block hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
            <p>© 2024 Windgap Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}

export default WindgapAcademyHomepage;
