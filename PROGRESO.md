# Kehilá — App Comunidades · Registro de Progreso

> Última actualización: 27 marzo 2026
> Estado: **✅ Prototipo completo (15 páginas) — Rediseño profesional en curso**

---

## 🎯 Descripción del proyecto

**Kehilá** es un prototipo navegable de una plataforma digital para comunidades judías en España.
Destinado a presentaciones con inversores.

- **Stack:** HTML + CSS + JavaScript puro (cero frameworks)
- **Diseño:** Mobile-first, responsive
- **Auth:** Simulada con `localStorage`
- **Datos:** Mock data en `data.js`
- **Fuentes:** Inter (UI) + Frank Ruhl Libre (hebreo/marca)

---

## 🎨 Rediseño profesional (27 marzo 2026)

- Eliminados gradientes de colores en event cards (ahora navy uniforme)
- Eliminados hover lifts en todas las cards y botones (`translateY` → sin movimiento)
- Border-radius reducidos globalmente (12px → 8px, 20px → 12px)
- Sombras rediseñadas con offset x/y real
- Badges con recuadro (border + fondo suave) en lugar de píldoras sin borde
- Tabs rediseñadas: underline style (como Linear/Notion) en lugar de cápsulas
- Emojis eliminados del marketplace (servicios.html)
- Botones de acción en admin compactos: Aprobar/Rechazar/Suspender/Banear → tags pequeños
- Avatar del sidebar es enlace directo al perfil del usuario

### `perfil.html` — Perfil del miembro ← NUEVA PÁGINA
- Foto de perfil subible (FileReader → base64 → localStorage)
- Datos completos del formulario de solicitud (nombre, apellidos, teléfono, doc, dirección, comunidad)
- Número de solicitud `#KEH-YYYYMM-XXXX` con estado
- Edición de campos básicos (nombre, teléfono, dirección)
- Acceso desde avatar del sidebar · Botón ← Volver en la página

---

## 🐛 Bugs corregidos (25 marzo 2026)

### Login no funcionaba — 3 bugs encadenados

1. **Contraseñas no coincidían:** Las contraseñas en `auth.js` eran `Admin1234`, `Miembro1234`, `Nuevo1234` pero la pantalla de demo mostraba `admin123`. Se unificaron a minúsculas simples.

2. **Login usaba `MOCK_USERS` en vez de `USERS_DB`:** `index.html` buscaba el usuario en `MOCK_USERS` (data.js) que **no tiene campo `password`**, siempre fallaba. Se corrigió para usar la función `login()` de `auth.js`.

3. **`auth.js` no estaba cargado en `index.html`:** Solo cargaba `data.js`. Se añadió `<script src="js/auth.js"></script>` antes de `data.js`.

### Credenciales actuales (correctas)
| Usuario | Email | Contraseña |
|---|---|---|
| 🔥 Admin | `admin@kehila.es` | `admin123` |
| 👤 Miembro | `moshe@kehila.es` | `moshe123` |
| ⏳ Pendiente | `nuevo@kehila.es` | `nuevo123` |

### Ubicación real del proyecto
El proyecto está en `/Users/isaacayash/Desktop/kehila/` (no en `/Users/isaacayash/kehila/`).

### Servidor local
```bash
cd /Users/isaacayash/Desktop/kehila && python3 -m http.server 3000
```
URL: **http://localhost:3000/index.html**


## 🎨 Sistema de diseño

### Colores
| Variable | Valor | Uso |
|---|---|---|
| `--color-primary` | `#1B2E5E` | Navy — color principal |
| `--color-gold` | `#C9A84C` | Dorado — acento |
| `--color-bg` | `#F5F6FA` | Fondo gris claro |
| `--color-border` | `#E2E8F0` | Bordes |
| `--color-text` | `#1A202C` | Texto principal |
| `--color-text-secondary` | `#4A5568` | Texto secundario |
| `--color-text-muted` | `#718096` | Texto tenue |

### Tipografía
- **UI:** Inter (400, 500, 600, 700)
- **Hebreo / Marca:** Frank Ruhl Libre (400, 700)
- **Sidebar width:** `240px`
- **Border radius:** `--radius-sm: 6px` · `--radius-md: 10px` · `--radius-lg: 14px` · `--radius-xl: 20px`

---

## 📁 Estructura de archivos

```
kehila/
├── index.html          ← Login + Registro (4 pasos con verificación de identidad)
├── home.html           ← Dashboard del miembro
├── perfil.html         ← Perfil del miembro (foto, datos personales, solicitud) ← NUEVO
├── admin.html          ← Panel de administración
├── eventos.html        ← Eventos comunitarios
├── calendario.html     ← Calendario hebreo
├── wallap.html         ← Marketplace comunitario
├── kosher.html         ← Directorio kosher
├── rav.html            ← Preguntas al Rabino
├── donativos.html      ← Campañas de donación
├── noticias.html       ← Noticias de la comunidad
├── shiurim.html        ← Clases de Torah
├── siddur.html         ← Libro de rezos
├── business.html       ← Directorio de negocios
├── servicios.html      ← Servicios comunitarios
├── css/
│   ├── main.css        ← Variables, reset, utilidades
│   ├── components.css  ← Botones, cards, modales, toasts
│   └── pages.css       ← Sidebar, bottom nav, layouts
├── js/
│   ├── auth.js         ← Autenticación (Supabase + mock fallback)
│   ├── nav.js          ← Navegación dinámica (sidebar + bottom nav)
│   ├── data.js         ← Mock data
│   ├── registro.js     ← Formulario de registro 4 pasos
│   └── media.js        ← Gestión de media
└── img/                ← Fotos comunidad (mosaico landing)
```

---

## 🔐 Credenciales de demo

| Usuario | Email | Contraseña | Rol |
|---|---|---|---|
| Rabino David Levi | `admin@kehila.es` | `admin123` | Admin |
| Moshe Goldstein | `moshe@kehila.es` | `moshe123` | Miembro activo |
| Rivka Cohen | `rivka@kehila.es` | `rivka123` | Miembro activo |

---

## 📄 Páginas — Detalle completo

### `index.html` — Login & Registro
- Layout dividido: 42% hero navy (desktop) + 58% formulario
- 3 vistas: login · registro · pantalla de éxito
- Transiciones animadas (fade + slide horizontal)
- Validación inline, toggle de contraseña, medidor de fortaleza
- Botones de autorrelleno con credenciales demo
- Maneja estados: activo / pendiente / baneado

---

### `home.html` — Dashboard
- Saludo personalizado "¡Boker tov, [Nombre]!" + fecha hebrea
- Franja de zmanim (horarios de tefila) horizontal scrollable
- Grid de 12 módulos (4 cols desktop / 3 mobile) — todos los accesos rápidos
- Eventos próximos en scroll horizontal (cards con plazas y botón inscribirse)
- Feed de noticias (1 destacada grande + 4 compactas)
- Card de Shabat (fondo navy, parasha, velas, havdalá)

---

### `admin.html` — Panel de Administración
- Requiere rol `admin` (`requireAdmin()`)
- 5 tabs: Resumen · Usuarios · Eventos · Noticias · Marketplace
- **Resumen:** 4 métricas + tabla de actividad reciente
- **Usuarios:** búsqueda, filtros, banner de pendientes pulsante, tabla con acciones, modales aprobar/banear
- **Eventos:** lista con barras de aforo, modal nuevo evento, cancelar
- **Noticias:** toggle pin, eliminar con confirmación, modal nueva noticia
- **Marketplace:** tabla wallap, filtros, toggle visible/oculto, eliminar

---

### `eventos.html` — Eventos
- Toggle vista: Lista / Calendario
- Lista: 5 chips de filtro, grid 2 cols, borde izquierdo por categoría
- Estados de inscripción: Inscribirse → modal → Inscrito ✓ / Lista de espera
- Calendario: grid mensual navegable, puntos de evento, panel lateral al hacer clic

---

### `wallap.html` — Marketplace
- Barra de búsqueda grande con botón "Publicar" integrado
- 5 tabs de tipo: Todo / Venta / Alquiler / Servicios / Busco
- 3 filtros secundarios (precio, ciudad, orden)
- Grid 3 cols — placeholder de imagen por color de vendedor
- Modal "Contactar" con aviso de mensajería comunitaria
- Modal "Publicar" con input de foto + preview en vivo

---

### `kosher.html` — Kosher App
- Banner alerta para reportar cambios de certificación
- 2 tabs grandes: Restaurantes / Productos
- **Restaurantes:** filtro ciudad + checkboxes supervisión, tarjetas con badges dorados, tel clickable, link Maps
- **Productos:** búsqueda texto + código de barras, filtros Pesaj / Halav Israel, grid 3 cols, overlay "Sin stock"

---

### `rav.html` — Preguntas al Rabino
- Hero card navy + gold con badges de anonimato
- Formulario: chips de categoría, textarea con contador 0/1000, toggle público, pantalla de éxito animada con nº referencia
- Sección pública: búsqueda + filtros + ordenación, 6 tarjetas Q&A expandibles
- Cada tarjeta: pregunta (fondo gris) + respuesta (blanco), contador de likes, botón compartir
- "Mis preguntas" colapsable con estados (respondida / pendiente)

---

### `donativos.html` — Donaciones
- Hero con versículo hebreo en Frank Ruhl Libre dorado + fila de estadísticas
- 3 campañas con banners de color, patrón geométrico CSS, barras de progreso animadas al cargar
- Pila de avatares de donantes superpuestos
- Card de Tzedaká general
- Modal de donación en 2 pasos (indicadores de paso):
  - Paso 1: 6 botones de importe (€18 Jaí, €36, €54, €100, €180, €360), importe personalizado, nota de gematría, toggle recurrente, campo dedicatoria
  - Paso 2: resumen + aviso Stripe
- Confirmación: overlay navy pantalla completa, corazón dorado pulsante, "Todá Rabá!", actualiza barra en vivo
- Historial colapsable + botón certificado PDF (toast mock)
- Footer: "צְדָקָה תַּצִּיל מִמָּוֶת"

---

### `noticias.html` — Noticias
- Card destacada grande (hero azul navy, clickable → modal artículo completo)
- Barra: búsqueda + selector orden
- 7 chips de categoría (Todas / Kashrut / Comunidad / España / Cultura / Calendario / Israel)
- Banner de noticia anclada (pinned)
- Grid 2 cols — tarjetas con: emoji, categoría, fecha, título, extracto
- Expandir artículo inline (acordeón) sin modal
- Botón suscribirse a notificaciones
- 7 noticias en total (5 mock + 2 extras añadidas)

---

### `shiurim.html` — Clases de Torah
- Franja de 4 estadísticas (shiurim, profesores, horas, reproducciones)
- Card del shiur más visto (hero navy con botón play)
- Toolbar: búsqueda + filtro nivel + filtro profesor + orden
- Scroll de 8 chips de categoría
- Grid 3 cols — tarjetas con: thumbnail por categoría, nivel, duración, reproducciones, profesor
- Hover → overlay de play
- Modal player completo:
  - Pantalla oscura con emoji, título, profesor
  - Barra de progreso interactiva (scrubbing)
  - Botones play/pausa/±15s (play fake con intervalo)
  - Descripción + badges
  - Lista "A continuación" (misma categoría)
- Al completar → toast "¡Hazak uvaruj!"

---

### `siddur.html` — Libro de Rezos
- Layout: sidebar lista (280px) + panel de texto principal
- 5 tabs de tefila: Shajarit · Minjá · Arvit · Shabat · Especiales
- Lista de secciones con: número, nombre en hebreo, nombre en español, ícono marcador
- Panel principal:
  - Título en hebreo (Frank Ruhl Libre)
  - Controles: A− / A+ para tamaño de fuente
  - Toggle modo: Completo (3 cols) · Solo hebreo · Solo traducción
  - Botón marcador (persiste en localStorage)
  - Barra de progreso + navegación prev/next
- Textos reales de: Modé Aní, Netilat Iadáim, Berajot HaShajar, Shemá, Amidá, Aleinu, Lejá Dodí, Kidúsh, Havdalá, Halel, Birkat Hamazón
- Notas halájicas por sección
- Alert de zman (tiempo límite de Shajarit) en cabecera
- Selector de nusaj: Sefaradí / Ashkenaz / Ari / Italki

---

### `business.html` — Directorio de Negocios
- Hero navy con stats (24 negocios, 8 categorías, ciudades)
- Toolbar: búsqueda + filtro ciudad
- Layout: sidebar categorías (con contadores) + grid de negocios
- 8 categorías: Gastronomía, Profesionales, Educación, Comercio, Salud, Inmuebles, Tecnología
- Grid 2 cols — tarjetas con: logo/emoji, nombre, categoría, badges (Verificado / Kosher / Cierra Shabat), descripción, dirección, rating con estrellas
- Modal detalle: logo grande, badges, descripción completa, horario, botones Llamar / Compartir / Reseña
- Modal registrar negocio: formulario completo con checkboxes kosher/shabat/hebreo
- 12 negocios reales del ecosistema judío español

---

### `servicios.html` — Servicios Comunitarios
- Card de Shabat: velas + havdalá con selector de ciudad, parasha en hebreo
- **Horarios de minián:** 3 tarjetas (Shajarit semana / Minjá+Arvit / Shabat+Festividades) con botones de recordatorio
- **Simjot:** feed de 4 anuncios (nacimiento, bar mitzvá, compromiso, bat mitzvá) con badges por tipo
- **Servicios del ciclo de vida:** 4 tarjetas (Brit Milá, Jupá, Levayá, Guiur) con contactos directos
- **Contactos rápidos:** strip de 4 (Rabino, Secretaría, Gabay, Tzedaká)
- **Modal anunciar simjá:** selector de tipo (7 opciones), formulario con nombre/familia/fecha/mensaje

---

## 🧩 Archivos JS — Resumen técnico

### `auth.js`
- `USERS_DB` — 3 usuarios demo (admin, miembro, pending)
- `login(email, password)` → guarda en `localStorage` key `kehila_user`
- `logout()` → limpia localStorage, redirige a index.html
- `getCurrentUser()` → parsea localStorage
- `requireAuth()` → redirige a index.html si no hay sesión
- `requireAdmin()` → redirige a home.html si no es admin
- `getAvatarColor(name)` → devuelve 0–7 según suma de char codes

### `nav.js`
- `NAV_ITEMS` — 3 grupos (Principal / Comunidad / Tefila) + 13 items
- `BOTTOM_NAV_ITEMS` — 5 items para móvil
- `buildSidebar(activePage)` → inyecta HTML completo del sidebar en `#sidebar-placeholder`
- `buildBottomNav(activePage)` → appends bottom nav al body
- `initNav(activePage)` → llama a los dos anteriores
- `showToast(message, type, duration)` → crea toast con auto-dismiss
- Admin nav item solo se muestra si `user.role === 'admin'`

### `data.js`
- `MOCK_USERS` — 8 usuarios
- `MOCK_EVENTOS` — 6 eventos
- `MOCK_NOTICIAS` — 5 noticias
- `MOCK_SHIURIM` — 8 clases
- `MOCK_WALLAP` — 10 listings marketplace
- `MOCK_KOSHER_PRODUCTOS` — 12 productos
- `MOCK_RESTAURANTES` — 6 restaurantes
- `MOCK_DONATIVOS` — 3 campañas
- `MOCK_PREGUNTAS` — 3 preguntas al rav
- Helpers: `formatEuros()`, `formatFecha()`, `formatFechaCorta()`, `calcularPorcentaje()`

---

## 🚀 Cómo ejecutar

```bash
cd /Users/isaacayash/kehila
python3 -m http.server 3000
```

Abrir en el navegador: **http://localhost:3000/index.html**

---

## 📌 Próximos pasos sugeridos

### Diseño
- [ ] Continuar refinando páginas interiores (eventos, noticias, kosher)
- [ ] Modo oscuro

### Funcionalidad
- [ ] Conectar a backend real (Supabase — auth ya configurado)
- [ ] Sistema de mensajería interna entre miembros
- [ ] Push notifications para eventos y noticias
- [ ] Integración real de Stripe para donativos
- [ ] Calendario hebreo sincronizado (API Hebcal)
- [ ] Exportación de certificados PDF reales

### App
- [ ] App nativa (React Native / Capacitor)
- [ ] PWA mejorada (ya tiene manifest.json + sw.js)
