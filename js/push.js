/**
 * @file push.js
 * @description Gestión de notificaciones push para Jabad Barcelona.
 *
 * Funciona en dos modos:
 *  - Nativo (Capacitor): usa PushNotifications plugin → FCM/APNs
 *  - Web PWA: usa Web Push API con el Service Worker (requiere VAPID)
 *
 * FLUJO:
 *  1. initPush() se llama desde home.html tras requireAuth()
 *  2. Pide permiso al usuario
 *  3. Registra el dispositivo y guarda el token en Supabase (push_tokens)
 *  4. Escucha notificaciones recibidas en foreground y las muestra
 *  5. Redirige al tap de notificación (navegación a la página correcta)
 *
 * DEPENDENCIAS:
 *  - auth.js (getSupabase, getCurrentUser)
 *  - Capacitor 6.x inyectado por el bridge nativo (window.Capacitor)
 */

const PUSH_DEBUG = false;

/** true si corremos dentro de un shell Capacitor nativo (iOS o Android) */
const IS_NATIVE = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());

/** Páginas a las que puede navegar una notificación push */
const PUSH_ROUTES = {
  evento:      'eventos.html',
  noticia:     'noticias.html',
  rav:         'rav.html',
  donativo:    'donativos.html',
  comunidad:   'home.html',
  calendario:  'calendario.html',
};

/**
 * Punto de entrada. Llamar desde home.html después de requireAuth().
 * Es seguro llamarlo en web — detecta el entorno automáticamente.
 */
async function initPush() {
  if (IS_NATIVE) {
    await initNativePush();
  } else {
    await initWebPush();
  }
}

/* ─────────────────────────────────────────────
   MODO NATIVO (Capacitor)
───────────────────────────────────────────── */

async function initNativePush() {
  const { PushNotifications } = window.Capacitor.Plugins;
  if (!PushNotifications) { if (PUSH_DEBUG) console.warn('[push] PushNotifications plugin no disponible'); return; }

  // 1. Pedir permiso
  const { receive } = await PushNotifications.requestPermissions();
  if (receive !== 'granted') {
    if (PUSH_DEBUG) console.log('[push] Permiso denegado');
    return;
  }

  // 2. Registrar para recibir token FCM / APNs
  await PushNotifications.register();

  // 3. Token recibido → guardar en Supabase
  PushNotifications.addListener('registration', async (tokenData) => {
    const token = tokenData.value;
    if (PUSH_DEBUG) console.log('[push] Token registrado:', token);
    await savePushToken(token, IS_NATIVE ? detectPlatform() : 'web');
  });

  // 4. Error de registro
  PushNotifications.addListener('registrationError', (err) => {
    if (PUSH_DEBUG) console.error('[push] Error de registro:', err);
  });

  // 5. Notificación recibida en foreground → mostrar toast nativo
  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    if (PUSH_DEBUG) console.log('[push] Recibida en foreground:', notification);
    showPushToast(notification.title || 'Jabad Barcelona', notification.body || '', notification.data);
  });

  // 6. Usuario toca la notificación → navegar
  PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
    if (PUSH_DEBUG) console.log('[push] Tapped:', action);
    const data = action.notification?.data || {};
    navigateFromPush(data);
  });
}

/* ─────────────────────────────────────────────
   MODO WEB PWA (Web Push API)
───────────────────────────────────────────── */

async function initWebPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

  const vapidKey = window.VAPID_PUBLIC_KEY;
  if (!vapidKey) return; // VAPID no configurado todavía

  try {
    const registration = await navigator.serviceWorker.ready;
    const existing = await registration.pushManager.getSubscription();
    const subscription = existing || await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });
    await savePushToken(JSON.stringify(subscription), 'web');
  } catch (e) {
    if (PUSH_DEBUG) console.warn('[push] Web Push no disponible:', e);
  }
}

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

/** Guarda el token FCM/APNs/Web en Supabase. Hace upsert por user_id + platform. */
async function savePushToken(token, platform) {
  const sb = getSupabase();
  const user = getCurrentUser();
  if (!sb || !user || !user.userId) return;

  await sb.from('push_tokens').upsert({
    user_id: user.userId,
    token,
    platform,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,platform' });
}

/** Detecta la plataforma nativa. */
function detectPlatform() {
  if (!IS_NATIVE) return 'web';
  const ua = navigator.userAgent || '';
  return /iphone|ipad|ipod/i.test(ua) ? 'ios' : 'android';
}

/** Navega a la pantalla correcta según los datos de la notificación. */
function navigateFromPush(data) {
  if (!data) return;
  const tipo = data.tipo || data.type;
  const destino = PUSH_ROUTES[tipo] || 'home.html';
  const id = data.id;
  window.location.href = id ? `${destino}?id=${encodeURIComponent(id)}` : destino;
}

/** Muestra un banner en-app cuando llega una notificación en foreground. */
function showPushToast(title, body, data) {
  const existing = document.getElementById('push-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'push-toast';
  toast.style.cssText = `
    position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:9999;
    background:#1B2E5E;color:#fff;border-radius:12px;padding:14px 18px;
    max-width:340px;width:calc(100% - 32px);box-shadow:0 8px 32px rgba(0,0,0,.25);
    display:flex;gap:12px;align-items:flex-start;cursor:pointer;
    animation:pushIn .3s cubic-bezier(.34,1.56,.64,1);
  `;
  toast.innerHTML = `
    <div style="background:#C9A84C;border-radius:8px;width:36px;height:36px;flex-shrink:0;display:flex;align-items:center;justify-content:center;">
      <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="#fff" style="width:18px;height:18px;"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"/></svg>
    </div>
    <div style="flex:1;min-width:0;">
      <div style="font-weight:700;font-size:.875rem;margin-bottom:2px;">${escHtmlPush(title)}</div>
      <div style="font-size:.8rem;opacity:.8;line-height:1.4;">${escHtmlPush(body)}</div>
    </div>
    <button onclick="this.closest('#push-toast').remove()" style="background:none;border:none;cursor:pointer;color:rgba(255,255,255,.6);padding:0;font-size:1.1rem;line-height:1;flex-shrink:0;">×</button>
  `;

  // Tapping the toast navigates to the destination
  toast.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') return;
    toast.remove();
    navigateFromPush(data);
  });

  // Inject CSS animation once
  if (!document.getElementById('push-toast-styles')) {
    const style = document.createElement('style');
    style.id = 'push-toast-styles';
    style.textContent = '@keyframes pushIn{from{opacity:0;transform:translateX(-50%) translateY(-20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}';
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 7000);
}

function escHtmlPush(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}

/** Elimina el token del dispositivo actual (usar al hacer logout). */
async function removePushToken() {
  if (IS_NATIVE) {
    try {
      const { PushNotifications } = window.Capacitor.Plugins;
      if (PushNotifications) await PushNotifications.removeAllListeners();
    } catch (_) {}
  }
  const sb = getSupabase();
  const user = getCurrentUser();
  if (!sb || !user?.userId) return;
  await sb.from('push_tokens').delete().eq('user_id', user.userId).eq('platform', detectPlatform());
}
