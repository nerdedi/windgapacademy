# Adaptive Math Learning Components

This module provides adaptive learning components for mathematics education within the Windgap Academy platform. These components incorporate gamification elements inspired by educational games like Antura to create an engaging, personalized learning experience.

## Components Overview

### 1. AdaptiveMathExercise

A component that adapts exercise difficulty based on user performance, tracks learning progress, and provides personalized feedback.

```jsx
<AdaptiveMathExercise
  userId="user123"
  conceptId="addition"
  conceptName="Addition"
  knowledgeArea="arithmetic"
  exerciseGenerator={generateExerciseFunction}
  maxExercises={5}
  initialDifficulty="medium"
  saveProgress={true}
  onComplete={handleExerciseComplete}
/>
```

### 2. QuestBasedLearning

A system for structuring learning as quests, missions, and challenges, inspired by educational games.

```jsx
<QuestBasedLearning
  userId="user123"
  worldId="math_kingdom"
  worldName="Math Kingdom"
  initialLevel={1}
  questGenerators={questGeneratorsObject}
  saveProgress={true}
/>
```

### 3. AdaptiveQuestBasedMathGame

A component that integrates adaptive exercises into a quest-based learning framework.

```jsx
<AdaptiveQuestBasedMathGame />
```

## Features

### Adaptive Learning

- Automatically adjusts difficulty based on performance
- Tracks mastery levels over time
- Identifies strengths and weaknesses
- Provides personalized feedback
- Adapts question types based on learning needs

### Quest-Based Learning

- Structures learning as an adventure with quests and missions
- Includes main quests, side quests, and challenge quests
- Provides rewards and achievements
- Visual progression tracking
- Unlocking system based on prerequisites

### Exercise Generation

- Difficulty-appropriate exercises
- Multiple knowledge areas (addition, subtraction, multiplication, etc.)
- Various exercise types
- Performance-based adaptation rules

## Getting Started

1. **Run the development server with math exercises enabled:**

   ```bash
   ./start-math-exercises.sh
   ```

2. **Access the adaptive math learning interface:**
   Navigate to http://localhost:3000/math/adaptive-quest

3. **Create your own adaptive exercises:**
   ```bash
   node scripts/createAdaptiveExercise.js
   ```

## Customization

### Creating Custom Exercises

1. Use the `createAdaptiveExercise.js` script to generate a template
2. Implement the exercise generation logic for each difficulty level
3. Import and add your exercise to routes or other components

### Creating Custom Quests

Extend the quest system by creating custom quest generators:

```javascript
const questGenerators = {
  custom_quest_id: (quest) => {
    // Quest implementation
    setCurrentConcept({
      id: "your_concept",
      name: "Your Concept",
      knowledgeArea: "your_area",
    });
    setShowingAdaptiveExercise(true);
  },
};
```

## Firebase Integration

The components can save progress to Firebase Firestore for persistent learning progress:

1. Ensure Firebase is properly configured in `firebase.js`
2. Set `saveProgress={true}` on the components
3. Pass a valid `userId` from your authentication system

## Inspiration from Antura

These components are inspired by Antura's approach to educational gaming:

1. **Intrinsic Motivation** - Learning through play
2. **Scaffolded Progression** - Gradually increasing challenge
3. **Multiple Learning Paths** - Choice and autonomy
4. **Immediate Feedback** - Clear communication of progress
5. **Personalized Experience** - Adapting to individual needs
6. **Visual Progress** - Seeing advancement clearly
7. **Low-stakes Failure** - Multiple attempts with support

## Dependencies

- React
- Framer Motion (for animations)
- Firebase (for data persistence)
- KaTeX (for math expressions)

## Further Development

Areas for future enhancement:

- More exercise types and knowledge areas
- Enhanced analytics and reporting
- Teacher dashboard for monitoring progress
- Additional gamification elements
- Expanded quest storylines
