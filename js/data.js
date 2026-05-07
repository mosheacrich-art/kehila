/**
 * @file data.js
 * @description Datos de fallback / mock para desarrollo y UI inicial.
 *
 * ⚠️  ARCHIVO TEMPORAL — PENDIENTE DE ELIMINAR EN PRODUCCIÓN COMPLETA
 * ─────────────────────────────────────────────────────────────────────
 * Este archivo existe porque la migración a Supabase está en curso.
 * Cada módulo intenta cargar datos reales de Supabase y, si no los tiene,
 * usa estos mocks como fallback para que la UI no quede vacía.
 *
 * PLAN DE ELIMINACIÓN:
 *  1. Completar migración de cada tabla a Supabase con datos reales
 *  2. Eliminar la referencia a los MOCK_* del módulo correspondiente
 *  3. Cuando todos los módulos estén migrados, eliminar este archivo
 *     y quitarlo de todos los <script> en los HTML
 *
 * VARIABLES EXPORTADAS (accesibles globalmente):
 *  - MOCK_USERS         → Usuarios de prueba (tabla: profiles)
 *  - MOCK_EVENTOS       → Eventos (tabla: eventos)
 *  - MOCK_NOTICIAS_V2   → Noticias (tabla: noticias) — MUTABLE, se sobrescribe
 *  - MOCK_DONATIVOS     → Campañas de donación (tabla: donativos)
 *  - MOCK_WALLAP        → Items de marketplace (tabla: wallap_items)
 *  - MOCK_PREGUNTAS_RAV → Preguntas al Rav (tabla: preguntas_rav)
 *  - CATEGORIA_CONFIG   → Configuración visual de categorías de noticias
 *
 * SEGURIDAD: No contiene contraseñas reales ni datos de usuarios reales.
 * Los emails son ficticios (@kehila.es, @ejemplo.es).
 */

/* ─── USUARIOS ─── */
const MOCK_USERS = [];

/* ─── EVENTOS ─── */
const MOCK_EVENTOS = [];

/* ─── NOTICIAS ─── */
const MOCK_NOTICIAS = [];

/* ─── SHIURIM ─── */
const MOCK_SHIURIM = [];

/* ─── WALLAP (marketplace) ─── */
const MOCK_WALLAP = [];

/* ─── PRODUCTOS KOSHER ─── */
const MOCK_KOSHER_PRODUCTOS = [];

/* ─── RESTAURANTES KOSHER ─── */
const MOCK_RESTAURANTES = [];

/* ─── DONATIVOS / CAMPAÑAS ─── */
const DONATIVO_BANCO = {
  banco: 'Bankinter',
  titular: 'JABAD LUBAVITCH FUNDACION PRIVADA',
  iban: 'ES63 0128 0500 1005 0000 8512',
  swift: 'BKBKESMM'
};

const MOCK_DONATIVOS = [];

/* ─── PREGUNTAS AL RAV ─── */
const MOCK_PREGUNTAS = [];

/* ─── HELPERS ─── */
function getUserById(userId) {
  return MOCK_USERS.find(u => u.userId === userId) || null;
}

function getEventoById(id) {
  return MOCK_EVENTOS.find(e => e.id === id) || null;
}

function getProductosByCategoria(categoria) {
  return MOCK_KOSHER_PRODUCTOS.filter(p => p.categoria === categoria);
}

function getDonativos(soloActivos = true) {
  if (!soloActivos) return MOCK_DONATIVOS;
  const hoy = new Date();
  return MOCK_DONATIVOS.filter(d => new Date(d.fechaFin) >= hoy);
}

function calcularPorcentaje(recaudado, objetivo) {
  return Math.min(Math.round((recaudado / objetivo) * 100), 100);
}

function formatEuros(cantidad) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(cantidad);
}

function formatFecha(fechaStr, opciones = {}) {
  const fecha = new Date(fechaStr);
  const defaults = { day: 'numeric', month: 'long', year: 'numeric' };
  return fecha.toLocaleDateString('es-ES', { ...defaults, ...opciones });
}

function formatFechaCorta(fechaStr) {
  return formatFecha(fechaStr, { day: 'numeric', month: 'short' });
}

/* ─── SHIURIM V2 ─── */
const MOCK_SHIURIM_V2 = [];

const DEVAR_TORAH = [];

/* ─── JEWISH BUSINESS ─── */
const MOCK_BUSINESSES = [];

const MOCK_COWORK = [];

/* ─── SERVICIOS COMUNITARIOS ─── */
const MOCK_TENYAD = [];

const MOCK_TALMUD_TORAH = [];

const MOCK_TT_MENSAJES = [];

const MOCK_BIKUR_JOLIM = [];

const MOCK_GEMILUT = [];

// ─── DATOS TIENDA ────────────────────────────────────────────────

const MOCK_LIBROS = [];

const MOCK_JUDAICA = [];

const MOCK_VINOS = [];

/* ─── NOTICIAS V2 ─── */
const MOCK_NOTICIAS_V2 = [];

const CATEGORIA_CONFIG = {
  'comunidad': { color: '#1B2E5E', label: 'Comunidad' },
  'israel':    { color: '#991B1B', label: 'Israel' },
  'halacha':   { color: '#C9A84C', label: 'Halaká' },
  'evento':    { color: '#166534', label: 'Evento' },
  'kashrut':   { color: '#92400E', label: 'Kashrut' }
};
