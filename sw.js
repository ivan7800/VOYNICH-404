/* VOYNICH 404 v0.11.1 — solo recursos propios; no cachea imágenes ni corpus externos. */
const CACHE = 'voynich-404-shell-v0.11.1';
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/icon.svg",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/css/atlas.css",
  "./assets/css/crypto.css",
  "./assets/css/notebook.css",
  "./assets/css/offline.css",
  "./assets/css/phase2.css",
  "./assets/css/styles.css",
  "./assets/css/theories.css",
  "./assets/css/transcription.css",
  "./assets/css/viewer.css",
  "./assets/js/annotations.js",
  "./assets/js/app.js",
  "./assets/js/atlas-data.js",
  "./assets/js/atlas.js",
  "./assets/js/crypto-core.js",
  "./assets/js/crypto.js",
  "./assets/js/data.js",
  "./assets/js/iiif.js",
  "./assets/js/notebook-core.js",
  "./assets/js/notebook.js",
  "./assets/js/offline.js",
  "./assets/js/theories-core.js",
  "./assets/js/theories-data.js",
  "./assets/js/theories.js",
  "./assets/js/transcription-core.js",
  "./assets/js/transcription.js",
  "./assets/js/viewer.js"
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith('voynich-404-shell-') && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => {
  if (event.data?.type === 'ACTIVATE_UPDATE') self.skipWaiting();
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(async () => (await caches.match('./index.html')) || Response.error()));
    return;
  }
  if (!SHELL.some(path => new URL(path,self.registration.scope).pathname === url.pathname)) return;
  event.respondWith(caches.match(req).then(hit => hit || fetch(req)));
});
