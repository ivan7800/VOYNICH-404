# 404 QA REPORT — VOYNICH 404 v0.4.0

## Resumen ejecutivo

Se han ejecutado pruebas con **Chromium controlado** sobre HTML/CSS/JS reales ensamblados en memoria por la restricción de navegación local del entorno. Las imágenes y manifiestos Yale se reemplazan **solo en las pruebas** por un fixture y una imagen SVG sintética; la aplicación de distribución intenta utilizar Yale directamente.

## Verificaciones ejecutadas

| Comando | Salida | Resultado |
|---|---|---|
| `node tests/test_iiif.mjs` | 14 asserts | PASS |
| `node tests/test_annotations.mjs` | 21 asserts | PASS |
| `python tests/qa_phase2_regression.py` | 39 comprobaciones | PASS |
| `python tests/qa_phase3.py` | 30 comprobaciones | PASS |
| `python tests/qa_phase4.py` | 27 comprobaciones | PASS |
| `python serve.py` + solicitud HTTP | HTTP 200 | PASS servidor |
| Chromium `page.goto(localhost)` | `ERR_BLOCKED_BY_ADMINISTRATOR` | PENDIENTE por bloqueo externo |
| Comprobación de Yale CORS e imágenes reales | No ejecutable desde este entorno | PENDIENTE |

## Defectos y límites

- No hay incidentes críticos reproducidos en las pruebas controladas.
- **ALTO funcional pendiente de verificación:** consulta real del manifiesto y carga de imágenes de Yale.
- **MEDIO:** no implementa teselas; HD solicita un recurso ancho y puede fallar según permisos y límites del servidor.
- **MEDIO:** exportación de cuaderno y marcas es independiente; no existe todavía restauración global integrada.
- **MEDIO:** tests no certifican la ejecución Windows/Mint ni GitHub Pages con módulos ES reales.

## Calidad

**Build controlado: PASS. QA real: PENDING. Release gate: BETA (no STABLE).** Sin puntuación 9.5/10 mientras falte validar la fuente real.

## Cómo repetir

Desde la raíz, con Node 20+ y Python con Playwright+Chromium disponibles, ejecuta los cuatro scripts anteriores. Para prueba manual utiliza `INICIAR_WINDOWS.bat` o `bash INICIAR_LINUX.sh` y verifica que los folios Yale se muestran, puedes poner y borrar una marca, exportar y restaurar JSON, cambiar de tema y navegar.
