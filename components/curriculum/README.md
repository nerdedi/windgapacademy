# Curriculum Builder Enhanced Component

This component provides an enhanced curriculum building experience with 3D character animations, AI-assisted content generation, and accessibility features.

## Overview

The `CurriculumBuilderEnhanced` component allows educators to create curriculum modules for various subjects including Life Skills, Employment Skills, and Digital Literacy. It integrates with 3D character models that can present the curriculum content through animations.

## Features

- **Subject-Based Templates**: Pre-defined templates for different subject areas
- **Character Selection**: Choose from different instructor characters with unique traits
- **AI-Assisted Generation**: Generate curriculum content based on learning objectives
- **Accessibility Options**: Support for various accessibility features
- **3D Character Visualization**: Preview curriculum with animated characters
- **Module Management**: Create, save, and organize curriculum modules

## Dependencies

This component requires:

- React and React DOM
- TypeScript
- Unity Animation Bridge (for character animations)
- Curriculum AI service (for content generation)

## Usage

```jsx
import React from "react";
import CurriculumBuilderEnhanced from "./components/curriculum/CurriculumBuilderEnhanced";

function App() {
  return (
    <div className="app">
      <CurriculumBuilderEnhanced />
    </div>
  );
}
```

## Component Structure

The component is organized into several sections:

1. **Subject Selection**: Choose from Life Skills, Employment Skills, or Digital Literacy
2. **Template Selection**: Select from pre-defined templates or create a custom module
3. **Module Details**: Set title, learning objectives, duration, and difficulty
4. **Character Selection**: Choose an instructor character with specific traits
5. **Actions**: Generate module content and preview with character animations
6. **Content Display**: View and edit generated curriculum content

## State Management

The component uses several custom hooks for state management:

- `useCharacterState`: Manages selected character
- `useAnimationState`: Controls character animations
- `useModuleState`: Handles module generation and content
- `useProgressState`: Tracks student progress (future implementation)

## Future Enhancements

- **Voice Narration**: Add text-to-speech capabilities for accessibility
- **Export Options**: Support for exporting to PDF, DOCX, and HTML
- **Collaboration Features**: Allow multiple educators to work on curriculum
- **Student Progress Tracking**: Monitor student progress through modules
- **Interactive Exercises**: Integrate interactive elements into curriculum

## Known Issues

- Chakra UI components are currently replaced with basic HTML elements
- 3D model viewer is not fully integrated and shows placeholder
- Test coverage is limited

## Integration with Unity

The component integrates with Unity via the `UnityAnimationBridge`, which provides:

- Connection to Unity WebGL for character animations
- Animation queueing and state management
- Performance monitoring
- Error handling for animation issues

## Contributing

When making changes to this component, please ensure:

1. TypeScript types are properly defined
2. Accessibility features are maintained
3. Tests are updated to cover new functionality
4. Documentation is updated to reflect changes

## License

This component is part of the Windgap Academy platform and is subject to its licensing terms.
