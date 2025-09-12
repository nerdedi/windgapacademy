import {
  Home,
  BookOpen,
  Trophy,
  Play,
  Settings,
  Bell,
  Search,
  Flame,
  Star,
  Menu,
  X,
  User,
  LogOut,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Accessibility,
  Globe,
  Zap,
  Target,
  Award,
  Calendar,
  MessageCircle,
  HelpCircle,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { SoundManager } from "../audio/SoundManager";
import { GameMechanics } from "../core/GameMechanics";
import { ErrorHandler } from "../core/ErrorHandler";

export function Navigation({ currentView, onViewChange, user = null }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const soundManager = useRef(null);
  const gameMechanics = useRef(null);
  const errorHandler = useRef(null);

  // Enhanced navigation items with categories and permissions
  const navigationItems = [
    {
      category: "Main",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: Home,
          description: "Overview and quick stats",
          shortcut: "Ctrl+D",
        },
        {
          id: "courses",
          label: "Courses",
          icon: BookOpen,
          description: "Browse learning modules",
          shortcut: "Ctrl+C",
        },
        {
          id: "lesson",
          label: "Learn",
          icon: Play,
          description: "Start learning session",
          shortcut: "Ctrl+L",
        },
        {
          id: "games",
          label: "Games",
          icon: Target,
          description: "Interactive learning games",
          shortcut: "Ctrl+G",
        },
      ],
    },
    {
      category: "Progress",
      items: [
        {
          id: "leaderboard",
          label: "Leaderboard",
          icon: Trophy,
          description: "Compare with peers",
          badge: "New",
        },
        {
          id: "achievements",
          label: "Achievements",
          icon: Award,
          description: "View earned badges",
        },
        {
          id: "calendar",
          label: "Schedule",
          icon: Calendar,
          description: "Learning calendar",
        },
      ],
    },
    {
      category: "Community",
      items: [
        {
          id: "forums",
          label: "Forums",
          icon: MessageCircle,
          description: "Community discussions",
        },
        {
          id: "help",
          label: "Help",
          icon: HelpCircle,
          description: "Get support",
        },
      ],
    },
  ];

  // Enhanced user stats with real-time updates
  const userStats = {
    name: user?.name || "Guest User",
    avatar: user?.avatar || null,
    xp: user?.xp || 0,
    level: user?.level || 1,
    streak: user?.streak || 0,
    notifications: notifications.length,
    nextLevelXP: user?.nextLevelXP || 1000,
    progressToNextLevel: user?.xp ? (user.xp % 1000) / 10 : 0,
    achievements: user?.achievements || [],
    currentCourse: user?.currentCourse || null,
  };

  // Initialize systems
  useEffect(() => {
    try {
      soundManager.current = window.WindgapPlatform?.soundManager || new SoundManager();
      gameMechanics.current = window.WindgapPlatform?.gameMechanics || new GameMechanics();
      errorHandler.current = window.WindgapPlatform?.errorHandler || new ErrorHandler();

      // Load user preferences
      loadUserPreferences();

      // Set up real-time notifications
      setupNotifications();

      // Set up keyboard shortcuts
      setupKeyboardShortcuts();
    } catch (error) {
      console.error("Failed to initialize navigation systems:", error);
    }
  }, []);

  const loadUserPreferences = () => {
    try {
      const preferences = JSON.parse(localStorage.getItem("windgap_nav_preferences") || "{}");
      setIsDarkMode(preferences.darkMode || false);
      setIsSoundEnabled(preferences.soundEnabled !== false);
    } catch (error) {
      errorHandler.current?.handleError({
        type: "error",
        category: "navigation",
        message: "Failed to load user preferences",
        stack: error.stack,
      });
    }
  };

  const saveUserPreferences = (preferences) => {
    try {
      const current = JSON.parse(localStorage.getItem("windgap_nav_preferences") || "{}");
      const updated = { ...current, ...preferences };
      localStorage.setItem("windgap_nav_preferences", JSON.stringify(updated));
    } catch (error) {
      errorHandler.current?.handleError({
        type: "error",
        category: "navigation",
        message: "Failed to save user preferences",
        stack: error.stack,
      });
    }
  };

  const setupNotifications = () => {
    // Simulate real-time notifications
    const mockNotifications = [
      {
        id: 1,
        type: "achievement",
        title: "New Achievement!",
        message: 'You earned the "Quick Learner" badge',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        icon: Award,
      },
      {
        id: 2,
        type: "reminder",
        title: "Learning Reminder",
        message: "Continue your Math Quest adventure",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: false,
        icon: Play,
      },
      {
        id: 3,
        type: "social",
        title: "Friend Activity",
        message: "Sarah completed Science Lab Level 3",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true,
        icon: Trophy,
      },
    ];

    setNotifications(mockNotifications);
  };

  const setupKeyboardShortcuts = () => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case "d":
            event.preventDefault();
            handleNavigation("dashboard");
            break;
          case "c":
            event.preventDefault();
            handleNavigation("courses");
            break;
          case "l":
            event.preventDefault();
            handleNavigation("lesson");
            break;
          case "g":
            event.preventDefault();
            handleNavigation("games");
            break;
          case "k":
            event.preventDefault();
            document.getElementById("search-input")?.focus();
            break;
        }
      }

      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsProfileMenuOpen(false);
        setIsNotificationPanelOpen(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  };

  const NavItems = () => (
    <>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <Button
            key={item.id}
            variant={isActive ? "default" : "ghost"}
            className={`justify-start ${isActive ? "" : "text-muted-foreground hover:text-foreground"}`}
            onClick={() => {
              onViewChange(item.id);
              setIsMobileMenuOpen(false);
            }}
          >
            <Icon className="h-5 w-5 mr-3" />
            {item.label}
          </Button>
        );
      })}
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-card border-r">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b bg-background">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-lg font-bold">LearnQuest</span>
            </div>
          </div>
          {/* User Stats */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground">AC</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{userStats.name}</div>
                <div className="text-sm text-muted-foreground">Level {userStats.level}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-yellow-500" />
                <span>{userStats.xp} XP</span>
              </div>
              <div className="flex items-center space-x-1">
                <Flame className="h-3 w-3 text-orange-500" />
                <span>{userStats.streak} streak</span>
              </div>
            </div>
          </div>
          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            <NavItems />
          </nav>
          {/* Settings */}
          <div className="p-4 border-t">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between h-16 px-4 bg-background border-b">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">L</span>
              </div>
              <span className="font-bold">LearnQuest</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {userStats.notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                  {userStats.notifications}
                </Badge>
              )}
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                AC
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute inset-x-0 top-16 z-50 bg-background border-b shadow-lg">
            <div className="px-4 py-4 space-y-2">
              {/* User Stats */}
              <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg mb-4">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      AC
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{userStats.name}</div>
                    <div className="text-xs text-muted-foreground">Level {userStats.level}</div>
                  </div>
                </div>
                <div className="flex space-x-3 text-xs">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span>{userStats.xp}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Flame className="h-3 w-3 text-orange-500" />
                    <span>{userStats.streak}</span>
                  </div>
                </div>
              </div>
              {/* Navigation Items */}
              <NavItems />
              <div className="pt-2 border-t">
                <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                  <Settings className="h-5 w-5 mr-3" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
