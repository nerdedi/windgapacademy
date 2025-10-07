/**
 * QuestBasedLearning component
 *
 * A system for structuring learning as quests, missions, and challenges
 * inspired by educational games like Antura.
 */

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Import Firebase services
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getFirestore } from "../../firebase";

// Quest status enum
const QUEST_STATUS = {
  LOCKED: "locked", // Not yet available
  AVAILABLE: "available", // Available but not started
  IN_PROGRESS: "in_progress", // Started but not completed
  COMPLETED: "completed", // Successfully completed
};

// Quest difficulty levels
const QUEST_DIFFICULTY = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
  EXPERT: "expert",
};

/**
 * Quest-based learning system component
 */
export const QuestBasedLearning = ({
  userId,
  worldId = "math_world",
  worldName = "Math Kingdom",
  initialLevel = 1,
  questGenerators = {},
  onWorldComplete,
  saveProgress = true,
}) => {
  // Core state
  const [userProfile, setUserProfile] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(initialLevel);
  const [quests, setQuests] = useState([]);
  const [activeQuest, setActiveQuest] = useState(null);
  const [worldProgress, setWorldProgress] = useState(0);
  const [showQuestDetails, setShowQuestDetails] = useState(false);
  const [completedQuests, setCompletedQuests] = useState([]);
  const [showMap, setShowMap] = useState(true);
  const [rewardsEarned, setRewardsEarned] = useState([]);
  const [showReward, setShowReward] = useState(false);
  const [currentReward, setCurrentReward] = useState(null);

  // Animation states
  const [mapAnimationState, setMapAnimationState] = useState("idle");

  // Navigation
  const navigate = useNavigate();

  // Firebase reference
  const db = getFirestore();

  // On mount, load user profile and generate quests
  useEffect(() => {
    if (userId && saveProgress) {
      loadUserProfile();
    } else {
      // Create a blank profile for non-persistent mode
      const newProfile = {
        userId: "guest",
        quests: {},
        worlds: {
          [worldId]: {
            level: initialLevel,
            progress: 0,
            questsCompleted: [],
          },
        },
        inventory: [],
        achievements: [],
      };
      setUserProfile(newProfile);
    }

    generateQuests();
  }, [userId, worldId]);

  /**
   * Load user profile from Firestore
   */
  const loadUserProfile = async () => {
    try {
      const userDocRef = doc(db, "user_progress", userId);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUserProfile(userData);

        // Check if we have this world in progress
        if (userData.worlds && userData.worlds[worldId]) {
          const worldData = userData.worlds[worldId];
          setCurrentLevel(worldData.level || initialLevel);
          setWorldProgress(worldData.progress || 0);
          setCompletedQuests(worldData.questsCompleted || []);
        } else {
          // Initialize this world
          await updateDoc(userDocRef, {
            [`worlds.${worldId}`]: {
              level: initialLevel,
              progress: 0,
              questsCompleted: [],
            },
          });
        }
      } else {
        // Create new user profile
        const newProfile = {
          userId,
          quests: {},
          worlds: {
            [worldId]: {
              level: initialLevel,
              progress: 0,
              questsCompleted: [],
            },
          },
          inventory: [],
          achievements: [],
        };
        setUserProfile(newProfile);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  /**
   * Generate quests for the current level
   */
  const generateQuests = () => {
    // In a real app, these might come from a server or database
    // For this example, we'll generate them based on the current level

    // Helper function to check if a quest is completed
    const isQuestCompleted = (questId) => {
      return completedQuests.includes(questId);
    };

    // Generate level-appropriate quests
    const levelQuests = [];

    // Main storyline quest (always available)
    levelQuests.push({
      id: `main_${worldId}_${currentLevel}`,
      type: "main",
      name: `Chapter ${currentLevel}: ${getChapterName(currentLevel)}`,
      description: getChapterDescription(currentLevel),
      icon: "📚",
      tasks: getChapterTasks(currentLevel),
      rewards: [
        {
          type: "virtual_currency",
          amount: 50 * currentLevel,
          icon: "🪙",
        },
        {
          type: "xp",
          amount: 100 * currentLevel,
          icon: "✨",
        },
      ],
      status: isQuestCompleted(`main_${worldId}_${currentLevel}`)
        ? QUEST_STATUS.COMPLETED
        : QUEST_STATUS.AVAILABLE,
      difficulty: getDifficultyForLevel(currentLevel),
      position: { x: 50, y: 30 + ((currentLevel * 10) % 40) }, // Center of map
      dependencies: currentLevel > 1 ? [`main_${worldId}_${currentLevel - 1}`] : [],
    });

    // Side quests (practice opportunities)
    const numSideQuests = Math.min(2 + Math.floor(currentLevel / 2), 5);

    for (let i = 1; i <= numSideQuests; i++) {
      const questId = `side_${worldId}_${currentLevel}_${i}`;

      // Check if quest should be locked based on dependencies
      const dependentQuestId = i > 1 ? `side_${worldId}_${currentLevel}_${i - 1}` : null;
      let questStatus = QUEST_STATUS.AVAILABLE;

      if (isQuestCompleted(questId)) {
        questStatus = QUEST_STATUS.COMPLETED;
      } else if (dependentQuestId && !isQuestCompleted(dependentQuestId)) {
        questStatus = QUEST_STATUS.LOCKED;
      }

      levelQuests.push({
        id: questId,
        type: "side",
        name: getSideQuestName(currentLevel, i),
        description: getSideQuestDescription(currentLevel, i),
        icon: getSideQuestIcon(i),
        tasks: getSideQuestTasks(currentLevel, i),
        rewards: [
          {
            type: "virtual_currency",
            amount: 20 * currentLevel,
            icon: "🪙",
          },
          {
            type: "item",
            name: getRewardName(currentLevel, i),
            icon: getRewardIcon(i),
          },
        ],
        status: questStatus,
        difficulty: getSideQuestDifficulty(currentLevel, i),
        position: getSideQuestPosition(i),
        dependencies: dependentQuestId ? [dependentQuestId] : [],
      });
    }

    // Challenge quest (harder, optional)
    if (currentLevel > 1) {
      const challengeQuestId = `challenge_${worldId}_${currentLevel}`;

      levelQuests.push({
        id: challengeQuestId,
        type: "challenge",
        name: `${getChallengeQuestName(currentLevel)}`,
        description: getChallengeQuestDescription(currentLevel),
        icon: "🏆",
        tasks: getChallengeQuestTasks(currentLevel),
        rewards: [
          {
            type: "virtual_currency",
            amount: 100 * currentLevel,
            icon: "🪙",
          },
          {
            type: "achievement",
            name: `Level ${currentLevel} Master`,
            icon: "🎖️",
          },
        ],
        status: isQuestCompleted(challengeQuestId)
          ? QUEST_STATUS.COMPLETED
          : completedQuests.includes(`main_${worldId}_${currentLevel}`)
            ? QUEST_STATUS.AVAILABLE
            : QUEST_STATUS.LOCKED,
        difficulty: QUEST_DIFFICULTY.EXPERT,
        position: { x: 50, y: 70 },
        dependencies: [`main_${worldId}_${currentLevel}`],
      });
    }

    setQuests(levelQuests);
  };

  /**
   * Helper functions for generating quest content
   */
  const getChapterName = (level) => {
    const chapterNames = [
      "First Steps in Numberville",
      "Addition Adventures",
      "Subtraction Safari",
      "Multiplication Mountain",
      "Division Valley",
      "Fraction Forest",
      "Decimal Dungeon",
      "Percentage Palace",
      "Geometry Garden",
      "Algebra Academy",
    ];
    return chapterNames[(level - 1) % chapterNames.length];
  };

  const getChapterDescription = (level) => {
    const descriptions = [
      "Begin your journey into the world of numbers by learning to count and identify patterns.",
      "Explore the basics of adding numbers together in this exciting adventure.",
      "Discover the power of subtraction as you journey through various challenges.",
      "Scale the heights of multiplication and learn to multiply numbers with ease.",
      "Navigate the valleys of division and learn to share quantities equally.",
      "Venture into the mystical Fraction Forest where parts make a whole.",
      "Delve deep into the Decimal Dungeon and master the art of decimal points.",
      "Enter the grand Percentage Palace and understand how parts relate to hundreds.",
      "Wander through the Geometry Garden and learn about shapes and spaces.",
      "Reach the prestigious Algebra Academy and unlock the power of variables.",
    ];
    return descriptions[(level - 1) % descriptions.length];
  };

  const getChapterTasks = (level) => {
    // In a real app, these would be more specific and varied
    return [
      {
        id: `task_${level}_1`,
        name: "Complete the training exercises",
        type: "exercise",
        requirements: {
          count: 3,
          difficulty: getDifficultyForLevel(level),
        },
        completed: false,
      },
      {
        id: `task_${level}_2`,
        name: "Solve the practice problems",
        type: "exercise",
        requirements: {
          count: 2,
          difficulty: getDifficultyForLevel(level),
        },
        completed: false,
      },
      {
        id: `task_${level}_3`,
        name: "Pass the chapter quiz",
        type: "quiz",
        requirements: {
          count: 1,
          difficulty: getDifficultyForLevel(level),
        },
        completed: false,
      },
    ];
  };

  const getDifficultyForLevel = (level) => {
    if (level <= 2) return QUEST_DIFFICULTY.BEGINNER;
    if (level <= 5) return QUEST_DIFFICULTY.INTERMEDIATE;
    if (level <= 8) return QUEST_DIFFICULTY.ADVANCED;
    return QUEST_DIFFICULTY.EXPERT;
  };

  const getSideQuestName = (level, index) => {
    const questTypes = [
      "Practice Quest",
      "Exploration Challenge",
      "Math Mystery",
      "Number Puzzle",
      "Quick Challenge",
    ];
    return `${questTypes[(index - 1) % questTypes.length]} ${level}-${index}`;
  };

  const getSideQuestDescription = (level, index) => {
    const descriptions = [
      "Strengthen your skills with these practice problems.",
      "Explore different ways to solve these math puzzles.",
      "Uncover the mathematical mystery by solving these problems.",
      "Piece together the number puzzle to reveal a hidden pattern.",
      "Test your speed and accuracy with this quick challenge.",
    ];
    return descriptions[(index - 1) % descriptions.length];
  };

  const getSideQuestIcon = (index) => {
    const icons = ["📝", "🧩", "🔍", "🎮", "⏱️"];
    return icons[(index - 1) % icons.length];
  };

  const getSideQuestTasks = (level, index) => {
    return [
      {
        id: `side_task_${level}_${index}_1`,
        name: "Complete the practice problems",
        type: "exercise",
        requirements: {
          count: 2,
          difficulty: getSideQuestDifficulty(level, index),
        },
        completed: false,
      },
    ];
  };

  const getSideQuestDifficulty = (level, index) => {
    const baseDifficulty = getDifficultyForLevel(level);

    // First quest is at level difficulty
    if (index === 1) return baseDifficulty;

    // Other quests might be higher or lower
    const difficulties = Object.values(QUEST_DIFFICULTY);
    const currentIndex = difficulties.indexOf(baseDifficulty);

    if (index % 2 === 0 && currentIndex < difficulties.length - 1) {
      // Even-numbered quests are harder (if possible)
      return difficulties[currentIndex + 1];
    } else if (index % 3 === 0 && currentIndex > 0) {
      // Every third quest is easier (if possible)
      return difficulties[currentIndex - 1];
    }

    return baseDifficulty;
  };

  const getSideQuestPosition = (index) => {
    // Create a circular arrangement around the main quest
    const angle = (index - 1) * (360 / 5); // 5 positions around the circle
    const radius = 25; // Distance from center

    // Convert polar coordinates to cartesian
    const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
    const y = 40 + radius * Math.sin((angle * Math.PI) / 180);

    return { x, y };
  };

  const getChallengeQuestName = (level) => {
    return `Level ${level} Challenge: Master's Test`;
  };

  const getChallengeQuestDescription = (level) => {
    return `Prove your mastery of level ${level} concepts with this challenging test of your skills.`;
  };

  const getChallengeQuestTasks = (level) => {
    return [
      {
        id: `challenge_task_${level}_1`,
        name: "Complete the challenge exercises",
        type: "exercise",
        requirements: {
          count: 3,
          difficulty: QUEST_DIFFICULTY.EXPERT,
        },
        completed: false,
      },
      {
        id: `challenge_task_${level}_2`,
        name: "Solve the advanced problems",
        type: "exercise",
        requirements: {
          count: 2,
          difficulty: QUEST_DIFFICULTY.EXPERT,
        },
        completed: false,
      },
    ];
  };

  const getRewardName = (level, index) => {
    const rewards = [
      "Math Badge",
      "Number Sticker",
      "Character Costume",
      "Special Power",
      "Rare Item",
    ];
    return `${rewards[(index - 1) % rewards.length]} Lv.${level}`;
  };

  const getRewardIcon = (index) => {
    const icons = ["🏅", "🌟", "👕", "⚡", "💎"];
    return icons[(index - 1) % icons.length];
  };

  /**
   * Handle selecting a quest on the map
   */
  const handleQuestSelect = (quest) => {
    // Can't select locked quests
    if (quest.status === QUEST_STATUS.LOCKED) {
      showLockedQuestMessage(quest);
      return;
    }

    setActiveQuest(quest);
    setShowQuestDetails(true);
  };

  /**
   * Show a message about locked quests
   */
  const showLockedQuestMessage = (quest) => {
    // Find dependencies
    const dependencies = quest.dependencies.map((depId) => {
      const depQuest = quests.find((q) => q.id === depId);
      return depQuest ? depQuest.name : depId;
    });

    // Display message
    // In a real app, this would show a proper UI element
    console.log(`This quest is locked! Complete ${dependencies.join(", ")} first.`);
  };

  /**
   * Start a quest
   */
  const startQuest = (quest) => {
    // Update quest status
    const updatedQuests = [...quests];
    const questIndex = updatedQuests.findIndex((q) => q.id === quest.id);

    if (questIndex !== -1) {
      updatedQuests[questIndex] = {
        ...updatedQuests[questIndex],
        status: QUEST_STATUS.IN_PROGRESS,
      };
      setQuests(updatedQuests);
    }

    setShowMap(false);
    setActiveQuest(quest);

    // In a real app, this would navigate to the quest content
    // For now, we'll simulate it
    console.log(`Starting quest: ${quest.name}`);

    // If we have a generator for this quest, use it
    if (questGenerators[quest.id]) {
      questGenerators[quest.id](quest);
    }
  };

  /**
   * Complete a quest
   */
  const completeQuest = async (quest, results) => {
    // Update local state
    const updatedQuests = [...quests];
    const questIndex = updatedQuests.findIndex((q) => q.id === quest.id);

    if (questIndex !== -1) {
      updatedQuests[questIndex] = {
        ...updatedQuests[questIndex],
        status: QUEST_STATUS.COMPLETED,
      };
      setQuests(updatedQuests);
    }

    const updatedCompletedQuests = [...completedQuests, quest.id];
    setCompletedQuests(updatedCompletedQuests);

    // Calculate new world progress
    const mainQuestId = `main_${worldId}_${currentLevel}`;
    const mainQuestCompleted = updatedCompletedQuests.includes(mainQuestId);

    let newWorldProgress = 0;
    if (mainQuestCompleted) {
      // Main quest completed - consider level completed
      // Progress calculation depends on how many optional quests were also completed
      const levelQuests = updatedQuests.filter(
        (q) => q.id.includes(`_${currentLevel}_`) || q.id === mainQuestId,
      );
      const completedLevelQuests = levelQuests.filter((q) => updatedCompletedQuests.includes(q.id));

      newWorldProgress = Math.min(1, completedLevelQuests.length / levelQuests.length);
    } else {
      // Main quest not completed yet - progress based on completed tasks
      newWorldProgress = 0.5; // Placeholder value
    }

    setWorldProgress(newWorldProgress);

    // Save progress to Firebase
    if (saveProgress && userId) {
      try {
        const userDocRef = doc(db, "user_progress", userId);
        await updateDoc(userDocRef, {
          [`worlds.${worldId}.questsCompleted`]: updatedCompletedQuests,
          [`worlds.${worldId}.progress`]: newWorldProgress,
          [`quests.${quest.id}`]: {
            completedAt: Date.now(),
            results,
          },
        });
      } catch (error) {
        console.error("Error saving quest completion:", error);
      }
    }

    // Show rewards
    if (quest.rewards && quest.rewards.length > 0) {
      setRewardsEarned(quest.rewards);
      showQuestReward(quest.rewards[0]);
    }

    // Check if we can advance to next level
    checkForLevelAdvancement(mainQuestCompleted, newWorldProgress);
  };

  /**
   * Show quest reward animation
   */
  const showQuestReward = (reward) => {
    setCurrentReward(reward);
    setShowReward(true);

    // Hide after animation
    setTimeout(() => {
      setShowReward(false);
    }, 3000);
  };

  /**
   * Check if player can advance to next level
   */
  const checkForLevelAdvancement = async (mainQuestCompleted, progress) => {
    // Can advance if main quest is completed and overall progress is good
    if (mainQuestCompleted && progress >= 0.7) {
      // Allow advancing to next level
      const newLevel = currentLevel + 1;

      setCurrentLevel(newLevel);

      // Save to Firebase
      if (saveProgress && userId) {
        try {
          const userDocRef = doc(db, "user_progress", userId);
          await updateDoc(userDocRef, {
            [`worlds.${worldId}.level`]: newLevel,
          });
        } catch (error) {
          console.error("Error updating level:", error);
        }
      }

      // Generate new quests for the new level
      setTimeout(() => {
        generateQuests();
      }, 500);
    }
  };

  /**
   * Render the world map with quests
   */
  const renderQuestMap = () => {
    return (
      <div className="relative w-full h-96 bg-blue-50 rounded-lg border-2 border-blue-200 overflow-hidden">
        {/* Map background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: `url('/assets/backgrounds/math-world-map.jpg')` }}
        />

        {/* Quest nodes */}
        {quests.map((quest) => (
          <motion.div
            key={quest.id}
            className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2`}
            style={{
              left: `${quest.position.x}%`,
              top: `${quest.position.y}%`,
            }}
            whileHover={{ scale: 1.1 }}
            onClick={() => handleQuestSelect(quest)}
          >
            {/* Quest icon */}
            <div
              className={`relative flex items-center justify-center w-12 h-12 rounded-full
              ${
                quest.status === QUEST_STATUS.LOCKED
                  ? "bg-gray-400"
                  : quest.status === QUEST_STATUS.COMPLETED
                    ? "bg-green-500"
                    : quest.status === QUEST_STATUS.IN_PROGRESS
                      ? "bg-yellow-500"
                      : quest.type === "main"
                        ? "bg-blue-600"
                        : quest.type === "challenge"
                          ? "bg-purple-600"
                          : "bg-indigo-500"
              } shadow-lg`}
            >
              <span className="text-xl text-white">{quest.icon}</span>

              {/* Status indicator */}
              {quest.status === QUEST_STATUS.LOCKED && (
                <div className="absolute -top-1 -right-1">
                  <span className="text-lg">🔒</span>
                </div>
              )}

              {quest.status === QUEST_STATUS.COMPLETED && (
                <div className="absolute -top-1 -right-1">
                  <span className="text-lg">✅</span>
                </div>
              )}
            </div>

            {/* Quest name tooltip */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap">
              <div
                className={`px-2 py-1 rounded text-xs font-medium
                ${
                  quest.status === QUEST_STATUS.LOCKED
                    ? "bg-gray-200 text-gray-700"
                    : quest.status === QUEST_STATUS.COMPLETED
                      ? "bg-green-100 text-green-800"
                      : quest.status === QUEST_STATUS.IN_PROGRESS
                        ? "bg-yellow-100 text-yellow-800"
                        : quest.type === "main"
                          ? "bg-blue-100 text-blue-800"
                          : quest.type === "challenge"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-indigo-100 text-indigo-800"
                }`}
              >
                {quest.name}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Connect quests with paths based on dependencies */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {quests.map((quest) =>
            quest.dependencies.map((depId) => {
              const depQuest = quests.find((q) => q.id === depId);
              if (!depQuest) return null;

              return (
                <line
                  key={`${quest.id}-${depId}`}
                  x1={`${depQuest.position.x}%`}
                  y1={`${depQuest.position.y}%`}
                  x2={`${quest.position.x}%`}
                  y2={`${quest.position.y}%`}
                  stroke={
                    quest.status === QUEST_STATUS.LOCKED
                      ? "#CBD5E0"
                      : quest.status === QUEST_STATUS.COMPLETED
                        ? "#48BB78"
                        : "#4299E1"
                  }
                  strokeWidth="2"
                  strokeDasharray={quest.status === QUEST_STATUS.LOCKED ? "5,5" : "none"}
                />
              );
            }),
          )}
        </svg>
      </div>
    );
  };

  /**
   * Render quest details panel
   */
  const renderQuestDetails = () => {
    if (!activeQuest) return null;

    return (
      <motion.div
        className="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
      >
        <div className="flex items-center mb-4">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-full mr-4
            ${
              activeQuest.type === "main"
                ? "bg-blue-100 text-blue-600"
                : activeQuest.type === "challenge"
                  ? "bg-purple-100 text-purple-600"
                  : "bg-indigo-100 text-indigo-600"
            }`}
          >
            <span className="text-xl">{activeQuest.icon}</span>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800">{activeQuest.name}</h2>
            <div className="flex items-center mt-1">
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-xs capitalize
                ${
                  activeQuest.difficulty === QUEST_DIFFICULTY.BEGINNER
                    ? "bg-green-100 text-green-800"
                    : activeQuest.difficulty === QUEST_DIFFICULTY.INTERMEDIATE
                      ? "bg-blue-100 text-blue-800"
                      : activeQuest.difficulty === QUEST_DIFFICULTY.ADVANCED
                        ? "bg-purple-100 text-purple-800"
                        : "bg-red-100 text-red-800"
                }`}
              >
                {activeQuest.difficulty}
              </span>

              <span className="inline-block px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 text-xs ml-2 capitalize">
                {activeQuest.type} Quest
              </span>
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-6">{activeQuest.description}</p>

        {/* Quest tasks */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-700 mb-2">Quest Tasks</h3>
          <ul className="space-y-3">
            {activeQuest.tasks.map((task, index) => (
              <li key={index} className="flex items-start">
                <div className="bg-blue-50 p-2 rounded-full mr-3">
                  {task.type === "exercise" ? "📝" : "📋"}
                </div>
                <div>
                  <p className="font-medium">{task.name}</p>
                  <p className="text-sm text-gray-500">
                    {task.requirements.count} {task.type}
                    {task.requirements.count > 1 ? "s" : ""} • {task.requirements.difficulty}{" "}
                    difficulty
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Quest rewards */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-700 mb-2">Rewards</h3>
          <div className="flex flex-wrap gap-3">
            {activeQuest.rewards.map((reward, index) => (
              <div
                key={index}
                className="flex items-center px-3 py-2 bg-yellow-50 border border-yellow-100 rounded-lg"
              >
                <span className="text-lg mr-2">{reward.icon}</span>
                <div>
                  <p className="font-medium text-amber-900">
                    {reward.type === "virtual_currency"
                      ? `${reward.amount} Coins`
                      : reward.type === "xp"
                        ? `${reward.amount} XP`
                        : reward.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            onClick={() => {
              setActiveQuest(null);
              setShowQuestDetails(false);
            }}
          >
            Back to Map
          </button>

          {activeQuest.status !== QUEST_STATUS.COMPLETED && (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => startQuest(activeQuest)}
            >
              Start Quest
            </button>
          )}

          {activeQuest.status === QUEST_STATUS.COMPLETED && (
            <div className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg">
              <span className="mr-2">✅</span>
              Completed
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  /**
   * Render active quest content
   */
  const renderActiveQuest = () => {
    if (!activeQuest) return null;

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">{activeQuest.name}</h2>
          <button
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            onClick={() => setShowMap(true)}
          >
            Back to Map
          </button>
        </div>

        {/* Quest exercise area - in a real app, this would render the actual exercises */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <p className="text-gray-600 mb-4">This is where the quest exercises would appear.</p>

          {/* Simulate quest completion */}
          <div className="flex justify-center">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              onClick={() => {
                completeQuest(activeQuest, {
                  score: 85,
                  timeSpent: 300, // seconds
                  exercises: activeQuest.tasks.length,
                });
                setShowMap(true);
              }}
            >
              Complete Quest (Simulation)
            </button>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Render reward animation
   */
  const renderRewardAnimation = () => {
    if (!showReward || !currentReward) return null;

    return (
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl p-8 shadow-2xl text-center"
          initial={{ scale: 0.5, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white text-2xl mb-2"
          >
            Reward Earned!
          </motion.div>

          <motion.div
            className="text-6xl mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.5 }}
          >
            {currentReward.icon}
          </motion.div>

          <motion.div
            className="text-white text-xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {currentReward.type === "virtual_currency"
              ? `${currentReward.amount} Coins`
              : currentReward.type === "xp"
                ? `${currentReward.amount} XP`
                : currentReward.name}
          </motion.div>
        </motion.div>
      </motion.div>
    );
  };

  // Main render
  return (
    <div className="quest-based-learning">
      {/* World header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-6 mb-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{worldName}</h1>
            <p className="text-blue-100">Level {currentLevel}</p>
          </div>

          <div className="flex items-center">
            {/* World progress */}
            <div className="mr-4">
              <div className="text-sm mb-1">World Progress</div>
              <div className="w-32 bg-blue-400 bg-opacity-30 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full bg-white transition-all duration-500"
                  style={{ width: `${worldProgress * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Player avatar/icon */}
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl">👨‍🎓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <AnimatePresence mode="wait">
        {showMap ? (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {showQuestDetails ? renderQuestDetails() : renderQuestMap()}
          </motion.div>
        ) : (
          <motion.div
            key="quest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderActiveQuest()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reward animation */}
      <AnimatePresence>{showReward && renderRewardAnimation()}</AnimatePresence>
    </div>
  );
};

export default QuestBasedLearning;
