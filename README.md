# Web · Canje de licencia de conducir (Al Volante)

Web estática en español, sin dependencias. Mismo motor y mismo diseño que `consultora-inmigracion`. Solo necesitas Node 18+.

```bash
npm run dev     # http://localhost:4321, se recompila al guardar
npm run build   # genera /dist, listo para subir
```

## Dónde se edita cada cosa

| Qué | Archivo |
|---|---|
| Nombre de marca, isotipo, colores, **precios**, **tasas e importes oficiales**, WhatsApp, email, URL de "Mi expediente", redes, fotos, endpoint del formulario, Google Analytics | `site.config.js` |
| Todos los textos (incluido SEO: title y description de cada página) y la **lista de países con convenio** | `content/es.js` |
| Fuente oficial de cada dato legal, con fecha de comprobación | `FUENTES.md` |
| Paleta, tipografía, espaciados | `assets/css/styles.css` (bloque `:root`) |
| Plantillas HTML de las páginas | `src/render.js` |

En los textos puedes usar `{canje}`, `{pro}`, `{pareja}`, `{parejaSave}`, `{tasa}`, `{tasaPro}`, `{multa}`, `{multaNo}`, `{paises}`, `{meses}`, `{psico}`, `{provisional}` y `{brand}`: se rellenan solos con los valores de `site.config.js`. Si pones una palabra entre `*asteriscos*` en un titular, sale en cursiva serif.

## Antes de publicar

**Decisiones de negocio (son placeholders):**

- [ ] `brand.name`: "Al Volante" es un nombre provisional (comprueba marca y dominio)
- [ ] `prices`: 199 € (coche y moto, tasa incluida), 349 € (camión y autobús), 349 € (dos canjes). El mercado en Madrid cobra entre 135 y 250 € con tasa incluida (ver `FUENTES.md`)
- [ ] `siteUrl`, `contact.whatsapp`, `contact.email`, `platformUrl`, `social`
- [ ] `formEndpoint`: **sin él, los formularios no guardan los datos** (p. ej. Formspree, Make o tu CRM: recibe un POST JSON)
- [ ] La plataforma "Mi expediente" y la promesa de respuesta en 24 h son compromisos de servicio: mantenlos solo si los vas a cumplir

**Comprobaciones legales (importantes):**

- [ ] **Representación ante la DGT.** La web dice que presentamos la solicitud "con tu autorización". La DGT admite representante (Registro de apoderamientos o modelo Mod. 24), pero el modelo en papel exige expresar "su carácter gratuito". Confirma con un asesor si tu empresa puede actuar como representante cobrando, o si debe hacerlo un **gestor administrativo colegiado** (propio o colaborador)
- [ ] **Verificación previa.** Según la sede de la DGT, solo puede pedirla el titular. Por eso la web dice "te guiamos para pedirla". No lo cambies a "la pedimos por ti" sin confirmarlo
- [ ] Revisa la **lista de países** en la web de la DGT el día de la publicación (última comprobada: actualización del 26/06/2026). Si cambia, se corrige en `content/es.js` (arrays `DIRECTO`, `VERIFICA`, `SIN`) y en `facts.paises`
- [ ] Revisa las **tasas** (`amounts.tasa`, `amounts.tasaPro`) cada enero
- [ ] Páginas legales: son plantillas con campos `[ENTRE CORCHETES]`. Revísalas con tu asesor

**Contenido:**

- [ ] Fotos: son de Unsplash. Recomendado: fotos propias. Ponlas en `assets/img/` y usa `'/assets/img/archivo.jpg'` en `images`
- [ ] No hay testimonios: la cinta "Lo que casi nadie te cuenta" recoge dudas habituales con su respuesta. Cuando tengas clientes reales, puedes sustituirla por testimonios en `home.voices`
- [ ] La pantalla de móvil de la sección "Plataforma" es una ilustración (`phone` en `content/es.js`)

## Despliegue

Sube la carpeta `dist/` a cualquier hosting estático: Netlify, Vercel, Cloudflare Pages o GitHub Pages. Comando de build: `npm run build`; carpeta de salida: `dist` (ya configurado en `vercel.json`).

## Rutas

| Página | Ruta |
|---|---|
| Inicio | `/` |
| El canje, paso a paso (precio) | `/canje-paso-a-paso/` |
| Coche y moto | `/canje-coche-y-moto/` |
| Camión y autobús | `/canje-camion-y-autobus/` |
| México, Cuba y Venezuela (sin convenio) | `/mexico-cuba-venezuela/` |
| Formulario (acepta `?s=coche\|pro\|pareja\|sinconvenio`) | `/empezar/` |
| Legales | `/aviso-legal/`, `/privacidad/`, `/cookies/` |

## Idiomas

Esta web es solo en español (el público son residentes latinoamericanos). El ejemplo original era bilingüe; si hiciera falta inglés, habría que añadir `content/en.js` y recuperar el selector de idioma del proyecto `consultora-inmigracion`.
