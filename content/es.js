/**
 * TEXTOS EN ESPAÑOL
 * Variables disponibles en cualquier texto (salen de site.config.js):
 *   precios   {canje} {pro} {pareja} {parejaWas} {parejaSave}
 *   oficiales {tasa} {tasaPro} {multa} {multaNo}
 *   datos     {paises} {meses} {psico} {provisional} · {brand} {email}
 * Usa *asteriscos* para poner una palabra en cursiva serif dentro de un titular.
 *
 * IMPORTANTE: todo dato legal de este archivo tiene su fuente en FUENTES.md.
 * Si cambia la norma (lista de países, tasas, plazos), se corrige aquí y allí.
 */

/* ───────────── Países de Latinoamérica (lista DGT actualizada el 26/06/2026) ───────────── */
const DIRECTO = [
  ['Argentina', '31/07/2002', 'No necesita verificación previa, pero sí un certificado de autenticidad y antigüedad de tu licencia, emitido por tu municipalidad y legalizado o apostillado.'],
  ['Perú', '28/01/2004', 'Según la DGT, no necesita localizador de verificación previa: se solicita el canje directamente.'],
  ['Uruguay', '05/11/2003', 'No necesita verificación previa: se solicita el canje directamente.'],
];
const VERIFICA = [
  ['Bolivia', '23/11/2007', ''],
  ['Brasil', '07/04/2009', ''],
  ['Chile', '10/06/2005', ''],
  ['Colombia', '31/07/2003', ''],
  ['Costa Rica', '10/08/2020', ''],
  ['Ecuador', '25/09/2003', ' Ojo: los permisos ecuatorianos F y G no son canjeables (acuerdo modificado el 14/09/2024).'],
  ['El Salvador', '24/06/2009', ''],
  ['Guatemala', '21/09/2008', ''],
  ['Honduras', '26/11/2024', ' Es el convenio más reciente de la región.'],
  ['Nicaragua', '02/01/2012', ''],
  ['Panamá', '11/07/2014', ''],
  ['Paraguay', '28/10/2007', ''],
  ['República Dominicana', '16/01/2007', ''],
];
const SIN = [
  ['Cuba', 'No figura en la lista oficial de países con convenio. El camino es obtener el permiso español.'],
  ['México', 'No figura en la lista oficial de países con convenio. El camino es obtener el permiso español.'],
  ['Venezuela', 'El convenio está suspendido con efectos desde el 15/03/2021 (BOE de 22/07/2022). Hoy no se puede canjear.'],
];

const countryOptions = [
  ...DIRECTO.map(([n, d, t]) => ({ label: n, big: 'Sí: canje directo', small: `Convenio en vigor (DGT: ${d}). Coche y moto, sin examen. ${t}` })),
  ...VERIFICA.map(([n, d, t]) => ({ label: n, big: 'Sí, con verificación', small: `Convenio en vigor (DGT: ${d}). Coche y moto, sin examen. Antes del canje, la DGT verifica tu licencia con ${n}.${t}` })),
  ...SIN.map(([n, t]) => ({ label: n, big: 'Hoy no hay canje', small: t, tone: 'muted' })),
].sort((a, b) => a.label.localeCompare(b.label, 'es'));

// Pruebas para camión y autobús según la columna «Pruebas a realizar» de la lista DGT (26/06/2026)
const SOLO_CIRC = ['Argentina', 'Chile', 'Costa Rica', 'Honduras', 'Perú'];
const proOptions = [...DIRECTO, ...VERIFICA]
  .map(([n]) => {
    if (n === 'Uruguay') return { label: n, big: 'Según la clase', small: 'C1, C1+E, C y C+E: teórica específica y prueba de circulación. Clase D: solo prueba de circulación.' };
    return SOLO_CIRC.includes(n)
      ? { label: n, big: 'Solo circulación', small: 'Camión y autobús (C y D): una prueba de circulación en vías abiertas. Sin examen teórico.' }
      : { label: n, big: 'Teórica + circulación', small: 'Camión y autobús (C y D): prueba teórica específica y prueba de circulación en vías abiertas.' };
  })
  .concat(SIN.map(([n]) => ({ label: n, big: 'Hoy no hay canje', small: 'Sin convenio en vigor. Existe una vía para conductores profesionales contratados en España: mirá la página «Sin convenio».', tone: 'muted' })))
  .sort((a, b) => a.label.localeCompare(b.label, 'es'));

const includes = [
  'Llamada de revisión de 20 minutos gratis',
  'Comprobación de que tu licencia es canjeable',
  'Checklist personalizada de documentos',
  'Guía paso a paso para la verificación con tu país',
  'Reserva de tu informe psicofísico en un centro autorizado',
  'Preparación y presentación de tu solicitud de canje, con tu autorización',
  'Tasa oficial de la DGT incluida',
  'Respuesta a los requerimientos de Tráfico',
  'Seguimiento en nuestra plataforma hasta tu permiso provisional',
  'Aviso cuando tu permiso definitivo esté en camino',
];

module.exports = {
  lang: 'es',
  locale: 'es_ES',

  ui: {
    skip: 'Saltar al contenido',
    nav: {
      main: 'Paso a paso',
      services: 'Canjes',
      how: 'Cómo funciona',
      file: 'Mi expediente',
      start: 'Empezar',
      menu: 'Abrir menú',
      close: 'Cerrar menú',
      home: 'Inicio',
    },
    seeMore: 'Ver detalle',
    freeCall: 'Incluye llamada de revisión de 20 min gratis',
    whatsapp: 'Escribinos por WhatsApp',
    whatsappMsg: 'Hola, quiero canjear mi licencia de conducir.',
    footer: {
      blurb: 'Canjeamos tu licencia de conducir por el permiso español. Sin examen para coche y moto, y con todo el papeleo resuelto.',
      services: 'Servicios',
      company: 'Contacto',
      legal: 'Legal',
      legalNotice: 'Aviso legal',
      privacy: 'Privacidad',
      cookies: 'Cookies',
      cookieSettings: 'Configurar cookies',
      rights: 'Todos los derechos reservados.',
      disclaimer: 'No somos la DGT ni un organismo público. Preparamos y presentamos tu trámite con tu autorización; la resolución corresponde siempre a la Jefatura de Tráfico.',
    },
    cookies: {
      title: 'Tu privacidad, tu decisión',
      text: 'Usamos cookies técnicas necesarias para que la web funcione y, solo si nos dejás, cookies analíticas para mejorarla.',
      accept: 'Aceptar todas',
      reject: 'Rechazar',
      configure: 'Configurar',
      save: 'Guardar preferencias',
      necessary: 'Necesarias',
      necessaryText: 'Imprescindibles para que la web funcione. Siempre activas.',
      analytics: 'Analíticas',
      analyticsText: 'Nos ayudan a entender cómo se usa la web, de forma agregada.',
      more: 'Más información',
    },
    faqTitle: 'Preguntas frecuentes',
    shortForm: {
      name: 'Nombre',
      email: 'Email',
      phone: 'WhatsApp',
      phonePlaceholder: '+34 600 000 000',
      message: '¿De qué país es tu licencia? (opcional)',
      privacy: 'Acepto la <a href="{privacyUrl}">política de privacidad</a>.',
      submit: 'Enviar',
      sending: 'Enviando…',
      ok: '¡Recibido! Te escribimos en menos de 24 horas.',
      error: 'No hemos podido enviarlo. Escribinos por WhatsApp y lo vemos al momento.',
    },
  },

  // Pantalla del móvil (sección Plataforma). Es una ilustración del seguimiento.
  phone: {
    hi: 'Hola, Diego',
    initial: 'D',
    status: 'En tramitación',
    file: 'Expediente 28/004812',
    service: 'Canje de licencia · Colombia',
    progress: 72,
    steps: [
      { label: 'Licencia revisada', when: '2 sep', state: 'done' },
      { label: 'Verificación con Colombia', when: '16 sep', state: 'done' },
      { label: 'Informe psicofísico', when: '18 sep', state: 'done' },
      { label: 'Solicitud de canje', when: 'En curso', state: 'active' },
      { label: 'Entrega en Tráfico', when: 'Pendiente', state: 'todo' },
    ],
    manager: 'Tu gestora: Lucía',
    managerInitial: 'L',
    msg: 'Todo en orden. Te avisamos en cuanto Tráfico te llame para la entrega.',
    toast: 'Colombia confirmó la validez de tu licencia',
    now: 'ahora',
  },

  // Servicios con página propia (tarjetas de la home, menú y pie)
  services: [
    {
      key: 'coche',
      slug: '/canje-coche-y-moto/',
      name: 'Coche y moto',
      short: 'Coche y moto',
      line: 'Canjeá tu licencia sin dar examen.',
      icon: 'car',
      pill: '{canje}',
      priceKey: 'canje',
      cardImg: 'cardCoche',
      cardAlt: 'Mujer sonriente al volante de su coche',
      heroImg: 'heroCoche',
    },
    {
      key: 'pro',
      slug: '/canje-camion-y-autobus/',
      name: 'Camión y autobús',
      short: 'Profesional',
      line: 'Tu permiso profesional, listo para trabajar.',
      icon: 'briefcase',
      pill: '{pro}',
      priceKey: 'pro',
      cardImg: 'cardPro',
      cardAlt: 'Conductor de autobús al volante',
      heroImg: 'heroPro',
    },
    {
      key: 'sinconvenio',
      slug: '/mexico-cuba-venezuela/',
      name: 'México, Cuba y Venezuela',
      short: 'Sin convenio',
      line: 'Sin canje, pero con un plan claro.',
      icon: 'route',
      pill: 'Orientación gratis',
      cardImg: 'cardSin',
      cardAlt: 'Carretera de curvas entre colinas',
      heroImg: 'heroSin',
    },
  ],

  // Página principal del servicio (paso a paso + precio)
  main: { key: 'coche', slug: '/canje-paso-a-paso/', name: 'El canje, paso a paso', icon: 'wheel', priceKey: 'canje' },

  /* ═════════════════════════ HOME ═════════════════════════ */
  home: {
    seo: {
      title: '{brand} · Canje de licencia de conducir en España, sin examen',
      description: 'Tu licencia extranjera vale {meses} meses desde que sos residente. Canjeamos tu licencia de conducir por el permiso español: revisión, verificación, psicotécnico y solicitud. Desde {canje}, tasa incluida.',
    },
    hero: {
      eyebrow: 'Canje de licencia de conducir · Madrid',
      title: 'Tu licencia tiene *fecha de vencimiento.*',
      lead: 'Desde que sos residente, tu licencia extranjera vale <strong>{meses} meses</strong> para manejar en España. Canjeala por el permiso español: <strong>sin examen y sin errores</strong>.',
      cta: 'Empezar',
      cta2: 'Ver servicios',
      alt: 'Plaza de Cibeles y Gran Vía de Madrid con coches circulando',
    },
    statement: {
      line1: 'Vos seguí manejando.',
      line2: 'Del papeleo nos ocupamos nosotros.',
    },
    feature: {
      eyebrow: 'Canje de coche y moto',
      title: 'Tu permiso español, *sin examen.*',
      price: '{canje}',
      lead: 'Por licencia, con la <strong>tasa de la DGT incluida</strong>. Desde la revisión hasta tu permiso provisional.',
      priceFootnote: 'El informe psicofísico lo pagás directamente en el centro médico.',
      items: [
        { icon: 'search', label: 'Revisión de tu licencia' },
        { icon: 'globe', label: 'Verificación con tu país' },
        { icon: 'eye', label: 'Psicotécnico reservado' },
        { icon: 'file', label: 'Solicitud presentada' },
        { icon: 'euro', label: 'Tasa DGT incluida' },
        { icon: 'phone', label: 'Seguimiento en la plataforma' },
      ],
      cta: 'Ver el paso a paso',
      alt: 'Mano sobre el volante de un coche con luz de atardecer',
    },
    cards: {
      eyebrow: 'Canjes',
      title: 'Elegí tu *camino.*',
      lead: 'Depende de qué manejás y de qué país es tu licencia. Te decimos cuál es el tuyo en una llamada.',
    },
    how: {
      eyebrow: 'Cómo funciona',
      title: 'Cuatro *pasos.*',
      steps: [
        { title: 'Nos contás tu caso', text: 'País de tu licencia, tipo de permiso y fecha de tu residencia. Por formulario o WhatsApp.' },
        { title: 'Revisamos que sea canjeable', text: 'Antes de cobrarte nada: convenio, vigencia y fechas.' },
        { title: 'Preparamos todo', text: 'Verificación, psicotécnico, tasa y solicitud. Vos solo firmás la autorización.' },
        { title: 'Vas una vez a Tráfico', text: 'Entregás tu licencia y salís con el permiso provisional.' },
      ],
    },
    stats: {
      eyebrow: 'En cifras',
      title: 'Lo que *dice la norma.*',
      items: [
        { value: '{meses}', label: 'meses vale tu licencia extranjera', text: 'Desde que adquirís la residencia en España.' },
        { value: '{paises}', label: 'países de Latinoamérica con convenio', text: 'Para canjear coche y moto sin examen.' },
        { value: 200, suffix: ' €', label: 'de multa', text: 'Por conducir con una licencia canjeable que ya no es válida.' },
        { value: 24, suffix: ' h', label: 'de respuesta', text: 'Máximo. Normalmente, mucho antes.' },
      ],
      source: 'Fuentes: Reglamento General de Conductores (art. 21), lista de países con convenio de la DGT (actualizada el 26/06/2026) y Ley de Tráfico (arts. 76 y 80).',
    },
    platform: {
      eyebrow: 'Plataforma',
      title: 'Tu canje, *siempre a la vista.*',
      lead: 'Seguí cada paso en tiempo real: verificación, psicotécnico, solicitud y entrega.',
      points: [
        { icon: 'bell', text: 'Avisos en cada cambio de estado' },
        { icon: 'upload', text: 'Subí tus documentos desde el móvil' },
        { icon: 'chat', text: 'Hablá con tu gestor sin esperas' },
      ],
      cta: 'Ir a Mi expediente',
    },
    // Cinta de dudas habituales. No son testimonios de clientes.
    voices: {
      eyebrow: 'En claro',
      title: 'Lo que casi nadie *te cuenta.*',
      items: [
        { quote: 'Me dijeron que mi licencia vale un año.', tag: 'Vale 6 meses', context: 'Desde que tenés residencia en España' },
        { quote: '¿Tengo que dar examen de nuevo?', tag: 'Para coche y moto, no', context: 'Si tu país tiene convenio' },
        { quote: 'No consigo cita en Tráfico.', tag: 'Ya no hace falta', context: 'Canje digital desde mayo de 2025' },
        { quote: 'Saqué la licencia en mi país cuando ya vivía acá.', tag: 'Esa no se puede canjear', context: 'Tiene que ser anterior a tu residencia' },
        { quote: 'Soy venezolano. ¿Puedo canjear?', tag: 'Hoy no', context: 'El convenio está suspendido desde 2021' },
        { quote: 'Mi licencia está vencida.', tag: 'Tiene que estar en vigor', context: 'La DGT exige el original válido' },
      ],
    },
    faq: [
      {
        label: 'El canje',
        items: [
          { q: '¿Cuánto tiempo puedo manejar con mi licencia extranjera?', a: 'Como máximo {meses} meses desde que adquirís tu residencia en España. Pasado ese plazo, tu licencia deja de ser válida para conducir acá y necesitás el permiso español. No hace falta esperar: podés canjear desde el primer día de residencia.' },
          { q: '¿Tengo que dar examen?', a: 'Para coche y moto (clases A y B), no: si tu país tiene convenio, el canje es directo. Para camión y autobús (clases C y D) sí hay que superar una prueba de circulación y, según el país, también una teórica específica.' },
          { q: '¿Necesito cita previa en la DGT?', a: 'Desde mayo de 2025 el canje se puede solicitar por la sede electrónica de la DGT sin cita previa. Solo tenés que ir una vez a la Jefatura de Tráfico para entregar tu licencia original y recoger tu permiso provisional.' },
          { q: '¿Qué pasa con mi licencia original?', a: 'Se entrega en Tráfico al finalizar el trámite. En ese momento te dan un permiso provisional, válido {provisional} meses y solo dentro de España. El permiso definitivo llega por correo a tu casa; la DGT habla de un mes y medio aproximadamente.' },
          { q: '¿Qué pasa si me para la policía con la licencia ya vencida para España?', a: 'Es una infracción grave, con multa de {multa}, si tu licencia es canjeable; si no lo es, la sanción codificada es de {multaNo}. No es delito cuando la licencia es auténtica y la obtuviste en tu país: la Fiscalía General del Estado lo aclara en su Circular 10/2011.' },
        ],
      },
      {
        label: 'Países',
        items: [
          { q: '¿Qué países de Latinoamérica tienen convenio?', a: 'Hoy son {paises}: Argentina, Bolivia, Brasil, Chile, Colombia, Costa Rica, Ecuador, El Salvador, Guatemala, Honduras, Nicaragua, Panamá, Paraguay, Perú, República Dominicana y Uruguay. Es la lista oficial de la DGT, actualizada el 26/06/2026.' },
          { q: '¿Y México, Cuba o Venezuela?', a: 'México y Cuba no tienen convenio. El de Venezuela está suspendido con efectos desde el 15 de marzo de 2021. En los tres casos el camino es obtener el permiso español; te explicamos cómo y te orientamos gratis.' },
          { q: '¿Qué es la verificación previa?', a: 'En la mayoría de los países, la DGT le pide al país que emitió tu licencia que confirme que es válida antes de canjearla. La respuesta puede tardar días o semanas según el país. No se pide para Argentina, Perú y Uruguay; Argentina, en cambio, exige un certificado de tu municipalidad apostillado.' },
        ],
      },
      {
        label: 'Nuestro servicio',
        items: [
          { q: '¿Qué incluye el precio?', a: 'Todo el trámite: revisión de tu caso, checklist, guía para la verificación, reserva del psicotécnico, solicitud de canje, tasa oficial de la DGT y seguimiento hasta tu permiso provisional. El informe psicofísico lo pagás directamente en el centro médico.' },
          { q: '¿Tengo que ir a algún sitio?', a: 'A dos: al centro médico para el informe psicofísico y, una sola vez, a la Jefatura de Tráfico para entregar tu licencia y recoger el provisional. El resto se hace online.' },
          { q: '¿Y si mi licencia no se puede canjear?', a: 'Lo sabés antes de pagar: la revisión inicial es gratis. Si no es canjeable, te explicamos el motivo y qué alternativas tenés.' },
          { q: '¿Cuánto tarda?', a: 'Depende sobre todo de lo que tarde tu país en contestar la verificación y de la Jefatura de Tráfico, que no garantiza plazos. Nosotros preparamos lo nuestro en pocos días y vos ves cada avance en la plataforma.' },
        ],
      },
    ],
    final: {
      title: '¿Arrancamos?',
      lead: 'Contanos de qué país es tu licencia. Te respondemos en menos de 24 horas.',
      cta: 'Contanos tu caso',
      alt: 'Carretera que lleva hacia un pueblo entre montañas',
    },
  },

  /* ═════════════════════ DETALLE: COMÚN ═════════════════════ */
  detail: {
    priceNote: 'Tasa de la DGT incluida',
    cta: 'Empezar',
    forYouTitle: '¿Es *para vos?*',
    includesTitle: 'Qué incluye *nuestro servicio.*',
    includesLead: 'Todo el trámite, de principio a fin. Sin sorpresas.',
    includes,
    requirementsTitle: '*Requisitos.*',
    requirementsLead: 'Lo que pide la DGT. Nosotros lo revisamos con vos antes de empezar.',
    docsTitle: '*Documentación.*',
    docsLead: 'Tu checklist. Marcala a medida que vayas reuniendo cada documento.',
    docsHint: 'Te enviamos una versión personalizada según tu país al empezar.',
    processTitle: 'El *proceso.*',
    benefitsTitle: 'Qué *conseguís.*',
    upsell: {
      eyebrow: 'Paso a paso',
      title: 'Mirá cómo es el canje, de principio a fin.',
      text: 'Revisión, verificación, psicotécnico, solicitud, entrega en Tráfico y tu permiso en casa.',
      cta: 'Ver el paso a paso',
    },
    final: {
      title: '¿Empezamos con *lo tuyo?*',
      lead: 'Dejanos tus datos y te escribimos en menos de 24 horas. O empezá el formulario completo.',
      cta: 'Formulario completo',
    },
  },

  pages: {
    /* ═════════════════════ COCHE Y MOTO ═════════════════════ */
    coche: {
      seo: {
        title: 'Canje de licencia de conducir de coche y moto · {canje} | {brand}',
        description: 'Canjeá tu licencia de Argentina, Colombia, Perú, Ecuador y {paises} países de Latinoamérica por el permiso español, sin examen. Verificación, psicotécnico, solicitud y tasa incluida por {canje}.',
      },
      hero: {
        eyebrow: 'Coche y moto · clases A y B',
        title: 'Tu licencia de allá. *Tu permiso de acá.*',
        lead: 'Si tu país tiene convenio con España, canjeás sin dar examen.',
        alt: 'Coche circulando por una carretera de montaña',
      },
      price: '{canje}',
      urgent: {
        title: 'Tu licencia vale {meses} meses desde tu residencia.',
        text: 'Empezá hoy.',
        cta: 'Empezar ya',
      },
      forYou: [
        { icon: 'id', title: 'Sos residente en España', text: 'Con tu tarjeta de residencia en vigor.' },
        { icon: 'globe', title: 'Tu país tiene convenio', text: '{paises} países de Latinoamérica lo tienen.' },
        { icon: 'check-doc', title: 'Tu licencia está en vigor', text: 'Original, válida y sin vencer.' },
        { icon: 'calendar', title: 'La sacaste antes de vivir acá', text: 'Antes de ser residente legal en España.' },
      ],
      requirements: [
        { icon: 'id', title: 'Residencia en España', text: 'Tenés que ser residente y acreditarlo con tu tarjeta de identidad de extranjero.' },
        { icon: 'globe', title: 'País con convenio', text: 'Tu licencia debe ser de un país con convenio de canje en vigor con España.' },
        { icon: 'check-doc', title: 'Licencia original en vigor', text: 'La DGT exige el original, válido y en vigor. Lo entregás al finalizar el trámite.' },
        { icon: 'calendar', title: 'Obtenida antes de tu residencia', text: 'No es canjeable una licencia obtenida en tu país cuando ya eras residente legal en España.' },
        { icon: 'eye', title: 'Informe psicofísico', text: 'De un Centro de Reconocimiento de Conductores autorizado. Vale {psico} días.' },
        { icon: 'link', title: 'Que no venga de otro canje', text: 'No se canjean licencias obtenidas, a su vez, por canje de un país sin convenio con España.' },
      ],
      docs: [
        { title: 'Identidad y residencia', items: ['Pasaporte o tarjeta de identidad de extranjero (TIE) en vigor', 'TIE o certificado que acredite tu residencia en España'] },
        { title: 'Tu licencia', items: ['Licencia de conducir original, válida y en vigor', 'Licencia escaneada por ambas caras', 'Solo Argentina: certificado de autenticidad y antigüedad de tu municipalidad, legalizado o apostillado'] },
        { title: 'Salud', items: ['Informe de aptitud psicofísica de un Centro de Reconocimiento de Conductores'] },
        { title: 'Solicitud y tasa', items: ['Solicitud oficial de canje (la preparamos nosotros)', 'Tasa 2.3 de la DGT: {tasa} (incluida en nuestro precio)'] },
        { title: 'Para gestionarlo online', items: ['Cl@ve o certificado digital (te explicamos cómo obtenerlos)', 'Autorización para presentar la solicitud en tu nombre'] },
      ],
      tool: {
        type: 'lookup',
        icon: 'globe',
        title: '¿Tu país tiene *convenio?*',
        big: '{paises} países',
        bigLabel: 'de Latinoamérica tienen convenio en vigor',
        text: 'Con convenio, la licencia de coche y moto se canjea sin examen. En la mayoría de los países, la DGT verifica antes tu licencia con el país que la emitió.',
        chip: { label: 'Tasa oficial del canje', value: '{tasa}' },
        calcTitle: 'Comprobá tu país',
        calcLabel: 'País que emitió tu licencia',
        placeholder: 'Elegí un país',
        options: countryOptions,
        emptyBig: '—',
        emptySmall: 'Elegí tu país y te decimos si se puede canjear y cómo.',
        calcDisclaimer: 'Según la lista oficial de la DGT actualizada el 26/06/2026. Revisamos tu caso concreto antes de empezar.',
      },
      process: [
        { title: 'Revisión', text: 'Comprobamos convenio, vigencia y fechas de tu licencia.' },
        { title: 'Verificación', text: 'Si tu país la exige, te guiamos para solicitarla. Puede tardar días o semanas.' },
        { title: 'Psicotécnico', text: 'Te reservamos el informe psicofísico en un centro autorizado.' },
        { title: 'Solicitud', text: 'Presentamos tu canje en la sede electrónica de la DGT, con la tasa pagada.' },
        { title: 'Entrega en Tráfico', text: 'Entregás tu licencia original y recibís el permiso provisional, válido {provisional} meses en España.' },
        { title: 'Permiso definitivo', text: 'Llega por correo a tu casa. La DGT habla de un mes y medio aproximadamente.' },
      ],
      benefits: [
        { icon: 'wheel', title: 'Conducir legalmente', text: 'Sin multas ni sustos en un control.' },
        { icon: 'check', title: 'Sin examen', text: 'Ni teórico ni práctico para coche y moto.' },
        { icon: 'globe', title: 'Un permiso europeo', text: 'El permiso español es válido en toda la Unión Europea.' },
      ],
      faq: [
        { q: '¿Desde cuándo cuentan los {meses} meses?', a: 'Desde que adquirís tu residencia en España, debidamente acreditada. Si tenés dudas sobre tu fecha, la revisamos con tu documentación en la llamada inicial.' },
        { q: '¿Puedo canjear si mi residencia todavía está en trámite?', a: 'La DGT pide ser residente y aportar la tarjeta de residencia. Mientras llega, podemos dejar todo preparado para presentar el canje en cuanto la tengas.' },
        { q: '¿Qué es el informe psicofísico?', a: 'Es el reconocimiento médico para conductores: vista, oído y coordinación. Se hace en un Centro de Reconocimiento de Conductores autorizado, en el día, y tiene una validez de {psico} días. Por eso lo reservamos cuando la verificación ya está resuelta.' },
        { q: '¿Puedo seguir manejando mientras se tramita?', a: 'Dentro de tus primeros {meses} meses de residencia, sí, con tu licencia en vigor. Al entregar el original en Tráfico recibís un permiso provisional con el que podés conducir en España durante {provisional} meses.' },
        { q: 'Soy argentino, ¿qué certificado necesito?', a: 'Un certificado de autenticidad y antigüedad de tu licencia. Se pide en la municipalidad argentina que la emitió y después se legaliza o apostilla. Te explicamos cómo tramitarlo a distancia.' },
        { q: '¿Mi licencia de moto también se canjea?', a: 'Sí. Las clases de moto y coche se canjean sin examen según las equivalencias de cada convenio. Revisamos qué clases españolas te corresponden.' },
      ],
    },

    /* ═════════════════════ CAMIÓN Y AUTOBÚS ═════════════════════ */
    pro: {
      seo: {
        title: 'Canje de permiso de camión y autobús (C y D) · {pro} | {brand}',
        description: 'Canjeá tu licencia profesional de camión o autobús por el permiso español C o D. Te decimos qué pruebas pide tu país, preparamos la solicitud y pagamos la tasa. {pro}.',
      },
      hero: {
        eyebrow: 'Camión y autobús · clases C y D',
        title: 'Tu oficio viaja con vos. *Tu permiso, también.*',
        lead: 'Canjeá tu licencia profesional y volvé a trabajar al volante.',
        alt: 'Camión circulando por una carretera entre campos al atardecer',
      },
      price: '{pro}',
      priceNote: 'Tasa de examen de la DGT incluida',
      forYou: [
        { icon: 'briefcase', title: 'Sos conductor profesional', text: 'Con licencia de camión o autobús de tu país.' },
        { icon: 'globe', title: 'Tu país tiene convenio', text: 'Uno de los {paises} de Latinoamérica.' },
        { icon: 'id', title: 'Sos residente en España', text: 'Con tu tarjeta de residencia en vigor.' },
        { icon: 'check-doc', title: 'Tu licencia está en vigor', text: 'Original, válida y sin vencer.' },
      ],
      includes: [
        'Llamada de revisión de 20 minutos gratis',
        'Comprobación de las clases que podés canjear',
        'Qué pruebas pide la DGT para tu país',
        'Guía paso a paso para la verificación con tu país',
        'Reserva del reconocimiento médico para permisos C y D',
        'Preparación y presentación de tu solicitud, con tu autorización',
        'Tasa oficial de examen incluida: dos convocatorias',
        'Seguimiento en nuestra plataforma hasta tu permiso',
      ],
      requirements: [
        { icon: 'id', title: 'Residencia en España', text: 'Tenés que ser residente y acreditarlo con tu tarjeta de identidad de extranjero.' },
        { icon: 'check-doc', title: 'Licencia original en vigor', text: 'Con las clases de camión o autobús que querés canjear.' },
        { icon: 'calendar', title: 'Obtenida antes de tu residencia', text: 'No es canjeable una licencia obtenida cuando ya eras residente legal en España.' },
        { icon: 'stethoscope', title: 'Reconocimiento específico', text: 'Los permisos C y D requieren un informe psicofísico específico para conductores profesionales.' },
        { icon: 'wheel', title: 'Prueba de circulación', text: 'En vías abiertas al tráfico. La exigen todos los convenios para estas clases.' },
        { icon: 'book', title: 'Teórica específica', text: 'Solo en algunos países. Comprobalo abajo con el tuyo.' },
      ],
      docs: [
        { title: 'Identidad y residencia', items: ['Pasaporte o tarjeta de identidad de extranjero (TIE) en vigor', 'TIE o certificado que acredite tu residencia en España'] },
        { title: 'Tu licencia', items: ['Licencia profesional original, válida y en vigor', 'Licencia escaneada por ambas caras', 'Solo Argentina: certificado de autenticidad y antigüedad, legalizado o apostillado'] },
        { title: 'Salud', items: ['Informe de aptitud psicofísica específico para permisos C y D'] },
        { title: 'Solicitud y tasa', items: ['Solicitud oficial de canje (la preparamos nosotros)', 'Tasa 2.1 de la DGT: {tasaPro}, con dos convocatorias (incluida en nuestro precio)'] },
      ],
      tool: {
        type: 'lookup',
        icon: 'wheel',
        title: '¿Qué pruebas pide *tu país?*',
        big: '2 convocatorias',
        bigLabel: 'incluye la tasa oficial de examen',
        text: 'Para camión y autobús el canje no es directo: hay que superar una prueba de circulación y, según el convenio, también una teórica específica.',
        chip: { label: 'Tasa oficial con pruebas', value: '{tasaPro}' },
        calcTitle: 'Comprobá tu país',
        calcLabel: 'País que emitió tu licencia',
        placeholder: 'Elegí un país',
        options: proOptions,
        emptyBig: '—',
        emptySmall: 'Elegí tu país y te decimos qué pruebas te tocan.',
        calcDisclaimer: 'Según la lista oficial de la DGT actualizada el 26/06/2026. Las clases exactas dependen de la tabla de equivalencias de cada convenio: la revisamos con vos.',
      },
      process: [
        { title: 'Revisión', text: 'Comprobamos convenio, clases y vigencia de tu licencia.' },
        { title: 'Verificación', text: 'Si tu país la exige, te guiamos para solicitarla.' },
        { title: 'Reconocimiento médico', text: 'El específico para permisos C y D.' },
        { title: 'Solicitud y tasa', text: 'Presentamos tu canje y pagamos la tasa de examen.' },
        { title: 'Pruebas', text: 'Te decimos cómo pedir fecha. La tasa cubre dos convocatorias.' },
        { title: 'Tu permiso', text: 'Superada la prueba, entregás tu licencia en Tráfico y recibís el justificante de tu permiso español.' },
      ],
      benefits: [
        { icon: 'briefcase', title: 'Volver a tu oficio', text: 'Con el permiso que piden las empresas de transporte.' },
        { icon: 'wheel', title: 'También tu coche', text: 'En el mismo trámite canjeás las clases que tengas.' },
        { icon: 'globe', title: 'Un permiso europeo', text: 'El permiso español es válido en toda la Unión Europea.' },
      ],
      faq: [
        { q: '¿Tengo que volver a dar examen?', a: 'Para las clases de camión y autobús, sí: una prueba de circulación en vías abiertas y, según tu país, también una teórica específica. Para Argentina, Chile, Costa Rica, Honduras y Perú, la lista de la DGT indica solo prueba de circulación.' },
        { q: '¿Qué incluye la tasa de la DGT?', a: 'La tasa 2.1, de {tasaPro}, da derecho a dos convocatorias de examen. Si las agotás, hay que volver a pagarla. Está incluida una vez en nuestro precio.' },
        { q: '¿El precio incluye clases o el vehículo para la prueba?', a: 'No. La prueba de circulación se hace con un vehículo de la clase correspondiente, que normalmente aporta una autoescuela. Ese coste lo contratás aparte; nosotros nos ocupamos de todo el trámite.' },
        { q: '¿Puedo trabajar mientras tanto?', a: 'Tu licencia extranjera vale para conducir en España como máximo {meses} meses desde tu residencia. Para trabajar como conductor profesional, consultá además con tu empresa los requisitos propios del transporte.' },
        { q: '¿Y si mi empresa quiere tramitarlo?', a: 'La DGT prevé que las empresas de transporte tramiten directamente el canje de sus conductores. Si tu empresa lo va a hacer, te orientamos sobre qué documentación preparar.' },
      ],
    },

    /* ═════════════════════ SIN CONVENIO ═════════════════════ */
    sinconvenio: {
      seo: {
        title: 'Licencia de México, Cuba o Venezuela en España: qué hacer | {brand}',
        description: 'México y Cuba no tienen convenio de canje con España, y el de Venezuela está suspendido desde 2021. Te explicamos cómo obtener el permiso español y te orientamos gratis.',
      },
      hero: {
        eyebrow: 'México, Cuba y Venezuela',
        title: 'Sin convenio no hay canje. *Pero hay camino.*',
        lead: 'Te explicamos sin vueltas qué podés hacer y por dónde empezar.',
        alt: 'Carretera vacía entre colinas al anochecer',
      },
      price: 'Gratis',
      priceNote: 'Orientación de 20 minutos, sin compromiso',
      labels: {
        requirementsTitle: 'Lo que *tenés que saber.*',
        requirementsLead: 'Las reglas, tal como están hoy. Sin promesas que nadie puede cumplir.',
        docsTitle: 'Para *examinarte.*',
        docsLead: 'Lo que vas a ir necesitando para obtener el permiso español.',
        docsHint: 'En la llamada te armamos el plan según tu situación.',
        includesTitle: 'Qué incluye *la orientación.*',
        includesLead: 'Veinte minutos para salir con un plan claro.',
        benefitsTitle: 'Con qué *te quedás.*',
      },
      forYou: [
        { icon: 'globe', title: 'Tu licencia es de México o Cuba', text: 'No tienen convenio de canje con España.' },
        { icon: 'hourglass', title: 'O de Venezuela', text: 'El convenio está suspendido desde el 15 de marzo de 2021.' },
        { icon: 'briefcase', title: 'Trabajás como conductor', text: 'Existe una vía específica para profesionales.' },
      ],
      includes: [
        'Llamada de orientación de 20 minutos gratis',
        'Revisión de tu caso: residencia, licencia y plazos',
        'Plan paso a paso para obtener el permiso español',
        'Vía para conductores profesionales, si es tu caso',
        'Aviso si se firma o reactiva un convenio con tu país',
      ],
      requirements: [
        { icon: 'clock', title: 'Tu licencia vale {meses} meses', text: 'Desde tu residencia en España podés conducir con ella ese tiempo, si está en vigor.' },
        { icon: 'route', title: 'Después, permiso español', text: 'Pasado el plazo hay que obtener el permiso español superando las pruebas.' },
        { icon: 'id', title: 'Residencia para examinarte', text: 'La norma pide acreditar residencia normal o estancia por estudios en España de al menos seis meses.' },
        { icon: 'euro', title: 'Tasa de examen: {tasaPro}', text: 'Es la tasa oficial de la DGT e incluye dos convocatorias.' },
        { icon: 'briefcase', title: 'Vía profesional', text: 'Con al menos 6 meses contratado como conductor profesional en España, se canjea superando una prueba de circulación.' },
        { icon: 'shield', title: 'Multa si seguís conduciendo', text: 'Pasados los {meses} meses, la sanción codificada para una licencia no canjeable es de {multaNo}.' },
      ],
      docs: [
        { title: 'Identidad y residencia', items: ['Pasaporte o tarjeta de identidad de extranjero (TIE) en vigor', 'Acreditación de tu residencia o estancia por estudios en España'] },
        { title: 'Para el examen', items: ['Informe de aptitud psicofísica de un centro autorizado', 'Tasa 2.1 de la DGT: {tasaPro} (dos convocatorias)', 'Inscripción en una autoescuela para las pruebas'] },
        { title: 'Solo vía profesional', items: ['Traducción oficial de tu licencia, si no está en castellano', 'Certificado de empresa: al menos 6 meses como conductor profesional', 'Acreditación de cotización a la Seguridad Social por ese período'] },
      ],
      process: [
        { title: 'Orientación', text: 'Revisamos tu situación y tus plazos en una llamada.' },
        { title: 'Tu plan', text: 'Te decimos qué vía te corresponde: permiso desde cero o vía profesional.' },
        { title: 'Teórico', text: 'Preparás y aprobás el examen teórico.' },
        { title: 'Práctico', text: 'Clases y examen de circulación con tu autoescuela.' },
        { title: 'Tu permiso español', text: 'Con él podés conducir en España y en toda la Unión Europea.' },
      ],
      benefits: [
        { icon: 'route', title: 'Un plan claro', text: 'Qué hacer, en qué orden y qué cuesta cada paso.' },
        { icon: 'clock', title: 'Tus plazos, controlados', text: 'Sabés hasta cuándo podés conducir con tu licencia.' },
        { icon: 'bell', title: 'Aviso si cambia la norma', text: 'Te escribimos si hay novedades con tu país.' },
      ],
      faq: [
        { q: '¿De verdad no se puede canjear la licencia venezolana?', a: 'Hoy no. España suspendió la aplicación del convenio con Venezuela con efectos desde el 15 de marzo de 2021 (publicado en el BOE el 22 de julio de 2022), y Venezuela no figura en la lista de países con convenio de la DGT actualizada el 26/06/2026.' },
        { q: '¿Puedo manejar con mi licencia mientras tanto?', a: 'Sí, durante un máximo de {meses} meses desde tu residencia en España, siempre que tu licencia esté en vigor. Si no está en castellano, tiene que ir con traducción oficial o con el permiso internacional.' },
        { q: '¿Cuánto cuesta sacar el permiso español?', a: 'La tasa oficial de examen es de {tasaPro} e incluye dos convocatorias. A eso se suman el reconocimiento médico y la autoescuela, que tiene precio libre. Comparativas del sector publicadas en 2026 sitúan el total habitual entre 1.000 y 1.900 €.' },
        { q: '¿Qué es la vía para conductores profesionales?', a: 'Si acreditás haber estado contratado como conductor profesional al menos 6 meses por una empresa establecida en España, podés canjear tu licencia superando una prueba de circulación en vías abiertas, aunque tu país no tenga convenio.' },
        { q: '¿Me pueden gestionar ustedes el permiso desde cero?', a: 'El examen lo preparás con una autoescuela. Nosotros te orientamos gratis para que empieces bien y, si en el futuro hay convenio con tu país, te avisamos para canjear.' },
      ],
    },
  },

  /* ═════════════════════ PASO A PASO (página principal) ═════════════════════ */
  mainPage: {
    seo: {
      title: 'Canje de licencia de conducir paso a paso · {canje} | {brand}',
      description: 'Así es el canje de tu licencia extranjera por el permiso español: revisión, verificación con tu país, psicotécnico, solicitud, entrega en Tráfico y permiso en casa. {canje}, tasa incluida.',
    },
    hero: {
      eyebrow: 'Canje de licencia',
      title: 'El canje, *resuelto.*',
      cta: 'Quiero mi canje',
      alt: 'Mujer sonriente mostrando las llaves de su coche',
    },
    price: '{canje}',
    priceNotes: ['por licencia', 'Tasa de la DGT incluida'],
    priceFootnote: 'Coche y moto (clases A y B). El informe psicofísico lo pagás directamente en el centro médico.',
    statement: {
      line1: 'Una visita al médico. Una a Tráfico.',
      line2: 'El resto es cosa nuestra.',
    },
    timelineTitle: 'Tu canje, *paso a paso.*',
    steps: [
      { icon: 'search', img: 'stepReview', title: 'Revisamos tu licencia', text: 'Convenio, vigencia y fechas. Antes de cobrarte nada.', alt: 'Pasaporte y documentos sobre una cama' },
      { icon: 'globe', img: 'stepVerify', title: 'Verificación con tu país', text: 'Si tu país la exige, te guiamos para pedirla. Puede tardar días o semanas.', alt: 'Sobres de correo aéreo apilados' },
      { icon: 'eye', img: 'stepMedical', title: 'Informe psicofísico', text: 'Te lo reservamos en un centro autorizado. Vale {psico} días.', alt: 'Optometrista revisando la vista de una paciente' },
      { icon: 'file', img: 'stepApply', title: 'Solicitud y tasa', text: 'Presentamos tu canje online, con la tasa pagada. Sin cita previa.', alt: 'Mujer sonriente frente a su portátil' },
      { icon: 'pin', img: 'stepOffice', title: 'Una visita a Tráfico', text: 'Entregás tu licencia y salís con el permiso provisional.', alt: 'Puerta de Alcalá de Madrid con coches circulando' },
      { icon: 'mail', img: 'stepMail', title: 'Tu permiso llega a casa', text: 'Por correo. La DGT habla de un mes y medio aproximadamente.', alt: 'Cartas y sobres apilados' },
      { icon: 'phone', img: null, title: 'Seguimiento en nuestra plataforma', text: 'Cada paso, a la vista.' },
    ],
    stepsNote: 'Los plazos de la verificación y de la Jefatura de Tráfico no dependen de nosotros: la DGT no garantiza tiempos de resolución.',
    pricing: {
      title: 'Un precio. *Todo el trámite.*',
      name: 'Canje de coche y moto',
      price: '{canje}',
      priceSmall: 'por licencia',
      notes: ['Tasa oficial de la DGT ({tasa}) incluida.'],
      items: [
        'Llamada de revisión de 20 minutos gratis',
        'Comprobación de que tu licencia es canjeable',
        'Guía para la verificación con tu país',
        'Reserva del informe psicofísico*',
        'Solicitud de canje presentada con tu autorización',
        'Tasa oficial de la DGT',
        'Respuesta a requerimientos de Tráfico',
        'Seguimiento en plataforma',
      ],
      note: '* Gestión incluida. El informe psicofísico lo pagás directamente al centro médico.',
      cta: 'Quiero mi canje',
    },
    cross: {
      eyebrow: 'En pareja',
      title: 'Dos canjes, mejor precio',
      text: 'Si canjean dos licencias de coche y moto a la vez, el segundo trámite sale más barato.',
      was: '{parejaWas}',
      price: '{pareja}',
      pill: 'Ahorrás {parejaSave}',
      cta: 'Somos dos',
      startService: 'pareja',
    },
    faq: [
      { q: '¿Cuándo conviene empezar?', a: 'Cuanto antes. Podés canjear desde que tenés residencia, sin esperar a que pasen los {meses} meses, y la verificación con tu país puede tardar semanas.' },
      { q: '¿Qué tengo que hacer yo?', a: 'Enviarnos tus documentos, firmar la autorización, pedir la verificación con tu Cl@ve si tu país la exige (te guiamos), ir al psicotécnico y, una sola vez, a Tráfico a entregar tu licencia.' },
      { q: '¿La tasa de la DGT está incluida?', a: 'Sí: la tasa 2.3, de {tasa}, está dentro del precio. El informe psicofísico lo pagás directamente al centro médico, que tiene precio libre.' },
      { q: '¿Puedo conducir con el permiso provisional fuera de España?', a: 'No. El provisional es válido {provisional} meses y solo dentro de España. Con el permiso definitivo ya podés conducir en toda la Unión Europea.' },
      { q: '¿Trabajan solo en Madrid?', a: 'La solicitud es online y la entrega se hace en la Jefatura de Tráfico que elijas. Estamos en Madrid, pero podemos gestionar tu canje en toda España.' },
    ],
    final: {
      title: 'Tu próxima ruta, *con todo en regla.*',
      lead: 'Contanos de qué país es tu licencia y desde cuándo vivís en España.',
      cta: 'Quiero mi canje',
      alt: 'Carretera que lleva hacia un pueblo entre montañas',
    },
  },

  /* ═════════════════════ EMPEZAR ═════════════════════ */
  start: {
    seo: {
      title: 'Empezar · Contanos tu caso | {brand}',
      description: 'Contanos de qué país es tu licencia y te respondemos en menos de 24 horas. Canje de licencia de conducir por el permiso español.',
    },
    aside: {
      title: 'Dos minutos. *Y arrancamos.*',
      points: ['Respuesta en menos de 24 h', 'Revisión de tu caso gratis', 'Tus datos, protegidos'],
      alt: 'Conductora al volante con la luz del atardecer',
    },
    progress: 'Paso {n} de {total}',
    back: 'Atrás',
    next: 'Continuar',
    enterHint: 'pulsá Intro ↵',
    submit: 'Enviar',
    sending: 'Enviando…',
    required: 'Este campo es obligatorio.',
    invalidEmail: 'Revisá tu email.',
    invalidPhone: 'Revisá tu número.',
    defaultPrefix: '+34',
    prefixes: ['+34', '+54', '+591', '+55', '+56', '+57', '+506', '+53', '+593', '+503', '+502', '+504', '+52', '+505', '+507', '+595', '+51', '+1', '+598', '+58'],
    steps: [
      {
        type: 'options',
        name: 'service',
        title: '¿Qué necesitás?',
        options: [
          { value: 'coche', label: 'Canje de coche o moto', icon: 'car' },
          { value: 'pro', label: 'Canje de camión o autobús', icon: 'briefcase' },
          { value: 'pareja', label: 'Dos canjes (somos dos)', icon: 'users' },
          { value: 'sinconvenio', label: 'Mi país no tiene convenio', icon: 'route' },
        ],
      },
      {
        type: 'options',
        name: 'residence',
        title: '¿Ya tenés tu residencia en España?',
        options: [
          { value: 'menos6', label: 'Sí, hace menos de 6 meses', icon: 'clock' },
          { value: 'mas6', label: 'Sí, hace más de 6 meses', icon: 'hourglass' },
          { value: 'tramite', label: 'Está en trámite', icon: 'file' },
          { value: 'no', label: 'Todavía no', icon: 'plane' },
        ],
      },
      {
        type: 'options',
        name: 'license',
        title: '¿Tu licencia está en vigor?',
        options: [
          { value: 'vigente', label: 'Sí, está vigente', icon: 'check-doc' },
          { value: 'vencida', label: 'No, está vencida', icon: 'calendar' },
          { value: 'nose', label: 'No estoy seguro', icon: 'search' },
        ],
      },
      {
        type: 'contact',
        title: '¿Cómo te contactamos?',
        name: 'Nombre y apellidos',
        email: 'Email',
        prefix: 'Prefijo',
        phone: 'WhatsApp',
        extra: {
          name: 'country',
          label: 'País que emitió tu licencia',
          placeholder: 'Escribí tu país',
          required: true,
          list: ['Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Costa Rica', 'Cuba', 'Ecuador', 'El Salvador', 'Guatemala', 'Honduras', 'México', 'Nicaragua', 'Panamá', 'Paraguay', 'Perú', 'República Dominicana', 'Uruguay', 'Venezuela', 'Otro'],
        },
      },
      {
        type: 'consent',
        title: 'Un último paso.',
        text: 'Usaremos tus datos solo para responder a tu consulta y preparar tu propuesta. Nunca los compartimos con terceros con fines comerciales.',
        accept: 'He leído y acepto la <a href="{privacyUrl}" target="_blank" rel="noopener">política de privacidad</a>.',
        marketing: 'Quiero recibir avisos útiles sobre mi canje y novedades de convenios (opcional).',
      },
    ],
    done: {
      title: '¡Listo!',
      text: 'Te escribimos en menos de 24 horas.',
      whatsapp: '¿Preferís hablar ya? Escribinos',
      home: 'Volver al inicio',
    },
    error: 'No hemos podido enviarlo. Escribinos por WhatsApp y lo vemos al momento.',
    whatsappPrefill: 'Hola, acabo de rellenar el formulario. Me interesa: {service}.',
  },

  /* ═════════════════════ LEGAL (plantillas) ═════════════════════ */
  legal: {
    note: 'Plantilla orientativa. Revisala con tu asesor legal y completá los datos entre corchetes antes de publicar.',
    legalNotice: {
      seo: { title: 'Aviso legal | {brand}', description: 'Aviso legal e información del titular del sitio web.' },
      title: 'Aviso legal',
      sections: [
        { h: 'Titular del sitio', p: ['En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la Información (LSSI-CE), te informamos de que este sitio web es titularidad de [RAZÓN SOCIAL], con NIF [NIF] y domicilio en [DIRECCIÓN], Madrid. Email de contacto: {email}. [Datos registrales y, en su caso, número de colegiación, si aplica].'] },
        { h: 'Objeto', p: ['Este sitio ofrece información sobre el canje de permisos de conducción extranjeros en España y servicios de gestión de ese trámite. La información tiene carácter general, se basa en fuentes oficiales en la fecha indicada y no sustituye el análisis de cada caso concreto.'] },
        { h: 'Propiedad intelectual', p: ['Los contenidos, marcas, logotipos y diseño del sitio pertenecen a su titular o a terceros que han autorizado su uso. No está permitida su reproducción sin autorización.'] },
        { h: 'Responsabilidad', p: ['No somos la Dirección General de Tráfico ni un organismo público. Preparamos y presentamos el trámite con la autorización de nuestros clientes. La resolución corresponde siempre a la autoridad competente, y los plazos de la Administración y de las autoridades del país emisor no dependen de nosotros.'] },
        { h: 'Legislación aplicable', p: ['Este aviso se rige por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales de Madrid, salvo que la normativa de consumidores disponga otra cosa.'] },
      ],
    },
    privacy: {
      seo: { title: 'Política de privacidad | {brand}', description: 'Cómo tratamos tus datos personales conforme al RGPD y la LOPDGDD.' },
      title: 'Política de privacidad',
      sections: [
        { h: 'Responsable', p: ['[RAZÓN SOCIAL], NIF [NIF], [DIRECCIÓN], Madrid. Contacto: {email}.'] },
        { h: 'Qué datos tratamos y para qué', p: ['Los datos que nos facilitás en formularios, WhatsApp o email (identificativos, de contacto, de tu residencia y de tu permiso de conducción) para responder a tu consulta, preparar tu propuesta y, si contratás, prestar el servicio.'] },
        { h: 'Base legal', p: ['Tu consentimiento al enviar el formulario, la ejecución del contrato cuando contratás y el cumplimiento de obligaciones legales.'] },
        { h: 'Conservación', p: ['Mientras dure la relación y, después, durante los plazos legales de prescripción. Las consultas que no se convierten en clientes se eliminan a los [12] meses.'] },
        { h: 'Destinatarios', p: ['La Administración competente para tramitar tu solicitud y proveedores que nos prestan servicios (alojamiento web, plataforma de seguimiento, firma digital, centro de reconocimiento de conductores cuando reservamos tu cita), con contratos de encargo de tratamiento cuando corresponde. No cedemos tus datos con fines comerciales.'] },
        { h: 'Tus derechos', p: ['Podés ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a {email}. También podés reclamar ante la Agencia Española de Protección de Datos (www.aepd.es).'] },
      ],
    },
    cookies: {
      seo: { title: 'Política de cookies | {brand}', description: 'Qué cookies usamos y cómo podés configurarlas.' },
      title: 'Política de cookies',
      sections: [
        { h: 'Qué son', p: ['Las cookies son pequeños archivos que se guardan en tu navegador para que la web funcione o para obtener información sobre su uso.'] },
        { h: 'Cuáles usamos', p: ['Técnicas (necesarias): guardan tus preferencias de cookies y el avance de tu checklist. No requieren consentimiento.', 'Analíticas (opcionales): solo si las aceptás. [Google Analytics 4, si se activa]. Nos ayudan a medir visitas de forma agregada.'] },
        { h: 'Cómo gestionarlas', p: ['Podés cambiar tu elección en cualquier momento desde “Configurar cookies”, en el pie de página, o borrarlas desde la configuración de tu navegador.'] },
      ],
    },
  },
};
