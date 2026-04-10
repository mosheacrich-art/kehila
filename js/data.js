/* =============================================
   KEHILÁ — data.js
   Datos mock realistas para el prototipo
   ============================================= */

/* ─── USUARIOS ─── */
const MOCK_USERS = [
  {
    userId: 'u001',
    name: 'HaRav Dovid Libersohn',
    email: 'admin@jabad.barcelona',
    role: 'admin',
    status: 'active',
    initials: 'DL',
    comunidad: 'Jabad Barcelona',
    joinDate: '2022-03-15',
    telefono: '+34 612 345 678',
    bio: 'Rabino de Jabad Barcelona desde 1999. Emisario del Rebe de Lubavitch.'
  },
  {
    userId: 'u002',
    name: 'Moshe Goldstein',
    email: 'moshe@jabad.barcelona',
    role: 'miembro',
    status: 'active',
    initials: 'MG',
    comunidad: 'Jabad Barcelona',
    joinDate: '2023-06-22',
    telefono: '+34 698 765 432',
    bio: 'Miembro activo de la comunidad. Participa en el minián de los viernes.'
  },
  {
    userId: 'u003',
    name: 'Rivka Cohen',
    email: 'rivka@jabad.barcelona',
    role: 'miembro',
    status: 'active',
    initials: 'RC',
    comunidad: 'Jabad Barcelona',
    joinDate: '2023-09-10',
    telefono: '+34 645 123 789',
    bio: 'Profesora en el talmud torá de la comunidad. Organiza las actividades de Shabat para niños.'
  },
  {
    userId: 'u004',
    name: 'Jaim Benveniste',
    email: 'jaim@jabad.barcelona',
    role: 'mod',
    status: 'active',
    initials: 'JB',
    comunidad: 'Jabad Barcelona',
    joinDate: '2022-11-05',
    telefono: '+34 655 987 321',
    bio: 'Gabay de la sinagoga. Coordina los servicios y el mantenimiento.'
  },
  {
    userId: 'u005',
    name: 'Carlos Nuevo',
    email: 'nuevo@jabad.barcelona',
    role: 'miembro',
    status: 'pending',
    initials: 'CN',
    comunidad: 'Jabad Barcelona',
    joinDate: '2024-02-18',
    telefono: '+34 612 000 111',
    bio: 'Interesado en la conversión. Lleva 6 meses asistiendo a clases.'
  },
  {
    userId: 'u006',
    name: 'Sara Mizrahi',
    email: 'sara@jabad.barcelona',
    role: 'miembro',
    status: 'pending',
    initials: 'SM',
    comunidad: 'Jabad Barcelona',
    joinDate: '2024-03-01',
    telefono: '+34 677 222 333',
    bio: 'Nueva en Madrid. Judía de origen marroquí buscando comunidad.'
  },
  {
    userId: 'u007',
    name: 'Avi Peretz',
    email: 'avi@jabad.barcelona',
    role: 'miembro',
    status: 'banned',
    initials: 'AP',
    comunidad: 'Jabad Barcelona',
    joinDate: '2023-01-12',
    telefono: '+34 611 444 555',
    bio: 'Cuenta suspendida por uso inapropiado del foro comunitario.'
  },
  {
    userId: 'u008',
    name: 'Miriam Toledano',
    email: 'miriam@jabad.barcelona',
    role: 'miembro',
    status: 'active',
    initials: 'MT',
    comunidad: 'Jabad Barcelona',
    joinDate: '2022-08-30',
    telefono: '+34 699 666 777',
    bio: 'Directora del comité de damas. Organiza los eventos de recaudación de fondos.'
  }
];

/* ─── EVENTOS ─── */
const MOCK_EVENTOS = [
  {
    id: 'e1',
    titulo: 'Cena de Shabat — Abierta a todos',
    descripcion: 'Cada viernes, cientos de personas de todo el mundo se reúnen en Jabad Barcelona para compartir la cena de Shabat. Ambiente cálido, canciones, palabras de Torá. No importa tu nivel de observancia ni de dónde vengas — eres bienvenido.',
    fecha: '2026-04-11',
    hora: '20:30',
    lugar: 'Bet Jabad Barcelona — Carrer Montnegre, 14',
    aforo: 300,
    inscritos: 124,
    precio: 25,
    isFree: false,
    categoria: 'shabat',
    colorCategoria: '#C9A84C'
  },
  {
    id: 'e2',
    titulo: 'Séder de Pesaj 5786 — Cena comunitaria',
    descripcion: 'El gran Séder comunitario de Jabad Barcelona. Hagadá bilingüe hebreo-español, cuatro copas de vino kosher le-Pesaj, menú completo bajo supervisión del Rav Dovid Libersohn. Bienvenidos judíos de todo el mundo. Plazas limitadas.',
    fecha: '2026-04-13',
    hora: '21:00',
    lugar: 'Bet Jabad Barcelona — Carrer Montnegre, 14',
    aforo: 600,
    inscritos: 387,
    precio: 75,
    isFree: false,
    categoria: 'festividad',
    colorCategoria: '#1B2E5E'
  },
  {
    id: 'e3',
    titulo: 'Clase semanal de Torá para hombres',
    descripcion: 'Clase semanal impartida por el Rav Dovid Libersohn. Análisis de la Parashá de la semana con fuentes del Talmud y Jassidut Lubavitch. En español. Todos los niveles bienvenidos.',
    fecha: '2026-04-08',
    hora: '20:00',
    lugar: 'Bet Jabad — Sala de estudio',
    aforo: 30,
    inscritos: 14,
    precio: 0,
    isFree: true,
    categoria: 'clase',
    colorCategoria: '#166534'
  },
  {
    id: 'e4',
    titulo: 'Clase mensual para mujeres — Círculo de Mujeres',
    descripcion: 'Reunión mensual del Círculo de Mujeres de Jabad Barcelona, dirigida por la Rebbetzin Nechama Dina Libersohn. Un espacio de estudio, encuentro y espiritualidad para mujeres judías de todas las procedencias.',
    fecha: '2026-04-15',
    hora: '18:30',
    lugar: 'Bet Jabad — Sala Miriam',
    aforo: 25,
    inscritos: 17,
    precio: 0,
    isFree: true,
    categoria: 'clase',
    colorCategoria: '#993556'
  },
  {
    id: 'e5',
    titulo: 'Tour 3D del Call Judío de Barcelona',
    descripcion: 'Aventura tridimensional por el barrio judío medieval de Barcelona. Un viaje por el pasado de las calles del Call, mostrando la historia del pueblo judío en Catalunya desde la Edad Media hasta hoy. Grupos pequeños, experiencia única.',
    fecha: '2026-04-12',
    hora: '11:00',
    lugar: 'Call Barcelona — Carrer Sant Honorat, 9',
    aforo: 20,
    inscritos: 9,
    precio: 10,
    isFree: false,
    categoria: 'cultura',
    colorCategoria: '#92400E'
  },
  {
    id: 'e6',
    titulo: 'School of Life 2026 — Inscripciones abiertas',
    descripcion: 'Un viaje educativo e inolvidable de 10 días por los lugares más importantes de la historia judía mundial. Una experiencia única de aprendizaje y aventura para jóvenes. Organizado por Jabad Barcelona.',
    fecha: '2026-07-15',
    hora: '09:00',
    lugar: 'Salida desde Barcelona',
    aforo: 30,
    inscritos: 11,
    precio: 1500,
    isFree: false,
    categoria: 'viaje',
    colorCategoria: '#1B2E5E'
  }
];

/* ─── NOTICIAS ─── */
const MOCK_NOTICIAS = [
  {
    id: 'n1',
    isPinned: true,
    categoria: 'festividad',
    titulo: 'Pesaj 5786 en Jabad Barcelona — Guía completa',
    excerpt: 'Todo lo que necesitas para preparar Pesaj en Barcelona: bedikat jametz, venta del jametz con el Rav Dovid Libersohn, lista de productos kosher le-Pesaj disponibles en la ciudad, y el gran Séder comunitario.',
    contenido: 'Con la llegada de Nisán 5786, Jabad Barcelona se prepara para celebrar Pesaj.\n\nEl Rav Dovid Libersohn ha publicado la guía halachica completa para la preparación del hogar. Los tiempos exactos para la búsqueda y quema del jametz en Barcelona están disponibles en la sección de Calendario.\n\nVenta del jametz: contacta directamente con el Rav antes del 12 de abril.\n\nEl gran Séder comunitario tendrá lugar el lunes 13 de abril a las 21:00h en Bet Jabad, Carrer Montnegre 14. Inscripciones: +34 934 100 685.',
    autor: 'HaRav Dovid Libersohn',
    fecha: '2026-03-28',
    tiempoLectura: '4 min',
    colorCategoria: '#1B2E5E'
  },
  {
    id: 'n6',
    isPinned: false,
    categoria: 'comunidad',
    titulo: 'Nuevo Mikvé operativo — Calle Burdeos 25',
    excerpt: 'Jabad Barcelona estrena su nuevo Mikvé en Calle Burdeos 25. Instalaciones modernas y privadas. Acceso exclusivamente con cita previa contactando con la comunidad.',
    contenido: 'Con gran alegría anunciamos que el nuevo Mikvé de Jabad Barcelona está operativo.\n\nDirección: Calle Burdeos, 25, Barcelona.\nAcceso: solo con cita previa.\n\nPara solicitar cita: +34 607 922 805.',
    autor: 'Jabad Barcelona',
    fecha: '2026-03-05',
    tiempoLectura: '2 min',
    colorCategoria: '#1B2E5E'
  }
];

/* ─── SHIURIM ─── */
const MOCK_SHIURIM = [
  {
    id: 'sh001',
    titulo: 'Introducción al Talmud — Masechet Berajot',
    profesor: 'HaRav Dovid Libersohn',
    categoria: 'Talmud',
    duracion: '58 min',
    nivel: 'Intermedio',
    fecha: '2024-03-27',
    descripcion: 'Primera clase del nuevo ciclo sobre Masechet Berajot. Estudiamos las primeras mishnaiot sobre el Shemá.',
    reproducciones: 142
  },
  {
    id: 'sh002',
    titulo: 'Parashat Vaikrá — El libro de las ofrendas',
    profesor: 'HaRav Dovid Libersohn',
    categoria: 'Parashá',
    duracion: '42 min',
    nivel: 'Todos',
    fecha: '2024-03-25',
    descripcion: 'Análisis de la parashá de la semana con enfoque en las enseñanzas morales del korban.',
    reproducciones: 89
  },
  {
    id: 'sh003',
    titulo: 'Hilkhot Shabat — Leyes del Encendido',
    profesor: 'Jaim Benveniste',
    categoria: 'Halajá',
    duracion: '65 min',
    nivel: 'Avanzado',
    fecha: '2024-03-22',
    descripcion: 'Repaso completo de las leyes del encendido de velas de Shabat y Yom Tov según el Shulján Aruj.',
    reproducciones: 67
  },
  {
    id: 'sh004',
    titulo: 'Historia del pueblo judío en España — Sefarad',
    profesor: 'Rivka Cohen',
    categoria: 'Historia',
    duracion: '78 min',
    nivel: 'Todos',
    fecha: '2024-03-18',
    descripcion: 'Recorrido histórico por la presencia judía en la Península Ibérica desde la época romana hasta 1492.',
    reproducciones: 203
  },
  {
    id: 'sh005',
    titulo: 'Filosofía judía: Rambam y la Guía de Perplejos',
    profesor: 'HaRav Dovid Libersohn',
    categoria: 'Filosofía',
    duracion: '90 min',
    nivel: 'Avanzado',
    fecha: '2024-03-12',
    descripcion: 'Análisis del capítulo 1 de la Guía de Perplejos. La tensión entre razón y fe en el pensamiento de Maimónides.',
    reproducciones: 54
  },
  {
    id: 'sh006',
    titulo: 'Tefilá para principiantes — Shajarit',
    profesor: 'Rivka Cohen',
    categoria: 'Tefila',
    duracion: '35 min',
    nivel: 'Principiante',
    fecha: '2024-03-08',
    descripcion: 'Guía completa para el rezo matutino. Explicación de cada sección y su significado.',
    reproducciones: 311
  },
  {
    id: 'sh007',
    titulo: 'Kashrut Moderno — Aditivos y Productos Procesados',
    profesor: 'Jaim Benveniste',
    categoria: 'Kashrut',
    duracion: '52 min',
    nivel: 'Todos',
    fecha: '2024-03-05',
    descripcion: 'Cómo identificar ingredientes problemáticos en productos industriales. Lista de aditivos a evitar.',
    reproducciones: 178
  },
  {
    id: 'sh008',
    titulo: 'Las Cuatro Especies — Significado y Halajá',
    profesor: 'HaRav Dovid Libersohn',
    categoria: 'Festividades',
    duracion: '47 min',
    nivel: 'Todos',
    fecha: '2024-02-28',
    descripcion: 'Todo sobre el etrog, lulav, hadas y aravot para Sucot. Historia y enseñanzas de las cuatro especies.',
    reproducciones: 95
  }
];

/* ─── WALLAP (marketplace) ─── */
const MOCK_WALLAP = [
  {
    id: 'w001',
    titulo: 'Juego de Shabat — Candelabros de plata',
    tipo: 'venta',
    precio: 180,
    categoria: 'Judaica',
    descripcion: 'Par de candelabros de plata 925 estilo sefaradí. Sin uso, regalo que no utilizo. Con estuche original.',
    vendedor: 'Miriam Toledano',
    fecha: '2024-03-26',
    ubicacion: 'Madrid',
    emoji: '🕯️',
    estado: 'disponible'
  },
  {
    id: 'w002',
    titulo: 'Piso en alquiler — Zona comunidad',
    tipo: 'alquiler',
    precio: 1200,
    categoria: 'Inmuebles',
    descripcion: '3 habitaciones, 2 baños. A 5 min andando de la sinagoga y el colegio judío. Idealmente para familia religiosa. Sin mascotas.',
    vendedor: 'Moshe Goldstein',
    fecha: '2024-03-24',
    ubicacion: 'Madrid - Barrio Salamanca',
    emoji: '🏠',
    estado: 'disponible'
  },
  {
    id: 'w003',
    titulo: 'Clases particulares de hebreo bíblico',
    tipo: 'servicio',
    precio: 35,
    categoria: 'Educación',
    descripcion: 'Doy clases de hebreo bíblico y moderno. Todos los niveles. Online o presencial en Madrid. Precio por hora.',
    vendedor: 'Rivka Cohen',
    fecha: '2024-03-23',
    ubicacion: 'Madrid / Online',
    emoji: '📚',
    estado: 'disponible'
  },
  {
    id: 'w004',
    titulo: 'Tefilines de Bet Yosef — Nuevos',
    tipo: 'venta',
    precio: 350,
    categoria: 'Judaica',
    descripcion: 'Tefilines nuevos, parashiot de sofer certificado. Tipo Beit Yosef. Incluye bolsa y espejo para revisión.',
    vendedor: 'Jaim Benveniste',
    fecha: '2024-03-21',
    ubicacion: 'Madrid',
    emoji: '🖤',
    estado: 'disponible'
  },
  {
    id: 'w005',
    titulo: 'Servicio de Catering Kosher para eventos',
    tipo: 'servicio',
    precio: 0,
    categoria: 'Gastronomía',
    descripcion: 'Servicio de catering kosher certificado para Bar/Bat Mitzvot, bodas y eventos. Cocina sefaradí y asquenazí. Consultar precio según evento.',
    vendedor: 'Beit Catering S.L.',
    fecha: '2024-03-20',
    ubicacion: 'Madrid y alrededores',
    emoji: '🍽️',
    estado: 'disponible'
  },
  {
    id: 'w006',
    titulo: 'Libros de texto Talmud Torá — Lote',
    tipo: 'venta',
    precio: 40,
    categoria: 'Educación',
    descripcion: 'Lote de 8 libros del programa del Talmud Torá años 4-6. Buen estado. También hay material de manualidades.',
    vendedor: 'Rivka Cohen',
    fecha: '2024-03-18',
    ubicacion: 'Madrid',
    emoji: '📖',
    estado: 'disponible'
  },
  {
    id: 'w007',
    titulo: 'Chalá artesanal para Shabat — Pedidos',
    tipo: 'servicio',
    precio: 8,
    categoria: 'Gastronomía',
    descripcion: 'Chalá trenzada artesanal para Shabat. Tamaño grande (700g). Pedidos antes del miércoles para entrega viernes. Precio por unidad.',
    vendedor: 'Sara Mizrahi',
    fecha: '2024-03-17',
    ubicacion: 'Madrid - Chamberí',
    emoji: '🍞',
    estado: 'disponible'
  },
  {
    id: 'w008',
    titulo: 'Majzor de Rosh Hashaná y Yom Kipur',
    tipo: 'venta',
    precio: 45,
    categoria: 'Libros',
    descripcion: 'Majzor completo edición Artscroll bilingüe hebreo-español. Nusaj sefaradí. Apenas usado. Excelente estado.',
    vendedor: 'Moshe Goldstein',
    fecha: '2024-03-15',
    ubicacion: 'Madrid',
    emoji: '📕',
    estado: 'disponible'
  },
  {
    id: 'w009',
    titulo: 'Contable especialista en comunidades judías',
    tipo: 'servicio',
    precio: 90,
    categoria: 'Profesionales',
    descripcion: 'Contabilidad, declaración de donativos fiscalmente deducibles, gestión de asociaciones religiosas. Precio por hora.',
    vendedor: 'David Benasayag',
    fecha: '2024-03-14',
    ubicacion: 'Madrid / Telemático',
    emoji: '💼',
    estado: 'disponible'
  },
  {
    id: 'w010',
    titulo: 'Apartamento en Jerusalem — Agosto 5784',
    tipo: 'alquiler',
    precio: 120,
    categoria: 'Inmuebles',
    descripcion: 'Piso en Rehavia, Jerusalem. 2 habitaciones, completamente equipado y kosher. Disponible todo agosto. Precio por noche (mínimo 7 noches).',
    vendedor: 'Familia Tenenbaum',
    fecha: '2024-03-12',
    ubicacion: 'Jerusalem, Israel',
    emoji: '🇮🇱',
    estado: 'disponible'
  }
];

/* ─── PRODUCTOS KOSHER ─── */
const MOCK_KOSHER_PRODUCTOS = [
  {
    id: 'k001',
    nombre: 'Vino tinto Carmel Selected — Cabernet Sauvignon',
    marca: 'Carmel Winery',
    categoria: 'Vinos y bebidas',
    certificacion: 'OU · Mevushal',
    origen: 'Israel',
    precio: 12.90,
    disponible: true,
    emoji: '🍷'
  },
  {
    id: 'k002',
    nombre: 'Galletitas Osem — Petite Beurre',
    marca: 'Osem',
    categoria: 'Snacks y galletas',
    certificacion: 'OU · Parve',
    origen: 'Israel',
    precio: 2.80,
    disponible: true,
    emoji: '🍪'
  },
  {
    id: 'k003',
    nombre: 'Hummus clásico Sabra',
    marca: 'Sabra',
    categoria: 'Frescos y refrigerados',
    certificacion: 'OU · Parve',
    origen: 'EEUU (importado)',
    precio: 4.50,
    disponible: true,
    emoji: '🫘'
  },
  {
    id: 'k004',
    nombre: 'Chocolate Elite — Milk',
    marca: 'Elite',
    categoria: 'Dulces y chocolates',
    certificacion: 'OU · Chalav Israel',
    origen: 'Israel',
    precio: 3.20,
    disponible: true,
    emoji: '🍫'
  },
  {
    id: 'k005',
    nombre: 'Ternera picada — Certificado MK Madrid',
    marca: 'Carnicería Ben David',
    categoria: 'Carne y aves',
    certificacion: 'MK Madrid · Glatt Bet Yosef',
    origen: 'España',
    precio: 14.80,
    disponible: true,
    emoji: '🥩'
  },
  {
    id: 'k006',
    nombre: 'Pollo entero Glatt — Bandeja 1.8kg',
    marca: 'Carnicería Ben David',
    categoria: 'Carne y aves',
    certificacion: 'MK Madrid · Glatt',
    origen: 'España',
    precio: 18.50,
    disponible: false,
    emoji: '🍗'
  },
  {
    id: 'k007',
    nombre: 'Fideos Kosher para Pesaj',
    marca: 'Telma',
    categoria: 'Pesaj',
    certificacion: 'OU · Kosher LePesaj',
    origen: 'Israel',
    precio: 3.90,
    disponible: true,
    emoji: '🍝'
  },
  {
    id: 'k008',
    nombre: 'Matzot Shmurot — Caja 5 unidades',
    marca: 'Yehuda Matzos',
    categoria: 'Pesaj',
    certificacion: 'Badatz Eidah HaChareidis · Shmura',
    origen: 'Israel',
    precio: 24.00,
    disponible: true,
    emoji: '🫓'
  },
  {
    id: 'k009',
    nombre: 'Queso Gouda Israel — 300g',
    marca: 'Tnuva',
    categoria: 'Lácteos',
    certificacion: 'Rabbanut · Chalav Israel',
    origen: 'Israel',
    precio: 7.20,
    disponible: true,
    emoji: '🧀'
  },
  {
    id: 'k010',
    nombre: 'Salmón ahumado — 200g',
    marca: 'King Oscar',
    categoria: 'Pescados',
    certificacion: 'OU · Parve',
    origen: 'Noruega',
    precio: 9.90,
    disponible: true,
    emoji: '🐟'
  },
  {
    id: 'k011',
    nombre: 'Tahini natural — Bote 500ml',
    marca: 'Al Kanater',
    categoria: 'Despensa',
    certificacion: 'OU · Parve',
    origen: 'Israel',
    precio: 6.40,
    disponible: true,
    emoji: '🫙'
  },
  {
    id: 'k012',
    nombre: 'Miel de flores — 500g',
    marca: 'Dvash Israel',
    categoria: 'Despensa',
    certificacion: 'OU · Parve',
    origen: 'Israel',
    precio: 11.50,
    disponible: true,
    emoji: '🍯'
  }
];

/* ─── RESTAURANTES KOSHER ─── */
const MOCK_RESTAURANTES = [
  {
    id: 'r1',
    nombre: 'Xerta Restaurant — Estrella Michelin Kosher',
    descripcion: 'Primera estrella Michelin kosher del mundo. Menú degustación de cocina catalana de autor. Kosher disponible cada miércoles bajo supervisión directa del Rav Dovid Libersohn.',
    direccion: 'Carrer del Còrsega, 289 (Hotel Ohla Eixample)',
    ciudad: 'Barcelona',
    hashgaja: 'Rav Dovid Libersohn — Jabad Barcelona',
    isBeitYosef: true,
    isHalavIsrael: false,
    horario: 'Miércoles — menú kosher (reserva imprescindible)',
    tipoCocina: 'Alta cocina catalana · Menú degustación',
    precioRango: 'HIGH',
    tieneDelivery: false,
    esEspecial: true,
    nota: 'Primera estrella Michelin kosher del mundo'
  },
  {
    id: 'r2',
    nombre: 'Supermercado Ben Ben Kosher',
    descripcion: 'El supermercado kosher más completo de Barcelona. Productos europeos importados, carnes frescas bajo supervisión y el único bar lemehadrin de la ciudad.',
    direccion: 'Carrer d\'Aribau, 257, 08021 Barcelona',
    telefono: '+34 932 003 375',
    ciudad: 'Barcelona',
    hashgaja: 'Jabad Barcelona',
    isBeitYosef: true,
    isHalavIsrael: true,
    isPasYisrael: true,
    horario: 'Lun-Jue 9:00-20:00 · Vie y Dom 9:00-14:00',
    tipoCocina: 'Supermercado · Carnicería · Bar lemehadrin',
    precioRango: 'BUDGET',
    tieneDelivery: false
  },
  {
    id: 'r3',
    nombre: 'KOSHER BABAIT',
    descripcion: 'Tienda especializada en productos kosher en el barrio de Sant Gervasi. Amplia variedad de productos europeos y locales certificados.',
    direccion: 'Carrer d\'Avenir, 22, 08021 Barcelona',
    ciudad: 'Barcelona',
    hashgaja: 'Jabad Barcelona',
    isBeitYosef: false,
    isHalavIsrael: false,
    horario: 'Consultar directamente',
    tipoCocina: 'Tienda especializada kosher',
    precioRango: 'BUDGET',
    tieneDelivery: false
  },
  {
    id: 'r4',
    nombre: 'Call Barcelona — Tienda y Centro Turístico',
    descripcion: 'Tienda de vinos kosher españoles y productos básicos en el corazón del Barrio Gótico. Centro de acogida para turistas judíos con wifi, café y tour 3D del Call judío medieval.',
    direccion: 'Carrer de Sant Honorat, 9, 08002 Barcelona',
    telefono: '+34 933 182 897',
    ciudad: 'Barcelona',
    hashgaja: 'Jabad Barcelona',
    isBeitYosef: false,
    isHalavIsrael: false,
    horario: 'Lun-Jue 10:00-20:00 · Vie y Dom 10:00-14:00',
    tipoCocina: 'Tienda · Vinos kosher · Artículos judaísmo',
    precioRango: 'BUDGET',
    tieneDelivery: false
  }
];

/* ─── DONATIVOS / CAMPAÑAS ─── */
const DONATIVO_BANCO = {
  banco: 'Bankinter',
  titular: 'JABAD LUBAVITCH FUNDACION PRIVADA',
  iban: 'ES63 0128 0500 1005 0000 8512',
  swift: 'BKBKESMM'
};

const MOCK_DONATIVOS = [
  {
    id: 'd1',
    titulo: 'Chay Club — Banco de Alimentos',
    descripcion: 'Garantizamos que toda persona judía en necesidad pueda acceder a una comida digna, celebrar su Bar/Bat Mitzvá y tener una Mezuzá en su hogar. JAI = VIDA.',
    meta: 5000,
    actual: 3240,
    donantes: 47,
    diasRestantes: 30,
    colorPortada: '#1B2E5E'
  },
  {
    id: 'd2',
    titulo: 'Cena de Shabat semanal — 300 personas cada viernes',
    descripcion: 'Cada viernes organizamos una gran cena de Shabat para cientos de personas de todo el mundo. Tu donativo garantiza que la mesa siga abierta para todos, sin excepción.',
    meta: 8000,
    actual: 5200,
    donantes: 92,
    diasRestantes: 14,
    colorPortada: '#C9A84C'
  },
  {
    id: 'd3',
    titulo: 'Expansión del Bet Jabad Barcelona',
    descripcion: 'Estamos ampliando las instalaciones del Bet Jabad para dar cabida a más actividades, más familias y más programas. Más de 600 donantes ya han contribuido. Sé parte de la historia.',
    meta: 25000,
    actual: 14800,
    donantes: 134,
    diasRestantes: 90,
    colorPortada: '#243A72'
  }
];

/* ─── PREGUNTAS AL RAV ─── */
const MOCK_PREGUNTAS = [
  {
    id: 'p001',
    pregunta: '¿Puedo usar jabón de manos durante Pesaj si contiene avena?',
    categoria: 'Pesaj',
    autor: 'Moshe Goldstein',
    fecha: '2024-03-28',
    estado: 'respondida',
    respuesta: 'Los jabones y productos de higiene que contienen granos en cantidades mínimas y que no son aptos para consumo humano generalmente no son problemáticos durante Pesaj. Sin embargo, es preferible utilizar productos específicamente aprobados para Pesaj cuando sea posible. Consultad la lista actualizada de productos aprobados que publicaremos antes de Erev Pesaj.',
    respondidoPor: 'HaRav Dovid Libersohn',
    fechaRespuesta: '2024-03-29'
  },
  {
    id: 'p002',
    pregunta: '¿Qué berajá se dice sobre las semillas de girasol tostadas?',
    categoria: 'Berajot',
    autor: 'Rivka Cohen',
    fecha: '2024-03-25',
    estado: 'respondida',
    respuesta: 'Las semillas de girasol tostadas son "pri haadama" (fruto de la tierra). Por tanto la berajá apropiada es "Boré pri haadama". Si están saladas o condimentadas no cambia la berajá.',
    respondidoPor: 'HaRav Dovid Libersohn',
    fechaRespuesta: '2024-03-26'
  },
  {
    id: 'p003',
    pregunta: '¿Puedo recitar Havdalá temprano en Motzei Shabat si tengo una cena familiar?',
    categoria: 'Shabat',
    autor: 'Sara Mizrahi',
    fecha: '2024-03-30',
    estado: 'pendiente',
    respuesta: null,
    respondidoPor: null,
    fechaRespuesta: null
  }
];

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
const MOCK_SHIURIM_V2 = [
  { id:'sv01', titulo:'La importancia del Shabat en la vida moderna', maestro:'HaRav Dovid Libersohn', categoria:'Parashá', formato:'Audio', duracion:'45 min', nivel:1, fecha:'2024-03-20', descripcion:'Una reflexión profunda sobre cómo el Shabat transforma nuestra relación con el tiempo, la familia y el trabajo. El Rav Cohen explora los fundamentos espirituales del descanso semanal y su relevancia en el mundo moderno.' },
  { id:'sv02', titulo:'Leyes de Kashrut: guía práctica completa', maestro:'HaRav David Levi', categoria:'Halaká', formato:'Video', duracion:'62 min', nivel:2, fecha:'2024-03-18', descripcion:'Recorrido exhaustivo por las leyes de kashrut aplicadas a la vida cotidiana en España. Productos procesados, etiquetas, supervivencia en supermercados convencionales y cómo mantener una cocina kosher.' },
  { id:'sv03', titulo:'Majshavot sobre la creación del mundo', maestro:'HaRav Dovid Libersohn', categoria:'Majshavá', formato:'Audio', duracion:'38 min', nivel:3, fecha:'2024-03-15', descripcion:'Análisis filosófico del relato de la creación en Bereshit. El Rav Cohen explora las diferentes interpretaciones de los Rishonim y Ajaronim sobre el "Bereshit Bara" y su significado profundo.' },
  { id:'sv04', titulo:'Historia del pueblo judío en España', maestro:'Prof. Sara Mizrahi', categoria:'Historia', formato:'Texto', duracion:'25 min', nivel:1, fecha:'2024-03-12', descripcion:'Desde la llegada de los primeros judíos a la Península Ibérica hasta la expulsión de 1492 y el regreso en el siglo XX. Una historia de esplendor, convivencia, persecución y resiliencia que define la identidad sefaradí.' },
  { id:'sv05', titulo:'Preparación espiritual para Rosh Hashaná', maestro:'HaRav David Levi', categoria:'Yamim Noraim', formato:'Video', duracion:'55 min', nivel:2, fecha:'2024-03-10', descripcion:'Los 40 días que van desde Rosh Jodesh Elul hasta Yom Kipur son una oportunidad única de transformación. El Rav Levi guía un proceso de jeshbon hanefesh — examen de conciencia — con herramientas prácticas de mussar.' },
  { id:'sv06', titulo:'Musar: el trabajo sobre el carácter', maestro:'HaRav Dovid Libersohn', categoria:'Musar', formato:'Audio', duracion:'40 min', nivel:3, fecha:'2024-03-08', descripcion:'El movimiento del Musar, fundado por el Rav Yisrael Salanter, propone un método sistemático de trabajo espiritual sobre los middot (virtudes del carácter). Esta clase introduce los conceptos fundamentales y técnicas prácticas.' },
  { id:'sv07', titulo:'Parashá Bereshit: el inicio de todo', maestro:'HaRav Aaron Peretz', categoria:'Parashá', formato:'Video', duracion:'30 min', nivel:1, fecha:'2024-03-05', descripcion:'La primera parashá de la Torá contiene en sus primeros versículos todo el plan divino para la humanidad. El Rav Peretz analiza el comentario de Rashi sobre el primer versículo y sus implicaciones para la identidad judía.' },
  { id:'sv08', titulo:'Tefila: entendiendo lo que rezamos', maestro:'HaRav David Levi', categoria:'Halaká', formato:'Audio', duracion:'50 min', nivel:2, fecha:'2024-03-01', descripcion:'Muchos rezamos en hebreo sin comprender completamente lo que decimos. Esta clase analiza las principales oraciones del Shajarit — Pesukei deZimra, Shacharit Amidah — y desvela el profundo significado de cada bendición.' },
  { id:'sv09', titulo:'Las 613 mitzvot: visión general', maestro:'Prof. Sara Mizrahi', categoria:'Halaká', formato:'Texto', duracion:'45 min', nivel:3, fecha:'2024-02-25', descripcion:'Un recorrido por las 613 mitzvot según la clasificación del Rambam en el Sefer HaMitzvot. La profesora Mizrahi ofrece una perspectiva académica sobre la estructura del sistema normativo judío y su evolución histórica.' },
  { id:'sv10', titulo:'Kipur: el día más sagrado del año', maestro:'HaRav Dovid Libersohn', categoria:'Yamim Noraim', formato:'Audio', duracion:'70 min', nivel:1, fecha:'2024-02-20', descripcion:'Yom Kipur no es solo un día de ayuno — es la culminación del proceso de teshuvá, el momento más elevado del calendario judío. El Rav Cohen explica el significado del Kol Nidré, el Neila y cómo prepararse para salir del día transformados.' }
];

const DEVAR_TORAH = [
  { id:'dt01', texto:'El Shabat no es solo descanso del cuerpo — es el alma del tiempo. Cada semana, Dios nos regala 25 horas para recordar quiénes somos.', firma:'HaRav Dovid Libersohn', parasha:'Parashat Vayikrá', fecha:'2024-03-28' },
  { id:'dt02', texto:'La teshuvá no comienza con el arrepentimiento — comienza con la honestidad. Antes de pedir perdón, hay que ver con claridad.', firma:'HaRav David Levi', parasha:'Parashat Tzav', fecha:'2024-03-21' },
  { id:'dt03', texto:'Kashrut no es solo lo que entra por la boca — es una disciplina de conciencia. Cuando decidimos qué comer, practicamos la voluntad libre.', firma:'HaRav Aaron Peretz', parasha:'Parashat Shemini', fecha:'2024-03-14' },
  { id:'dt04', texto:'La historia de España nos enseña que la identidad judía sobrevive a la expulsión, a la conversión forzada, al olvido. La Torá en el corazón no se puede quemar.', firma:'Prof. Sara Mizrahi', parasha:'Parashat Tazria', fecha:'2024-03-07' },
  { id:'dt05', texto:'Un hombre que trabaja sobre su carácter hace más por el mundo que mil que predican sin practicar. El Musar comienza en el espejo, no en el púlpito.', firma:'HaRav Dovid Libersohn', parasha:'Parashat Metzorá', fecha:'2024-02-29' }
];

/* ─── JEWISH BUSINESS ─── */
const MOCK_BUSINESSES = [
  { id:'biz01', nombre:'Kosher Gourmet Madrid', categoria:'Alimentación', propietario:'Rivka Cohen', descripcion:'Tienda especializada en productos kosher importados y locales. Carnicería propia, sección de vinos israelíes y productos de Pesaj todo el año.', descripcionCorta:'Productos kosher, carnicería y vinos israelíes.', horario:{lun:'9:00-20:00',mar:'9:00-20:00',mie:'9:00-20:00',jue:'9:00-20:00',vie:'9:00-14:00',sab:'Cerrado',dom:'10:00-15:00'}, ciudad:'Madrid', direccion:'C/ Velázquez 48', telefono:'+34 913 000 111', email:'info@koshergourmet.es', web:'koshergourmet.es', servicios:['Carnicería Glatt','Vinos importados','Productos Pesaj'], verificado:true, buscaSocios:true, queBusca:'Distribuidor para zona Barcelona y Marbella. Interesa acuerdo de exclusividad para productos israelíes.', añoFundacion:2018, color:'#1B5E20' },
  { id:'biz02', nombre:'Levi & Asociados Abogados', categoria:'Legal', propietario:'Moshe Levi', descripcion:'Despacho especializado en derecho de familia, herencias y derecho internacional. Amplia experiencia en reconocimiento de nacionalidad española para descendientes de judíos sefaradíes (Ley 12/2015).', descripcionCorta:'Derecho familiar, herencias y nacionalidad sefaradí.', horario:{lun:'9:00-18:00',mar:'9:00-18:00',mie:'9:00-18:00',jue:'9:00-18:00',vie:'9:00-15:00',sab:'Cerrado',dom:'Cerrado'}, ciudad:'Barcelona', direccion:'Passeig de Gràcia 44', telefono:'+34 932 111 222', email:'contacto@leviasociados.es', web:'leviasociados.es', servicios:['Derecho de familia','Herencias','Ley Sefaradí'], verificado:true, buscaSocios:false, queBusca:'', añoFundacion:2010, color:'#1A237E' },
  { id:'biz03', nombre:'Tech4Community', categoria:'Tecnología', propietario:'Daniel Benasayag', descripcion:'Startup de software especializada en soluciones digitales para comunidades religiosas y ONGs. Desarrollamos apps, webs y sistemas de gestión a medida. Actualmente buscamos co-fundador técnico.', descripcionCorta:'Software para comunidades religiosas y ONGs.', horario:{lun:'9:00-18:00',mar:'9:00-18:00',mie:'9:00-18:00',jue:'9:00-18:00',vie:'9:00-14:00',sab:'Cerrado',dom:'Cerrado'}, ciudad:'Madrid', direccion:'C/ Fuencarral 123 (Coworking)', telefono:'+34 611 500 500', email:'hello@tech4community.es', web:'tech4community.es', servicios:['Apps móviles','Webs a medida','Gestión comunidades'], verificado:true, buscaSocios:true, queBusca:'Co-fundador técnico (CTO) con experiencia en React Native o Flutter. Ofrecemos equity. Proyecto en fase seed.', añoFundacion:2023, color:'#4A148C' },
  { id:'biz04', nombre:'Clínica Dental Dr. Mizrahi', categoria:'Médico', propietario:'Dr. Avi Mizrahi', descripcion:'Clínica dental de referencia en la Costa del Sol. Atención en español, hebreo e inglés. Especialidades en implantología, ortodoncia y estética dental. Descuentos para miembros de la comunidad.', descripcionCorta:'Clínica dental. Atención en hebreo e inglés.', horario:{lun:'9:00-20:00',mar:'9:00-20:00',mie:'9:00-20:00',jue:'9:00-20:00',vie:'9:00-14:00',sab:'Cerrado',dom:'Cerrado'}, ciudad:'Marbella', direccion:'Av. Ricardo Soriano 19', telefono:'+34 952 800 900', email:'citas@clinicamizrahi.es', web:'clinicamizrahi.es', servicios:['Implantología','Ortodoncia','Estética dental'], verificado:true, buscaSocios:false, queBusca:'', añoFundacion:2015, color:'#006064' },
  { id:'biz05', nombre:'Cohen Inmobiliaria', categoria:'Inmobiliaria', propietario:'Jaim Cohen', descripcion:'Especialistas en compraventa y alquiler de propiedades en las zonas de la comunidad judía madrileña. Conocemos el mercado, los colegios, las sinagogas y las carnicerías de cada barrio. Sin comisión para socios de Jabad Barcelona.', descripcionCorta:'Inmuebles en zonas comunidad. Sin comisión para socios.', horario:{lun:'9:30-19:00',mar:'9:30-19:00',mie:'9:30-19:00',jue:'9:30-19:00',vie:'9:30-14:00',sab:'Cerrado',dom:'Cerrado'}, ciudad:'Madrid', direccion:'C/ Lista 77', telefono:'+34 916 000 111', email:'info@coheninmobiliaria.es', web:'coheninmobiliaria.es', servicios:['Compraventa','Alquiler','Inversión'], verificado:true, buscaSocios:true, queBusca:'Agentes inmobiliarios asociados en Madrid y Barcelona. Comisión competitiva y cartera de clientes de la comunidad.', añoFundacion:2012, color:'#E65100' },
  { id:'biz06', nombre:'Shalom Eventos & Catering', categoria:'Hostelería', propietario:'Miriam Toledano', descripcion:'Organización integral de eventos kosher certificados: Bar y Bat Mitzvot, bodas, cenas comunitarias y eventos corporativos. Cocina sefaradí, asquenazí y mediterránea. Supervisión MK Madrid.', descripcionCorta:'Catering kosher certificado para smajot y eventos.', horario:{lun:'9:00-18:00',mar:'9:00-18:00',mie:'9:00-18:00',jue:'9:00-18:00',vie:'9:00-13:00',sab:'Cerrado',dom:'Cerrado'}, ciudad:'Barcelona', direccion:'C/ Consell de Cent 280', telefono:'+34 933 200 300', email:'eventos@shalomcatering.es', web:'shalomcatering.es', servicios:['Bar/Bat Mitzvá','Bodas','Eventos corporativos'], verificado:true, buscaSocios:false, queBusca:'', añoFundacion:2016, color:'#880E4F' },
  { id:'biz07', nombre:'Academia Hebreo Online', categoria:'Educación', propietario:'Rivka Cohen', descripcion:'Plataforma de aprendizaje de hebreo bíblico y moderno para todos los niveles. Clases en vivo y grabadas, material didáctico propio y preparación para Bar/Bat Mitzvá. Más de 200 alumnos activos.', descripcionCorta:'Hebreo online para todos los niveles. +200 alumnos.', horario:{lun:'Flexible',mar:'Flexible',mie:'Flexible',jue:'Flexible',vie:'Hasta 14:00',sab:'Cerrado',dom:'Flexible'}, ciudad:'Online', direccion:'100% online', telefono:'+34 645 123 789', email:'info@academiahebro.es', web:'academiahebro.es', servicios:['Hebreo bíblico','Hebreo moderno','Bar/Bat Mitzvá'], verificado:true, buscaSocios:true, queBusca:'Profesores nativos de hebreo para ampliar el equipo docente. Interesa perfil con experiencia en enseñanza online. Trabajo flexible.', añoFundacion:2020, color:'#1565C0' },
  { id:'biz08', nombre:'Peretz Inversiones', categoria:'Finanzas', propietario:'David Peretz', descripcion:'Asesoría financiera independiente especializada en planificación patrimonial, inversión ética (ESG con criterios judíos) y proyectos de impacto en la comunidad. Gestión de donaciones fiscalmente optimizadas.', descripcionCorta:'Inversión ética y planificación patrimonial.', horario:{lun:'9:00-18:00',mar:'9:00-18:00',mie:'9:00-18:00',jue:'9:00-18:00',vie:'9:00-14:00',sab:'Cerrado',dom:'Cerrado'}, ciudad:'Madrid', direccion:'Paseo de la Castellana 77', telefono:'+34 914 500 600', email:'david@peretzinversiones.es', web:'peretzinversiones.es', servicios:['Planificación patrimonial','Inversión ESG','Donaciones deducibles'], verificado:true, buscaSocios:true, queBusca:'Proyectos de impacto en la comunidad judía española. Interesa conocer startups, negocios familiares o iniciativas sociales que busquen financiación o asesoría.', añoFundacion:2014, color:'#37474F' }
];

const MOCK_COWORK = [
  { id:'cw01', nombre:'Daniel B.', profesion:'CTO / Desarrollador Full Stack', tipo:'Busco co-fundador', descripcion:'Llevo 8 años construyendo productos digitales. Tengo una idea validada para una plataforma SaaS de gestión para comunidades judías en Europa. Busco co-fundador con perfil de negocio/ventas.', sector:'Tecnología', experiencia:8, color:3 },
  { id:'cw02', nombre:'Sara M.', profesion:'Profesora universitaria', tipo:'Ofrezco mentoría', descripcion:'Doctora en Historia Medieval. Puedo mentorizar proyectos de investigación, divulgación cultural o editoriales relacionados con el patrimonio judío español y sefaradí. Disponible para proyectos serios.', sector:'Educación', experiencia:15, color:1 },
  { id:'cw03', nombre:'Moshe L.', profesion:'Abogado especialista', tipo:'Busco inversor', descripcion:'Hemos desarrollado una plataforma legal de reconocimiento de nacionalidad sefaradí con 300 casos gestionados. Buscamos inversión para escalar a toda Europa. Runway actual: 8 meses.', sector:'Legal / Tech', experiencia:12, color:0 },
  { id:'cw04', nombre:'Rivka C.', profesion:'Educadora y emprendedora', tipo:'Busco empleado', descripcion:'Mi academia de hebreo online crece rápido y necesito incorporar 2 profesores nativos con experiencia en enseñanza online. Buen ambiente, horario flexible y proyecto con propósito.', sector:'Educación', experiencia:10, color:2 },
  { id:'cw05', nombre:'Jaim B.', profesion:'Constructor y promotor inmobiliario', tipo:'Busco socio', descripcion:'Proyecto de construcción de un edificio residencial con servicios comunitarios (sinagoga, catering kosher, local social) en Madrid. Busco socio capitalista para adquirir el solar.', sector:'Inmobiliaria', experiencia:20, color:5 },
  { id:'cw06', nombre:'Miriam T.', profesion:'Chef y empresaria gastronómica', tipo:'Busco inversor', descripcion:'Shalom Catering factura 400k€ anuales y quiere abrir un restaurante kosher permanente en Madrid. Busco inversor para local y reforma. Proyección de rentabilidad en 18 meses.', sector:'Hostelería', experiencia:8, color:4 }
];

/* ─── SERVICIOS COMUNITARIOS ─── */
const MOCK_TENYAD = [
  { id:'ty01', nombre:'Set de sillas plegables (x20)', categoria:'Sillas/Mesas', descripcion:'20 sillas plegables blancas en buen estado. Perfectas para eventos y reuniones.', condicion:'Bueno', propietario:'Jabad Barcelona', anonimo:false, disponible:true, hasta:null, icono:'🪑' },
  { id:'ty02', nombre:'Cuna de viaje plegable', categoria:'Ropa bebé', descripcion:'Cuna plegable BabyBjörn. Incluye colchón y saco de dormir. Desinfectada.', condicion:'Excelente', propietario:'Familia Cohen', anonimo:false, disponible:true, hasta:null, icono:'🛏️' },
  { id:'ty03', nombre:'Vajilla completa para 50 personas', categoria:'Menaje', descripcion:'Vajilla blanca de porcelana (platos, vasos, cubiertos). Apta para eventos kosher. Separada fleishig/milchig.', condicion:'Bueno', propietario:'Anónimo', anonimo:true, disponible:false, hasta:'2024-04-10', icono:'🍽️' },
  { id:'ty04', nombre:'Proyector EPSON + pantalla', categoria:'Electrónica', descripcion:'Proyector Full HD con pantalla de proyección 2m. Cable HDMI incluido. Ideal para presentaciones y películas.', condicion:'Excelente', propietario:'Moshe Goldstein', anonimo:false, disponible:true, hasta:null, icono:'📽️' },
  { id:'ty05', nombre:'Lote libros Talmud Torá (ages 8-12)', categoria:'Libros', descripcion:'15 libros del programa curricular del Talmud Torá para edades 8-12. Buen estado.', condicion:'Aceptable', propietario:'Familia Toledano', anonimo:false, disponible:true, hasta:null, icono:'📚' },
  { id:'ty06', nombre:'Menorá para Janucá (grande)', categoria:'Decoración Fiestas', descripcion:'Janukiá grande de metal dorado, 50cm. Perfecta para eventos comunitarios. Incluye portavelas.', condicion:'Excelente', propietario:'Jabad Barcelona', anonimo:false, disponible:true, hasta:null, icono:'🕎' },
  { id:'ty07', nombre:'Taladro + juego de herramientas', categoria:'Herramientas', descripcion:'Taladro Bosch con juego completo de brocas y destornilladores. Maletín original.', condicion:'Bueno', propietario:'Jaim Benveniste', anonimo:false, disponible:true, hasta:null, icono:'🔧' },
  { id:'ty08', nombre:'Mesas plegables grandes (x4)', categoria:'Sillas/Mesas', descripcion:'4 mesas plegables rectangulares 180x75cm. Ideales para cenas comunitarias.', condicion:'Bueno', propietario:'Anónimo', anonimo:true, disponible:true, hasta:null, icono:'🪑' }
];

const MOCK_TALMUD_TORAH = [
  { id:'tt01', grupo:'Clase Alef', edades:'5-7 años', maestro:'Rivka Cohen', horario:'Domingos 10:00-12:00 · Miércoles 17:00-18:30', aula:'Aula 1 — Planta baja', plazas:15, inscritos:12, color:'#E8F5E9' },
  { id:'tt02', grupo:'Clase Bet', edades:'8-10 años', maestro:'Jaim Benveniste', horario:'Domingos 10:00-12:30 · Jueves 17:00-19:00', aula:'Aula 2 — Planta baja', plazas:15, inscritos:15, color:'#E3F2FD' },
  { id:'tt03', grupo:'Clase Guimel', edades:'11-13 años', maestro:'HaRav Dovid Libersohn', horario:'Domingos 11:00-13:30 · Martes 17:30-19:30', aula:'Sala de estudio', plazas:12, inscritos:9, color:'#FFF8E1' },
  { id:'tt04', grupo:'Bnei Mitzvá', edades:'12-13 años', maestro:'HaRav Dovid Libersohn', horario:'Lunes y Jueves 17:00-19:00 · Domingo 12:00-13:30', aula:'Despacho del Rav', plazas:6, inscritos:4, color:'#FCE4EC' }
];

const MOCK_TT_MENSAJES = [
  { clase:'Clase Alef', maestro:'Rivka Cohen', mensaje:'Este domingo practicamos el Alef-Bet con canciones. Los niños van muy bien. Recordad traer la cartilla de ejercicios.', fecha:'2024-03-27' },
  { clase:'Clase Bet', maestro:'Jaim Benveniste', mensaje:'Hemos terminado el tema de Pesaj. El próximo miércoles hacemos el Séder de práctica — traed delantal y ganas de participar.', fecha:'2024-03-25' },
  { clase:'Clase Guimel', maestro:'HaRav Dovid Libersohn', mensaje:'Excelente trabajo con el estudio de Pirkei Avot. La semana que viene empezamos Mishná Berajot. Os dejo material de preparación en el grupo.', fecha:'2024-03-22' },
  { clase:'Bnei Mitzvá', maestro:'HaRav Dovid Libersohn', mensaje:'Yosef ya domina su parashá. Moshe y Avi, necesitamos reforzar las notas altas del tropo. Quedamos el martes extra a las 16:30.', fecha:'2024-03-20' },
  { clase:'General', maestro:'Secretaría', mensaje:'Recordatorio: el 14 de abril es el acto de fin de curso del Talmud Torá. Todos los padres están invitados. Confirmad asistencia antes del 10 de abril.', fecha:'2024-03-18' }
];

const MOCK_BIKUR_JOLIM = [
  { id:'bj01', zona:'Norte de Madrid (Tetuán)', tipo:'Recuperación post-operatoria', necesidad:'Visitas de compañía 1-2 horas, preferiblemente mañanas entre semana. Persona mayor, muy agradecida.', disponibilidad:'Lunes a Viernes 10:00-13:00', activo:true },
  { id:'bj02', zona:'Salamanca / Retiro', tipo:'Enfermedad crónica', necesidad:'Ayuda con la compra semanal y compañía para paseos cortos. Persona de mediana edad con movilidad reducida temporal.', disponibilidad:'Flexible, avisar 24h antes', activo:true },
  { id:'bj03', zona:'Barcelona — Eixample', tipo:'Anciano solo', necesidad:'Visita semanal de compañía a persona mayor de 85 años. Le gusta hablar de historia y escuchar música. Muy agradecida.', disponibilidad:'Fines de semana preferiblemente', activo:true }
];

const MOCK_GEMILUT = [
  { id:'gj01', nombre:'Sara', profesion:'Conductora', favor:'Transporte', descripcion:'Puedo llevar a personas mayores o con movilidad reducida al médico, sinagoga o compras. Tengo coche grande.', disponibilidad:'Tardes entre semana', zona:'Madrid Centro', color:1 },
  { id:'gj02', nombre:'Moshe', profesion:'Chef amateur', favor:'Cocinar para familia', descripcion:'Me ofrezco a cocinar para familias que acaban de tener un bebé, están de duelo (shiva) o en situación de necesidad temporal.', disponibilidad:'Fines de semana', zona:'Madrid Norte', color:0 },
  { id:'gj03', nombre:'Rivka', profesion:'Profesora', favor:'Clases de apoyo', descripcion:'Doy clases de apoyo de matemáticas, lengua y hebreo para niños de primaria y ESO de familias de la comunidad. Gratis.', disponibilidad:'Tardes y fines de semana', zona:'Madrid / Online', color:2 },
  { id:'gj04', nombre:'Jaim', profesion:'Transportista', favor:'Ayuda mudanza', descripcion:'Tengo furgoneta grande. Me ofrezco para ayudar con mudanzas dentro de Madrid. Solo necesito un par de brazos adicionales.', disponibilidad:'Sábados noche / Domingos', zona:'Madrid y alrededores', color:5 },
  { id:'gj05', nombre:'Miriam', profesion:'Psicóloga', favor:'Acompañamiento emocional', descripcion:'Ofrezco escucha activa y acompañamiento emocional informal (no terapia) para personas que atraviesan momentos difíciles.', disponibilidad:'Con cita previa', zona:'Online / Presencial Madrid', color:4 },
  { id:'gj06', nombre:'Daniel', profesion:'Médico', favor:'Compañía médico', descripcion:'Puedo acompañar a personas mayores a consultas médicas para ayudar con la comunicación y comprensión del diagnóstico.', disponibilidad:'Mañanas libres (variables)', zona:'Madrid', color:3 }
];

// ─── DATOS TIENDA ────────────────────────────────────────────────

const MOCK_LIBROS = [
  { id:'l1', titulo:'Shulján Aruj completo', autor:'Rav Yosef Karo', editorial:'Machon Yerushalayim', categoria:'Halajá', idioma:'HE/ES', precio:45.00, badge:'', portadaColor:'#1B2E5E' },
  { id:'l2', titulo:'Historia de los judíos en España', autor:'Haim Beinart', editorial:'Riopiedras', categoria:'Historia', idioma:'ES', precio:28.00, badge:'', portadaColor:'#2A4080' },
  { id:'l3', titulo:'Aprende Hebreo Bíblico', autor:'Thomas Lambdin', editorial:'Verbo Divino', categoria:'Hebreo', idioma:'ES', precio:22.00, badge:'mas-vendido', portadaColor:'#C9A84C' },
  { id:'l4', titulo:'El Tania', autor:'Rabi Schneur Zalman', editorial:'Kehot', categoria:'Majshavá', idioma:'ES', precio:18.00, badge:'', portadaColor:'#4A5568' },
  { id:'l5', titulo:'Cuentos del Baal Shem Tov', autor:'Sifrei Hasidim', editorial:'Kehot Ed.', categoria:'Infantil', idioma:'ES', precio:15.00, badge:'nuevo', portadaColor:'#1B2E5E' },
  { id:'l6', titulo:'Responsa contemporánea', autor:'Rav Ovadia Yosef', editorial:'Yavia Omer', categoria:'Halajá', idioma:'ES', precio:35.00, badge:'', portadaColor:'#2A4080' },
  { id:'l7', titulo:'La Hagadá ilustrada', autor:'Varios autores', editorial:'Koren', categoria:'Torah y Tanaj', idioma:'ES/HE', precio:32.00, badge:'mas-vendido', portadaColor:'#C9A84C' },
  { id:'l8', titulo:'Mishná Berurá resumida', autor:'Jafetz Jaim', editorial:'Feldheim ES', categoria:'Halajá', idioma:'ES', precio:29.00, badge:'nuevo', portadaColor:'#4A5568' }
];

const MOCK_JUDAICA = [
  { id:'j1', titulo:'Tefilim Beit Yosef', desc:'Pergamino kasher certificado', categoria:'Tefilim', precio:280.00, emoji:'📿', badge:'hecho-a-mano', bgColor:'#1B2E5E' },
  { id:'j2', titulo:'Mezuzá grabada plateada', desc:'Plata 925, grabado personalizable', categoria:'Mezuzot', precio:85.00, emoji:'📜', badge:'', bgColor:'#6B7280' },
  { id:'j3', titulo:'Jánukiá artesanal Jerusalem', desc:'Latón trabajado a mano, 30cm', categoria:'Jánukiot', precio:120.00, emoji:'🕎', badge:'hecho-a-mano', bgColor:'#C9A84C' },
  { id:'j4', titulo:'Kidush de plata', desc:'Plata bañada, capacidad 250ml', categoria:'Candelabros', precio:65.00, emoji:'🍷', badge:'', bgColor:'#2A4080' },
  { id:'j5', titulo:'Pulsera Chai dorada', desc:'Oro 18k, símbolo Chai', categoria:'Joyas', precio:95.00, emoji:'✡️', badge:'nuevo', bgColor:'#A8892E' },
  { id:'j6', titulo:'Tallit Beit Yosef', desc:'Lana merino, ataroth plateado', categoria:'Ropa festiva', precio:180.00, emoji:'🤍', badge:'hecho-a-mano', bgColor:'#1B2E5E' }
];

const MOCK_VINOS = [
  { id:'v1', nombre:'Yarden Cabernet Sauvignon', bodega:'Golan Heights Winery', pais:'Israel 🇮🇱', tipo:'Tinto', hashgaja:'OU Kosher', precio:28.50, mevushal:false },
  { id:'v2', nombre:'Bartenura Moscato', bodega:'Bartenura', pais:'Italia 🇮🇹', tipo:'Espumoso', hashgaja:'OU Kosher', precio:18.00, mevushal:true },
  { id:'v3', nombre:'Psagot Edom', bodega:'Psagot Winery', pais:'Israel 🇮🇱', tipo:'Tinto', hashgaja:'Badatz', precio:32.00, mevushal:false },
  { id:'v4', nombre:'Elvi Herenza Blanco', bodega:'Elvi Wines', pais:'España 🇪🇸', tipo:'Blanco', hashgaja:'OU Kosher', precio:22.00, mevushal:true },
  { id:'v5', nombre:'Ramon Cardova Rioja', bodega:'Ramon Cardova', pais:'España 🇪🇸', tipo:'Tinto', hashgaja:'OU Kosher', precio:19.50, mevushal:true },
  { id:'v6', nombre:'Pacifica Chardonnay', bodega:'Hagafen', pais:'USA 🇺🇸', tipo:'Blanco', hashgaja:'OU Kosher', precio:24.00, mevushal:false }
];

/* ─── NOTICIAS V2 ─── */
const MOCK_NOTICIAS_V2 = [
  {
    id: 'n1',
    isPinned: true,
    categoria: 'comunidad',
    titulo: 'Preparativos para Pesaj 5785 — Todo lo que necesitas saber',
    excerpt: 'La comunidad Jabad Barcelona ha organizado este año una guía completa para la preparación de Pesaj: bedikat jametz, venta del jametz, horarios del Séder comunitario y lista actualizada de productos kosher le-Pesaj disponibles en España.',
    contenido: `Con la llegada del mes de Nisán, la comunidad se prepara para la festividad de Pesaj 5785. Este año el primer Séder cae el lunes 14 de abril al anochecer.\n\nEl Rav ha publicado la guía halachica completa para la preparación del hogar, incluyendo los tiempos exactos para la búsqueda y quema del jametz en Madrid y Barcelona.\n\nLa lista de productos kosher le-Pesaj disponibles en supermercados españoles ha sido actualizada esta semana e incluye más de 40 productos certificados por el Consejo Rabínico de España.\n\nEl Séder comunitario se celebrará el lunes 14 de abril a las 21:00h en el salón principal. Las inscripciones están abiertas hasta el 10 de abril.`,
    autor: 'Secretaría Jabad Barcelona',
    fecha: '2025-03-28',
    tiempoLectura: '4 min',
    colorCategoria: '#1B2E5E'
  },
  {
    id: 'n2',
    isPinned: true,
    categoria: 'israel',
    titulo: 'Seguimiento de la situación en Israel — Comunicado de la comunidad',
    excerpt: 'Ante los recientes acontecimientos entre Israel e Irán, la junta directiva de Jabad Barcelona emite un comunicado oficial expresando su solidaridad con el pueblo de Israel y facilitando recursos de información fiable para los miembros de la comunidad.',
    contenido: `La junta directiva de la comunidad Jabad Barcelona quiere trasladar a todos sus miembros nuestra total solidaridad con el pueblo de Israel en estos momentos de tensión.\n\nSeguimos de cerca la situación y mantenemos contacto directo con las comunidades de Israel. Instamos a todos los miembros a informarse únicamente a través de fuentes fiables y a evitar la difusión de rumores.\n\nOrganizaremos un tehilim comunitario este Shabat después de la tefila de la mañana. La asistencia es abierta a todos los miembros y sus familias.\n\nPara aquellos miembros con familiares directos en Israel, la comunidad pone a disposición el servicio de apoyo emocional a través del departamento de Ezra.`,
    autor: 'Junta Directiva Jabad Barcelona',
    fecha: '2025-03-25',
    tiempoLectura: '3 min',
    colorCategoria: '#991B1B'
  },
  {
    id: 'n3',
    isPinned: false,
    categoria: 'halacha',
    titulo: 'Guía práctica: venta del jametz 5785',
    excerpt: 'El Rav publica la guía anual para la venta del jametz antes de Pesaj. Este año el plazo límite es el domingo 13 de abril antes de las 11:30h. La venta se puede realizar de forma presencial o mediante el formulario de la comunidad.',
    contenido: `La venta del jametz (mejirat jametz) es una obligación halachica fundamental antes de Pesaj. Este año los plazos son los siguientes:\n\nBedikat jametz: domingo 13 de abril por la noche.\nBiur jametz: lunes 14 de abril antes de las 11:30h.\nAnulación del jametz: lunes 14 antes de las 11:30h.\n\nPara realizar la venta a través de la comunidad, podéis contactar directamente con el Rav antes del domingo 13 de abril. También está disponible el formulario de mejirat jametz en nuestra web.\n\nRecordad que el jametz que no se venda ni destruya debe ser eliminado completamente del hogar antes de la hora límite.`,
    autor: 'HaRav Dovid Libersohn',
    fecha: '2025-03-24',
    tiempoLectura: '5 min',
    colorCategoria: '#C9A84C'
  },
  {
    id: 'n4',
    isPinned: false,
    categoria: 'evento',
    titulo: 'Séder comunitario Pesaj 5785 — Inscripciones abiertas',
    excerpt: 'Este año celebramos el Séder comunitario con capacidad para 120 personas. La cena incluye Hagadá bilingüe, cuatro copas de vino kosher le-Pesaj, y un menú elaborado por nuestro equipo de cocina kosher. Plazas limitadas.',
    contenido: `El Séder comunitario de Pesaj 5785 tendrá lugar el lunes 14 de abril a las 21:00h en el salón principal de la comunidad.\n\nEste año contamos con capacidad para 120 comensales y hemos preparado un programa especial que incluye:\n\n· Hagadá bilingüe hebreo-español diseñada por la comunidad\n· Cuatro copas con vino Mevushal kosher le-Pesaj\n· Menú completo elaborado bajo supervisión del Mashguiaj\n· Participación especial del coro juvenil de la comunidad\n· Espacio para niños con actividades durante el Séder\n\nEl precio por persona es de €45 (niños hasta 12 años: €20). Los miembros con dificultades económicas pueden contactar con Ezra de forma confidencial.\n\nInscripciones abiertas hasta el 10 de abril o hasta agotar plazas.`,
    autor: 'Comité de Eventos',
    fecha: '2025-03-22',
    tiempoLectura: '3 min',
    colorCategoria: '#166534'
  },
  {
    id: 'n5',
    isPinned: false,
    categoria: 'israel',
    titulo: 'Tehilim comunitario por la paz en Israel — Este Shabat',
    excerpt: 'Invitamos a toda la comunidad a participar en el rezo de tehilim por la paz y seguridad del pueblo de Israel. Este Shabat a las 11:30h, tras el oficio matutino. La participación es abierta a miembros y no miembros.',
    contenido: `En estos momentos de incertidumbre para el pueblo de Israel, la comunidad Jabad Barcelona convoca a todos sus miembros y a cualquier persona que desee unirse a un momento colectivo de tefila y tehilim.\n\nEl acto tendrá lugar este Shabat a las 11:30h, inmediatamente después del Musaf.\n\nEl Rav dirigirá la lectura de los capítulos 20, 121, 130 y 142 del libro de Tehilim, especialmente recitados en momentos de dificultad para el pueblo judío.\n\nEl acto es abierto a toda la comunidad judía de la ciudad, independientemente de la afiliación. Os animamos a difundir la convocatoria entre vuestras familias y amigos.`,
    autor: 'HaRav Dovid Libersohn',
    fecha: '2025-03-21',
    tiempoLectura: '2 min',
    colorCategoria: '#991B1B'
  },
  {
    id: 'n6',
    isPinned: false,
    categoria: 'comunidad',
    titulo: 'Nuevas clases de hebreo para adultos — Inscripción abierta',
    excerpt: 'A partir del 7 de abril abrimos un nuevo grupo de hebreo para adultos principiantes. Las clases son los martes y jueves de 19:00 a 20:30h. Imparte la profesora Dvora Mizrahi, con más de 15 años de experiencia.',
    contenido: `La comunidad Jabad Barcelona abre inscripción para el nuevo trimestre de hebreo para adultos, que comenzará el martes 7 de abril.\n\nNivel: Principiantes absolutos (Alef)\nHorario: Martes y jueves, 19:00 - 20:30h\nDuración: 12 semanas\nProfesora: Dvora Mizrahi\nPrecio: €120 el trimestre (miembros: €85)\n\nEl curso incluye material didáctico, acceso a la plataforma online de la comunidad y certificado de nivel al finalizar.\n\nPlazas limitadas a 15 alumnos. Las inscripciones se realizan a través del formulario en la web o directamente en secretaría.`,
    autor: 'Departamento Educativo',
    fecha: '2025-03-19',
    tiempoLectura: '3 min',
    colorCategoria: '#1B2E5E'
  },
  {
    id: 'n7',
    isPinned: false,
    categoria: 'halacha',
    titulo: 'Actualización lista productos Kosher España — Marzo 2025',
    excerpt: 'El departamento de kashrut ha actualizado la lista de productos kosher disponibles en supermercados españoles. Se añaden 12 nuevos productos y se retiran 3 que han perdido su certificación. Lista completa disponible en la sección Kosher App.',
    contenido: `El Consejo Rabínico de España ha publicado la actualización mensual de la lista de productos kosher disponibles en el mercado español.\n\nNOVEDADES MARZO 2025:\n· 12 nuevos productos certificados, incluyendo dos marcas de pasta y una línea de conservas\n· 3 productos retirados por cambio en la formulación sin notificación previa al certificador\n· Primera certificación de una marca española de vinos blancos\n\nRECORDATORIO PESAJ:\nLa lista de productos kosher le-Pesaj es independiente de la lista general. Un producto puede ser kosher todo el año pero no apto para Pesaj. Consultad siempre la lista específica de Pesaj antes de comprar.\n\nLa lista completa y actualizada está disponible en la sección Kosher App de esta plataforma.`,
    autor: 'Departamento Kashrut',
    fecha: '2025-03-17',
    tiempoLectura: '4 min',
    colorCategoria: '#C9A84C'
  },
  {
    id: 'n8',
    isPinned: false,
    categoria: 'comunidad',
    titulo: 'Bienvenida a los nuevos miembros de la comunidad',
    excerpt: 'Este mes damos la bienvenida a 8 nuevas familias que se han incorporado a Jabad Barcelona. La junta directiva organiza una cena de bienvenida el próximo viernes para que puedan conocer a la comunidad en un ambiente distendido.',
    contenido: `Con gran alegría anunciamos la incorporación de 8 nuevas familias a nuestra comunidad durante el mes de Adar.\n\nEsta es una muestra del crecimiento continuo de Jabad Barcelona y del interés creciente de la comunidad judía de España por tener un espacio de referencia.\n\nOrganizamos una cena de Shabat especial de bienvenida el próximo viernes, a la que están invitados todos los miembros. Será una oportunidad magnífica para conocer a los nuevos miembros y fortalecer los lazos comunitarios.\n\nLa cena comenzará a las 21:30h tras el oficio de Kabbalat Shabat. La asistencia es gratuita para todos los miembros. Por favor confirmad vuestra asistencia antes del miércoles por razones de organización.`,
    autor: 'Junta Directiva Jabad Barcelona',
    fecha: '2025-03-15',
    tiempoLectura: '3 min',
    colorCategoria: '#1B2E5E'
  }
];

const CATEGORIA_CONFIG = {
  'comunidad': { color: '#1B2E5E', label: 'Comunidad' },
  'israel':    { color: '#991B1B', label: 'Israel' },
  'halacha':   { color: '#C9A84C', label: 'Halaká' },
  'evento':    { color: '#166534', label: 'Evento' },
  'kashrut':   { color: '#92400E', label: 'Kashrut' }
};
