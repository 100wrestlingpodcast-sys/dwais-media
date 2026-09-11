# DWais Media — instrucciones para Antigravity

## Qué es este proyecto
Portfolio one-page de **DWais Media** (negocio de diseño/desarrollo web, Puerto Rico).  
Live: https://dwaisemedia.netlify.app  
Repo GitHub → Netlify (`main`).

## Reglas fijas (no las rompas)
- Nombre: **DWais Media** (ortografía exacta). **Sin tagline.**
- Idioma: **español por defecto** + toggle **ES | EN** que traduzca TODO (usa `js/strings.js` + `js/i18n.js`).
- **Sin precios** en la página.
- Contacto: `dwaisemedia@gmail.com` · WhatsApp `+1 210-620-9860` (`https://wa.me/12106209860`).
- Menú mínimo: Inicio · Trabajo · Servicios · Contacto.
- Stack: HTML/CSS/JS estático (Netlify-friendly). No frameworks pesados salvo que se pida.

## Contenido
### Trabajo (capturas REALES en `assets/projects/`)
1. Juana Díaz Cigars → `juanadiaz.png` → https://juanadiazcigars.netlify.app
2. Khriz Studio TCG → `khrizstudio.png` → https://khrizstudiotcg.com/
3. Geek Collector PR → `geekcollector.png` → https://geekcollectorpr.com
4. 100% Wrestling Podcast → `wrestling.png` → https://100wrestlingpodcast.com/es/inicio
5. 2K BSN → `twokbsn.png` → https://2kbsn.com

Nunca sustituyas esas capturas por mocks genéricos o placeholders.

### Servicios (sin precios; CTA “Pedir cotización” → WhatsApp)
1. **Presencia** — landing 1 página
2. **Negocio** — web 4–6 páginas PyME
3. **Impulso** — rediseño / conversión

## Objetivo de diseño
Portfolio premium, moderno, mucho aire, tipografía limpia, CTAs fuertes, mobile-first.  
Hero con device/laptop atractivo. Cards de trabajo con chrome de browser + screenshot real.  
Respeta `prefers-reduced-motion`.

## Cómo publicar
1. Edita en esta carpeta.
2. `git add -A && git commit -m "…" && git push origin main`
3. Netlify redeploy automático.

## Tarea actual
Refina visualmente la web: hero más premium, cards/screenshots más nítidos, spacing/motion sutil, WhatsApp sticky cómodo en móvil, servicios y contacto claros. Mantén i18n y las reglas fijas.
