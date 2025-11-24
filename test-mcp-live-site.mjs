import { chromium } from '@playwright/test';

(async () => {
  console.log('🚀 Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  const errors = [];
  const warnings = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    } else if (msg.type() === 'warning') {
      warnings.push(msg.text());
    }
  });

  page.on('pageerror', error => {
    errors.push(`Page error: ${error.message}`);
  });

  console.log('🌍 Navigating to Windgap Academy...');
  try {
    await page.goto('https://windgap-academy-e2c48.web.app', {
      waitUntil: 'networkidle',
      timeout: 60000
    });
    console.log('✅ Page loaded successfully');

    // Wait for React to hydrate and 3D content to potentially load
    console.log('⏳ Waiting for React hydration...');
    await page.waitForTimeout(5000);

    // Check for the old "Children" error
    const hasChildrenError = errors.some(err =>
      err.includes('Cannot set properties of undefined') &&
      err.includes('Children')
    );

    // Check for Three.js/React Three Fiber specific errors
    const hasThreeErrors = errors.some(err =>
      err.toLowerCase().includes('three') ||
      err.toLowerCase().includes('canvas') ||
      err.toLowerCase().includes('webgl')
    );

    console.log('\n📊 Test Results:');
    console.log('================');

    if (hasChildrenError) {
      console.log('❌ CRITICAL: Found React "Children" error - React Three Fiber issue NOT fixed');
      console.log('   This indicates the React version mismatch is still present.');
    } else {
      console.log('✅ PASS: No "Children" errors detected - React Three Fiber working correctly');
    }

    if (hasThreeErrors) {
      console.log('⚠️  WARNING: Found Three.js/WebGL related errors');
    } else {
      console.log('✅ PASS: No Three.js/WebGL errors detected');
    }

    if (errors.length === 0) {
      console.log('✅ EXCELLENT: No console errors detected at all!');
    } else {
      console.log(`\n⚠️  Found ${errors.length} console error(s):`);
      errors.slice(0, 5).forEach((err, i) => {
        console.log(`  ${i + 1}. ${err.substring(0, 120)}${err.length > 120 ? '...' : ''}`);
      });
      if (errors.length > 5) {
        console.log(`  ... and ${errors.length - 5} more errors`);
      }
    }

    if (warnings.length > 0) {
      console.log(`\nℹ️  Found ${warnings.length} console warning(s) (first 3):`);
      warnings.slice(0, 3).forEach((warn, i) => {
        console.log(`  ${i + 1}. ${warn.substring(0, 120)}${warn.length > 120 ? '...' : ''}`);
      });
    }

    // Take a screenshot
    await page.screenshot({ path: '/tmp/windgap-academy-screenshot.png', fullPage: false });
    console.log('\n📸 Screenshot saved to /tmp/windgap-academy-screenshot.png');

    // Get page title
    const title = await page.title();
    console.log(`📄 Page title: "${title}"`);

  } catch (error) {
    console.error('❌ Navigation failed:', error.message);
    process.exit(1);
  }

  await browser.close();
  console.log('\n🏁 Test complete\n');

  // Exit with error code if critical errors found
  if (errors.some(err => err.includes('Cannot set properties of undefined') && err.includes('Children'))) {
    process.exit(1);
  }
})();
