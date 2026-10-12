# Fase 10 · PWA y modo offline

- La app precarga en Cache Storage el HTML, el manifiesto, los iconos, todos los módulos JS y las hojas CSS.
- `sw.js` opera exclusivamente en su propio origen y subruta, sin cachear Yale, URLs externas, importaciones IVTFF ni datos personales.
- La primera visita y la instalación del Service Worker requieren conexión. El modo offline empieza después de una primera visita correcta.
- El visor IIIF requiere conexión con Yale; las imágenes originales no se garantizan offline.
- Las notas guardadas en localStorage y los corpus IndexedDB no se borran ni modifican al actualizar el Service Worker. Recomendamos exportar copias JSON antes de limpiar datos del navegador.
- Si hay una versión nueva, aparece «Actualizar app». Guarda primero cualquier texto que estés escribiendo: al pulsarlo se activa la nueva versión y la página se recarga. También se pueden cerrar todas las pestañas de la app y volver a abrirla.
- No se declara instalación PWA comprobada en dispositivos externos.
- Prueba: abrir desde servidor Python, navegar online, desconectar red, recargar y visitar cada sección local; reconectar y validar las imágenes externas.
