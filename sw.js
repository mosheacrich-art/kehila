/* =============================================
   Jabad Barcelona — Service Worker
   Estrategia: precache del "cascarón" + stale-while-revalidate.

   1) PRECACHE (install): al instalar se descargan de una vez TODAS las
      páginas .html, el CSS y el JS de la app. A partir de ahí, cambiar de
      pestaña NO espera red: el documento nuevo se sirve al instante desde
      caché (adiós al parpadeo / pantalla en blanco al navegar).
   2) stale-while-revalidate (fetch): responde al instante desde caché si
      existe y actualiza esa caché en segundo plano para la próxima visita.
   3) Supabase queda SIEMPRE fuera de la caché (datos siempre frescos).

   Push: muestra notificación nativa cuando la app está cerrada.
   ============================================= */

const CACHE = 'kehila-v21';

// El cascarón completo de la app. Se precachea al instalar el SW para que
// la navegación entre secciones sea instantánea.
const PRECACHE = [
  '/admin.html',
  '/aviso-legal.html',
  '/business.html',
  '/calendario.html',
  '/citas-rabino.html',
  '/contacto.html',
  '/cookies.html',
  '/donativos.html',
  '/eliminar-cuenta.html',
  '/esencial-hub.html',
  '/eventos.html',
  '/galeria.html',
  '/home.html',
  '/index.html',
  '/jconnect.html',
  '/kosher.html',
  '/linkedin-kehila.html',
  '/mikve.html',
  '/noticia.html',
  '/noticias.html',
  '/perfil.html',
  '/privacidad.html',
  '/rav-hub.html',
  '/rav.html',
  '/reset-password.html',
  '/servicios.html',
  '/shiurim.html',
  '/siddur.html',
  '/tienda.html',
  '/voluntariado.html',
  '/wallap.html',
  '/css/components.css',
  '/css/main.css',
  '/css/pages.css',
  '/js/analytics.js',
  '/js/auth.js',
  '/js/data.js',
  '/js/familia.js',
  '/js/i18n.js',
  '/js/media.js',
  '/js/nav.js',
  '/js/noticias.js',
  '/js/push.js',
  '/js/registro.js',
  '/manifest.json',
  '/img/icon-192.png',
  '/img/icon-512.png',
  '/img/logo_jabad.png',
  // Librerías de CDN que bloquean el render en cada página: al precachearlas
  // dejan de depender de la red tras instalar/actualizar el SW.
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js',
  'https://cdn.jsdelivr.net/npm/cropperjs@1.6.2/dist/cropper.min.js',
  'https://cdn.jsdelivr.net/npm/cropperjs@1.6.2/dist/cropper.min.css',
];

// Instalar: precachear el cascarón y activar sin esperar.
// Cada recurso se añade por separado: si uno falla (404, offline puntual)
// no se aborta toda la instalación.
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.all(
        PRECACHE.map(url =>
          cache.add(new Request(url, { cache: 'reload' })).catch(() => {})
        )
      )
    ).then(() => self.skipWaiting())
  );
});

// Activar: limpiar caches viejos y tomar control inmediato
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* ─── Push: recibir notificación cuando la app está cerrada (Web PWA) ─── */
self.addEventListener('push', e => {
  if (!e.data) return;
  let payload;
  try { payload = e.data.json(); } catch (_) { payload = { title: 'Jabad Barcelona', body: e.data.text() }; }

  const { title = 'Jabad Barcelona', body = '', data = {} } = payload;
  e.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/img/icon-192.png',
      badge: '/img/icon-96.png',
      vibrate: [100, 50, 100],
      data,
      actions: [{ action: 'open', title: 'Ver' }],
    })
  );
});

/* ─── Notificationclick: abrir la app en la página correcta ─── */
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const data = e.notification.data || {};
  const ROUTES = { evento:'eventos.html', noticia:'noticias.html', rav:'rav.html', donativo:'donativos.html', calendario:'calendario.html' };
  const destino = ROUTES[data.tipo] || 'home.html';
  const url = '/' + destino + (data.id ? '?id=' + encodeURIComponent(data.id) : '');
  e.waitUntil(clients.matchAll({ type:'window' }).then(clientList => {
    const existing = clientList.find(c => c.url.includes(destino));
    if (existing) return existing.focus();
    return clients.openWindow(url);
  }));
});

// Fetch: stale-while-revalidate — caché al instante, red en segundo plano
self.addEventListener('fetch', e => {
  if (e.request.url.includes('supabase.co')) return;
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      const network = fetch(e.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => {
        if (cached) return cached;
        if (e.request.mode === 'navigate') return caches.match('/home.html');
      });

      // Si hay versión en caché, responde con ella al instante y deja que
      // la petición de red actualice la caché para la próxima vez.
      return cached || network;
    })
  );
});
