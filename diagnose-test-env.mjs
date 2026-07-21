import { chromium } from 'playwright';

async function diagnose() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();

  try {
    // Navigate to mobile capture
    console.log('Navigating to mobile-initial...');
    await page.goto('http://localhost:5173/?capture-page=mobile-initial', { waitUntil: 'networkidle' });

    // Wait a bit
    await page.waitForTimeout(500);

    // Check what's in the DOM
    const htmlContent = await page.evaluate(() => {
    const mobileScene = document.querySelector('#mobile-artifact-scene');
    const artifactScene = document.querySelector('#artifact-scene');
    const svg = document.querySelector('svg.artifact-svg');

    return {
      mobileSceneExists: !!mobileScene,
      mobileSceneDisplay: mobileScene ? window.getComputedStyle(mobileScene).display : 'N/A',
      mobileSceneVisibility: mobileScene ? window.getComputedStyle(mobileScene).visibility : 'N/A',
      mobileSceneOpacity: mobileScene ? window.getComputedStyle(mobileScene).opacity : 'N/A',
      mobileSceneTransform: mobileScene ? mobileScene.getAttribute('transform') : 'N/A',
      artifactSceneExists: !!artifactScene,
      svgExists: !!svg,
      svgViewport: svg ? {
        width: svg.getAttribute('width'),
        height: svg.getAttribute('height'),
        viewBox: svg.getAttribute('viewBox'),
        class: svg.getAttribute('class'),
      } : null,
      documentTitle: document.title,
      bodyClasses: document.body.className,
    };
  });

  console.log('DOM State:', JSON.stringify(htmlContent, null, 2));

  // Try different selectors
  const selectors = [
    '#mobile-artifact-scene',
    'g#mobile-artifact-scene',
    'svg g#mobile-artifact-scene',
    '[data-part="mobile-scene"]',
    'g[data-part="mobile-scene"]',
  ];

  console.log('\nSelector availability:');
  for (const selector of selectors) {
    try {
      const count = await page.locator(selector).count();
      console.log(`  ${selector}: ${count} elements`);
    } catch (e) {
      console.log(`  ${selector}: ERROR - ${e.message}`);
    }
  }

  // Try the actual test's method
  console.log('\nTesting page.waitForSelector with different timeouts:');
  try {
    // Try with 1 second timeout
    await page.waitForSelector('#mobile-artifact-scene', { timeout: 1000 });
    console.log('  ✓ waitForSelector found element');
  } catch (e) {
    console.log(`  ✗ waitForSelector timeout: ${e.message}`);
  }

  // Check if element is in viewport
  const isInViewport = await page.evaluate(() => {
    const elem = document.querySelector('#mobile-artifact-scene');
    if (!elem) return false;
    const rect = elem.getBoundingClientRect();
    return {
      visible: rect.width > 0 && rect.height > 0,
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      topInViewport: rect.top >= -844,
      bottomInViewport: rect.bottom <= 844 * 2,
    };
  });

  console.log('\nViewport positioning:', isInViewport);

  } finally {
    await browser.close();
  }
}

diagnose().catch(console.error);
