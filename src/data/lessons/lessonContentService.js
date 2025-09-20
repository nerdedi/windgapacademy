import { lifeSkillsLessons } from "./categories/lifeSkills";
import { employmentSkillsLessons } from "./categories/employmentSkills";
import { digitalLiteracyLessons } from "./categories/digitalLiteracy";
import { numeracyLessons } from "./categories/numeracy";
import { literacyLanguageLessons } from "./categories/literacyLanguage";
import { emotionalRegulationLessons } from "./categories/emotionalRegulation";
import { socialCommunicationLessons } from "./categories/socialCommunication";

/**
 * LessonContentService - Provides access to all lesson content
 */
class LessonContentService {
  constructor() {
    this.allLessons = [
      ...lifeSkillsLessons,
      ...employmentSkillsLessons,
      ...digitalLiteracyLessons,
      ...numeracyLessons,
      ...literacyLanguageLessons,
      ...emotionalRegulationLessons,
      ...socialCommunicationLessons,
    ];
  }

  /**
   * Get all available lessons
   */
  getAllLessons() {
    return this.allLessons;
  }

  /**
   * Get lessons by category
   */
  getLessonsByCategory(category) {
    return this.allLessons.filter((lesson) => lesson.category === category);
  }

  /**
   * Get lessons by subcategory
   */
  getLessonsBySubcategory(subcategory) {
    return this.allLessons.filter((lesson) => lesson.subcategory === subcategory);
  }

  /**
   * Get lessons by difficulty level
   */
  getLessonsByDifficulty(difficultyLevel) {
    return this.allLessons.filter((lesson) => lesson.difficultyLevel === difficultyLevel);
  }

  /**
   * Get a specific lesson by ID
   */
  getLessonById(id) {
    return this.allLessons.find((lesson) => lesson.id === id);
  }

  /**
   * Get recommended next lessons based on completed lessons
   */
  getRecommendedLessons(completedLessonIds = []) {
    // If no lessons completed, recommend beginner lessons
    if (completedLessonIds.length === 0) {
      return this.allLessons.filter((lesson) => lesson.difficultyLevel === "beginner").slice(0, 5);
    }

    // Get completed lessons
    const completedLessons = this.allLessons.filter((lesson) =>
      completedLessonIds.includes(lesson.id),
    );

    // Get categories of completed lessons
    const completedCategories = [...new Set(completedLessons.map((lesson) => lesson.category))];

    // Recommend next level in same categories
    const recommendations = [];

    // For each completed category, find next level lessons
    completedCategories.forEach((category) => {
      const categoryLessons = this.getLessonsByCategory(category);
      const completedDifficulties = [
        ...new Set(
          completedLessons
            .filter((lesson) => lesson.category === category)
            .map((lesson) => lesson.difficultyLevel),
        ),
      ];

      // If all difficulties completed in this category, skip
      if (completedDifficulties.includes("advanced")) {
        return;
      }

      // Find next difficulty level
      let nextDifficulty;
      if (completedDifficulties.includes("intermediate")) {
        nextDifficulty = "advanced";
      } else if (completedDifficulties.includes("beginner")) {
        nextDifficulty = "intermediate";
      } else {
        nextDifficulty = "beginner";
      }

      // Get lessons of next difficulty that aren't completed
      const nextLessons = categoryLessons.filter(
        (lesson) =>
          lesson.difficultyLevel === nextDifficulty && !completedLessonIds.includes(lesson.id),
      );

      recommendations.push(...nextLessons);
    });

    // If we have enough recommendations, return them
    if (recommendations.length >= 3) {
      return recommendations.slice(0, 5);
    }

    // Otherwise, find new categories to explore
    const unexploredCategories = Object.keys({
      "Life Skills": true,
      "Employment Skills": true,
      "Digital Literacy": true,
      Numeracy: true,
      "Literacy & Language": true,
      "Emotional Regulation": true,
      "Social Communication": true,
    }).filter((category) => !completedCategories.includes(category));

    // For each unexplored category, add beginner lessons
    unexploredCategories.forEach((category) => {
      const beginnerLessons = this.getLessonsByCategory(category).filter(
        (lesson) =>
          lesson.difficultyLevel === "beginner" && !completedLessonIds.includes(lesson.id),
      );

      recommendations.push(...beginnerLessons.slice(0, 2));
    });

    return recommendations.slice(0, 5);
  }
}

export const lessonContentService = new LessonContentService();
