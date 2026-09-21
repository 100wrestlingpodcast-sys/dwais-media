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

  document.dispatchEvent(new CustomEvent("dwais:lang"));
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
  const mobile = window.matchMedia("(max-width: 819px)");
  const sync = () => {
    const open = mobile.matches && document.body.classList.contains("nav-open");
    nav.inert = mobile.matches && !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", t(state.lang, open ? "nav.close" : "nav.open"));
  };
  const close = (restore = false) => {
    document.body.classList.remove("nav-open");
    if (restore) toggle.focus();
    sync();
  };
  toggle.addEventListener("click", () => {
    document.body.classList.toggle("nav-open"); sync();
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => close()));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && document.body.classList.contains("nav-open")) close(true);
  });
  document.addEventListener("click", e => {
    if (!e.target.closest(".site-header")) close();
  });
  document.addEventListener("focusin", e => {
    if (!e.target.closest(".site-header")) close();
  });
  document.addEventListener("dwais:lang", sync);
  mobile.addEventListener("change", () => {
    if (nav.contains(document.activeElement) && mobile.matches) toggle.focus();
    close();
  });
  sync();
  document.documentElement.classList.add("nav-ready");
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      history.replaceState(null, "", id);
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

// Content is always visible. Reveal is a short entrance effect, never a hiding gate.
function initReveal() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduced.matches || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (!reduced.matches) entry.target.animate(
        [{ opacity: 0.65, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }],
        { duration: 420, easing: "ease-out" }
      );
      io.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
}

// Decorative pointer tilt only: no capture, no drag and no continuous animation loop.
function initDeviceTilt() {
  const stage = document.getElementById("device-stage");
  const device = document.getElementById("device-ipad");
  if (!stage || !device) return;
  const enabled = window.matchMedia("(min-width: 980px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
  const reset = () => { device.style.transform = "none"; };
  stage.addEventListener("pointermove", e => {
    if (!enabled.matches) return;
    const rect = stage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    device.style.transform = `rotateY(${x * 6}deg) rotateX(${-y * 4}deg)`;
  }, { passive: true });
  stage.addEventListener("pointerleave", reset);
  enabled.addEventListener("change", reset);
}

// Isolated enhancements: failure of one cannot blank the page or block the others.
const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());
for (const init of [() => setLang(state.lang), initLangToggle, initNav,
  initSmoothScroll, initForm, initHeaderScroll, initReveal, initDeviceTilt]) {
  try { init(); } catch (error) { console.error("Enhancement unavailable", error); }
}
