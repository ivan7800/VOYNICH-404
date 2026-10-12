# 404 QA REPORT · VOYNICH 404 v0.3.0

**Estado:** BETA — QA parcial, sin STABLE. **Gate de publicación:** PENDING.

## Resumen ejecutivo

Se mantienen los seis grupos del códice, nueve evidencias, cinco fuentes, skins, buscador global, cuaderno y exportación de notas. Se incorpora visor IIIF y controles asociados.

## Pruebas PASS (reales dentro de su alcance)

- 30 comprobaciones de nuevo visor en Chromium bajo DOM controlado y manifiesto simulado (`qa_phase3.py`).
- 39 comprobaciones de regresión del sistema previo (`qa_phase2_regression.py`).
- 14 aserciones unitarias del parser y seguridad de URLs (`test_iiif.mjs`).
- Sintaxis `node --check` de módulos JS y `py_compile` del servidor sin errores.
- Servidor Python local respondió 200 al `GET /index.html` en el contenedor.
- Compatibilidad responsive 390 px y 320 px en entorno DOM controlado.

## Pruebas NO ejecutables / PENDIENTES

- Chromium HTTP localhost: acceso denegado por política `net::ERR_BLOCKED_BY_ADMINISTRATOR` (no se probó el grafo ESM remoto real).
- Endpoint Yale, cabeceras CORS, imágenes originales: inaccesibles desde este entorno.
- Windows real, Linux Mint real, despliegue en subruta de GitHub Pages: no probados.
- Pantalla completa real, drag táctil de dos dedos y resolución de imágenes reales: no probados.

## Riesgos

- **ALTO para disponibilidad del visor:** bloqueo de manifest/canvas por Yale o políticas CORS. El visor informa, conserva índices existentes, permite importar JSON y abrir el catálogo institucional. No hay garantía de solución sin una fuente de imágenes accesible.
- **MEDIO:** Zoom CSS sobre imagen reducida; sin visor de teselas ni imagen offline.
- **MEDIO:** Favoritos no se incluyen todavía en exportación JSON de notas.

## Seguridad inspeccionada

- URLs de imagen validadas como HTTPS bajo `yale.edu`.
- Metadatos del manifiesto convertidos a texto o escapados antes de mostrarse.
- Tamaño de manifiesto y número de canvases limitados.
- No se incluyen contraseñas, claves API, cookies o dependencias ajenas.

## Decisión

**QA Gate: PENDING** por ausencia de prueba real de Yale y de ESM HTTP en navegador. La entrega corresponde a una **versión de desarrollo verificable parcialmente**, no a una versión 1.0 ni a una publicación estable.
