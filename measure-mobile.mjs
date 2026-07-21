import { chromium } from 'playwright';
import { promises as fs } from 'fs';

async function measureMobileScene() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();

  console.log('Measuring mobile artifact dimensions...\n');

  try {
    await page.goto('http://localhost:5173/?capture-page=mobile-initial', { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    // Get page content
    const content = await page.content();
    console.log('Page loaded, content length:', content.length);

    // Check for SVG
    const svgCount = (content.match(/<svg/g) || []).length;
    console.log('SVG elements found:', svgCount);

    // Check for mobile scene
    const mobileSceneCount = (content.match(/id="mobile-artifact-scene"/g) || []).length;
    console.log('Mobile scene elements in HTML:', mobileSceneCount);

    // Get all g elements
    const gCount = (content.match(/<g/g) || []).length;
    console.log('Total g elements:', gCount);

    // Try to get the SVG dimensions
    const svgMatch = content.match(/<svg[^>]*width="(\d+)"[^>]*height="(\d+)"/);
    if (svgMatch) {
      console.log(`SVG dimensions: ${svgMatch[1]}x${svgMatch[2]}`);
    }

    // Get viewBox
    const viewBoxMatch = content.match(/viewBox="([^"]+)"/);
    if (viewBoxMatch) {
      console.log(`SVG viewBox: ${viewBoxMatch[1]}`);
    }

    // Try evaluating dimensions in the page context
    const dimensions = await page.evaluate(() => {
      const svg = document.querySelector('svg.artifact-svg');
      const mobileScene = document.querySelector('#mobile-artifact-scene');
      const artifactScene = document.querySelector('#artifact-scene');

      return {
        svgExists: !!svg,
        svgDimensions: svg ? {
          width: svg.getAttribute('width'),
          height: svg.getAttribute('height'),
          viewBox: svg.getAttribute('viewBox'),
          class: svg.getAttribute('class'),
        } : null,
        mobileSceneExists: !!mobileScene,
        mobileSceneDimensions: mobileScene ? {
          transform: mobileScene.getAttribute('transform'),
        } : null,
        artifactSceneExists: !!artifactScene,
        visualElements: {
          rects: document.querySelectorAll('svg.artifact-svg rect').length,
          circles: document.querySelectorAll('svg.artifact-svg circle').length,
          lines: document.querySelectorAll('svg.artifact-svg line').length,
          groups: document.querySelectorAll('svg.artifact-svg g').length,
        },
      };
    });

    console.log('\nPage evaluation results:');
    console.log(JSON.stringify(dimensions, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

measureMobileScene();
