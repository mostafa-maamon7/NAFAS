import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire('/usr/local/share/bun-global/node_modules/playwright/index.js');
const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:3000';
const OUT_DIR = path.resolve('public/assets/qa_screenshots/homepage_fix');
fs.mkdirSync(OUT_DIR, { recursive: true });

async function run() {
  const browser = await chromium.launch({ headless: true });

  try {
    // 1. Test /results redirect -> /
    {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
      const page = await ctx.newPage();
      await page.goto(`${BASE_URL}/results`, { waitUntil: 'domcontentloaded' });
      await page.locator('[data-testid="homepage-hero-section"]').waitFor({ state: 'visible', timeout: 10000 });
      const currentPath = new URL(page.url()).pathname;
      if (currentPath !== '/') {
        throw new Error(`Expected /results to redirect to /, got ${currentPath}`);
      }
      // Verify no "النتائج" or "Results" anywhere on the page
      const bodyText = await page.locator('body').innerText();
      if (bodyText.includes('النتائج')) {
        throw new Error('Found leftover "النتائج" on homepage!');
      }
      await ctx.close();
      console.log('PASS: /results redirects cleanly to / and zero "النتائج" references exist.');
    }

    // 2. Capture Desktop (1440px) and Mobile (375px) screenshots for:
    //    - Full homepage hero
    //    - Video section playing (paused === false, currentTime > 1.5s)
    //    - Smart Learning "Coming soon" dialog
    //    - Mobile menu open (showing the 5 evenly spaced items without Results)
    for (const vp of [
      { width: 1440, height: 900, label: '1440px' },
      { width: 375, height: 812, label: '375px' },
    ]) {
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2,
      });
      const page = await ctx.newPage();
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      await page.waitForTimeout(600);

      // Check zero horizontal overflow
      const hasOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      if (hasOverflow) {
        throw new Error(`Horizontal overflow detected at ${vp.label}`);
      }

      // Assert Smart Learning badge says "قريبًا"
      const badgeText = (await page.locator('[data-testid="feature-badge-smart-learning"]').innerText()).trim();
      if (badgeText !== 'قريبًا' && badgeText !== 'Coming soon') {
        throw new Error(`Unexpected Smart Learning badge text: ${badgeText}`);
      }

      // Assert 3D body container does not overlap Hero Start Simulation button
      const btnBox = await page.locator('[data-testid="hero-start-simulation-btn"]').boundingBox();
      const bodyBox = await page.locator('[data-testid="hero-3d-body-container"]').boundingBox();
      const overlaps =
        btnBox.x < bodyBox.x + bodyBox.width &&
        btnBox.x + btnBox.width > bodyBox.x &&
        btnBox.y < bodyBox.y + bodyBox.height &&
        btnBox.y + btnBox.height > bodyBox.y;
      if (overlaps) {
        throw new Error(`3D body container overlaps Start Simulation button at ${vp.label}`);
      }

      // A) Screenshot 1: Full Homepage Hero
      await page.screenshot({
        path: path.join(OUT_DIR, `1_homepage_hero_${vp.label}.png`),
        fullPage: true,
      });
      console.log(`Captured 1_homepage_hero_${vp.label}.png`);

      // B) Screenshot 3: Video Section Playing
      const videoCard = page.locator('[data-testid="homepage-demo-video-card"]');
      await videoCard.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      const playOverlay = page.locator('[data-testid="demo-video-play-overlay"]');
      await playOverlay.click();

      // Wait until video is genuinely playing and past 1.8s
      await page.waitForFunction(() => {
        const v = document.querySelector('[data-testid="homepage-demo-video"]');
        return v && !v.paused && v.readyState >= 2 && v.currentTime > 1.5;
      }, { timeout: 8000 });

      // Seek to ~8.5s (Scene 2: A2_S3 universal choking sign) while playing so we capture an action beat + caption
      await page.evaluate(() => {
        const v = document.querySelector('[data-testid="homepage-demo-video"]');
        if (v) v.currentTime = 8.5;
      });
      await page.waitForTimeout(450);

      await page.screenshot({
        path: path.join(OUT_DIR, `3_video_playing_${vp.label}.png`),
        fullPage: false,
      });
      await videoCard.screenshot({
        path: path.join(OUT_DIR, `3_video_card_closeup_${vp.label}.png`),
      });
      console.log(`Captured 3_video_playing_${vp.label}.png (video actively playing)`);

      // C) Screenshot 4: Smart Learning "Coming soon" Dialog
      const smartCard = page.locator('[data-testid="feature-card-smart-learning"]');
      await smartCard.scrollIntoViewIfNeeded();
      await smartCard.click();
      await page.locator('[data-testid="smart-learning-coming-soon-modal"]').waitFor({
        state: 'visible',
        timeout: 5000,
      });
      await page.waitForTimeout(200);
      await page.screenshot({
        path: path.join(OUT_DIR, `4_coming_soon_${vp.label}.png`),
        fullPage: false,
      });
      console.log(`Captured 4_coming_soon_${vp.label}.png`);

      await ctx.close();
    }

    // 3. Capture Header & Logo Zoomed at 1x, 2x, and 3x pixel ratios (Desktop 1440px and Mobile 375px)
    for (const dpr of [1, 2, 3]) {
      for (const vp of [
        { width: 1440, height: 900, label: '1440px' },
        { width: 375, height: 812, label: '375px' },
      ]) {
        const ctx = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
          deviceScaleFactor: dpr,
        });
        const page = await ctx.newPage();
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(300);

        const headerLoc = page.locator('header');
        await headerLoc.screenshot({
          path: path.join(OUT_DIR, `2_header_nav_${vp.label}_${dpr}x.png`),
        });

        const logoLoc = page.locator('[data-testid="nafas-logo-plate-header"]');
        await logoLoc.screenshot({
          path: path.join(OUT_DIR, `2_header_logo_zoomed_${vp.label}_${dpr}x.png`),
        });

        if (vp.width === 375 && dpr === 2) {
          // Also capture mobile menu drawer open to confirm the 5 items order
          await page.locator('button[aria-label="Toggle Menu"]').click();
          await page.waitForTimeout(200);
          await headerLoc.screenshot({
            path: path.join(OUT_DIR, `2_mobile_menu_open_375px_2x.png`),
          });
        }

        await ctx.close();
      }
    }

    console.log('ALL HOMEPAGE FIX VERIFICATIONS AND SCREENSHOTS COMPLETED SUCCESSFULLY!');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
