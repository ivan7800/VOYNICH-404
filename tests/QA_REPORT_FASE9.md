# 404 QA REPORT — VOYNICH 404, fase 9

## Resumen ejecutivo

Cuaderno avanzado implementado sin modificar el almacenamiento original de notas. Se separa la validación pura (`notebook-core.js`) de la UI (`notebook.js`), con esquemas versionados, control de conflictos y referencias a entidades del archivo. No se ha publicado nada.

## Incidencias detectadas y corregidas

- **MEDIO:** la flor decorativa `.page-head::after` heredada sobresalía del ancho móvil (390 px). Corregido: se desactiva ese ornamento bajo 750 px; validado en 390 y 320 px.
- **MEDIO preventivo:** datos corruptos no deben convertirse silenciosamente en un cuaderno vacío. Implementado bloqueo de escritura en ese estado; validación controlada superada.

## Verificaciones realizadas

| Comando / prueba | Resultado |
|---|---|
| `node tests/test_notebook.mjs` | 38 PASS / exit 0 |
| `node tests/test_annotations.mjs` | 21 PASS / exit 0 |
| `node tests/test_atlas.mjs` | 20 PASS / exit 0 |
| `node tests/test_crypto.mjs` | 41 PASS / exit 0 |
| `node tests/test_iiif.mjs` | 14 PASS / exit 0 |
| `node tests/test_theories.mjs` | 24 PASS / exit 0 |
| `node tests/test_transcription.mjs` | 38 PASS / exit 0 |
| `python tests/qa_phase9.py` | 47 PASS / sin excepciones JS; Chromium controlado |
| `node --check` de todos los JS | exit 0 |

**196 comprobaciones unitarias**, **47 comprobaciones de navegador controlado**. No representan 243 escenarios E2E independientes: los tests tienen diferentes alcances.

## Pruebas manuales pendientes

- Cargar ES Modules desde el servidor local real con Chromium en Windows/Linux: **no ejecutable aquí**, `ERR_BLOCKED_BY_ADMINISTRATOR`.
- Guardar/recargar y verificar persistencia `localStorage` real en el mismo origen HTTP: **pendiente**.
- Conexión y CORS de Yale: **pendiente**.
- Despliegue GitHub Pages `/VOYNICH-404/`: **pendiente**.

## Seguridad

Ningún secreto incluido; se escapa texto del usuario en HTML; se aceptan solo IDs reconocidos para teoría/atlas; límites en notas, expedientes y backups; datos corruptos bloquean escritura; importación fusiona, no reemplaza. El historial `voynich404-notes-v1` permanece intacto. No existe autenticación, servidores ni telemetría propios.

## Gate

**QA: PENDING real. RELEASE: BETA.** No declarar STABLE hasta verificar los escenarios esenciales pendientes.
