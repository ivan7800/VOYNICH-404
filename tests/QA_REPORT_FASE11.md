# QA REPORT — VOYNICH 404 v0.11.0 RC1 (2026-10-12)

## Resumen
Auditoría de v0.10.0: **un defecto real de offline** encontrado y corregido. `sw.js` no precargaba `assets/css/offline.css` y `assets/js/offline.js`, usados por `index.html`. Solución: precarga completa y nueva versión de caché `voynich-404-shell-v0.11.0`.

## Evidencia ejecutada
- `node tests/test_annotations.mjs` — PASS 21
- `node tests/test_atlas.mjs` — PASS 20
- `node tests/test_crypto.mjs` — PASS 41
- `node tests/test_iiif.mjs` — PASS 14
- `node tests/test_notebook.mjs` — PASS 38
- `node tests/test_theories.mjs` — PASS 24
- `node tests/test_transcription.mjs` — PASS 38
- Total unitarias: **196**
- `python tests/test_release_integrity.py` — PASS **32/32** comprobaciones
- `node --check assets/js/*.js sw.js` — PASS individual (comandos ejecutados en bucle)
- HTTP Python de desarrollo: pendiente verificar de modo integrado en navegador.

## No ejecutables / pendientes
- Chromium HTTP: `net::ERR_BLOCKED_BY_ADMINISTRATOR` al navegar a `127.0.0.1`; no equivale a un defecto del producto.
- Imágenes auténticas Yale IIIF, compatibilidad CORS, corpus completo ZL3b y restauración IndexedDB real: sin certificación.
- Navegación offline real tras instalar SW, ciclo de actualización, instalación PWA y persistencia tras cambio de puerto: sin certificación.
- Lanzadores en Windows/Linux reales y GitHub Pages bajo subruta: no ejecutados.

## Riesgos
- ALTO: visor central depende de Yale externo, cuyo acceso real no se ha certificado.
- MEDIO: cambiar de puerto local cambia origen web y puede hacer invisibles los datos del origen anterior; no se borran.
- MEDIO: la caché PWA no sustituye una copia de seguridad de datos del usuario.
- MEDIO: la cobertura E2E en navegador real está incompleta.

## Gate
**RC1 — STABLE BLOQUEADO** hasta superar E2E offline, Yale y persistencia real. No publicar sin validación funcional local.

## Plan de validación manual
1. Iniciar desde `INICIAR_WINDOWS.bat` o `bash INICIAR_LINUX.sh`. Anotar la URL/puerto.
2. Visitar atlas, cuaderno, EVA, criptoanálisis y teorías; revisar consola y errores de carga.
3. Crear nota; recargar en el mismo puerto y comprobar persistencia. Exportar JSON.
4. Abrir visor de Yale y confirmar imágenes, CORS, anterior/siguiente y zoom.
5. Abrir DevTools > Application > Service Workers, comprobar instalación. Recargar online, desconectar red y recargar; el shell debe seguir visible.
6. Volver online, comprobar que las notas permanecen; probar importación IVTFF real.
7. Antes de GitHub Pages, servir el proyecto bajo `/VOYNICH-404/` y repetir navegación, SW, assets y enlaces.
