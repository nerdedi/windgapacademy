/**
 * Command Palette Component - Figma-level sophistication
 *
 * Features:
 * - Advanced search with instant results
 * - Keyboard navigation and shortcuts
 * - Contextual commands and actions
 * - Professional design and animations
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const commands = [
    {
      id: "games",
      title: "Explore Games",
      description: "Browse our collection of educational games",
      icon: "🎮",
      action: () => navigate("/games"),
      keywords: ["games", "play", "math", "science", "reading"],
    },
    {
      id: "dashboard",
      title: "Go to Dashboard",
      description: "View your learning progress and analytics",
      icon: "📊",
      action: () => navigate("/dashboard"),
      keywords: ["dashboard", "progress", "analytics", "stats"],
    },
    {
      id: "courses",
      title: "Browse Courses",
      description: "Discover new learning opportunities",
      icon: "📚",
      action: () => navigate("/courses"),
      keywords: ["courses", "learn", "education", "study"],
    },
    {
      id: "profile",
      title: "Edit Profile",
      description: "Manage your account settings",
      icon: "👤",
      action: () => navigate("/profile"),
      keywords: ["profile", "account", "settings", "user"],
    },
    {
      id: "help",
      title: "Get Help",
      description: "Find answers and support",
      icon: "❓",
      action: () => navigate("/help"),
      keywords: ["help", "support", "faq", "contact"],
    },
  ];

  const filteredCommands = commands.filter(
    (command) =>
      command.title.toLowerCase().includes(query.toLowerCase()) ||
      command.description.toLowerCase().includes(query.toLowerCase()) ||
      command.keywords.some((keyword) => keyword.toLowerCase().includes(query.toLowerCase())),
  );

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredCommands.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredCommands.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
        break;
      case "Escape":
        onClose();
        break;
    }
  };

  const handleCommandClick = (command) => {
    command.action();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-start justify-center pt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Command Palette */}
        <motion.div
          className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center px-6 py-4 border-b border-gray-100">
            <svg
              className="w-5 h-5 text-gray-400 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for commands, pages, or features..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 text-lg bg-transparent border-none outline-none placeholder-gray-400"
            />
            <kbd className="hidden sm:block px-2 py-1 text-xs bg-gray-100 rounded border">ESC</kbd>
          </div>

          {/* Commands List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredCommands.length > 0 ? (
              <div className="py-2">
                {filteredCommands.map((command, index) => (
                  <motion.button
                    key={command.id}
                    onClick={() => handleCommandClick(command)}
                    className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                      index === selectedIndex
                        ? "bg-blue-50 border-r-2 border-blue-500"
                        : "hover:bg-gray-50"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <span className="text-2xl mr-4">{command.icon}</span>
                    <div className="flex-1">
                      <div
                        className={`font-medium ${
                          index === selectedIndex ? "text-blue-900" : "text-gray-900"
                        }`}
                      >
                        {command.title}
                      </div>
                      <div className="text-sm text-gray-500">{command.description}</div>
                    </div>
                    {index === selectedIndex && (
                      <motion.div
                        className="text-blue-500"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <div className="text-gray-500 font-medium">No commands found</div>
                <div className="text-sm text-gray-400 mt-1">
                  Try searching for "games", "dashboard", or "help"
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <kbd className="px-1.5 py-0.5 bg-white rounded border">↑↓</kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center space-x-1">
                <kbd className="px-1.5 py-0.5 bg-white rounded border">↵</kbd>
                <span>Select</span>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              Press <kbd className="px-1 py-0.5 bg-white rounded border text-xs">⌘K</kbd> anytime
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
