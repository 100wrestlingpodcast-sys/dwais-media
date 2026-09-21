# DiWAISE Media

One-page bilingual portfolio for **DiWAISE Media** (Spanish default, English toggle). Static HTML/CSS/JS — no build step. Ready for GitHub → Netlify.

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

## Project structure

```
index.html          # Single page
css/styles.css
js/config.js        # Email, WhatsApp, form provider
js/strings.js       # ES / EN copy
js/i18n.js          # Language engine
js/main.js          # Nav, form, laptop tilt, WhatsApp URLs
assets/favicon.svg
netlify.toml
```

No prices are shown. The hero shows the brand name only (no tagline).
