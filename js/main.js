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
  document.dispatchEvent(new CustomEvent("dwais:lang"));
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
 * Hero iPad: drag-to-tilt (CSS 3D). Reveal always runs so sections
 * never stay stuck at opacity 0 if JS partially fails.
 */
function initDeviceTilt() {
  initReveal();

  const stage = document.getElementById("device-stage");
  const img = document.getElementById("device-ipad");
  if (!stage || !img) return;

  const syncAria = () => {
    stage.setAttribute("aria-label", t(state.lang, "hero.deviceAria"));
  };
  syncAria();
  // Keep aria in sync when language toggles (setLang already re-applies i18n;
  // this covers the role=img host).
  document.addEventListener("dwais:lang", syncAria);

  let rotY = -18;
  let rotX = 6;
  let targetY = rotY;
  let targetX = rotX;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let auto = true;
  let autoDir = 1;
  let reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const apply = () => {
    img.style.transform =
      "rotateY(" + rotY.toFixed(2) + "deg) rotateX(" + rotX.toFixed(2) + "deg)";
  };
  apply();

  const onPointerDown = (e) => {
    dragging = true;
    auto = false;
    lastX = e.clientX;
    lastY = e.clientY;
    stage.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    targetY += dx * 0.35;
    targetX -= dy * 0.25;
    targetY = Math.max(-42, Math.min(42, targetY));
    targetX = Math.max(-14, Math.min(18, targetX));
  };
  const onPointerUp = () => {
    dragging = false;
  };

  stage.addEventListener("pointerdown", onPointerDown);
  stage.addEventListener("pointermove", onPointerMove);
  stage.addEventListener("pointerup", onPointerUp);
  stage.addEventListener("pointercancel", onPointerUp);

  const tick = () => {
    if (!reduced && auto && !dragging) {
      targetY += 0.08 * autoDir;
      if (targetY > 22) autoDir = -1;
      if (targetY < -28) autoDir = 1;
      targetX = 6 + Math.sin((performance.now() / 4000) * Math.PI * 2) * 2;
    }
    rotY += (targetY - rotY) * 0.12;
    rotX += (targetX - rotX) * 0.12;
    apply();
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
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
initDeviceTilt();
