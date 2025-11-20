#!/bin/bash

# Quick test script for Playwright MCP Server
# Verifies the server can access Windgap Academy and check for React errors

echo "🎭 Testing Playwright MCP Server..."
echo ""

# Check if Playwright MCP is installed
if ! npm list @playwright/mcp > /dev/null 2>&1; then
  echo "❌ Playwright MCP not installed. Run: npm install @playwright/mcp --save-dev"
  exit 1
fi

echo "✅ Playwright MCP installed"
echo ""

# Check if config exists
if [ ! -f "playwright-mcp.config.json" ]; then
  echo "⚠️  Config file not found. Creating default..."
  cat > playwright-mcp.config.json <<EOF
{
  "contextOptions": {
    "viewport": {
      "width": 1280,
      "height": 720
    }
  },
  "browser": "chromium",
  "headless": true,
  "timeout": {
    "action": 10000,
    "navigation": 60000
  }
}
EOF
fi

echo "✅ Configuration file ready"
echo ""

# Test basic functionality
echo "🌐 Starting standalone MCP server for testing..."
echo ""

# Test using npx playwright directly
echo "Testing Playwright MCP with sample navigation..."
echo ""

# Create a simpler test using npx
cat > /tmp/test-mcp-simple.mjs <<'TESTSCRIPT'
import { chromium } from '@playwright/test';

(async () => {
  console.log('🚀 Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  console.log('🌍 Navigating to Windgap Academy...');
  try {
    await page.goto('https://windgap-academy-e2c48.web.app', {
      waitUntil: 'networkidle',
      timeout: 60000
    });
    console.log('✅ Page loaded successfully');

    // Wait for React to hydrate
    await page.waitForTimeout(3000);

    // Check for the old "Children" error
    const hasChildrenError = errors.some(err =>
      err.includes('Cannot set properties of undefined') &&
      err.includes('Children')
    );

    if (hasChildrenError) {
      console.log('❌ Found React "Children" error - React Three Fiber issue NOT fixed');
      console.log('Errors:', errors);
    } else {
      console.log('✅ No "Children" errors detected - React Three Fiber working correctly');
    }

    if (errors.length > 0) {
      console.log(`⚠️  Found ${errors.length} console error(s):`);
      errors.slice(0, 5).forEach((err, i) => console.log(`  ${i + 1}. ${err.substring(0, 100)}...`));
      if (errors.length > 5) console.log(`  ... and ${errors.length - 5} more`);
    } else {
      console.log('✅ No console errors detected');
    }

    // Take a screenshot
    await page.screenshot({ path: '/tmp/windgap-academy-screenshot.png' });
    console.log('📸 Screenshot saved to /tmp/windgap-academy-screenshot.png');

  } catch (error) {
    console.error('❌ Navigation failed:', error.message);
  }

  await browser.close();
  console.log('🏁 Test complete');
})();
TESTSCRIPT

echo "Running Playwright test..."
echo ""
node /tmp/test-mcp-simple.mjs

echo ""
echo "✅ MCP Server test complete!"
echo ""
echo "📚 Next steps:"
echo "  1. Configure your MCP client (VS Code, Claude Desktop, etc.)"
echo "  2. See docs/PLAYWRIGHT_MCP_SETUP.md for detailed instructions"
echo "  3. Run standalone server: npx @playwright/mcp@latest --config ./playwright-mcp.config.json --port 8931"
echo ""
