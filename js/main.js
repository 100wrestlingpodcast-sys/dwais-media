import { CONFIG } from "./config.js";
import {
  applyI18n,
  assertLocalesInSync,
  persistLang,
  readStoredLang,
  t,
} from "./i18n.js";

assertLocalesInSync();

const state = {
  lang: readStoredLang(),
};

function waUrl(message) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${text}`;
}

function syncContactLinks() {
  const general = waUrl(t(state.lang, "wa.general"));
  // Update all WA links (hero CTA, contact card, FAB)
  document.querySelectorAll("#cta-whatsapp, #contact-whatsapp, #wa-fab").forEach((el) => {
    el.setAttribute("href", general);
  });

  // Update per-package WA links
  document.querySelectorAll(".quote-btn").forEach((btn) => {
    const pkg = btn.getAttribute("data-package");
    btn.setAttribute("href", waUrl(t(state.lang, `wa.${pkg}`)));
  });

  // Email link (href only, no display text)
  const emailHref = `mailto:${CONFIG.email}`;
  const emailLink = document.getElementById("contact-email");
  if (emailLink) emailLink.setAttribute("href", emailHref);
}

function setLang(lang) {
  state.lang = lang === "en" ? "en" : "es";
  persistLang(state.lang);
  applyI18n(state.lang);
  syncContactLinks();
  refreshCaseToggleLabels();
}

function refreshCaseToggleLabels() {
  document.querySelectorAll(".case-toggle").forEach((btn) => {
    const open = btn.getAttribute("aria-expanded") === "true";
    const label = btn.querySelector("[data-i18n]");
    if (label) {
      label.setAttribute("data-i18n", open ? "work.collapse" : "work.expand");
      label.textContent = t(state.lang, open ? "work.collapse" : "work.expand");
    }
  });
}

function initLangToggle() {
  document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.getAttribute("data-lang-btn")));
  });
}

function initNav() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("nav");
  if (!toggle || !nav) return;

  const close = () => {
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", t(state.lang, "nav.open"));
  };

  toggle.addEventListener("click", () => {
    const open = !document.body.classList.contains("nav-open");
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", t(state.lang, open ? "nav.close" : "nav.open"));
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", id);
    });
  });
}

function initCases() {
  document.querySelectorAll(".project-card").forEach((card) => {
    const btn = card.querySelector(".case-toggle");
    const panel = card.querySelector(".case");
    if (!btn || !panel) return;

    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      const next = !open;
      btn.setAttribute("aria-expanded", String(next));
      panel.hidden = !next;
      refreshCaseToggleLabels();
    });
  });
}

function encodeForm(form) {
  return new URLSearchParams(new FormData(form)).toString();
}

async function submitNetlify(form) {
  const res = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: encodeForm(form),
  });
  if (!res.ok) throw new Error(String(res.status));
}

async function submitFormspree(form) {
  const res = await fetch(CONFIG.formspreeEndpoint, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: new FormData(form),
  });
  if (!res.ok) throw new Error(String(res.status));
}

function initForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const submitBtn = form?.querySelector('[type="submit"]');
  if (!form || !status || !submitBtn) return;

  if (CONFIG.formProvider === "formspree" && CONFIG.formspreeEndpoint) {
    form.removeAttribute("data-netlify");
    form.removeAttribute("netlify");
    form.setAttribute("action", CONFIG.formspreeEndpoint);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";
    status.className = "form-status";
    submitBtn.disabled = true;
    submitBtn.textContent = t(state.lang, "contact.form.sending");

    try {
      if (CONFIG.formProvider === "formspree" && CONFIG.formspreeEndpoint) {
        await submitFormspree(form);
      } else {
        await submitNetlify(form);
      }
      form.reset();
      status.textContent = t(state.lang, "contact.form.success");
      status.classList.add("is-success");
    } catch {
      const fields = new FormData(form);
      const subject = encodeURIComponent(
        `${CONFIG.brand} — ${fields.get("name") || ""}`.trim()
      );
      const body = encodeURIComponent(
        `${fields.get("message") || ""}\n\n${fields.get("email") || ""}\n${fields.get("project") || ""}`
      );
      status.innerHTML = `${t(state.lang, "contact.form.error")} <a href="mailto:${CONFIG.email}?subject=${subject}&body=${body}">${CONFIG.email}</a>`;
      status.classList.add("is-error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = t(state.lang, "contact.form.submit");
    }
  });
}

function initHeaderScroll() {
  const onScroll = () => {
    document.body.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initReveal() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
  );
  els.forEach((el) => io.observe(el));
}

/**
 * model-viewer: wire progress bar and ensure .reveal sections are
 * visible regardless of whether 3D loads or fails.
 */
function initModelViewer() {
  // Always run reveal so sections are never stuck hidden
  initReveal();

  const mv = document.getElementById("device-mv");
  const bar = document.getElementById("mv-progress-bar");
  if (!mv) return;

  // Sync aria label with i18n
  const updateAria = () => {
    mv.setAttribute("alt", t(state.lang, "hero.deviceAria"));
  };
  updateAria();

  // Progress bar
  if (bar) {
    mv.addEventListener("progress", (e) => {
      const pct = Math.round(e.detail.totalProgress * 100);
      bar.style.width = pct + "%";
    });
    mv.addEventListener("load", () => {
      bar.style.width = "100%";
      setTimeout(() => { bar.style.opacity = "0"; }, 600);
    });
    mv.addEventListener("error", () => {
      // GLB failed — hide the scene gracefully
      const scene = document.getElementById("device-scene");
      if (scene) {
        scene.style.opacity = "0.4";
        scene.style.pointerEvents = "none";
      }
    });
  }
}

// ── Bootstrap ──────────────────────────────────────────────────
document.documentElement.classList.add("js-ready");
document.getElementById("year").textContent = String(new Date().getFullYear());

setLang(state.lang);
initLangToggle();
initNav();
initSmoothScroll();
initCases();
initForm();
initHeaderScroll();
initModelViewer();
