# QA y fixtures · VOYNICH 404 fase 3

## Comprobación recomendada

```bash
python3 tests/qa_phase3.py
python3 tests/qa_phase2_regression.py
node --check assets/js/iiif.js
node --check assets/js/viewer.js
node --check assets/js/app.js
python3 -m py_compile serve.py
```

- `qa_phase3.py`: 30 pruebas de visor y de conservación de comportamientos, con manifiesto IIIF 2 de **prueba**, respuesta simulada de Yale e imagen artificial.
- `qa_phase2_regression.py`: 39 verificaciones de la base anterior, incluyendo skins y cuaderno.
- `fixtures/`: IIIF v2/v3 SINTÉTICOS: no son digitalizaciones auténticas. Se usan exclusivamente en pruebas.
- `qa_phase2.py` y `smoke.py`: alias de compatibilidad que redirigen a la batería de regresión actual.

## Limitaciones

El Chromium de este entorno bloquea la navegación HTTP local por política administrativa. Ambas suites ejecutan HTML, CSS y los cuerpos de módulos JS reales ensamblados en un único script para pruebas, con mock de localStorage y de respuestas externas. Esto no equivale a test E2E real de importaciones ESM HTTP, de acceso a Yale, de los lanzadores Windows/Linux o GitHub Pages. Los resultados solo documentan lo probado.

Consulta `RESULTADOS_FASE3.md`, `REGRESION_FASE2.md` y el informe de PLAN.md.
