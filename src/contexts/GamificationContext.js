import React, { createContext, useContext, useState, useEffect } from "react";

// Create a context for gamification features
const GamificationContext = createContext();

export const GamificationProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [xp, setXP] = useState(() => {
    const savedXP = localStorage.getItem("windgap_xp");
    return savedXP ? parseInt(savedXP, 10) : 0;
  });

  const [level, setLevel] = useState(() => {
    const savedLevel = localStorage.getItem("windgap_level");
    return savedLevel ? parseInt(savedLevel, 10) : 1;
  });

  const [badges, setBadges] = useState(() => {
    const savedBadges = localStorage.getItem("windgap_badges");
    return savedBadges ? JSON.parse(savedBadges) : [];
  });

  const [streak, setStreak] = useState(() => {
    const savedStreak = localStorage.getItem("windgap_streak");
    return savedStreak ? parseInt(savedStreak, 10) : 0;
  });

  const [lastLogin, setLastLogin] = useState(() => {
    const savedLastLogin = localStorage.getItem("windgap_last_login");
    return savedLastLogin || null;
  });

  // Calculate level based on XP (100 XP per level)
  useEffect(() => {
    const newLevel = Math.floor(xp / 100) + 1;
    if (newLevel !== level) {
      setLevel(newLevel);
      // Display level up notification
      if (newLevel > level) {
        // You could trigger a notification here
        console.log(`Congratulations! You've reached level ${newLevel}!`);
      }
    }
  }, [xp, level]);

  // Check and update streak on component mount
  useEffect(() => {
    const today = new Date().toLocaleDateString();

    if (lastLogin) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toLocaleDateString();

      if (lastLogin === yesterdayString) {
        // User logged in yesterday, increment streak
        setStreak((prevStreak) => prevStreak + 1);
      } else if (lastLogin !== today) {
        // User didn't log in yesterday, reset streak
        setStreak(1);
      }
    } else {
      // First login
      setStreak(1);
    }

    // Update last login
    setLastLogin(today);
  }, [lastLogin]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("windgap_xp", xp.toString());
    localStorage.setItem("windgap_level", level.toString());
    localStorage.setItem("windgap_badges", JSON.stringify(badges));
    localStorage.setItem("windgap_streak", streak.toString());
    localStorage.setItem("windgap_last_login", lastLogin);
  }, [xp, level, badges, streak, lastLogin]);

  // Add XP with optional animation/notification
  const addXP = async (amount, reason = "activity completion") => {
    if (amount <= 0) return;

    // You could add animation logic here
    console.log(`Earned ${amount} XP for ${reason}`);

    // Update XP
    setXP((prevXP) => prevXP + amount);

    // Return a promise that resolves when animation is complete
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000); // Simulating animation time
    });
  };

  // Award a badge
  const awardBadge = (badgeId, badgeName, badgeDescription) => {
    // Check if badge already exists
    if (badges.some((badge) => badge.id === badgeId)) {
      return false;
    }

    const newBadge = {
      id: badgeId,
      name: badgeName,
      description: badgeDescription,
      dateAwarded: new Date().toISOString(),
    };

    setBadges([...badges, newBadge]);

    // You could trigger a notification here
    console.log(`Congratulations! You've earned the "${badgeName}" badge!`);

    return true;
  };

  // Check if a specific action deserves XP or a badge
  const checkAchievements = (action, data = {}) => {
    switch (action) {
      case "complete_module":
        addXP(50, "module completion");

        // Check for streak-based badges
        if (streak >= 7) {
          awardBadge("streak_7", "Weekly Scholar", "Maintained a 7-day learning streak");
        }

        // Check for completion-based badges
        if (data.completedModules >= 5) {
          awardBadge("modules_5", "Learning Explorer", "Completed 5 learning modules");
        }
        break;

      case "submit_assignment":
        addXP(30, "assignment submission");
        break;

      case "perfect_score":
        addXP(100, "perfect score");
        awardBadge(
          "perfect_score",
          "Perfect Performance",
          "Achieved a perfect score on an assessment",
        );
        break;

      case "help_peer":
        addXP(20, "helping a peer");
        break;

      default:
        break;
    }
  };

  const resetProgress = (confirm = false) => {
    if (!confirm) return;

    setXP(0);
    setLevel(1);
    setBadges([]);
    setStreak(0);
    setLastLogin(new Date().toLocaleDateString());

    // Clear localStorage
    localStorage.removeItem("windgap_xp");
    localStorage.removeItem("windgap_level");
    localStorage.removeItem("windgap_badges");
    localStorage.removeItem("windgap_streak");
    localStorage.removeItem("windgap_last_login");
  };

  return (
    <GamificationContext.Provider
      value={{
        xp,
        level,
        badges,
        streak,
        lastLogin,
        addXP,
        awardBadge,
        checkAchievements,
        resetProgress,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

// Custom hook for using the gamification context
export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error("useGamification must be used within a GamificationProvider");
  }
  return context;
};
