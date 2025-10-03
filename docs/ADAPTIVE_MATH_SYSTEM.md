# Windgap Academy - Adaptive Math Learning

This document outlines the adaptive math learning features implemented in the Windgap Academy platform, focusing on tailored educational experiences that adjust to each learner's needs.

## Overview

The adaptive math learning system combines:

1. **Difficulty Adjustment**: Questions adapt in complexity based on learner performance
2. **Progress Tracking**: Long-term monitoring of learning achievements
3. **Personalized Feedback**: Tailored responses to learner answers
4. **Question Type Adaptation**: Different question formats based on learning style
5. **Quest-Based Learning**: Gamified structure with worlds, quests, and tasks

## Key Components

### AdaptiveMathExercise

The core component that handles adaptive learning logic:

```jsx
import { AdaptiveMathExercise } from "../components/AdaptiveMathExercise";

<AdaptiveMathExercise
  concept="fractions"
  initialDifficulty={3}
  userId="user123"
  feedbackStyle="encouraging"
  questionTypes={["multiple-choice", "direct-input", "matching"]}
  adaptationSpeed={0.8}
/>;
```

Key props:

- `concept`: Math concept being taught
- `initialDifficulty`: Starting difficulty (1-10)
- `userId`: For progress tracking
- `feedbackStyle`: Type of feedback ("encouraging", "detailed", "minimal")
- `questionTypes`: Array of question formats to use
- `adaptationSpeed`: How quickly difficulty changes (0-1)

### QuestBasedLearning

Structures learning into a gamified progression system:

```jsx
import { QuestBasedLearning } from "../components/QuestBasedLearning";

<QuestBasedLearning
  worldId="fractions-world"
  userId="user123"
  exerciseComponent={FractionMastery}
  rewards={{
    points: true,
    badges: true,
    characterItems: true,
  }}
/>;
```

Key props:

- `worldId`: Identifies the learning world
- `userId`: For progress tracking
- `exerciseComponent`: The exercise to render
- `rewards`: Types of rewards to offer

## Example Implementations

### Fraction Mastery Exercise

A complete implementation focusing on fraction concepts:

- Path: `/math/fraction-mastery`
- Source: `/src/exercises/FractionMastery.jsx`
- Features:
  - Fraction comparison
  - Addition/subtraction
  - Equivalent fractions
  - Visual representations

To run this example:

```bash
./start-fraction-mastery.sh
```

### AdaptiveMathLearningPage

A generalized page that can load any concept:

- Path: `/math/adaptive-quest/:conceptId`
- Source: `/src/pages/AdaptiveMathLearningPage.jsx`
- Dynamically loads concept-specific exercises

## Creating New Adaptive Exercises

1. Use the `createAdaptiveExercise.js` script:

```bash
node scripts/createAdaptiveExercise.js MyNewExercise algebra
```

2. Implement the exercise content in the generated file
3. Add a route in `App.jsx`
4. Create a script to launch the exercise (optional)

## Integration with Firebase

The adaptive system can store progress data in Firebase:

- User performance metrics
- Difficulty progression
- Quest completion status
- Rewards and achievements

## Accessibility Features

All adaptive exercises include:

- Screen reader compatibility
- Keyboard navigation
- High contrast options
- Font size adjustments
- Reading assistance

## Best Practices

1. **Start Simple**: Begin with a manageable difficulty
2. **Clear Instructions**: Explain concepts before testing
3. **Meaningful Feedback**: Always explain why answers are right/wrong
4. **Visual Support**: Use diagrams and visual aids when possible
5. **Celebrate Progress**: Acknowledge achievements frequently

## Future Enhancements

- Machine learning for better adaptation
- More question types
- Enhanced visual feedback
- Peer learning integration
- Teacher dashboard for monitoring

## References

- [Understanding Adaptive Learning](https://www.windgapacademy.com/docs/adaptive-learning)
- [Quest-Based Learning Research](https://www.windgapacademy.com/research/quest-learning)
- [Fractions Teaching Guide](https://www.windgapacademy.com/guides/fractions)
