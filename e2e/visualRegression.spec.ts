import { test, expect } from '@playwright/test';

test.describe('CAD2Three.js WebGL Visual Regression Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders initial CAD Assembly Inspector header and canvas', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toHaveText(/CAD2Three.js/i);

    const canvasContainer = page.getByTestId('viewport-container');
    await expect(canvasContainer).toBeVisible();
  });

  test('toggles distance measurement tool overlay', async ({ page }) => {
    const distanceBtn = page.getByRole('button', { name: /Distance/i });
    await expect(distanceBtn).toBeVisible();
    await distanceBtn.click();
  });

  test('toggles dynamic sectioning clipping panel', async ({ page }) => {
    const sectionBtn = page.getByRole('button', { name: /Sectioning/i });
    await sectionBtn.click();

    const panelHeader = page.getByText(/Dynamic Sectioning/i);
    await expect(panelHeader).toBeVisible();
  });
});
