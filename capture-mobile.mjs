import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function captureImages() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  console.log('Starting mobile captures...\n');

  try {
    // Ensure output directory exists
    await fs.mkdir(join(__dirname, 'artifacts/mobile-captures'), { recursive: true });

    // Capture mobile initial
    console.log('Capturing mobile initial...');
    await page.goto('http://localhost:5173/?capture-page=mobile-initial', { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    await page.screenshot({ path: join(__dirname, 'artifacts/mobile-captures/initial.png'), fullPage: false });
    console.log('✓ Mobile initial captured');

    // Capture mobile discovery
    console.log('Capturing mobile discovery...');
    await page.goto('http://localhost:5173/?capture-page=mobile-discovery', { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    await page.screenshot({ path: join(__dirname, 'artifacts/mobile-captures/discovery.png'), fullPage: false });
    console.log('✓ Mobile discovery captured');

    // Verify the artifact is visible
    const svgElement = page.locator('svg.artifact-svg');
    const isVisible = await svgElement.isVisible().catch(() => false);
    console.log(`\nArtifact SVG visible: ${isVisible}`);

    // Get viewport dimensions
    const viewport = page.viewportSize();
    console.log(`Viewport: ${viewport.width}x${viewport.height}`);

    // Try to find the mobile scene element
    const mobileScene = page.locator('#mobile-artifact-scene');
    const mobileSceneCount = await mobileScene.count().catch(() => 0);
    console.log(`Mobile scene elements found: ${mobileSceneCount}`);

    if (mobileSceneCount > 0) {
      const box = await mobileScene.boundingBox().catch(() => null);
      if (box) {
        console.log(`Mobile scene bounding box:`, {
          x: Math.round(box.x),
          y: Math.round(box.y),
          width: Math.round(box.width),
          height: Math.round(box.height),
          widthPercent: Math.round(box.width / viewport.width * 100),
          heightPercent: Math.round(box.height / viewport.height * 100),
        });
      }
    }
  } finally {
    await browser.close();
  }
}

captureImages().catch(console.error);
