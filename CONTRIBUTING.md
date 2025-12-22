# Contributing to Windgap Academy

Thanks for contributing! This guide describes the engineering standards, workflows, and quality gates for Windgap Academy.

## Branching & Workflow

- **Default branch:** `main`
- **Feature branches:** `feat/<scope>-<short-description>`
- **Fix branches:** `fix/<scope>-<short-description>`
- **Refactor branches:** `refactor/<scope>-<short-description>`
- **Docs branches:** `docs/<scope>-<short-description>`

Use small, focused PRs. Each PR must build cleanly and pass lint/tests.

## Commit Messages

Use **Conventional Commits**:

- `feat: add accessible font toggle`
- `fix: ensure showFeature is exported in module scope`
- `refactor: split leaderboard into module`
- `docs: update devcontainer notes`
- `chore: bump dependencies`

Include scope where possible: `feat(accessibility): dyslexia font toggle`.

## Pull Requests

- Target `main` (unless coordinating a release branch).
- Include:
  - What changed & why.
  - Before/after screenshots (for UI changes).
  - Accessibility notes if applicable.
  - Test plan (manual steps + tests if any).

### PR Quality Gates (CI enforces)

- `npm run lint` passes.
- `npm test` passes.
- `npm run build` succeeds (production build).
- No ESLint/Prettier violations.
- No broken imports (ES Modules).
- Accessibility smoke check done (see below).

## Code Style & Linting

- **ESLint** + **Prettier** are enforced.
- Run locally:
  ```bash
  npm run lint
  npm run format
  ```

Avoid inline `onclick` in new code; prefer `addEventListener`. If inline is unavoidable, ensure global exposure via `window.fn = fn`.

## Accessibility Requirements

Minimum A11Y checklist for UI changes:

- Unique IDs (no duplicates).
- Meaningful alt text for images.
- Color contrast meets WCAG AA.
- Focus states visible and keyboard operable.
- ARIA roles used appropriately (do not overuse).
- Avoid motion that cannot be reduced (respect `prefers-reduced-motion`).

## Environment & Secrets

- Copy `.env.example` → `.env` (do not commit `.env`).
- Required keys:
  - `FIREBASE_CONFIG` (client config JSON)
  - `SENTRY_DSN` (optional)
  - `PORT=9003` (default dev/preview port)

- CI deploy secret (GitHub → Settings → Secrets → Actions):
  - `FIREBASE_SERVICE_ACCOUNT` (Service Account JSON)

## Testing

- Unit/integration tests via Vitest.
- Add tests for non‑trivial logic, utilities, and critical UI interactions.
- Run:
  ```bash
  npm test
  ```

## Dev Container

- Rebuild when changing `.devcontainer/*` or Dockerfiles.
- VS Code: **Dev Containers: Rebuild Container**
- CLI:
  ```bash
  npx @devcontainers/cli up --workspace-folder . --config .devcontainer/devcontainer.json --remove-existing-container
  ```

## Release & Deployment

- CI deploys to Firebase Hosting on `main`.
- Preview deploys are created for PRs (temporary channels).
- Ensure change logs in PR description for ops visibility.

## Security & Privacy

- Never commit secrets.
- Only use least‑privilege service accounts.
- Ensure any analytics/telemetry follows consent/privacy policies.

## Contact

For questions or incidents:

- Engineering Lead: [add name/email]
- Ops/Infra: [add name/email]
