import { test, expect } from '@playwright/test';

test.describe('Public Route (no query parameter)', () => {
  test('desktop: all five sections visible and scrollable', async ({ page }) => {
    // Desktop viewport
    await page.setViewportSize({ width: 1600, height: 900 });

    // Navigate to public route (no query parameter)
    await page.goto('/', { waitUntil: 'networkidle' });

    // Wait for page to settle
    await page.waitForTimeout(500);

    // Check body scroll height
    const bodyScrollHeight = await page.evaluate(() => document.body.scrollHeight);
    console.log(`Body scroll height: ${bodyScrollHeight}px`);
    expect(bodyScrollHeight).toBeGreaterThan(900 * 4);

    // Check all five sections exist
    const sectionOpening = page.locator('.section-opening');
    const sectionArtifact = page.locator('.section-artifact');
    const sectionContradiction = page.locator('.section-contradiction');
    const sectionConsequence = page.locator('.section-consequence');
    const sectionProof = page.locator('.section-proof');

    // Verify all sections exist
    await expect(sectionOpening).toBeVisible();
    await expect(sectionArtifact).toBeVisible();
    await expect(sectionContradiction).toBeVisible();
    await expect(sectionConsequence).toBeVisible();
    await expect(sectionProof).toBeVisible();

    // Get bounding boxes and CSS properties for each section
    const sections = [
      { name: 'opening', locator: sectionOpening },
      { name: 'artifact', locator: sectionArtifact },
      { name: 'contradiction', locator: sectionContradiction },
      { name: 'consequence', locator: sectionConsequence },
      { name: 'proof', locator: sectionProof },
    ];

    for (const section of sections) {
      const box = await section.locator.boundingBox();
      const display = await section.locator.evaluate(el => window.getComputedStyle(el).display);
      const visibility = await section.locator.evaluate(el => window.getComputedStyle(el).visibility);
      const opacity = await section.locator.evaluate(el => window.getComputedStyle(el).opacity);
      const position = await section.locator.evaluate(el => window.getComputedStyle(el).position);
      const height = await section.locator.evaluate(el => window.getComputedStyle(el).height);

      console.log(`\n${section.name}:`);
      console.log(`  box: ${JSON.stringify(box)}`);
      console.log(`  display: ${display}`);
      console.log(`  visibility: ${visibility}`);
      console.log(`  opacity: ${opacity}`);
      console.log(`  position: ${position}`);
      console.log(`  height: ${height}`);

      expect(display).toBe('flex');
      expect(visibility).toBe('visible');
      expect(opacity).toBe('1');
    }

    // Scroll through each section and capture
    await page.screenshot({ path: 'artifacts/public-validation/desktop-opening.png', fullPage: false });

    await sectionArtifact.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'artifacts/public-validation/desktop-artifact.png', fullPage: false });

    await sectionContradiction.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'artifacts/public-validation/desktop-contradiction.png', fullPage: false });

    await sectionConsequence.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'artifacts/public-validation/desktop-consequence.png', fullPage: false });

    await sectionProof.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'artifacts/public-validation/desktop-proof.png', fullPage: false });
  });

  test('mobile: all sections visible and scrollable', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });

    // Navigate to public route
    await page.goto('/', { waitUntil: 'networkidle' });

    // Wait for page to settle
    await page.waitForTimeout(500);

    // Check body scroll height
    const bodyScrollHeight = await page.evaluate(() => document.body.scrollHeight);
    console.log(`Mobile body scroll height: ${bodyScrollHeight}px`);

    // Check all five sections exist
    const sectionOpening = page.locator('.section-opening');
    const sectionArtifact = page.locator('.section-artifact');
    const sectionProof = page.locator('.section-proof');

    await expect(sectionOpening).toBeVisible();
    await expect(sectionArtifact).toBeVisible();
    await expect(sectionProof).toBeVisible();

    // Capture each section
    await page.screenshot({ path: 'artifacts/public-validation/mobile-opening.png', fullPage: false });

    await sectionArtifact.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'artifacts/public-validation/mobile-artifact.png', fullPage: false });

    await sectionProof.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'artifacts/public-validation/mobile-proof.png', fullPage: false });
  });
});
