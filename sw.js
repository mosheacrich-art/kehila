/* =============================================
   Jabad Barcelona — Service Worker
   ============================================= */

const CACHE = 'kehila-v2';
const ASSETS = [
  '/kehila/',
  '/kehila/index.html',
  '/kehila/home.html',
  '/kehila/siddur.html',
  '/kehila/eventos.html',
  '/kehila/noticias.html',
  '/kehila/servicios.html',
  '/kehila/css/main.css',
  '/kehila/css/components.css',
  '/kehila/css/pages.css',
  '/kehila/js/auth.js',
  '/kehila/js/nav.js',
  '/kehila/js/data.js',
  '/kehila/img/icon-192.png',
  '/kehila/img/icon-512.png',
];

// Instalar: cachear recursos estáticos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// Activar: limpiar caches viejos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first para estáticos, network-first para API
self.addEventListener('fetch', e => {
  // No interceptar peticiones a Supabase
  if (e.request.url.includes('supabase.co')) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        // Cachear solo respuestas válidas de nuestro dominio
        if (res.ok && e.request.url.includes('github.io')) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => {
        // Sin red: devolver página de inicio si es navegación
        if (e.request.mode === 'navigate') {
          return caches.match('/kehila/home.html');
        }
      });
    })
  );
});
