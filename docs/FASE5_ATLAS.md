# Fase 5 — Atlas botánico y astronómico (v0.5.0)

## Alcance entregado

Se integran 16 **fichas documentales de muestra** en cuatro categorías: Botánica (8), Astronomía (3), Zodíaco (3) y Cosmología (2). No equivalen a un catálogo exhaustivo del MS 408.

Cada ficha incorpora identificador estable, folio, categoría, descripción observable, límite de interpretación, términos de búsqueda y enlace de referencia. Se distinguen **observaciones** de **hipótesis contextuales**. Un ejemplo: f35v tiene paralelos iconográficos con ilustraciones de hiedra señalados en la bibliografía, pero ello no demuestra su identificación botánica. El conjunto de siete estrellas en f68r3 ha sido comparado con las Pléyades, sin una interpretación demostrada de las etiquetas.

No se asignan traducciones del voynichés ni nombres científicos de plantas como hechos comprobados.

## Interacción

1. El menú **Atlas botánico y astral** muestra las 16 fichas.
2. Busca un término o folio; filtra por disciplina.
3. Guarda fichas favoritas para recuperarlas desde este mismo navegador.
4. Selecciona de dos a tres fichas mediante **Comparar**. La comparación coloca juntas las descripciones originales y sus incertidumbres.
5. **Ver folio** navega al visor IIIF, intentando seleccionar el folio mediante su etiqueta oficial. Si no puede encontrarla en el índice, deja el visor operativo y muestra un aviso.
6. **Imágenes originales** consulta el manifiesto IIIF de Yale para mostrar miniaturas disponibles. No se sustituyen imágenes reales por otras simuladas; cuando no se obtiene la imagen aparecen **iconos esquemáticos, claramente etiquetados**. Los registros de imagen no se incluyen en el ZIP.
7. El buscador global incluye las fichas del atlas.

## Persistencia y datos

- `voynich404-atlas-favorites-v1`: solo almacena IDs de fichas, hasta 100 como máximo. No se envía ningún dato personal a Yale.
- No se modifican `voynich404-notes-v1`, `voynich404-folio-annotations-v1` ni `voynich404-folio-bookmarks-v1`.
- Los favoritos no disponen todavía de copia exportable independiente; anotar como mejora posterior. El cuaderno y las marcas de folios sí mantienen sus mecanismos de exportación.
- Cuando los favoritos contienen JSON ilegible, se bloquea la escritura sobre esa clave para evitar sobrescribir datos corruptos sin control.

## Fuentes principales

- Biblioteca Beinecke, Yale: https://beinecke.library.yale.edu/beinecke/collections/beinecke-cipher-voynich-manuscript
- Catálogo y facsímil de Yale: https://collections.library.yale.edu/catalog/2002046
- Zandbergen, descripción de las ilustraciones, con referencias a folios y advertencias editoriales: https://www.voynich.nu/illustr.html
- Zandbergen, descripción del manuscrito: https://www.voynich.nu/descr.html

El atlas describe ilustraciones, no plantea una nueva lectura del texto. Los límites de los grupos visuales son convencionales y pueden discutirse. Las transcripciones son una cuestión de la fase 6.

## Limitaciones y próximas comprobaciones

- **Yale/CORS/IIIF real no verificado**: el servidor remoto no es accesible desde el entorno automatizado actual. Probar con conexión normal Windows y Linux.
- Las etiquetas oficiales pueden usar formatos distintos de `f68r3`; el normalizador reconoce formato abreviado y expresiones «folio/recto/verso», pero debe validarse con el manifiesto real.
- No se incluyen las digitalizaciones en el repositorio. Su licencia y procedencia deben comprobarse antes de redistribuir imágenes descargadas.
- No hay identificación botánica demostrada de las páginas mostradas: se evitaron asignaciones de especies.
- Aún no se ofrece base de imágenes botánicas externas para una comparación fotográfica científica; no se debe presentar iconografía comparativa ilustrada sin crédito ni procedencia.

## Pruebas automatizadas

- `node tests/test_atlas.mjs` — dataset, filtros, normalización, favoritos y seguridad de referencias.
- `python tests/qa_phase5.py` — navegación real del DOM en Chromium, simulación explícita de manifiesto IIIF, favoritos, filtros, comparación, apertura de folios, notas, anotaciones, skins, móvil 390/320 px, errores JS.
- `node tests/test_iiif.mjs` y `node tests/test_annotations.mjs` — regresiones de parsers.

La batería Chromium ensambla los módulos para ejecutar en `set_content` bajo una política que bloquea HTTP local; **no equivale a una prueba integral del arranque por red o a una prueba con el servidor remoto**.
