# VOYNICH 404 — Fase 4: marcas espaciales y detalle HD

## Qué hace

- Mantiene el índice IIIF, los marcadores y la última posición de lectura anteriores.
- Añade **detalle HD opcional**: pide una imagen IIIF de hasta 2800 píxeles de ancho cuando el usuario activa HD o supera 200% de zoom. **No es un visor por teselas**. El tamaño se solicita a Yale; disponibilidad y límites reales dependen de su servicio.
- Anotaciones personales colocadas sobre un punto del folio, con coordenadas relativas al borde de la fotografía (0 a 1), que mantienen su posición al aplicar zoom, hacer pan y cambiar de vista.
- Edición, eliminación con confirmación, lista contextual y botón para localizar cada marca.
- Filtros de índice por favoritos o folios con anotaciones, combinables con el buscador existente.
- Exportación e importación de anotaciones a JSON versionado con validación; la importación combina registros sin sustituir marcas existentes con el mismo identificador.
- Funciona sin cuentas ni servidores propios. Las anotaciones se almacenan localmente.

## Cómo colocar una marca

1. En **Folios originales**, carga un índice IIIF de Yale mediante conexión o importa el manifiesto JSON oficial.
2. Espera a que se muestre la fotografía del folio (no las ilustraciones conceptuales).
3. Pulsa **Marcar un punto** y haz clic o toca una zona de la fotografía. Aparece un formulario.
4. Escribe el título y la observación, pulsa **Guardar marca**. La numeración aparece encima de la imagen y en la lista.
5. Utiliza **Editar**, **Localizar** o **Eliminar** según necesites.
6. Pulsa **Exportar marcas JSON** como copia de seguridad y guárdala fuera del navegador.

## Compatibilidad con datos antiguos

- Se mantienen sin cambiar las claves `voynich404-notes-v1`, `voynich404-folio-bookmarks-v1`, `voynich404-last-folio-v1` y `voynich404-iiif-catalog-v1`.
- Las nuevas marcas viven en `voynich404-folio-annotations-v1` y **no sustituyen** las anotaciones generales del cuaderno antiguo.
- Un JSON importado con identificadores ya existentes no los sobreescribe. Esto evita duplicados, aunque no fusiona modificaciones realizadas independientemente a la misma marca.
- El navegador puede borrar `localStorage` si se limpian datos del sitio. Exporta el JSON y el cuaderno por separado.

## Límites y seguridad

- Hasta 800 marcas personales; título de 100 caracteres y contenido de 4000. Copias JSON de hasta 5 MB.
- Los campos importados se validan, se muestran usando `textContent` y no se ejecutan como HTML.
- No se transmite ningún texto del usuario a Yale. Sí se solicitarán imágenes IIIF a sus servidores.
- No se incluye una descarga masiva del manuscrito ni imágenes sin autorización verificada.
- Los permisos/CORS reales de Yale, la resolución que admite y la ejecución en equipos externos siguen por comprobar.

## Qué falta

- Probar directamente la disponibilidad del manifiesto, las imágenes y su API Image info.json desde Windows y Linux Mint.
- Integrar teselas, si Yale publica una descripción de tiles que soporte la implementación.
- Experiencia offline con caché selectiva en fases posteriores.
- Copia integral de los datos del usuario (actualmente hay exportación de notas generales y de marcas por separado).
