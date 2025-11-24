# Playwright Test Container

This repository includes `Dockerfile.playwright`, an optional container image definition that uses the official Playwright base image (`mcr.microsoft.com/playwright`) so all browsers (Chromium, Firefox, WebKit) are present. This avoids the Alpine Linux missing dependencies issue encountered when running headless tests (`spawn ENOENT`).

## Why This Is Needed

The current dev container is Alpine-based, which lacks several glibc-linked libraries and shared dependencies required by Playwright's bundled browsers. As a result, attempts to launch Chromium headless fail. Using the Playwright base image provides a Debian/Ubuntu environment with all required dependencies preinstalled.

## Usage

### One-off Run (Local Docker)

```bash
# Build the image
docker build -f Dockerfile.playwright -t windgap-playwright .

# Run tests
docker run --rm -it windgap-playwright
```

### Override Dev Container (VS Code Dev Containers)

Update your `.devcontainer/devcontainer.json` to reference `Dockerfile.playwright` instead of the default Dockerfile when you need full browser automation.

### CI Integration (GitHub Actions Example)

```yaml
jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Playwright image
        run: docker build -f Dockerfile.playwright -t windgap-playwright .
      - name: Run tests
        run: docker run --rm windgap-playwright
```

## MCP Server + Playwright

Once using this image, the `npx @playwright/mcp --config ./playwright-mcp.config.json` command will have functioning browsers. Claude Desktop or any MCP client can then invoke Playwright tools without the spawn errors previously seen.

## Security & Secrets

Do NOT bake secrets into the image. Mount a `.env` file or inject environment variables at `docker run` time:

```bash
docker run --rm -e FIREBASE_API_KEY=$FIREBASE_API_KEY windgap-playwright
```

## Next Steps

- (Optional) Add a `dev` CMD to start Vite: `CMD ["npm", "run", "dev"]`
- Integrate accessibility & performance audits via Playwright traces + Lighthouse.
- Add a GitHub Actions workflow file (`.github/workflows/e2e.yml`).

---

Generated with assistance of AI; reviewed for security & licensing compliance.
