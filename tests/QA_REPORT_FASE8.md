# 404 QA REPORT — VOYNICH 404 / Fase 8

**Versión:** 0.8.0 BETA · **Fecha:** 2026-10-12

## Resumen ejecutivo

Se implementó una enciclopedia de 15 fichas con fuentes, clasificación editorial, búsquedas, filtros, comparador y exportación. Los módulos originales de las fases 1–7 fueron conservados. Las pruebas de navegador son controladas por bloqueo de HTTP local en este entorno; no se ha acreditado ejecución integral real en Windows/Linux/GitHub Pages.

## Críticos

Ninguno reproducido dentro de las pruebas controladas. **No equivale a certificar ausencia de fallos reales.**

## Altos

- **H-01, pendiente de verificación:** conexión real Yale/IIIF y CORS; puede impedir el visor de originales.
- **H-02, pendiente de verificación:** navegador real ejecutando ESM mediante servidor local y arranque de lanzadores Windows/Linux; prueba E2E controlada no lo certifica.

## Medios

- **M-01:** la documentación de trabajos de 2026 puede evolucionar con nuevas revisiones; catalogación editorial puntual.
- **M-02:** persistencia depende del almacenamiento del navegador y puede perderse al limpiar datos; se ofrece exportación del cuaderno y de expedientes.

## Bajos

- Una comparación usa síntesis editoriales, no un motor automático de argumentación académica.

## Pruebas ejecutadas

| Comando | Exit code | Resultado |
|---|---:|---|
| `node tests/test_theories.mjs` | 0 | 24 PASS |
| `node tests/test_annotations.mjs` | 0 | 21 PASS |
| `node tests/test_atlas.mjs` | 0 | 20 PASS |
| `node tests/test_iiif.mjs` | 0 | 14 PASS |
| `node tests/test_transcription.mjs` | 0 | 38 PASS |
| `node tests/test_crypto.mjs` | 0 | 41 PASS |
| `python tests/qa_phase8.py` | 0 | 48 PASS; 0 excepciones JavaScript |
| `node --check assets/js/*.js` (bucle por archivo) | 0 | Todas las sintaxis PASS |
| `python -m compileall -q tests/qa_phase8.py serve.py` | 0 | Sintaxis Python PASS |
| HTTP servidor local + 10 peticiones `urllib` | 0 | 10/10 respuestas HTTP 200 |
| `zipfile.testzip` | 0 | Verificación final pendiente de empaquetado |

**Alcance de pruebas Chromium:** se transformaron temporalmente los módulos ESM a un bloque inline que ejecuta los mismos handlers, con localStorage simulado e IndexedDB e IIIF simulados. Se probaron tarjetas, filtros, favoritos, apertura de detalles, persistencia simulada, selección hasta tres, exportación JSON real del navegador, cuaderno, búsqueda global, menús, skins, móvil 390/320px y regresiones básicas. No se probó el mismo ESM desde una URL HTTP real porque Chromium devuelve `ERR_BLOCKED_BY_ADMINISTRATOR` al intentar acceder a `127.0.0.1`.

## Seguridad

Inspección estática: no hay llamadas de red dentro del módulo de teorías; usa referencias editoriales HTTPS predefinidas y escape de HTML; evita sobrescribir JSON de favoritos ilegible; no solicita permisos ni recopila telemetría. Sin pentest externo ni auditoría integral de módulos heredados.

## Compatibilidad y datos

Rutas de assets relativas a `index.html`. Datos guardados de fases anteriores sin migración/destrucción; nueva clave local de favoritos propia. GitHub Pages bajo subruta **pendiente de prueba**. Imágenes Yale dependen de un tercero.

## Gates

| Gate | Estado |
|---|---|
| Arquitectura | PASS |
| Implementación | PASS controlada |
| UX responsive | PASS controlada |
| QA | PENDING — prueba real HTTP no ejecutable |
| Seguridad | PASS en revisión estática de cambios; no completa |
| Release | BETA, STABLE no autorizado |

## Plan priorizado

1. Verificar en Windows/Linux el arranque HTTP, ESM y la consola en navegador real.
2. Verificar la consulta IIIF de Yale y la recuperación ante bloqueos CORS.
3. Comprobar migración/persistencia tras actualización desde 0.7.0 con datos reales.
4. Auditar GitHub Pages bajo `/VOYNICH-404/` antes de autorizar publicación estable.
