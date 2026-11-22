/**
 * NAFAS Static Media Cache Service Worker
 * Cache-first strictly for immutable level imagery (/assets/levels/) and self-hosted audio (/audio/).
 * Never intercepts HTML/JS/API/HMR requests so updates always load fresh.
 */
const MEDIA_CACHE = 'nafas-media-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith('nafas-media-') && k !== MEDIA_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const isCacheableMedia =
    url.pathname.startsWith('/assets/levels/') ||
    url.pathname.startsWith('/audio/');

  if (!isCacheableMedia) return;

  event.respondWith(
    caches.open(MEDIA_CACHE).then(async (cache) => {
      const cached = await cache.match(req);
      if (cached) return cached;
      const response = await fetch(req);
      if (response && response.ok && response.status === 200) {
        cache.put(req, response.clone()).catch(() => {});
      }
      return response;
    })
  );
});
