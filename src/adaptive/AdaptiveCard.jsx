// Portions of this file were generated with the assistance of GitHub Copilot

import PropTypes from "prop-types";
import React, { useState } from "react";

import { useComponentAdaptive } from "./useComponentAdaptive";

/**
 * AdaptiveCard - A component that demonstrates adaptive UI features
 *
 * This component adapts its presentation and behavior based on:
 * - User's learning style
 * - Device capabilities
 * - User interaction patterns
 * - Accessibility preferences
 *
 * @param {Object} props - Component props
 * @returns {JSX.Element} Adaptive card component
 */
const AdaptiveCard = ({
  id,
  title,
  content,
  image,
  video,
  audio,
  interactive,
  importance = "medium",
  defaultExpanded = false,
  onInteraction,
  className,
  ...props
}) => {
  // Local state
  const [expanded, setExpanded] = useState(defaultExpanded);

  // Get adaptive features from the hook
  const {
    componentRef,
    adaptiveProps,
    trackInteraction,
    getComponentClasses,
    colorScheme,
    motionReduced,
    focusMode,
  } = useComponentAdaptive({
    componentId: id,
    componentType: "card",
    defaultSettings: {
      importance,
      defaultExpanded,
    },
  });

  // Determine which content to prioritize based on learning style
  const shouldShowImage =
    image &&
    (!adaptiveProps.learningStyle ||
      adaptiveProps.learningStyle === "visual" ||
      adaptiveProps.learningStyle === "balanced");

  const shouldShowVideo =
    video &&
    (adaptiveProps.learningStyle === "visual" ||
      adaptiveProps.learningStyle === "kinesthetic" ||
      adaptiveProps.learningStyle === "balanced");

  const shouldShowAudio =
    audio &&
    (adaptiveProps.learningStyle === "auditory" || adaptiveProps.learningStyle === "balanced");

  const shouldShowInteractive =
    interactive &&
    (adaptiveProps.learningStyle === "kinesthetic" || adaptiveProps.learningStyle === "balanced");

  // Determine component size based on importance and focus mode
  const getSize = () => {
    if (focusMode) {
      // In focus mode, reduce size of less important cards
      return importance === "high" ? "large" : "small";
    }

    // Otherwise, use importance to determine size
    switch (importance) {
      case "high":
        return "large";
      case "low":
        return "small";
      default:
        return "medium";
    }
  };

  // Handle click on the card
  const handleClick = () => {
    // Track the interaction for future adaptations
    trackInteraction("click", { expanded });

    // Toggle expanded state
    setExpanded(!expanded);

    // Call the provided callback if available
    if (onInteraction) {
      onInteraction("click", { expanded: !expanded });
    }
  };

  // Get additional adaptive classes
  const cardClasses = getComponentClasses("adaptive-card");
  const size = getSize();

  return (
    <div
      ref={componentRef}
      className={`adaptive-card adaptive-card--${size} ${cardClasses} ${className || ""}`}
      data-importance={importance}
      data-expanded={expanded}
      data-theme={colorScheme}
      onClick={handleClick}
      {...props}
    >
      {/* Card Header */}
      <div className="adaptive-card__header">
        <h3 className="adaptive-card__title">{title}</h3>

        {/* Show indicators based on adaptive properties */}
        {adaptiveProps.helpIndicators && (
          <span className="adaptive-card__help-indicator" title="Click for more information">
            ?
          </span>
        )}
      </div>

      {/* Card Media - show based on learning style preferences */}
      <div className="adaptive-card__media">
        {shouldShowImage && (
          <img
            src={image}
            alt={`Image for ${title}`}
            className="adaptive-card__image"
            loading="lazy"
          />
        )}

        {shouldShowVideo && !motionReduced && (
          <video
            src={video}
            className="adaptive-card__video"
            controls={adaptiveProps.enhancedGuidance}
            loop={false}
            muted={adaptiveProps.auditoryEmphasis ? false : true}
            autoPlay={false}
            preload="metadata"
          />
        )}

        {shouldShowAudio && (
          <audio src={audio} className="adaptive-card__audio" controls={true} preload="metadata" />
        )}
      </div>

      {/* Card Content */}
      <div className="adaptive-card__content">
        {/* Text content - always show, but adapt based on learning style */}
        <div
          className={`adaptive-card__text ${adaptiveProps.visualEmphasis ? "adaptive-card__text--visual-emphasis" : ""}`}
        >
          {content}
        </div>

        {/* Interactive content - show based on learning style */}
        {shouldShowInteractive && expanded && (
          <div className="adaptive-card__interactive">{interactive}</div>
        )}
      </div>

      {/* Card Actions */}
      <div className="adaptive-card__actions">
        {/* Show advanced features based on user patterns */}
        {adaptiveProps.advanced && (
          <button
            className="adaptive-card__advanced-action"
            onClick={(e) => {
              e.stopPropagation();
              trackInteraction("advanced_action");
              if (onInteraction) {
                onInteraction("advanced_action");
              }
            }}
          >
            Advanced Options
          </button>
        )}

        {/* Expand/Collapse Button */}
        <button
          className="adaptive-card__expand-button"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
            trackInteraction(expanded ? "collapse" : "expand");
            if (onInteraction) {
              onInteraction(expanded ? "collapse" : "expand");
            }
          }}
          aria-expanded={expanded}
          aria-controls={`${id}-content`}
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      </div>
    </div>
  );
};

AdaptiveCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  image: PropTypes.string,
  video: PropTypes.string,
  audio: PropTypes.string,
  interactive: PropTypes.node,
  importance: PropTypes.oneOf(["low", "medium", "high"]),
  defaultExpanded: PropTypes.bool,
  onInteraction: PropTypes.func,
  className: PropTypes.string,
};

export default AdaptiveCard;
