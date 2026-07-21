import { chromium } from 'playwright';

async function check() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1600, height: 900 } });
  const page = await context.newPage();

  // Capture console logs
  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
  });

  try {
    console.log('Checking artifact-discovery console...\n');

    await page.goto('http://localhost:5173/?capture-page=artifact-discovery', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    console.log('Console logs:');
    for (const log of consoleLogs) {
      console.log(`  ${log}`);
    }

    if (consoleLogs.length === 0) {
      console.log('  (no logs)');
    }

    // Also check what Spike sees
    const spikeInfo = await page.evaluate(() => {
      return {
        url: window.location.href,
        search: window.location.search,
        params: {
          capturePageFromGet: new URLSearchParams(window.location.search).get('capture-page'),
        },
      };
    });

    console.log('\nSpike sees:');
    console.log(JSON.stringify(spikeInfo, null, 2));

  } finally {
    await browser.close();
  }
}

check();
