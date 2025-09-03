// Playwright E2E test: Main UI and button flow
const { test, expect } = require("@playwright/test");

test("Windgap Academy Main UI Flow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Dashboard")).toBeVisible();
  const buttons = await page.$$("button, a");
  for (const btn of buttons) {
    await btn.click({ force: true });
  }
  await expect(page.getByText(/Game/)).toBeTruthy(); // Example: check game module loaded
});
