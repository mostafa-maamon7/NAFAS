import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '/usr/local/share/bun-global/node_modules/playwright/index.mjs';

const BASE_URL = 'http://localhost:3000';
const SHOTS_DIR = path.resolve('.aistudio/artifacts/brain/ba5a6c32-a02f-42a5-ae88-8e4168b737fd/shots');
fs.mkdirSync(SHOTS_DIR, { recursive: true });

function rectsOverlap(a, b, pad = 2) {
  if (!a || !b) return false;
  return !(
    a.x + a.width - pad <= b.x ||
    b.x + b.width - pad <= a.x ||
    a.y + a.height - pad <= b.y ||
    b.y + b.height - pad <= a.y
  );
}

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
    hero: {},
    syncWarm: {},
    syncThrottled: {},
    qaAudio: {},
    consoleErrors: [],
  };

  try {
    // =========================================================================
    // 1. HERO DESKTOP 1440x900 (Intro, Settled AR, Settled EN, Hover, Zoom)
    // =========================================================================
    const deskCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await deskCtx.newPage();
    page.on('pageerror', (e) => report.consoleErrors.push(`pageerror: ${e.message}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().includes('WebSocket')) {
        report.consoleErrors.push(`console.error: ${msg.text()}`);
      }
    });

    // Ensure sessionStorage is clean so intro plays
    await page.addInitScript(() => {
      try {
        window.sessionStorage.removeItem('nafas_hero_intro_seen_v1');
      } catch {
        // ignore
      }
    });

    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-testid="homepage-hero-section"]', { timeout: 15000 });

    // Capture mid-intro (~900ms into 2.5s scan sequence)
    await page.waitForTimeout(950);
    await page.screenshot({ path: path.join(SHOTS_DIR, 'fix2_hero_intro_1440.png') });

    // Wait for intro to settle completely (~3.4s total)
    await page.waitForTimeout(2600);
    await page.screenshot({ path: path.join(SHOTS_DIR, 'fix2_hero_1440_ar.png') });

    // Measure overlap & layout metrics in AR desktop
    const layoutAr = await page.evaluate(() => {
      const box = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      };
      return {
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        textCol: box('[data-testid="hero-text-column"]'),
        headline: box('[data-testid="hero-main-headline"]'),
        cta: box('[data-testid="hero-start-simulation-btn"]'),
        visualStage: box('[data-testid="hero-visual-stage"]'),
        bodyBox: box('[data-testid="hero-3d-body-container"]'),
        chokingLabel: box('[data-testid="hero-choking-sign-label"]'),
        oxygenCard: box('[data-testid="hero-callout-oxygen"]'),
        heartCard: box('[data-testid="hero-callout-heart"]'),
        airwayCard: box('[data-testid="hero-callout-airway"]'),
        cycleToggle: box('[data-testid="hero-cycle-toggle"]'),
      };
    });

    // Zoomed crop of the 3D bust + hands area
    const bodyEl = page.locator('[data-testid="hero-visual-stage"]');
    await bodyEl.screenshot({ path: path.join(SHOTS_DIR, 'fix2_hero_hands_zoom.png') });

    // Hover Oxygen callout to verify highlight interaction
    await page.locator('[data-testid="hero-callout-oxygen"]').hover();
    await page.waitForTimeout(350);
    await page.screenshot({ path: path.join(SHOTS_DIR, 'fix2_hero_hover_1440.png') });

    // Switch to English via header toggle
    const langBtn = page.locator('header button', { hasText: /EN|English/i }).first();
    if (await langBtn.isVisible()) {
      await langBtn.click();
      await page.waitForTimeout(500);
    }
    await page.screenshot({ path: path.join(SHOTS_DIR, 'fix2_hero_1440_en.png') });

    const layoutEn = await page.evaluate(() => {
      const box = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      };
      return {
        headline: box('[data-testid="hero-main-headline"]'),
        chokingLabel: box('[data-testid="hero-choking-sign-label"]'),
        oxygenCard: box('[data-testid="hero-callout-oxygen"]'),
        heartCard: box('[data-testid="hero-callout-heart"]'),
        airwayCard: box('[data-testid="hero-callout-airway"]'),
      };
    });

    // Verify CTA click is NEVER blocked by effects
    await page.locator('[data-testid="hero-start-simulation-btn"]').click();
    await page.waitForTimeout(600);
    const navigatedAfterCta = await page.evaluate(() => ({
      url: window.location.href,
      hasSimHeading: document.body.innerText.includes('A1') || document.body.innerText.includes('A2'),
    }));

    report.hero.desktop = {
      horizontalOverflow: layoutAr.scrollWidth > layoutAr.innerWidth,
      arHeadlineOverlapsOxygen: rectsOverlap(layoutAr.headline, layoutAr.oxygenCard),
      arHeadlineOverlapsHeart: rectsOverlap(layoutAr.headline, layoutAr.heartCard),
      arHeadlineOverlapsAirway: rectsOverlap(layoutAr.headline, layoutAr.airwayCard),
      arHeadlineOverlapsChokingLabel: rectsOverlap(layoutAr.headline, layoutAr.chokingLabel),
      arOxygenOverlapsHeart: rectsOverlap(layoutAr.oxygenCard, layoutAr.heartCard),
      arChokingLabelOverlapsAirway: rectsOverlap(layoutAr.chokingLabel, layoutAr.airwayCard),
      enHeadlineOverlapsOxygen: rectsOverlap(layoutEn.headline, layoutEn.oxygenCard),
      enHeadlineOverlapsHeart: rectsOverlap(layoutEn.headline, layoutEn.heartCard),
      enHeadlineOverlapsAirway: rectsOverlap(layoutEn.headline, layoutEn.airwayCard),
      enHeadlineOverlapsChokingLabel: rectsOverlap(layoutEn.headline, layoutEn.chokingLabel),
      ctaClickWorked: navigatedAfterCta.hasSimHeading,
      boxesAr: {
        headline: layoutAr.headline,
        chokingLabel: layoutAr.chokingLabel,
        oxygenCard: layoutAr.oxygenCard,
        heartCard: layoutAr.heartCard,
        airwayCard: layoutAr.airwayCard,
      },
    };
    await deskCtx.close();

    // =========================================================================
    // 2. HERO MOBILE 375x812 + REDUCED MOTION CHECK
    // =========================================================================
    const mobCtx = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const mobPage = await mobCtx.newPage();
    await mobPage.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await mobPage.waitForSelector('[data-testid="homepage-hero-section"]', { timeout: 15000 });
    await mobPage.waitForTimeout(3200);
    await mobPage.screenshot({ path: path.join(SHOTS_DIR, 'fix2_hero_375_ar.png') });

    const mobMetrics = await mobPage.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      mobileChokingLabelVisible: Boolean(
        document.querySelector('[data-testid="hero-choking-sign-label-mobile"]')?.getBoundingClientRect().height
      ),
    }));
    report.hero.mobile375 = {
      horizontalOverflow: mobMetrics.scrollWidth > mobMetrics.innerWidth,
      scrollWidth: mobMetrics.scrollWidth,
      innerWidth: mobMetrics.innerWidth,
      mobileChokingLabelVisible: mobMetrics.mobileChokingLabelVisible,
    };
    await mobCtx.close();

    // Reduced-motion check
    const rmCtx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce',
    });
    const rmPage = await rmCtx.newPage();
    await rmPage.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await rmPage.waitForSelector('[data-testid="homepage-hero-section"]', { timeout: 15000 });
    await rmPage.waitForTimeout(400);
    const rmCheck = await rmPage.evaluate(() => ({
      cycleTogglePresent: Boolean(document.querySelector('[data-testid="hero-cycle-toggle"]')),
      oxygenText: document.querySelector('[data-testid="hero-callout-oxygen"]')?.textContent || '',
    }));
    report.hero.reducedMotion = {
      cycleToggleHidden: !rmCheck.cycleTogglePresent,
      oxygenSettledImmediately: rmCheck.oxygenText.includes('98%'),
    };
    await rmCtx.close();

    // =========================================================================
    // 3. SYNC TEST A — WARM CACHE (Level A2: S1 -> S5 -> Look -> Decide -> OA1 -> OA2)
    // =========================================================================
    const warmCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const warmPage = await warmCtx.newPage();
    await warmPage.goto(`${BASE_URL}/?level=A2`, { waitUntil: 'networkidle' });
    await warmPage.waitForSelector('[data-testid="title-card-start-btn"]', { timeout: 15000 });
    // Let background preloader warm up S1..S5
    await warmPage.waitForTimeout(900);
    await warmPage.click('[data-testid="title-card-start-btn"]');
    await warmPage.waitForSelector('[data-testid="shared-scene-container"]', { timeout: 10000 });
    await warmPage.waitForTimeout(650);

    const warmSamples = [];
    let warmDesyncCount = 0;
    const warmDesyncDetails = [];
    const beatScreenshots = [];

    async function sampleSync(p, label) {
      const s = await p.evaluate(() => {
        const container = document.querySelector('[data-testid="shared-scene-container"]');
        const capBar = document.querySelector('[data-testid="scene-caption-bar"]');
        const capText = document.querySelector('[data-testid="scene-caption-text"]');
        const loadingBar = document.querySelector('[data-testid="scene-loading-bar"]');
        return {
          sceneImgId: container?.getAttribute('data-committed-image-id') || null,
          activeHref: container?.getAttribute('data-active-href') || null,
          activeSlot: container?.getAttribute('data-active-slot') || null,
          capImgId: capBar?.getAttribute('data-committed-image-id') || null,
          capTextImgId: capText?.getAttribute('data-caption-image-id') || null,
          phase: capBar?.getAttribute('data-committed-phase') || null,
          beatIdx: capBar?.getAttribute('data-committed-beat-idx') || null,
          outcomeIdx: capBar?.getAttribute('data-committed-outcome-idx') || null,
          captionLen: (capText?.textContent || '').trim().length,
          loadingVisible: Boolean(loadingBar),
        };
      });
      if (s.sceneImgId && s.capImgId && (s.sceneImgId !== s.capImgId || s.sceneImgId !== s.capTextImgId)) {
        warmDesyncCount++;
        warmDesyncDetails.push({ label, ...s });
      }
      if (s.sceneImgId && !s.activeHref) {
        warmDesyncCount++;
        warmDesyncDetails.push({ label: `${label}-empty-href`, ...s });
      }
      warmSamples.push({ label, ...s });
      return s;
    }

    // Screenshot S1
    await sampleSync(warmPage, 'S1');
    const s1Shot = await warmPage.locator('[data-testid="shared-scene-container"]').screenshot({
      path: path.join(SHOTS_DIR, 'fix2_sync_A2_S1.png'),
    });
    beatScreenshots.push({ beat: 'S1', bytes: s1Shot.length, buf: s1Shot });

    // Advance S1 -> S2 -> S3 -> S4 -> S5
    for (let step = 2; step <= 5; step++) {
      await warmPage.click('[data-testid="watch-next-btn"]');
      // Poll DOM every 25ms across the transition & 400ms crossfade
      for (let i = 0; i < 20; i++) {
        await sampleSync(warmPage, `S${step}-poll-${i}`);
        await warmPage.waitForTimeout(25);
      }
      const shot = await warmPage.locator('[data-testid="shared-scene-container"]').screenshot({
        path: path.join(SHOTS_DIR, `fix2_sync_A2_S${step}.png`),
      });
      beatScreenshots.push({ beat: `S${step}`, bytes: shot.length, buf: shot });
    }

    // Check every consecutive beat screenshot differs (proving images actually changed in sync)
    const distinctChecks = [];
    for (let i = 1; i < beatScreenshots.length; i++) {
      const prev = beatScreenshots[i - 1];
      const curr = beatScreenshots[i];
      const identical = Buffer.compare(prev.buf, curr.buf) === 0;
      distinctChecks.push({ pair: `${prev.beat}->${curr.beat}`, distinct: !identical });
    }

    // Advance S5 -> Look
    await warmPage.click('[data-testid="watch-next-btn"]');
    for (let i = 0; i < 16; i++) {
      await sampleSync(warmPage, `Look-poll-${i}`);
      await warmPage.waitForTimeout(25);
    }

    // Check webp format usage & warm metrics from window.__NAFAS_SYNC_METRICS__
    const warmSyncMetrics = await warmPage.evaluate(() => ({
      metrics: window.__NAFAS_SYNC_METRICS__ || [],
      activeHref: document.querySelector('[data-testid="shared-scene-container"]')?.getAttribute('data-active-href'),
    }));

    const warmLatencies = warmSyncMetrics.metrics.map((m) => ({
      imageId: m.targetImageId,
      latencyMs: Math.round(m.latencyMs * 10) / 10,
      wasCacheWarm: m.wasCacheWarm,
    }));
    const maxWarmMs = warmLatencies.reduce((acc, m) => Math.max(acc, m.latencyMs), 0);

    report.syncWarm = {
      samplesChecked: warmSamples.length,
      desyncFrames: warmDesyncCount,
      desyncDetails: warmDesyncDetails,
      usesWebp: String(warmSyncMetrics.activeHref || '').endsWith('.webp'),
      distinctBeatScreenshots: distinctChecks,
      latenciesMs: warmLatencies,
      maxLatencyMs: maxWarmMs,
      under150ms: warmLatencies.length > 0 && maxWarmMs < 150,
    };
    await warmCtx.close();

    // =========================================================================
    // 4. SYNC TEST B — THROTTLED FAST 3G + 4x CPU + COLD CACHE + RAPID TAPS
    // =========================================================================
    const slowCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const slowPage = await slowCtx.newPage();
    const cdp = await slowCtx.newCDPSession(slowPage);

    // Load the app shell first, then enable strict cold-cache + Fast 3G + 4x CPU right before starting level
    await slowPage.goto(`${BASE_URL}/?level=A2`, { waitUntil: 'domcontentloaded' });
    await slowPage.waitForSelector('[data-testid="title-card-start-btn"]', { timeout: 20000 });

    // Clear preloader in-memory cache + unregister SW cache + enable CDP network & CPU throttling
    await slowPage.evaluate(async () => {
      window.__NAFAS_IMAGE_PRELOADER__?.clearCacheForTests?.();
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
    });
    await cdp.send('Network.enable');
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150, // Fast 3G RTT 150ms
      downloadThroughput: (1.6 * 1024 * 1024) / 8, // 1.6 Mbps
      uploadThroughput: (750 * 1024) / 8,
    });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

    await slowPage.click('[data-testid="title-card-start-btn"]');
    await slowPage.waitForSelector('[data-testid="shared-scene-container"]', { timeout: 20000 });
    await slowPage.waitForTimeout(450);

    // Clear cache again right before rapid clicking so S2/S3/S4 MUST fetch over Fast 3G!
    await slowPage.evaluate(() => {
      window.__NAFAS_IMAGE_PRELOADER__?.clearCacheForTests?.();
    });

    let slowDesyncCount = 0;
    const slowDesyncDetails = [];
    let sawLoadingBar = false;
    let slowSamples = 0;
    const transitionsSeen = new Set();

    // Fire 3 rapid clicks to test queued taps + slow network decode gating
    for (let clickNum = 1; clickNum <= 3; clickNum++) {
      await slowPage.evaluate(() => {
        const btn = document.querySelector('[data-testid="watch-next-btn"]');
        if (btn) btn.click();
      });
      await slowPage.waitForTimeout(80);
    }

    // Continuously sample DOM every 40ms for 4.5 seconds while throttled beats load & commit
    for (let i = 0; i < 110; i++) {
      const s = await slowPage.evaluate(() => {
        const container = document.querySelector('[data-testid="shared-scene-container"]');
        const capBar = document.querySelector('[data-testid="scene-caption-bar"]');
        const capText = document.querySelector('[data-testid="scene-caption-text"]');
        const loadingBar = document.querySelector('[data-testid="scene-loading-bar"]');
        return {
          sceneImgId: container?.getAttribute('data-committed-image-id') || null,
          activeHref: container?.getAttribute('data-active-href') || null,
          capImgId: capBar?.getAttribute('data-committed-image-id') || null,
          capTextImgId: capText?.getAttribute('data-caption-image-id') || null,
          beatIdx: capBar?.getAttribute('data-committed-beat-idx') || null,
          loadingVisible: Boolean(loadingBar),
        };
      });
      slowSamples++;
      if (s.loadingVisible) sawLoadingBar = true;
      if (s.sceneImgId) transitionsSeen.add(s.sceneImgId);
      if (s.sceneImgId && s.capImgId && (s.sceneImgId !== s.capImgId || s.sceneImgId !== s.capTextImgId)) {
        slowDesyncCount++;
        slowDesyncDetails.push({ sample: i, ...s });
      }
      await slowPage.waitForTimeout(40);
    }

    const slowMetrics = await slowPage.evaluate(() => window.__NAFAS_SYNC_METRICS__ || []);
    report.syncThrottled = {
      profile: 'Fast 3G (1.6 Mbps, 150ms RTT) + 4x CPU + Cold Cache + 3 Rapid Queued Taps',
      samplesChecked: slowSamples,
      desyncFrames: slowDesyncCount,
      desyncDetails: slowDesyncDetails,
      sawLoadingBar,
      committedImagesSeen: Array.from(transitionsSeen),
      recordedTransitions: slowMetrics.map((m) => ({
        imageId: m.targetImageId,
        latencyMs: Math.round(m.latencyMs),
        wasCacheWarm: m.wasCacheWarm,
      })),
    };
    await slowCtx.close();

    // =========================================================================
    // 5. /qa/audio MIX CONSOLE SCREENSHOT & VERIFICATION
    // =========================================================================
    const qaCtx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const qaPage = await qaCtx.newPage();
    await qaPage.goto(`${BASE_URL}/qa/audio`, { waitUntil: 'networkidle' });
    await qaPage.waitForSelector('[data-testid="qa-audio-mix-section"]', { timeout: 15000 });
    await qaPage.waitForTimeout(400);
    await qaPage.screenshot({ path: path.join(SHOTS_DIR, 'fix2_qa_audio_mix.png'), fullPage: false });

    const qaCheck = await qaPage.evaluate(() => ({
      hasMixSection: Boolean(document.querySelector('[data-testid="qa-audio-mix-section"]')),
      hasExportBtn: Boolean(document.querySelector('[data-testid="qa-audio-export-json"]')),
      hasPlayCueOverlay: Boolean(document.querySelector('[data-testid="qa-play-with-cue-overlay"]')),
      categoryCardsCount: document.querySelectorAll('[data-testid^="qa-mix-cat-"]').length,
      cueRowsCount: document.querySelectorAll('[data-testid="qa-cue-mix-table"] tbody tr').length,
    }));
    report.qaAudio = qaCheck;
    await qaCtx.close();
  } finally {
    await browser.close();
  }

  console.log('=== FIX ROUND 2 VERIFICATION REPORT ===');
  console.log(JSON.stringify(report, null, 2));
}

run().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
