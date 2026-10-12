# Fase 6 — Laboratorio de transliteración EVA

## Propósito

Estudiar el texto del manuscrito Voynich por su **transliteración gráfica**, sin implicar descifrado ni traducción. Incluye un pequeño extracto auténtico de `f1r` como demostración y acepta archivos IVTFF externos para analizar el corpus completo desde el navegador del usuario.

## Fuentes y derechos

- Manuscrito original, Beinecke MS 408: https://collections.library.yale.edu/catalog/2002046
- Historia del alfabeto EVA, explicación y enlaces a transcripciones por René Zandbergen: https://www.voynich.nu/transcr.html
- Archivo IVTFF recomendado: `ZL3b-n.txt`, Zandbergen–Landini, versión 3b, 13/05/2025: https://www.voynich.nu/data/ZL3b-n.txt
- Especificación de estructura IVTFF v2.0: https://www.voynich.nu/software/ivtt/IVTFF_format.pdf

La muestra incluida reproduce **dos líneas** `f1r.1` y `f1r.2` del archivo ZL3b, identificadas como cita breve. No se redistribuye el conjunto completo ZL3b: las condiciones para redistribuir transcripciones académicas completas no están cubiertas por la licencia MIT del código de esta aplicación. El usuario importa su copia local desde el enlace de la fuente.

## Flujo

1. Abre **Laboratorio EVA** en el menú.
2. Examina la muestra breve para entender los límites estadísticos.
3. Pulsa **Obtener ZL3b original** y descarga el archivo `.txt` desde la fuente original.
4. Vuelve a la app, pulsa **Importar IVTFF**, elige el archivo y revisa el total de folios/líneas.
5. Filtra por folio y por tipo de locus: `P` (párrafo), `L` (etiqueta), `C` (círculo) y `R` (radio).
6. Busca secuencias EVA exactas o parciales, sin expresiones regulares.
7. Compara frecuencias de formas, letras EVA y pares de letras; exporta un CSV de formas frecuentes.
8. Usa **Abrir folio en visor** para contrastar la transcripción con la imagen si Yale está accesible.
9. **Volver a muestra** borra exclusivamente la copia importada del laboratorio después de confirmar. No borra cuaderno, favoritos ni anotaciones.

## Modelo y procesamiento

- `assets/js/transcription-core.js`: parser puro de IVTFF `Eva-` y `EvaT`, lector por folio y locus, estadística, búsqueda y exportación CSV.
- `assets/js/transcription.js`: UI y IndexedDB (`voynich404-transcription-v1`, object store `files`, entrada `corpus`).
- `assets/css/transcription.css`: layout responsive y accesibilidad del laboratorio.
- Almacenamiento local-first; sin API backend ni envío de corpus al desarrollador.
- Hasta **2 millones de caracteres** y 20.000 líneas; máximo 5.000 caracteres por línea. No se importa HTML ni se ejecuta código del archivo.
- Los controles `<%>`, `<$>` y las notas `<!...>` son marcadores editoriales; se eliminan para cálculo sin alterar la visualización de la línea original.
- Cadenas con corchetes, llaves, `<->`, signos de interrogación, códigos `@nnn;` u otros elementos no alfabéticos se excluyen de las frecuencias **como unidades completas**, para no forzar una lectura. Esta política es conservadora y subcuenta elementos del corpus; no representa una transcripción crítica definitiva.
- Las 'palabras' de la UI son **tokens separados por delimitadores IVTFF**, no unidades lingüísticas demostradas. Las cifras no equivalen al recuento de glifos manuscritos: EVA puede codificar un glifo o ligadura con múltiples letras.
- Las grafías con marcas desconocidas se mantienen visibles para la revisión de la imagen; no son rellenadas automáticamente.
- Se respetan las etiquetas de folios sin deducir el orden de lectura correcto.

## Datos y migración

Las claves anteriores de favoritos y anotaciones no se modifican. El corpus vive en IndexedDB y se recupera al visitar de nuevo el laboratorio; si IndexedDB no está disponible, se mantiene solo durante la vista actual con un aviso. La limpieza pregunta antes de eliminar el corpus importado. El archivo original en disco no se elimina ni modifica. Para conservar una copia antes de sustituirlo, mantén el `.txt` descargado: la app no proporciona respaldo binario del corpus importado.

## Limitaciones verificables

- No se ha probado en esta ejecución la descarga/carga de `ZL3b-n.txt` dentro de Chromium mediante una conexión directa a la web; se ha confirmado públicamente la referencia y estructura del archivo.
- No se garantiza que todas las variantes históricas y extraoficiales de IVTFF funcionen; la versión objetivo es IVTFF 2.0 EVA.
- No hay OCR ni alineación por coordenadas con los glifos de Yale; saltar al folio es una asociación a nivel de página.
- Las frecuencias no identifican idioma, función ni traducción.
