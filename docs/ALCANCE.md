# Documento de arquitectura y alcance — Fase 01

## Objetivo

Un museo documental y laboratorio criptográfico accesible desde GitHub Pages, Windows y Linux Mint, con trazabilidad por fuente e identificación del grado de certeza.

## Diseño de arquitectura

- SPA ligera usando hash routes (`#inicio`, `#codice`, `#evidencias`, `#cronologia`, `#cuaderno`, `#fuentes`).
- `index.html`: contenedor y navegación.
- `assets/css/styles.css`: 3 skins, responsive, accesibilidad básica.
- `assets/js/data.js`: datos históricos versionados (fuentes, fichas, secciones, cronología).
- `assets/js/app.js`: renderizado y eventos; almacenamiento local defensivo.
- Sin telemetría, cuentas, dependencias externas ni servicios de terceros en el runtime.
- Los apuntes se guardan por dispositivo y se pueden exportar.

## Contratos de datos futuros

**Folio**: `{id, label, sequenceIndex, sectionIds[], yaleCanvasId, imageServiceUrl, sourceUrl, rightsUri, size}`. No inventar numeración, manifest ni URLs IIIF.

**Transcripción**: `{folioId, system, version, transcriptionText, provenance, license, notes}`. Diferenciar transcripción de propuesta de lectura.

**Hipótesis**: `{id, claim, type, sources[], evidenceFor[], evidenceAgainst[], methodologicalLimits[], status}`.

**Anotación**: `{id, folioId?, title, body, date}`; en fases futuras podrá contener coordenadas y exportación/importación verificada.

## Hoja de ruta y criterios de aceptación

| Fase | Entregable | Criterio de salida |
|---|---|---|
| 01 | Fuentes, estructura, skins, archivo investigativo, cuaderno | UI operativa y documentación trazable |
| 02 | Interfaz premium consolidada, estados y accesibilidad | Auditoría UX teclado/móvil |
| 03 | Visor de digitalización oficial, paginación y zoom | Folios reales mapeados a manifest verificado y atribuidos |
| 04 | Navegación por folios, anotaciones ligadas a páginas | Persistencia y navegación consistentes |
| 05 | Atlas botánico y astronómico | Fichas con fuente y nivel de certeza |
| 06 | Transcripción y búsqueda en el texto | Corpus verificado con procedencia y licencia |
| 07 | Laboratorio estadístico y experimentos | Métodos reproducibles y nunca presentados como traducción |
| 08 | Enciclopedia de propuestas de descifrado | Soportes/objeciones citados |
| 09 | Cuaderno avanzado | Exportación, importación y recuperación robustas |
| 10 | Rendimiento, accesibilidad y opciones offline | Pruebas multiplataforma, tamaño y caché medidos |
| 11 | Auditoría release y GitHub Pages | QA documentado, sin errores críticos conocidos |

## Riesgos

- Derechos de imágenes, texto transcrito y derivados.
- Tamaño del manuscrito completo (no incrustar a ciegas).
- Cambios de endpoints, CORS y políticas IIIF del proveedor.
- Etiquetas folio / páginas y encuadernación histórica no necesariamente estable.
- Hipótesis de estudios nuevos no validadas por consenso.

**No se incluye un visor de los folios ni un laboratorio de descifrado en esta fase.**

## Estado tras la fase 02 (v0.2.0)

**Completado:** centro de personalización accesible, tres skins seleccionables, escala de lectura, control de movimiento, buscador global sobre los datos editoriales existentes, transiciones no bloqueantes, barra de lectura, control del menú móvil, mejoras de gestión del foco en modales y QA automatizado de escritorio/móvil.

**Sin completar:** integración y derechos de imágenes originales (fase 03), análisis de folios, transcripción, reconocimiento, estadísticas, importación de notas y paquete completo offline. La arquitectura no implica que dichas funciones estén presentes.

## Extensión de fase 3

La v0.3.0 añade visor IIIF, índice y consulta de folios a Yale, zoom limitado, favoritos y entrada al cuaderno con cita. No incorpora un dataset fotográfico offline ni confirma una traducción del texto. En entornos con bloqueo de CORS o de imágenes, está prevista la importación manual de manifiesto y el enlace al catálogo oficial. La capacidad de mostrar imágenes reales dependerá del acceso a Yale y debe verificarse en el equipo del usuario.
