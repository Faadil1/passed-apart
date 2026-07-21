import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function generateContactSheet() {
  const browser = await chromium.launch();
  console.log('Generating desktop and mobile captures...\n');

  const captures = [];

  // Desktop captures at 1600x900
  const desktopViewports = [
    { name: 'opening', url: '/?capture-page=opening', width: 1600, height: 900 },
    { name: 'artifact-initial', url: '/?capture-page=artifact-initial', width: 1600, height: 900 },
    { name: 'artifact-success', url: '/?capture-page=artifact-success', width: 1600, height: 900 },
    { name: 'artifact-discovery', url: '/?capture-page=artifact-discovery', width: 1600, height: 900 },
    { name: 'cover', url: '/?capture-page=cover', width: 1600, height: 900 },
  ];

  // Mobile captures at 390x844
  const mobileViewports = [
    { name: 'mobile-initial', url: '/?capture-page=mobile-initial', width: 390, height: 844 },
    { name: 'mobile-discovery', url: '/?capture-page=mobile-discovery', width: 390, height: 844 },
  ];

  try {
    // Desktop captures
    console.log('DESKTOP CAPTURES (1600×900):');
    for (const viewport of desktopViewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
      });
      const page = await context.newPage();

      console.log(`  Capturing ${viewport.name}...`);
      await page.goto(`http://localhost:5173${viewport.url}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);

      const outputPath = join(__dirname, `artifacts/mobile-captures/desktop-${viewport.name}.png`);
      await page.screenshot({ path: outputPath, fullPage: false });
      captures.push({
        name: `desktop/${viewport.name}`,
        path: outputPath,
        width: viewport.width,
        height: viewport.height,
      });

      await context.close();
      console.log(`    ✓ Saved to desktop-${viewport.name}.png`);
    }

    // Mobile captures
    console.log('\nMOBILE CAPTURES (390×844):');
    for (const viewport of mobileViewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
      });
      const page = await context.newPage();

      console.log(`  Capturing ${viewport.name}...`);
      await page.goto(`http://localhost:5173${viewport.url}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);

      const outputPath = join(__dirname, `artifacts/mobile-captures/${viewport.name}.png`);
      await page.screenshot({ path: outputPath, fullPage: false });
      captures.push({
        name: `mobile/${viewport.name}`,
        path: outputPath,
        width: viewport.width,
        height: viewport.height,
      });

      await context.close();
      console.log(`    ✓ Saved to ${viewport.name}.png`);
    }

    // Generate summary
    console.log('\n✓ Capture Summary:');
    console.log(`  Desktop: ${desktopViewports.length} captures at 1600×900`);
    console.log(`  Mobile: ${mobileViewports.length} captures at 390×844`);
    console.log(`  Total: ${captures.length} captures`);

    // Report file sizes
    console.log('\nFile sizes:');
    for (const capture of captures) {
      const stats = await fs.stat(capture.path);
      console.log(`  ${capture.name}: ${stats.size.toLocaleString()} bytes`);
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

generateContactSheet();
