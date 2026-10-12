# Fase 8 — Enciclopedia de teorías y descubrimientos

**Versión:** 0.8.0 BETA · **Fecha:** 2026-10-12

## Alcance

Módulos separados `theories-data.js`, `theories-core.js` y `theories.js`. El catálogo contiene 15 fichas con campos `id`, `kind`, `verdict`, `title`, `summary`, `for`, `against`, `test`, `sources`, `related` y `folio` opcional. Son resúmenes originales de evidencia e hipótesis, no transcripciones de artículos protegidos.

Estados editoriales:

| Estado | Significado |
|---|---|
| Hecho documentado | El núcleo de la afirmación está respaldado por evidencia verificable (sin validar todos los detalles) |
| Hipótesis plausible | Existe propuesta formal con argumentos, pero no demostración |
| En debate | Hay interpretaciones publicadas que divergen |
| Sin resolver | La evidencia disponible no permite una conclusión |
| Atribución incompatible | La atribución concreta contradice evidencia material temporal |

**No** se calculan porcentajes ni rankings de verdad. Todas las fichas incluyen argumentos y límites. Las alegaciones acerca de procedencia histórica se distinguen de los hechos sobre la documentación que las recoge.

## Fuente y licencias

Fuentes de contexto consultadas: Yale Beinecke, Yale News, René Zandbergen, Bowern y Lindemann (2021), Rugg (2004), Schinner (2007), Currier, Davis, Timm (prepublicación 2026), Layfield/Davis (2026), PLOS ONE y Parmentier. Cada artículo se enlaza; no se redistribuyen PDFs completos ni imágenes originales.

**Timm 2026** es una prepublicación crítica y se etiqueta en la interfaz como tal. **Layfield/Davis 2026** propone singuliones; los resultados no constituyen una traducción ni un consenso de encuadernación.

## QA y mecanismos

- `theories-core.js`: funciones puras de filtros, validación de IDs, comparación y JSON reproducible.
- `theories.js`: UI semántica, `<details>` accesibles, filtros, favoritos locales, exportación y navegación.
- `theories.css`: estilos compatibles con las tres skins, layout 390px/320px, estados de foco.
- `assets/js/app.js`: integración única en router, buscador global, fuentes y cuaderno.
- Persistencia en `voynich404-theory-favorites-v1`, **sin migraciones destructivas**.
- Ante JSON de favoritos malformado se bloquea sobrescritura y se conserva el dato antiguo.
- Chromium HTTP real bloqueado por política del entorno; test E2E controlado no equivale a prueba de despliegue final.

## Checklist en equipo real

1. Iniciar `INICIAR_WINDOWS.bat` o `bash INICIAR_LINUX.sh` y confirmar versión v0.8.0.
2. Abrir Teorías y descubrimientos, desplegar fuentes y seguir un enlace externo.
3. Filtrar por categoría, guardar favorito, navegar y comprobar persistencia tras recarga.
4. Comparar tres teorías, intentar una cuarta y verificar el límite.
5. Exportar JSON y abrirlo con un editor de texto; confirmar 3 fichas si había selección.
6. Enviar una teoría a Mi cuaderno, guardar nota y exportarla.
7. Abrir un folio y comprobar acceso real a Yale; si falla, usar enlace oficial alternativo.
8. Verificar pantallas a 320, 390 y 1440 px, los tres skins y `Ctrl+K`.
9. Revisar consola y red sin errores bloqueantes; ensayar ruta `/VOYNICH-404/` en GitHub Pages **sin publicar**.

## Estado de entrega

**BETA**, QA controlado PASS; integración HTTP y Yale PENDIENTE.
