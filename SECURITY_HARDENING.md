# Security hardening added in this branch

This file documents the preventative controls added in `feature/auth-and-lms` to catch accidental secrets and to make rotation easier.

What was added
- `.pre-commit-config.yaml` — runs `detect-secrets` and basic hygiene hooks locally.
- `.github/workflows/pre-commit.yml` — runs `pre-commit` on pushes and PRs in CI.
- `scripts/generate_secrets_baseline.sh` — helper to generate the `.secrets.baseline` file used by `detect-secrets`.

Quick start (local)
```bash
# generate baseline (creates .secrets.baseline)
./scripts/generate_secrets_baseline.sh

# install pre-commit and install hooks
python3 -m pip install --user pre-commit detect-secrets
export PATH="$HOME/.local/bin:$PATH"
pre-commit install
pre-commit run --all-files
```

Notes
- If `pre-commit run --all-files` flags any matches, update the baseline intentionally with `detect-secrets` or remove the offending secret from the working tree.
- CI will run `pre-commit` and fail PRs that introduce new secrets that are not in `.secrets.baseline`.

If you want, I can now: (A) open a PR for the current branch including these files and attach the `tmp/` reports, or (B) re-run the non-destructive mirror purge preview and produce a tarball for review.
