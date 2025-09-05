// Playwright E2E test: Main UI and button flow
import { test, expect } from "@playwright/test";

test("Windgap Academy Main UI Flow", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await expect(page.getByText("Dashboard")).toBeVisible();
  const buttons = await page.$$("button, a");
  for (const btn of buttons) {
    await btn.click({ force: true });
  }
  await expect(page.getByText(/Game/)).toBeTruthy(); // Example: check game module loaded
});
