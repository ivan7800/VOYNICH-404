# VOYNICH 404 — Fase 9: Cuaderno avanzado

## Objetivo

Organizar la investigación personal sin sustituir un hecho académico por una nota del usuario. Los folios, las fichas del atlas y las teorías enlazadas proceden del catálogo existente; las observaciones siguen siendo privadas y no se publican.

## Funciones

- Crear expedientes (máximo 80), opcionalmente con descripción.
- Crear, consultar, modificar y borrar observaciones (máximo 500).
- Etiquetar observaciones (hasta 8 etiquetas por nota).
- Vincular cada nota a un folio con formato `f1r`, una ficha del atlas y/o una hipótesis de la enciclopedia.
- Buscar y filtrar notas por texto, expediente y etiqueta.
- Eliminar un expediente **sin borrar sus notas** (pasan a «Sin expediente»).
- Exportar una copia JSON versionada e importar de manera **no destructiva**, añadiendo únicamente IDs que todavía no existan.

## Compatibilidad de datos

- El formato de fases 1–8 permanece en `localStorage['voynich404-notes-v1']`.
- La fase 9 guarda en `localStorage['voynich404-notebook-v2']`, con `schemaVersion: 2`.
- Cuando **no existe** la clave nueva, se leen las notas antiguas, sin modificar el almacenamiento. El primer guardado válido migra las notas y añade el cambio en una clave nueva; la anterior se conserva.
- Si la clave nueva tiene formato corrupto, el cuaderno entra en modo protegido, sin escritura automática. No hay reinicio silencioso ni intento de convertir datos dañados en un cuaderno vacío.
- La importación de la copia v2 o de una exportación v1 agrega nuevos ID; los conflictos se mantienen en el dispositivo local (no se sobrescriben).

## Cómo comprobar

1. Inicia la aplicación mediante HTTP (`INICIAR_WINDOWS.bat`, `INICIAR_LINUX.sh` o `python3 serve.py`).
2. Crea un expediente y una nota con etiquetas y folio `f1r`.
3. Abre el vínculo al folio, vuelve, edita la nota y comprueba la persistencia.
4. Exporta la copia JSON y consérvala fuera del navegador.
5. Importa la copia dos veces: los ID existentes no deben duplicarse.
6. Elimina el expediente: sus notas deben seguir accesibles.
7. Cierra el navegador, vuelve a abrir el mismo origen HTTP y comprueba que los datos persisten.

## Advertencias

- `localStorage` depende del navegador y del origen: un cambio de puerto puede cambiar el almacén al que accedes. Conserva copias JSON antes de cambiar el origen, eliminar cookies/datos o usar navegación privada.
- La migración automática no altera las antiguas notas, pero **no** sustituye una copia de seguridad.
- La selección de folios no verifica que la imagen exista en Yale. La disponibilidad de imágenes y las funciones IIIF completas permanecen sin comprobar aquí.
- El ZIP **no** contiene el manuscrito digitalizado ni una traducción.

## Resultados

`node tests/test_notebook.mjs` — 38 PASS. `python tests/qa_phase9.py` — 47 PASS en Chromium de prueba con ESM inline y almacenamiento simulado. Módulos HTTP reales bloqueados por política del entorno; el servidor HTTP devuelve `200` para los recursos consultados. Falta realizar una prueba manual completa en Windows/Linux y la conexión Yale.
