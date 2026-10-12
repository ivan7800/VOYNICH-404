# VOYNICH 404 — Informe QA de fase 6

**Fecha:** 2026-10-12 | **Versión:** 0.6.0 BETA | **Gate:** BETA / QA REAL PENDIENTE

## Cobertura verificada

| Comprobación ejecutada | Resultado | Condición |
|---|---:|---|
| Parser/análisis EVA (`node tests/test_transcription.mjs`) | 38 PASS | IVTFF breve + corpus sintético de 4.000 loci |
| Atlas (`node tests/test_atlas.mjs`) | 20 PASS | Funciones puras |
| IIIF (`node tests/test_iiif.mjs`) | 14 PASS | Manifiestos de pruebas |
| Anotaciones (`node tests/test_annotations.mjs`) | 21 PASS | Lógica de datos |
| Interfaz fase 6 (`python tests/qa_phase6.py`) | 42 PASS | Chromium 1440 / 390 / 320, datos e IndexedDB simulados |
| Regresión fase 5 (`python tests/qa_phase5.py`) | 36 PASS | Chromium con módulo JS adaptado a inline y servidor IIIF simulado |
| `node --check` en módulos JS | PASS | Syntax check |
| Servidor local con puerto libre 18966 | 6/6 HTTP 200 | `urllib.request` sobre recursos reales |
| Capturas escritorio / móvil | Obtenidas | Pantallas del laboratorio, no manuscrito histórico |

**Funciones comprobadas en UI:** navegación, carga de muestra, conteo de dudas, búsqueda exacta/parcial y resaltado, filtro de folios/loci, frecuencias por ámbito, CSV descargado, importación válida e inválida, persistencia simulada tras salir/regresar, limpieza confirmada, conservación del cuaderno/favoritos, enlace al visor y respuesta móvil sin desplazamiento horizontal.

## Límites de prueba

- Chromium no pudo visitar el servidor HTTP del proyecto en esta plataforma por restricción de administrador. Para estas pruebas se cargó el HTML y se reunieron los módulos para ejecución inline **sin modificar sus funciones**. No es una prueba nativa de importación ESM por HTTP.
- Los datos importados, el almacenamiento IndexedDB y el manifiesto IIIF se simularon para controlar el comportamiento. No se afirma que un navegador real pueda guardar el corpus completo o descargar folios originales desde Yale; son pruebas en el equipo del usuario pendientes.
- Se confirmó disponibilidad pública y formato de ZL3b mediante consulta documental a su página de origen, no se descargó el fichero completo en el entorno de desarrollo por una restricción de red. Las pruebas de capacidad utilizan corpus sintético, identificado como tal.
- No se ejecutó Windows CMD ni Linux Mint real; sí se inspeccionaron lanzadores y se probó servidor Python local.

## Hallazgos y riesgos

| ID | Gravedad | Observación | Tratamiento |
|---|---|---|---|
| F6-01 | ALTO externo | La disponibilidad real de manifiesto/fotos de Yale sigue sin verificarse (desde fases anteriores) | Mantener fallback y no publicar estable |
| F6-02 | MEDIO | Datos de investigación en IndexedDB se pierden si se borra almacenamiento del sitio | Mantener archivo original descargado, avisar usuario |
| F6-03 | MEDIO | Corpus externo sin licencia de redistribución explícita para este proyecto | No incluir archivo académico completo; importar localmente con atribución |
| F6-04 | MEDIO | Estadísticas EVA omiten tokens inciertos y no pueden representar todos los glifos | Criterio documentado, sin inferir significados |
| F6-05 | MEDIO | Navegación ESM real, persistencia real y lanzadores en equipos destino pendientes | Verificación manual antes de release |

**Seguridad, inspección:** entrada limitada a 2 millones de caracteres/20.000 líneas, parser restringido a EVA, texto escapado antes de insertar en DOM, sin carga de scripts del archivo, almacenamiento local, navegación externa a fuentes con `noopener noreferrer`. No se ha realizado una auditoría de penetración.

## Conclusión

**Build: PASS controlado. QA: PENDING real. Release: BETA.** No existe prueba suficiente para calificar la app como estable o asignar 9,5/10. La fase 7 puede trabajar sobre el núcleo funcional, preservando los bloqueos y las verificaciones pendientes.
