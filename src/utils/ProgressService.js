import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../firebase";

/**
 * Progress Service - Utility functions for handling user progress tracking in Unity experiences
 *
 * This service provides methods for tracking, updating, and retrieving user progress data
 * across various Unity educational experiences.
 */
const ProgressService = {
  /**
   * Get progress for a specific user and experience
   *
   * @param {string} userId - The ID of the user
   * @param {string} experienceId - The ID of the Unity experience
   * @returns {Promise<Object|null>} The progress data or null if not found
   */
  async getProgress(userId, experienceId) {
    try {
      const progressQuery = query(
        collection(firestore, "user_progress"),
        where("userId", "==", userId),
        where("experienceId", "==", experienceId),
      );

      const progressDocs = await getDocs(progressQuery);

      if (progressDocs.empty) {
        return null;
      }

      const progressDoc = progressDocs.docs[0];
      return {
        id: progressDoc.id,
        ...progressDoc.data(),
        lastUpdated: progressDoc.data().lastUpdated?.toDate() || new Date(),
        completedAt: progressDoc.data().completedAt?.toDate() || null,
        startedAt: progressDoc.data().startedAt?.toDate() || null,
      };
    } catch (err) {
      console.error("Error fetching progress:", err);
      throw err;
    }
  },

  /**
   * Initialize progress tracking for a user and experience
   *
   * @param {string} userId - The ID of the user
   * @param {string} experienceId - The ID of the Unity experience
   * @param {string} lessonId - Optional lesson ID
   * @param {string} moduleId - Optional module ID
   * @returns {Promise<Object>} The created progress document
   */
  async initializeProgress(userId, experienceId, lessonId = null, moduleId = null) {
    try {
      // Check if progress already exists
      const existingProgress = await this.getProgress(userId, experienceId);

      if (existingProgress) {
        return existingProgress;
      }

      // Create new progress document
      const newProgressRef = doc(collection(firestore, "user_progress"));
      const newProgress = {
        userId,
        experienceId,
        lessonId,
        moduleId,
        progress: 0,
        lastUpdated: serverTimestamp(),
        startedAt: serverTimestamp(),
        completedStations: [],
        completedAt: null,
        timeSpent: 0,
        achievements: [],
        visitedStations: [],
      };

      await setDoc(newProgressRef, newProgress);

      // Log activity
      await this.logActivity(
        userId,
        experienceId,
        "started_experience",
        "Started the educational experience",
      );

      return {
        id: newProgressRef.id,
        ...newProgress,
        lastUpdated: new Date(),
        startedAt: new Date(),
      };
    } catch (err) {
      console.error("Error initializing progress:", err);
      throw err;
    }
  },

  /**
   * Update progress for a user and experience
   *
   * @param {string} userId - The ID of the user
   * @param {string} experienceId - The ID of the Unity experience
   * @param {Object} data - The progress data to update
   * @returns {Promise<void>}
   */
  async updateProgress(userId, experienceId, data) {
    try {
      // Get existing progress
      const progressQuery = query(
        collection(firestore, "user_progress"),
        where("userId", "==", userId),
        where("experienceId", "==", experienceId),
      );

      const progressDocs = await getDocs(progressQuery);

      if (progressDocs.empty) {
        // Initialize progress if it doesn't exist
        await this.initializeProgress(userId, experienceId);

        // Query again to get the newly created progress
        const newQuery = query(
          collection(firestore, "user_progress"),
          where("userId", "==", userId),
          where("experienceId", "==", experienceId),
        );

        const newProgressDocs = await getDocs(newQuery);

        if (newProgressDocs.empty) {
          throw new Error("Failed to create progress document");
        }

        // Update the newly created progress
        await updateDoc(newProgressDocs.docs[0].ref, {
          ...data,
          lastUpdated: serverTimestamp(),
        });
      } else {
        // Update existing progress
        await updateDoc(progressDocs.docs[0].ref, {
          ...data,
          lastUpdated: serverTimestamp(),
        });
      }

      // Log activity if significant progress update
      if (data.progress) {
        await this.logActivity(
          userId,
          experienceId,
          "progress_update",
          `Progress updated to ${Math.round(data.progress * 100)}%`,
        );
      }
    } catch (err) {
      console.error("Error updating progress:", err);
      throw err;
    }
  },

  /**
   * Track completion of a learning station
   *
   * @param {string} userId - The ID of the user
   * @param {string} experienceId - The ID of the Unity experience
   * @param {string} stationId - The ID of the learning station
   * @param {Object} stationData - Optional data about the station completion
   * @returns {Promise<void>}
   */
  async completeStation(userId, experienceId, stationId, stationData = {}) {
    try {
      // Get existing progress
      const progressQuery = query(
        collection(firestore, "user_progress"),
        where("userId", "==", userId),
        where("experienceId", "==", experienceId),
      );

      const progressDocs = await getDocs(progressQuery);

      if (progressDocs.empty) {
        throw new Error("No progress record found");
      }

      const progressRef = progressDocs.docs[0].ref;

      // Update with the completed station
      await updateDoc(progressRef, {
        completedStations: arrayUnion(stationId),
        lastUpdated: serverTimestamp(),
        stationCompletions: arrayUnion({
          stationId,
          completedAt: serverTimestamp(),
          ...stationData,
        }),
      });

      // Log activity
      await this.logActivity(
        userId,
        experienceId,
        "station_completed",
        `Completed learning station: ${stationId}`,
        { stationId },
      );

      // Check if all stations are completed
      const progressData = progressDocs.docs[0].data();
      const experience = await this.getExperience(experienceId);

      if (experience && experience.stations) {
        const updatedCompletedStations = [...(progressData.completedStations || []), stationId];
        const allCompleted = experience.stations.every((station) =>
          updatedCompletedStations.includes(station.id),
        );

        if (allCompleted) {
          // Mark experience as complete
          await this.completeExperience(userId, experienceId);
        }
      }
    } catch (err) {
      console.error("Error completing station:", err);
      throw err;
    }
  },

  /**
   * Track time spent in an experience
   *
   * @param {string} userId - The ID of the user
   * @param {string} experienceId - The ID of the Unity experience
   * @param {number} minutes - Number of minutes spent
   * @returns {Promise<void>}
   */
  async trackTimeSpent(userId, experienceId, minutes) {
    try {
      // Get existing progress
      const progressQuery = query(
        collection(firestore, "user_progress"),
        where("userId", "==", userId),
        where("experienceId", "==", experienceId),
      );

      const progressDocs = await getDocs(progressQuery);

      if (progressDocs.empty) {
        throw new Error("No progress record found");
      }

      // Update time spent
      await updateDoc(progressDocs.docs[0].ref, {
        timeSpent: increment(minutes),
        lastUpdated: serverTimestamp(),
      });

      // Log activity if significant time increment
      if (minutes >= 5) {
        await this.logActivity(
          userId,
          experienceId,
          "time_tracked",
          `Spent ${minutes} minutes in the experience`,
        );
      }
    } catch (err) {
      console.error("Error tracking time spent:", err);
      throw err;
    }
  },

  /**
   * Mark an experience as complete
   *
   * @param {string} userId - The ID of the user
   * @param {string} experienceId - The ID of the Unity experience
   * @returns {Promise<void>}
   */
  async completeExperience(userId, experienceId) {
    try {
      // Get existing progress
      const progressQuery = query(
        collection(firestore, "user_progress"),
        where("userId", "==", userId),
        where("experienceId", "==", experienceId),
      );

      const progressDocs = await getDocs(progressQuery);

      if (progressDocs.empty) {
        throw new Error("No progress record found");
      }

      // Mark as completed
      await updateDoc(progressDocs.docs[0].ref, {
        progress: 1,
        completed: true,
        completedAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
      });

      // Log activity
      await this.logActivity(
        userId,
        experienceId,
        "experience_completed",
        "Completed the educational experience",
      );

      // Check for achievements
      await this.checkAchievements(userId, experienceId);
    } catch (err) {
      console.error("Error completing experience:", err);
      throw err;
    }
  },

  /**
   * Log user activity in an experience
   *
   * @param {string} userId - The ID of the user
   * @param {string} experienceId - The ID of the Unity experience
   * @param {string} type - The type of activity
   * @param {string} description - Description of the activity
   * @param {Object} metadata - Optional metadata about the activity
   * @returns {Promise<void>}
   */
  async logActivity(userId, experienceId, type, description, metadata = {}) {
    try {
      const activityRef = doc(collection(firestore, "activity_logs"));

      await setDoc(activityRef, {
        userId,
        experienceId,
        type,
        description,
        timestamp: serverTimestamp(),
        metadata,
      });
    } catch (err) {
      console.error("Error logging activity:", err);
      // Don't throw - activity logging should not interrupt main flow
    }
  },

  /**
   * Check for and award achievements
   *
   * @param {string} userId - The ID of the user
   * @param {string} experienceId - The ID of the Unity experience
   * @returns {Promise<void>}
   */
  async checkAchievements(userId, experienceId) {
    try {
      // Get user progress across all experiences
      const allProgressQuery = query(
        collection(firestore, "user_progress"),
        where("userId", "==", userId),
      );

      const allProgressDocs = await getDocs(allProgressQuery);
      const completedExperiences = allProgressDocs.docs.filter(
        (doc) => doc.data().completed || doc.data().progress === 1,
      ).length;

      // Get this specific experience's progress
      const progressQuery = query(
        collection(firestore, "user_progress"),
        where("userId", "==", userId),
        where("experienceId", "==", experienceId),
      );

      const progressDocs = await getDocs(progressQuery);

      if (progressDocs.empty) {
        return;
      }

      const progress = progressDocs.docs[0].data();

      // Define achievement conditions
      const achievements = [];

      // Achievement: First completed experience
      if (completedExperiences === 1) {
        achievements.push({
          id: "first_experience_complete",
          title: "First Steps",
          description: "Completed your first educational experience",
          type: "milestone",
        });
      }

      // Achievement: Quick learner (completed in less than 30 minutes)
      if (progress.timeSpent <= 30) {
        achievements.push({
          id: "quick_learner",
          title: "Quick Learner",
          description: "Completed an experience in record time",
          type: "performance",
        });
      }

      // Award achievements
      for (const achievement of achievements) {
        await this.awardAchievement(userId, experienceId, achievement);
      }
    } catch (err) {
      console.error("Error checking achievements:", err);
    }
  },

  /**
   * Award an achievement to a user
   *
   * @param {string} userId - The ID of the user
   * @param {string} experienceId - The ID of the Unity experience
   * @param {Object} achievement - The achievement to award
   * @returns {Promise<void>}
   */
  async awardAchievement(userId, experienceId, achievement) {
    try {
      // Check if achievement already awarded
      const achievementQuery = query(
        collection(firestore, "achievements"),
        where("userId", "==", userId),
        where("achievementId", "==", achievement.id),
      );

      const achievementDocs = await getDocs(achievementQuery);

      if (!achievementDocs.empty) {
        return; // Already awarded
      }

      // Award the achievement
      const achievementRef = doc(collection(firestore, "achievements"));

      await setDoc(achievementRef, {
        userId,
        experienceId,
        achievementId: achievement.id,
        title: achievement.title,
        description: achievement.description,
        type: achievement.type,
        earnedAt: serverTimestamp(),
      });

      // Log activity
      await this.logActivity(
        userId,
        experienceId,
        "achievement_earned",
        `Earned achievement: ${achievement.title}`,
        { achievement },
      );

      // Add to user's progress record
      const progressQuery = query(
        collection(firestore, "user_progress"),
        where("userId", "==", userId),
        where("experienceId", "==", experienceId),
      );

      const progressDocs = await getDocs(progressQuery);

      if (!progressDocs.empty) {
        await updateDoc(progressDocs.docs[0].ref, {
          achievements: arrayUnion(achievement.id),
        });
      }
    } catch (err) {
      console.error("Error awarding achievement:", err);
    }
  },

  /**
   * Get a Unity experience by ID
   *
   * @param {string} experienceId - The ID of the Unity experience
   * @returns {Promise<Object|null>} The experience data or null if not found
   */
  async getExperience(experienceId) {
    try {
      const experienceQuery = query(
        collection(firestore, "unity_experiences"),
        where("id", "==", experienceId),
      );

      const experienceDocs = await getDocs(experienceQuery);

      if (experienceDocs.empty) {
        return null;
      }

      return {
        id: experienceDocs.docs[0].id,
        ...experienceDocs.docs[0].data(),
      };
    } catch (err) {
      console.error("Error fetching experience:", err);
      return null;
    }
  },

  /**
   * Get all progress for a user
   *
   * @param {string} userId - The ID of the user
   * @returns {Promise<Array>} Array of progress documents
   */
  async getUserProgress(userId) {
    try {
      const progressQuery = query(
        collection(firestore, "user_progress"),
        where("userId", "==", userId),
      );

      const progressDocs = await getDocs(progressQuery);

      return progressDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        lastUpdated: doc.data().lastUpdated?.toDate() || new Date(),
        completedAt: doc.data().completedAt?.toDate() || null,
        startedAt: doc.data().startedAt?.toDate() || null,
      }));
    } catch (err) {
      console.error("Error fetching user progress:", err);
      throw err;
    }
  },

  /**
   * Get all achievements for a user
   *
   * @param {string} userId - The ID of the user
   * @returns {Promise<Array>} Array of achievement documents
   */
  async getUserAchievements(userId) {
    try {
      const achievementQuery = query(
        collection(firestore, "achievements"),
        where("userId", "==", userId),
      );

      const achievementDocs = await getDocs(achievementQuery);

      return achievementDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        earnedAt: doc.data().earnedAt?.toDate() || new Date(),
      }));
    } catch (err) {
      console.error("Error fetching user achievements:", err);
      throw err;
    }
  },

  /**
   * Get user activity log
   *
   * @param {string} userId - The ID of the user
   * @param {string} experienceId - Optional experience ID to filter by
   * @param {number} limit - Maximum number of activities to return
   * @returns {Promise<Array>} Array of activity log documents
   */
  async getUserActivity(userId, experienceId = null, limit = 50) {
    try {
      let activityQuery;

      if (experienceId) {
        activityQuery = query(
          collection(firestore, "activity_logs"),
          where("userId", "==", userId),
          where("experienceId", "==", experienceId),
          limit,
        );
      } else {
        activityQuery = query(
          collection(firestore, "activity_logs"),
          where("userId", "==", userId),
          limit,
        );
      }

      const activityDocs = await getDocs(activityQuery);

      return activityDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      }));
    } catch (err) {
      console.error("Error fetching user activity:", err);
      throw err;
    }
  },
};

export default ProgressService;
