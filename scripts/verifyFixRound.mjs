import { chromium } from '/usr/local/share/bun-global/node_modules/playwright/index.mjs';

const BASE = 'http://localhost:3000';

async function waitForWebGLReady(page) {
  await page.waitForTimeout(1600);
}

async function run() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl'],
  });

  const consoleErrors = [];
  const pageErrors = [];
  const report = {
    headerChecks: {},
    heroChecks: {},
    audioPages: {},
    mobileAudioTest: {},
  };

  try {
    // =========================================================================
    // 1. DESKTOP 1440x900: HEADER TOP, HEADER SCROLLED, HERO BUST & BOTTOM FADE ZOOM
    // =========================================================================
    const ctxDesktop = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    const page = await ctxDesktop.newPage();
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => pageErrors.push(String(err)));

    await page.goto(BASE, { waitUntil: 'networkidle' });
    await waitForWebGLReady(page);

    // Measure header & logo at scroll top
    const desktopHeaderTop = await page.evaluate(() => {
      const header = document.querySelector('[data-testid="site-header"]');
      const img = document.querySelector('[data-testid="nafas-logo-header"] img');
      const hRect = header.getBoundingClientRect();
      const iRect = img.getBoundingClientRect();
      return {
        headerHeight: Math.round(hRect.height),
        logoSrc: img.getAttribute('src'),
        naturalW: img.naturalWidth,
        naturalH: img.naturalHeight,
        logoW: Math.round(iRect.width),
        logoH: Math.round(iRect.height),
        topGapPx: Math.round(iRect.top - hRect.top),
        bottomGapPx: Math.round(hRect.bottom - iRect.bottom),
        overflowX: document.documentElement.scrollWidth > window.innerWidth,
      };
    });
    report.headerChecks.desktopTop = desktopHeaderTop;

    // Zoomed desktop header at scroll top
    await page.screenshot({
      path: '/tmp/shot_header_desktop_top.png',
      clip: { x: 0, y: 0, width: 1440, height: 110 },
    });

    // Full hero at 1440x900
    await page.screenshot({
      path: '/tmp/shot_hero_1440.png',
      clip: { x: 0, y: 0, width: 1440, height: 760 },
    });

    // Zoomed crop of the bottom fade edge of the 3D bust
    const bustRect = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="hero-3d-body-container"]');
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    });
    report.heroChecks.bust1440 = bustRect;
    await page.screenshot({
      path: '/tmp/shot_hero_bottom_fade_zoom.png',
      clip: {
        x: Math.max(0, Math.floor(bustRect.x - 40)),
        y: Math.max(0, Math.floor(bustRect.y + bustRect.height * 0.56)),
        width: Math.min(1440, Math.ceil(bustRect.width + 80)),
        height: Math.ceil(bustRect.height * 0.52),
      },
    });

    // Scroll down 500px and verify sticky header + logo not cropped
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(350);
    const desktopHeaderScrolled = await page.evaluate(() => {
      const header = document.querySelector('[data-testid="site-header"]');
      const img = document.querySelector('[data-testid="nafas-logo-header"] img');
      const hRect = header.getBoundingClientRect();
      const iRect = img.getBoundingClientRect();
      return {
        scrollY: Math.round(window.scrollY),
        headerTop: Math.round(hRect.top),
        headerHeight: Math.round(hRect.height),
        logoH: Math.round(iRect.height),
        topGapPx: Math.round(iRect.top - hRect.top),
        bottomGapPx: Math.round(hRect.bottom - iRect.bottom),
      };
    });
    report.headerChecks.desktopScrolled = desktopHeaderScrolled;
    await page.screenshot({
      path: '/tmp/shot_header_desktop_scrolled.png',
      clip: { x: 0, y: 0, width: 1440, height: 110 },
    });

    // =========================================================================
    // 2. HERO AT 1024x768 & 768x1024
    // =========================================================================
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await waitForWebGLReady(page);
    report.heroChecks.overflow1024 = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    await page.screenshot({
      path: '/tmp/shot_hero_1024.png',
      clip: { x: 0, y: 0, width: 1024, height: 740 },
    });

    await page.setViewportSize({ width: 768, height: 1024 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await waitForWebGLReady(page);
    report.heroChecks.overflow768 = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    await page.screenshot({
      path: '/tmp/shot_hero_768.png',
      clip: { x: 0, y: 0, width: 768, height: 960 },
    });

    // =========================================================================
    // 3. /credits, /qa/audio, AND LEVEL A2 SOUND PANEL (+ CUE OVERLAY)
    // =========================================================================
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE}/credits`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    report.audioPages.credits = await page.evaluate(() => ({
      heading: document.querySelector('[data-testid="credits-page-heading"]')?.textContent?.trim(),
      hasKevinMacLeod: document.body.innerText.includes('Kevin MacLeod'),
      hasCCBY4: document.body.innerText.includes('CC BY 4.0'),
      musicCards: document.querySelectorAll('[data-testid="credits-music-list"] article').length,
      sfxRows: document.querySelectorAll('[data-testid="credits-sfx-list"] tbody tr').length,
    }));
    await page.screenshot({ path: '/tmp/shot_credits.png', fullPage: false });

    await page.goto(`${BASE}/qa/audio`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    report.audioPages.qaAudio = await page.evaluate(() => ({
      heading: document.querySelector('[data-testid="qa-audio-heading"]')?.textContent?.trim(),
      hasExportBtn: Boolean(document.querySelector('[data-testid="qa-audio-export-json"]')),
      hasOverlayLink: Boolean(document.querySelector('[data-testid="qa-play-with-cue-overlay"]')),
      selectDropdowns: document.querySelectorAll('select').length,
      cueRows: document.querySelectorAll('table tbody tr').length,
    }));
    await page.screenshot({ path: '/tmp/shot_qa_audio.png', fullPage: false });

    await page.goto(`${BASE}/?level=A2&testStep=look&soundPanel=open&cueOverlay=1`, {
      waitUntil: 'networkidle',
    });
    await page.waitForTimeout(800);
    report.audioPages.a2SoundPanel = await page.evaluate(() => ({
      soundPanelVisible: Boolean(document.querySelector('[data-testid="level-sound-panel"]')),
      bodySoundsToggle: document.querySelector('[data-testid="body-sounds-toggle"]')?.getAttribute('aria-checked'),
      sensitivityNote: document.querySelector('[data-testid="body-sounds-sensitivity-note"]')?.textContent?.trim(),
      cueOverlayVisible: Boolean(document.querySelector('[data-testid="qa-live-cue-overlay"]')),
    }));
    await page.screenshot({ path: '/tmp/shot_a2_sound_panel.png', fullPage: false });
    await ctxDesktop.close();

    // =========================================================================
    // 4. MOBILE 375x812: HEADER TOP/SCROLLED, HERO BUST, AND MOBILE AUDIO TEST
    // =========================================================================
    const ctxMobile = await browser.newContext({
      viewport: { width: 375, height: 812 },
      deviceScaleFactor: 2,
      hasTouch: true,
      isMobile: true,
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    });
    const mPage = await ctxMobile.newPage();
    mPage.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    mPage.on('pageerror', (err) => pageErrors.push(String(err)));

    await mPage.goto(BASE, { waitUntil: 'networkidle' });
    await waitForWebGLReady(mPage);

    const mobileHeaderTop = await mPage.evaluate(() => {
      const header = document.querySelector('[data-testid="site-header"]');
      const img = document.querySelector('[data-testid="nafas-logo-header"] img');
      const cta = document.querySelector('[data-testid="hero-start-simulation-btn"]');
      const bust = document.querySelector('[data-testid="hero-3d-body-container"]');
      const hRect = header.getBoundingClientRect();
      const iRect = img.getBoundingClientRect();
      const cRect = cta.getBoundingClientRect();
      const bRect = bust.getBoundingClientRect();
      return {
        headerHeight: Math.round(hRect.height),
        logoH: Math.round(iRect.height),
        topGapPx: Math.round(iRect.top - hRect.top),
        bottomGapPx: Math.round(hRect.bottom - iRect.bottom),
        bustHeightPct: Math.round((bRect.height / window.innerHeight) * 100),
        ctaBottomY: Math.round(cRect.bottom),
        ctaVisibleNearFold: cRect.top < window.innerHeight + 40,
        overflowX: document.documentElement.scrollWidth > window.innerWidth,
      };
    });
    report.headerChecks.mobileTop = mobileHeaderTop;

    await mPage.screenshot({
      path: '/tmp/shot_header_mobile_top.png',
      clip: { x: 0, y: 0, width: 375, height: 96 },
    });
    await mPage.screenshot({
      path: '/tmp/shot_hero_375.png',
      clip: { x: 0, y: 0, width: 375, height: 812 },
    });

    await mPage.evaluate(() => window.scrollTo(0, 450));
    await mPage.waitForTimeout(300);
    report.headerChecks.mobileScrolled = await mPage.evaluate(() => {
      const header = document.querySelector('[data-testid="site-header"]');
      const img = document.querySelector('[data-testid="nafas-logo-header"] img');
      const hRect = header.getBoundingClientRect();
      const iRect = img.getBoundingClientRect();
      return {
        scrollY: Math.round(window.scrollY),
        headerTop: Math.round(hRect.top),
        headerHeight: Math.round(hRect.height),
        logoH: Math.round(iRect.height),
        topGapPx: Math.round(iRect.top - hRect.top),
        bottomGapPx: Math.round(hRect.bottom - iRect.bottom),
      };
    });
    await mPage.screenshot({
      path: '/tmp/shot_header_mobile_scrolled.png',
      clip: { x: 0, y: 0, width: 375, height: 96 },
    });

    // Mobile audio gesture unlock + asset HTTP 200 + zero-latency tap dispatch test
    const audioRequests = [];
    mPage.on('response', (res) => {
      if (res.url().includes('/audio/')) {
        audioRequests.push({ url: res.url().split('/audio/')[1], status: res.status() });
      }
    });

    await mPage.goto(`${BASE}/?level=A2&cueOverlay=1`, { waitUntil: 'networkidle' });
    await mPage.waitForTimeout(400);
    // Tap start button (user gesture unlock)
    const startBtn = mPage.locator('button').filter({ hasText: /ابدأ|Start/i }).first();
    if (await startBtn.count()) {
      await startBtn.tap();
      await mPage.waitForTimeout(900);
    }

    // Verify self-hosted MP3 & OGG fetch + AudioContext decode & rapid zero-latency tap timing
    const mobileAudioBench = await mPage.evaluate(async () => {
      const urls = [
        '/audio/music/music_calm_adult_2.mp3',
        '/audio/music/music_calm_adult_2.ogg',
        '/audio/sfx/sfx_back_blow_1.mp3',
        '/audio/sfx/sfx_thrust_1.mp3',
      ];
      const fetchStatuses = [];
      for (const u of urls) {
        const r = await fetch(u);
        fetchStatuses.push({ url: u, status: r.status, bytes: (await r.arrayBuffer()).byteLength });
      }
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx();
      await ctx.resume().catch(() => {});
      const raw = await (await fetch('/audio/sfx/sfx_back_blow_1.mp3')).arrayBuffer();
      const decoded = await ctx.decodeAudioData(raw);
      const t0 = performance.now();
      for (let i = 0; i < 5; i++) {
        const src = ctx.createBufferSource();
        src.buffer = decoded;
        const g = ctx.createGain();
        g.gain.value = 0.01;
        src.connect(g);
        g.connect(ctx.destination);
        src.start(ctx.currentTime + i * 0.02);
      }
      const dispatchMs = Number((performance.now() - t0).toFixed(2));
      await ctx.close();
      return {
        fetchStatuses,
        decodedDurationSec: Number(decoded.duration.toFixed(2)),
        fiveRapidTapsDispatchMs: dispatchMs,
      };
    });

    report.mobileAudioTest = {
      audioRequestsCaptured: audioRequests.slice(0, 12),
      ...mobileAudioBench,
    };

    await ctxMobile.close();
  } finally {
    await browser.close();
  }

  console.log(JSON.stringify({ report, consoleErrors, pageErrors }, null, 2));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
