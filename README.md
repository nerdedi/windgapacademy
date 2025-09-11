# Windgap Academy

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=windgapacademy)

Inclusive, ad-free, educator-reviewed learning platform for neurodivergent learners aged 16+. Meets Australian NDIS standards and prioritizes accessibility, privacy, and educational best practices.

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
```

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
```

2. Re-run the test suite:

```bash
npm test
```

CI (GitHub Actions) runs `npm ci` which installs devDependencies and runs the full test suite, so opening a PR will validate the JSX tests automatically.

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
