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
