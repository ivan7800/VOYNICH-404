# Registro de fuentes — VOYNICH 404

Última revisión de enlaces e información pública: 12 de octubre de 2026.

| Fuente | Uso previsto | URL | Confianza / cautela |
|---|---|---|---|
| Yale · Beinecke MS 408 | Custodia, organización de las ilustraciones, historia, digitalización | https://beinecke.library.yale.edu/beinecke/collections/beinecke-cipher-voynich-manuscript | Primaria institucional; describe interpretación de las secciones como convencional |
| Yale Digital Collections · 2002046 | Visualización original y futura integración de imágenes | https://collections.library.yale.edu/catalog/2002046 | Registro oficial; manifest IIIF, CORS, API y derechos todavía deben comprobarse en la fase 3 |
| René Zandbergen · Radiocarbon dating | Intervalo C14, precisión y limitaciones | https://voynich.nu/extra/carbon.html | Fuente técnica secundaria; el C14 data soporte, no fecha exacta del trazo |
| René Zandbergen · Transliteration of the Text | Sistemas EVA y referencias a transcripciones | https://www.voynich.nu/transcr.html | No equivale a traducción ni constituye por sí solo permiso para redistribuir corpus |
| Layfield y Lisa Fagin Davis (2026) | Hipótesis de estructura por singuliones | https://doi.org/10.4000/16k0a | Hipótesis académica, no hecho demostrado ni traducción |

## Regla de publicación

- `Documentado`: declaración respaldada por documento, institución o análisis físico.
- `Hipótesis`: propuesta investigativa, incluso si ha pasado revisión, sin tratarla como consenso universal.
- `No resuelto`: cuestiones en debate o con evidencias insuficientes.
- Nuevos datos añadirán URL persistente, autor, fecha, método y limitaciones.
- Folios e imágenes sólo se incorporarán tras validar metadatos, atribución y condiciones de reutilización de las reproducciones concretas.

## Alertas

1. **No asumir 240 folios:** distintas publicaciones hablan de aproximadamente 240 *páginas*; el catálogo físico documenta otra cuenta de hojas/folios y desplegables. Evitar cifras ambiguas en la interfaz.
2. **No confundir EVA con descifrado:** EVA es un convenio de transliteración entre los más usados, no lengua traducida.
3. **No asumir propiedad de las digitalizaciones:** el códice es medieval; las reproducciones y sus metadatos deben revisarse por separado antes de empaquetarlas.
4. **No convertir una hipótesis reciente en hecho comprobado.**

## Actualización fase 3 (2026-10-12)

Se ha desarrollado un lector de manifiestos IIIF Presentation v2/v3 que intenta consultar la digitalización oficial directamente a Yale mediante `https://collections.library.yale.edu/manifests/2002046`, con alternativa `/manifests/oid/2002046` e importación local del JSON oficial. El visor usa las etiquetas y el orden de las entradas del manifiesto en vez de crear una lista de folios de forma especulativa.

**Estado de verificación:** la URL y el uso del IIIF de Yale están documentados en referencias públicas, pero el manifiesto e imágenes auténticas no han sido accesibles desde el entorno de pruebas. Las imágenes no se incluyen en la distribución. Más detalles: `FASE3_IIIF.md`.
