import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PremiumGameHub() {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 300);
  }, []);

  const games = [
    {
      id: "city-builder",
      title: "3D City Builder",
      subtitle: "Urban Planning Simulation",
      description:
        "Build and manage sophisticated cities with realistic economics, infrastructure systems, and citizen happiness metrics.",
      icon: "🏙️",
      difficulty: "Advanced",
      players: "12,847 playing",
      features: [
        "Real-time 3D Graphics",
        "Economic Simulation",
        "Infrastructure Management",
        "Policy Decisions",
      ],
      gradient: "from-blue-600 to-cyan-500",
      route: "/city-builder",
    },
    {
      id: "animated-platformer",
      title: "Animated Platformer",
      subtitle: "Frame-by-Frame Animation",
      description:
        "Experience sophisticated 2D animation with sprite-based characters, smooth transitions, and responsive controls.",
      icon: "🎮",
      difficulty: "Intermediate",
      players: "8,234 playing",
      features: ["Sprite Animation", "Physics Engine", "Input Controls", "Animation States"],
      gradient: "from-purple-600 to-pink-500",
      route: "/animated-platformer",
    },
    {
      id: "sprite-game",
      title: "Sprite Animation System",
      subtitle: "Advanced Animation Engine",
      description:
        "Explore advanced sprite-based animation with state machines, transitions, and professional game development techniques.",
      icon: "🎭",
      difficulty: "Advanced",
      players: "15,692 playing",
      features: ["Sprite Sheets", "Animation Controller", "State Machine", "Delta Time Updates"],
      gradient: "from-green-600 to-emerald-500",
      route: "/sprite-game",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="text-2xl font-bold hover:text-blue-400 transition-colors"
            >
              🎓 Windgap Academy
            </button>
            <div className="flex items-center space-x-6">
              <span className="text-gray-400">Game Hub</span>
              <button
                onClick={() => navigate("/")}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Home
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div
            className={`text-center transition-all duration-1000 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Immersive
              </span>
              <br />
              <span className="text-white">Learning Games</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
              Experience education through sophisticated 3D simulations and interactive environments
            </p>
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {games.map((game, index) => (
              <div
                key={game.id}
                className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 cursor-pointer ${
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
                onClick={() => navigate(game.route)}
                onMouseEnter={() => setSelectedGame(game.id)}
                onMouseLeave={() => setSelectedGame(null)}
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}
                ></div>

                {/* Content */}
                <div className="relative p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="text-6xl">{game.icon}</div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400 mb-1">{game.difficulty}</div>
                      <div className="text-xs text-gray-500">{game.players}</div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl font-bold mb-2">{game.title}</h3>
                  <p className="text-lg text-gray-400 mb-4">{game.subtitle}</p>

                  {/* Description */}
                  <p className="text-gray-300 mb-6 leading-relaxed">{game.description}</p>

                  {/* Features */}
                  <div className="space-y-2 mb-8">
                    {game.features.map((feature, i) => (
                      <div key={i} className="flex items-center text-sm text-gray-300">
                        <span
                          className={`w-2 h-2 bg-gradient-to-r ${game.gradient} rounded-full mr-3`}
                        ></span>
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(game.route);
                    }}
                    className={`w-full bg-gradient-to-r ${game.gradient} text-white py-4 rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 group-hover:scale-105`}
                  >
                    Start Experience
                  </button>
                </div>

                {/* Hover Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "50K+", label: "Active Learners" },
              { number: "1M+", label: "Hours Played" },
              { number: "95%", label: "Satisfaction Rate" },
              { number: "24/7", label: "Available" },
            ].map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-2xl font-bold mb-4">🎓 Windgap Academy</div>
          <p className="text-gray-400 mb-8">Transforming education through immersive technology</p>
          <button
            onClick={() => navigate("/")}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← Back to Homepage
          </button>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx>{`
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
      `}</style>
    </div>
  );
}

export default PremiumGameHub;
