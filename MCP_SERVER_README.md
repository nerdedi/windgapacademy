# 🎭 Playwright MCP Server - Quick Reference

## ✅ Installation Complete

The **Playwright MCP (Model Context Protocol) Server** is now installed and configured for Windgap Academy.

## 📦 What's Installed

- **Package**: `@playwright/mcp@0.0.47` (latest, official Microsoft implementation)
- **Configuration**: `playwright-mcp.config.json`
- **Documentation**: `docs/PLAYWRIGHT_MCP_SETUP.md`
- **Test Script**: `test-playwright-mcp.sh`

## 🚀 Quick Start

### Test the Installation

```bash
npm run mcp:test
```

This will:

- Verify Playwright MCP is installed
- Launch a headless browser
- Navigate to https://windgap-academy-e2c48.web.app
- Check for console errors (including the old "Children" error)
- Capture a screenshot

### Run the MCP Server

**Standard Mode** (MCP client integration):

```bash
npm run mcp:server
```

**Debug Mode** (standalone with HTTP endpoint):

```bash
npm run mcp:server:debug
```

Server will be available at: `http://localhost:8931/mcp`

## 🔧 MCP Client Configuration

### For VS Code

Add to your VS Code settings or use the quick install link:

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

[📥 Quick Install in VS Code](https://insiders.vscode.dev/redirect?url=vscode%3Amcp%2Finstall%3F%257B%2522name%2522%253A%2522playwright%2522%252C%2522command%2522%253A%2522npx%2522%252C%2522args%2522%253A%255B%2522%2540playwright%252Fmcp%2540latest%2522%255D%257D)

### For Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

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

## 🎯 Use Cases for Windgap Academy

### 1. Verify React Three Fiber Fix

Test that the "Cannot set properties of undefined (setting 'Children')" error is resolved:

```javascript
// Navigate to a page with 3D content
await page.goto("https://windgap-academy-e2c48.web.app/modules/fraction-mastery");

// Monitor console for errors
const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});

// Wait for page to load and React to hydrate
await page.waitForTimeout(5000);

// Check for the old error
const hasChildrenError = errors.some(
  (err) => err.includes("Cannot set properties of undefined") && err.includes("Children"),
);

console.log("Children error present:", hasChildrenError); // Should be false
```

### 2. Test Learning Paths

```javascript
// Test all four learning paths
const paths = ["literacy", "numeracy", "life-skills", "digital-literacy"];

for (const path of paths) {
  await page.click(`[data-testid="${path}-path"]`);
  await page.waitForSelector(".learning-module");
  console.log(`✅ ${path} loaded successfully`);
}
```

### 3. Accessibility Testing

```javascript
// Get accessibility tree for LLND learner support verification
const tree = await page.accessibility.snapshot();
console.log(JSON.stringify(tree, null, 2));

// Test keyboard navigation
await page.keyboard.press("Tab");
await page.keyboard.press("Enter");
```

### 4. Performance Monitoring

```javascript
// Measure page load performance
const metrics = await page.evaluate(() => ({
  loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
  domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
}));

console.log("Page metrics:", metrics);
```

## 🛠️ Available Commands

| Command                    | Description                                |
| -------------------------- | ------------------------------------------ |
| `npm run mcp:test`         | Run quick verification test                |
| `npm run mcp:server`       | Start MCP server for client integration    |
| `npm run mcp:server:debug` | Start standalone server with HTTP endpoint |
| `npm run e2e`              | Run existing Playwright e2e tests          |

## 📚 Full Documentation

See **[docs/PLAYWRIGHT_MCP_SETUP.md](./docs/PLAYWRIGHT_MCP_SETUP.md)** for:

- Advanced configuration options
- All available capabilities (vision, PDF, testing, tracing)
- Troubleshooting guide
- Persistent vs isolated modes
- Security considerations

## 🎪 Next Steps

1. **✅ Test Installation**: Run `npm run mcp:test`
2. **🔌 Configure MCP Client**: Add server to VS Code, Claude Desktop, or other MCP client
3. **🌐 Verify Live Site**: Test https://windgap-academy-e2c48.web.app for React errors
4. **📊 Enable Tracing**: Add `--caps=tracing --save-trace` for debugging
5. **🎓 Test Learning Modules**: Verify all four learning paths work correctly

## 🐛 Troubleshooting

**Issue**: Browser won't launch
**Solution**: Ensure you're running in headless mode: `--headless`

**Issue**: Port 8931 already in use
**Solution**: Change port with `--port 8932`

**Issue**: Certificate errors
**Solution**: Use `--ignore-https-errors` (development only)

## 📞 Support

- **Playwright MCP Issues**: https://github.com/microsoft/playwright-mcp/issues
- **Playwright Docs**: https://playwright.dev/
- **MCP Specification**: https://modelcontextprotocol.io/

---

**Why Playwright MCP?**

- ✅ Official Microsoft implementation
- ✅ Playwright already installed in project
- ✅ Accessibility-first (perfect for LLND learners)
- ✅ No vision models needed
- ✅ Deterministic, structured interactions
- ✅ Immediate value for testing learning modules

**Status**: 🟢 Ready to use!
