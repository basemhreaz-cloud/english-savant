/* ENGLISH SAVANT service worker - offline shell + runtime cache + optional inventory sync */
const CACHE = 'english-savant-v104-pwa';
const ROOT = '/english-savant/';
const OFFLINE = ROOT + 'offline.html';
const SHELL = [ROOT, ROOT + 'index.html', ROOT + 'offline.html', ROOT + 'manifest.webmanifest', ROOT + 'icons/icon-192.png', ROOT + 'icons/icon-512.png', ROOT + 'icons/apple-touch-icon.png', ROOT + 'assets/adults-logo.webp'];
const SHELL_PAGES = [ROOT, ROOT + 'sage/index.html'];
const NO_CACHE_EXT = /\.(mp4|webm|mov|apk|zip)(\?|$)/i;
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

async function putSafe(cache, url) {
  try {
    const res = await fetch(url, { cache: 'reload' });
    if (res && res.ok) await cache.put(url, res.clone());
    return res;
  } catch (e) { return null; }
}
/* Precache the shell plus the css/js/images each shell page references, so the app opens offline after first install. */
async function precache() {
  const cache = await caches.open(CACHE);
  await Promise.all(SHELL.map((u) => putSafe(cache, u)));
  for (const page of SHELL_PAGES) {
    try {
      const res = await fetch(page, { cache: 'reload' });
      if (!res.ok) continue;
      await cache.put(page, res.clone());
      const html = await res.text();
      const base = new URL(page, self.location.origin);
      const refs = new Set();
      const re = /(?:href|src)=["']([^"'#]+)["']/g; let m;
      while ((m = re.exec(html))) {
        try {
          const u = new URL(m[1], base);
          if (u.origin === self.location.origin && /\.(css|js|webp|png|jpg|svg|json|webmanifest)(\?|$)/i.test(u.pathname + u.search)) refs.add(u.href);
        } catch (e) {}
      }
      await Promise.all([...refs].map((u) => putSafe(cache, u)));
    } catch (e) {}
  }
  /* sage shell data and portraits when present (404 is ignored) */
  const extra = ['sage/manifest.json', 'sage/i18n_en.json', 'lessons.json'].concat(['kg1','kg2','p1','p2','p3','p4','p5','p6','m1','m2','m3'].map((g) => 'sage/g/' + g + '.webp'));
  await Promise.all(extra.map((p) => putSafe(cache, ROOT + p)));
}

self.addEventListener('install', (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('english-savant-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => (self.registration.navigationPreload ? self.registration.navigationPreload.enable() : null))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(event, request, fallbackToOffline) {
  const cache = await caches.open(CACHE);
  try {
    const preload = event.preloadResponse ? await event.preloadResponse : null;
    const res = preload || await Promise.race([fetch(request), new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 6000))]);
    if (res && res.ok) cache.put(request, res.clone());
    return res;
  } catch (e) {
    const hit = await cache.match(request, { ignoreSearch: false }) || await cache.match(request, { ignoreSearch: true });
    if (hit) return hit;
    if (fallbackToOffline) {
      const home = await cache.match(ROOT);
      if (new URL(request.url).pathname === ROOT && home) return home;
      return (await cache.match(OFFLINE)) || Response.error();
    }
    return Response.error();
  }
}
async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  if (res && (res.ok || res.type === 'opaque') && request.method === 'GET') cache.put(request, res.clone());
  return res;
}
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(request);
  const net = fetch(request).then((res) => { if (res && (res.ok || res.type === 'opaque')) cache.put(request, res.clone()); return res; }).catch(() => null);
  return hit || (await net) || Response.error();
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (FONT_HOSTS.includes(url.hostname)) { event.respondWith(staleWhileRevalidate(request)); return; }
  /* Never cache the AI worker or other cross-origin calls */
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith(ROOT)) return;
  /* Large media and range requests go straight to the network */
  if (request.headers.has('range') || NO_CACHE_EXT.test(url.pathname)) return;
  if (url.pathname.includes('/app-content/')) return;
  /* Network-first (6 s) for pages and JSON so content stays fresh; cached copy or offline page when offline */
  if (request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('.json') || url.pathname.endsWith('/') ) {
    event.respondWith(networkFirst(event, request, request.mode === 'navigate'));
    return;
  }
  event.respondWith(cacheFirst(request).catch(() => caches.match(request).then((h) => h || Response.error())));
});

/* Messages: {type:'SKIP_WAITING'} and {type:'SYNC_INVENTORY'} (downloads the non-video app inventory assets for full offline use, reports progress) */
self.addEventListener('message', (event) => {
  const d = event.data || {};
  if (d.type === 'SKIP_WAITING') self.skipWaiting();
  if (d.type === 'SYNC_INVENTORY') event.waitUntil(syncInventory(event.source));
});
async function say(client, msg) { try { (client || (await self.clients.matchAll())[0]).postMessage(msg); } catch (e) {} }
async function syncInventory(client) {
  try {
    const latest = await (await fetch(ROOT + 'app-content/latest.json', { cache: 'no-store' })).json();
    const man = await (await fetch(latest.manifest_url, { cache: 'no-store' })).json();
    const cache = await caches.open(CACHE);
    const todo = man.assets.filter((a) => a.required_for_app && !NO_CACHE_EXT.test(a.path) && a.role !== 'video');
    let done = 0, failed = 0;
    await say(client, { type: 'INVENTORY_PROGRESS', done, total: todo.length, failed, sequence: latest.release_sequence });
    for (let i = 0; i < todo.length; i += 6) {
      await Promise.all(todo.slice(i, i + 6).map(async (a) => {
        try {
          const u = ROOT + a.path;
          if (await cache.match(u)) { done++; return; }
          const r = await fetch(u);
          if (r.ok) { await cache.put(u, r); done++; } else failed++;
        } catch (e) { failed++; }
      }));
      if ((i / 6) % 10 === 0) await say(client, { type: 'INVENTORY_PROGRESS', done, total: todo.length, failed, sequence: latest.release_sequence });
    }
    await say(client, { type: 'INVENTORY_DONE', done, total: todo.length, failed, sequence: latest.release_sequence });
  } catch (e) { await say(client, { type: 'INVENTORY_ERROR', error: String(e) }); }
}
