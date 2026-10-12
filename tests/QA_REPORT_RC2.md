# Auditoría de publicación — v0.11.1 RC2

- Estructura: `index.html` en raíz, rutas relativas, 90 archivos originales más esta prueba y este informe.
- Pruebas repetidas: 196 aserciones unitarias de lógica, 32 comprobaciones de integridad, prueba simulada de actualización PWA y sintaxis JS.
- Corregido: edición y versión visibles; botón de actualización del Service Worker. El usuario guarda antes de pulsar porque se recarga la página.
- No verificado: arranque HTTP por restricción del entorno, instalación/offline real, integración Yale/CORS e imágenes, importación del corpus completo, sistemas Windows/Linux y GitHub Pages.
- Estado: el código puede subirse a un repositorio como RC2 para probarlo. No se certifica como versión estable ni se afirma que el visor Yale funcione desde Pages.

Prueba de aceptación en GitHub Pages: abrir la subruta del repo; comprobar consola sin errores, navegar por todas las secciones, abrir un folio de Yale, crear/exportar/importar una nota, recargar y comprobar persistencia, activar una versión nueva mediante el botón y repetir sin conexión con DevTools. Guardar copia de los datos antes de probar actualizaciones.
