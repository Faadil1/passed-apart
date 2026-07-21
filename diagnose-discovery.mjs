import { chromium } from 'playwright';

async function diagnose() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1600, height: 900 } });
  const page = await context.newPage();

  try {
    console.log('Diagnosing artifact-discovery route...\n');

    await page.goto('http://localhost:5173/?capture-page=artifact-discovery', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Get the rendered content
    const htmlStructure = await page.evaluate(() => {
      const sections = document.querySelectorAll('section');
      const svgs = document.querySelectorAll('svg');
      const artificats = document.querySelectorAll('[data-artifact]');

      return {
        sections: Array.from(sections).map((s, i) => ({
          index: i,
          classes: s.className,
          children: s.children.length,
        })),
        svgs: svgs.length,
        artifacts: artificats.length,
        bodyClasses: document.body.className,
        pageLayout: !!document.querySelector('.page-layout'),
        artifactFrame: !!document.querySelector('.artifact-frame'),
        MasterSpineArtifact: !!document.querySelector('[data-artifact="day-06-master-spine"]'),
        documentElement: {
          tag: document.documentElement.tagName,
          classes: document.documentElement.className,
        },
      };
    });

    console.log('Page structure:');
    console.log(JSON.stringify(htmlStructure, null, 2));

    // Get page content length
    const content = await page.content();
    console.log(`\nPage content length: ${content.length} bytes`);

    // Check if Spike component rendered correctly
    const spikeCheck = await page.evaluate(() => {
      const params = new URLSearchParams(window.location.search);
      return {
        currentUrl: window.location.href,
        capturePageParam: params.get('capture-page'),
        spikeWouldRender: {
          opening: params.get('capture-page') === 'opening',
          artifactInitial: params.get('capture-page') === 'artifact-initial',
          artifactSuccess: params.get('capture-page') === 'artifact-success',
          artifactDiscovery: params.get('capture-page') === 'artifact-discovery',
          cover: params.get('capture-page') === 'cover',
          mobileInitial: params.get('capture-page') === 'mobile-initial',
          mobileDiscovery: params.get('capture-page') === 'mobile-discovery',
          proof: params.get('capture-page') === 'proof',
        },
      };
    });

    console.log('\nURL parsing in page:');
    console.log(JSON.stringify(spikeCheck, null, 2));

    // Take a screenshot to see what's on screen
    await page.screenshot({ path: '/tmp/discovery-debug.png', fullPage: false });
    console.log('\nScreenshot saved to /tmp/discovery-debug.png');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

diagnose();
