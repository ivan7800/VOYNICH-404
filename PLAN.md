# PLAN — VOYNICH 404

**Versión:** 0.9.0 BETA  
**Tipo:** Web local-first / HTML, CSS, ES Modules / Windows, Linux Mint, GitHub Pages  
**Fase actual:** 9/11 — Cuaderno avanzado del investigador  
**Estado:** Implementación y QA controlada realizadas; validación real de ESM HTTP en navegador y datos Yale pendiente.

## Fase 9 — Estado

- [x] Conservar el atlas, el visor IIIF, EVA, criptoanálisis, enciclopedia y preferencias.
- [x] Nueva vista del cuaderno con expedientes personales y asociación a notas.
- [x] CRUD de notas, etiquetas, búsqueda, filtros y vínculos a folios/teorías/atlas.
- [x] Lectura de datos anteriores y migración no destructiva a una clave versionada.
- [x] Exportación completa JSON e importación de copias v2 y exportaciones v1 mediante fusión.
- [x] Confirmación antes de borrar notas/expedientes y conservar notas al borrar un expediente.
- [x] Validación de esquemas, límites, bloqueos ante datos corruptos y escapado HTML.
- [x] Pruebas unitarias y de navegador controlado, escritorio y móvil.
- [ ] Verificar ESM desde HTTP real en Chromium — acceso a `localhost` bloqueado por el entorno.
- [ ] Verificar notas persistentes tras recarga real en origen HTTP y lanzadores Windows/Linux.
- [ ] Verificar integraciones externas con Yale y despliegue bajo subruta GitHub Pages.

## Comprobaciones

| Área | Resultado | Evidencia |
|---|---|---|
| Nuevo módulo | 38 PASS | `node tests/test_notebook.mjs` |
| Módulos unitarios heredados | 158 PASS | tests `.mjs` individuales |
| Interfaz fase 9 | 47 PASS | `python tests/qa_phase9.py`, navegador Chromium controlado |
| Sintaxis ESM | PASS | `node --check assets/js/*.js` |
| HTTP local | PASS parcial | `urllib.request` a servidor Python (Chromium bloqueado) |
| Persistencia real tras recarga | NO EJECUTABLE | Entorno HTTP de Chromium bloqueado |
| Yale / condiciones reales IIIF | NO EJECUTABLE | Conexión externa no verificada |

## Gates

- Arquitectura: **PASS** — capa lógica de datos independiente del DOM.
- Implementación: **PASS controlado** — operaciones probadas con almacenamiento simulado.
- UX: **PASS controlado** — escritorio y viewport 390/320 px.
- QA: **PENDING real** — no confundir simulación con conexión HTTP verificable en navegador.
- Seguridad: **PASS inspección parcial** — importaciones limitadas, escape HTML, protección al detectar datos corruptos.
- Release: **BETA** — no declarar STABLE ni publicar todavía.

## Riesgos y siguientes fases

- **Alto heredado:** la conexión IIIF Yale puede fallar por permisos/CORS o acceso externo.
- **Medio:** el almacenamiento local tiene cuotas y es sensible al origen HTTP y la eliminación de datos del navegador.
- **Medio:** el visor de imágenes y la importación del corpus completo siguen sin prueba de integración real.
- **Fase 10:** optimización, accesibilidad, funcionamiento offline (cuando sea técnicamente viable).
- **Fase 11:** auditoría final, pruebas de publicación, cierre de incidencias y release.


## Fase 10 — 2026-10-12
- [x] Añadir manifiesto e iconos locales.
- [x] Precarga offline del shell y scope relativo.
- [x] Indicador de conectividad y reduced motion.
- [ ] Validación E2E de instalación real, Yale y offline en equipos objetivo.
- Estado: BETA; pendiente gate QA real.

## Fase 11 — 2026-10-12
- [x] Inventario del paquete v0.10.0 (100 archivos).
- [x] Auditoría de módulos unitarios (7 ejecutables; todos PASS).
- [x] Hallazgo y corrección de dos recursos omitidos de la caché PWA.
- [x] Prueba de integridad del shell y dependencias: 32/32 PASS.
- [x] Sintaxis JavaScript y empaquetado verificados.
- [ ] E2E Chromium HTTP: bloqueado por política de administrador.
- [ ] Yale IIIF y corpus ZL3b completos en navegador real.
- [ ] Instalación PWA, actualización, offline y persistencia entre sesiones reales.
- [ ] Comprobar despliegue GitHub Pages bajo subruta y dispositivos Windows/Linux.
- Gate QA: BLOCKED para STABLE; RC2 disponible para validación manual, con actualización PWA accionable.
- Gate Release: RC2 — NO PUBLICADO.
