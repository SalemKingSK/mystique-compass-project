const CACHE_NAME = 'mystique-compass-v13-engagement';
const RUNTIME_CACHE = `${CACHE_NAME}-runtime`;
const PRECACHE_URLS = ['/', '/manifest.json', '/icon-192.svg', '/icon-512.svg', '/favicon.svg'];
const ASSET_RE = /\/(assets\/|icon-|favicon|manifest\.json|robots\.txt|opengraph\.jpg|background-results\.jpg)/;
self.addEventListener('install', (event) => {
event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS).catch(() => {})).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (event) => {
event.waitUntil(
caches.keys().then((names) => Promise.all(names.filter((name) => ![CACHE_NAME, RUNTIME_CACHE].includes(name)).map((name) => caches.delete(name)))).then(() => self.clients.claim())
);
});
async function cacheFirst(request) {
const cached = await caches.match(request);
if (cached) return cached;
const response = await fetch(request);
if (response.ok) {
const cache = await caches.open(RUNTIME_CACHE);
cache.put(request, response.clone()).catch(() => {});
}
return response;
}
async function networkFirst(request) {
try {
const response = await fetch(request);
if (response.ok) {
const cache = await caches.open(RUNTIME_CACHE);
cache.put(request, response.clone()).catch(() => {});
}
return response;
} catch {
const cached = await caches.match(request);
if (cached) return cached;
if (request.mode === 'navigate') return caches.match('/');
return new Response(JSON.stringify({ error: 'offline' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
}
}
self.addEventListener('fetch', (event) => {
const { request } = event;
if (request.method !== 'GET') return;
const url = new URL(request.url);
if (url.origin !== self.location.origin) return;
if (url.pathname.startsWith('/api/')) {
event.respondWith(fetch(request).catch(() => new Response(JSON.stringify({ error: 'offline' }), { status: 503, headers: { 'Content-Type': 'application/json' } })));
return;
}
if (request.mode === 'navigate') {
event.respondWith(networkFirst(request));
return;
}
if (ASSET_RE.test(url.pathname)) {
event.respondWith(cacheFirst(request));
return;
}
event.respondWith(networkFirst(request));
});
