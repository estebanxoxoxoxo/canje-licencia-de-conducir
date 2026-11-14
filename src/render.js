const { icon } = require('./icons');

/* ───────────────────────── Utilidades ───────────────────────── */
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const rich = (s) => String(s).replace(/\*(.+?)\*/g, '<em>$1</em>');
const pad2 = (n) => String(n).padStart(2, '0');

/* Rutas: salen de los textos (content/es.js), no hay que tocarlas aquí. */
function buildRoutes(c) {
  const r = { home: '/', main: c.main.slug };
  for (const s of c.services) r[s.key] = s.slug;
  return Object.assign(r, { start: '/empezar/', legalNotice: '/aviso-legal/', privacy: '/privacidad/', cookies: '/cookies/' });
}

function makeMoney(locale) {
  return (n) => {
    const d = Number.isInteger(n) ? 0 : 2;
    return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', minimumFractionDigits: d, maximumFractionDigits: d, useGrouping: 'always' })
      .format(n)
      .replace(/[\u202f\u00a0 ]/g, '\u00a0');
  };
}

// Sustituye {variables} en todos los textos del contenido, en profundidad.
function deepMap(v, fn) {
  if (typeof v === 'string') return fn(v);
  if (Array.isArray(v)) return v.map((x) => deepMap(x, fn));
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, deepMap(x, fn)]));
  return v;
}

function createCtx(cfg, content) {
  const money = makeMoney('es-ES');
  const routes = buildRoutes(content);
  const vars = { brand: cfg.brand.name, email: cfg.contact.email, city: cfg.contact.locality, privacyUrl: routes.privacy };
  for (const [k, v] of Object.entries({ ...cfg.prices, ...(cfg.amounts || {}) })) vars[k] = money(v);
  for (const [k, v] of Object.entries(cfg.facts || {})) vars[k] = String(v);
  const t = (s) => String(s ?? '').replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
  const c = deepMap(content, t);
  const url = (page, hash = '') => routes[page] + hash;
  return { cfg, c, t, url, money, routes, lang: c.lang };
}

function imgSrc(cfg, key, w) {
  const v = cfg.images[key] || key;
  if (v.startsWith('/') || v.startsWith('http')) return v;
  return `https://images.unsplash.com/photo-${v}?auto=format&fit=crop&w=${w}&q=72`;
}

function img(ctx, key, alt, { sizes = '100vw', cls = '', eager = false, widths = [480, 800, 1200, 1600, 2200], ratio } = {}) {
  const v = ctx.cfg.images[key] || key;
  const local = v.startsWith('/') || v.startsWith('http');
  const srcset = local ? '' : ` srcset="${widths.map((w) => `${imgSrc(ctx.cfg, key, w)} ${w}w`).join(', ')}" sizes="${sizes}"`;
  const dims = ratio ? ` width="${ratio[0]}" height="${ratio[1]}"` : ' width="1600" height="1067"';
  return `<img class="${cls}" src="${imgSrc(ctx.cfg, key, 1200)}"${srcset} alt="${esc(alt)}"${dims} ${eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'}>`;
}

const waLink = (ctx, msg) => `https://wa.me/${ctx.cfg.contact.whatsapp}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`;
const eyebrow = (text, cls = '') => `<p class="eyebrow ${cls}">${text}</p>`;
const service = (ctx, key) => ctx.c.services.find((s) => s.key === key);

// Isotipo: el dibujo interior viene de site.config.js (brand.mark) y se reutiliza en el favicon.
function markSvg(cfg, size = 32, vars = true) {
  const p = vars ? 'var(--primary)' : cfg.colors.primary;
  const inner = vars ? cfg.brand.mark.replace(/\{accent\}/g, 'var(--accent)') : cfg.brand.mark.replace(/\{accent\}/g, cfg.colors.accent);
  return `<svg class="logo-mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${size}" height="${size}" aria-hidden="true"><rect width="32" height="32" rx="9" fill="${p}"/>${inner}</svg>`;
}
const logo = (ctx) => `${markSvg(ctx.cfg)}<span class="logo-word">${esc(ctx.cfg.brand.name)}</span>`;
const favicon = (cfg) => markSvg(cfg, 32, false).replace(' class="logo-mark"', '').replace(' aria-hidden="true"', '');

/* ───────────────────────── Layout ───────────────────────── */
function layout(ctx, { page, seo, body, header = 'overlay', schema = [], ogKey = 'homeHero' }) {
  const { cfg, c, routes } = ctx;
  const canonical = cfg.siteUrl + routes[page];

  const org = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: cfg.brand.name,
    url: cfg.siteUrl,
    email: cfg.contact.email,
    telephone: '+' + cfg.contact.whatsapp,
    areaServed: cfg.contact.areaServed || 'ES',
    address: { '@type': 'PostalAddress', addressLocality: cfg.contact.locality, addressCountry: 'ES' },
    sameAs: Object.values(cfg.social || {}).filter(Boolean),
  };

  const siteJs = { lang: c.lang, wa: cfg.contact.whatsapp, formEndpoint: cfg.formEndpoint, analyticsId: cfg.analyticsId, locale: 'es-ES', amounts: cfg.amounts || {} };

  return `<!doctype html>
<html lang="${c.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(seo.title)}</title>
<meta name="description" content="${esc(seo.description)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(cfg.brand.name)}">
<meta property="og:title" content="${esc(seo.title)}">
<meta property="og:description" content="${esc(seo.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${imgSrc(cfg, ogKey, 1200)}">
<meta property="og:locale" content="${c.locale}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#FAF7F2">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/assets/fonts/fraunces.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preconnect" href="https://images.unsplash.com">
<link rel="stylesheet" href="/assets/css/styles.css">
<style>:root{--primary:${cfg.colors.primary};--accent:${cfg.colors.accent}}</style>
<script>document.documentElement.classList.add('js');window.SITE=${JSON.stringify(siteJs)};</script>
${[org, ...schema].map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n')}
<script src="/assets/js/main.js" defer></script>
</head>
<body data-page="${page}" data-header="${header}">
<a class="skip" href="#main">${c.ui.skip}</a>
${siteHeader(ctx, page)}
<main id="main">
${body}
</main>
${footer(ctx)}
${waFab(ctx)}
${body.includes('data-popup-open') ? popup(ctx) : ''}
${cookieBanner(ctx)}
</body>
</html>`;
}

function siteHeader(ctx, page) {
  const { c, cfg, url } = ctx;
  const n = c.ui.nav;
  const dropItems = c.services
    .map(
      (s) => `<a class="drop-item" href="${url(s.key)}">
      <span class="drop-icon">${icon(s.icon)}</span>
      <span><span class="drop-title">${s.name}</span><span class="drop-line">${s.line}</span></span></a>`
    )
    .join('');

  const mobileLinks = [
    `<a href="${url('main')}"><span>${n.main}</span></a>`,
    ...c.services.map((s) => `<a href="${url(s.key)}"><span>${s.name}</span></a>`),
    `<a href="${url('home', '#como-funciona')}"><span>${n.how}</span></a>`,
    `<a href="${cfg.platformUrl}" rel="noopener"><span>${n.file}</span>${icon('arrow-up-right')}</a>`,
  ].join('');

  return `<header class="site-header" data-site-header>
  <div class="container header-inner">
    <a class="logo" href="${url('home')}" aria-label="${esc(cfg.brand.name)} · ${n.home}">${logo(ctx)}</a>
    <nav class="nav" aria-label="Principal">
      <ul class="nav-list">
        <li><a class="nav-link${page === 'main' ? ' is-current' : ''}" href="${url('main')}">${n.main}</a></li>
        <li class="has-drop">
          <button class="nav-link" type="button" aria-expanded="false" aria-controls="drop-res" data-drop>${n.services}${icon('chevron', 'chev')}</button>
          <div class="dropdown" id="drop-res">${dropItems}</div>
        </li>
        <li><a class="nav-link" href="${url('home', '#como-funciona')}">${n.how}</a></li>
      </ul>
    </nav>
    <div class="header-actions">
      <a class="file-link" href="${cfg.platformUrl}" rel="noopener">${icon('lock')}<span>${n.file}</span></a>
      <a class="btn btn-accent btn-sm header-cta" href="${url('start')}">${n.start}</a>
      <button class="burger" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="${n.menu}" data-label-open="${n.menu}" data-label-close="${n.close}" data-burger><span></span><span></span></button>
    </div>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu" data-mobile-menu hidden>
  <div class="container">
    <nav class="mobile-links" aria-label="Menú">${mobileLinks}</nav>
    <div class="mobile-foot">
      <a class="btn btn-accent btn-lg btn-block" href="${url('start')}">${n.start}${icon('arrow')}</a>
    </div>
  </div>
</div>`;
}

function footer(ctx) {
  const { c, cfg, url } = ctx;
  const f = c.ui.footer;
  const year = new Date().getFullYear();
  const soc = cfg.social || {};
  return `<footer class="site-footer">
  <div class="container">
    <div class="footer-top">
      <div class="footer-brand">
        <a class="logo logo-light" href="${url('home')}">${logo(ctx)}</a>
        <p>${f.blurb}</p>
        <div class="socials">
          ${soc.instagram ? `<a href="${soc.instagram}" rel="noopener" aria-label="Instagram">${icon('instagram')}</a>` : ''}
          ${soc.tiktok ? `<a href="${soc.tiktok}" rel="noopener" aria-label="TikTok">${icon('tiktok')}</a>` : ''}
          <a href="${waLink(ctx, c.ui.whatsappMsg)}" rel="noopener" aria-label="WhatsApp">${icon('whatsapp')}</a>
        </div>
      </div>
      <div class="footer-col">
        <p class="footer-h">${f.services}</p>
        <ul>
          <li><a href="${url('main')}">${c.main.name}</a></li>
          ${c.services.map((s) => `<li><a href="${url(s.key)}">${s.name}</a></li>`).join('')}
        </ul>
      </div>
      <div class="footer-col">
        <p class="footer-h">${f.company}</p>
        <ul>
          <li><a href="${waLink(ctx, c.ui.whatsappMsg)}" rel="noopener">${cfg.contact.whatsappDisplay}</a></li>
          <li><a href="mailto:${cfg.contact.email}">${cfg.contact.email}</a></li>
          <li>${cfg.contact.city}</li>
          <li><a href="${cfg.platformUrl}" rel="noopener">${c.ui.nav.file}</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <p class="footer-h">${f.legal}</p>
        <ul>
          <li><a href="${url('legalNotice')}">${f.legalNotice}</a></li>
          <li><a href="${url('privacy')}">${f.privacy}</a></li>
          <li><a href="${url('cookies')}">${f.cookies}</a></li>
          <li><button type="button" class="linklike" data-cookie-settings>${f.cookieSettings}</button></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© ${year} ${esc(cfg.brand.name)}. ${f.rights}</p>
      <p class="footer-disclaimer">${f.disclaimer}</p>
    </div>
  </div>
</footer>`;
}

function waFab(ctx) {
  return `<a class="wa-fab" href="${waLink(ctx, ctx.c.ui.whatsappMsg)}" target="_blank" rel="noopener" aria-label="${ctx.c.ui.whatsapp}">${icon('whatsapp')}<span class="wa-tip">${ctx.c.ui.whatsapp}</span></a>`;
}

function cookieBanner(ctx) {
  const k = ctx.c.ui.cookies;
  return `<div class="cookie" data-cookie role="dialog" aria-modal="false" aria-labelledby="cookie-title" hidden>
  <div class="cookie-main">
    <p class="cookie-title" id="cookie-title">${k.title}</p>
    <p class="cookie-text">${k.text} <a href="${ctx.url('cookies')}">${k.more}</a></p>
    <div class="cookie-prefs" data-cookie-prefs hidden>
      <label class="switch-row"><span><strong>${k.necessary}</strong><small>${k.necessaryText}</small></span><input type="checkbox" checked disabled><span class="switch" aria-hidden="true"></span></label>
      <label class="switch-row"><span><strong>${k.analytics}</strong><small>${k.analyticsText}</small></span><input type="checkbox" data-cookie-analytics><span class="switch" aria-hidden="true"></span></label>
    </div>
  </div>
  <div class="cookie-actions">
    <button class="btn btn-ghost btn-sm" type="button" data-cookie-configure>${k.configure}</button>
    <button class="btn btn-ghost btn-sm" type="button" data-cookie-save hidden>${k.save}</button>
    <button class="btn btn-ghost btn-sm" type="button" data-cookie-reject>${k.reject}</button>
    <button class="btn btn-dark btn-sm" type="button" data-cookie-accept>${k.accept}</button>
  </div>
</div>`;
}

/* ───────────────────────── Popup de consulta (opcional) ─────────────────────────
   Si content.popup existe, se pinta un <dialog> con una lista agrupada y un buscador.
   Cada fila lleva solo las líneas que tenga: no hay un número fijo de opciones.
   Lo abre cualquier botón con [data-popup-open] (ver popupBtn). */
const plain = (s) => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const popupBtn = (ctx, label) =>
  ctx.c.popup && label ? `<button type="button" class="btn btn-ghost btn-sm popup-open" data-popup-open aria-haspopup="dialog">${icon(ctx.c.popup.icon || 'search')}${label}</button>` : '';

function popup(ctx) {
  const p = ctx.c.popup;
  if (!p) return '';
  const row = (it) => `<li class="popup-row" data-popup-row data-name="${esc(plain(`${it.name} ${it.alias || ''}`))}">
          <p class="popup-name">${it.name}</p>
          <ul class="popup-lines">
            ${it.lines.map((l) => `<li><span>${l.label}</span><strong${l.ok ? ' class="ok"' : ''}>${l.text}</strong></li>`).join('')}
          </ul>
        </li>`;
  return `<dialog class="popup" data-popup aria-labelledby="popup-title">
  <div class="popup-head">
    <div>
      ${p.eyebrow ? eyebrow(p.eyebrow) : ''}
      <h2 class="display-m" id="popup-title">${rich(p.title)}</h2>
      ${p.lead ? `<p class="popup-lead">${p.lead}</p>` : ''}
    </div>
    <button type="button" class="round-btn popup-close" data-popup-close aria-label="${esc(p.close)}">${icon('x')}</button>
  </div>
  <div class="field popup-search">
    <label class="vh" for="popup-q">${p.searchLabel}</label>
    <input id="popup-q" type="search" placeholder="${esc(p.searchPlaceholder)}" autocomplete="off" data-popup-q>
  </div>
  <div class="popup-body" tabindex="-1">
    ${p.groups
      .map(
        (g) => `<section class="popup-group" data-popup-group>
      <h3 class="popup-group-label">${g.label}<span>${g.items.length}</span></h3>
      <ul class="popup-list">
        ${g.items.map(row).join('\n        ')}
      </ul>
    </section>`
      )
      .join('\n    ')}
    <p class="popup-empty" data-popup-empty hidden>${p.empty}</p>
  </div>
  <div class="popup-foot">
    ${p.foot ? `<p class="footnote">${p.foot}</p>` : ''}
    ${p.cta ? `<a class="btn btn-accent" href="${ctx.url('start')}">${p.cta}${icon('arrow')}</a>` : ''}
  </div>
</dialog>`;
}

/* ───────────────────────── Componentes ───────────────────────── */
function sectionHead({ eb, title, lead, center = false, light = false, extra = '' }) {
  return `<div class="section-head${center ? ' center' : ''}" data-reveal>
    ${eb ? eyebrow(eb, light ? 'eyebrow-light' : '') : ''}
    <h2 class="display-l">${rich(title)}</h2>
    ${lead ? `<p class="lead">${lead}</p>` : ''}
    ${extra}
  </div>`;
}

// La FAQ admite dos formatos: array plano de {q,a} o array de grupos {label, items:[{q,a}]}.
const isGroupedFaq = (items) => Array.isArray(items) && items.length > 0 && Array.isArray(items[0].items);

function faqAccordion(items, ns = '') {
  return `<div class="accordion" data-reveal>
      ${items
        .map(
          (it, i) => `<div class="acc-item">
        <h3><button class="acc-btn" type="button" aria-expanded="false" aria-controls="faq-${ns}${i}" id="faq-b-${ns}${i}">${it.q}<span class="acc-plus" aria-hidden="true"></span></button></h3>
        <div class="acc-panel" id="faq-${ns}${i}" role="region" aria-labelledby="faq-b-${ns}${i}"><div><p>${it.a}</p></div></div>
      </div>`
        )
        .join('')}
    </div>`;
}

function faqBlock(ctx, items, { title } = {}) {
  const inner = isGroupedFaq(items)
    ? `<div class="faq-groups">
    ${items.map((grp, g) => `<h3 class="faq-group-label" data-reveal>${grp.label}</h3>\n    ${faqAccordion(grp.items, `${g}-`)}`).join('\n    ')}
    </div>`
    : faqAccordion(items);
  return `<section class="section faq" aria-labelledby="faq-title">
  <div class="container narrow">
    <div class="section-head center" data-reveal><h2 class="display-l" id="faq-title">${title || ctx.c.ui.faqTitle}</h2></div>
    ${inner}
  </div>
</section>`;
}

const stripTags = (s) => String(s).replace(/<[^>]+>/g, '');

function faqSchema(items) {
  const flat = isGroupedFaq(items) ? items.flatMap((grp) => grp.items) : items;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: flat.map((it) => ({ '@type': 'Question', name: stripTags(it.q), acceptedAnswer: { '@type': 'Answer', text: stripTags(it.a) } })),
  };
}

function serviceSchema(ctx, name, price, page, description) {
  const s = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: { '@type': 'ProfessionalService', name: ctx.cfg.brand.name },
    areaServed: ctx.cfg.contact.areaServed || 'ES',
    url: ctx.cfg.siteUrl + ctx.routes[page],
  };
  if (typeof price === 'number') s.offers = { '@type': 'Offer', price: String(price), priceCurrency: 'EUR' };
  return s;
}

function statement(line1, line2) {
  return `<section class="statement">
  <div class="container">
    <p class="statement-text"><span data-reveal>${line1}</span> <span class="accent-text" data-reveal style="--d:.15s">${line2}</span></p>
  </div>
</section>`;
}

function phoneMockup(ctx) {
  const L = ctx.c.phone;
  return `<div class="phone-wrap" aria-hidden="true">
  <div class="phone">
    <div class="phone-notch"></div>
    <div class="phone-screen">
      <div class="ph-status"><span>9:41</span><span class="ph-dots"><i></i><i></i><i></i></span></div>
      <div class="ph-top"><span class="ph-brand">${logo(ctx)}</span><span class="ph-avatar">${L.initial}</span></div>
      <p class="ph-hi">${L.hi}</p>
      <div class="ph-card">
        <div class="ph-card-top"><span class="ph-pill">${L.status}</span><span class="ph-num">${L.file}</span></div>
        <p class="ph-service">${L.service}</p>
        <div class="ph-bar"><span data-bar style="--w:${L.progress}%"></span></div>
      </div>
      <ol class="ph-steps">
        ${L.steps.map((s) => `<li class="is-${s.state}"><span class="ph-dot">${s.state === 'done' ? icon('check') : ''}</span><span class="ph-step">${s.label}</span><span class="ph-when">${s.when}</span></li>`).join('')}
      </ol>
      <div class="ph-msg"><span class="ph-msg-av">${L.managerInitial}</span><div><strong>${L.manager}</strong><p>${L.msg}</p></div></div>
    </div>
  </div>
  <div class="ph-toast"><span class="ph-toast-icon">${icon('bell')}</span><div><strong>${esc(ctx.cfg.brand.name)}</strong><p>${L.toast}</p></div><small>${L.now}</small></div>
</div>`;
}

function shortForm(ctx, svc) {
  const s = ctx.c.ui.shortForm;
  const id = `sf-${svc}`;
  return `<form class="short-form" data-short-form data-service="${svc}" novalidate>
  <div class="field"><label for="${id}-name">${s.name}</label><input id="${id}-name" name="name" autocomplete="name" required></div>
  <div class="field-row">
    <div class="field"><label for="${id}-email">${s.email}</label><input id="${id}-email" name="email" type="email" autocomplete="email" required></div>
    <div class="field"><label for="${id}-phone">${s.phone}</label><input id="${id}-phone" name="phone" type="tel" autocomplete="tel" placeholder="${s.phonePlaceholder}" required></div>
  </div>
  <div class="field"><label for="${id}-msg">${s.message}</label><textarea id="${id}-msg" name="message" rows="3"></textarea></div>
  <label class="check"><input type="checkbox" name="privacy" required><span class="check-box">${icon('check')}</span><span>${s.privacy}</span></label>
  <button class="btn btn-accent btn-lg btn-block" type="submit" data-sending="${s.sending}">${s.submit}${icon('arrow')}</button>
  <p class="form-status" role="status" aria-live="polite" data-ok="${esc(s.ok)}" data-error="${esc(s.error)}"></p>
</form>`;
}

function finalCta(ctx, { title, lead, cta, href, imgKey, alt }) {
  return `<section class="final-cta">
  <div class="final-bg">${img(ctx, imgKey, alt, { sizes: '100vw' })}</div>
  <div class="container final-inner">
    <h2 class="display-xxl" data-reveal>${rich(title)}</h2>
    ${lead ? `<p class="lead lead-light" data-reveal style="--d:.1s">${lead}</p>` : ''}
    <a class="btn btn-accent btn-xl" href="${href}" data-reveal style="--d:.2s">${cta}${icon('arrow')}</a>
  </div>
</section>`;
}

// Bloque de precio del hero: precio grande + notas.
function heroPrice(price, notes = [], footnote, delay = '.24s') {
  return `<div class="hero-price hero-in" style="--d:${delay}">
      <p class="price-xl"><span>${price}</span></p>
      ${notes.map((n) => `<p class="price-note">${n}</p>`).join('')}
      ${footnote ? `<p class="price-footnote">${footnote}</p>` : ''}
    </div>`;
}

/* ───────────────────────── Herramientas (calculadoras) ─────────────────────────
   Todas comparten el mismo marco visual: panel claro con el dato clave + panel oscuro interactivo. */
function toolInfo(ctx, tool) {
  return `<div class="means-info">
        <p class="means-big">${tool.big}</p>
        <p class="means-label">${tool.bigLabel}</p>
        <p class="means-text">${tool.text}</p>
        ${popupBtn(ctx, tool.popup)}
        ${tool.chip ? `<p class="means-iprem"><span>${tool.chip.label}</span><strong>${tool.chip.value}</strong></p>` : ''}
      </div>`;
}

function toolBlock(ctx, tool, key) {
  const { cfg, money } = ctx;
  let panel = '';
  if (tool.type === 'means') {
    const base = cfg.amounts[tool.base];
    panel = `<div class="calc" data-calc data-base="${base}" data-first="${tool.first}" data-second="${tool.second}" data-others="${tool.others}">
        <p class="calc-title">${icon('coins')}${tool.calcTitle}</p>
        <p class="calc-label" id="calc-l-${key}">${tool.calcLabel}<small>${tool.calcHint}</small></p>
        <div class="stepper stepper-lg" role="group" aria-labelledby="calc-l-${key}">
          <button type="button" class="round-btn" data-step="-1" aria-label="−1">${icon('minus')}</button>
          <output data-calc-n aria-live="polite">1</output>
          <button type="button" class="round-btn" data-step="1" aria-label="+1">${icon('plus')}</button>
        </div>
        <p class="calc-result"><span data-calc-out>${money((base * tool.first) / 100)}</span><small>${tool.calcResult}</small></p>
        <p class="calc-year" data-calc-year data-tpl="${esc(tool.calcYear)}"></p>
        <p class="calc-disc">${tool.calcDisclaimer}</p>
      </div>`;
  } else if (tool.type === 'lookup') {
    // Selector → resultado (p. ej. país → ¿hay convenio?, grado → cuantía máxima)
    panel = `<div class="calc" data-lookup>
        <p class="calc-title">${icon(tool.icon || 'sparkle')}${tool.calcTitle}</p>
        <div class="field calc-field"><label for="lk-${key}">${tool.calcLabel}</label>
          <select id="lk-${key}" data-lookup-select>
            <option value="">${tool.placeholder}</option>
            ${tool.options.map((o, i) => `<option value="${i}">${o.label}</option>`).join('')}
          </select></div>
        <div class="calc-result lookup-result" data-lookup-out aria-live="polite">
          <span data-lookup-big>${tool.emptyBig}</span><small data-lookup-small>${tool.emptySmall}</small>
        </div>
        <script type="application/json" data-lookup-data>${JSON.stringify(tool.options.map((o) => ({ big: o.big, small: o.small, tone: o.tone || '' }))).replace(/</g, '\\u003c')}</script>
        <p class="calc-disc">${tool.calcDisclaimer}</p>
      </div>`;
  } else if (tool.type === 'sum') {
    // Campos numéricos → resultado según fórmula declarada en data-formula (ver main.js)
    panel = `<div class="calc" data-sum data-formula="${tool.formula}">
        <p class="calc-title">${icon(tool.icon || 'coins')}${tool.calcTitle}</p>
        <div class="calc-inputs">
          ${tool.inputs
            .map(
              (f) => `<div class="field calc-field"><label for="sm-${key}-${f.name}">${f.label}</label>
            <input id="sm-${key}-${f.name}" type="number" inputmode="numeric" min="0" step="${f.step || 1}" value="${f.value}" data-sum-input="${f.name}"></div>`
            )
            .join('')}
        </div>
        <p class="calc-result"><span data-sum-out></span><small>${tool.calcResult}</small></p>
        <p class="calc-year" data-sum-extra data-tpl="${esc(tool.calcExtra || '')}"></p>
        <p class="calc-disc">${tool.calcDisclaimer}</p>
      </div>`;
  }
  return `<section class="section">
  <div class="container">
    ${sectionHead({ title: tool.title, lead: tool.lead })}
    <div class="means" data-reveal>
      ${toolInfo(ctx, tool)}
      ${panel}
    </div>
  </div>
</section>`;
}

/* ───────────────────────── HOME ───────────────────────── */
function home(ctx) {
  const { c, cfg, url } = ctx;
  const h = c.home;

  const hero = `<section class="hero hero-full">
  <div class="hero-media">${img(ctx, 'homeHero', h.hero.alt, { eager: true })}</div>
  <div class="container hero-inner">
    ${eyebrow(h.hero.eyebrow, 'eyebrow-light hero-in')}
    <h1 class="display-xxl hero-in" style="--d:.08s">${rich(h.hero.title)}</h1>
    <p class="lead lead-light hero-in" style="--d:.16s">${h.hero.lead}</p>
    <div class="btn-row hero-in" style="--d:.24s">
      <a class="btn btn-accent btn-xl" href="${url('start')}">${h.hero.cta}${icon('arrow')}</a>
      <a class="btn btn-glass btn-xl" href="#servicios">${h.hero.cta2}</a>
    </div>
  </div>
  <a class="scroll-cue" href="#servicios" aria-label="${h.hero.cta2}"><span></span></a>
</section>`;

  const f = h.feature;
  const feature = `<section class="pack-hero" id="servicios">
  <div class="pack-hero-media">${img(ctx, 'homeFeature', f.alt, { sizes: '(min-width: 1000px) 50vw, 100vw' })}</div>
  <div class="pack-hero-body">
    ${eyebrow(f.eyebrow, 'eyebrow-light')}
    <h2 class="display-l" data-reveal>${rich(f.title)}</h2>
    <p class="price-xl" data-reveal><span>${f.price}</span></p>
    <p class="lead lead-light" data-reveal>${f.lead}</p>
    ${f.priceFootnote ? `<p class="price-footnote" data-reveal>${f.priceFootnote}</p>` : ''}
    <p class="free-call" data-reveal>${icon('calendar')}${c.ui.freeCall}</p>
    <ul class="icon-grid" data-reveal>
      ${f.items.map((it) => `<li>${icon(it.icon)}<span>${it.label}</span></li>`).join('')}
    </ul>
    ${f.note ? `<p class="footnote" data-reveal>${f.note}</p>` : ''}
    <a class="btn btn-accent btn-lg" href="${url('main')}" data-reveal>${f.cta}${icon('arrow')}</a>
  </div>
</section>`;

  const cards = c.services
    .map(
      (s, i) => `<a class="res-card" href="${url(s.key)}" data-reveal style="--d:${i * 0.1}s">
      <div class="res-media">${img(ctx, s.cardImg, s.cardAlt, { sizes: '(min-width: 1000px) 33vw, 90vw', widths: [480, 800, 1200] })}</div>
      <div class="res-body">
        <span class="pill pill-glass">${icon(s.icon)}${s.pill}</span>
        <h3 class="res-title">${s.name}</h3>
        <p>${s.line}</p>
        <p class="res-free">${icon('calendar')}${c.ui.freeCall}</p>
        <span class="res-more">${c.ui.seeMore}${icon('arrow')}</span>
      </div>
    </a>`
    )
    .join('');

  const cardsSection = `<section class="section" id="caminos">
  <div class="container">
    ${sectionHead({ eb: h.cards.eyebrow, title: h.cards.title, lead: h.cards.lead, extra: popupBtn(ctx, h.cards.popup) })}
    <div class="res-grid">${cards}</div>
  </div>
</section>`;

  const how = `<section class="section section-tint" id="como-funciona">
  <div class="container">
    ${sectionHead({ eb: h.how.eyebrow, title: h.how.title, lead: h.how.lead })}
    <ol class="steps">
      ${h.how.steps.map((s, i) => `<li class="step" data-reveal style="--d:${i * 0.1}s"><span class="step-num">${pad2(i + 1)}</span><h3>${s.title}</h3><p>${s.text}</p></li>`).join('')}
    </ol>
  </div>
</section>`;

  const stats = `<section class="section">
  <div class="container">
    ${sectionHead({ eb: h.stats.eyebrow, title: h.stats.title, center: true })}
    <div class="stats">
      ${h.stats.items
        .map(
          (s, i) => `<div class="stat" data-reveal style="--d:${i * 0.08}s">
          <p class="stat-num"><span data-count="${s.value}" data-from="${s.from ?? 0}" data-prefix="${esc(s.prefix || '')}" data-suffix="${esc(s.suffix || '')}">${s.prefix || ''}${s.value}${s.suffix || ''}</span></p>
          <p class="stat-label">${s.label}</p>
          ${s.text ? `<p class="stat-text">${s.text}</p>` : ''}
        </div>`
        )
        .join('')}
    </div>
    ${h.stats.source ? `<p class="footnote footnote-center" data-reveal>${h.stats.source}</p>` : ''}
  </div>
</section>`;

  const platform = `<section class="section section-dark platform">
  <div class="container platform-grid">
    <div class="platform-copy">
      ${eyebrow(h.platform.eyebrow, 'eyebrow-light')}
      <h2 class="display-l" data-reveal>${rich(h.platform.title)}</h2>
      <p class="lead lead-light" data-reveal>${h.platform.lead}</p>
      <ul class="points" data-reveal>${h.platform.points.map((p) => `<li>${icon(p.icon)}<span>${p.text}</span></li>`).join('')}</ul>
      <a class="btn btn-glass btn-lg" href="${cfg.platformUrl}" rel="noopener" data-reveal>${h.platform.cta}${icon('arrow-up-right')}</a>
    </div>
    <div class="platform-visual" data-reveal>${phoneMockup(ctx)}</div>
  </div>
</section>`;

  // Cinta de situaciones: casos típicos (no son testimonios de clientes).
  const v = h.voices;
  const voiceCards = v
    ? v.items.map((it) => `<figure class="testi">
      <blockquote>“${it.quote}”</blockquote>
      <figcaption><div><strong>${it.tag}</strong><small>${it.context}</small></div></figcaption>
    </figure>`).join('')
    : '';
  const voices = v
    ? `<section class="section testimonials">
  <div class="container">
    ${sectionHead({ eb: v.eyebrow, title: v.title, lead: v.lead })}
  </div>
  <div class="marquee" data-reveal>
    <div class="marquee-track">${voiceCards}<div class="marquee-dup" aria-hidden="true">${voiceCards}</div></div>
  </div>
</section>`
    : '';

  const body = [
    hero,
    statement(h.statement.line1, h.statement.line2),
    feature,
    cardsSection,
    how,
    stats,
    platform,
    voices,
    faqBlock(ctx, h.faq),
    finalCta(ctx, { title: h.final.title, lead: h.final.lead, cta: h.final.cta, href: url('start'), imgKey: 'finalCta', alt: h.final.alt }),
  ].join('\n');

  return layout(ctx, { page: 'home', seo: h.seo, body, schema: [faqSchema(h.faq)] });
}

/* ───────────────────────── PÁGINA DE DETALLE ───────────────────────── */
function detail(ctx, key) {
  const { c, cfg, url } = ctx;
  const p = c.pages[key];
  const s = service(ctx, key);
  const d = { ...c.detail, ...(p.labels || {}) };
  const startHref = `${url('start')}?s=${key}`;
  const includesList = p.includes || d.includes;

  const hero = `<section class="hero hero-full hero-detail">
  <div class="hero-media">${img(ctx, s.heroImg, p.hero.alt, { eager: true })}</div>
  <div class="container hero-inner">
    <span class="pill pill-glass hero-in">${icon(s.icon)}${p.hero.eyebrow}</span>
    <h1 class="display-xxl hero-in" style="--d:.08s">${rich(p.hero.title)}</h1>
    <p class="lead lead-light hero-in" style="--d:.16s">${p.hero.lead}</p>
    ${heroPrice(p.price, [p.priceNote || d.priceNote], p.priceFootnote)}
    <p class="free-call hero-in" style="--d:.28s">${icon('calendar')}${c.ui.freeCall}</p>
    <div class="btn-row hero-in" style="--d:.3s"><a class="btn btn-accent btn-xl" href="${startHref}">${d.cta}${icon('arrow')}</a></div>
  </div>
</section>`;

  const urgent = p.urgent
    ? `<section class="urgent" aria-label="${esc(p.urgent.title)}">
  <div class="container urgent-inner" data-reveal>
    <span class="urgent-icon">${icon('clock')}</span>
    <p><strong>${p.urgent.title}</strong> <span>${p.urgent.text}</span></p>
    <a class="btn btn-dark btn-md" href="${startHref}">${p.urgent.cta}${icon('arrow')}</a>
  </div>
</section>`
    : '';

  const forYou = `<section class="section">
  <div class="container">
    ${sectionHead({ title: d.forYouTitle })}
    <div class="card-grid cols-${p.forYou.length}">
      ${p.forYou.map((f, i) => `<article class="card card-hover" data-reveal style="--d:${i * 0.08}s"><span class="icon-chip">${icon(f.icon)}</span><h3>${f.title}</h3><p>${f.text}</p></article>`).join('')}
    </div>
  </div>
</section>`;

  const includes = `<section class="section section-dark">
  <div class="container split">
    <div>${sectionHead({ title: d.includesTitle, lead: d.includesLead, light: true })}
      <div class="price-tag" data-reveal><span>${p.price}</span><small>${p.priceNote || d.priceNote}</small></div>
    </div>
    <ul class="checklist">
      ${includesList.map((it, i) => `<li data-reveal style="--d:${i * 0.05}s"><span class="check-dot">${icon('check')}</span>${it}</li>`).join('')}
    </ul>
  </div>
</section>`;

  const reqs = `<section class="section">
  <div class="container">
    ${sectionHead({ title: d.requirementsTitle, lead: d.requirementsLead })}
    <div class="card-grid cols-3">
      ${p.requirements.map((r, i) => `<article class="card card-lg card-hover" data-reveal style="--d:${(i % 3) * 0.08}s"><span class="icon-chip icon-chip-lg">${icon(r.icon)}</span><h3>${r.title}</h3><p>${r.text}</p></article>`).join('')}
    </div>
  </div>
</section>`;

  const docs = `<section class="section section-tint">
  <div class="container split">
    <div>${sectionHead({ title: d.docsTitle, lead: d.docsLead })}<p class="muted small" data-reveal>${icon('sparkle', 'inline-icon')} ${d.docsHint}</p></div>
    <div class="docs" data-docs="${key}" data-reveal>
      ${p.docs
        .map(
          (g, gi) => `<details class="doc-group"${gi === 0 ? ' open' : ''}>
        <summary><span class="doc-title">${g.title}</span><span class="doc-count" data-doc-count>0/${g.items.length}</span><span class="doc-chev">${icon('chevron')}</span></summary>
        <ul>${g.items.map((it, ii) => `<li><label class="check"><input type="checkbox" data-doc="${gi}-${ii}"><span class="check-box">${icon('check')}</span><span>${it}</span></label></li>`).join('')}</ul>
      </details>`
        )
        .join('')}
    </div>
  </div>
</section>`;

  const tool = p.tool ? toolBlock(ctx, p.tool, key) : '';

  const process = `<section class="section section-tint">
  <div class="container narrow">
    ${sectionHead({ title: d.processTitle, center: true })}
    <ol class="timeline" data-timeline>
      <span class="timeline-line" aria-hidden="true"><span></span></span>
      ${p.process.map((st, i) => `<li class="tl-item" data-reveal><span class="tl-dot">${pad2(i + 1)}</span><div class="tl-body"><h3>${st.title}</h3><p>${st.text}</p></div></li>`).join('')}
    </ol>
  </div>
</section>`;

  const benefits = `<section class="section">
  <div class="container">
    ${sectionHead({ title: d.benefitsTitle, center: true })}
    <div class="benefits">
      ${p.benefits.map((b, i) => `<div class="benefit" data-reveal style="--d:${i * 0.1}s"><span class="benefit-icon">${icon(b.icon)}</span><h3>${b.title}</h3><p>${b.text}</p></div>`).join('')}
    </div>
  </div>
</section>`;

  const up = p.upsell || d.upsell;
  const upsell = `<section class="section section-pad-sm">
  <div class="container">
    <a class="upsell" href="${url('main')}" data-reveal>
      <div class="upsell-media">${img(ctx, 'mainHero', '', { sizes: '(min-width: 900px) 40vw, 100vw', widths: [480, 800, 1200] })}</div>
      <div class="upsell-body">
        ${eyebrow(up.eyebrow, 'eyebrow-light')}
        <h2 class="display-m">${up.title}</h2>
        <p>${up.text}</p>
        <span class="btn btn-accent btn-md">${up.cta}${icon('arrow')}</span>
      </div>
    </a>
  </div>
</section>`;

  const final = `<section class="section section-dark final-form" id="contacto">
  <div class="container split">
    <div>
      <h2 class="display-l" data-reveal>${rich(d.final.title)}</h2>
      <p class="lead lead-light" data-reveal>${d.final.lead}</p>
      <div class="btn-row" data-reveal>
        <a class="btn btn-glass btn-lg" href="${startHref}">${d.final.cta}${icon('arrow')}</a>
        <a class="btn btn-glass btn-lg" href="${waLink(ctx, c.ui.whatsappMsg + ' (' + s.name + ')')}" target="_blank" rel="noopener">${icon('whatsapp')}WhatsApp</a>
      </div>
    </div>
    <div class="form-card" data-reveal>${shortForm(ctx, key)}</div>
  </div>
</section>`;

  const body = [hero, urgent, forYou, includes, reqs, docs, tool, process, benefits, faqBlock(ctx, p.faq), upsell, final].join('\n');
  return layout(ctx, {
    page: key,
    seo: p.seo,
    body,
    ogKey: s.heroImg,
    schema: [serviceSchema(ctx, s.name, cfg.prices[s.priceKey], key, p.seo.description), faqSchema(p.faq)],
  });
}

/* ───────────────────────── PÁGINA PRINCIPAL DEL SERVICIO (paso a paso + precio) ───────────────────────── */
function main(ctx) {
  const { c, cfg, url } = ctx;
  const p = c.mainPage;
  const startHref = `${url('start')}?s=${p.startService || c.main.key}`;

  const hero = `<section class="hero hero-full">
  <div class="hero-media">${img(ctx, 'mainHero', p.hero.alt, { eager: true })}</div>
  <div class="container hero-inner">
    <span class="pill pill-glass hero-in">${icon(c.main.icon)}${p.hero.eyebrow}</span>
    <h1 class="display-xxl hero-in" style="--d:.08s">${rich(p.hero.title)}</h1>
    ${p.hero.lead ? `<p class="lead lead-light hero-in" style="--d:.12s">${p.hero.lead}</p>` : ''}
    ${heroPrice(p.price, p.priceNotes || [], p.priceFootnote, '.16s')}
    <p class="free-call hero-in" style="--d:.2s">${icon('calendar')}${c.ui.freeCall}</p>
    <div class="btn-row hero-in" style="--d:.24s"><a class="btn btn-accent btn-xl" href="${startHref}">${p.hero.cta}${icon('arrow')}</a></div>
  </div>
</section>`;

  const steps = `<section class="section">
  <div class="container">
    ${sectionHead({ title: p.timelineTitle, lead: p.timelineLead, center: true })}
    <ol class="arrival">
      ${p.steps
        .map(
          (s, i) => `<li class="arrival-step">
        <div class="arrival-body" data-reveal>
          <span class="arrival-num">${pad2(i + 1)}</span>
          <span class="icon-chip icon-chip-lg">${icon(s.icon)}</span>
          <h3 class="display-m">${s.title}</h3>
          <p class="lead">${s.text}</p>
        </div>
        <div class="arrival-media" data-reveal style="--d:.1s">${s.img ? img(ctx, s.img, s.alt, { sizes: '(min-width: 900px) 50vw, 100vw', widths: [480, 800, 1200, 1600] }) : `<div class="arrival-phone">${phoneMockup(ctx)}</div>`}</div>
      </li>`
        )
        .join('')}
    </ol>
    ${p.stepsNote ? `<p class="footnote footnote-center" data-reveal>${p.stepsNote}</p>` : ''}
  </div>
</section>`;

  const pr = p.pricing;
  const pricing = `<section class="section section-tint" id="precio">
  <div class="container">
    ${sectionHead({ title: pr.title, center: true })}
    <div class="pricing" data-reveal>
      <div class="pricing-head">
        <p class="pricing-name">${pr.name}</p>
        <p class="pricing-price"><span>${pr.price}</span><small>${pr.priceSmall}</small></p>
        ${(pr.notes || []).map((n) => `<p class="muted small">${n}</p>`).join('')}
      </div>
      <ul class="pricing-list">${pr.items.map((it) => `<li><span class="check-dot">${icon('check')}</span>${it}</li>`).join('')}</ul>
      <a class="btn btn-accent btn-lg btn-block" href="${startHref}">${pr.cta}${icon('arrow')}</a>
      ${pr.note ? `<p class="pricing-note">${pr.note}</p>` : ''}
    </div>
  </div>
</section>`;

  const x = p.cross;
  const cross = x
    ? `<section class="section section-pad-sm">
  <div class="container">
    <div class="combo" data-reveal>
      <div>
        ${eyebrow(x.eyebrow, 'eyebrow-light')}
        <h2 class="display-m">${x.title}</h2>
        <p>${x.text}</p>
      </div>
      <div class="combo-price">
        ${x.was ? `<p class="combo-was"><s>${x.was}</s></p>` : ''}
        ${x.price ? `<p class="price-xl"><span>${x.price}</span></p>` : ''}
        ${x.pill ? `<span class="pill pill-accent">${x.pill}</span>` : ''}
        <a class="btn btn-accent btn-lg" href="${x.href || `${url('start')}?s=${x.startService}`}"${x.href ? ' target="_blank" rel="noopener"' : ''}>${x.cta}${icon(x.href ? 'arrow-up-right' : 'arrow')}</a>
      </div>
    </div>
  </div>
</section>`
    : '';

  const body = [
    hero,
    statement(p.statement.line1, p.statement.line2),
    steps,
    pricing,
    cross,
    faqBlock(ctx, p.faq),
    finalCta(ctx, { title: p.final.title, lead: p.final.lead, cta: p.final.cta, href: startHref, imgKey: 'finalCta', alt: p.final.alt }),
  ].join('\n');
  return layout(ctx, {
    page: 'main',
    seo: p.seo,
    body,
    ogKey: 'mainHero',
    schema: [serviceSchema(ctx, c.main.name, cfg.prices[c.main.priceKey], 'main', p.seo.description), faqSchema(p.faq)],
  });
}

/* ───────────────────────── EMPEZAR (asistente por pasos) ─────────────────────────
   Los pasos se definen en content/es.js → start.steps. Tipos: options · people · contact · consent */
function start(ctx) {
  const { c, url } = ctx;
  const s = c.start;
  const prefixes = s.prefixes;
  const serviceStep = s.steps.find((st) => st.name === 'service');
  const serviceNames = Object.fromEntries(serviceStep.options.map((o) => [o.value, o.label]));

  const renderStep = (st, i) => {
    const head = `<fieldset class="q" data-q="${i + 1}"${i ? ' hidden' : ''}>
    <legend class="q-title"><span class="q-num">${i + 1} →</span>${st.title}</legend>`;
    if (st.type === 'options') {
      const f = st.field;
      return `${head}
    ${st.text ? `<p class="q-text">${st.text}</p>` : ''}
    <div class="opt-grid${st.options.length === 2 ? ' opt-grid-2' : ''}">
      ${st.options.map((o, k) => `<label class="opt"><input type="radio" name="${st.name}" value="${o.value}"${k === 0 ? ' required' : ''}${o.reveal ? ' data-reveal-field' : ''}><span class="opt-key">${String.fromCharCode(65 + k)}</span>${icon(o.icon)}<span>${o.label}</span></label>`).join('')}
    </div>
    ${f ? `<div class="field field-date" data-extra-field hidden><label for="f-${f.name}">${f.label}</label><input type="${f.type || 'text'}" id="f-${f.name}" name="${f.name}"${f.type === 'date' ? ' data-min-today' : ''}${f.placeholder ? ` placeholder="${esc(f.placeholder)}"` : ''}></div>` : ''}
  </fieldset>`;
    }
    if (st.type === 'people') {
      return `${head}
    ${st.text ? `<p class="q-text">${st.text}</p>` : ''}
    <div class="people">
      ${st.rows
        .map(
          (r) => `<div class="people-row"><span class="people-label">${icon(r.icon)}${r.label}</span>
        <div class="stepper" data-stepper role="group" aria-label="${esc(r.label)}">
          <button type="button" class="round-btn" data-step="-1" aria-label="${st.dec}">${icon('minus')}</button>
          <input type="number" name="${r.name}" value="${r.value}" min="${r.min}" max="${r.max || 12}" inputmode="numeric" aria-label="${esc(r.label)}">
          <button type="button" class="round-btn" data-step="1" aria-label="${st.inc}">${icon('plus')}</button>
        </div></div>`
        )
        .join('')}
    </div>
  </fieldset>`;
    }
    if (st.type === 'contact') {
      return `${head}
    <div class="field"><label for="f-name">${st.name}</label><input id="f-name" name="name" autocomplete="name" required></div>
    <div class="field"><label for="f-email">${st.email}</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
    <div class="field-row field-phone">
      <div class="field"><label for="f-prefix">${st.prefix}</label><select id="f-prefix" name="prefix" autocomplete="tel-country-code">${prefixes.map((x) => `<option${x === s.defaultPrefix ? ' selected' : ''}>${x}</option>`).join('')}</select></div>
      <div class="field"><label for="f-phone">${st.phone}</label><input id="f-phone" name="phone" type="tel" autocomplete="tel-national" inputmode="tel" required></div>
    </div>
    ${st.extra ? `<div class="field"><label for="f-extra">${st.extra.label}</label><input id="f-extra" name="${st.extra.name}"${st.extra.list ? ' list="extra-list"' : ''} placeholder="${esc(st.extra.placeholder || '')}"${st.extra.required ? ' required' : ''}>
      ${st.extra.list ? `<datalist id="extra-list">${st.extra.list.map((x) => `<option value="${esc(x)}">`).join('')}</datalist>` : ''}</div>` : ''}
  </fieldset>`;
    }
    // consent
    return `${head}
    <p class="q-text">${st.text}</p>
    <label class="check check-lg"><input type="checkbox" name="privacy" required><span class="check-box">${icon('check')}</span><span>${st.accept}</span></label>
    <label class="check check-lg"><input type="checkbox" name="marketing"><span class="check-box">${icon('check')}</span><span>${st.marketing}</span></label>
  </fieldset>`;
  };

  const total = s.steps.length;
  const body = `<section class="start">
  <aside class="start-aside">
    ${img(ctx, 'contact', s.aside.alt, { sizes: '(min-width: 1000px) 40vw, 1px', eager: true })}
    <div class="start-aside-inner">
      <h1 class="display-l">${rich(s.aside.title)}</h1>
      <ul>${s.aside.points.map((p) => `<li>${icon('check')}${p}</li>`).join('')}</ul>
    </div>
  </aside>
  <div class="start-main">
    <div class="progress" aria-hidden="true"><span data-progress></span></div>
    <p class="progress-label" data-progress-label data-tpl="${esc(s.progress)}">${s.progress.replace('{n}', 1).replace('{total}', total)}</p>
    <form class="wizard" data-wizard novalidate
      data-required="${esc(s.required)}" data-invalid-email="${esc(s.invalidEmail)}" data-invalid-phone="${esc(s.invalidPhone)}"
      data-sending="${esc(s.sending)}" data-error="${esc(s.error)}" data-wa-tpl="${esc(s.whatsappPrefill)}"
      data-services='${esc(JSON.stringify(serviceNames))}'>
      ${s.steps.map(renderStep).join('\n')}
      <p class="q-error" role="alert" data-q-error></p>
      <div class="wizard-nav">
        <button type="button" class="btn btn-ghost btn-lg" data-back hidden>${icon('arrow-left')}${s.back}</button>
        <button type="button" class="btn btn-dark btn-lg" data-next>${s.next}${icon('arrow')}</button>
        <button type="submit" class="btn btn-accent btn-lg" data-submit hidden>${s.submit}${icon('arrow')}</button>
        <span class="enter-hint">${s.enterHint}</span>
      </div>
    </form>
    <div class="done" data-done hidden tabindex="-1">
      <div class="done-check">${icon('check')}</div>
      <h2 class="display-xl">${s.done.title}</h2>
      <p class="lead">${s.done.text}</p>
      <div class="btn-row center">
        <a class="btn btn-wa btn-lg" data-done-wa href="${waLink(ctx)}" target="_blank" rel="noopener">${icon('whatsapp')}${s.done.whatsapp}</a>
        <a class="btn btn-ghost btn-lg" href="${url('home')}">${s.done.home}</a>
      </div>
    </div>
  </div>
</section>`;

  return layout(ctx, { page: 'start', seo: s.seo, body, header: 'solid', ogKey: 'contact' });
}

/* ───────────────────────── LEGAL ───────────────────────── */
function legal(ctx, key) {
  const { c } = ctx;
  const L = c.legal[key];
  const body = `<section class="section legal">
  <div class="container narrow">
    <h1 class="display-xl">${L.title}</h1>
    <p class="legal-note">${c.legal.note}</p>
    ${L.sections.map((s) => `<h2>${s.h}</h2>${s.p.map((p) => `<p>${p}</p>`).join('')}`).join('')}
  </div>
</section>`;
  return layout(ctx, { page: key, seo: L.seo, body, header: 'solid' });
}

module.exports = { buildRoutes, createCtx, home, detail, main, start, legal, favicon };
