import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext();
  const page = await context.newPage();
  const logs = [];
  page.on('console', msg => logs.push({type: 'console.'+msg.type(), text: msg.text()}));
  page.on('pageerror', error => logs.push({type: 'pageerror', text: error.message}));
  page.on('requestfailed', request => logs.push({type: 'requestfailed', url: request.url(), errorText: request.failure()?.errorText}));
  try {
    await page.goto('http://localhost:5000/', { waitUntil: 'networkidle' });
  } catch (e) {
    logs.push({type: 'navigation.error', text: ''+e});
  }
  await page.waitForTimeout(3000);
  const errors = logs.filter(l => l.type === 'pageerror' || (l.text && (l.text.includes('Cannot set properties of undefined') || l.text.includes('Uncaught TypeError'))));
  console.log('capturedLogs:', JSON.stringify(logs, null, 2));
  console.log('errors:', JSON.stringify(errors, null, 2));
  await browser.close();
  if (errors.length > 0) process.exit(2);
  process.exit(0);
})();
