/**
 * Sophisticated Home Component - Figma-level design
 *
 * Features:
 * - Advanced cursor interactions and magnetic effects
 * - Smooth parallax scrolling and micro-animations
 * - Interactive hero demonstrations
 * - Command palette and keyboard shortcuts
 * - Professional typography and spacing
 * - Character animations with Andy, Daisy, Natalie, and Winnie
 */

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Import sophisticated UI components
import { MagneticButton } from "./ui/MagneticButton";
import { InteractiveCard } from "./ui/InteractiveCard";
import { LivePreview } from "./ui/LivePreview";
import { CommandPalette } from "./ui/CommandPalette";
import { FloatingActionButton } from "./ui/FloatingActionButton";
import { CharacterAnimations } from "./ui/CharacterAnimations";

function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showCharacters, setShowCharacters] = useState(true);

  // Parallax scroll values
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, -200]);
  const featuresY = useTransform(scrollY, [0, 1000], [0, -100]);

  // Advanced cursor tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
      }
    };

    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowCommandPalette(true);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);

    // Simulate loading
    setTimeout(() => setIsLoading(false), 1500);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Magnetic button effect
  const handleMagneticHover = useCallback((element, isHovering) => {
    if (isHovering) {
      setHoveredElement(element);
    } else {
      setHoveredElement(null);
    }
  }, []);

  // Navigation handlers
  const handleGetStarted = () => {
    navigate("/signup");
  };

  const handleExploreGames = () => {
    navigate("/games");
  };

  const handleViewDashboard = () => {
    navigate("/dashboard");
  };

  if (isLoading) {
    return <SophisticatedLoader />;
  }

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden"
    >
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className={`fixed w-5 h-5 pointer-events-none z-50 transition-all duration-200 ${
          hoveredElement ? "scale-150 bg-blue-500" : "scale-100 bg-gray-400"
        } rounded-full mix-blend-difference`}
        style={{ left: 0, top: 0 }}
      />

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      {/* Sophisticated Navigation */}
      <SophisticatedNavigation onCommandPalette={() => setIsCommandPaletteOpen(true)} />

      {/* Hero Section */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-screen flex items-center justify-center px-6"
      >
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <motion.h1
              className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              The Future of
              <motion.span
                className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Learning
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 leading-relaxed max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Experience AI-powered education with immersive 3D environments, personalized learning
              paths, and sophisticated analytics.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <MagneticButton
                onClick={handleGetStarted}
                onHover={(isHovering) => handleMagneticHover("cta", isHovering)}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Get Started Free
              </MagneticButton>

              <MagneticButton
                onClick={handleExploreGames}
                onHover={(isHovering) => handleMagneticHover("explore", isHovering)}
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-gray-400 transition-all duration-300"
              >
                Explore Games
              </MagneticButton>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              className="flex gap-8 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">50K+</div>
                <div className="text-sm text-gray-500">Active Learners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">200+</div>
                <div className="text-sm text-gray-500">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">98%</div>
                <div className="text-sm text-gray-500">Satisfaction</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Interactive Demo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="relative"
          >
            <LivePreview />
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section style={{ y: featuresY }} className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Sophisticated Learning Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the most advanced educational technology with AI-powered personalization,
              immersive 3D environments, and real-time collaboration.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <InteractiveCard
              title="AI-Powered Learning"
              description="Personalized learning paths that adapt to your pace and style"
              icon="🤖"
              delay={0.1}
            />
            <InteractiveCard
              title="3D Immersive Games"
              description="Explore mathematics, science, and language in stunning 3D worlds"
              icon="🎮"
              delay={0.2}
            />
            <InteractiveCard
              title="Real-time Analytics"
              description="Track progress with sophisticated analytics and insights"
              icon="📊"
              delay={0.3}
            />
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-24 px-6 bg-gradient-to-r from-blue-600 to-purple-600"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
          >
            Ready to Transform Learning?
          </motion.h2>
          <motion.p
            className="text-xl text-blue-100 mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
          >
            Join thousands of learners already experiencing the future of education
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <MagneticButton
              onClick={handleGetStarted}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Learning Today
            </MagneticButton>
          </motion.div>
        </div>
      </motion.section>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={handleViewDashboard} />
    </div>
  );
}

// Sophisticated Loading Component
const SophisticatedLoader = () => (
  <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
    <div className="text-center">
      <motion.div
        className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.h2
        className="text-2xl font-semibold text-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Loading Windgap Academy
      </motion.h2>
    </div>
  </div>
);

// Sophisticated Navigation Component
const SophisticatedNavigation = ({ onCommandPalette }) => {
  const navigate = useNavigate();

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">W</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">Windgap Academy</span>
        </motion.div>

        <div className="hidden md:flex items-center space-x-8">
          <NavLink href="/games">Games</NavLink>
          <NavLink href="/courses">Courses</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={onCommandPalette}
            className="hidden md:flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <span className="text-sm">Search</span>
            <kbd className="text-xs bg-white px-2 py-1 rounded border">⌘K</kbd>
          </button>

          <MagneticButton
            onClick={() => navigate("/signin")}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Sign In
          </MagneticButton>

          <MagneticButton
            onClick={() => navigate("/signup")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Sign Up
          </MagneticButton>
        </div>
      </div>
    </motion.nav>
  );
};

// Navigation Link Component
const NavLink = ({ href, children }) => {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate(href)}
      className="text-gray-600 hover:text-gray-900 font-medium transition-colors relative"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  );
};

function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // Parallax scroll values
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, -200]);
  const featuresY = useTransform(scrollY, [0, 1000], [0, -100]);

  // Cursor tracking for magnetic effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowCommandPalette(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Loading simulation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    navigate("/signup");
  };

  const handleViewDashboard = (action) => {
    switch (action) {
      case "dashboard":
        navigate("/dashboard");
        break;
      case "games":
        navigate("/games");
        break;
      case "help":
        navigate("/help");
        break;
      default:
        navigate("/dashboard");
    }
  };

  const handleCharacterClick = (character) => {
    console.log(`${character.name} clicked!`, character);
    // You can add specific actions for each character here
  };

  if (isLoading) {
    return <SophisticatedLoader />;
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Command Palette */}
      <CommandPalette isOpen={showCommandPalette} onClose={() => setShowCommandPalette(false)} />

      {/* Navigation */}
      <SophisticatedNavigation onCommandPalette={() => setShowCommandPalette(true)} />

      {/* Hero Section */}
      <motion.section
        style={{ y: heroY }}
        className="relative min-h-screen flex items-center justify-center px-6 pt-20"
      >
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1
              className="text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            >
              Learn with
              <motion.span
                className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Windgap Academy
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              Experience the future of education with AI-powered personalization, immersive 3D
              environments, and sophisticated learning analytics. Meet your learning companions:
              Andy, Daisy, Natalie, and Winnie!
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            >
              <MagneticButton
                onClick={handleGetStarted}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Learning Today
              </MagneticButton>

              <MagneticButton
                onClick={() => handleViewDashboard("games")}
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-gray-400 transition-all duration-300"
              >
                Explore Games
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* Interactive Demo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="relative"
          >
            <LivePreview />
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section style={{ y: featuresY }} className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Sophisticated Learning Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the most advanced educational technology with AI-powered personalization,
              immersive 3D environments, and real-time collaboration.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <InteractiveCard
              title="AI-Powered Learning"
              description="Personalized learning paths that adapt to your pace and style"
              icon="🤖"
              delay={0.1}
            />
            <InteractiveCard
              title="3D Immersive Games"
              description="Explore mathematics, science, and language in stunning 3D worlds"
              icon="🎮"
              delay={0.2}
            />
            <InteractiveCard
              title="Real-time Analytics"
              description="Track progress with sophisticated analytics and insights"
              icon="📊"
              delay={0.3}
            />
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-24 px-6 bg-gradient-to-r from-blue-600 to-purple-600"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
          >
            Ready to Transform Learning?
          </motion.h2>
          <motion.p
            className="text-xl text-blue-100 mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
          >
            Join thousands of learners already experiencing the future of education
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <MagneticButton
              onClick={handleGetStarted}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Learning Today
            </MagneticButton>
          </motion.div>
        </div>
      </motion.section>

      {/* Character Animations - Andy, Daisy, Natalie, and Winnie */}
      <CharacterAnimations isVisible={showCharacters} onCharacterClick={handleCharacterClick} />

      {/* Floating Action Button */}
      <FloatingActionButton onClick={handleViewDashboard} />
    </div>
  );
}

export default Home;
