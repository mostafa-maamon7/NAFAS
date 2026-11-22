/**
 * NAFAS Atomic Image Preloader & Decoder
 *
 * Guarantees zero image/caption desync and zero blank-frame flashes:
 *  - Uses `new Image()` + `fetchPriority` + `img.decode()` so pixels are ready
 *    on the GPU/compositor BEFORE any beat transition or crossfade begins.
 *  - Tracks synchronous decoded state (`isDecoded(src)`) so warm-cache taps commit
 *    in the same frame (< 150ms end-to-end).
 *  - Preloads level beat 0 (S1) with `fetchPriority="high"`, sequentially preloads
 *    remaining story beats in background, and preloads next 2 beats + outcome frames
 *    (OA1-OA3, OB, OC) as soon as the Decide step begins.
 *  - Records `performance.mark` / `performance.measure` entries per beat.
 */

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

class NafasImagePreloader {
  private decodedSet = new Set<string>();
  private failedSet = new Set<string>();
  private inFlight = new Map<string, Promise<boolean>>();
  // Retain Image references so browser memory cache does not evict decoded bitmaps mid-level
  private retainedImages = new Map<string, HTMLImageElement>();
  private syncMetrics: BeatSyncMetric[] = [];
  private activeQueueToken = 0;

  public isDecoded(src: string): boolean {
    return this.decodedSet.has(src);
  }

  public preloadAndDecode(
    src: string,
    priority: 'high' | 'low' | 'auto' = 'auto'
  ): Promise<boolean> {
    if (!src) return Promise.resolve(false);
    if (this.decodedSet.has(src)) return Promise.resolve(true);

    const existing = this.inFlight.get(src);
    if (existing) return existing;

    if (typeof window === 'undefined' || typeof Image === 'undefined') {
      return Promise.resolve(true);
    }

    const markStart = `nafas-img-start-${src.split('/').pop() || 'img'}-${Date.now()}`;
    try {
      performance.mark(markStart);
    } catch {
      // Ignore performance API errors
    }

    const promise = new Promise<boolean>((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      try {
        (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = priority;
      } catch {
        // fetchPriority unsupported on older browsers
      }

      const finish = (ok: boolean) => {
        if (ok) {
          this.decodedSet.add(src);
          this.retainedImages.set(src, img);
        } else {
          this.failedSet.add(src);
        }
        this.inFlight.delete(src);
        try {
          const markEnd = `${markStart}-end`;
          performance.mark(markEnd);
          performance.measure(
            `nafas-img-decode:${src.split('/').pop() || 'img'}`,
            markStart,
            markEnd
          );
        } catch {
          // Ignore
        }
        resolve(ok);
      };

      img.onload = () => {
        if (typeof img.decode === 'function') {
          img
            .decode()
            .then(() => finish(true))
            .catch(() => {
              // Some browsers reject decode() on already-painted or animated images; onload still succeeded
              finish(img.naturalWidth > 0);
            });
        } else {
          finish(true);
        }
      };

      img.onerror = () => {
        finish(false);
      };

      img.src = src;

      // Fast path if already complete in browser cache
      if (img.complete && img.naturalWidth > 0) {
        if (typeof img.decode === 'function') {
          img
            .decode()
            .then(() => finish(true))
            .catch(() => finish(true));
        } else {
          finish(true);
        }
      }
    });

    this.inFlight.set(src, promise);
    return promise;
  }

  /**
   * Level start preload pipeline:
   * 1. Immediately prioritize Beat 1 (S1) with fetchPriority="high"
   * 2. Sequentially preload & decode S2 -> S3 -> S4 -> S5 in background
   * 3. Then gently warm OA1..OA3, OB, OC in background
   */
  public preloadLevelSequence(level: StoryLevel): void {
    const token = ++this.activeQueueToken;
    const storyUrls = level.storyBeats.map((b) => resolveStoryMedia(b.mediaKey).src);
    const outcomeUrls: string[] = [];
    level.decisionNode.choices.forEach((c) => {
      if (c.consequenceBeat.playbackFrames?.length) {
        c.consequenceBeat.playbackFrames.forEach((f) =>
          outcomeUrls.push(resolveStoryMedia(f.mediaKey).src)
        );
      } else {
        outcomeUrls.push(resolveStoryMedia(c.consequenceBeat.mediaKey).src);
      }
    });

    const uniqueStory = Array.from(new Set(storyUrls));
    const uniqueOutcomes = Array.from(new Set(outcomeUrls)).filter(
      (u) => !uniqueStory.includes(u)
    );

    const run = async () => {
      if (uniqueStory.length > 0) {
        await this.preloadAndDecode(uniqueStory[0], 'high');
      }
      for (let i = 1; i < uniqueStory.length; i++) {
        if (token !== this.activeQueueToken) return;
        await this.preloadAndDecode(uniqueStory[i], i <= 2 ? 'auto' : 'low');
      }
      for (const u of uniqueOutcomes) {
        if (token !== this.activeQueueToken) return;
        await this.preloadAndDecode(u, 'low');
      }
    };

    run().catch(() => {});
  }

  /** Preload the next 2 beats immediately when advancing during Watch */
  public preloadLookaheadBeats(level: StoryLevel, currentBeatIdx: number): void {
    for (let offset = 1; offset <= 2; offset++) {
      const nextBeat = level.storyBeats[currentBeatIdx + offset];
      if (nextBeat) {
        const src = resolveStoryMedia(nextBeat.mediaKey).src;
        this.preloadAndDecode(src, offset === 1 ? 'high' : 'auto').catch(() => {});
      }
    }
  }

  /** High-priority outcome preload as soon as Decide step begins (OA1-OA3, OB, OC) */
  public preloadOutcomesHighPriority(level: StoryLevel): void {
    const urls: string[] = [];
    level.decisionNode.choices.forEach((c) => {
      if (c.consequenceBeat.playbackFrames?.length) {
        c.consequenceBeat.playbackFrames.forEach((f) =>
          urls.push(resolveStoryMedia(f.mediaKey).src)
        );
      } else {
        urls.push(resolveStoryMedia(c.consequenceBeat.mediaKey).src);
      }
    });
    const unique = Array.from(new Set(urls));
    (async () => {
      for (let i = 0; i < unique.length; i++) {
        await this.preloadAndDecode(unique[i], i < 2 ? 'high' : 'auto');
      }
    })().catch(() => {});
  }

  public recordBeatSyncMetric(metric: BeatSyncMetric): void {
    this.syncMetrics.push(metric);
    if (this.syncMetrics.length > 60) {
      this.syncMetrics.shift();
    }
    try {
      const markName = `nafas-beat-commit:${metric.targetImageId}`;
      performance.mark(markName);
      (
        window as unknown as { __NAFAS_SYNC_METRICS__?: BeatSyncMetric[] }
      ).__NAFAS_SYNC_METRICS__ = [...this.syncMetrics];
    } catch {
      // Ignore
    }
  }

  public getSyncMetrics(): BeatSyncMetric[] {
    return [...this.syncMetrics];
  }

  public clearCacheForTests(): void {
    this.decodedSet.clear();
    this.failedSet.clear();
    this.inFlight.clear();
    this.retainedImages.clear();
    this.syncMetrics = [];
  }
}

export const imagePreloader = new NafasImagePreloader();

if (typeof window !== 'undefined') {
  (
    window as unknown as { __NAFAS_IMAGE_PRELOADER__?: NafasImagePreloader }
  ).__NAFAS_IMAGE_PRELOADER__ = imagePreloader;
}
