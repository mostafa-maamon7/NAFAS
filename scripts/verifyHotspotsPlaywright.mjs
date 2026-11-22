import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire('/usr/local/share/bun-global/node_modules/playwright/index.js');
const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:3000';
const OUT_DIR = path.resolve('public/assets/qa_screenshots/phase2');
fs.mkdirSync(OUT_DIR, { recursive: true });

const ALL_IMAGES_TO_VERIFY = [
  { imageId: 'A1_S5', filter: 'all', levelId: 'A1', step: 'look' },
  { imageId: 'A2_S5', filter: 'all', levelId: 'A2', step: 'look' },
  { imageId: 'A3_S5', filter: 'all', levelId: 'A3', step: 'look' },
  { imageId: 'A4_S5', filter: 'all', levelId: 'A4', step: 'look' },
  { imageId: 'C1_S5', filter: 'all', levelId: 'C1', step: 'look' },
  { imageId: 'C2_S5', filter: 'all', levelId: 'C2', step: 'look' },
  { imageId: 'C3_S5', filter: 'all', levelId: 'C3', step: 'look' },
  { imageId: 'I1_S5', filter: 'all', levelId: 'I1', step: 'look' },
  { imageId: 'I2_S5', filter: 'all', levelId: 'I2', step: 'look' },
  { imageId: 'I3_S5', filter: 'all', levelId: 'I3', step: 'look' },
  { imageId: 'A2_OA2', filter: 'left', levelId: 'A2', step: 'oa2_left' },
  { imageId: 'A2_OA2', filter: 'right', levelId: 'A2', step: 'oa2_right' },
  { imageId: 'A4_OA2', filter: 'left', levelId: 'A4', step: 'oa2_left' },
  { imageId: 'A4_OA2', filter: 'right', levelId: 'A4', step: 'oa2_right' },
  { imageId: 'C1_OA2', filter: 'left', levelId: 'C1', step: 'oa2_left' },
  { imageId: 'C1_OA2', filter: 'right', levelId: 'C1', step: 'oa2_right' },
  { imageId: 'I1_OA2', filter: 'left', levelId: 'I1', step: 'oa2_left' },
  { imageId: 'I1_OA2', filter: 'right', levelId: 'I1', step: 'oa2_right' },
];

async function verifyQaHotspotsImage(page, imageId, targetFilter, viewportLabel) {
  const url = `${BASE_URL}/qa/hotspots?image=${imageId}&target=${targetFilter}&debug=on`;
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(200);

  const statusBadge = page.locator('[data-testid="qa-overall-status"]');
  await statusBadge.waitFor({ state: 'visible', timeout: 8000 });
  const statusText = (await statusBadge.innerText()).trim();
  if (!statusText.includes('PASS')) {
    throw new Error(`QA Hotspot validation failed on ${imageId} (${targetFilter}): ${statusText}`);
  }

  const imgLocator = page.locator('[data-testid="shared-scene-image"]');
  await imgLocator.waitFor({ state: 'visible', timeout: 8000 });
  const imgBox = await imgLocator.boundingBox();
  if (!imgBox || imgBox.width <= 0 || imgBox.height <= 0) {
    throw new Error(`Invalid image box on ${imageId}`);
  }

  // Read all readout cards on the right column
  const cards = page.locator('[data-testid^="qa-readout-card-"]');
  const count = await cards.count();
  const rows = [];

  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);
    const testIdAttr = await card.getAttribute('data-testid');
    const hsId = testIdAttr.replace('qa-readout-card-', '');
    const statusLoc = page.locator(`[data-testid="qa-status-${hsId}"]`);
    const cardStatus = (await statusLoc.innerText()).trim();

    // Find corresponding SVG ring or hand target ring in the shared canvas
    const ringLoc = page.locator(
      `[data-testid="scene-hotspot-ring-${hsId}"], [data-testid="scene-hand-target-ring-${hsId}"]`
    );
    await ringLoc.waitFor({ state: 'visible', timeout: 5000 });
    const ringBox = await ringLoc.boundingBox();

    const hitLoc = page.locator(
      `[data-testid="scene-hotspot-hit-${hsId}"], [data-testid="scene-hand-target-${hsId}"]`
    );
    const hitBox = await hitLoc.boundingBox();

    const cx = ringBox.x + ringBox.width / 2;
    const cy = ringBox.y + ringBox.height / 2;
    const measuredX = Number(((cx - imgBox.x) / imgBox.width).toFixed(3));
    const measuredY = Number(((cy - imgBox.y) / imgBox.height).toFixed(3));
    const hitSizeOk = hitBox && hitBox.width >= 43.5 && hitBox.height >= 43.5;

    const passed = cardStatus === 'PASS' && hitSizeOk && measuredX >= 0 && measuredX <= 1 && measuredY >= 0 && measuredY <= 1;
    if (!passed) {
      throw new Error(
        `Hotspot ${hsId} on ${imageId} (${viewportLabel}) failed: status=${cardStatus}, measured=(${measuredX},${measuredY}), hit=${JSON.stringify(hitBox)}`
      );
    }

    rows.push({
      imageId,
      targetFilter,
      viewport: viewportLabel,
      hotspotId: hsId,
      measured: { x: measuredX, y: measuredY },
      hitPx: { w: Math.round(hitBox.width), h: Math.round(hitBox.height) },
      status: 'PASS',
    });
  }

  return rows;
}

async function captureRequiredDeliverableScreenshots(page) {
  const deliverables = [
    {
      name: '1_look_magnifier_chips',
      url: `${BASE_URL}/?level=A2&testStep=look`,
      afterLoad: async (p) => {
        // Tap the blue lips ring so the spotlight dimming, magnifier tile, and active chip are highlighted
        const lipsHit = p.locator('[data-testid="scene-hotspot-hit-a2-hs-lips"]');
        if (await lipsHit.count()) {
          await lipsHit.click({ force: true });
          await p.waitForTimeout(250);
        }
      },
    },
    {
      name: '2_hand_placement_ghost_target',
      url: `${BASE_URL}/?level=A2&testStep=oa2_left`,
      afterLoad: async () => {},
    },
    {
      name: '3_rhythm_step',
      url: `${BASE_URL}/?level=A2&testStep=rhythm`,
      afterLoad: async (p) => {
        const tapBtn = p.locator('[data-testid="deliver-blow-btn"]');
        if (await tapBtn.count()) {
          await tapBtn.click();
          await p.waitForTimeout(250);
        }
      },
    },
    {
      name: '4_unresponsive_ordered_steps',
      url: `${BASE_URL}/?level=A3&testStep=unresponsive`,
      afterLoad: async () => {},
    },
    {
      name: '5_mild_watch_step',
      url: `${BASE_URL}/?level=A1&testStep=mild_watch`,
      afterLoad: async () => {},
    },
    {
      name: '6_result_correct',
      url: `${BASE_URL}/?level=A2&testStep=result_correct`,
      afterLoad: async () => {},
    },
    {
      name: '7_result_wrong',
      url: `${BASE_URL}/?level=A2&testStep=result_wrong`,
      afterLoad: async () => {},
    },
  ];

  for (const item of deliverables) {
    for (const vp of [
      { width: 375, height: 812, label: '375px' },
      { width: 1280, height: 860, label: '1280px' },
    ]) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(item.url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(350);
      await item.afterLoad(page);

      // Check zero horizontal overflow
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      if (overflow) {
        throw new Error(`Horizontal overflow detected on ${item.name} at ${vp.label}`);
      }

      const filePath = path.join(OUT_DIR, `${item.name}_${vp.label}.png`);
      await page.screenshot({ path: filePath, fullPage: false });
      console.log(`Captured ${item.name}_${vp.label}.png`);
    }
  }
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const allRows = [];

  try {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 860 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    // 1. Verify all 40 hotspots across all 10 S5 images + 4 severe OA2 composite images at 375px, 768px, and 1280px
    for (const vp of [
      { width: 375, height: 812, label: '375px' },
      { width: 768, height: 1024, label: '768px' },
      { width: 1280, height: 860, label: '1280px' },
    ]) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      for (const spec of ALL_IMAGES_TO_VERIFY) {
        const rows = await verifyQaHotspotsImage(
          page,
          spec.imageId,
          spec.filter,
          vp.label
        );
        allRows.push(...rows);
      }
    }

    // 2. Capture all 7 required deliverable screenshot pairs at 375px and 1280px
    await captureRequiredDeliverableScreenshots(page);

    const reportPath = path.join(OUT_DIR, 'phase2_hotspot_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(allRows, null, 2));
    console.log(
      `SUCCESS: All ${allRows.length} hotspot measurements across all 10 levels (375px, 768px, 1280px) PASSED!`
    );
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
