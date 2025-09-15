import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Advanced Background Effects */}
      <div className="fixed inset-0 z-0">
        {/* Animated Gradient Mesh */}
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              background: `
                radial-gradient(circle at ${mousePosition.x * 0.1}% ${mousePosition.y * 0.1}%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                radial-gradient(circle at ${100 - mousePosition.x * 0.1}% ${100 - mousePosition.y * 0.1}%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)
              `,
            }}
          />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Glassmorphism Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div
              className="flex items-center space-x-4 cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300">
                  <span className="text-white font-bold text-xl">W</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Windgap Academy
                </h1>
                <p className="text-xs text-gray-400 font-medium">Next-Generation AI Learning</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {["Features", "Characters", "Pricing"].map((item, index) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="relative text-gray-300 hover:text-white transition-all duration-300 font-medium group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/signin")}
                className="text-gray-300 hover:text-white px-6 py-2 rounded-xl transition-all duration-300 font-medium hover:bg-white/10 backdrop-blur-sm"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 hover:scale-105"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-50"></div>
              </button>
            </div>
          </div>
        </div>
      </nav>

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

      {/* Revolutionary Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center px-6 lg:px-8 pt-20"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Main Headline */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 leading-none">
              <span className="block bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                THE FUTURE
              </span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                OF LEARNING
              </span>
            </h1>

            <div className="relative">
              <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
                Experience revolutionary AI-powered education with
                <span className="text-blue-400 font-semibold"> immersive 3D environments</span>,
                <span className="text-purple-400 font-semibold"> adaptive learning paths</span>, and
                <span className="text-pink-400 font-semibold"> real-time collaboration</span>
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <button
              onClick={() => navigate("/games")}
              className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-12 py-5 rounded-2xl text-xl font-bold transition-all duration-500 shadow-2xl hover:shadow-blue-500/25 hover:scale-105"
            >
              <span className="relative z-10 flex items-center justify-center">
                🌟 Experience Immersive 3D Worlds
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
            </button>

            <button
              onClick={() => navigate("/educator-dashboard")}
              className="group relative bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white px-12 py-5 rounded-2xl text-xl font-bold transition-all duration-500 hover:scale-105"
            >
              <span className="relative z-10 flex items-center justify-center">
                👨‍🏫 For Educators
              </span>
            </button>
          </div>

          {/* Advanced Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                value: "50K+",
                label: "Active Learners",
                icon: "👥",
                color: "from-blue-500 to-cyan-500",
              },
              {
                value: "1.2K+",
                label: "AI Lessons",
                icon: "🧠",
                color: "from-purple-500 to-pink-500",
              },
              {
                value: "98.5%",
                label: "Success Rate",
                icon: "📈",
                color: "from-green-500 to-emerald-500",
              },
              {
                value: "24/7",
                label: "AI Support",
                icon: "🤖",
                color: "from-orange-500 to-red-500",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="group relative p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-500 hover:scale-105"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="text-5xl mb-4">{stat.icon}</div>
                <div
                  className={`text-4xl font-black mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                >
                  {stat.value}
                </div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* AI Characters Section */}
      <section id="characters" className="relative py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black mb-8">
              <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                AI COMPANIONS
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Meet our revolutionary AI characters with unique personalities, advanced learning
              algorithms, and adaptive teaching methods
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Andy",
                emoji: "🧮",
                role: "Math & Logic Genius",
                gradient: "from-green-400 via-emerald-500 to-teal-600",
                description:
                  "Master complex mathematics with AI-powered step-by-step guidance and interactive problem solving",
                skills: ["Calculus", "Algebra", "Statistics", "Logic"],
              },
              {
                name: "Daisy",
                emoji: "🎨",
                role: "Creative Arts Virtuoso",
                gradient: "from-pink-400 via-rose-500 to-red-600",
                description:
                  "Unleash your creativity through AI-enhanced art, music, and design with personalized projects",
                skills: ["Digital Art", "Music", "Design", "Writing"],
              },
              {
                name: "Natalie",
                emoji: "🔬",
                role: "Science Explorer",
                gradient: "from-purple-400 via-violet-500 to-indigo-600",
                description:
                  "Discover scientific wonders through immersive experiments and real-world applications",
                skills: ["Physics", "Chemistry", "Biology", "Research"],
              },
              {
                name: "Winnie",
                emoji: "☁️",
                role: "Learning Orchestrator",
                gradient: "from-blue-400 via-cyan-500 to-sky-600",
                description:
                  "Optimize your learning journey with AI-powered study plans and progress tracking",
                skills: ["Planning", "Analytics", "Motivation", "Support"],
              },
            ].map((character, index) => (
              <div
                key={character.name}
                className="group relative cursor-pointer"
                onClick={() => navigate(`/character/${character.name.toLowerCase()}`)}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="relative p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-500 hover:scale-105 h-full">
                  {/* Character Avatar */}
                  <div className="relative mb-6">
                    <div
                      className={`w-24 h-24 mx-auto bg-gradient-to-br ${character.gradient} rounded-3xl flex items-center justify-center text-5xl shadow-2xl group-hover:scale-110 transition-all duration-500`}
                    >
                      {character.emoji}
                    </div>
                    <div
                      className={`absolute inset-0 w-24 h-24 mx-auto bg-gradient-to-br ${character.gradient} rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500`}
                    ></div>
                  </div>

                  {/* Character Info */}
                  <h3 className="text-3xl font-black text-white mb-2 text-center group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-500">
                    {character.name}
                  </h3>

                  <p
                    className={`text-center mb-4 font-bold bg-gradient-to-r ${character.gradient} bg-clip-text text-transparent`}
                  >
                    {character.role}
                  </p>

                  <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                    {character.description}
                  </p>

                  {/* Skills */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {character.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="text-xs bg-white/10 text-white px-3 py-1 rounded-full border border-white/20"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    className={`w-full bg-gradient-to-r ${character.gradient} hover:scale-105 text-white py-4 rounded-2xl font-bold transition-all duration-500 shadow-2xl`}
                  >
                    Learn with {character.name} →
                  </button>

                  {/* Glow Effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${character.gradient} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Revolutionary Features Section */}
      <section id="features" className="relative py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black mb-8">
              <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                NEXT-GEN FEATURES
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Experience revolutionary educational technology that adapts, evolves, and transforms
              learning
            </p>
          </div>

          {/* Advanced Feature Tabs */}
          <div className="mb-16">
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {[
                { name: "AI Personalization", icon: "🧠" },
                { name: "3D Environments", icon: "🌐" },
                { name: "Real-time Collaboration", icon: "👥" },
                { name: "Adaptive Assessment", icon: "📊" },
              ].map((feature, index) => (
                <button
                  key={index}
                  className={`group relative px-8 py-4 rounded-2xl font-bold transition-all duration-500 ${
                    activeTab === index
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl scale-105"
                      : "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:scale-105"
                  }`}
                  onClick={() => setActiveTab(index)}
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span className="text-2xl">{feature.icon}</span>
                    <span>{feature.name}</span>
                  </span>
                  {activeTab === index && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-50"></div>
                  )}
                </button>
              ))}
            </div>

            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-12 hover:bg-white/10 transition-all duration-500">
              {activeTab === 0 && (
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-4xl font-black text-white mb-6 flex items-center">
                      <span className="text-5xl mr-4">🧠</span>
                      AI Personalization Engine
                    </h3>
                    <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                      Revolutionary AI analyzes your unique learning patterns, cognitive
                      preferences, and knowledge gaps to create hyper-personalized educational
                      experiences that evolve in real-time.
                    </p>
                    <ul className="space-y-4 text-gray-300 mb-8">
                      <li className="flex items-center">
                        <span className="text-green-400 mr-3 text-xl">✓</span> Neural
                        network-powered curriculum generation
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-400 mr-3 text-xl">✓</span> Real-time cognitive
                        load optimization
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-400 mr-3 text-xl">✓</span> Multi-modal learning
                        style adaptation
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-400 mr-3 text-xl">✓</span> Predictive
                        performance analytics
                      </li>
                    </ul>
                    <button
                      onClick={() => navigate("/learner-dashboard")}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-500 shadow-2xl hover:scale-105"
                    >
                      Experience AI Learning →
                    </button>
                  </div>
                  <div className="relative">
                    <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 p-10 rounded-3xl text-center">
                      <div className="text-8xl mb-6">🧠</div>
                      <div className="text-4xl font-black text-white mb-4">98.5%</div>
                      <div className="text-gray-300 text-lg">Learning Optimization Rate</div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-20"></div>
                  </div>
                </div>
              )}

              {activeTab === 1 && (
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-4xl font-black text-white mb-6 flex items-center">
                      <span className="text-5xl mr-4">🌐</span>
                      Immersive 3D Worlds
                    </h3>
                    <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                      Step into photorealistic 3D environments powered by advanced rendering
                      engines. Experience abstract concepts through tangible, interactive
                      simulations that make learning unforgettable.
                    </p>
                    <ul className="space-y-4 text-gray-300 mb-8">
                      <li className="flex items-center">
                        <span className="text-green-400 mr-3 text-xl">✓</span> Photorealistic
                        virtual laboratories
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-400 mr-3 text-xl">✓</span> Historical
                        environment recreation
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-400 mr-3 text-xl">✓</span> Interactive physics
                        simulations
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-400 mr-3 text-xl">✓</span> Multi-dimensional
                        visualizations
                      </li>
                    </ul>
                    <button
                      onClick={() => navigate("/games")}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-500 shadow-2xl hover:scale-105"
                    >
                      Explore 3D Worlds →
                    </button>
                  </div>
                  <div className="relative">
                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-white/20 p-10 rounded-3xl text-center">
                      <div className="text-8xl mb-6">🏛️</div>
                      <div className="text-4xl font-black text-white mb-4">50+</div>
                      <div className="text-gray-300 text-lg">Immersive Environments</div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-20"></div>
                  </div>
                </div>
              )}

              {activeTab === 2 && (
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-4xl font-black text-white mb-6 flex items-center">
                      <span className="text-5xl mr-4">👥</span>
                      Live Collaboration
                    </h3>
                    <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                      Connect with learners worldwide in real-time collaborative spaces. Share
                      ideas, solve problems together, and learn from diverse perspectives in our
                      advanced social learning platform.
                    </p>
                    <ul className="space-y-4 text-gray-300 mb-8">
                      <li className="flex items-center">
                        <span className="text-green-400 mr-3 text-xl">✓</span> Real-time multi-user
                        sessions
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-400 mr-3 text-xl">✓</span> Collaborative
                        whiteboards
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-400 mr-3 text-xl">✓</span> Peer-to-peer learning
                        networks
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-400 mr-3 text-xl">✓</span> Global project
                        collaboration
                      </li>
                    </ul>
                    <button
                      onClick={() => navigate("/collaboration")}
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-500 shadow-2xl hover:scale-105"
                    >
                      Join Collaboration →
                    </button>
                  </div>
                  <div className="relative">
                    <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-white/20 p-10 rounded-3xl text-center">
                      <div className="text-8xl mb-6">🤝</div>
                      <div className="text-4xl font-black text-white mb-4">24/7</div>
                      <div className="text-gray-300 text-lg">Live Learning Sessions</div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-blue-500 rounded-3xl blur-2xl opacity-20"></div>
                  </div>
                </div>
              )}

              {activeTab === 3 && (
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-4xl font-black text-white mb-6 flex items-center">
                      <span className="text-5xl mr-4">📊</span>
                      Adaptive Assessment
                    </h3>
                    <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                      Experience intelligent assessments that dynamically adjust to your skill
                      level, providing instant feedback and personalized improvement recommendations
                      powered by machine learning.
                    </p>
                    <ul className="space-y-4 text-gray-300 mb-8">
                      <li className="flex items-center">
                        <span className="text-green-400 mr-3 text-xl">✓</span> Dynamic difficulty
                        calibration
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-400 mr-3 text-xl">✓</span> Instant AI-powered
                        feedback
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-400 mr-3 text-xl">✓</span> Comprehensive
                        progress tracking
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-400 mr-3 text-xl">✓</span> Predictive skill
                        mapping
                      </li>
                    </ul>
                    <button
                      onClick={() => navigate("/analytics")}
                      className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-500 shadow-2xl hover:scale-105"
                    >
                      View Analytics →
                    </button>
                  </div>
                  <div className="relative">
                    <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-white/20 p-10 rounded-3xl text-center">
                      <div className="text-8xl mb-6">📈</div>
                      <div className="text-4xl font-black text-white mb-4">Real-time</div>
                      <div className="text-gray-300 text-lg">Adaptive Intelligence</div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl blur-2xl opacity-20"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Revolutionary CTA Section */}
      <section className="relative py-32 px-6 lg:px-8 overflow-hidden">
        {/* Advanced Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
          <div className="absolute inset-0 backdrop-blur-3xl"></div>
          {/* Animated Orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h2 className="text-6xl md:text-8xl font-black mb-8">
            <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              READY TO EVOLVE?
            </span>
          </h2>

          <p className="text-2xl md:text-3xl text-gray-300 mb-16 leading-relaxed max-w-4xl mx-auto">
            Join the <span className="text-blue-400 font-bold">50,000+ learners</span> and
            <span className="text-purple-400 font-bold"> educators</span> already experiencing the
            future of education
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center mb-20">
            <button
              onClick={() => navigate("/signup")}
              className="group relative bg-gradient-to-r from-white to-gray-100 text-black px-12 py-6 rounded-3xl text-2xl font-black transition-all duration-500 shadow-2xl hover:scale-110"
            >
              <span className="relative z-10 flex items-center justify-center">
                🚀 START FREE TRIAL
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
            </button>

            <button
              onClick={() => navigate("/educator-dashboard")}
              className="group relative bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white px-12 py-6 rounded-3xl text-2xl font-black transition-all duration-500 hover:scale-110"
            >
              <span className="relative z-10 flex items-center justify-center">
                👨‍🏫 EDUCATOR ACCESS
              </span>
            </button>
          </div>

          {/* Advanced Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                icon: "🏆",
                text: "Award Winning Platform",
                gradient: "from-yellow-400 to-orange-500",
              },
              {
                icon: "🔒",
                text: "Enterprise Security",
                gradient: "from-green-400 to-emerald-500",
              },
              { icon: "🌍", text: "Global Accessibility", gradient: "from-blue-400 to-cyan-500" },
              {
                icon: "⚡",
                text: "Lightning Performance",
                gradient: "from-purple-400 to-pink-500",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-500 hover:scale-105"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <div
                  className={`text-lg font-bold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}
                >
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Futuristic Footer */}
      <footer className="relative py-20 px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-8">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl">
                    <span className="text-white font-black text-2xl">W</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-50"></div>
                </div>
                <div>
                  <h3 className="text-3xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                    Windgap Academy
                  </h3>
                  <p className="text-gray-400 font-medium">Next-Generation AI Learning Platform</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                Revolutionizing education through cutting-edge AI technology, immersive 3D
                environments, and adaptive learning systems that evolve with every learner.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: "🌐", label: "Website" },
                  { icon: "📱", label: "Mobile" },
                  { icon: "💬", label: "Community" },
                  { icon: "📧", label: "Email" },
                ].map((social, index) => (
                  <button
                    key={index}
                    className="w-14 h-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110 text-2xl"
                  >
                    {social.icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-6">Platform</h3>
              <ul className="space-y-4 text-gray-300">
                <li>
                  <button
                    onClick={() => navigate("/learner-dashboard")}
                    className="hover:text-white transition-all duration-300 text-left hover:translate-x-2 transform flex items-center"
                  >
                    <span className="mr-2">🎓</span> Learner Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/educator-dashboard")}
                    className="hover:text-white transition-all duration-300 text-left hover:translate-x-2 transform flex items-center"
                  >
                    <span className="mr-2">👨‍🏫</span> Educator Portal
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/games")}
                    className="hover:text-white transition-all duration-300 text-left hover:translate-x-2 transform flex items-center"
                  >
                    <span className="mr-2">🎮</span> Interactive Games
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/analytics")}
                    className="hover:text-white transition-all duration-300 text-left hover:translate-x-2 transform flex items-center"
                  >
                    <span className="mr-2">📊</span> Analytics
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-6">AI Characters</h3>
              <ul className="space-y-4 text-gray-300">
                <li>
                  <button
                    onClick={() => navigate("/character/andy")}
                    className="hover:text-white transition-all duration-300 text-left hover:translate-x-2 transform flex items-center"
                  >
                    <span className="mr-2">🧮</span> Andy - Math Genius
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/character/daisy")}
                    className="hover:text-white transition-all duration-300 text-left hover:translate-x-2 transform flex items-center"
                  >
                    <span className="mr-2">🎨</span> Daisy - Arts Virtuoso
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/character/natalie")}
                    className="hover:text-white transition-all duration-300 text-left hover:translate-x-2 transform flex items-center"
                  >
                    <span className="mr-2">🔬</span> Natalie - Science Explorer
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/character/winnie")}
                    className="hover:text-white transition-all duration-300 text-left hover:translate-x-2 transform flex items-center"
                  >
                    <span className="mr-2">☁️</span> Winnie - Learning Guide
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-6">Support</h3>
              <ul className="space-y-4 text-gray-300">
                <li>
                  <button
                    onClick={() => navigate("/help")}
                    className="hover:text-white transition-all duration-300 text-left hover:translate-x-2 transform flex items-center"
                  >
                    <span className="mr-2">❓</span> Help Center
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/contact")}
                    className="hover:text-white transition-all duration-300 text-left hover:translate-x-2 transform flex items-center"
                  >
                    <span className="mr-2">📞</span> Contact Support
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/privacy")}
                    className="hover:text-white transition-all duration-300 text-left hover:translate-x-2 transform flex items-center"
                  >
                    <span className="mr-2">🔒</span> Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/terms")}
                    className="hover:text-white transition-all duration-300 text-left hover:translate-x-2 transform flex items-center"
                  >
                    <span className="mr-2">📋</span> Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-12">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0 text-lg">
                © 2024 Windgap Academy. All rights reserved. Powered by revolutionary AI
                technology.
              </p>
              <div className="flex items-center space-x-8 text-gray-400">
                <span className="flex items-center">
                  <span className="mr-2">🚀</span> Version 3.0
                </span>
                <span className="flex items-center">
                  <span className="mr-2">⚡</span> 99.9% Uptime
                </span>
                <span className="flex items-center">
                  <span className="mr-2">🔒</span> SOC 2 Certified
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
