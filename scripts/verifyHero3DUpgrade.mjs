import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '/usr/local/share/bun-global/node_modules/playwright/index.mjs';

const BASE_URL = 'http://localhost:3000';
const SHOTS_DIR = path.resolve('.aistudio/artifacts/brain/ba5a6c32-a02f-42a5-ae88-8e4168b737fd/shots');
fs.mkdirSync(SHOTS_DIR, { recursive: true });

async function run() {
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-unsafe-swiftshader',
      '--ignore-gpu-blocklist',
    ],
  });

  const report = {
    desktop1440: {},
    interactions3D: {},
    mobile375: {},
    navigationCheck: {},
    consoleErrors: [],
  };

  try {
    // 1. Desktop 1440x900 Arabic (primary approved layout comparison)
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => report.consoleErrors.push(`pageerror: ${e.message}`));
    page.on('console', (m) => {
      if (m.type() === 'error' && !m.text().includes('WebSocket')) {
        report.consoleErrors.push(`console.error: ${m.text()}`);
      }
    });

    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="hero-3d-canvas-mount"] canvas', { timeout: 15000 });
    await page.waitForTimeout(900);

    // Pause idle rotation for crisp comparison screenshots
    await page.click('[data-testid="hero-3d-rotate-toggle"]');
    await page.waitForTimeout(250);

    await page.screenshot({ path: path.join(SHOTS_DIR, 'hero3d_after_1440_ar.png') });
    const stageLoc = page.locator('[data-testid="hero-visual-stage"]');
    const beforeDragBuf = await stageLoc.screenshot({
      path: path.join(SHOTS_DIR, 'hero3d_closeup.png'),
    });

    // Check layout integrity & absence of fictional vitals
    const domAudit = await page.evaluate(() => {
      const heroText = document.querySelector('[data-testid="homepage-hero-section"]')?.textContent || '';
      const canvas = document.querySelector('[data-testid="hero-3d-canvas-mount"] canvas');
      return {
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        hasCanvas: Boolean(canvas && canvas.width > 100 && canvas.height > 100),
        canvasSize: canvas ? { w: canvas.width, h: canvas.height } : null,
        hasHeadline: heroText.includes('التوعية بطوارئ الاختناق'),
        hasStartBtn: Boolean(document.querySelector('[data-testid="hero-start-simulation-btn"]')),
        hasLearnBtn: Boolean(document.querySelector('[data-testid="hero-explore-learning-btn"]')),
        hasFeatureCards: document.querySelectorAll('[data-testid^="feature-card-"]').length,
        hasFictionalVitals: heroText.includes('98%') || heroText.includes('bpm') || heroText.includes('مستوى الأكسجين'),
      };
    });
    report.desktop1440 = domAudit;

    // 2. Test REAL 3D drag rotation (horizontal + vertical)
    const box = await page.locator('[data-testid="hero-3d-canvas-mount"]').boundingBox();
    if (box) {
      const cx = box.x + box.width * 0.5;
      const cy = box.y + box.height * 0.45;
      await page.mouse.move(cx, cy);
      await page.mouse.down();
      await page.mouse.move(cx + 125, cy - 38, { steps: 12 });
      await page.mouse.up();
      await page.waitForTimeout(450);
    }
    const afterDragBuf = await stageLoc.screenshot({
      path: path.join(SHOTS_DIR, 'hero3d_rotated_3d.png'),
    });
    const dragChangedRender = Buffer.compare(beforeDragBuf, afterDragBuf) !== 0;

    // 3. Test Zoom In, Reset, Layers & Anatomy Selection (plus verify zero overlap)
    await page.click('[data-testid="hero-3d-zoom-in"]');
    await page.waitForTimeout(350);
    await page.click('[data-testid="hero-3d-layers-btn"]');
    await page.waitForTimeout(200);
    await page.click('[data-testid="hero-struct-btn-bronchial_tree"]');
    await page.waitForTimeout(700);
    const eduCardVisible = await page.locator('[data-testid="hero-anatomy-edu-card"]').isVisible();
    const eduCardText = await page.locator('[data-testid="hero-anatomy-edu-card"]').textContent();
    const panelAutoClosed = !(await page.locator('[data-testid="hero-3d-expanded-panel"]').isVisible());
    await stageLoc.screenshot({ path: path.join(SHOTS_DIR, 'hero3d_selected_anatomy.png') });

    // Re-open Layers panel while Edu Card is open to verify they stack cleanly with ZERO overlap
    await page.click('[data-testid="hero-3d-layers-btn"]');
    await page.waitForTimeout(250);
    const noUiOverlap = await page.evaluate(() => {
      const card = document.querySelector('[data-testid="hero-anatomy-edu-card"]')?.getBoundingClientRect();
      const panel = document.querySelector('[data-testid="hero-3d-expanded-panel"]')?.getBoundingClientRect();
      if (!card || !panel) return false;
      return card.bottom <= panel.top + 1;
    });

    // Toggle Torso layer off to verify real 3D layer control
    await page.click('[data-testid="hero-layer-toggle-body"]');
    await page.waitForTimeout(450);
    const afterLayerToggleBuf = await stageLoc.screenshot({
      path: path.join(SHOTS_DIR, 'hero3d_layer_toggle.png'),
    });
    const layerToggleChangedRender = Buffer.compare(afterDragBuf, afterLayerToggleBuf) !== 0;

    // Restore body layer, collapse panel & reset camera cleanly
    await page.click('[data-testid="hero-layer-toggle-body"]');
    await page.click('[data-testid="hero-3d-layers-btn"]');
    await page.click('[data-testid="hero-3d-reset"]');
    await page.waitForTimeout(950);

    // Test direct mouse click raycasting on 3D lungs
    let directRaycastSelected = false;
    if (box) {
      await page.mouse.click(box.x + box.width * 0.42, box.y + box.height * 0.48);
      await page.waitForTimeout(550);
      directRaycastSelected = await page.locator('[data-testid="hero-anatomy-edu-card"]').isVisible();
      if (directRaycastSelected) {
        await page.click('[data-testid="hero-anatomy-edu-close"]');
        await page.waitForTimeout(850);
      }
    }

    report.interactions3D = {
      dragChangedRender,
      eduCardVisible,
      eduCardHasArabicTitle: Boolean(eduCardText && eduCardText.includes('الشعب')),
      panelAutoClosed,
      noUiOverlap,
      layerToggleChangedRender,
      directRaycastSelected,
    };

    // 4. Switch to English & capture 1440x900
    const langBtn = page.locator('header button', { hasText: /EN|English/i }).first();
    if (await langBtn.isVisible()) {
      await langBtn.click();
      await page.waitForTimeout(550);
    }
    await page.screenshot({ path: path.join(SHOTS_DIR, 'hero3d_after_1440_en.png') });

    // 5. Verify primary CTA navigation still works
    await page.click('[data-testid="hero-start-simulation-btn"]');
    await page.waitForTimeout(500);
    report.navigationCheck.startSimulationWorks = await page.evaluate(
      () => document.body.innerText.includes('A2') || document.body.innerText.includes('Start')
    );
    await ctx.close();

    // 6. Mobile 375x812 Arabic
    const mobCtx = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const mobPage = await mobCtx.newPage();
    mobPage.on('pageerror', (e) => report.consoleErrors.push(`mob pageerror: ${e.message}`));
    await mobPage.goto(BASE_URL, { waitUntil: 'networkidle' });
    await mobPage.waitForSelector('[data-testid="hero-3d-canvas-mount"] canvas', { timeout: 15000 });
    await mobPage.waitForTimeout(850);
    await mobPage.screenshot({ path: path.join(SHOTS_DIR, 'hero3d_after_375_ar.png') });

    report.mobile375 = await mobPage.evaluate(() => {
      const c = document.querySelector('[data-testid="hero-3d-canvas-mount"] canvas');
      return {
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
        hasCanvas: Boolean(c && c.width > 100 && c.height > 100),
      };
    });
    await mobCtx.close();
  } finally {
    await browser.close();
  }

  console.log('=== HERO 3D UPGRADE VERIFICATION ===');
  console.log(JSON.stringify(report, null, 2));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
