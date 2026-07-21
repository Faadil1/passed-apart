import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const captures = [
  // Desktop captures
  { name: 'desktop/opening', url: '/?capture-page=opening', width: 1600, height: 900, expectedProgress: 0.00 },
  { name: 'desktop/artifact-initial', url: '/?capture-page=artifact-initial', width: 1600, height: 900, expectedProgress: 0.00 },
  { name: 'desktop/artifact-success', url: '/?capture-page=artifact-success', width: 1600, height: 900, expectedProgress: 0.79 },
  { name: 'desktop/artifact-discovery', url: '/?capture-page=artifact-discovery', width: 1600, height: 900, expectedProgress: 1.00 },
  { name: 'desktop/cover', url: '/?capture-page=cover', width: 1600, height: 900, expectedProgress: 1.00 },
  // Mobile captures
  { name: 'mobile/initial', url: '/?capture-page=mobile-initial', width: 390, height: 844, expectedProgress: 0.00 },
  { name: 'mobile/discovery', url: '/?capture-page=mobile-discovery', width: 390, height: 844, expectedProgress: 1.00 },
];

async function captureAllVerified() {
  const browser = await chromium.launch();
  console.log('🔍 CAPTURE STATE VERIFICATION & GENERATION\n');
  console.log('=' .repeat(70));

  const results = [];

  for (const capture of captures) {
    console.log(`\n📸 ${capture.name}`);
    console.log('-'.repeat(70));

    const context = await browser.newContext({
      viewport: { width: capture.width, height: capture.height },
    });
    const page = await context.newPage();

    try {
      // Navigate
      console.log(`  • Navigating to: ${capture.url}`);
      await page.goto(`http://localhost:5173${capture.url}`, { waitUntil: 'networkidle' });

      // Wait for capture ready
      console.log(`  • Waiting for capture ready...`);
      try {
        await page.waitForSelector('[data-capture-ready="true"]', { timeout: 5000 });
        console.log(`  ✓ Capture ready marker found`);
      } catch (e) {
        console.log(`  ⚠ No capture ready marker, waiting anyway...`);
        await page.waitForTimeout(500);
      }

      // Get state information
      const stateInfo = await page.evaluate(() => {
        // Re-calculate state like MasterSpineArtifact does
        const params = new URLSearchParams(window.location.search);
        const captureParam = params.get('capture');
        const capturePageParam = params.get('capture-page');
        const effectiveParam = capturePageParam || captureParam;

        let progress = 0;
        if (effectiveParam === 'initial' || effectiveParam === 'artifact-initial' || effectiveParam === 'mobile-initial') {
          progress = 0.00;
        } else if (effectiveParam === 'success' || effectiveParam === 'artifact-success') {
          progress = 0.79;
        } else if (effectiveParam === 'discovery' || effectiveParam === 'mobile-discovery' || effectiveParam === 'artifact-discovery' || effectiveParam === 'cover') {
          progress = 1.00;
        } else if (effectiveParam === 'opening') {
          progress = 0.00;
        }

        const svg = document.querySelector('svg.artifact-svg');
        const artifactScene = document.querySelector('#artifact-scene');
        const mobileScene = document.querySelector('#mobile-artifact-scene');
        const container = document.querySelector('[data-artifact="day-06-master-spine"]');

        // Check for blank/black content
        const hasContent = () => {
          const lines = document.querySelectorAll('svg.artifact-svg line');
          const circles = document.querySelectorAll('svg.artifact-svg circle');
          const rects = document.querySelectorAll('svg.artifact-svg rect');
          return (lines.length + circles.length + rects.length) > 5;
        };

        return {
          effectiveParam,
          expectedProgress: progress,
          svgExists: !!svg,
          svgDimensions: svg ? { width: svg.getAttribute('width'), height: svg.getAttribute('height') } : null,
          artifactSceneExists: !!artifactScene,
          mobileSceneExists: !!mobileScene,
          containerReady: container?.getAttribute('data-capture-ready') === 'true',
          hasContent: hasContent(),
          elementCount: {
            lines: document.querySelectorAll('svg.artifact-svg line').length,
            circles: document.querySelectorAll('svg.artifact-svg circle').length,
            rects: document.querySelectorAll('svg.artifact-svg rect').length,
          },
        };
      });

      console.log(`  • Capture param: ${stateInfo.effectiveParam}`);
      console.log(`  • Expected progress: ${stateInfo.expectedProgress.toFixed(2)}`);
      console.log(`  • SVG exists: ${stateInfo.svgExists ? '✓' : '✗'}`);
      console.log(`  • Artifact scene: ${stateInfo.artifactSceneExists ? '✓' : '✗'}`);
      console.log(`  • Has content: ${stateInfo.hasContent ? '✓' : '✗'} (${stateInfo.elementCount.lines} lines, ${stateInfo.elementCount.circles} circles, ${stateInfo.elementCount.rects} rects)`);

      if (!stateInfo.hasContent) {
        console.log(`  ✗ ABORT: No content detected (would be blank)`);
        results.push({
          name: capture.name,
          success: false,
          reason: 'No visual content detected',
          state: stateInfo,
        });
        await context.close();
        continue;
      }

      // Take screenshot
      const outputDir = join(__dirname, 'artifacts/captures-verified');
      await fs.mkdir(outputDir, { recursive: true });

      const filename = capture.name.replace(/\//g, '-') + '.png';
      const outputPath = join(outputDir, filename);

      await page.screenshot({ path: outputPath, fullPage: false });
      const stats = await fs.stat(outputPath);

      console.log(`  ✓ Screenshot saved: ${filename} (${(stats.size / 1024).toFixed(1)} KB)`);

      results.push({
        name: capture.name,
        success: true,
        filename,
        size: stats.size,
        state: stateInfo,
      });

    } catch (error) {
      console.log(`  ✗ ERROR: ${error.message}`);
      results.push({
        name: capture.name,
        success: false,
        reason: error.message,
      });
    } finally {
      await context.close();
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('\n📊 CAPTURE SUMMARY\n');

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`✓ Successful: ${successful.length}/${results.length}`);
  console.log(`✗ Failed: ${failed.length}/${results.length}`);

  if (successful.length > 0) {
    console.log('\nSuccessful captures:');
    for (const result of successful) {
      console.log(`  ✓ ${result.name} - ${(result.size / 1024).toFixed(1)} KB`);
      console.log(`    State: progress=${result.state.expectedProgress.toFixed(2)}, content=${result.state.elementCount.lines}L+${result.state.elementCount.circles}C+${result.state.elementCount.rects}R`);
    }
  }

  if (failed.length > 0) {
    console.log('\nFailed captures:');
    for (const result of failed) {
      console.log(`  ✗ ${result.name}: ${result.reason}`);
    }
  }

  console.log('\n' + '='.repeat(70));

  await browser.close();

  if (failed.length > 0) {
    console.log('\n⚠️  Some captures failed - see details above');
    process.exit(1);
  }
}

captureAllVerified().catch(console.error);
