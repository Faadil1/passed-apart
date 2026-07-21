import { chromium } from 'playwright';

async function diagnose() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1600, height: 900 } });
  const page = await context.newPage();

  try {
    // Test multiple routes
    const routes = [
      '/?capture-page=artifact-initial',
      '/?capture-page=artifact-discovery',
      '/?capture-page=cover',
    ];

    for (const route of routes) {
      console.log(`\n📍 Route: ${route}`);
      console.log('='.repeat(70));

      await page.goto(`http://localhost:5173${route}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(600);

      const analysis = await page.evaluate(() => {
        // Get param
        const params = new URLSearchParams(window.location.search);
        const capturePageParam = params.get('capture-page');

        // Check what elements exist
        const elements = {
          // Spike template structure
          pageLayout: !!document.querySelector('.page-layout'),
          captureArtifact: !!document.querySelector('.capture-artifact'),
          sectionArtifact: !!document.querySelector('.section-artifact'),
          artifactFrame: !!document.querySelector('.artifact-frame'),

          // MasterSpineArtifact
          artifactContainer: !!document.querySelector('[data-artifact="day-06-master-spine"]'),
          svgArtifact: !!document.querySelector('svg.artifact-svg'),

          // PageLayout structure
          sectionHero: !!document.querySelector('.section.hero-section'),
          artifactInspectionFrame: !!document.querySelector('.artifact-inspection-frame'),

          // All sections
          allSections: document.querySelectorAll('section').length,
          allDivs: document.querySelectorAll('div').length,
        };

        // Check if SVG has content
        let svgHasContent = false;
        const svg = document.querySelector('svg.artifact-svg');
        if (svg) {
          const lines = svg.querySelectorAll('line').length;
          const circles = svg.querySelectorAll('circle').length;
          const rects = svg.querySelectorAll('rect').length;
          svgHasContent = (lines + circles + rects) > 5;
        }

        // Get the actual DOM structure for debugging
        const html = document.documentElement.innerHTML.substring(0, 500);

        return {
          capturePageParam,
          elements,
          svgHasContent,
          htmlPreview: html.replace(/\n/g, '').substring(0, 300),
        };
      });

      console.log(`Param: ${analysis.capturePageParam}`);
      console.log('Elements detected:');
      for (const [key, value] of Object.entries(analysis.elements)) {
        console.log(`  ${key}: ${value}`);
      }
      console.log(`SVG has content: ${analysis.svgHasContent}`);

      // Take visual screenshot
      const filename = `/tmp/diagnose-${route.split('=')[1]}.png`;
      await page.screenshot({ path: filename, fullPage: false });
      console.log(`Screenshot: ${filename}`);
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

diagnose();
