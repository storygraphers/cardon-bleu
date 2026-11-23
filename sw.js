/* Service worker for Cardon bleu
   Makes the page available offline. It caches only the page itself and its icons.
   The cards themselves live exclusively in the browser's localStorage.
   Strategy: load the page from the network first (updates show up right away), fall back to the cache offline. */

const CACHE = 'cardon-bleu-v4';
const ASSETS = [
  'manifest.webmanifest',
  'icons/favicon.svg',
  'icons/apple-touch-icon.png',
  'icons/app-icon-192.png',
  'icons/app-icon-512.png',
  'icons/app-icon-maskable-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(ASSETS.map(a => c.add(a)))));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});

// On first load the page reports its own URL so it is available offline right away.
// This also works if the HTML file has been renamed.
self.addEventListener('message', event => {
  const url = event.data?.type === 'cache-page' && event.data.url;
  if (!url || new URL(url).origin !== self.location.origin) return;
  event.waitUntil(caches.open(CACHE).then(c => c.add(new Request(url, { cache: 'reload' }))).catch(() => {}));
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const res = await fetch(req);
        if (res.ok) (await caches.open(CACHE)).put(req, res.clone());
        return res;
      } catch {
        return (await caches.match(req, { ignoreSearch: true })) || Response.error();
      }
    })());
    return;
  }

  event.respondWith(caches.match(req).then(hit => hit || fetch(req)));
});
