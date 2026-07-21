import { test, expect } from '@playwright/test';

test.describe('Public Route (no query parameter)', () => {
  test('desktop: inspection experience all moments visible and scrollable', async ({ page }) => {
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

    // Check all five moments exist (new structure)
    const sectionArtifactHero = page.locator('.section-artifact.hero-section');
    const sectionCollision = page.locator('.section-collision');
    const sectionVerdict = page.locator('.section-verdict');
    const sectionRecords = page.locator('.section-records');
    const sectionThesis = page.locator('.section-thesis');

    // Verify all moments exist
    await expect(sectionArtifactHero).toBeVisible();
    await expect(sectionCollision).toBeVisible();
    await expect(sectionVerdict).toBeVisible();
    await expect(sectionRecords).toBeVisible();
    await expect(sectionThesis).toBeVisible();

    // Verify invitation text is present on load (disappears after interaction)
    const invitationText = page.locator('.invitation-text');
    await expect(invitationText).toBeVisible();

    // Get bounding boxes and CSS properties for each moment
    const moments = [
      { name: 'artifact-hero', locator: sectionArtifactHero },
      { name: 'collision', locator: sectionCollision },
      { name: 'verdict', locator: sectionVerdict },
      { name: 'records', locator: sectionRecords },
      { name: 'thesis', locator: sectionThesis },
    ];

    for (const moment of moments) {
      const box = await moment.locator.boundingBox();
      const display = await moment.locator.evaluate(el => window.getComputedStyle(el).display);
      const visibility = await moment.locator.evaluate(el => window.getComputedStyle(el).visibility);
      const opacity = await moment.locator.evaluate(el => window.getComputedStyle(el).opacity);
      const position = await moment.locator.evaluate(el => window.getComputedStyle(el).position);
      const height = await moment.locator.evaluate(el => window.getComputedStyle(el).height);

      console.log(`\n${moment.name}:`);
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

    // Scroll through each moment and capture
    await page.screenshot({ path: 'artifacts/public-validation/desktop-encounter.png', fullPage: false });

    await sectionCollision.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'artifacts/public-validation/desktop-collision.png', fullPage: false });

    await sectionVerdict.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'artifacts/public-validation/desktop-verdict.png', fullPage: false });

    await sectionRecords.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'artifacts/public-validation/desktop-records.png', fullPage: false });

    await sectionThesis.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'artifacts/public-validation/desktop-thesis.png', fullPage: false });
  });

  test('mobile: inspection experience all moments visible and scrollable', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });

    // Navigate to public route
    await page.goto('/', { waitUntil: 'networkidle' });

    // Wait for page to settle
    await page.waitForTimeout(500);

    // Check body scroll height
    const bodyScrollHeight = await page.evaluate(() => document.body.scrollHeight);
    console.log(`Mobile body scroll height: ${bodyScrollHeight}px`);

    // Check all moments exist on mobile
    const sectionArtifactHero = page.locator('.section-artifact.hero-section');
    const sectionCollision = page.locator('.section-collision');
    const sectionRecords = page.locator('.section-records');

    await expect(sectionArtifactHero).toBeVisible();
    await expect(sectionCollision).toBeVisible();
    await expect(sectionRecords).toBeVisible();

    // Verify invitation text is present
    const invitationText = page.locator('.invitation-text');
    await expect(invitationText).toBeVisible();

    // Capture each moment
    await page.screenshot({ path: 'artifacts/public-validation/mobile-encounter.png', fullPage: false });

    await sectionCollision.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'artifacts/public-validation/mobile-collision.png', fullPage: false });

    await sectionRecords.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'artifacts/public-validation/mobile-records.png', fullPage: false });
  });
});
