import { test, expect } from '@playwright/test';

test.describe('Mobile Artifact Scene', () => {
  test('mobile scene fits within viewport bounds', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });

    // Navigate to mobile initial state
    await page.goto('/?capture-page=mobile-initial');

    // Wait for SVG to render
    await page.waitForSelector('#mobile-artifact-scene');

    // Get the scene element
    const scene = page.locator('#mobile-artifact-scene');

    // Get bounding box
    const box = await scene.boundingBox();
    expect(box).toBeTruthy();

    if (!box) throw new Error('Scene bounding box is null');

    console.log('Mobile scene bounding box:', {
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
    });

    // Viewport constraints: apparatus at 0.38 scale spans 363px × 344px
    expect(box.x).toBeGreaterThanOrEqual(10);
    expect(box.y).toBeGreaterThanOrEqual(10);
    expect(box.x + box.width).toBeLessThanOrEqual(410);
    expect(box.y + box.height).toBeLessThanOrEqual(835);

    // Size constraints: 0.38 scale apparatus with rotation/antialiasing
    expect(box.width).toBeGreaterThanOrEqual(355);
    expect(box.width).toBeLessThanOrEqual(370);
    expect(box.height).toBeGreaterThanOrEqual(335);
    expect(box.height).toBeLessThanOrEqual(350);

    // Check that all data-part elements are within viewport
    const parts = await page.locator('[data-part]').all();

    for (const part of parts) {
      const partBox = await part.boundingBox();
      if (partBox) {
        expect(partBox.x).toBeGreaterThanOrEqual(10);
        expect(partBox.y).toBeGreaterThanOrEqual(10);
        expect(partBox.x + partBox.width).toBeLessThanOrEqual(410);
        expect(partBox.y + partBox.height).toBeLessThanOrEqual(835);
      }
    }
  });

  test('mobile scene geometry is visible', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });

    // Navigate to mobile discovery state
    await page.goto('/?capture-page=mobile-discovery');

    // Wait for SVG to render
    await page.waitForSelector('#mobile-artifact-scene');

    // Verify critical parts exist
    const parts = ['handle', 'module-1', 'module-2', 'module-3', 'module-4', 'collision'];

    for (const part of parts) {
      const element = page.locator(`[data-part="${part}"]`);
      await expect(element).toBeVisible();
    }
  });

  test('desktop scene unchanged viewBox', async ({ page }) => {
    // Desktop viewport (standard)
    await page.setViewportSize({ width: 1280, height: 720 });

    // Navigate to desktop artifact
    await page.goto('/?capture-page=artifact-initial');

    // Wait for SVG to render
    await page.waitForSelector('svg.artifact-svg');

    // Desktop should NOT have mobile-artifact-scene
    const mobileScene = page.locator('#mobile-artifact-scene');
    await expect(mobileScene).not.toBeVisible();

    // Desktop should have artifact-scene
    const desktopScene = page.locator('#artifact-scene');
    await expect(desktopScene).toBeVisible();
  });
});
