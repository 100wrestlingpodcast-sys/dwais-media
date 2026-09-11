# DWais Media

One-page bilingual portfolio for **DWais Media** (Spanish default, English toggle). Static HTML/CSS/JS — no build step. Ready for GitHub → Netlify.

## Run locally

Any static server from the repo root:

```bash
python3 -m http.server 5173
```

Then open [http://localhost:5173](http://localhost:5173).

A simple `npx serve` works too. ES modules require HTTP (opening `index.html` as a file will not load `js/main.js`).

## Deploy on Netlify from GitHub

1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import an existing project** and select the repo.
3. Build settings (also in `netlify.toml`):
   - **Build command:** `echo 'Static site — no build step'` (or leave blank)
   - **Publish directory:** `.` (site root)
4. Deploy. Enable **Netlify Forms** (on by default). Submit the contact form once on the live site so Netlify registers the `contact` form.

Custom domain is optional. HTTPS is automatic.

## Contact: WhatsApp, email, forms

Edit `js/config.js`:

| Field | What it does |
| --- | --- |
| `email` | Shown on the page and used for `mailto:` |
| `whatsappNumber` | Digits only, country code included (`12106209860`) |
| `whatsappDisplay` | Human-readable number |
| `formProvider` | `"netlify"` (default) or `"formspree"` |
| `formspreeEndpoint` | `https://formspree.io/f/YOUR_FORM_ID` if using Formspree |

WhatsApp links use `https://wa.me/<number>?text=...`. Quote buttons prefill the selected package name in the current language.

### Netlify Forms

The form in `index.html` has `name="contact"`, `data-netlify="true"`, and a honeypot (`bot-field`). Submissions appear under **Forms** in the Netlify dashboard. Notifications can be forwarded to `dwaisemedia@gmail.com`.

### Formspree

1. Create a form at [formspree.io](https://formspree.io) pointing to `dwaisemedia@gmail.com`.
2. In `js/config.js` set `formProvider: "formspree"` and `formspreeEndpoint` to your form URL.

### Mailto fallback

If the AJAX submit fails (for example, the site is not on Netlify and Formspree is not configured), the form status offers a `mailto:dwaisemedia@gmail.com` link with the message prefilled.

## Language (i18n)

- Default: Spanish (`es`). Preference is stored in `localStorage` under `dwais-lang`.
- Toggle **ES | EN** in the header. All visible UI copy updates: nav, hero, work cards, services, form labels, placeholders, buttons, and `aria-label`s.
- Dictionaries live in `js/strings.js` (`STRINGS.es` and `STRINGS.en`). Keep both trees identical.
- Markup uses `data-i18n`, `data-i18n-placeholder`, and `data-i18n-aria`. `js/i18n.js` applies the active language and warns in the console if keys drift.

## Live portfolio previews

Work cards embed the real sites in a laptop/browser frame (scaled iframe, `pointer-events: none` so page scroll is not hijacked). **Ver sitio / View site** opens the live URL in a new tab.

If a host sends `X-Frame-Options` or CSP `frame-ancestors` that blocks embedding, the card shows a **real screenshot** of that site plus a short message — never a generic stock thumbnail.

Confirmed at build time:

| Site | Preview |
| --- | --- |
| Juana Díaz Cigars | Live iframe |
| Khriz Studio TCG | Fallback screenshot (`X-Frame-Options: SAMEORIGIN`) |
| Geek Collector PR | Live iframe |
| 100% Wrestling Podcast | Live iframe |
| 2K BSN | Live iframe |

Screenshots live in `assets/previews/`. Embed flags are in `js/config.js` (`PROJECTS`).

## Project structure

```
index.html
css/styles.css
js/config.js        # Email, WhatsApp, form provider, PROJECTS embed flags
js/strings.js
js/i18n.js
js/main.js          # Nav, i18n, form, live preview iframes
assets/favicon.svg
assets/previews/    # Real screenshots (iframe fallbacks)
netlify.toml
```

No prices are shown. The hero shows the brand name only (no tagline).
