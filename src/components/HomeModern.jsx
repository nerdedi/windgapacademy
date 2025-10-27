import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationModern from "./NavigationModern";

// Portions of this file were generated with the assistance of GitHub Copilot

export default function HomeModern() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.3 },
    },
  };

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // List of features with their details
  const features = [
    {
      id: "fluid",
      name: "Fluid Simulation",
      description: "Interactive fluid physics simulation using WebGL",
      path: "/tools/fluid-simulation",
      icon: "💧",
      color: "from-cyan-500 to-blue-500",
      category: "tool",
    },
    {
      id: "whiteboard",
      name: "Whiteboard",
      description: "Interactive digital whiteboard for teaching and brainstorming",
      path: "/tools/whiteboard",
      icon: "✏️",
      color: "from-gray-500 to-gray-700",
      category: "tool",
    },
    {
      id: "ripple",
      name: "Ripple Effect",
      description: "Interactive ripple animations using WebGL shaders",
      path: "/tools/ripple-effect",
      icon: "🌊",
      color: "from-blue-400 to-indigo-500",
      category: "tool",
    },
    {
      id: "webgl",
      name: "WebGL Effects",
      description: "Various visual effects powered by WebGL",
      path: "/tools/webgl-effects",
      icon: "✨",
      color: "from-purple-500 to-pink-500",
      category: "tool",
    },
    {
      id: "character",
      name: "Character Animation",
      description: "Character animation system for educational games",
      path: "/tools/character-animation",
      icon: "🏃",
      color: "from-orange-400 to-red-500",
      category: "tool",
    },
    {
      id: "adaptive",
      name: "Adaptive Learning",
      description: "Personalized learning experiences that adapt to student needs",
      path: "/adaptive-demo",
      icon: "🧠",
      color: "from-green-400 to-emerald-500",
      category: "learning",
    },
    {
      id: "exec-function",
      name: "Executive Function",
      description: "Tools to develop executive function skills",
      path: "/executive-function-demo",
      icon: "📊",
      color: "from-yellow-400 to-amber-500",
      category: "learning",
    },
    {
      id: "neuro",
      name: "Neurodivergent Learning",
      description: "Specialized learning approaches for neurodivergent students",
      path: "/neurodivergent-learning",
      icon: "🧩",
      color: "from-teal-400 to-cyan-500",
      category: "learning",
    },
    {
      id: "ai",
      name: "AI Assistant",
      description: "AI-powered learning assistant",
      path: "/ai-assistant",
      icon: "🤖",
      color: "from-violet-400 to-purple-500",
      category: "tool",
    },
    {
      id: "math",
      name: "Math Exercises",
      description: "Interactive math exercises for different skill levels",
      path: "/exercises/math",
      icon: "🔢",
      color: "from-red-400 to-rose-500",
      category: "learning",
    },
    {
      id: "adaptive-math",
      name: "Adaptive Math Quest",
      description: "Personalized math learning journey",
      path: "/math/adaptive-quest",
      icon: "📝",
      color: "from-sky-400 to-blue-500",
      category: "learning",
    },
    {
      id: "fractions",
      name: "Fraction Mastery",
      description: "Master fractions with interactive exercises",
      path: "/math/fraction-mastery",
      icon: "½",
      color: "from-indigo-400 to-violet-500",
      category: "learning",
    },
  ];

  // Group features by category
  const tools = features.filter((feature) => feature.category === "tool");
  const learningModules = features.filter((feature) => feature.category === "learning");

  // Parallax effect based on mouse position
  const getParallaxStyle = (depth = 1) => {
    const maxMovement = 10;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const moveX = (mousePosition.x / windowWidth - 0.5) * maxMovement * depth;
    const moveY = (mousePosition.y / windowHeight - 0.5) * maxMovement * depth;

    return {
      transform: `translate(${moveX}px, ${moveY}px)`,
      transition: "transform 0.1s ease-out",
    };
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background gradient effect that follows mouse */}
      <div
        className="fixed inset-0 bg-gradient-radial opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(79, 70, 229, 0.4) 0%, transparent 50%)`,
        }}
      ></div>

      {/* Header / Navigation */}
      <NavigationModern />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="min-h-screen relative flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #000000 0%, #0f172a 100%)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          {/* Animated particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-indigo-600 opacity-80"
                animate={{
                  x: [
                    `calc(${Math.random() * 100}vw)`,
                    `calc(${Math.random() * 100}vw)`,
                    `calc(${Math.random() * 100}vw)`,
                  ],
                  y: [
                    `calc(${Math.random() * 100}vh)`,
                    `calc(${Math.random() * 100}vh)`,
                    `calc(${Math.random() * 100}vh)`,
                  ],
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 15 + Math.random() * 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={getParallaxStyle(0.5)}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Interactive Learning
              <br />
              <span className="text-white">Reimagined</span>
            </h1>

            <p className="text-xl md:text-2xl mb-10 text-gray-300 max-w-3xl mx-auto">
              Explore our collection of interactive tools and adaptive learning modules designed for
              diverse learning styles and abilities.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => {
                  const featuresSection = document.getElementById("features");
                  featuresSection.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-lg font-medium hover:shadow-lg hover:from-indigo-500 hover:to-purple-500 transition duration-300"
              >
                Explore Tools
              </button>

              <button
                onClick={() => {
                  const learningSection = document.getElementById("learning");
                  learningSection.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-3 bg-transparent border-2 border-indigo-500 rounded-full text-lg font-medium hover:bg-indigo-900 hover:bg-opacity-30 transition duration-300"
              >
                Learning Modules
              </button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Tools Section */}
      <section id="features" className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-500">
              Interactive Tools
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Engage with our collection of interactive tools designed to enhance the learning
              experience.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {tools.map((feature) => (
              <motion.div
                key={feature.id}
                variants={cardVariants}
                whileHover="hover"
                onMouseEnter={() => setHoveredCard(feature.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => navigate(feature.path)}
                className="cursor-pointer"
              >
                <div
                  className={`h-full bg-gradient-to-br ${feature.color} rounded-xl p-6 shadow-md text-white relative overflow-hidden`}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.name}</h3>
                  <p className="text-white/80">{feature.description}</p>

                  {hoveredCard === feature.id && (
                    <motion.div
                      className="absolute bottom-4 right-4"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="bg-white bg-opacity-30 px-3 py-1 rounded-full text-sm">
                        Explore →
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Learning Modules Section */}
      <section id="learning" className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
              Learning Modules
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Access adaptive learning experiences designed to accommodate different learning styles
              and abilities.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {learningModules.map((module) => (
              <motion.div
                key={module.id}
                variants={cardVariants}
                whileHover="hover"
                onMouseEnter={() => setHoveredCard(module.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => navigate(module.path)}
                className="cursor-pointer"
              >
                <div
                  className={`h-full bg-gradient-to-br ${module.color} rounded-xl p-6 shadow-md text-white relative overflow-hidden`}
                >
                  <div className="text-4xl mb-4">{module.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{module.name}</h3>
                  <p className="text-white/80">{module.description}</p>

                  {hoveredCard === module.id && (
                    <motion.div
                      className="absolute bottom-4 right-4"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="bg-white bg-opacity-30 px-3 py-1 rounded-full text-sm">
                        Explore →
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-6">Windgap Academy</h2>
          <p className="text-gray-400 mb-8">
            A comprehensive learning platform with interactive tools, adaptive learning modules, and
            educational games designed for diverse learning styles.
          </p>
          <div className="flex justify-center space-x-6 mb-8">
            {["About", "Contact", "Privacy", "Terms"].map((item, index) => (
              <a key={index} href="#" className="text-gray-400 hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>
          <p className="text-gray-600">© 2025 Windgap Academy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
