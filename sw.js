const CACHE = 'carnet-sanitaire-v4';
const FILES = ['./', './index.html'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (url.includes('unpkg.com/@babel/standalone') && !url.includes('@babel/standalone@')) {
    e.respondWith(fetch('https://unpkg.com/@babel/standalone@7/babel.min.js'));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('./'))));
});
