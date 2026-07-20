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

    // Viewport constraints: 16px margins on each side
    expect(box.x).toBeGreaterThanOrEqual(16);
    expect(box.y).toBeGreaterThanOrEqual(16);
    expect(box.x + box.width).toBeLessThanOrEqual(374);
    expect(box.y + box.height).toBeLessThanOrEqual(828);

    // Size constraints
    expect(box.width).toBeGreaterThanOrEqual(328);
    expect(box.width).toBeLessThanOrEqual(351);
    expect(box.height).toBeGreaterThanOrEqual(236);
    expect(box.height).toBeLessThanOrEqual(321);

    // Check that all data-part elements are within viewport
    const parts = await page.locator('[data-part]').all();

    for (const part of parts) {
      const partBox = await part.boundingBox();
      if (partBox) {
        expect(partBox.x).toBeGreaterThanOrEqual(16);
        expect(partBox.y).toBeGreaterThanOrEqual(16);
        expect(partBox.x + partBox.width).toBeLessThanOrEqual(374);
        expect(partBox.y + partBox.height).toBeLessThanOrEqual(828);
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
