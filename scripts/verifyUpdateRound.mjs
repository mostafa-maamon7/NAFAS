import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire('/usr/local/share/bun-global/node_modules/playwright/index.js');
const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:3000';
const OUT_DIR = path.resolve('public/assets/qa_screenshots/update_round');
fs.mkdirSync(OUT_DIR, { recursive: true });

async function assertNoOverflow(page, label) {
  const info = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
  }));
  if (info.scrollW > info.clientW + 1) {
    throw new Error(`Horizontal overflow at ${label}: scrollWidth=${info.scrollW} > clientWidth=${info.clientW}`);
  }
}

async function assertAllImagesLoaded(page, label) {
  const broken = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    return imgs
      .filter((img) => !img.complete || img.naturalWidth === 0)
      .map((img) => img.getAttribute('src'));
  });
  if (broken.length > 0) {
    throw new Error(`Broken images on ${label}: ${broken.join(', ')}`);
  }
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  try {
    // =========================================================================
    // 1. HEADER + LOGO + HERO CHECKS AT 1440, 1024, 768, 375
    // =========================================================================
    for (const vp of [
      { width: 1440, height: 900, label: '1440px', captureFull: true },
      { width: 1024, height: 800, label: '1024px', captureFull: false },
      { width: 768, height: 900, label: '768px', captureFull: false },
      { width: 375, height: 812, label: '375px', captureFull: true },
    ]) {
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2,
      });
      const page = await ctx.newPage();
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      await page.waitForTimeout(700);

      await assertNoOverflow(page, `Home ${vp.label}`);
      await assertAllImagesLoaded(page, `Home ${vp.label}`);

      // Verify logo uses nafas-logo-light.png with NO white plate background
      const logoCheck = await page.evaluate(() => {
        const header = document.querySelector('header');
        const img = header?.querySelector('img[alt="NAFAS نَفَس"]');
        if (!header || !img) return { ok: false, reason: 'Logo img not found in header' };
        const rect = img.getBoundingClientRect();
        const parentStyle = getComputedStyle(img.parentElement);
        const btnStyle = getComputedStyle(img.closest('button') || img.parentElement);
        const isTransparent = (bg) =>
          bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent';
        return {
          ok:
            img.getAttribute('src')?.includes('nafas-logo-light.png') &&
            isTransparent(parentStyle.backgroundColor) &&
            isTransparent(btnStyle.backgroundColor),
          src: img.getAttribute('src'),
          height: Math.round(rect.height),
          width: Math.round(rect.width),
          parentBg: parentStyle.backgroundColor,
          btnBg: btnStyle.backgroundColor,
        };
      });
      if (!logoCheck.ok) {
        throw new Error(`Logo check failed at ${vp.label}: ${JSON.stringify(logoCheck)}`);
      }

      // Desktop nav single-line & font-size check (lg breakpoint >= 1024)
      if (vp.width >= 1024) {
        const navInfo = await page.evaluate(() => {
          const navBtns = Array.from(document.querySelectorAll('header nav button'));
          return navBtns.map((b) => {
            const rect = b.getBoundingClientRect();
            const cs = getComputedStyle(b);
            return {
              text: b.textContent?.trim(),
              fontSize: parseFloat(cs.fontSize),
              height: Math.round(rect.height),
              top: Math.round(rect.top),
            };
          });
        });
        const tops = new Set(navInfo.map((n) => n.top));
        if (tops.size > 1) {
          throw new Error(`Nav wrapped onto multiple lines at ${vp.label}: ${JSON.stringify(navInfo)}`);
        }
        const smallFont = navInfo.find((n) => n.fontSize < 14.5);
        if (smallFont) {
          throw new Error(`Nav font too small at ${vp.label}: ${JSON.stringify(smallFont)}`);
        }
      }

      // Check hero text vs 3D viewer overlap at desktop/tablet
      const overlap = await page.evaluate(() => {
        const hero = document.querySelector('[data-testid="homepage-hero-section"]');
        if (!hero) return null;
        const h1 = hero.querySelector('h1');
        const viewer = hero.querySelector('canvas');
        if (!h1 || !viewer) return { overlapped: false };
        const r1 = h1.getBoundingClientRect();
        const r2 = viewer.getBoundingClientRect();
        const horizOverlap = Math.min(r1.right, r2.right) - Math.max(r1.left, r2.left);
        const vertOverlap = Math.min(r1.bottom, r2.bottom) - Math.max(r1.top, r2.top);
        return {
          overlapped: horizOverlap > 4 && vertOverlap > 4,
          h1Rect: { l: Math.round(r1.left), r: Math.round(r1.right), t: Math.round(r1.top), b: Math.round(r1.bottom) },
          viewerRect: { l: Math.round(r2.left), r: Math.round(r2.right), t: Math.round(r2.top), b: Math.round(r2.bottom) },
        };
      });
      if (overlap?.overlapped) {
        throw new Error(`Hero H1 overlaps 3D viewer at ${vp.label}: ${JSON.stringify(overlap)}`);
      }

      if (vp.captureFull) {
        // Zoomed Header screenshot
        const header = page.locator('header').first();
        await header.screenshot({ path: path.join(OUT_DIR, `header_logo_${vp.label}.png`) });
        // Hero screenshot
        await page.screenshot({ path: path.join(OUT_DIR, `hero_${vp.label}.png`) });
      }

      results.push(`PASS Home & Header ${vp.label} (logo=${logoCheck.width}x${logoCheck.height}px, no plate, no overflow)`);
      await ctx.close();
    }

    // =========================================================================
    // 2. LEVEL A2 WITH SOUND PANEL OPEN + NO SCENE/SLIDE NUMBERS + MUTE PERSISTENCE
    // =========================================================================
    for (const vp of [
      { width: 1440, height: 900, label: '1440px' },
      { width: 375, height: 812, label: '375px' },
    ]) {
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2,
      });
      const page = await ctx.newPage();
      await page.goto(`${BASE_URL}/?level=A2&testStep=look&soundPanel=open`, {
        waitUntil: 'networkidle',
      });
      await page.waitForTimeout(700);
      await assertNoOverflow(page, `Level A2 SoundPanel ${vp.label}`);
      await assertAllImagesLoaded(page, `Level A2 SoundPanel ${vp.label}`);

      // Verify Sound Panel is visible, captions toggle defaults OFF
      await page.locator('[data-testid="level-sound-panel"]').waitFor({ state: 'visible', timeout: 8000 });
      const captionsChecked = await page
        .locator('[data-testid="sound-captions-toggle"]')
        .getAttribute('aria-checked');
      if (captionsChecked !== 'false') {
        throw new Error(`Expected sound captions toggle OFF by default, got ${captionsChecked}`);
      }

      // Verify zero forbidden scene/slide/beat numbers in visible text
      const levelText = await page.locator('body').innerText();
      const forbidden = [
        /Scene\s*\d/i,
        /Slide\s*\d/i,
        /Beat\s*\d/i,
        /مشهد\s*[٠-٩0-9]/,
        /شريحة\s*[٠-٩0-9]/,
        /1\.\s*Watch/,
        /١\.\s*شاهد/,
        /Play with sound/i,
        /تشغيل بالصوت/,
      ];
      for (const rx of forbidden) {
        if (rx.test(levelText)) {
          throw new Error(`Forbidden label matched ${rx} in Level A2 at ${vp.label}`);
        }
      }

      await page.screenshot({ path: path.join(OUT_DIR, `level_sound_panel_${vp.label}.png`) });

      // Test 1-tap mute toggle & localStorage persistence on desktop
      if (vp.label === '1440px') {
        await page.locator('[data-testid="level-sound-mute-btn"]').click();
        await page.waitForTimeout(200);
        const prefsRaw = await page.evaluate(() => localStorage.getItem('nafas_audio_prefs_v2'));
        const prefs = prefsRaw ? JSON.parse(prefsRaw) : null;
        if (!prefs || prefs.muted !== true) {
          throw new Error(`Expected mute preference persisted in localStorage, got ${prefsRaw}`);
        }
        // Unmute back
        await page.locator('[data-testid="level-sound-mute-btn"]').click();
      }

      // Capture Level A2 Result screen
      await page.goto(`${BASE_URL}/?level=A2&testStep=result_correct`, {
        waitUntil: 'networkidle',
      });
      await page.waitForTimeout(700);
      await assertNoOverflow(page, `Level A2 Result ${vp.label}`);
      await assertAllImagesLoaded(page, `Level A2 Result ${vp.label}`);
      const resText = await page.locator('body').innerText();
      for (const rx of forbidden) {
        if (rx.test(resText)) {
          throw new Error(`Forbidden label matched ${rx} in Level A2 Result at ${vp.label}`);
        }
      }
      await page.screenshot({ path: path.join(OUT_DIR, `level_result_${vp.label}.png`) });

      results.push(`PASS Level A2 SoundPanel + Result ${vp.label}`);
      await ctx.close();
    }

    // =========================================================================
    // 3. NEW LEARN PAGE + TWO GUIDE DETAIL PAGES (1440px & 375px)
    // =========================================================================
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
      await page.waitForTimeout(500);

      // Navigate to Learning Hub via navbar (or mobile menu)
      if (vp.width >= 1024) {
        await page.locator('header nav button', { hasText: /^التعلّم$|^Learn$/ }).click();
      } else {
        await page.locator('header button[aria-label*="Menu"], header button[aria-label*="القائمة"]').click();
        await page.waitForTimeout(250);
        await page.locator('button:visible', { hasText: /^التعلّم$|^Learn$/ }).first().click();
      }

      await page.locator('[data-testid="learning-hub-view"]').waitFor({ state: 'visible', timeout: 8000 });
      await page.waitForTimeout(700);
      await assertNoOverflow(page, `Learn Page ${vp.label}`);
      await assertAllImagesLoaded(page, `Learn Page ${vp.label}`);

      // Verify exactly 6 guides
      const cardCount = await page.locator('[data-testid^="guide-card-"]').count();
      if (cardCount !== 6) {
        throw new Error(`Expected 6 guides on Learn page, found ${cardCount}`);
      }

      // Verify age filter has 4 options
      const ageBtnCount = await page.locator('[data-testid^="learn-age-btn-"]').count();
      if (ageBtnCount !== 4) {
        throw new Error(`Expected 4 age filter buttons, found ${ageBtnCount}`);
      }

      // Verify emergency numbers appear ONCE and have dir="ltr"
      const emergencyCount = await page.locator('[data-testid="emergency-numbers-ltr"]').count();
      const emergencyDir = await page.locator('[data-testid="emergency-numbers-ltr"]').first().getAttribute('dir');
      if (emergencyCount !== 1 || emergencyDir !== 'ltr') {
        throw new Error(`Emergency numbers check failed: count=${emergencyCount}, dir=${emergencyDir}`);
      }

      // Verify Learn page copy: zero AHA, zero min read, zero slide/scene numbers, emergency numbers not duplicated
      const learnBodyText = await page.locator('main').innerText();
      if (/\bAHA\b|American Heart/i.test(learnBodyText)) {
        throw new Error(`Found forbidden AHA mention on Learn page!`);
      }
      if (/min read|دقائق قراءة|شريحة|Slide\s*\d|Scene\s*\d/i.test(learnBodyText)) {
        throw new Error(`Found forbidden read-time/slide/scene label on Learn page!`);
      }
      const numOccurrences = (learnBodyText.match(/997/g) || []).length;
      if (numOccurrences !== 1) {
        throw new Error(`Expected emergency numbers (997) to appear exactly ONCE on Learn page, found ${numOccurrences}`);
      }

      const sourcesText = await page.locator('[data-testid="learn-sources-line"]').innerText();
      if (!sourcesText.includes('مجلس الإنعاش البريطاني') && !sourcesText.includes('Resuscitation Council UK')) {
        throw new Error(`Missing RCUK sources line: ${sourcesText}`);
      }

      await page.screenshot({ path: path.join(OUT_DIR, `learn_hub_${vp.label}.png`), fullPage: true });

      // Guide Detail 1: Mild or severe?
      await page.locator('[data-testid="guide-open-btn-mild-or-severe"]').click();
      await page.locator('[data-testid="guide-detail-mild-or-severe"]').waitFor({ state: 'visible', timeout: 8000 });
      await page.waitForTimeout(600);
      await assertNoOverflow(page, `Guide 1 ${vp.label}`);
      await assertAllImagesLoaded(page, `Guide 1 ${vp.label}`);
      await page.screenshot({ path: path.join(OUT_DIR, `guide_mild_vs_severe_${vp.label}.png`), fullPage: true });

      // Go back and open Guide 6: Special situations (with embedded Wheelchair & Choking Alone cards)
      await page.locator('[data-testid="guide-back-btn"]').click();
      await page.locator('[data-testid="guide-open-btn-special-situations"]').waitFor({ state: 'visible', timeout: 8000 });
      await page.locator('[data-testid="guide-open-btn-special-situations"]').click();
      await page.locator('[data-testid="guide-detail-special-situations"]').waitFor({ state: 'visible', timeout: 8000 });
      await page.waitForTimeout(600);
      await assertNoOverflow(page, `Guide 6 ${vp.label}`);
      await assertAllImagesLoaded(page, `Guide 6 ${vp.label}`);

      const guide6Text = await page.locator('main').innerText();
      if (guide6Text.includes('Try it')) {
        throw new Error(`Found untranslated "Try it" in Arabic mode on Guide 6!`);
      }
      await page.locator('[data-testid="guide-special-practice-cards"]').waitFor({ state: 'visible' });
      await page.screenshot({ path: path.join(OUT_DIR, `guide_special_situations_${vp.label}.png`), fullPage: true });

      // Also verify Guide 5 (Mistakes to avoid) loads cleanly with all images
      await page.locator('[data-testid="guide-back-btn"]').click();
      await page.locator('[data-testid="guide-open-btn-mistakes-to-avoid"]').click();
      await page.locator('[data-testid="guide-detail-mistakes-to-avoid"]').waitFor({ state: 'visible', timeout: 8000 });
      await page.waitForTimeout(500);
      await assertAllImagesLoaded(page, `Guide 5 ${vp.label}`);

      results.push(`PASS Learn Hub + Guide 1 + Guide 6 + Guide 5 ${vp.label}`);
      await ctx.close();
    }

    console.log('\n=== UPDATE ROUND VERIFICATION SUMMARY ===');
    for (const r of results) console.log(r);
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('VERIFICATION FAILED:', err);
  process.exit(1);
});
