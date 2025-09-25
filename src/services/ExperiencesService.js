import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

/**
 * ExperiencesService - Service for managing educational experiences in Firestore
 */
const EXPERIENCES_COLLECTION = "experiences";

/**
 * Get all educational experiences
 * @param {Object} options - Query options
 * @param {string} options.category - Optional category to filter by
 * @param {number} options.limit - Optional limit of results to return
 * @returns {Promise<Array>} - Promise resolving to array of experience objects
 */
export const getAllExperiences = async ({ category = null, limit = 50 } = {}) => {
  try {
    let experiencesQuery;

    if (category) {
      experiencesQuery = query(
        collection(db, EXPERIENCES_COLLECTION),
        where("category", "==", category),
        where("published", "==", true),
      );
    } else {
      experiencesQuery = query(
        collection(db, EXPERIENCES_COLLECTION),
        where("published", "==", true),
      );
    }

    const snapshot = await getDocs(experiencesQuery);

    const experiences = [];
    snapshot.forEach((doc) => {
      experiences.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Apply limit after fetching
    return experiences.slice(0, limit);
  } catch (error) {
    console.error("Error getting experiences:", error);
    throw error;
  }
};

/**
 * Get experience by ID
 * @param {string} experienceId - Experience ID
 * @returns {Promise<Object|null>} - Promise resolving to experience object or null
 */
export const getExperienceById = async (experienceId) => {
  try {
    const experienceRef = doc(db, EXPERIENCES_COLLECTION, experienceId);
    const experienceSnapshot = await getDoc(experienceRef);

    if (experienceSnapshot.exists()) {
      return {
        id: experienceSnapshot.id,
        ...experienceSnapshot.data(),
      };
    } else {
      console.warn(`Experience with ID ${experienceId} not found`);
      return null;
    }
  } catch (error) {
    console.error(`Error getting experience ${experienceId}:`, error);
    throw error;
  }
};

/**
 * Get experiences by category
 * @param {string} category - Category to filter by
 * @returns {Promise<Array>} - Promise resolving to array of experience objects
 */
export const getExperiencesByCategory = async (category) => {
  return getAllExperiences({ category });
};

/**
 * Get featured experiences
 * @param {number} limit - Number of featured experiences to return
 * @returns {Promise<Array>} - Promise resolving to array of featured experience objects
 */
export const getFeaturedExperiences = async (limit = 6) => {
  try {
    const featuredQuery = query(
      collection(db, EXPERIENCES_COLLECTION),
      where("featured", "==", true),
      where("published", "==", true),
    );

    const snapshot = await getDocs(featuredQuery);

    const experiences = [];
    snapshot.forEach((doc) => {
      experiences.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Return limited number of featured experiences
    return experiences.slice(0, limit);
  } catch (error) {
    console.error("Error getting featured experiences:", error);
    throw error;
  }
};

/**
 * Get recent experiences
 * @param {number} limit - Number of recent experiences to return
 * @returns {Promise<Array>} - Promise resolving to array of recent experience objects
 */
export const getRecentExperiences = async (limit = 6) => {
  try {
    const experiencesQuery = query(
      collection(db, EXPERIENCES_COLLECTION),
      where("published", "==", true),
    );

    const snapshot = await getDocs(experiencesQuery);

    const experiences = [];
    snapshot.forEach((doc) => {
      experiences.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Sort by createdAt (newest first)
    experiences.sort((a, b) => {
      const dateA = a.createdAt?.toDate() || new Date(0);
      const dateB = b.createdAt?.toDate() || new Date(0);
      return dateB - dateA;
    });

    // Return limited number of recent experiences
    return experiences.slice(0, limit);
  } catch (error) {
    console.error("Error getting recent experiences:", error);
    throw error;
  }
};

/**
 * Search experiences
 * @param {string} query - Search query
 * @param {number} limit - Number of results to return
 * @returns {Promise<Array>} - Promise resolving to array of matching experience objects
 */
export const searchExperiences = async (query, limit = 20) => {
  try {
    // Get all experiences and filter client-side
    // Note: For a production app, you would use a proper search service like Algolia
    const allExperiences = await getAllExperiences({ limit: 500 });

    // Convert query to lowercase for case-insensitive search
    const lowercaseQuery = query.toLowerCase();

    // Filter experiences that match the query
    const filteredExperiences = allExperiences.filter((experience) => {
      const title = experience.title?.toLowerCase() || "";
      const description = experience.description?.toLowerCase() || "";
      const category = experience.category?.toLowerCase() || "";
      const tags = experience.tags || [];

      // Check if query is in title, description, category, or tags
      return (
        title.includes(lowercaseQuery) ||
        description.includes(lowercaseQuery) ||
        category.includes(lowercaseQuery) ||
        tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
      );
    });

    // Return limited number of matching experiences
    return filteredExperiences.slice(0, limit);
  } catch (error) {
    console.error("Error searching experiences:", error);
    throw error;
  }
};

/**
 * Get recommended experiences based on user's completed experiences
 * @param {string} userId - User ID
 * @param {number} limit - Number of recommendations to return
 * @returns {Promise<Array>} - Promise resolving to array of recommended experience objects
 */
export const getRecommendedExperiences = async (userId, limit = 6) => {
  // In a real application, this would use a recommendation algorithm
  // For now, return featured experiences as recommendations
  return getFeaturedExperiences(limit);
};
