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
  document.querySelectorAll("#cta-whatsapp, #contact-whatsapp, #wa-fab").forEach((el) => {
    el.setAttribute("href", general);
  });

  document.querySelectorAll(".quote-btn").forEach((btn) => {
    const pkg = btn.getAttribute("data-package");
    btn.setAttribute("href", waUrl(t(state.lang, `wa.${pkg}`)));
  });

  const emailHref = `mailto:${CONFIG.email}`;
  const emailLink = document.getElementById("contact-email");
  if (emailLink) emailLink.setAttribute("href", emailHref);

  const emailDisplay = document.getElementById("email-display");
  if (emailDisplay) emailDisplay.textContent = CONFIG.email;

  const waDisplay = document.getElementById("whatsapp-display");
  if (waDisplay) waDisplay.textContent = CONFIG.whatsappDisplay;
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

function initLaptop() {
  const scene = document.getElementById("device-scene");
  const laptop = document.getElementById("laptop");
  if (!scene || !laptop) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const onMove = (e) => {
    const rect = scene.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    laptop.style.transform = `rotateX(${10 - y * 10}deg) rotateY(${-22 + x * 16}deg) rotateZ(3deg)`;
  };

  scene.addEventListener("pointermove", onMove);
  scene.addEventListener("pointerleave", () => {
    laptop.style.transform = "";
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
      const subject = encodeURIComponent(`${CONFIG.brand} — ${form.name.value || ""}`.trim());
      const body = encodeURIComponent(
        `${form.message.value}\n\n${form.email.value}\n${form.project.value || ""}`
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

document.getElementById("year").textContent = String(new Date().getFullYear());

setLang(state.lang);
initLangToggle();
initNav();
initSmoothScroll();
initCases();
initLaptop();
initForm();
initHeaderScroll();
