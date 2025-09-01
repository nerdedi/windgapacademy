# Windgap Academy

## Development Best Practices

- Modularize code by feature (see `src/app/`)
- Use TypeScript for type safety
- Run tests with Jest, Playwright, or Cypress
- Enforce code style with ESLint and Prettier
- Use robust error handling and accessibility features
- Optimize performance and security
- See `.github/workflows/ci.yml` for CI/CD setup

## Getting Started

1. Install dependencies: `npm install`
2. Run linter: `npm run lint`
3. Run tests: `npm test`
4. Build: `npm run build`
5. Start: `npm start` or `npm run dev`

## Directory Structure

- `src/app/` — Modularized app logic
- `components/` — UI components
- `backend/` — API and server logic
- `public/` — Static assets

## Accessibility & Error Handling

- ARIA roles, keyboard navigation, narration
- Global error handlers and error boundaries

## CI/CD

Automated build, lint, and test on every push/PR via GitHub Actions.

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

# Production CSS Optimization

For optimal performance, use the minified CSS files in production:

- `styles/windgap-academy.min.css`
- `styles/output.min.css`
- `styles/tailwind-theme.min.css`
- `styles/tailwind.min.css`
- `styles/advanced.min.css`
- `styles/refinements.min.css`

## Automated Minification

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
