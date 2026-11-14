// Genera el sitio estático en /dist. Uso: node build.js
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'dist');

// Recarga limpia de módulos en cada build (útil con `npm run dev`)
function loadModules() {
  for (const k of Object.keys(require.cache)) {
    if (!k.includes('node_modules') && k !== __filename && !k.endsWith('serve.js')) delete require.cache[k];
  }
  return {
    cfg: require('./site.config'),
    R: require('./src/render'),
    content: require('./content/es'),
  };
}

function write(route, html) {
  const file = path.join(OUT, route, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name);
    const d = path.join(dst, e.name);
    e.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}

function build() {
  const { cfg, R, content } = loadModules();
  fs.rmSync(OUT, { recursive: true, force: true });
  copyDir(path.join(ROOT, 'assets'), path.join(OUT, 'assets'));

  const ctx = R.createCtx(cfg, content);
  const pages = {
    home: () => R.home(ctx),
    main: () => R.main(ctx),
    start: () => R.start(ctx),
    legalNotice: () => R.legal(ctx, 'legalNotice'),
    privacy: () => R.legal(ctx, 'privacy'),
    cookies: () => R.legal(ctx, 'cookies'),
  };
  for (const s of content.services) pages[s.key] = () => R.detail(ctx, s.key);

  let count = 0;
  for (const [key, fn] of Object.entries(pages)) {
    write(ctx.routes[key], fn());
    count++;
  }

  // Favicon (sale del isotipo definido en site.config.js), 404, sitemap y robots
  fs.mkdirSync(path.join(OUT, 'assets', 'img'), { recursive: true });
  fs.writeFileSync(path.join(OUT, 'assets', 'img', 'favicon.svg'), R.favicon(cfg));
  fs.writeFileSync(path.join(OUT, '404.html'), `<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/"><title>404</title><a href="/">Inicio</a>`);
  const urls = Object.keys(pages).map((k) => `<url><loc>${cfg.siteUrl}${ctx.routes[k]}</loc></url>`).join('\n');
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${cfg.siteUrl}/sitemap.xml\n`);

  console.log(`✓ ${count} páginas generadas en /dist`);
}

module.exports = build;
if (require.main === module) build();
