/**
 * Site contact + form settings.
 * Change these values in one place; the UI reads them at runtime.
 *
 * WhatsApp: digits only in `whatsappNumber` (country code + number, no + or spaces).
 * Form: "netlify" uses Netlify Forms. Set formProvider to "formspree" and
 * formspreeEndpoint to "https://formspree.io/f/YOUR_ID" to switch.
 */
export const CONFIG = {
  brand: "DWais Media",
  email: "dwaisemedia@gmail.com",
  whatsappNumber: "12106209860",
  whatsappDisplay: "+1 210-620-9860",
  formProvider: "netlify",
  formspreeEndpoint: "",
  formName: "contact",
  storageKey: "dwais-lang",
  defaultLang: "es",
  iframeWidth: 1440,
};

/**
 * Portfolio sites. `embed: false` when the host sends X-Frame-Options / CSP
 * that blocks iframes (confirmed: Khriz Studio TCG = SAMEORIGIN).
 */
export const PROJECTS = [
  {
    id: "cigars",
    url: "https://juanadiazcigars.netlify.app",
    host: "juanadiazcigars.netlify.app",
    embed: true,
    shot: "assets/previews/cigars.webp",
  },
  {
    id: "tcg",
    url: "https://khrizstudiotcg.com/",
    host: "khrizstudiotcg.com",
    embed: false,
    shot: "assets/previews/khriz.webp",
  },
  {
    id: "geek",
    url: "https://geekcollectorpr.com",
    host: "geekcollectorpr.com",
    embed: true,
    shot: "assets/previews/geek.webp",
  },
  {
    id: "wrestling",
    url: "https://100wrestlingpodcast.com/es/inicio",
    host: "100wrestlingpodcast.com",
    embed: true,
    shot: "assets/previews/wrestling.webp",
  },
  {
    id: "bsn",
    url: "https://2kbsn.com",
    host: "2kbsn.com",
    embed: true,
    shot: "assets/previews/bsn.webp",
  },
];
