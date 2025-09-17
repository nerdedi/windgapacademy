# Windgap Academy

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=windgapacademy)

Inclusive, ad-free, educator-reviewed learning platform for neurodivergent learners aged 16+. Meets Australian NDIS standards and prioritizes accessibility, privacy, and educational best practices.

## Documentation

- 3D LMS Library Recommendations: `docs/3d-lms-library-recommendations.md`
- Integration Guide: `docs/integration-guide.md`
- Implementation Examples: `docs/implementation-examples.js`
- Architecture Wireframes (R3F component): `docs/architecture-wireframes.jsx`
- Docs Overview: `docs/README.md`

## Development Best Practices

- Modularize code by feature (see `src/app/`)
- Use TypeScript for type safety
- Run tests with Jest, Playwright, or Cypress
- Enforce code style with ESLint and Prettier
- Use robust error handling and accessibility features
- Optimize performance and security
- See `.github/workflows/ci.yml` for CI/CD setup

## Setup & Getting Started

1. Install dependencies: `npm install`

npx minify styles/windgap-academy.css > styles/windgap-academy.min.css && \

```bash
npm run build:css
```

Update your HTML and build config to reference the `.min.css` files for production.

````

## Security

- Helmet for HTTP headers (see `server.cjs`)
- Sanitize all user input
- Regularly update dependencies

## Secrets & Rotation

- Do NOT commit API keys or other secrets to the repository. The project now reads Firebase configuration from environment variables (see `.env.example`).
- If a secret was accidentally committed (for example the Firebase API key previously in `src/env.js`), rotate it immediately:
	1. Go to the Firebase Console -> Project Settings -> General -> Your apps and revoke/regenerate the exposed API key and any service account credentials.
 2. Update your CI/CD provider's secret store (GitHub Actions secrets, Vercel/environment variables, etc.) with the new values.
 3. Update any deployed instances with the new environment variables and redeploy.
 4. Remove the old key from any external services where it may have been used.
 5. Optionally, review logs for suspicious activity during the window the key was exposed.

Local development:

1. Copy `.env.example` to `.env` and fill in the values.
2. Do NOT commit your `.env` file; it is ignored by `.gitignore`.

If you'd like, I can (a) rotate the key for you if you grant access to the Firebase console, or (b) produce a short PR that replaces the committed key and updates instructions — tell me which.

## Accessibility

- See `scripts/i18n-setup.js` for scaffolding

## Backup & Recovery

- See `scripts/backup.sh` for template

## Analytics

- Google Analytics integrated in `index.html`

## Feedback

- Use the built-in feedback form in the app
- Fill in `.env` with your secrets
- Inject env and optimize images: `npm run prebuild`
- Build: `npm run build`
- Start server: `npm start`

## Testing
- Run unit tests: `npm test`
- Run e2e tests: `npx cypress run`

### Enabling JSX tests locally

Some developer environments (CI) install `@babel/preset-react` to transform JSX in Jest. This repo's Babel config will only load `@babel/preset-react` when it's installed locally. If your local environment blocks package installs (for example in restricted containers), the preset will be skipped and JSX-heavy component tests will be disabled.

To enable full JSX tests locally:

1. Install dev dependencies locally:

```bash
npm install --save-dev @babel/preset-react
````

2. Re-run the test suite:

```bash
npm test
```

CI (GitHub Actions) runs `npm ci` which installs devDependencies and runs the full test suite, so opening a PR will validate the JSX tests automatically.

## WebGL Effects & Character Animation

The Windgap Academy platform includes WebGL-based visual effects and character animation to enhance the learning experience for neurodivergent learners.

### WebGL Effects

The `WebGLEffects` utility (`src/utils/WebGLEffects.js`) provides several visual effects:

- **Particle Systems**: Create engaging visual feedback with customizable particle effects
- **Water Ripple Effects**: Interactive ripple animations for emphasis and visual cues
- **Glow Highlights**: Draw attention to important UI elements with customizable glowing effects

Demo: Open the [WebGL Effects Demo](webgl-effects-demo.html) to see these effects in action.

Usage example:

```javascript
import WebGLEffects from "./src/utils/WebGLEffects.js";

// Create a particle effect
const particles = WebGLEffects.initParticleSystem("container-id", {
  particleCount: 200,
  particleSize: 0.1,
  particleColors: [0xff9933, 0x66cc66, 0x6699ff],
  speed: 0.01,
  turbulence: 0.05,
  spread: 100,
  animationDuration: 3,
});

// Clean up when done
particles.cleanup();
```

### Character Animation

The `CharacterAnimator` utility (`src/utils/CharacterAnimator.js`) provides a system for loading and animating 3D character models:

- Loads and displays GLTF/GLB 3D models
- Handles animation playback and blending
- Supports camera controls and scene customization
- Provides helper methods for common operations

Demo: Open the [Character Animation Demo](character-animation-demo.html) to see character animation with WebGL effects.

Usage example:

```javascript
import CharacterAnimator from "./src/utils/CharacterAnimator.js";

// Initialize a character
const character = new CharacterAnimator({
  characterPath: "/assets/characters/windgap/winnie.glb",
  containerSelector: "#character-container",
  autoRotate: true,
});

// Play animations
character.playAnimation("wave", {
  loop: THREE.LoopRepeat,
  crossfadeDuration: 0.3,
});

// Clean up when done
character.dispose();
```

## Deployment

- Use HTTPS
- Set environment variables securely
- Use `server.cjs` for Node.js hosting

## CI/CD

- See `.github/workflows/deploy.yml` for automated pipeline

## Monitoring & Logging

- Sentry for frontend error tracking (see `index.html`)
- Server logs and alerts recommended

## Performance Optimization

# Production CSS Optimization

For optimal performance, use the minified CSS files in production:

// trigger redeploy

## Automated Minification

// another redeploy trigger

Minification is automated using the following script:

```bash
npx minify styles/windgap-academy.css > styles/windgap-academy.min.css && \
## Security
- Helmet for HTTP headers (see `server.cjs`)
- Sanitize all user input
- Regularly update dependencies

```

You can add this as a build step in your deployment pipeline or as an npm script:

```json
"scripts": {
	"build:css": "npx minify styles/windgap-academy.css > styles/windgap-academy.min.css && npx minify styles/output.css > styles/output.min.css && npx minify styles/tailwind-theme.css > styles/tailwind-theme.min.css && npx minify styles/tailwind.css > styles/tailwind.min.css && npx minify styles/advanced.css > styles/advanced.min.css && npx minify styles/refinements.css > styles/refinements.min.css"
}
```

Run with:

```bash
npm run build:css
```

Update your HTML and build config to reference the `.min.css` files for production.

## Accessibility

- See `scripts/i18n-setup.js` for scaffolding

## Backup & Recovery

- See `scripts/backup.sh` for template

## Analytics

- Google Analytics integrated in `index.html`

## Feedback

- Use the built-in feedback form in the app
