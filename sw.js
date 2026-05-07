/* =============================================
   Jabad Barcelona — Service Worker
   Estrategia: network-first (siempre versión más reciente)
   ============================================= */

const CACHE = 'kehila-v4';

// Instalar: activar inmediatamente sin esperar
self.addEventListener('install', e => {
  self.skipWaiting();
});

// Activar: limpiar caches viejos y tomar control inmediato
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: network-first siempre
self.addEventListener('fetch', e => {
  if (e.request.url.includes('supabase.co')) return;
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request).then(res => {
      // Guardar en caché solo si la respuesta es válida
      if (res.ok) {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }).catch(() => {
      // Sin red: usar caché como fallback
      return caches.match(e.request).then(cached => {
        if (cached) return cached;
        if (e.request.mode === 'navigate') {
          return caches.match('/kehila/home.html');
        }
      });
    })
  );
});
