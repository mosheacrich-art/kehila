/* =============================================
   KEHILÁ — auth.js
   Autenticación real con Supabase + fallback mock
   ============================================= */

// ─── Configuración Supabase ───────────────────
const SUPABASE_URL = 'https://vvrvuhugpvqytelhsdnk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2cnZ1aHVncHZxeXRlbGhzZG5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjczOTIsImV4cCI6MjA5MDEwMzM5Mn0.R14q9fe0zcaXDvZgTcan4yerg7hYfBfaxWs1kN-zIl0';

// Cliente Supabase
let _supabase = null;
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

// ─── Datos mock (siguen funcionando) ─────────
const USERS_DB = {
  'admin@jabad.barcelona': {
    userId: 'u001',
    name: 'Dovid Libersohn',
    email: 'admin@jabad.barcelona',
    password: 'Admin1234',
    role: 'admin',
    status: 'active',
    comunidad: 'Jabad Barcelona',
    initials: 'DL'
  },
  'moshe@jabad.barcelona': {
    userId: 'u002',
    name: 'Moshe Goldstein',
    email: 'moshe@jabad.barcelona',
    password: 'Moshe1234',
    role: 'miembro',
    status: 'active',
    comunidad: 'Jabad Barcelona',
    initials: 'MG'
  },
  'sarah@gmail.com': {
    userId: 'u003',
    name: 'Sarah Cohen',
    email: 'sarah@gmail.com',
    password: 'Sarah1234',
    role: 'miembro',
    status: 'pending',
    comunidad: 'Jabad Barcelona',
    initials: 'SC'
  }
};

const SESSION_KEY = 'kehila_user';

// ─── Login ────────────────────────────────────
/**
 * Login: intenta Supabase primero, si falla usa mock.
 */
async function login(email, password) {
  const normalizedEmail = email.toLowerCase().trim();

  // ── Si es usuario mock, usar mock directamente ──
  if (USERS_DB[normalizedEmail]) {
    const user = USERS_DB[normalizedEmail];
    if (user.password !== password) return { ok: false, error: 'Contraseña incorrecta. Inténtalo de nuevo.' };
    if (user.status === 'banned') return { ok: false, error: 'Tu cuenta ha sido suspendida. Contacta al administrador.' };
    const sessionData = {
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      comunidad: user.comunidad,
      initials: user.initials,
      loginAt: new Date().toISOString(),
      source: 'mock'
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    return { ok: true, status: user.status };
  }

  const sb = getSupabase();

  // ── Supabase real (solo para usuarios no-mock) ──
  if (sb) {
    try {
      const { data, error } = await sb.auth.signInWithPassword({ email: normalizedEmail, password });
      if (!error && data.user) {
        // Obtener perfil
        const { data: profile } = await sb
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile && profile.status === 'banned') {
          await sb.auth.signOut();
          return { ok: false, error: 'Tu cuenta ha sido suspendida. Contacta al administrador.' };
        }

        const sessionData = {
          userId: data.user.id,
          name: profile?.name || normalizedEmail.split('@')[0],
          email: data.user.email,
          role: profile?.role || 'miembro',
          status: profile?.status || 'pending',
          comunidad: profile?.comunidad || 'Jabad Barcelona',
          initials: profile?.initials || normalizedEmail.slice(0, 2).toUpperCase(),
          loginAt: new Date().toISOString(),
          source: 'supabase'
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
        return { ok: true, status: profile?.status || 'active' };
      }
      if (error) return { ok: false, error: 'Email o contraseña incorrectos.' };
    } catch (e) {
      console.warn('Supabase no disponible:', e.message);
    }
  }

  return { ok: false, error: 'No existe una cuenta con este correo electrónico.' };
}

// ─── Registro ─────────────────────────────────
/**
 * Registro de nuevo usuario en Supabase.
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
async function logout() {
  const sb = getSupabase();
  if (sb) {
    try { await sb.auth.signOut(); } catch (e) {}
  }
  localStorage.removeItem(SESSION_KEY);
  window.location.href = 'index.html';
}

// ─── Sesión actual ────────────────────────────
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
function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'index.html';
    return null;
  }
  return user;
}

function requireAdmin() {
  const user = requireAuth();
  if (!user) return null;
  if (user.role !== 'admin') {
    window.location.href = 'home.html';
    return null;
  }
  return user;
}

function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === 'admin';
}

// ─── Helpers ──────────────────────────────────
function getAvatarColor(name) {
  if (!name) return '0';
  const code = name.charCodeAt(0) + (name.charCodeAt(1) || 0);
  return String(code % 8);
}

function renderAvatar(user, size = 'md') {
  const color = getAvatarColor(user.name || user.initials || 'U');
  const initials = user.initials || (user.name ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '??');
  return `<div class="avatar avatar-${size}" data-color="${color}">${initials}</div>`;
}

// ─── Auto-init ────────────────────────────────
(function () {
  const isLoginPage = window.location.pathname.endsWith('index.html') ||
                      window.location.pathname === '/' ||
                      window.location.pathname.endsWith('/');
  if (!isLoginPage) {
    requireAuth();
  }
})();
