import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Apple-quality homepage with sophisticated design and smooth animations
function AppleQualityHomepage() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoaded(true), 500);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">🎓 Windgap Academy</div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </a>
              <a href="#experiences" className="text-gray-300 hover:text-white transition-colors">
                Experiences
              </a>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">
                About
              </a>
            </div>
            <button
              onClick={() => navigate("/games")}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
          <div className="absolute inset-0">
            {Array.from({ length: 50 }, (_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animation: `twinkle 3s infinite`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div
          className={`relative z-10 text-center max-w-6xl mx-auto px-6 transition-all duration-1000 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              The Future
            </span>
            <br />
            <span className="text-white">of Learning</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience education reimagined with immersive 3D environments, sophisticated
            simulations, and cutting-edge technology that makes learning extraordinary.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => navigate("/games")}
              className="group relative bg-white text-black px-12 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl"
            >
              <span className="relative z-10">Explore 3D Worlds</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </button>

            <button
              onClick={() =>
                document.getElementById("features").scrollIntoView({ behavior: "smooth" })
              }
              className="group px-12 py-4 border-2 border-white/20 rounded-full text-lg font-semibold hover:border-white/40 hover:bg-white/5 transition-all duration-300"
            >
              Learn More
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300 inline-block">
                →
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Revolutionary
              </span>
              <br />
              Learning Experiences
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Powered by advanced 3D technology and sophisticated simulation engines
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🏙️",
                title: "3D City Builder",
                description:
                  "Build and manage sophisticated cities with realistic physics, economics, and urban planning challenges.",
                features: [
                  "Real-time 3D Graphics",
                  "Economic Simulation",
                  "Urban Planning",
                  "Interactive Environments",
                ],
              },
              {
                icon: "🏠",
                title: "Life Simulator",
                description:
                  "Experience virtual life with animated characters, realistic environments, and complex decision-making.",
                features: [
                  "Character Animation",
                  "Life Management",
                  "Skill Development",
                  "Social Interactions",
                ],
              },
              {
                icon: "🦁",
                title: "Wildlife Explorer",
                description:
                  "Explore immersive animal habitats with educational content and conservation awareness.",
                features: [
                  "Realistic Habitats",
                  "Animal Behavior",
                  "Educational Content",
                  "Conservation Learning",
                ],
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105"
              >
                <div className="text-6xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((item, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-300">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      {item}
                    </li>
                  ))}
                </ul>
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
            Your Learning?
          </h2>
          <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
            Join thousands of learners experiencing the future of education through immersive 3D
            technology.
          </p>
          <button
            onClick={() => navigate("/games")}
            className="bg-white text-black px-16 py-5 rounded-full text-xl font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl"
          >
            Start Your Journey
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-4">🎓 Windgap Academy</div>
            <p className="text-gray-400 mb-8">
              Revolutionizing education through immersive technology
            </p>
            <div className="flex justify-center space-x-8 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Support
              </a>
            </div>
            <p className="text-gray-500 mt-8">© 2024 Windgap Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
      `}</style>
    </div>
  );
}

export default AppleQualityHomepage;
