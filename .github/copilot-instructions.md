# Windgap Academy - Copilot Instructions

## Project Architecture

- **Frontend**: React 18 with Vite, using Framer Motion for animations and Three.js/React Three Fiber for 3D rendering.
- **Backend**: Firebase for authentication, Firestore for data storage.
- **Styling**: Tailwind CSS with custom components.
- **Special Features**: WebGL effects, character animations, Unity integration.

## Key Patterns & Conventions

- **Component Organization**: Use the pre-defined component structure in `src/components/`.
- **Animation System**: Utilize `MicroInteractions.jsx` for consistent animations across the platform.
- **Path Aliases**: Use the path aliases defined in `vite.config.js` (e.g., `@components`, `@utils`).
- **Firebase Integration**: Access Firebase services through the exported functions in `firebase.js`.
- **3D Rendering**: Use `CharacterAnimator.js` for character animations and `WebGLEffects.js` for visual effects.

## Development Workflow

- **Local Development**: `npm run dev` (runs Vite dev server on port 3000)
- **Production Build**: `npm run build` (outputs to `dist/`)
- **Testing**:
  - Unit/Integration: `npm test` (Jest)
  - E2E: `npm run e2e` (Playwright) or `npx cypress run` (Cypress)
- **Linting**: `npm run lint` (ESLint)
- **Formatting**: `npm run format` (Prettier)

## Security & Compliance

- **Environment Variables**: Use `.env` for secrets, following `.env.example` pattern.
- **Never Commit Secrets**: Firebase keys should never be hardcoded.
- **Authentication**: Use the Firebase auth methods in `firebase.js`.
- **Accessibility**: Consider accessibility in all UI components.

## AI Code Attribution

- Add attribution comments for AI-generated code:
  ```js
  // Portions of this file were generated with the assistance of Anthropic Claude (https://www.anthropic.com/)
  ```
- All AI-generated code must be reviewed for:
  - Security issues
  - Performance concerns
  - License compatibility
  - Project style/architectural alignment

## Integration Points

- **Unity Integration**: See `unity-integration/` directory for Unity WebGL integration.
- **Firebase**: See `firebase.js` for Firestore and Authentication methods.
- **WebGL Effects**: Use `WebGLEffects.js` for particle systems, ripple effects, and glow highlights.

## Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
npm run e2e

# Docker development
npm run docker:dev

# Optimize assets
npm run optimize:images
```

- @azure Rule - Use Azure Best Practices: When generating code for Azure, running terminal commands for Azure, or performing operations related to Azure, invoke your `azure_development-get_best_practices` tool if available.
