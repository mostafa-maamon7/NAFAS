import { StoryLevel } from '../types/nafas';
import { resolveStoryMedia } from '../data/storyMedia';

export interface BeatSyncMetric {
  levelId: string;
  targetImageId: string;
  src: string;
  wasCacheWarm: boolean;
  tapTimestampMs: number;
  commitTimestampMs: number;
  latencyMs: number;
}

const DECODE_TIMEOUT_MS = 1800;

/**
 * Fallback helper: if a /assets/levels/webp/ID.webp image fails to load,
 * fall back cleanly to /assets/levels/ID.png.
 */
function getPngFallbackUrl(url: string): string | null {
  const match = url.match(/^(.*\/assets\/levels)\/webp\/([A-Za-z0-9_]+)\.webp(\?.*)?$/i);
  if (!match) return null;
  return `${match[1]}/${match[2]}.png${match[3] || ''}`;
}

/**
 * Global image preloader and decode cache for NAFAS cinematic levels.
 * Keeps references to decoded HTMLImageElement instances so the browser
 * never evicts them from the decoded image cache during a session,
 * eliminating blank frames, flicker, or caption-ahead-of-image lag.
 */
class NafasImagePreloader {
  private decodedCache = new Map<string, HTMLImageElement>();
  private inFlight = new Map<string, Promise<boolean>>();
  private resolvedFallbackUrl = new Map<string, string>();
  private preloadedLevels = new Set<string>();
  private metrics: BeatSyncMetric[] = [];

  /** Synchronous check: is this URL already fully loaded & decoded in memory? */
  public isDecoded(url: string): boolean {
    if (!url) return false;
    const img = this.decodedCache.get(url);
    return Boolean(img && img.complete && img.naturalWidth > 0);
  }

  /** Returns the final resolved URL (in case a WebP fell back to PNG) */
  public getResolvedUrl(url: string): string {
    return this.resolvedFallbackUrl.get(url) ?? url;
  }

  /**
   * Fetch and fully decode an image via img.decode() with a safety timeout
   * and automatic .webp -> .png fallback so transitions never hang.
   */
  public preloadAndDecode(
    url: string,
    priority: 'high' | 'low' | 'auto' = 'auto'
  ): Promise<boolean> {
    if (!url || typeof window === 'undefined') {
      return Promise.resolve(false);
    }

    if (this.isDecoded(url)) {
      return Promise.resolve(true);
    }

    const existing = this.inFlight.get(url);
    if (existing) {
      return existing;
    }

    const loadSingleUrl = (srcToLoad: string): Promise<HTMLImageElement | null> =>
      new Promise<HTMLImageElement | null>((resolve) => {
        const img = new Image();
        img.decoding = 'async';
        if ('fetchPriority' in img) {
          (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority =
            priority;
        }

        let settled = false;
        const finish = (result: HTMLImageElement | null) => {
          if (settled) return;
          settled = true;
          window.clearTimeout(timeoutId);
          resolve(result);
        };

        const timeoutId = window.setTimeout(() => {
          finish(img.complete && img.naturalWidth > 0 ? img : null);
        }, DECODE_TIMEOUT_MS);

        const finalizeDecode = () => {
          if (typeof img.decode === 'function') {
            img
              .decode()
              .then(() => finish(img))
              .catch(() => finish(img.naturalWidth > 0 ? img : null));
          } else {
            finish(img.naturalWidth > 0 ? img : null);
          }
        };

        img.onload = finalizeDecode;
        img.onerror = () => finish(null);
        img.src = srcToLoad;

        if (img.complete && img.naturalWidth > 0) {
          finalizeDecode();
        }
      });

    const promise = (async () => {
      let decoded = await loadSingleUrl(url);
      if (!decoded) {
        const fallback = getPngFallbackUrl(url);
        if (fallback) {
          decoded = await loadSingleUrl(fallback);
          if (decoded) {
            this.resolvedFallbackUrl.set(url, fallback);
          }
        }
      }
      if (decoded) {
        this.decodedCache.set(url, decoded);
      }
      this.inFlight.delete(url);
      return Boolean(decoded);
    })();

    this.inFlight.set(url, promise);
    return promise;
  }

  /**
   * Collect all unique image URLs for a level in viewing order:
   * S1 -> S2 -> S3 -> S4 -> S5 -> OA1 -> OA2 -> OA3 -> OB -> OC
   */
  public getLevelImageUrls(level: StoryLevel): {
    beatUrls: string[];
    outcomeUrls: string[];
    allUrls: string[];
  } {
    const beatUrls: string[] = [];
    for (const beat of level.storyBeats) {
      const src = resolveStoryMedia(beat.mediaKey).src;
      if (src && !beatUrls.includes(src)) {
        beatUrls.push(src);
      }
    }

    const outcomeUrls: string[] = [];
    const optimal = level.decisionNode.choices.find((c) => c.outcome === 'optimal');
    const wrongs = level.decisionNode.choices.filter((c) => c.outcome !== 'optimal');

    const pushChoiceFrames = (choice?: StoryLevel['decisionNode']['choices'][number]) => {
      if (!choice) return;
      if (choice.consequenceBeat.playbackFrames?.length) {
        for (const frame of choice.consequenceBeat.playbackFrames) {
          const src = resolveStoryMedia(frame.mediaKey).src;
          if (src && !outcomeUrls.includes(src) && !beatUrls.includes(src)) {
            outcomeUrls.push(src);
          }
        }
      } else {
        const src = resolveStoryMedia(choice.consequenceBeat.mediaKey).src;
        if (src && !outcomeUrls.includes(src) && !beatUrls.includes(src)) {
          outcomeUrls.push(src);
        }
      }
    };

    pushChoiceFrames(optimal);
    for (const wrong of wrongs) {
      pushChoiceFrames(wrong);
    }

    return {
      beatUrls,
      outcomeUrls,
      allUrls: [...beatUrls, ...outcomeUrls],
    };
  }

  /**
   * Fast parallel batch preloader:
   * - Immediately fetches & decodes S1 + S2 + S3 with high priority in parallel.
   * - Then decodes remaining beats & outcomes in parallel batches (concurrency 5)
   *   so every single frame of the level is warm within ~150-300ms.
   */
  public preloadLevelSequence(level: StoryLevel): void {
    const { beatUrls, outcomeUrls } = this.getLevelImageUrls(level);
    if (beatUrls.length === 0) return;

    const alreadyAllDecoded = [...beatUrls, ...outcomeUrls].every((u) =>
      this.isDecoded(u)
    );
    if (alreadyAllDecoded) return;

    if (this.preloadedLevels.has(level.id)) {
      // Still kick off any stragglers without duplicating full queue
      const missing = [...beatUrls, ...outcomeUrls].filter(
        (u) => !this.isDecoded(u)
      );
      missing.slice(0, 6).forEach((u) => {
        void this.preloadAndDecode(u, 'high');
      });
      return;
    }
    this.preloadedLevels.add(level.id);

    // Wave 1: S1, S2, S3 in parallel at high priority for instant opening & first clicks
    const wave1 = beatUrls.slice(0, 3);
    const wave2 = [...beatUrls.slice(3), ...outcomeUrls];

    Promise.all(wave1.map((url) => this.preloadAndDecode(url, 'high'))).then(
      async () => {
        // Wave 2: remaining beats & outcomes in parallel batches of 5
        const batchSize = 5;
        for (let i = 0; i < wave2.length; i += batchSize) {
          const batch = wave2.slice(i, i + batchSize);
          await Promise.all(
            batch.map((url) => this.preloadAndDecode(url, 'auto'))
          );
        }
      }
    );
  }

  /** Respect user Data-Saver or very slow cellular connections for speculative background prefetching */
  public shouldConserveBandwidth(): boolean {
    if (typeof navigator === 'undefined') return false;
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (!conn) return false;
    return Boolean(
      conn.saveData ||
        conn.effectiveType === 'slow-2g' ||
        conn.effectiveType === '2g'
    );
  }

  /** Soft viewport-proximity warm-up: quietly decode Beat 1 (S1) at low priority */
  public prefetchLevelCover(level: StoryLevel): void {
    if (this.shouldConserveBandwidth()) return;
    const firstBeat = level.storyBeats[0];
    if (!firstBeat) return;
    const src = resolveStoryMedia(firstBeat.mediaKey).src;
    if (src && !this.isDecoded(src)) {
      void this.preloadAndDecode(src, 'low');
    }
  }

  /** Lightweight hover warm-up: decode S1, S2, S3 immediately when user hovers a level card */
  public warmLevelOnHover(level: StoryLevel): void {
    const { beatUrls } = this.getLevelImageUrls(level);
    beatUrls.slice(0, 3).forEach((url) => {
      if (!this.isDecoded(url)) {
        void this.preloadAndDecode(url, 'high');
      }
    });
  }

  /**
   * Keep the next 2 beats (current + 1, current + 2) eagerly decoded in memory.
   */
  public preloadLookaheadBeats(level: StoryLevel, currentBeatIndex: number): void {
    const indices = [currentBeatIndex + 1, currentBeatIndex + 2, currentBeatIndex + 3];
    for (const idx of indices) {
      const beat = level.storyBeats[idx];
      if (!beat) continue;
      const src = resolveStoryMedia(beat.mediaKey).src;
      if (src && !this.isDecoded(src)) {
        void this.preloadAndDecode(src, 'high');
      }
    }
  }

  /**
   * High-priority parallel decode of all outcome frames (OA1-OA3, OB, OC)
   * when entering Look / Decide so selecting any choice renders with 0ms lag.
   */
  public preloadOutcomesHighPriority(level: StoryLevel): void {
    const { outcomeUrls } = this.getLevelImageUrls(level);
    for (const url of outcomeUrls) {
      if (!this.isDecoded(url)) {
        void this.preloadAndDecode(url, 'high');
      }
    }
  }

  public recordBeatSyncMetric(metric: BeatSyncMetric): void {
    this.metrics.push(metric);
    if (this.metrics.length > 100) {
      this.metrics.shift();
    }
    if (typeof window !== 'undefined') {
      (
        window as unknown as { __NAFAS_BEAT_SYNC_METRICS__?: BeatSyncMetric[] }
      ).__NAFAS_BEAT_SYNC_METRICS__ = this.metrics;
    }
  }

  public getBeatSyncMetrics(): BeatSyncMetric[] {
    return [...this.metrics];
  }

  public getCacheSummary(): {
    decodedCount: number;
    inFlightCount: number;
  } {
    return {
      decodedCount: this.decodedCache.size,
      inFlightCount: this.inFlight.size,
    };
  }
}

export const imagePreloader = new NafasImagePreloader();

if (typeof window !== 'undefined') {
  (
    window as unknown as { __NAFAS_IMAGE_PRELOADER__?: NafasImagePreloader }
  ).__NAFAS_IMAGE_PRELOADER__ = imagePreloader;
}
