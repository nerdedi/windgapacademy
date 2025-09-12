Windgap Academy Dev Container
=============================

This devcontainer builds from the project `Dockerfile` and runs `.devcontainer/post-create.sh` after creation.

Environment
-----------
Copy `.env.example` to `.env` and fill in the required secrets (do NOT commit `.env`).

CI / Deployment
----------------
The GitHub Actions workflow will run tests and (on `main`) deploy to Firebase Hosting. Add `FIREBASE_SERVICE_ACCOUNT` as a secret in your repository settings.
Dev Container quick guide

This repository includes a devcontainer configuration to run Windgap Academy in a reproducible environment.

When to rebuild
- After changes to `.devcontainer/devcontainer.json`, Dockerfiles, or feature definitions.

Rebuild steps (VS Code / Codespaces)
1. Open the Command Palette (Ctrl/Cmd+Shift+P).
2. Run "Dev Containers: Rebuild Container" (or in Codespaces use the UI "Rebuild Container").

Rebuild steps (CLI)
- If you have the Dev Containers CLI installed on your machine:

  npx @devcontainers/cli up --workspace-folder /path/to/windgapacademy --config .devcontainer/devcontainer.json --remove-existing-container

Common post-rebuild tasks
- The devcontainer runs `.devcontainer/post-create.sh` to install dependencies and build the site.
- If you need to skip network installs for a quick test, set `SKIP_NPM=1`:

  SKIP_NPM=1 bash .devcontainer/post-create.sh

Forwarding and previewing the app
- The app server listens on port 9003 by default.
- In Codespaces or the Dev Containers Ports view, forward port 9003 and set the visibility to "Public" so you can open it in your browser.
- Quick verification inside the container:

  # start the server (if not already running)
  npm start

  # smoke-test (from inside the container)
  curl -I http://localhost:9003/

Troubleshooting
- Error: "unable to find user vscode" — remove any hard-coded `remoteUser` from `devcontainer.json` or use an image that contains the `vscode` user. This repo already avoids forcing `remoteUser`.
- Docker missing / cannot rebuild locally — rebuild via the Codespaces web UI or install Docker and the Dev Containers CLI locally.
- If post-create fails during `npm install`, check `/home/vscode/.npm/_logs` for the npm debug logs.

If you want, I can also:
- Tail the Codespaces creation log during a rebuild and fix any errors I find.
- Run tests or linting inside the container.

Note on the Dockerfile change
- This devcontainer now builds from `.devcontainer/Dockerfile` which ensures a `vscode` user exists and installs Node 18.
- That prevents transient "unable to find user vscode" failures when Codespaces briefly tries an alternate image that doesn't contain the user.

Quick rebuild (recommended): use Command Palette -> "Dev Containers: Rebuild Container" or the Codespaces "Rebuild Container" action.
