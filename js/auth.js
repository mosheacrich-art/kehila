/* =============================================
   KEHILÁ — auth.js
   Simulación de autenticación sin backend
   ============================================= */

const USERS_DB = {
  'admin@kehila.es': {
    userId: 'u001',
    name: 'Rabino David Levi',
    email: 'admin@kehila.es',
    password: 'admin123',
    role: 'admin',
    status: 'active',
    comunidad: 'Bet El Madrid',
    initials: 'DL'
  },
  'moshe@kehila.es': {
    userId: 'u002',
    name: 'Moshe Goldstein',
    email: 'moshe@kehila.es',
    password: 'moshe123',
    role: 'miembro',
    status: 'active',
    comunidad: 'Bet El Madrid',
    initials: 'MG'
  },
  'nuevo@kehila.es': {
    userId: 'u003',
    name: 'Carlos Nuevo',
    email: 'nuevo@kehila.es',
    password: 'nuevo123',
    role: 'miembro',
    status: 'pending',
    comunidad: 'Bet El Madrid',
    initials: 'CN'
  }
};

const SESSION_KEY = 'kehila_user';

/**
 * Intenta hacer login con email y contraseña.
 * @returns {{ ok: boolean, error?: string }}
 */
function login(email, password) {
  const user = USERS_DB[email.toLowerCase().trim()];
  if (!user) {
    return { ok: false, error: 'No existe una cuenta con este correo electrónico.' };
  }
  if (user.password !== password) {
    return { ok: false, error: 'Contraseña incorrecta. Inténtalo de nuevo.' };
  }
  if (user.status === 'banned') {
    return { ok: false, error: 'Tu cuenta ha sido suspendida. Contacta al administrador.' };
  }
  if (user.status === 'pending') {
    // Sí se permite entrar pero con rol limitado
    const sessionData = {
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      comunidad: user.comunidad,
      initials: user.initials,
      loginAt: new Date().toISOString()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    return { ok: true, status: 'pending' };
  }

  const sessionData = {
    userId: user.userId,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    comunidad: user.comunidad,
    initials: user.initials,
    loginAt: new Date().toISOString()
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  return { ok: true, status: 'active' };
}

/**
 * Cierra la sesión y redirige a login.
 */
function logout() {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = 'index.html';
}

/**
 * Devuelve el usuario de la sesión actual o null.
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

/**
 * Redirige a login si no hay sesión activa.
 * Llámalo al inicio de cada página protegida.
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
 * Redirige a home si el usuario no es admin.
 */
function requireAdmin() {
  const user = requireAuth();
  if (!user) return null;
  if (user.role !== 'admin') {
    window.location.href = 'home.html';
    return null;
  }
  return user;
}

/**
 * Devuelve true si el usuario actual es admin.
 */
function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === 'admin';
}

/**
 * Genera el color de avatar según el nombre (0-7).
 */
function getAvatarColor(name) {
  if (!name) return '0';
  const code = name.charCodeAt(0) + (name.charCodeAt(1) || 0);
  return String(code % 8);
}

/**
 * Crea el HTML de un avatar con iniciales.
 */
function renderAvatar(user, size = 'md') {
  const color = getAvatarColor(user.name || user.initials || 'U');
  const initials = user.initials || (user.name ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '??');
  return `<div class="avatar avatar-${size}" data-color="${color}">${initials}</div>`;
}

// Auto-inicializar requireAuth en todas las páginas excepto index.html
(function () {
  const isLoginPage = window.location.pathname.endsWith('index.html') ||
                      window.location.pathname === '/' ||
                      window.location.pathname.endsWith('/');
  if (!isLoginPage) {
    requireAuth();
  }
})();
