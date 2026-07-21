import { chromium } from 'playwright';

async function captureError() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1600, height: 900 } });
  const page = await context.newPage();

  let errorFound = false;
  let fullError = '';

  // Capture all console messages (including errors)
  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error' || text.includes('Error') || text.includes('at ')) {
      fullError += text + '\n';
      errorFound = true;
    }
  });

  try {
    console.log('Capturing full error from artifact-discovery...\n');

    await page.goto('http://localhost:5173/?capture-page=artifact-discovery', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    if (errorFound) {
      console.log('Full error:');
      console.log(fullError);
    } else {
      console.log('No error found');
    }

    // Also try to get the error via evaluate
    const pageError = await page.evaluate(() => {
      return window.__REACT_ERROR || 'no error in window';
    });
    console.log('\nWindow error:', pageError);

  } catch (error) {
    console.error('Test error:', error.message);
  } finally {
    await browser.close();
  }
}

captureError();
