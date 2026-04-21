# Kehila — Jabad Barcelona · Registro de Progreso

> Ultima actualizacion: 21 abril 2026
> Estado: **Backend Supabase conectado — Analytics real — Legal completo — Listo para stores**

---

## Instrucciones para Claude Code

Cuando el usuario abra una nueva sesion, lee este archivo primero para saber el estado del proyecto.

- **Repo:** `mosheacrich-art/kehila` (rama `master`)
- **Directorio local:** `C:\Users\Elias\kehila-patch\`
- **GitHub token:** guardado en memoria Claude (`reference_github.md`)
- **Push:** siempre via GitHub Contents API con Python, nunca git CLI
- **Python:** `C:\Users\Elias\AppData\Local\Programs\Python\Python311\python.exe`
- **Supabase URL:** `https://vvrvuhugpvqytelhsdnk.supabase.co`
- **Funcion Supabase:** `getSupabase()` esta en `js/auth.js`
- **Tabla usuarios:** `profiles`

---

## ⚙️ Precio editable por admin (21 abril 2026)

- Nuevo tab "Ajustes" en `admin.html` donde el admin puede cambiar el precio de publicacion
- Precio guardado en `localStorage` bajo la clave `kehila_precio_publicacion`
- El modal de pago en `business.html` lee el precio dinamicamente desde localStorage
- Si no hay precio guardado, el valor por defecto es 2,99 €/mes

---

## 💳 Pago para publicar negocio (21 abril 2026)

- Al hacer submit del formulario "Publicar negocio" en `business.html`, se abre un modal de pago antes de publicar
- Precio: **2,99 € / mes** (pago recurrente)
- Modal con campos de tarjeta: numero (formateo automatico), caducidad, CVV, nombre
- Validacion basica de todos los campos antes de confirmar
- Al confirmar: se publica el negocio, se muestra toast con precio y se activa la suscripcion
- Cancelar cierra el modal sin publicar
- Acepta Visa, Mastercard, Amex

---

## Stack tecnico

| Capa | Tecnologia |
|------|-----------|
| Frontend | HTML + CSS + JS puro (sin frameworks) |
| Auth | Supabase Auth |
| Base de datos | Supabase (PostgreSQL) |
| Estilos | CSS custom con variables (`css/main.css`, `css/components.css`) |
| Charts | Chart.js 4.4.3 (CDN) |
| PWA | `manifest.json` + `sw.js` |
| Iconos | 22 tamanos generados desde logo (`img/icon-*.png`) |

### Colores del sistema
| Variable | Valor | Uso |
|----------|-------|-----|
| `--color-primary` | `#1B2E5E` | Navy principal |
| `--color-gold` | `#C9A84C` | Dorado acento |
| `--color-bg` | `#F5F6FA` | Fondo gris claro |
| `--color-border` | `#E2E8F0` | Bordes |
| `--color-text` | `#1A202C` | Texto principal |

---

## Estado actual por modulo

### Autenticacion
- [x] Login con Supabase Auth real
- [x] Registro de 4 pasos
- [x] `requireAuth()` / `requireAdmin()` en todas las paginas
- [x] Footer legal en login (`index.html`) — links a privacidad, aviso legal, cookies

### Paginas principales (todas con sidebar + bottom nav)
- [x] `home.html` — Dashboard con saludo, zmanim, grid modulos, eventos, noticias, Shabat
- [x] `noticias.html` — Feed de noticias, articulos expandibles, tracking de lecturas
- [x] `eventos.html` — Lista + calendario, inscripciones
- [x] `admin.html` — Panel admin con 6 tabs incluyendo Analytics
- [x] `perfil.html` — Perfil del miembro
- [x] `donativos.html` — Campanas con barras progreso, modal donacion 2 pasos
- [x] `wallap.html` — Marketplace comunitario
- [x] `kosher.html` — Restaurantes y productos kosher
- [x] `rav.html` — Preguntas al Rabino
- [x] `shiurim.html` — Clases de Torah con player
- [x] `siddur.html` — Libro de rezos (hebreo + traduccion)
- [x] `business.html` — Directorio de negocios
- [x] `servicios.html` — Servicios comunitarios
- [x] `calendario.html` — Calendario hebreo
- [x] `citas-rabino.html` — Citas con el Rabino
- [x] `comunidad.html` — Directorio de la comunidad
- [x] `voluntariado.html` — Voluntariado
- [x] `tienda.html` — Tienda
- [x] `contacto.html` — Contacto

### Paginas legales (requeridas para web y stores)
- [x] `privacidad.html` — Politica de privacidad RGPD (10 secciones)
- [x] `aviso-legal.html` — Aviso legal LSSI (6 secciones)
- [x] `cookies.html` — Politica de cookies (5 secciones)

### Analytics (real con Supabase)
- [x] `js/analytics.js` — Tracking real + dashboard con Chart.js
- [x] `js/nav.js` — `trackPageView(page)` al cargar cada seccion
- [x] `js/noticias.js` — `trackNewsRead(id)` al abrir cada articulo
- [x] `admin.html` — Tab "Analiticas" con KPIs, graficas, tabla noticias
- [x] `supabase_analytics.sql` — Tablas `page_views` y `news_reads` (ya ejecutado en Supabase)

### PWA / App stores
- [x] `manifest.json` — Iconos completos (48 a 1024px), screenshots placeholder
- [x] `sw.js` — Service worker existente
- [x] 22 tamanos de iconos generados desde logo (`img/icon-*.png`)
- [ ] Screenshots reales para stores (2 capturas 1080x1920px)
- [ ] Subir a Google Play via PWABuilder
- [ ] Subir a App Store via PWABuilder

### Footer legal en todas las paginas
- [x] `js/nav.js` — `buildLegalFooter()` inyecta footer automaticamente en todas las paginas con sidebar
- [x] `index.html` — Footer legal dentro de `.auth-form-panel` (posicion correcta)

---

## Tablas Supabase

| Tabla | Descripcion | Estado |
|-------|-------------|--------|
| `auth.users` | Usuarios (gestionado por Supabase Auth) | Activa |
| `profiles` | Datos de perfil de cada usuario | Activa |
| `page_views` | Visitas por seccion (id, page, user_id, created_at) | Activa |
| `news_reads` | Lecturas de noticias (id, news_id, user_id, created_at) | Activa |

**RLS:** habilitado en `page_views` y `news_reads`. Insert: abierto. Select: solo usuarios autenticados.

---

## Estructura de archivos JS

### `js/auth.js`
- `getSupabase()` — devuelve el cliente Supabase (usar siempre esta funcion)
- `login(email, password)` — auth con Supabase
- `logout()` — cierra sesion, redirige a index.html
- `getCurrentUser()` — usuario actual desde Supabase session
- `requireAuth()` / `requireAdmin()` — guards de pagina

### `js/nav.js`
- `initNav(activePage)` — construye sidebar + bottom nav, trackea page view, inyecta footer legal
- `buildLegalFooter()` — footer con links a privacidad/aviso-legal/cookies
- `showToast(message, type, duration)` — toast notifications

### `js/analytics.js`
- `trackPageView(page)` — inserta en `page_views` (Supabase)
- `trackNewsRead(newsId)` — inserta en `news_reads` (Supabase)
- `loadAnalyticsDashboard()` — carga KPIs y graficas en el tab de admin
- Datos base simulados como fallback si Supabase no tiene datos aun

### `js/noticias.js`
- `abrirNoticia(id)` — llama a `trackNewsRead(id)` al abrir cada articulo

---

## Credenciales de demo

| Usuario | Email | Contrasena | Rol |
|---------|-------|-----------|-----|
| Admin | `admin@kehila.es` | `admin123` | Admin |
| Miembro | `moshe@kehila.es` | `moshe123` | Miembro activo |
| Pendiente | `nuevo@kehila.es` | `nuevo123` | Pendiente |

---

## Proximos pasos pendientes

- [ ] Screenshots reales (1080x1920px) para Google Play y App Store
- [ ] Subir a Google Play via PWABuilder
- [ ] Subir a App Store via PWABuilder  
- [ ] Integrar Stripe real para donativos
- [ ] Sistema de mensajeria interna
- [ ] Push notifications
- [ ] Calendario hebreo con API Hebcal real
- [ ] Modo oscuro
