# Windgap Academy Developer Instructions

**ALWAYS follow these instructions first and only fallback to additional search and context gathering if the information here is incomplete or found to be in error.**

Windgap Academy is a React/TypeScript web application built with Vite, featuring educational games and accessibility tools for neurodivergent learners. The app includes a Node.js backend, Firebase integration, and comprehensive testing with Jest, Cypress, and Playwright.

## Quick Start & Validation

### Essential Setup Commands
**ALWAYS run these commands in exact order for a fresh clone:**

```bash
# 1. Install dependencies - NEVER CANCEL: Takes 20-30 seconds
npm install
# NOTE: Cypress install may fail due to network restrictions - this is expected

# 2. Core build test - NEVER CANCEL: Takes 3-5 seconds
npx vite build

# 3. Run tests - NEVER CANCEL: Takes 5-10 seconds  
npm test

# 4. Start development server - NEVER CANCEL: Takes 1-3 seconds
npm run dev
# Server will be available at http://localhost:3000
```

### Critical Timing Information
- **npm install**: 20-30 seconds. NEVER CANCEL. Set timeout to 60+ minutes for safety.
- **Build (vite build)**: 3-5 seconds. NEVER CANCEL. Set timeout to 30+ minutes for safety.  
- **Tests (npm test)**: 5-10 seconds. NEVER CANCEL. Set timeout to 30+ minutes for safety.
- **Dev server**: 1-3 seconds to start. NEVER CANCEL during startup.
- **Linting**: 25-30 seconds. NEVER CANCEL. Set timeout to 30+ minutes.

## Working Commands (Validated)

### Development
```bash
# Start development server (fast startup ~200ms)
npm run dev
# Serves on http://localhost:3000

# Core build (production bundle) 
npx vite build
# Output in dist/ directory

# Run all tests (19 tests, all pass)
npm test

# Static file server for testing build
python3 -m http.server 8000 --directory dist
# Serves on http://localhost:8000
```

### Code Quality  
```bash
# Lint (with working paths) - takes 25-30 seconds
npx eslint src components pages --ext .js,.jsx,.ts,.tsx

# Format code
npm run format
```

### Advanced Testing
```bash
# Run tests with coverage
npm run test:coverage

# Run CI test suite  
npm run test:ci

# Install Playwright browsers (if needed)
npm run install:playwright-browsers
```

## Commands That Need Workarounds

### Full Build (has prebuild issues)
**DO NOT USE** `npm run build` - it fails due to ES module conflicts in optimize-images.js

**WORKAROUND**: Use core build instead:
```bash
npx vite build
```

### Linting (config issues)
**DO NOT USE** `npm run lint` - it fails due to missing o3de/src directory

**WORKAROUND**: Use corrected paths:
```bash
npx eslint src components pages --ext .js,.jsx,.ts,.tsx
```

### Production Server (dependency issues)  
**DO NOT USE** `npm start` - it fails due to path-to-regexp dependency conflicts

**WORKAROUND**: Use static server:
```bash
npx vite build
python3 -m http.server 8000 --directory dist
```

## Validation Scenarios

### Essential Manual Testing
**ALWAYS run these validation steps after making changes:**

1. **Basic functionality test:**
   ```bash
   npm run dev
   # Visit http://localhost:3000
   # Verify homepage loads with Windgap Academy branding
   # Check for JavaScript errors in browser console
   ```

2. **Build validation:**
   ```bash
   npx vite build
   python3 -m http.server 8000 --directory dist
   # Visit http://localhost:8000  
   # Verify static site works identically to dev server
   ```

3. **Test suite validation:**
   ```bash
   npm test
   # All 19 tests must pass
   # Check for new test failures that indicate regressions
   ```

### User Flow Testing
**Test these key scenarios when making UI changes:**

- **Navigation**: Click between Home, Sign In, Accessibility, Support sections
- **Games**: Access Winnie's Words game, Avatar Builder, Math Quest
- **Accessibility**: Test font size controls, dyslexia font toggle, easy read mode
- **Mobile**: Verify responsive design on mobile viewports

## Repository Structure

### Key Directories
```
src/
├── app/           # Main application logic
├── components/    # React components  
├── contexts/      # React contexts (auth, lessons, etc.)
├── pages/         # Page components
├── types/         # TypeScript definitions
└── utils/         # Utility functions

components/        # Legacy component files
├── GameModules/   # Educational game components
├── __tests__/     # Component tests
└── AvatarBuilder.js, Dashboard.js, etc.

backend/          # Express.js API server
├── api/          # API route handlers  
├── tests/        # Backend tests
└── utils/        # Server utilities

.devcontainer/    # VSCode dev container config
.github/          # GitHub Actions workflows
cypress/          # E2E test specs
scripts/          # Build and utility scripts
styles/           # CSS and Tailwind styles
```

### Important Files
- `package.json` - Dependencies and npm scripts
- `vite.config.ts` - Build configuration
- `jest.config.cjs` - Test configuration  
- `server.cjs` - Production server (has issues)
- `index.html` - Main HTML template
- `firebase.js` - Firebase configuration

## CI/CD Pipeline

### GitHub Actions Workflows
The repository has these workflows in `.github/workflows/`:

- `ci.yml` - Main CI pipeline (Node 18, runs tests, deploys to Firebase)
- `deploy.yml` - Deployment pipeline (Node 20, runs lint/format/test/build)
- `nodejs-test.yml` - Node.js testing
- `submodule-setup.yml` - Git submodule handling

### CI Commands (validated to work)
```bash
npm ci              # Clean install for CI
npm run lint        # Will fail - use workaround
npm run format      # Code formatting
npm test            # Test suite
npm run test:coverage # Test coverage
npx vite build      # Core build
```

## Troubleshooting

### Common Issues

**Cypress install failures:**
- Expected due to network restrictions
- Set `CYPRESS_INSTALL_BINARY=0` during npm install
- E2E tests can still run with existing Cypress installation

**ES Module errors in scripts:**
- Several scripts in `scripts/` directory have CommonJS/ES module conflicts
- Use direct commands instead of npm scripts when encountering these errors

**Linting errors:**
- Many "unused variable" warnings are expected (legacy code cleanup in progress)
- Focus on actual errors rather than warnings during development

**Build output:**
- Vite build outputs to `dist/` directory
- Build includes code splitting for vendor libraries and Three.js
- Static assets are correctly processed and bundled

### Performance Notes
- Build is extremely fast (~3 seconds) due to Vite
- Dev server hot reload is near-instantaneous  
- Test suite is well-optimized (4 seconds for 19 tests)
- Large vendor chunks (Three.js ~476KB) are properly split

## Development Best Practices

### Making Changes
1. **ALWAYS** run `npm test` before and after changes
2. **ALWAYS** run `npx vite build` to verify build doesn't break
3. **ALWAYS** test in both dev server (`npm run dev`) and static build
4. Use the working linting command: `npx eslint src components pages --ext .js,.jsx,.ts,.tsx`

### Testing Strategy
- Unit tests with Jest (fast, reliable)
- E2E tests with Cypress/Playwright (may have network limitations)
- Manual testing required for UI changes
- Test coverage reports available via `npm run test:coverage`

### Code Style
- ESLint configuration is comprehensive but needs path fixes
- Prettier handles formatting (`npm run format`)
- TypeScript is used throughout new code
- Legacy JavaScript files are being gradually migrated

---

**Remember: NEVER CANCEL builds, tests, or long-running commands. Always set generous timeouts (60+ minutes for installs, 30+ minutes for builds/tests) to avoid interrupting processes that may appear to hang but are actually working.**

- @azure Rule - Use Azure Best Practices: When generating code for Azure, running terminal commands for Azure, or performing operations related to Azure, invoke your `azure_development-get_best_practices` tool if available.