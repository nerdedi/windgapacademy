// Unity Animation Storylines Loader
// This file is responsible for loading and managing the storyline data for Unity animations

import characterStorylines from "./storylines/character-storylines.json";

/**
 * Class for managing Unity animation storylines
 */
class StorylineManager {
  constructor() {
    this.stories = characterStorylines.stories || [];
    this.currentStory = null;
    this.currentNode = null;
  }

  /**
   * Get a story by ID
   * @param {string} storyId - The ID of the story to retrieve
   * @returns {Object} The story object or null if not found
   */
  getStory(storyId) {
    return this.stories.find((story) => story.id === storyId) || null;
  }

  /**
   * Get all available stories
   * @returns {Array} Array of story objects
   */
  getAllStories() {
    return this.stories;
  }

  /**
   * Get a node from the current story by ID
   * @param {string} nodeId - The ID of the node to retrieve
   * @returns {Object} The node object or null if not found
   */
  getNode(nodeId) {
    if (!this.currentStory) return null;

    return this.currentStory.nodes.find((node) => node.id === nodeId) || null;
  }

  /**
   * Start a story by ID
   * @param {string} storyId - The ID of the story to start
   * @returns {Object} The first node of the story or null if story not found
   */
  startStory(storyId) {
    const story = this.getStory(storyId);
    if (!story) return null;

    this.currentStory = story;
    const startNode = this.getNode(story.startNodeId);
    this.currentNode = startNode;

    return startNode;
  }

  /**
   * Make a choice in the current story
   * @param {number} choiceIndex - The index of the choice made
   * @returns {Object} The next node based on the choice or null if invalid
   */
  makeChoice(choiceIndex) {
    if (!this.currentNode || !this.currentNode.isChoicePoint) return null;
    if (choiceIndex < 0 || choiceIndex >= this.currentNode.nextNodeIds.length) return null;

    const nextNodeId = this.currentNode.nextNodeIds[choiceIndex];
    const nextNode = this.getNode(nextNodeId);
    this.currentNode = nextNode;

    return nextNode;
  }

  /**
   * Advance to the next node in the story
   * @returns {Object} The next node or null if at the end or at a choice point
   */
  advanceStory() {
    if (!this.currentNode) return null;
    if (this.currentNode.isChoicePoint) return null;
    if (this.currentNode.nextNodeIds.length === 0) return null;

    const nextNodeId = this.currentNode.nextNodeIds[0];
    const nextNode = this.getNode(nextNodeId);
    this.currentNode = nextNode;

    return nextNode;
  }

  /**
   * Check if the current story is complete
   * @returns {boolean} True if the story is complete, false otherwise
   */
  isStoryComplete() {
    if (!this.currentNode) return true;
    return this.currentNode.nextNodeIds.length === 0;
  }

  /**
   * Get the title of the current story
   * @returns {string} The title of the current story or null if no story is active
   */
  getCurrentStoryTitle() {
    return this.currentStory ? this.currentStory.title : null;
  }
}

export default new StorylineManager();
