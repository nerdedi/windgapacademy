import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GamePlayground() {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState(null);
  const [playerStats, setPlayerStats] = useState({
    level: 12,
    xp: 2450,
    coins: 1250,
    achievements: 23,
  });

  const games = [
    {
      id: "zoo",
      title: "Virtual Zoo Explorer",
      description:
        "Explore a 3D zoo environment and learn about animals through interactive experiences",
      image: "/assets/images/zoo-game.jpg",
      difficulty: "Beginner",
      players: "1,234 playing",
      category: "Science",
      route: "/zoo",
      features: ["3D Environment", "Animal Facts", "Interactive Learning", "Voice Narration"],
    },
    {
      id: "kitchen",
      title: "Master Chef Kitchen",
      description: "Learn cooking skills in a realistic 3D kitchen with step-by-step recipes",
      image: "/assets/images/kitchen-game.jpg",
      difficulty: "Intermediate",
      players: "892 playing",
      category: "Life Skills",
      route: "/kitchen",
      features: ["Recipe System", "Cooking Simulation", "Nutrition Learning", "Progress Tracking"],
    },
    {
      id: "supermarket",
      title: "Smart Shopping Simulator",
      description: "Practice money management and shopping skills in a virtual supermarket",
      image: "/assets/images/supermarket-game.jpg",
      difficulty: "Beginner",
      players: "567 playing",
      category: "Math & Money",
      route: "/supermarket",
      features: ["Money Management", "Budget Planning", "Product Recognition", "Math Skills"],
    },
    {
      id: "clubhouse",
      title: "Social Clubhouse",
      description: "Develop social skills and communication in a safe virtual environment",
      image: "/assets/images/clubhouse-game.jpg",
      difficulty: "All Levels",
      players: "1,456 playing",
      category: "Social Skills",
      route: "/clubhouse",
      features: ["Social Interaction", "Communication Skills", "Team Building", "Friendship"],
    },
    {
      id: "calmspace",
      title: "Mindfulness Garden",
      description: "Practice mindfulness and relaxation techniques in a peaceful 3D environment",
      image: "/assets/images/calmspace-game.jpg",
      difficulty: "All Levels",
      players: "789 playing",
      category: "Wellbeing",
      route: "/calmspace",
      features: ["Meditation", "Breathing Exercises", "Stress Relief", "Peaceful Environment"],
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Advanced Gaming Header */}
      <div className="relative bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 py-16 px-6 lg:px-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-6xl md:text-8xl font-black mb-6">
              <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                3D GAMING
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                UNIVERSE
              </span>
            </h1>
            <p className="text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Immerse yourself in cutting-edge 3D learning environments with realistic physics,
              interactive gameplay, and educational content that adapts to your learning style.
            </p>
          </div>

          {/* Player Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            {[
              {
                label: "Level",
                value: playerStats.level,
                icon: "⭐",
                color: "from-yellow-400 to-orange-500",
              },
              {
                label: "XP Points",
                value: playerStats.xp.toLocaleString(),
                icon: "🎯",
                color: "from-blue-400 to-purple-500",
              },
              {
                label: "Coins",
                value: playerStats.coins.toLocaleString(),
                icon: "🪙",
                color: "from-green-400 to-emerald-500",
              },
              {
                label: "Achievements",
                value: playerStats.achievements,
                icon: "🏆",
                color: "from-purple-400 to-pink-500",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div
                  className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}
                >
                  {stat.value}
                </div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                CHOOSE YOUR ADVENTURE
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Select from our collection of immersive 3D learning games, each designed to teach
              specific skills through engaging gameplay
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game, index) => (
              <div
                key={game.id}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-500 hover:scale-105 cursor-pointer"
                onClick={() => navigate(game.route)}
              >
                {/* Game Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
                  <div className="text-6xl">
                    {game.id === "zoo"
                      ? "🦁"
                      : game.id === "kitchen"
                        ? "👨‍🍳"
                        : game.id === "supermarket"
                          ? "🛒"
                          : game.id === "clubhouse"
                            ? "🏠"
                            : "🧘‍♀️"}
                  </div>
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                    {game.difficulty}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    {game.players}
                  </div>
                </div>

                {/* Game Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                      {game.title}
                    </h3>
                    <span className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                      {game.category}
                    </span>
                  </div>

                  <p className="text-gray-300 mb-4 leading-relaxed">{game.description}</p>

                  {/* Features */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {game.features.map((feature, featureIndex) => (
                        <span
                          key={featureIndex}
                          className="bg-white/10 text-white px-3 py-1 rounded-full text-xs border border-white/20"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Play Button */}
                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-2xl font-bold transition-all duration-500 shadow-2xl hover:scale-105 flex items-center justify-center">
                    <span className="mr-2">🎮</span>
                    Play Now
                  </button>
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>

          {/* Quick Access Navigation */}
          <div className="mt-20 text-center">
            <h3 className="text-3xl font-bold text-white mb-8">Quick Access</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate("/learner-dashboard")}
                className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
              >
                📊 Learning Dashboard
              </button>
              <button
                onClick={() => navigate("/educator-dashboard")}
                className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
              >
                👨‍🏫 Educator Portal
              </button>
              <button
                onClick={() => navigate("/")}
                className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
              >
                🏠 Home
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
      `}</style>
    </div>
  );
}
