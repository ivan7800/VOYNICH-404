# Integración IIIF · especificación de fase 3

## Origen

Origen documental: Beinecke Rare Book & Manuscript Library, Yale University, MS 408.

- Catálogo: https://collections.library.yale.edu/catalog/2002046
- Manifiesto: https://collections.library.yale.edu/manifests/2002046
- Endpoint alternativo probado solo a nivel de referencia documental (no accedido aquí): https://collections.library.yale.edu/manifests/oid/2002046

Se considera al manifiesto fuente primaria para **orden de imágenes**, **etiquetas de los lienzos (canvases)** y direcciones de imagen. No se inventan folios, páginas ni identificadores. Los números de entradas IIIF no equivalen necesariamente al número físico de hojas.

## Arquitectura

La app consulta el manifiesto desde el navegador. Si la petición falla por red o por política CORS, ofrece importación manual de JSON. Para garantizar que la edición se corresponde con el Voynich, los JSON importados deben identificarse como Voynich, MS 408 o 2002046. Las direcciones de imágenes deben ser HTTPS en `yale.edu` o subdominios. El visor genera variantes IIIF Image API a 1400 px y, si el servicio las rechaza, utiliza la dirección original del recurso cuando esté disponible.

## Estados

1. Sin índice → carga remota.
2. Índice recibido → listado + folio seleccionable.
3. Índice cacheado → acceso al catálogo local y petición de imágenes remotas.
4. Error remoto → mensaje, reintento, enlace a Yale e importación JSON.
5. Imagen fallida → mensaje en el lienzo, navegación disponible.

## Pendientes y límites

- El servidor Yale no ha sido consultable desde el contenedor de desarrollo, por lo que no se conoce con certeza el formato concreto de todos sus canvases ni las cabeceras de CORS activas.
- No se incluyen fotografías ni teselas en el ZIP; la opción de imágenes 100 % offline necesitaría comprobar licencias, elegir resolución y distribuir un paquete separado.
- El zoom de esta fase usa una imagen IIIF de ancho limitado con transformaciones CSS; un zoom de teselas para altísima resolución queda para fases posteriores.
- La vista conserva orden del manifiesto; no es una reconstrucción codicológica o del orden original del manuscrito.

## QA

Pruebas automatizadas controladas: `tests/qa_phase3.py` y `tests/qa_phase2_regression.py`.

Todas las pruebas de manifiestos usan **fixtures sintéticas expresamente identificadas como tests** y no autentican ni descargan Yale. Es obligatorio probar desde un navegador real conectado antes de afirmar que el manuscrito completo está operativo.
