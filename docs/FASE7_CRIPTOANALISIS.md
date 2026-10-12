# Fase 7 — Laboratorio de criptoanálisis experimental

## Datos utilizados
- Muestra atribuida de dos líneas f1r incluida en la fase 6.
- IVTFF EVA importado localmente por el usuario, con recuperación del corpus EVA guardado en IndexedDB.
- La transcripción EVA es representación editorial; un carácter EVA no garantiza correspondencia 1:1 con un glifo original.

## Experimentos implementados
1. **Comparación entre dos folios, metadatos $L=A/B o loci P/L:** recuentos, diversidad de tokens, entropía descriptiva (bits), longitud y divergencia Jensen–Shannon. Umbral de aviso con menos de 100 tokens en un grupo. No prueba significado ni diferenciación lingüística.
2. **N-gramas:** pares/triples consecutivos de tokens seguros que aparecen al menos dos veces. No cruzan línea ni tramos ambiguos.
3. **Posiciones:** caracteres EVA inicial/final y longitud de tokens, sin pretender identificar morfemas ni glifos.
4. **Permutación:** 20, 60 o 100 mezclas deterministas según la semilla. Conserva frecuencias de tokens y longitudes de segmentos seguros, pero no su secuencia. Calcula cuántos pares distintos se repiten dos o más veces. Devuelve observado, media, mínimo y máximo; no p-values inferidos ni desciframientos.

## Ejemplo de uso
1. Inicia la app por HTTP y entra en Criptoanálisis. Si todavía no has importado un corpus en EVA, aparecerá la muestra breve.
2. Para analizar más datos, descarga una transcripción de su propietario e impórtala de forma temporal aquí, o impórtala y guárdala desde Laboratorio EVA.
3. Elige comparación y folios, prueba «Actualizar secuencias», observa posiciones y ejecuta el control con semilla 404.
4. Exporta CSV y JSON. La exportación es un resultado de análisis, no un respaldo del corpus.

## Precauciones técnicas
- Se ignoran tokens con marcas editoriales de duda. Se separan segmentos para impedir que se creen pares ficticios cuando hay un token ambiguo.
- Comparar entropías o diversidad de muestras de distinto tamaño puede ser engañoso.
- La muestra f1r es útil para ensayar la herramienta, pero no para conclusiones sobre el códice.
- El corpus temporal no cambia la base IndexedDB del laboratorio EVA.
- HTML dinámico escapado; límites IVTFF preexistentes; CSV protegido frente a fórmulas de hoja de cálculo; los parámetros del informe JSON no incluyen el texto del corpus.

## Fuentes externas y atribución
- https://www.voynich.nu/transcr.html — EVA y problemas de transliteración.
- https://www.voynich.com/currier1.htm — Currier 1976, A/B y variación estadística.
- https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0260948 — métodos estadísticos aplicados al Manuscrito Voynich.

## Verificación
Ver tests/test_crypto.mjs y tests/qa_phase7.py. La validación UI usa DOM controlado e IndexedDB simulado; Chromium prohíbe abrir localhost en este entorno. Pendientes: navegador HTTP real, ZL3b completo, Yale y equipos del usuario.
