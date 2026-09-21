/**
 * Site contact + form settings.
 * Change these values in one place; the UI reads them at runtime.
 *
 * WhatsApp: digits only in `whatsappNumber` (country code + number, no + or spaces).
 * Form: "netlify" uses Netlify Forms. Set formProvider to "formspree" and
 * formspreeEndpoint to "https://formspree.io/f/YOUR_ID" to switch.
 */
export const CONFIG = {
  brand: "DiWAISE Media",
  email: "dwaisemedia@gmail.com",
  whatsappNumber: "12106209860",
  // Phone number is never shown in the UI — only used for wa.me links.
  formProvider: "netlify",
  formspreeEndpoint: "",
  formName: "contact",
  storageKey: "dwais-lang",
  defaultLang: "es",
};
