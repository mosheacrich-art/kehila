/**
 * @file data.js
 * @description Contenedores de estado compartido en memoria para páginas que
 * cargan listas desde Supabase (eventos, negocios, kosher, noticias...) y
 * configuración estática de categorías de noticias.
 *
 * Estos arrays NO contienen datos mock: se declaran vacíos y cada página los
 * rellena con `push`/`unshift`/`length = 0` al recibir la respuesta real de
 * Supabase. Viven aquí en vez de en cada página porque varias páginas
 * comparten el mismo nombre de variable (p.ej. MOCK_EVENTOS en eventos.html,
 * home.html y admin.html).
 */

/* ─── EVENTOS (eventos.html, home.html, admin.html, calendario.html) ─── */
const MOCK_EVENTOS = [];

/* ─── USUARIOS (admin.html) ─── */
const MOCK_USERS = [];

/* ─── NEGOCIOS Y COWORK (business.html) ─── */
const MOCK_BUSINESSES = [];
const MOCK_COWORK = [];

/* ─── KOSHER (kosher.html) ─── */
const MOCK_KOSHER_PRODUCTOS = [];
const MOCK_RESTAURANTES = [];

/* ─── NOTICIAS (js/noticias.js, noticia.html) ─── */
const MOCK_NOTICIAS_V2 = [];

const CATEGORIA_CONFIG = {
  'comunidad': { color: '#1B2E5E', label: 'Comunidad' },
  'israel':    { color: '#991B1B', label: 'Israel' },
  'halacha':   { color: '#C9A84C', label: 'Halaká' },
  'evento':    { color: '#166534', label: 'Evento' },
  'kashrut':   { color: '#92400E', label: 'Kashrut' }
};

/* ─── HELPERS ─── */
function formatEuros(cantidad) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(cantidad);
}
