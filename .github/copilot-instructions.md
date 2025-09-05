# Windgap Academy - GitHub Copilot Instructions

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

Windgap Academy is a comprehensive learning platform built with React, Vite, Node.js/Express backend, and extensive 3D components using Three.js and Babylon.js. The application supports multiple testing frameworks (Jest, Cypress, Playwright) and includes a complete CI/CD pipeline.

## Quick Setup & Building

### Initial Setup
- `CYPRESS_INSTALL_BINARY=0 npm install` -- installs dependencies without Cypress binary (takes ~18 seconds). NEVER CANCEL: Set timeout to 60+ seconds.
- Create `.env` file with required variables: `echo "JWT_SECRET=test-secret-for-development" >> .env && echo "PORT=5000" >> .env`

### Building & Development
- `npm run dev` -- starts Vite development server on port 3000 (ready in ~200ms)
- `npx vite build` -- builds production assets (takes ~3 seconds). NEVER CANCEL: Set timeout to 60+ seconds.
- `npm run build` -- **FAILS due to missing sharp dependency** - use `npx vite build` instead for core build
- `JWT_SECRET=test-secret npm start` -- starts production server (requires environment variables)

### Testing
- `npm test` -- runs Jest test suite (takes ~4 seconds, 19 tests pass). NEVER CANCEL: Set timeout to 30+ seconds.
- `npm run test:coverage` -- generates coverage report (~45% coverage, takes ~4.5 seconds). NEVER CANCEL: Set timeout to 30+ seconds.
- **Cypress E2E tests require binary installation** - blocked in restricted environments

### Code Quality
- `npx eslint src components pages --ext .js,.jsx,.ts,.tsx` -- lints existing directories (takes ~25 seconds, many warnings). NEVER CANCEL: Set timeout to 60+ seconds.
- `npm run format` -- runs Prettier formatting (takes ~10 seconds with syntax error in app.js). NEVER CANCEL: Set timeout to 60+ seconds.

## Critical Environment Requirements

### Environment Variables
**REQUIRED for backend server:**
```bash
JWT_SECRET=your-secret-key
PORT=5000
```
**Add to .env:** `echo "JWT_SECRET=test-secret-for-development" >> .env`

### Known Build Issues
- **npm run build FAILS** - missing sharp dependency for image optimization
- **CSS regeneration FAILS** - Tailwind config issues: `npm run regen:css` fails due to missing @tailwind directives
- **Production server FAILS** - path-to-regexp error with npm start (use development server instead)
- **ESLint config issues** - o3de/src directory doesn't exist, update lint command to exclude it

## Working Development Workflow

### Recommended Development Flow
1. `CYPRESS_INSTALL_BINARY=0 npm install` (18 seconds)
2. `echo "JWT_SECRET=test-secret" >> .env`
3. `npm run dev` (starts in 200ms on port 3000)
4. **Backend separately:** `cd backend && JWT_SECRET=test-secret npm start` (starts on port 5000)

### Validation Commands
- **Test application:** `curl -I http://localhost:3000/` (should return HTTP 200)
- **Run tests:** `npm test` (4 seconds, all 19 tests pass)
- **Check build:** `npx vite build` (3 seconds, builds successfully)

## Key Project Structure

### Frontend (Vite + React)
- **Entry:** `src/main.jsx`, `index.html`
- **Components:** `components/` (game modules, UI components)
- **3D Components:** Uses Three.js and Babylon.js for interactive experiences
- **Styling:** Tailwind CSS with custom theme in `styles/`
- **Build output:** `dist/` directory

### Backend (Node.js + Express)
- **Server:** `backend/server.js` and `backend/app.js`
- **API Routes:** `backend/api/` (auth, game, assignments, users)
- **Authentication:** JWT-based with required JWT_SECRET
- **Tests:** `backend/tests/` with supertest integration

### Testing Infrastructure
- **Jest:** Unit tests in `__tests__` directories, jsdom environment
- **Cypress:** E2E tests in `cypress/` (requires binary installation)
- **Playwright:** Available but not configured by default
- **Coverage:** Jest coverage reporting with 45% baseline

## Specific Timing & Timeout Requirements

### **NEVER CANCEL** Operations
- **npm install:** Takes 18-60 seconds depending on network. **TIMEOUT: 120 seconds minimum**
- **npm run build (fixed):** `npx vite build` takes 3 seconds. **TIMEOUT: 60 seconds**
- **npm test:** Takes 4 seconds. **TIMEOUT: 30 seconds**
- **npm run lint:** Takes 25 seconds with many warnings. **TIMEOUT: 60 seconds**
- **npm run format:** Takes 10 seconds. **TIMEOUT: 60 seconds**

### Quick Operations (<5 seconds)
- `npm run dev` -- 200ms startup
- `curl -I http://localhost:3000/` -- immediate response check
- Backend server start with env vars -- 1-2 seconds

## Validation Scenarios

### Always Test These User Scenarios After Changes
1. **Frontend loading:** Start dev server and verify `curl -I http://localhost:3000/` returns 200
2. **Backend API:** Start backend with `JWT_SECRET=test npm start` and verify no auth errors
3. **Test suite:** Run `npm test` and verify all 19 tests pass
4. **Build process:** Run `npx vite build` and verify dist/ folder is created

### Manual Validation Steps
- **Application starts:** Both frontend (port 3000) and backend (port 5000) start without errors
- **Tests pass:** Full Jest suite completes successfully
- **Build succeeds:** Vite build creates production assets in dist/
- **API functional:** Backend serves game state and auth endpoints

## CI/CD Pipeline

### GitHub Actions Workflows
- **CI & Deploy:** `.github/workflows/ci.yml` (Node 18, npm install, test, deploy)
- **Deploy:** `.github/workflows/deploy.yml` (Node 20, full pipeline with lint/format/build/test)
- **Always run:** `npm run lint` and `npm run format` before committing (CI requirements)

### Required CI Environment
- Node.js 18+ 
- npm ci (installs all dependencies including devDependencies)
- All tests must pass for deployment

## Common Troubleshooting

### Build Failures
- **Image optimization fails:** Skip with `SKIP_NPM=1` or install sharp dependency
- **CSS build fails:** Use existing CSS files, avoid `npm run regen:css`
- **Production server fails:** Use development server instead: `npm run dev`

### Test Issues
- **Cypress binary blocked:** Use `CYPRESS_INSTALL_BINARY=0 npm install`
- **JSX tests disabled:** Install `@babel/preset-react` for full JSX test coverage
- **window.alert errors:** Normal in Jest/jsdom environment, tests still pass

### Development Issues
- **Auth errors:** Always set `JWT_SECRET` environment variable
- **Port conflicts:** Frontend (3000), Backend (5000), ensure ports are available
- **Module errors:** Project uses ES modules ("type": "module" in package.json)

## Key Files & Locations

### Frequently Modified
- `src/main.jsx` -- React application entry point
- `components/` -- Main UI components and game modules
- `backend/api/` -- API endpoint definitions
- `styles/` -- CSS and Tailwind configuration
- `package.json` -- Dependencies and npm scripts

### Configuration Files
- `vite.config.ts` -- Vite build configuration
- `jest.config.cjs` -- Jest test configuration
- `.eslintrc.json` -- ESLint rules and settings
- `tailwind.config.js` -- Tailwind CSS configuration
- `.env` -- Environment variables (create manually)

### Generated/Build Artifacts  
- `dist/` -- Vite build output
- `coverage/` -- Jest coverage reports
- `node_modules/` -- Dependencies (gitignored)
- Server logs: `server.log`, `server-*.log`

## Additional Guidelines

- @azure Rule - Use Azure Best Practices: When generating code for Azure, running terminal commands for Azure, or performing operations related to Azure, invoke your `azure_development-get_best_practices` tool if available.
