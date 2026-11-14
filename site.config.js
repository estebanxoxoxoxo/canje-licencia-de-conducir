/**
 * ─────────────────────────────────────────────────────────────
 *  CONFIGURACIÓN GLOBAL DEL SITIO
 *  Todo lo que cambia a menudo vive aquí: marca, precios, importes
 *  oficiales, contacto, enlaces y fotos. Después de editar: `npm run build`.
 *  Los textos están en /content/es.js
 * ─────────────────────────────────────────────────────────────
 */

// Precios del servicio (euros). El ahorro de la pareja se calcula solo.
const canje = 199; // [PRECIO] Canje coche y moto (A y B), tasa DGT incluida — placeholder
const pro = 349; // [PRECIO] Canje camión y autobús (C y D), tasa de examen incluida — placeholder
const pareja = 349; // [PRECIO] Dos canjes de coche y moto contratados juntos — placeholder

module.exports = {
  // [NOMBRE DE LA MARCA] — nombre provisional, cámbialo aquí
  brand: {
    name: 'Al Volante',
    tagline: 'Canje de licencia de conducir en España',
    // Dibujo interior del isotipo (cuadrado 32×32). {accent} = color de acento. También genera el favicon.
    mark: '<circle cx="16" cy="16" r="8.4" fill="none" stroke="{accent}" stroke-width="2.4"/><circle cx="16" cy="16" r="2.1" fill="#FAF7F2"/><path d="M8.2 14.5l5.8 1M23.8 14.5l-5.8 1M16 18.1v6.1" fill="none" stroke="#FAF7F2" stroke-width="2" stroke-linecap="round"/>',
  },

  // Dominio final (para canonical, sitemap y Open Graph). Sin barra final.
  siteUrl: 'https://www.tudominio.es',

  // [COLOR DE MARCA] — el resto de la paleta está en assets/css/styles.css (:root)
  colors: {
    primary: '#1B2A4A',
    accent: '#D9824B',
  },

  prices: {
    canje,
    pro,
    pareja,
    parejaWas: canje * 2,
    parejaSave: canje * 2 - pareja,
  },

  /**
   * IMPORTES OFICIALES. Revísalos antes de publicar y una vez al año.
   * Fuente y fecha de comprobación de cada uno: ver FUENTES.md
   */
  amounts: {
    tasa: 28.87, // Tasa 2.3 DGT: canje sin pruebas (sede.dgt.gob.es, comprobado 14/11/2026)
    tasaPro: 94.05, // Tasa 2.1 DGT: canje con pruebas, dos convocatorias
    multa: 200, // Infracción grave: Ley de Tráfico, arts. 76.ll y 80.1
    multaNo: 500, // Permiso no canjeable pasados los 6 meses (codificado de sanciones)
  },

  // Datos sueltos que se repiten en los textos: {paises} {meses} {psico} {provisional}
  facts: {
    paises: 16, // Países de Latinoamérica con convenio de canje (lista DGT 26/06/2026)
    meses: 6, // Meses de validez de la licencia extranjera desde la residencia (RGC art. 21)
    psico: 90, // Días de validez del informe psicofísico
    provisional: 6, // Meses de validez del permiso provisional
  },

  contact: {
    whatsapp: '34600000000', // [NÚMERO] solo dígitos con prefijo, sin + ni espacios
    whatsappDisplay: '+34 600 000 000',
    email: 'hola@tudominio.es',
    city: 'Madrid, España',
    locality: 'Madrid',
    areaServed: 'ES',
  },

  // [URL PLATAFORMA] de seguimiento "Mi expediente"
  platformUrl: 'https://app.tudominio.es',

  social: {
    instagram: 'https://instagram.com/tumarca',
    tiktok: 'https://tiktok.com/@tumarca',
  },

  // Endpoint para recibir formularios (p. ej. Formspree, Make, Zapier, tu backend).
  // Se envía un POST con JSON. Si lo dejas vacío, el formulario muestra la pantalla
  // final y ofrece continuar por WhatsApp, pero NO guarda los datos en ningún sitio.
  formEndpoint: '',

  // ID de Google Analytics 4 (G-XXXX). Solo se carga si el usuario acepta cookies analíticas.
  analyticsId: '',

  /**
   * Fotos. Valor = ID de Unsplash (parte tras "photo-") o una ruta local (/assets/img/foto.jpg).
   * Recomendado: sustituirlas por fotos propias o con licencia antes de lanzar.
   */
  images: {
    homeHero: '1557998751-7e1d753f6676', // Cibeles y Gran Vía con tráfico
    homeFeature: '1642963167385-8232ffcf1ba4', // Mano al volante, luz cálida
    mainHero: '1557598628-bdd7d0767917', // Mujer mostrando las llaves del coche
    finalCta: '1642103113559-e37ac1e1607a', // Carretera hacia un pueblo
    contact: '1534708112740-cb40ecb0663e', // Conductora al atardecer
    cardCoche: '1794208709907-d34f3540d076', // Conductora sonriente
    cardPro: '1585583416718-5bea75d5312a', // Conductor de autobús al volante
    cardSin: '1702206244130-c29bcefe6aa9', // Carretera de curvas
    heroCoche: '1624142687649-83eddefe420b', // Coche en carretera de montaña
    heroPro: '1695222833131-54ee679ae8e5', // Camión en marcha entre campos
    heroSin: '1626037550427-567d68330cff', // Carretera al anochecer
    stepReview: '1747115084263-afbe6739b7ba', // Pasaporte y papeles
    stepVerify: '1570610183363-c7531f3eaa68', // Sobres de correo aéreo
    stepMedical: '1766310549795-dd0fc75d499f', // Revisión de la vista
    stepApply: '1628645339131-0c39c7527856', // Mujer con portátil
    stepOffice: '1625415111994-c5cde8763159', // Puerta de Alcalá
    stepMail: '1559057287-ce0f595679a8', // Cartas
  },
};
