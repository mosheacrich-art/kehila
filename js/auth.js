/**
 * @file auth.js
 * @description Autenticacion, gestion de sesion y guards de ruta para Kehila.
 *
 * Responsabilidades:
 *  - Singleton Supabase via getSupabase()
 *  - Login / Logout / Registro contra Supabase Auth
 *  - Guards: requireAuth(), requireAdmin(), verifyAdminRealtime()
 *  - Helpers: getAvatarColor(), renderAvatar()
 *
 * DEPENDENCIAS: cargar CDN supabase-js ANTES que este archivo.
 *
 * SEGURIDAD (ver CLAUDE.md apartado 8):
 *  [SEC-01] requireAdmin() solo verifica localStorage (manipulable desde DevTools).
 *           Usar verifyAdminRealtime() en operaciones destructivas de admin.
 *  [SEC-02] Sesion en localStorage: persistente y legible por JS.
 *  [SEC-03] anon key publica por diseno. Segura SOLO con RLS activo en Supabase.
 *
 * DEBUG: cambiar AUTH_DEBUG a true para ver logs en consola.
 */

/** Controla si se muestran logs de debug. Poner false en produccion. */
const AUTH_DEBUG = false;

// ─── Configuración Supabase ───────────────────
const SUPABASE_URL = 'https://vvrvuhugpvqytelhsdnk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2cnZ1aHVncHZxeXRlbGhzZG5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjczOTIsImV4cCI6MjA5MDEwMzM5Mn0.R14q9fe0zcaXDvZgTcan4yerg7hYfBfaxWs1kN-zIl0';

// Cliente Supabase
let _supabase = null;
/**
 * Devuelve el cliente Supabase inicializado (singleton).
 * Debe llamarse despues de que el CDN de Supabase haya cargado.
 * @returns {object|null}
 */
function getSupabase() {
  if (_supabase) return _supabase;
  // El CDN de Supabase v2 expone supabase.createClient en window
  const lib = window.supabase || (window.supabaseJs) || null;
  if (lib && lib.createClient) {
    _supabase = lib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase conectado');
  } else {
    console.warn('⚠️ SDK Supabase no encontrado, usando mock');
  }
  return _supabase;
}

const SESSION_KEY = 'kehila_user';

// ─── Login ────────────────────────────────────
/**
 * Autentica un usuario con email y contrasena. Guarda sesion en localStorage.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ok: boolean, status?: string, error?: string}>}
 */
async function login(email, password) {
  const normalizedEmail = email.toLowerCase().trim();
  const sb = getSupabase();
  if (!sb) return { ok: false, error: 'No hay conexión con el servidor.' };

  try {
    const { data, error } = await sb.auth.signInWithPassword({ email: normalizedEmail, password });
    if (error) return { ok: false, error: 'Email o contraseña incorrectos.' };

    const { data: profile } = await sb
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profile && profile.status === 'banned') {
      await sb.auth.signOut();
      return { ok: false, error: 'Tu cuenta ha sido baneada. Contacta al administrador.' };
    }
    if (profile && profile.status === 'suspended') {
      await sb.auth.signOut();
      return { ok: false, error: 'Tu cuenta está suspendida temporalmente. Contacta al administrador.' };
    }

    // Para staff: cargar áreas asignadas
    let areas = [];
    const userRole = profile?.role || 'miembro';
    if (userRole === 'staff') {
      try {
        const { data: permisos } = await sb
          .from('staff_permisos')
          .select('area')
          .eq('user_id', data.user.id);
        areas = (permisos || []).map(p => p.area);
      } catch(_) {}
    }

    const sessionData = {
      userId: data.user.id,
      name: profile?.name || normalizedEmail.split('@')[0],
      email: data.user.email,
      role: userRole,
      status: profile?.status || 'pending',
      comunidad: profile?.comunidad || 'Jabad Barcelona',
      initials: profile?.initials || normalizedEmail.slice(0, 2).toUpperCase(),
      areas: areas,
      loginAt: new Date().toISOString(),
      source: 'supabase'
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    return { ok: true, status: profile?.status || 'active' };
  } catch (e) {
    return { ok: false, error: 'Error de conexión. Inténtalo de nuevo.' };
  }
}

// ─── Registro ─────────────────────────────────
/**
 * Registro de nuevo usuario en Supabase.
 */
/**
 * Crea nueva cuenta en Supabase Auth. Perfil extendido via trigger Supabase.
 * @param {string} email
 * @param {string} password - Min 8 chars recomendado (NIST SP 800-63B)
 * @param {string} name
 * @returns {Promise<{ok: boolean, userId?: string, error?: string}>}
 */
async function register(email, password, name) {
  const sb = getSupabase();
  if (!sb) return { ok: false, error: 'Registro solo disponible con conexión a internet.' };

  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: { data: { name, initials } }
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true, userId: data.user?.id, data };
}

// ─── Logout ───────────────────────────────────
/**
 * Cierra sesion: invalida JWT en Supabase y limpia localStorage.
 * Redirige siempre a index.html.
 */
async function logout() {
  const sb = getSupabase();
  if (sb) {
    try { await sb.auth.signOut(); } catch (e) {}
  }
  localStorage.removeItem(SESSION_KEY);
  window.location.href = 'index.html';
}

// ─── Sesión actual ────────────────────────────
/**
 * Devuelve datos de sesion de localStorage. NO valida el JWT.
 * Para validar el token usar verifySession().
 * @returns {{userId, name, email, role, status, comunidad, initials}|null}
 */
function getCurrentUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ─── Guards ───────────────────────────────────
/**
 * Guard basico. Sin sesion local redirige a index.html.
 * Llamar en DOMContentLoaded de todas las paginas protegidas.
 * @returns {{userId, name, email, role, ...}|null}
 */
function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'index.html';
    return null;
  }
  return user;
}

/**
 * Guard de admin rapido (solo localStorage).
 * [SEC-01] Manipulable desde DevTools. Complementar con verifyAdminRealtime().
 * @returns {{userId, name, role, ...}|null}
 */
function requireAdmin() {
  const user = requireAuth();
  if (!user) return null;
  if (!['admin', 'super_admin', 'staff'].includes(user.role)) {
    window.location.href = 'home.html';
    return null;
  }
  return user;
}

/**
 * Comprueba si el usuario actual es admin sin redirigir.
 * @returns {boolean}
 */
function isAdmin() {
  const user = getCurrentUser();
  return user && ['admin', 'super_admin'].includes(user.role);
}

/**
 * Comprueba si el usuario actual es super_admin.
 * @returns {boolean}
 */
function isSuperAdmin() {
  const user = getCurrentUser();
  return user && user.role === 'super_admin';
}

/**
 * Devuelve las áreas del usuario actual.
 * admin/super_admin tienen acceso a todo ['*'].
 * @returns {string[]}
 */
function getUserAreas() {
  const user = getCurrentUser();
  if (!user) return [];
  if (['admin', 'super_admin'].includes(user.role)) return ['*'];
  return user.areas || [];
}

/**
 * Comprueba si el usuario tiene acceso a un área concreta.
 * @param {string} area
 * @returns {boolean}
 */
function hasArea(area) {
  const areas = getUserAreas();
  return areas.includes('*') || areas.includes(area);
}

// ─── Helpers ──────────────────────────────────
/**
 * Devuelve indice de color 0-7 basado en el nombre (deterministico).
 * Colores definidos en CSS via data-color atributo.
 * @param {string} name
 * @returns {string}
 */
function getAvatarColor(name) {
  if (!name) return '0';
  const code = name.charCodeAt(0) + (name.charCodeAt(1) || 0);
  return String(code % 8);
}

/**
 * Genera HTML de avatar circular con iniciales del usuario.
 * @param {{name?: string, initials?: string}} user
 * @param {string} [size] - Clase CSS: sm | md | lg
 * @returns {string} HTML del avatar
 */
function renderAvatar(user, size = 'md') {
  const color = getAvatarColor(user.name || user.initials || 'U');
  const initials = user.initials || (user.name ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '??');
  const safeInitials = String(initials || '??').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  return `<div class="avatar avatar-${size}" data-color="${color}">${safeInitials}</div>`;
}

// ─── Auto-init ────────────────────────────────

/**
 * Verifica que la sesion de Supabase siga activa (JWT no expirado).
 * Mas lento que getCurrentUser() pero garantiza que el token es valido.
 * @returns {Promise<boolean>}
 * @example
 * if (!(await verifySession())) { logout(); return; }
 */
async function verifySession() {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const { data: { session } } = await sb.auth.getSession();
    return session !== null;
  } catch { return false; }
}

/**
 * Guard de admin con verificacion real contra Supabase.
 * Consulta profiles usando JWT activo - no puede falsificarse desde localStorage.
 * Requiere RLS en profiles: CREATE POLICY ON profiles FOR SELECT USING (auth.uid() = id)
 *
 * Usar en operaciones destructivas de admin (aprobar/banear usuarios, borrar contenido).
 *
 * @returns {Promise<{userId, name, role, ...}|null>}
 * @example
 * const adminUser = await verifyAdminRealtime();
 * if (!adminUser) return;
 */
async function verifyAdminRealtime() {
  const localUser = getCurrentUser();
  if (!localUser) { window.location.href = 'index.html'; return null; }

  const sb = getSupabase();
  if (!sb) return localUser; // Sin conexion: usar datos locales como fallback

  try {
    const { data: { session } } = await sb.auth.getSession();
    if (!session) {
      localStorage.removeItem(SESSION_KEY);
      window.location.href = 'index.html';
      return null;
    }
    const { data: profile, error } = await sb
      .from('profiles')
      .select('role, status')
      .eq('id', session.user.id)
      .single();

    if (error || !profile)           { window.location.href = 'home.html'; return null; }
    if (profile.status === 'banned' || profile.status === 'suspended') { await logout(); return null; }
    if (profile.role !== 'admin')    { window.location.href = 'home.html'; return null; }

    // Sincronizar rol en localStorage por si cambio en BD
    if (profile.role !== localUser.role) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ ...localUser, role: profile.role, status: profile.status }));
    }
    return localUser;
  } catch (e) {
    console.error('[auth] verifyAdminRealtime error:', e);
    return localUser.role === 'admin' ? localUser : null;
  }
}

(function () {
  const isLoginPage = window.location.pathname.endsWith('index.html') ||
                      window.location.pathname === '/' ||
                      window.location.pathname.endsWith('/');
  if (!isLoginPage) {
    requireAuth();
  }
})();
