/* ENGLISH SAVANT service worker - app shell cache for the PWA */
const CACHE = 'english-savant-v40-p2-answerability';
const ROOT = '/english-savant/';
const SHELL = [
  ROOT,
  ROOT + 'manifest.webmanifest',
  ROOT + 'icons/icon-192.png',
  ROOT + 'icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('english-savant-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  /* Never cache the AI worker or other cross-origin calls */
  if (url.origin !== self.location.origin) return;

  /* Network-first for pages and JSON so content stays fresh; fall back to cache offline */
  if (request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('.json') || url.pathname.endsWith('/site-interface.css') || url.pathname.endsWith('/site-interface.js')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request).then((hit) => hit || caches.match(ROOT)))
    );
    return;
  }

  /* Cache-first for static assets (icons, etc.) */
  event.respondWith(
    caches.match(request).then((hit) => {
      if (hit) return hit;
      return fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
