# Math Exercises Implementation

This directory contains the implementation of math exercise components for Windgap Academy, inspired by Khan Academy's interactive exercise format.

## Component Structure

### Base Component

- `Exercise.jsx` - The base component that provides common functionality for all exercises:
  - Accessibility features
  - Analytics tracking
  - Progress tracking
  - Difficulty adjustment
  - Visual and interactive supports

### Exercise Types

1. `AdditionWithinFive.jsx` - Simple addition exercises for numbers 1-5
2. `SubtractionWithinTen.jsx` - Subtraction exercises for numbers within 10
3. `BasicMultiplication.jsx` - Multiplication exercises with visual grid support

## Features

- **Adaptive Difficulty**: Exercises adjust difficulty based on learner performance
- **Visual Supports**: Visual representations to aid understanding
- **Step-by-Step Hints**: Progressive hints to guide learners
- **Accessibility**: Works with Windgap's accessibility settings
- **Analytics**: Tracks progress, completion time, and difficulty levels

## Integration

Exercises are integrated into the Windgap Academy platform through:

- The Math Exercises Page at `/exercises/math`
- Access from the student dashboard
- Integration with the analytics system

## Usage

To use an exercise component:

```jsx
import { AdditionWithinFive } from "../components/exercises";

function MyComponent() {
  const handleComplete = (result) => {
    console.log(`Exercise completed with ${result.attempts} attempts`);
  };

  return <AdditionWithinFive onComplete={handleComplete} />;
}
```

## Adding New Exercises

To add a new exercise:

1. Create a new component in the `exercises` directory
2. Extend the base `Exercise` component
3. Implement required methods: `generateProblem`, `checkAnswer`, and `renderProblem`
4. Add the component to `index.js` with proper metadata
5. Add testing for the component

## Analytics Events

Exercises emit the following analytics events:

- `exercise_start` - When an exercise is started
- `exercise_hint_used` - When a hint is requested
- `exercise_attempt` - When an answer is submitted
- `exercise_complete` - When an exercise is completed

These events include data such as:

- `exerciseId` - ID of the exercise
- `attempts` - Number of attempts made
- `timeTaken` - Time taken to complete
- `difficulty` - Difficulty level
- `correctAnswer` - Whether the answer was correct (for attempts)
