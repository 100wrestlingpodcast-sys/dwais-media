# DWais Media — revisión de septiembre de 2026

Esta carpeta contiene el rediseño completo en HTML, CSS y JavaScript, con los originales PNG y sus variantes WebP.

## Abrir en Antigravity

1. Abre esta carpeta como proyecto separado para revisar los cambios.
2. Usa la vista previa local de Antigravity o ejecuta `python3 -m http.server 8080` desde esta carpeta y abre `http://localhost:8080`.
3. Revisa escritorio y móvil antes de integrar con tu carpeta habitual o publicar.

No se requieren paquetes de producción ni un paso de compilación. Conserva las instrucciones de AGENTS.md y los contactos existentes.

## Cambios

- Portada con cotización por WhatsApp como acción principal y mockup horizontal que conserva el encuadre 4:3 de la captura real.
- Khriz Studio TCG y Juana Díaz Cigars destacados; cinco proyectos reales preservados.
- Servicios en lenguaje claro y presentación de Albert con proceso de trabajo.
- Traducciones ES/EN, incluidas descripciones de imágenes.
- Casos en `details/summary`, utilizables sin JavaScript.
- Menú móvil cerrado sin enlaces enfocables, cierre con Escape y ajuste al cambiar el ancho.
- Desplazamiento nativo en el mockup; inclinación decorativa solo con puntero fino, escritorio y movimiento permitido.
- Contenido visible por defecto; los fallos de una mejora no bloquean las demás.
- WebP en 640 y 1280 px. Las seis variantes de 1280 px suman 574 KB, frente a 8879 KB de los PNG originales.

## Validación realizada

- Sintaxis JavaScript: correcta.
- HTML: etiquetas anidadas, IDs únicos, cinco casos nativos, referencias y dimensiones de imágenes: correcto.
- Claves ES/EN y enlaces de traducción: correctos.
- Prueba aislada de menú móvil, Escape, cambio de ancho y desplazamiento reducido: correcta.
- Número telefónico ausente del texto visible: correcto.

## Pendiente antes de producción

No se pudo abrir la vista previa local desde el navegador remoto. Las pruebas anteriores son comprobaciones estáticas y aisladas, no una validación visual en dispositivos reales.

- Revisar 360, 390, 768 y 1440 px, ambos idiomas y zoom al 200%.
- Comprobar desplazamiento táctil, foco visible, ausencia de contenido recortado y nitidez del mockup.
- Comprobar el envío real de Netlify Forms y su recepción en el panel.
- Medir rendimiento en la versión publicada.
- Esta entrega reutiliza la captura real existente; no incluye una captura nueva del sitio del cliente.

La producción no fue modificada. La subida del rediseño a GitHub no pudo completarse por errores del servicio; esta carpeta contiene el trabajo para revisarlo y continuar en Antigravity.
