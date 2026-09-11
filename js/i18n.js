import { STRINGS } from "./strings.js";
import { CONFIG } from "./config.js";

const ATTRS = [
  ["data-i18n", "textContent"],
  ["data-i18n-html", "innerHTML"],
  ["data-i18n-placeholder", "placeholder"],
  ["data-i18n-aria", "ariaLabel"],
  ["data-i18n-title", "title"],
  ["data-i18n-value", "value"],
];

export function get(obj, path) {
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

function collectKeys(obj, prefix = "") {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const next = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      keys.push(...collectKeys(value, next));
    } else {
      keys.push(next);
    }
  }
  return keys;
}

export function assertLocalesInSync() {
  const esKeys = collectKeys(STRINGS.es).sort();
  const enKeys = collectKeys(STRINGS.en).sort();
  const missingInEn = esKeys.filter((k) => !enKeys.includes(k));
  const missingInEs = enKeys.filter((k) => !esKeys.includes(k));
  if (missingInEn.length || missingInEs.length) {
    console.warn("[i18n] ES/EN key mismatch", { missingInEn, missingInEs });
  }
}

export function readStoredLang() {
  try {
    const stored = localStorage.getItem(CONFIG.storageKey);
    if (stored === "es" || stored === "en") return stored;
  } catch {
    /* private mode */
  }
  return CONFIG.defaultLang;
}

export function persistLang(lang) {
  try {
    localStorage.setItem(CONFIG.storageKey, lang);
  } catch {
    /* private mode */
  }
}

export function t(lang, path) {
  const value = get(STRINGS[lang], path);
  if (value == null) {
    console.warn(`[i18n] missing ${lang}.${path}`);
    return path;
  }
  return value;
}

export function applyI18n(lang) {
  const dict = STRINGS[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = "ltr";

  const title = get(dict, "meta.title");
  const description = get(dict, "meta.description");
  if (title) document.title = title;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && description) metaDesc.setAttribute("content", description);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc && description) ogDesc.setAttribute("content", description);

  const ogLocale = document.querySelector('meta[property="og:locale"]');
  if (ogLocale) {
    ogLocale.setAttribute("content", lang === "es" ? "es_PR" : "en_US");
  }

  for (const [attr, prop] of ATTRS) {
    document.querySelectorAll(`[${attr}]`).forEach((el) => {
      const path = el.getAttribute(attr);
      const value = get(dict, path);
      if (value == null) return;
      if (prop === "ariaLabel") {
        el.setAttribute("aria-label", value);
      } else if (prop === "placeholder") {
        el.setAttribute("placeholder", value);
      } else if (prop === "title") {
        el.setAttribute("title", value);
      } else if (prop === "value") {
        el.setAttribute("value", value);
        if ("value" in el) el.value = value;
      } else {
        el[prop] = value;
      }
    });
  }

  document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
    const isActive = btn.getAttribute("data-lang-btn") === lang;
    btn.setAttribute("aria-pressed", String(isActive));
    btn.classList.toggle("is-active", isActive);
  });

  document.dispatchEvent(new CustomEvent("dwais:lang", { detail: { lang } }));
}
