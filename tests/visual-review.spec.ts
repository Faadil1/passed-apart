import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Visual Review - Inspection Experience', () => {
  const reviewDir = 'artifacts/visual-review';

  test.beforeAll(async () => {
    // Ensure review directory exists
    if (!fs.existsSync(reviewDir)) {
      fs.mkdirSync(reviewDir, { recursive: true });
    }
  });

  test('desktop: opening moment (encounter)', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Verify invitation text is visible
    const invitation = page.locator('.invitation-text');
    await expect(invitation).toBeVisible();

    await page.screenshot({
      path: `${reviewDir}/01-desktop-opening.png`,
      fullPage: true
    });
  });

  test('desktop: interaction moment (affordance engaged)', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Simulate interaction - click and drag on artifact
    const artifact = page.locator('.artifact-hero');
    const box = await artifact.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.waitForTimeout(100);
      // Drag to create interaction effect
      await page.mouse.move(box.x + box.width / 2 + 150, box.y + box.height / 2, { steps: 5 });
      await page.waitForTimeout(300);
      await page.mouse.up();
      await page.waitForTimeout(300);
    }

    await page.screenshot({
      path: `${reviewDir}/02-desktop-interaction.png`,
      fullPage: false
    });
  });

  test('desktop: collision moment (annotations visible)', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const collision = page.locator('.section-collision');
    await collision.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    await page.screenshot({
      path: `${reviewDir}/03-desktop-collision.png`,
      fullPage: false
    });
  });

  test('desktop: evidence moment (inspection records)', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const records = page.locator('.section-records');
    await records.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    await page.screenshot({
      path: `${reviewDir}/04-desktop-evidence.png`,
      fullPage: false
    });
  });

  test('desktop: verdict moment (forensic outcome)', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const verdict = page.locator('.section-verdict');
    await verdict.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    await page.screenshot({
      path: `${reviewDir}/05-desktop-verdict.png`,
      fullPage: false
    });
  });

  test('mobile: opening moment (encounter)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const invitation = page.locator('.invitation-text');
    await expect(invitation).toBeVisible();

    await page.screenshot({
      path: `${reviewDir}/06-mobile-opening.png`,
      fullPage: false
    });
  });

  test('mobile: interaction moment (affordance engaged)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Simulate touch interaction
    const artifact = page.locator('.artifact-hero');
    const box = await artifact.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.waitForTimeout(100);
      await page.mouse.move(box.x + box.width / 2 + 80, box.y + box.height / 2, { steps: 3 });
      await page.waitForTimeout(300);
      await page.mouse.up();
      await page.waitForTimeout(300);
    }

    await page.screenshot({
      path: `${reviewDir}/07-mobile-interaction.png`,
      fullPage: false
    });
  });

  test('mobile: collision moment (annotations visible)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const collision = page.locator('.section-collision');
    await collision.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    await page.screenshot({
      path: `${reviewDir}/08-mobile-collision.png`,
      fullPage: false
    });
  });

  test('mobile: evidence moment (inspection records)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const records = page.locator('.section-records');
    await records.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    await page.screenshot({
      path: `${reviewDir}/09-mobile-evidence.png`,
      fullPage: false
    });
  });

  test('mobile: verdict moment (forensic outcome)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const verdict = page.locator('.section-verdict');
    await verdict.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    await page.screenshot({
      path: `${reviewDir}/10-mobile-verdict.png`,
      fullPage: false
    });
  });

  test('generate contact sheet (all 10 moments)', async () => {
    // Read all 10 screenshots and create a contact sheet
    const images = [
      '01-desktop-opening.png',
      '02-desktop-interaction.png',
      '03-desktop-collision.png',
      '04-desktop-evidence.png',
      '05-desktop-verdict.png',
      '06-mobile-opening.png',
      '07-mobile-interaction.png',
      '08-mobile-collision.png',
      '09-mobile-evidence.png',
      '10-mobile-verdict.png',
    ];

    // Verify all images exist
    const missingImages = images.filter(img => {
      const filePath = path.join(reviewDir, img);
      return !fs.existsSync(filePath);
    });

    if (missingImages.length > 0) {
      console.log(`WARNING: Missing images for contact sheet: ${missingImages.join(', ')}`);
      console.log('Proceeding with available images...');
    }

    // Create HTML contact sheet
    const contactSheet = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PASSED APART — Visual Review Contact Sheet</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background: #0a0a0a;
      color: #c0b0a0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
      padding: 60px 40px;
    }

    .container {
      max-width: 1800px;
      margin: 0 auto;
    }

    h1 {
      font-size: 42px;
      font-weight: 200;
      letter-spacing: 2px;
      margin-bottom: 16px;
      text-transform: uppercase;
    }

    .subtitle {
      font-size: 14px;
      color: #7a6a58;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 60px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 24px;
      margin-bottom: 80px;
    }

    .moment {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .moment-image {
      width: 100%;
      height: 300px;
      background: #1a1a1a;
      border: 1px solid rgba(166, 152, 128, 0.15);
      border-radius: 1px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .moment-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .moment-label {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 1px;
      color: #6a5a48;
      text-transform: uppercase;
      text-align: center;
    }

    .moment-description {
      font-size: 12px;
      color: #8a7a68;
      text-align: center;
      line-height: 1.4;
    }

    .desktop-section {
      margin-bottom: 80px;
    }

    .section-title {
      font-size: 20px;
      font-weight: 300;
      letter-spacing: 1px;
      color: #a89880;
      margin-bottom: 40px;
      text-transform: uppercase;
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(166, 152, 128, 0.1);
    }

    .footer {
      text-align: center;
      color: #6a5a48;
      font-size: 12px;
      letter-spacing: 1px;
      padding-top: 40px;
      border-top: 1px solid rgba(166, 152, 128, 0.1);
    }

    @media (max-width: 1400px) {
      .grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 768px) {
      .grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>PASSED APART</h1>
    <p class="subtitle">Visual Review — Inspection Experience Rebuild</p>

    <div class="desktop-section">
      <div class="section-title">Desktop Moments (1600×900)</div>
      <div class="grid">
        <div class="moment">
          <div class="moment-image">
            <img src="01-desktop-opening.png" alt="Desktop Opening">
          </div>
          <div class="moment-label">Moment 1</div>
          <div class="moment-description">Encounter: Artifact as hero, invitation affordance visible</div>
        </div>

        <div class="moment">
          <div class="moment-image">
            <img src="02-desktop-interaction.png" alt="Desktop Interaction">
          </div>
          <div class="moment-label">Moment 2-3</div>
          <div class="moment-description">Invitation & Test: User interaction, spine movement</div>
        </div>

        <div class="moment">
          <div class="moment-image">
            <img src="03-desktop-collision.png" alt="Desktop Collision">
          </div>
          <div class="moment-label">Moment 4</div>
          <div class="moment-description">Collision: LOCAL APPROVAL & SYSTEM READINESS revealed</div>
        </div>

        <div class="moment">
          <div class="moment-image">
            <img src="04-desktop-evidence.png" alt="Desktop Evidence">
          </div>
          <div class="moment-label">Inspection Records</div>
          <div class="moment-description">Three stages: Approval, Integration, Collision</div>
        </div>

        <div class="moment">
          <div class="moment-image">
            <img src="05-desktop-verdict.png" alt="Desktop Verdict">
          </div>
          <div class="moment-label">Moment 5</div>
          <div class="moment-description">Verdict: Approved Separately, Bound Together, Failed as System</div>
        </div>
      </div>
    </div>

    <div class="desktop-section">
      <div class="section-title">Mobile Moments (390×844)</div>
      <div class="grid">
        <div class="moment">
          <div class="moment-image">
            <img src="06-mobile-opening.png" alt="Mobile Opening">
          </div>
          <div class="moment-label">Moment 1</div>
          <div class="moment-description">Encounter: Rotated artifact, invitation visible</div>
        </div>

        <div class="moment">
          <div class="moment-image">
            <img src="07-mobile-interaction.png" alt="Mobile Interaction">
          </div>
          <div class="moment-label">Moment 2-3</div>
          <div class="moment-description">Invitation & Test: Touch interaction, spine movement</div>
        </div>

        <div class="moment">
          <div class="moment-image">
            <img src="08-mobile-collision.png" alt="Mobile Collision">
          </div>
          <div class="moment-label">Moment 4</div>
          <div class="moment-description">Collision: Annotations revealed, system incompatibility</div>
        </div>

        <div class="moment">
          <div class="moment-image">
            <img src="09-mobile-evidence.png" alt="Mobile Evidence">
          </div>
          <div class="moment-label">Inspection Records</div>
          <div class="moment-description">Stacked records: Approval, Integration, Collision</div>
        </div>

        <div class="moment">
          <div class="moment-image">
            <img src="10-mobile-verdict.png" alt="Mobile Verdict">
          </div>
          <div class="moment-label">Moment 5</div>
          <div class="moment-description">Verdict: Forensic outcome of system test</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>PASSED APART — Inspection Experience Visual Review</p>
      <p style="margin-top: 8px;">All moments captured across desktop (1600×900) and mobile (390×844) viewports</p>
    </div>
  </div>
</body>
</html>
    `;

    // Write contact sheet
    fs.writeFileSync(path.join(reviewDir, 'contact-sheet.html'), contactSheet);
    console.log(`✓ Contact sheet generated: ${reviewDir}/contact-sheet.html`);
  });
});
