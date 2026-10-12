# 404 QA REPORT — VOYNICH 404 fase 7

## Resumen ejecutivo
Fase 7 implementada sobre v0.6.0 sin eliminar atlas, visor, cuaderno o EVA. Funciones exploratorias que no equivalen a desciframiento.

## Pruebas PASS
- 41 pruebas unitarias del nuevo módulo (matemáticas, segmentos ambiguos, valores inválidos, CSV, randomización reproducible).
- 38 pruebas de transcripción heredadas.
- 20 pruebas atlas, 14 IIIF y 21 anotaciones.
- 37 comprobaciones de interfaz Chromium controlado: navegación, filtros, exportación, importación, recuperación simulada y móvil.
- HTTP 200 para `index.html` con servidor Python verificado fuera de Chromium.

## Pruebas FAIL / bloqueadas
- **Navegación real Chromium → localhost:** BLOCKED BY ADMINISTRATOR, política del entorno. No equivale a fallo de la app.
- **Yale IIIF y CORS real:** no ejecutada. Riesgo previo.
- **ZL3b completo e IndexedDB real por HTTP:** no ejecutada. Mocks usados para la UI.
- **Windows/Linux Mint y GitHub Pages:** no ejecutadas.

## Bugs corregidos
- La exclusión de tokens ambiguos podía haber unido artificialmente palabras adyacentes al calcular n-gramas: ahora se segmenta en cada token incierto.
- Entropía uniforme de un solo símbolo normalizada a +0 en lugar de -0.
- Una secuencia asíncrona podía mostrar resultados obsoletos tras modificar los parámetros: invalidación con versión de cálculo y botón restaurado.

## Gates
- Implementación controlada: PASS.
- QA final: PENDING REAL.
- Release: BETA; NO STABLE.

## Limitaciones metodológicas
- EVA no representa necesariamente unidades gráficas elementales; la interpretación de la divergencia y entropía es descriptiva.
- No existe prueba de hipótesis estadística formal en esta fase; no atribuir traducciones ni idiomas.
