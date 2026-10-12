# VOYNICH 404 — v0.11.1 RC2

**Fase 11 / 11 · Auditoría y preparación de release**

Esta candidata incluye el shell PWA completo y un botón para activar actualizaciones disponibles. El navegador debe abrirse desde HTTP(S), no `file://`. La instalación, actualización y navegación offline reales en Windows/Linux/GitHub Pages siguen pendientes de validación. Ver `tests/QA_REPORT_FASE11.md`.


## Novedad en la fase 9 — Cuaderno avanzado

En **Mi cuaderno** puedes crear expedientes de investigación, escribir y editar observaciones, aplicar etiquetas, vincular folios originales, hipótesis o fichas del atlas y buscar o filtrar tus registros. Eliminar un expediente no elimina sus notas. Las notas antiguas se recuperan desde `voynich404-notes-v1` y se migran al primer guardado a `voynich404-notebook-v2` conservando intacta la clave original.

**Copia de seguridad:** pulsa **Exportar copia JSON** para guardar tus datos fuera del navegador. **Importar / fusionar** admite copias v2 o exportaciones v1, sin sobrescribir registros existentes con igual identificador. Si el almacenamiento local se detecta corrupto, se bloquean nuevas escrituras hasta recuperar los datos.

Consulta `docs/FASE9_CUADERNO.md` para límites y pruebas. El almacenamiento local depende del origen web (incluido el puerto), por lo que al cambiar de puerto puede parecer que han desaparecido notas aunque sigan en el origen anterior.

### Verificación específica

```bash
node tests/test_notebook.mjs
python tests/qa_phase9.py
```

La batería de Chromium se realizó con módulos inline y `localStorage` simulado por restricciones del entorno, no como prueba de integración real. El acceso efectivo a las imágenes de Yale, los lanzadores en equipos reales y la carga ESM desde HTTP aún deben verificarse.

## Inicio

- **Windows:** extrae el ZIP y ejecuta `INICIAR_WINDOWS.bat` (requiere Python 3).
- **Linux Mint:** extrae el ZIP y ejecuta `bash INICIAR_LINUX.sh` (requiere Python 3).
- **Manual:** `python3 serve.py` y abre la URL que aparece (intenta 8044 y puertos libres siguientes).
- **GitHub Pages:** sube el **contenido** del ZIP a la raíz del repositorio, de modo que `index.html` quede en la raíz. En Settings → Pages selecciona Deploy from a branch, rama `main` y carpeta `/(root)`. La URL de un repositorio `VOYNICH-404` sería `https://TU_USUARIO.github.io/VOYNICH-404/`. La app usa rutas relativas para esa subruta, pero todavía requiere una prueba funcional allí. Ninguna publicación se ha efectuado.

No se recomienda abrir `index.html` con `file://` porque ES modules dependen de un servidor HTTP.

## Funciones

1. Archivo histórico, cronología, evidencias, fuentes y tres temas (Biblioteca, Pergamino y Laboratorio).
2. Búsqueda global de secciones, evidencias y fichas del atlas.
3. **Atlas fase 5:** 16 fichas documentadas (8 botánicas, 3 astronómicas, 3 zodiacales y 2 cosmológicas). Filtros, búsqueda, favoritos, comparación de hasta tres y vínculos al visor.
4. **Miniaturas opcionales:** solicita imágenes del manifiesto IIIF Yale; si no cargan, iconos esquemáticos identificados y fichas textuales siempre disponibles.
5. Visor de folios IIIF, navegar entre páginas, buscar, marcar favoritos, zoom, HD solicitado y anotaciones sobre la página.
6. **Laboratorio EVA (fase 6):** muestra auténtica de dos líneas `f1r` y carga de corpus IVTFF EVA completo mediante archivo local del usuario. Índice por folio y locus, búsqueda exacta y parcial, frecuencias de tokens, caracteres y pares de caracteres EVA, exportación CSV (UTF-8, separador `;`, con procedencia y protección de celdas) y salto al visor.
7. **Criptoanálisis experimental (fase 7):** perfiles comparados entre dos folios, etiquetas de párrafos frente a texto etiquetado y metadatos IVTFF `$L=A/B`; entropía descriptiva, divergencia Jensen–Shannon, secuencias repetidas (2–3 tokens), frecuencias por posición y un control aleatorio con semilla configurable (20/60/100 iteraciones). Exportación CSV de secuencias y JSON de resultados.
8. Cuaderno local con exportación JSON y copia/importación de anotaciones de folio.

## Privacidad, almacenamiento y fuentes

No se envían notas, favoritos ni corpus importados a ningún servidor. Se guardan en el almacenamiento del navegador; las imágenes se consultan directamente a Yale cuando solicitas el visor/miniaturas. Borrar datos del sitio puede eliminarlos: exporta periódicamente las notas y las marcas de folio (los favoritos de atlas aún no tienen exportación propia).

Las transcripciones importadas desde el laboratorio EVA se guardan en IndexedDB cuando está disponible. La fase 7 puede recuperarlas sin duplicar los datos; su importación IVTFF temporal NO sobrescribe lo guardado y se pierde al salir del laboratorio. La muestra de dos líneas es una cita breve de Zandbergen–Landini (2025); **el corpus completo no se incluye**. Obtén `ZL3b-n.txt` directamente desde [voynich.nu](https://www.voynich.nu/data/ZL3b-n.txt) e impórtalo en el laboratorio. La licencia MIT de la app no cubre el corpus académico de terceros.

Fuentes: [Yale](https://collections.library.yale.edu/catalog/2002046), [Beinecke](https://beinecke.library.yale.edu/beinecke/collections/beinecke-cipher-voynich-manuscript), [Zandbergen, ilustraciones](https://www.voynich.nu/illustr.html). Las divisiones del manuscrito son convencionales; no hay traducción verificada ni identificaciones botánicas definitivas.

**Importante:** el ZIP no incluye imágenes originales de Yale. Su utilización y redistribución dependen de las condiciones del proveedor. Los iconos de las tarjetas no reproducen páginas del Voynich y se identifican como esquemáticos.

## Estado / límites

Se ha probado el DOM en Chromium con un manifiesto IIIF y una imagen de pruebas **sintéticos**. No está verificada la disponibilidad/CORS de los servidores Yale desde un navegador conectado, ni el arranque de los lanzadores en Windows y Linux. El zoom HD solicita 2.800 px pero no usa teselas. No llamar STABLE hasta superar pruebas reales. Ver `PLAN.md`, `tests/QA_REPORT_FASE7.md` y `docs/FASE7_CRIPTOANALISIS.md`.

## Pruebas

```bash
node tests/test_crypto.mjs
node tests/test_transcription.mjs
node tests/test_atlas.mjs
node tests/test_iiif.mjs
node tests/test_annotations.mjs
python tests/qa_phase7.py   # Chromium controlado (no HTTP real)
python tests/qa_phase6.py  # regresión previa, adaptada solo si corresponde
python tests/qa_phase5.py  # regresión del atlas adaptada a v0.6.0
```

Para repetir la auditoría de esta entrega: `python tests/test_release_integrity.py` y `node tests/test_offline_update.mjs`, además de los siete `tests/test_*.mjs` de lógica. La prueba de actualización usa dobles de Service Worker; no sustituye a la prueba en un navegador real. Los tests Chromium necesitan Playwright y Chromium instalados; las pruebas unitarias necesitan Node 18+.

Licencia del código: `LICENSE`. No determina las condiciones de uso de digitalizaciones externas.

## Interpretación del laboratorio F7

Los resultados describen cadenas de una transliteración, no glifos de un idioma descifrado. La divergencia entre muestras no demuestra idiomas diferentes. Las comparaciones con menos de 100 tokens por grupo están marcadas como exploratorias; el umbral es un aviso de prudencia, no una prueba de significación. El control aleatorio mezcla tokens sin cruzar límites de línea ni lecturas dudosas. Utiliza el mismo vocabulario y longitudes de los tramos inequívocos. El archivo de resultados incluye parámetros y semilla, pero no el corpus completo.

Investigaciones y cautelas metodológicas: [Currier (1976)](https://www.voynich.com/currier1.htm), [Zandbergen sobre EVA](https://www.voynich.nu/transcr.html), [estadística Voynich, PLOS One (2022)](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0260948).


## Fase 8 — Enciclopedia

En el menú **Teorías y descubrimientos** se incluyen **15 expedientes documentales** agrupados en hallazgos, propuestas, debates y atribuciones históricas. Cada expediente contiene:

- resumen editorial y participantes;
- observaciones o argumentos a favor;
- límites y objeciones;
- comprobaciones futuras propuestas;
- enlaces HTTPS a publicaciones e instituciones;
- estado de evidencia **cualitativo**, no una probabilidad matemática.

El buscador, los filtros acumulables, la ordenación, los favoritos locales y la comparación de hasta tres fichas son operativos. «Anotar» traslada una referencia al cuaderno **sin guardar automáticamente**: confirma con el botón de guardar. «Ver folio» abre el visor Yale si está disponible. Los favoritos tienen clave independiente `voynich404-theory-favorites-v1` y no modifican los datos de fases anteriores.

**Exportación:** si la mesa contiene expedientes, se exportan esos; si no, se exportan los resultados visibles. Se descarga JSON `schemaVersion: 1` con sus fuentes. Exportar no borra información.

### Criterio histórico

- Radiocarbono: fecha el **pergamino**, no necesariamente la escritura.
- Currier A/B: estilos estadísticos, no prueba de dos lenguas.
- Cinco escribas: propuesta paleográfica; existe crítica reciente **en prepublicación**.
- Singuliones (2026): hipótesis de reordenación; **no es un descifrado**.
- Roger Bacon: la atribución histórica es incompatible con la datación del soporte.
- Ninguna hipótesis expuesta se convierte en traducción demostrada por estar publicada.

### Seguridad y persistencia

No requiere cuentas ni backend. Los campos de usuario se tratan como texto; los enlaces proceden de un catálogo editorial fijo; las exportaciones no ejecutan código. Favoritos y cuaderno se guardan solo en el navegador, sujetos a la disponibilidad de `localStorage`. Antes de limpiar datos del navegador, exporta tus notas.

### Pruebas de esta fase

Ejecutar desde la raíz:

```sh
node tests/test_theories.mjs
python tests/qa_phase8.py
```

Para probar todas las pruebas unitarias existentes, consulta `tests/QA_REPORT_FASE8.md`. La prueba de Chromium se ejecutó con módulos inline y almacenamiento simulado debido a restricciones de acceso HTTP local del entorno; los módulos ESM reales bajo HTTP, la disponibilidad Yale y los lanzadores de los sistemas de destino siguen pendientes. **No es una release estable**.


## Fase 10 — PWA / offline

La aplicación incluye manifest y Service Worker para precargar su shell local. Tras la primera visita conectada, las secciones internas pueden funcionar sin conexión. Yale y enlaces externos no están disponibles offline. No se borra ni migra el cuaderno. Véase `docs/FASE10_OFFLINE.md`.
