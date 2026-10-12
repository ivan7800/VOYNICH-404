# 404 QA REPORT — VOYNICH 404 v0.5.0 BETA

Fecha: 2026-10-12 · Fase 5 de 11 · objetivo: atlas botánico y astronómico.

## Resumen ejecutivo

**Implementado:** navegación integrada, 16 fichas referenciadas, buscador/disciplinas, favoritos locales, comparación de hasta tres, solicitud de miniaturas a Yale y apertura del folio seleccionado en visor existente. **No se han descargado ni embebido folios oficiales** en el ZIP.

## Inventario de verificación

| Comando/ámbito | Resultado observado | Limitación |
|---|---|---|
| `node tests/test_atlas.mjs` | EXIT 0 · 20 PASS | Modelo de datos y filtros solamente |
| `node tests/test_iiif.mjs` | EXIT 0 · 14 PASS | Fixtures IIIF v2/v3 |
| `node tests/test_annotations.mjs` | EXIT 0 · 21 PASS | Validación y utilidades de anotaciones |
| `python tests/qa_phase5.py` | EXIT 0 · 36 PASS, 0 errores JS | Chromium con `set_content`, storage y Yale simulados |
| `node --check assets/js/*.js` (cada módulo) | EXIT 0 · sintaxis correcta | Análisis sintáctico, no prueba ESM sobre HTTP |
| HTTP servidor local 7 rutas | HTTP 200 en 7/7 rutas | No prueba ejecución JS/ESM de Chromium sobre HTTP |
| Capturas Chromium 1440, 390, 320 px | Render correcto, sin scroll horizontal 390/320 | Capturas con iconos esquemáticos / Yale simulado |

## Hallazgos / clasificación

- **ALTO / pendiente — IIIF real:** desde el entorno actual no se verifica que Yale permita CORS ni que entregue los folios/miniaturas/HD al navegador. Fallback documental y enlace Yale disponibles.
- **MEDIO / pendiente — ejecución final:** Chromium bloquea la navegación a localhost (`ERR_BLOCKED_BY_ADMINISTRATOR`). La compilación ESM en servidor y los lanzadores reales deben probarse en equipos destino.
- **MEDIO / conocido — favoritos atlas:** localStorage se elimina al limpiar datos del sitio. Las notas y las marcas tienen exportación, los favoritos de atlas no tienen respaldo independiente en esta fase.
- **BAJO / pendiente — etiquetas IIIF:** las referencias de los folios pueden requerir ajustes al examinar el manifiesto real de Yale.

## Seguridad

No se han añadido frameworks, tokens ni credenciales. Los títulos y descripciones insertados como HTML se escapan; las URLs de miniaturas se restringen a HTTPS bajo dominio `yale.edu`. Favoritos locales validados, IDs conocidos, duplicados eliminados. Si el JSON local es ilegible se evita escribir sobre esa clave. No hay telemetría.

## Regresión

Las pruebas Chromium confirman navegación a cuaderno, creación y conservación de nota, persistencia de skins, funcionamiento de favorito de visor, zoom/reset, anotación espacial y vuelta al atlas. Los tests IIIF y anotaciones preexistentes también pasan.

## Release Gate

**BETA / BLOQUEADO PARA STABLE.** El atlas puede entregarse para pruebas locales; no procede declarar la experiencia completa ni un 9,5/10 mientras no se hayan probado el servidor Yale real, los lanzadores y el despliegue de GitHub Pages.

## Plan priorizado

1. En Windows y Linux, probar `INICIAR_*`, navegación al atlas y al visor, miniaturas de Yale, zoom y lectura de folio.
2. Si Yale bloquea CORS, documentar error reproducible y adoptar una solución compatible con sus condiciones de servicio (no sortear limitaciones de red por medios inseguros).
3. Probar subruta GitHub Pages y recarga del hash, revisar consola, botones, CSP y versiones de caché si corresponde.
4. Fase 6: corpus de transcripción EVA con procedencia, estadísticas y búsqueda sin traducciones ficticias.
