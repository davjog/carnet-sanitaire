const CACHE = 'prairies-v3';
const BASE  = self.registration.scope;
const ASSETS = [
  BASE + 'prairies.html',
  BASE + 'prairies-manifest.json',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/proj4@2.9.0/dist/proj4.js',
  'https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.css',
  'https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(()=>{})));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  // N'intercepter que les ressources prairies et leurs dépendances CDN (leaflet, proj4)
  // Ne PAS intercepter index.html (carnet sanitaire) ni les CDN React/Babel
  const isPrairiesResource =
    url.includes('prairies') ||
    url.includes('leaflet') ||
    url.includes('proj4');

  if (!isPrairiesResource) return; // laisser passer sans interférence

  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match(BASE + 'prairies.html')))
  );
});
