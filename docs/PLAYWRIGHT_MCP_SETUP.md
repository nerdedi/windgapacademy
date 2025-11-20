# Playwright MCP Server Setup

## Overview

The Playwright MCP (Model Context Protocol) server is installed and configured for automated browser testing and interaction with the Windgap Academy platform.

## Installation

✅ **Already Installed**: `@playwright/mcp` v0.0.47 (latest)

## Configuration

The Playwright MCP server is configured in `playwright-mcp.config.json` with the following settings:

- **Browser**: Chromium (headless mode)
- **Viewport**: 1280x720
- **Timeouts**: 10s for actions, 60s for navigation
- **Permissions**: Clipboard read/write enabled
- **Output Directory**: `./playwright-mcp-output`

## Usage with MCP Clients

### VS Code (recommended)

1. Install the MCP extension for VS Code (if not already installed)
2. Add this configuration to your VS Code settings:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest", "--config", "./playwright-mcp.config.json"]
    }
  }
}
```

**Quick Install**: [Install in VS Code](https://insiders.vscode.dev/redirect?url=vscode%3Amcp%2Finstall%3F%257B%2522name%2522%253A%2522playwright%2522%252C%2522command%2522%253A%2522npx%2522%252C%2522args%2522%253A%255B%2522%2540playwright%252Fmcp%2540latest%2522%255D%257D)

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--config",
        "/workspaces/windgapacademy/playwright-mcp.config.json"
      ]
    }
  }
}
```

### Cursor / Windsurf

Similar configuration in their respective settings files.

## Available Capabilities

The Playwright MCP server provides the following tools:

### Core Automation

- `playwright_navigate` - Navigate to URLs
- `playwright_click` - Click elements using accessibility tree
- `playwright_fill` - Fill form inputs
- `playwright_select` - Select from dropdowns
- `playwright_hover` - Hover over elements
- `playwright_screenshot` - Capture screenshots
- `playwright_evaluate` - Execute JavaScript in page context

### Tab Management

- `playwright_new_tab` - Create new browser tabs
- `playwright_switch_tab` - Switch between tabs
- `playwright_close_tab` - Close tabs

### Browser Installation

- `playwright_install_browsers` - Install Chromium/Firefox/WebKit

## Testing Windgap Academy

### Test Learning Modules

```typescript
// Example: Test the Literacy learning path
await page.goto("https://windgap-academy-e2c48.web.app");
await page.click('[data-testid="literacy-path"]');
await page.waitForSelector(".three-canvas"); // Wait for 3D content
```

### Test React Three Fiber Integration

```typescript
// Verify 3D rendering works without "Children" errors
await page.goto("https://windgap-academy-e2c48.web.app/modules/fraction-mastery");
const consoleErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") {
    consoleErrors.push(msg.text());
  }
});
await page.waitForTimeout(5000);
// Check for the previous "Cannot set properties of undefined (setting 'Children')" error
const hasChildrenError = consoleErrors.some((err) => err.includes("Children"));
console.log("Children error present:", hasChildrenError); // Should be false
```

### Verify Accessibility

```typescript
// Check ARIA labels and keyboard navigation
const accessibilityTree = await page.accessibility.snapshot();
console.log(JSON.stringify(accessibilityTree, null, 2));
```

## Running Standalone MCP Server

For development/debugging, run the MCP server standalone:

```bash
npx @playwright/mcp@latest --config ./playwright-mcp.config.json --port 8931
```

Then connect via HTTP in MCP client:

```json
{
  "mcpServers": {
    "playwright": {
      "url": "http://localhost:8931/mcp"
    }
  }
}
```

## Advanced Configuration Options

### Enable Vision Capabilities (Coordinate-based Clicks)

```bash
npx @playwright/mcp@latest --caps=vision --config ./playwright-mcp.config.json
```

### Enable PDF Generation

```bash
npx @playwright/mcp@latest --caps=pdf --config ./playwright-mcp.config.json
```

### Enable Test Assertions

```bash
npx @playwright/mcp@latest --caps=testing --config ./playwright-mcp.config.json
```

### Enable Tracing

```bash
npx @playwright/mcp@latest --caps=tracing --save-trace --config ./playwright-mcp.config.json
```

Traces will be saved to `./playwright-mcp-output/trace.zip` and can be viewed at https://trace.playwright.dev

### Save Session Videos

```bash
npx @playwright/mcp@latest --save-video=1280x720 --config ./playwright-mcp.config.json
```

## Persistent vs Isolated Mode

### Persistent Mode (Default)

Browser profile persists between sessions. Useful for testing logged-in states.

Location:

- macOS: `~/Library/Caches/ms-playwright/mcp-chromium-profile`
- Linux: `~/.cache/ms-playwright/mcp-chromium-profile`
- Windows: `%USERPROFILE%\AppData\Local\ms-playwright\mcp-chromium-profile`

### Isolated Mode

Each session starts fresh with no persistent state:

```bash
npx @playwright/mcp@latest --isolated --config ./playwright-mcp.config.json
```

## Troubleshooting

### Browser Won't Launch

If running in a container without display:

```bash
npx @playwright/mcp@latest --headless --config ./playwright-mcp.config.json
```

### Port Already in Use

Change the port:

```bash
npx @playwright/mcp@latest --port 8932 --config ./playwright-mcp.config.json
```

### Certificate Errors

To ignore HTTPS errors (development only):

```bash
npx @playwright/mcp@latest --ignore-https-errors --config ./playwright-mcp.config.json
```

## Integration with Existing Playwright Tests

The MCP server can work alongside your existing Playwright test suite:

```bash
# Run existing e2e tests
npm run e2e

# Use MCP server for interactive testing/debugging
npx @playwright/mcp@latest --config ./playwright-mcp.config.json
```

## Security Considerations

- **Allowed Hosts**: By default, MCP server restricts access to localhost. Use `--allowed-hosts` to allow specific domains.
- **Secrets**: Store sensitive data in `.env` file and reference with `--secrets .env`
- **Sandbox**: Browser runs sandboxed by default. Use `--no-sandbox` only if absolutely necessary (not recommended).

## Next Steps

1. **Configure MCP Client**: Add the Playwright MCP server to your preferred MCP client (VS Code, Claude Desktop, etc.)
2. **Test Connection**: Open your MCP client and verify the Playwright tools are available
3. **Run First Test**: Navigate to https://windgap-academy-e2c48.web.app and verify no React "Children" errors
4. **Explore Learning Modules**: Test each learning path (Literacy, Numeracy, Life Skills, Digital Literacy)
5. **Set Up Tracing**: Enable tracing for debugging complex interactions

## Resources

- [Playwright MCP GitHub](https://github.com/microsoft/playwright-mcp)
- [Playwright Documentation](https://playwright.dev/)
- [MCP Specification](https://modelcontextprotocol.io/)
- [Windgap Academy Live Site](https://windgap-academy-e2c48.web.app)

## Support

For issues with the Playwright MCP server, file issues at:
https://github.com/microsoft/playwright-mcp/issues
