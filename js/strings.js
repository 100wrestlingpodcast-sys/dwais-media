/**
 * Bilingual copy. Keep `es` and `en` key trees identical.
 * i18n.js asserts they stay in sync at runtime (dev console).
 */
export const STRINGS = {
  es: {
    meta: {
      title: "DWais Media",
      description:
        "DWais Media diseña sitios web para marcas en Puerto Rico. Presencia digital clara, bilingüe y lista para crecer.",
    },
    skip: "Saltar al contenido",
    nav: {
      home: "Inicio",
      work: "Trabajo",
      services: "Servicios",
      contact: "Contacto",
      open: "Abrir menú",
      close: "Cerrar menú",
    },
    lang: {
      label: "Idioma",
      es: "ES",
      en: "EN",
      toEs: "Cambiar a español",
      toEn: "Cambiar a inglés",
    },
    hero: {
      sub: "Diseñamos y desarrollamos sitios web para marcas en Puerto Rico — modernos, rápidos y listos para crecer.",
      ctaWork: "Ver trabajos",
      ctaWhatsapp: "Hablar por WhatsApp",
      deviceAria: "iPad con el sitio de Khriz Studio TCG en pantalla",
      deviceHint: "Arrastra para girar",
    },
    work: {
      kicker: "Trabajo",
      title: "Sitios que ya están en el mundo",
      lede: "Cinco proyectos en vivo — marcas locales, retail, medios y comunidad en Puerto Rico.",
      live: "Ver sitio",
      expand: "Ver caso",
      collapse: "Cerrar caso",
      problem: "Problema",
      solution: "Solución",
    },
    projects: {
      cigars: {
        name: "Juana Díaz Cigars",
        outcome: "Presencia premium para cigar bar y tienda oficial.",
        problem:
          "Una marca artesanal necesitaba transmitir lujo, tradición y acceso 21+ sin perder calidez.",
        solution:
          "Landing de alta conversión con curaduría de marca, sommeliers y un llamado claro a reservas y noches de puros.",
      },
      tcg: {
        name: "Khriz Studio TCG",
        outcome: "Tienda local y comunidad TCG en Sabana Grande, en un solo sitio.",
        problem:
          "El local existía; en la web faltaba horario, eventos y una invitación clara a visitar.",
        solution:
          "Sitio de retail + comunidad: horarios, mapa, eventos y un tono familiar para jugadores y coleccionistas.",
      },
      geek: {
        name: "Geek Collector PR",
        outcome: "Marketplace claro para coleccionistas en Puerto Rico.",
        problem:
          "Coleccionistas necesitaban un destino único, no un mosaico de redes y mensajes.",
        solution:
          "Marketplace con identidad de marca, navegación simple y foco en descubrir y conectar.",
      },
      wrestling: {
        name: "100% Wrestling Podcast",
        outcome: "Hub de medios para programas, Patreon y redes.",
        problem:
          "El contenido vivía disperso entre plataformas; la marca necesitaba casa propia.",
        solution:
          "Sitio de medios bilingüe que concentra programas, membresía y canales en una sola entrada.",
      },
      bsn: {
        name: "2K BSN",
        outcome: "Liga y comunidad gamer con identidad de temporada.",
        problem:
          "Una liga comunitaria necesitaba verse tan seria como se juega.",
        solution:
          "Web de liga con energía de temporada, rumbo claro a la comunidad y presencia de marca consistente.",
      },
    },
    services: {
      kicker: "Servicios",
      title: "Tres formas de empezar",
      lede: "Paquetes claros. Cotización a la medida — hablamos por WhatsApp.",
      quote: "Pedir cotización",
    },
    packages: {
      presence: {
        name: "Presencia",
        tag: "Landing de 1 página",
        desc: "Una página que explica quién eres, qué ofreces y cómo contactarte.",
        f1: "Estructura y copy de conversión",
        f2: "Diseño responsive y accesible",
        f3: "WhatsApp, correo y formulario",
        f4: "Lista para publicar en Netlify",
      },
      business: {
        name: "Negocio",
        tag: "Sitio PYME de 4–6 páginas",
        desc: "Un sitio completo para operar: servicios, sobre, contacto y más.",
        f1: "Arquitectura de 4–6 páginas",
        f2: "SEO básico y analítica",
        f3: "Páginas de servicios y contacto",
        f4: "Pensado para negocios locales",
      },
      growth: {
        name: "Impulso",
        tag: "Rediseño y conversión",
        desc: "Rehacemos el sitio con foco en claridad, velocidad y resultados.",
        f1: "Rediseño a medida",
        f2: "Optimización de conversión",
        f3: "Rendimiento y accesibilidad",
        f4: "Iteración con lo que ya mide",
      },
    },
    wa: {
      presence:
        "Hola, me interesa el paquete Presencia (landing de 1 página) con DWais Media.",
      business:
        "Hola, me interesa el paquete Negocio (sitio de 4–6 páginas) con DWais Media.",
      growth:
        "Hola, me interesa el paquete Impulso (rediseño y conversión) con DWais Media.",
      general: "Hola, me gustaría hablar de un proyecto web con DWais Media.",
    },
    contact: {
      kicker: "Contacto",
      title: "Hablemos de tu sitio",
      lede: "Cuéntanos el proyecto. Respondemos por WhatsApp o correo — Puerto Rico y clientes bilingües.",
      whatsapp: "WhatsApp",
      whatsappHint: "Respuesta más rápida",
      whatsappCta: "Escribir por WhatsApp",
      emailLabel: "Correo",
      emailCta: "Enviar correo",
      or: "o escríbenos aquí",
      form: {
        name: "Nombre",
        email: "Correo",
        project: "Proyecto (opcional)",
        message: "Mensaje",
        submit: "Enviar mensaje",
        sending: "Enviando…",
        success: "Mensaje enviado. Te escribimos pronto.",
        error: "No se pudo enviar. Escríbenos por WhatsApp o correo.",
        namePh: "Tu nombre",
        emailPh: "tucorreo@email.com",
        projectPh: "Nombre del negocio o idea",
        messagePh: "¿Qué necesitas y para cuándo?",
        bot: "No llenar",
      },
    },
    footer: {
      rights: "Todos los derechos reservados.",
      locale: "Puerto Rico · ES / EN",
    },
    aria: {
      whatsappFab: "Abrir WhatsApp",
      primaryNav: "Principal",
    },
  },
  en: {
    meta: {
      title: "DWais Media",
      description:
        "DWais Media designs websites for brands in Puerto Rico. Clear, bilingual digital presence — ready to grow.",
    },
    skip: "Skip to content",
    nav: {
      home: "Home",
      work: "Work",
      services: "Services",
      contact: "Contact",
      open: "Open menu",
      close: "Close menu",
    },
    lang: {
      label: "Language",
      es: "ES",
      en: "EN",
      toEs: "Switch to Spanish",
      toEn: "Switch to English",
    },
    hero: {
      sub: "We design and develop websites for brands in Puerto Rico — modern, fast, and built to grow.",
      ctaWork: "View work",
      ctaWhatsapp: "Chat on WhatsApp",
      deviceAria: "iPad showing the Khriz Studio TCG website",
      deviceHint: "Drag to rotate",
    },
    work: {
      kicker: "Work",
      title: "Sites already out in the world",
      lede: "Five live projects — local brands, retail, media, and community in Puerto Rico.",
      live: "Live site",
      expand: "View case",
      collapse: "Close case",
      problem: "Problem",
      solution: "Solution",
    },
    projects: {
      cigars: {
        name: "Juana Díaz Cigars",
        outcome: "A premium digital home for a cigar bar and official shop.",
        problem:
          "A craft brand needed to feel luxurious and 21+ without losing warmth.",
        solution:
          "A high-converting landing with brand curation, sommeliers, and a clear path to reservations and cigar nights.",
      },
      tcg: {
        name: "Khriz Studio TCG",
        outcome: "Local TCG retail and community in Sabana Grande, in one site.",
        problem:
          "The shop was real; the web was missing hours, events, and a reason to visit.",
        solution:
          "A retail + community site: hours, map, events, and a welcoming tone for players and collectors.",
      },
      geek: {
        name: "Geek Collector PR",
        outcome: "A clear marketplace for collectors in Puerto Rico.",
        problem:
          "Collectors needed one destination — not a scatter of DMs and social posts.",
        solution:
          "A branded marketplace with simple navigation and a focus on discovery and connection.",
      },
      wrestling: {
        name: "100% Wrestling Podcast",
        outcome: "A media hub for shows, Patreon, and social channels.",
        problem:
          "Content lived across platforms; the brand needed a home base.",
        solution:
          "A bilingual media site that gathers shows, membership, and channels behind one front door.",
      },
      bsn: {
        name: "2K BSN",
        outcome: "A gaming league and community with seasonal identity.",
        problem:
          "A community league needed to look as serious as it plays.",
        solution:
          "A league site with seasonal energy, a clear path into the community, and consistent brand presence.",
      },
    },
    services: {
      kicker: "Services",
      title: "Three ways to start",
      lede: "Clear packages. Custom quotes — we talk on WhatsApp.",
      quote: "Request a quote",
    },
    packages: {
      presence: {
        name: "Presence",
        tag: "1-page landing",
        desc: "One page that explains who you are, what you offer, and how to reach you.",
        f1: "Conversion-minded structure and copy",
        f2: "Responsive, accessible design",
        f3: "WhatsApp, email, and a form",
        f4: "Ready to publish on Netlify",
      },
      business: {
        name: "Business",
        tag: "4–6 page SME site",
        desc: "A complete site to operate: services, about, contact, and more.",
        f1: "4–6 page architecture",
        f2: "Foundational SEO and analytics",
        f3: "Service and contact pages",
        f4: "Built for local businesses",
      },
      growth: {
        name: "Growth",
        tag: "Custom redesign + CRO",
        desc: "We rebuild the site around clarity, speed, and results.",
        f1: "Custom redesign",
        f2: "Conversion optimization",
        f3: "Performance and accessibility",
        f4: "Iteration from what you already measure",
      },
    },
    wa: {
      presence:
        "Hi, I'm interested in the Presence package (1-page landing) with DWais Media.",
      business:
        "Hi, I'm interested in the Business package (4–6 page site) with DWais Media.",
      growth:
        "Hi, I'm interested in the Growth package (redesign + conversion) with DWais Media.",
      general: "Hi, I'd like to talk about a web project with DWais Media.",
    },
    contact: {
      kicker: "Contact",
      title: "Let's talk about your site",
      lede: "Tell us about the project. We reply on WhatsApp or email — Puerto Rico and bilingual clients.",
      whatsapp: "WhatsApp",
      whatsappHint: "Fastest reply",
      whatsappCta: "Message on WhatsApp",
      emailLabel: "Email",
      emailCta: "Send an email",
      or: "or write us here",
      form: {
        name: "Name",
        email: "Email",
        project: "Project (optional)",
        message: "Message",
        submit: "Send message",
        sending: "Sending…",
        success: "Message sent. We'll be in touch soon.",
        error: "Couldn't send. Reach us on WhatsApp or email.",
        namePh: "Your name",
        emailPh: "you@email.com",
        projectPh: "Business name or idea",
        messagePh: "What do you need, and by when?",
        bot: "Leave blank",
      },
    },
    footer: {
      rights: "All rights reserved.",
      locale: "Puerto Rico · ES / EN",
    },
    aria: {
      whatsappFab: "Open WhatsApp",
      primaryNav: "Primary",
    },
  },
};
