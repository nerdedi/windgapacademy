/**
 * QuestBasedLearning component
 *
 * A system for structuring learning as quests, missions, and challenges
 * inspired by educational games like Antura.
 *
 * Props:
 *   userId: string - User ID for progress tracking
 *   worldId: string - World identifier
 *   worldName: string - Display name for the world
 *   initialLevel: number - Starting level
 *   questGenerators: object - Custom quest generator functions
 *   saveProgress: boolean - Whether to save progress to Firebase
 *   onWorldComplete: function - Callback when world is completed
 *
 * TODO: Add support for more quest types and reward systems
 */

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
// TODO: Uncomment if navigation logic is needed
// import { useNavigate } from "react-router-dom";

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
  saveProgress = true,
  onWorldComplete,
}) => {
  // Core state
  const [currentLevel, setCurrentLevel] = useState(initialLevel);
  const [quests, setQuests] = useState([]);
  const [activeQuest, setActiveQuest] = useState(null);
  const [worldProgress, setWorldProgress] = useState(0);
  const [showQuestDetails, setShowQuestDetails] = useState(false);
  const [completedQuests, setCompletedQuests] = useState([]);
  const [showMap, setShowMap] = useState(true);
  // Only use state variables that are needed
  const [showReward, setShowReward] = useState(false);
  const [currentReward, setCurrentReward] = useState(null);

  // TODO: Implement navigation logic if needed
  // const navigate = useNavigate();

  // Firebase reference
  const db = getFirestore();

  // Helper function to check if a quest is completed
  const isQuestCompleted = useCallback(
    (questId) => {
      return completedQuests.includes(questId);
    },
    [completedQuests],
  );

  // Function to get appropriate difficulty level for current level
  const getDifficultyForLevel = useCallback((level) => {
    if (level <= 2) return QUEST_DIFFICULTY.BEGINNER;
    if (level <= 5) return QUEST_DIFFICULTY.INTERMEDIATE;
    if (level <= 8) return QUEST_DIFFICULTY.ADVANCED;
    return QUEST_DIFFICULTY.EXPERT;
  }, []);

  // Function to generate quests based on current level and world
  const generateQuests = useCallback(() => {
    // Generate main quest, side quests, and challenge quest
    const generatedQuests = [];

    // If questGenerators has a custom generator for this world, use it
    if (questGenerators[worldId]) {
      const customQuests = questGenerators[worldId]({
        level: currentLevel,
        completedQuests,
        userId,
      });
      setQuests(customQuests);
      return;
    }

    // Main quest (required to progress)
    generatedQuests.push({
      id: `main_${worldId}_${currentLevel}`,
      type: "main",
      name: `Level ${currentLevel} Core Concepts`,
      description: `Master the fundamental concepts in ${worldName} Level ${currentLevel}`,
      objectives: [
        { id: "obj1", description: "Complete 5 exercises", completed: false },
        { id: "obj2", description: "Achieve 80% accuracy", completed: false },
      ],
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

      generatedQuests.push({
        id: questId,
        type: "side",
        name: `Practice ${i}`,
        description: `Additional practice for Level ${currentLevel} concepts`,
        objectives: [
          { id: "obj1", description: "Complete 3 practice exercises", completed: false },
        ],
        rewards: [
          {
            type: "virtual_currency",
            amount: 20 * currentLevel,
            icon: "🪙",
          },
          {
            type: "item",
            itemId: `practice_badge_${currentLevel}_${i}`,
            name: "Practice Badge",
            icon: "🏅",
          },
        ],
        status: questStatus,
        difficulty: getDifficultyForLevel(currentLevel),
        position: {
          x: 30 + ((i * 10) % 60),
          y: 40 + ((i * 15) % 30),
        },
        dependencies: dependentQuestId ? [dependentQuestId] : [],
      });
    }

    // Challenge quest (optional, harder difficulty)
    const challengeQuestId = `challenge_${worldId}_${currentLevel}`;

    generatedQuests.push({
      id: challengeQuestId,
      type: "challenge",
      name: `Level ${currentLevel} Challenge`,
      description: `Prove your mastery of Level ${currentLevel} concepts with this challenging quest`,
      objectives: [
        { id: "obj1", description: "Complete the challenge exercise", completed: false },
        { id: "obj2", description: "Achieve 90% accuracy", completed: false },
        { id: "obj3", description: "Complete within time limit", completed: false },
      ],
      rewards: [
        {
          type: "virtual_currency",
          amount: 100 * currentLevel,
          icon: "💎",
        },
        {
          type: "badge",
          badgeId: `mastery_${worldId}_${currentLevel}`,
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

    setQuests(generatedQuests);
  }, [
    worldId,
    currentLevel,
    completedQuests,
    questGenerators,
    userId,
    worldName,
    isQuestCompleted,
    getDifficultyForLevel,
  ]);

  /**
   * Load user profile from Firestore
   */
  const loadUserProfile = useCallback(async () => {
    try {
      const userDocRef = doc(db, "user_progress", userId);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        // TODO: Implement user profile logic if needed

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
        await updateDoc(userDocRef, {
          [`worlds.${worldId}`]: {
            level: initialLevel,
            progress: 0,
            questsCompleted: [],
          },
        });
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  }, [db, userId, worldId, initialLevel]);

  // On mount, load user profile and generate quests
  useEffect(() => {
    if (userId && saveProgress) {
      loadUserProfile();
    }

    // After loading profile (or if no profile needed), generate quests
    generateQuests();
  }, [userId, loadUserProfile, saveProgress, generateQuests]);

  /**
   * Save progress to Firestore
   */
  const _saveUserProgress = useCallback(
    async (questId, isCompleted = true) => {
      if (!userId || !saveProgress) return;

      try {
        const userDocRef = doc(db, "user_progress", userId);

        // Update completed quests
        const updatedQuests = isCompleted
          ? [...completedQuests, questId]
          : completedQuests.filter((id) => id !== questId);

        // Calculate new progress percentage
        const newProgress = Math.min(
          100,
          Math.floor((updatedQuests.length / (quests.length * 0.8)) * 100),
        );

        await updateDoc(userDocRef, {
          [`worlds.${worldId}.questsCompleted`]: updatedQuests,
          [`worlds.${worldId}.progress`]: newProgress,
        });

        setCompletedQuests(updatedQuests);
        setWorldProgress(newProgress);

        // Call onWorldComplete callback when world is 100% complete
        if (newProgress === 100 && onWorldComplete) {
          onWorldComplete(worldId, currentLevel);
        }
      } catch (error) {
        console.error("Error saving progress:", error);
      }
    },
    [
      userId,
      saveProgress,
      db,
      worldId,
      completedQuests,
      quests.length,
      onWorldComplete,
      currentLevel,
    ],
  );

  /**
   * TODO: Implement quest completion logic here if needed in future
   */

  /**
   * Render the world map with quests
   */
  const renderQuestMap = () => {
    if (!quests || quests.length === 0) {
      return <div className="empty-map">No quests available</div>;
    }

    return (
      <div className="quest-map">
        {quests.map((quest) => (
          <motion.div
            key={quest.id}
            className={`quest-node quest-${quest.type} quest-${quest.status}`}
            style={{
              left: `${quest.position.x}%`,
              top: `${quest.position.y}%`,
            }}
            whileHover={{
              scale: 1.1,
              transition: { duration: 0.2 },
            }}
            onClick={() => handleQuestClick(quest)}
          >
            <div className="quest-icon">
              {quest.status === QUEST_STATUS.LOCKED ? "🔒" : getQuestIcon(quest)}
            </div>
            <div className="quest-name">{quest.name}</div>
          </motion.div>
        ))}

        {/* Draw lines connecting quests based on dependencies */}
        {renderQuestConnections()}
      </div>
    );
  };

  /**
   * Get appropriate icon for quest type
   */
  const getQuestIcon = (quest) => {
    const { type, status } = quest;

    if (status === QUEST_STATUS.COMPLETED) return "✅";

    switch (type) {
      case "main":
        return "🎯";
      case "side":
        return "🔄";
      case "challenge":
        return "⭐";
      default:
        return "📝";
    }
  };

  /**
   * Render connections between quests
   */
  const renderQuestConnections = () => {
    // This would use SVG lines to connect related quests
    // Simplified implementation for now
    return <div className="quest-connections"></div>;
  };

  /**
   * Handle clicking on a quest
   */
  const handleQuestClick = (quest) => {
    if (quest.status === QUEST_STATUS.LOCKED) {
      // Show message about locked quest
      return;
    }

    setActiveQuest(quest);
    setShowQuestDetails(true);
    setShowMap(false);
  };

  /**
   * Handle starting a quest
   */
  const handleStartQuest = (quest) => {
    setActiveQuest({
      ...quest,
      status: QUEST_STATUS.IN_PROGRESS,
    });
  };

  // TODO: Remove unused completeQuest function if not needed
  // const completeQuest = (quest) => {
  //   handleQuestComplete(quest);
  //   setActiveQuest(null);
  //   setShowQuestDetails(false);
  //   setShowMap(true);
  // };

  /**
   * Render quest details
   */
  const renderQuestDetails = () => {
    if (!activeQuest) return null;

    return (
      <AnimatePresence>
        <motion.div
          className="quest-details"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <h2>{activeQuest.name}</h2>
          <p className="quest-description">{activeQuest.description}</p>

          <div className="quest-difficulty">
            <strong>Difficulty:</strong> {activeQuest.difficulty}
          </div>

          <h3>Objectives:</h3>
          <ul className="objectives-list">
            {activeQuest.objectives.map((objective) => (
              <li key={objective.id} className={objective.completed ? "completed" : ""}>
                {objective.description}
              </li>
            ))}
          </ul>

          <h3>Rewards:</h3>
          <div className="rewards-list">
            {activeQuest.rewards.map((reward, index) => (
              <div key={index} className="reward-item">
                <span className="reward-icon">{reward.icon}</span>
                <span className="reward-amount">
                  {reward.amount ? `${reward.amount} ` : ""}
                  {reward.name || reward.type}
                </span>
              </div>
            ))}
          </div>

          <div className="quest-actions">
            {activeQuest.status !== QUEST_STATUS.COMPLETED ? (
              <button className="start-quest-btn" onClick={() => handleStartQuest(activeQuest)}>
                {activeQuest.status === QUEST_STATUS.IN_PROGRESS ? "Continue" : "Start Quest"}
              </button>
            ) : (
              <div className="quest-completed-message">✅ Completed</div>
            )}
            <button
              className="back-to-map-btn"
              onClick={() => {
                setShowQuestDetails(false);
                setShowMap(true);
              }}
            >
              Back to Map
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  /**
   * Render reward screen
   */
  const renderRewardScreen = () => {
    if (!showReward || !currentReward) return null;

    return (
      <AnimatePresence>
        <motion.div
          className="reward-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="reward-container"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <h2>Quest Complete!</h2>
            <h3>You earned:</h3>

            <div className="rewards-grid">
              {Array.isArray(currentReward) ? (
                currentReward.map((reward, index) => (
                  <motion.div
                    key={index}
                    className="reward-item"
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3 + index * 0.2, type: "spring" }}
                  >
                    <div className="reward-icon">{reward.icon}</div>
                    <div className="reward-details">
                      <div className="reward-amount">
                        {reward.amount ? `${reward.amount} ` : ""}
                      </div>
                      <div className="reward-name">{reward.name || reward.type}</div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="reward-item">
                  <div className="reward-icon">{currentReward.icon}</div>
                  <div className="reward-details">
                    <div className="reward-amount">
                      {currentReward.amount ? `${currentReward.amount} ` : ""}
                    </div>
                    <div className="reward-name">{currentReward.name || currentReward.type}</div>
                  </div>
                </div>
              )}
            </div>

            <button
              className="close-reward-btn"
              onClick={() => {
                setShowReward(false);
                setCurrentReward(null);
              }}
            >
              Continue
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="quest-based-learning">
      <div className="world-header">
        <h1>{worldName}</h1>
        <div className="world-progress">
          <div className="progress-bar" style={{ width: `${worldProgress}%` }}></div>
          <span className="progress-text">{worldProgress}% Complete</span>
        </div>
        <div className="world-level">Level {currentLevel}</div>
      </div>

      {showMap && renderQuestMap()}
      {showQuestDetails && renderQuestDetails()}
      {renderRewardScreen()}
    </div>
  );
};

export default QuestBasedLearning;
