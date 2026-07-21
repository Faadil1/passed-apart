import { chromium } from 'playwright';

async function checkRoutesForErrors() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1600, height: 900 } });
  const page = await context.newPage();

  const routes = [
    'artifact-initial',
    'artifact-success',
    'artifact-discovery',
    'cover',
    'mobile-initial',
    'mobile-discovery',
  ];

  for (const route of routes) {
    console.log(`\n📍 Testing: ${route}`);

    const errors = [];
    const logs = [];

    // Collect all messages
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
      logs.push(`[${msg.type()}] ${msg.text().substring(0, 80)}`);
    });

    try {
      await page.goto(`http://localhost:5173/?capture-page=${route}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(800);

      if (errors.length > 0) {
        console.log(`  ✗ ERRORS: ${errors.length}`);
        for (const err of errors) {
          console.log(`    - ${err.substring(0, 100)}`);
        }
      } else {
        console.log(`  ✓ No errors`);
      }

      // Check if SVG is rendering
      const hasSvg = await page.locator('svg.artifact-svg').count() > 0;
      const hasContent = await page.evaluate(() => {
        const svg = document.querySelector('svg.artifact-svg');
        if (!svg) return false;
        return svg.querySelectorAll('line, circle, rect').length > 5;
      });

      console.log(`  • SVG exists: ${hasSvg}, has content: ${hasContent}`);

    } catch (error) {
      console.log(`  ✗ Navigation error: ${error.message}`);
    }

    // Remove listeners before next iteration
    page.removeAllListeners('console');
  }

  await browser.close();
}

checkRoutesForErrors();
