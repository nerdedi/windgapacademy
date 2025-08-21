# GameModules README

This folder contains modular game logic for Windgap Academy's skill-building platform. Each file implements a self-contained game module focused on a specific skill domain (e.g., Employability, Communication, Life Skills).

## Structure

- Each module exports a main function to render the game UI and handle logic.
- Progress tracking is handled via localStorage and/or Firebase integration.
- Accessibility features (ARIA labels, keyboard navigation) are included in each module.

## Modules

- `EmployabilityGame.js`: Practice job skills and interview scenarios.
- `CommunicationGame.js`: Build communication and social skills.
- `LifeSkillsGame.js`: Practice daily living and independence skills.
- `DigitalSkillsGame.js`, `LiteracyGame.js`, `MoneySkillsGame.js`, `NumeracyGame.js`: Additional skill domains.

## Usage

Import and call the main function for each module, passing a container element and optional user data:

```js
import { showEmployabilityGame } from "./EmployabilityGame.js";
showEmployabilityGame(document.getElementById("game-container"), userData);
```

## Extending

- Add new modules by following the same export and structure pattern.
- Document all exported functions with JSDoc comments.
- Ensure accessibility and progress tracking are included.

## Testing

- Unit tests should be added for all logic and UI components.
- Use Jest for test coverage.

## Accessibility

- All modules should support keyboard navigation and ARIA labeling.

## Contribution

- Follow ESLint/Prettier code style.
- Add JSDoc comments for all functions.
- Expand documentation as new features are added.
