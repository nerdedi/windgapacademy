import React from "react";
import PropTypes from "prop-types";
import {
  playAnimation,
  setCharacter,
  startStory,
  makeChoice,
} from "../unity-integration/UnityBridge";

/**
 * A library of character animations that can be used across the application
 */
const AnimationLibrary = {
  /**
   * Play a talk animation for a character
   * @param {string} character - Character name
   * @param {Object} options - Additional options
   * @returns {boolean} Success status
   */
  talk: (character, options = {}) => {
    return playAnimation(character, "Talk", options);
  },

  /**
   * Play a walk animation for a character
   * @param {string} character - Character name
   * @param {Object} options - Additional options
   * @returns {boolean} Success status
   */
  walk: (character, options = {}) => {
    return playAnimation(character, "Walk", options);
  },

  /**
   * Play a jump animation for a character
   * @param {string} character - Character name
   * @param {Object} options - Additional options
   * @returns {boolean} Success status
   */
  jump: (character, options = {}) => {
    return playAnimation(character, "Jump", options);
  },

  /**
   * Play a celebrate animation for a character
   * @param {string} character - Character name
   * @param {Object} options - Additional options
   * @returns {boolean} Success status
   */
  celebrate: (character, options = {}) => {
    return playAnimation(character, "Celebrate", options);
  },

  /**
   * Play a think animation for a character
   * @param {string} character - Character name
   * @param {Object} options - Additional options
   * @returns {boolean} Success status
   */
  think: (character, options = {}) => {
    return playAnimation(character, "Think", options);
  },

  /**
   * Start a story by ID
   * @param {string} storyId - Story ID to start
   * @param {Object} options - Additional options
   * @returns {boolean} Success status
   */
  startStory: (storyId, options = {}) => {
    return startStory(storyId, options);
  },

  /**
   * Make a choice in the current story
   * @param {number} choiceIndex - Choice index
   * @returns {boolean} Success status
   */
  makeChoice: (choiceIndex) => {
    return makeChoice(choiceIndex);
  },

  /**
   * Set the active character
   * @param {string} character - Character name
   * @param {Object} options - Additional options
   * @returns {boolean} Success status
   */
  setCharacter: (character, options = {}) => {
    return setCharacter(character, options);
  },
};

/**
 * Animation Button component for easy animation triggering
 */
export const AnimationButton = ({
  character,
  animationType,
  label = null,
  disabled = false,
  options = {},
  ...props
}) => {
  const handleClick = () => {
    if (AnimationLibrary[animationType]) {
      AnimationLibrary[animationType](character, options);
    } else {
      console.error(`Animation type '${animationType}' not found`);
    }
  };

  return (
    <button onClick={handleClick} disabled={disabled} {...props}>
      {label || animationType}
    </button>
  );
};

AnimationButton.propTypes = {
  character: PropTypes.string.isRequired,
  animationType: PropTypes.oneOf(["talk", "walk", "jump", "celebrate", "think"]).isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  options: PropTypes.object,
};

export default AnimationLibrary;
