# Windgap Academy

## Overview

Windgap Academy is an inclusive, ad-free, educator-reviewed learning platform for neurodivergent learners aged 16+. The platform is designed to meet Australian NDIS standards and prioritizes accessibility, privacy, and educational best practices.

## Accessibility & Compliance

- All features are designed for accessibility (ARIA, dyslexia-friendly fonts, easy-read modes, narration, keyboard navigation).
- Privacy is enforced: all user actions are private and educator-reviewed.
- Compliant with Australian eSafety, NDIS, and age-appropriate guidelines.
- No advertising, tracking, or non-educational data collection.

## Key Features

- Modular dashboard, calm space, educator dashboard, and domain tabs
- Avatar builder, messaging, token system, and academy store
- Animated social stories and self-regulation prompts
- Educator logging and privacy notices throughout
- Accessible UI with font toggles, narration, and focus management


# Windgap Academy

## Setup
- Install dependencies: `npm install`
- Fill in `.env` with your secrets
- Inject env and optimize images: `npm run prebuild`
- Build: `npm run build`
- Start server: `npm start`

## Testing
- Run unit tests: `npm test`
- Run e2e tests: `npx cypress run`

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
- Code splitting and lazy loading enabled
- Asset compression via build tool
- Optimized images in `assets/images-optimized/`

## Security
- Helmet for HTTP headers (see `server.cjs`)
- Sanitize all user input
- Regularly update dependencies

## Accessibility
- ARIA labels, alt text, axe-core for audits (see `scripts/i18n-setup.js`)

## Internationalization
- See `scripts/i18n-setup.js` for scaffolding

## Backup & Recovery
- See `scripts/backup.sh` for template

## Analytics
- Google Analytics integrated in `index.html`

## Feedback
- Use the built-in feedback form in the app
