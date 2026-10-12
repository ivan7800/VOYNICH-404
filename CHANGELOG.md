# CHANGELOG

## 0.11.1 RC2 — 2026-10-12

### Fixed
- Añadida una acción visible para activar una actualización PWA pendiente sin recargar de forma inesperada mientras se edita una nota.
- Sincronizadas las etiquetas de edición, pie y lanzador con la versión entregada.

### Docs / QA
- Instrucciones de despliegue bajo subruta de GitHub Pages y prueba automatizada del flujo de actualización con dobles.
- La prueba integrada HTTP, Yale y offline en navegador real sigue pendiente; RC2 no es estable.

## 0.11.0 RC1 — 2026-10-12

### Fixed
- Añadidos `offline.css` y `offline.js` a la precarga PWA, evitando recursos locales faltantes al trabajar sin conexión.
- Incrementada la versión del Service Worker para invalidar la caché anterior.

### Added
- Test automático de integridad del shell, rutas de los módulos y manifiesto PWA.
- Informe de auditoría de fase 11 con pruebas reales y limitaciones verificadas.

## 0.10.0 — Fase 10 (BETA)

- Added: manifest PWA, iconos 192/512, Service Worker con precarga de recursos locales, indicador de conectividad.
- Changed: soporte de subruta y preferencia por animaciones reducidas.
- Security: el SW no intercepta Yale ni URLs externas ni almacena notas privadas.
- Pending: validar instalación PWA y recarga offline en navegadores/dispositivos del usuario.

## 0.9.0 BETA — 2026-10-12

### Added
- Cuaderno avanzado con expedientes personales (hasta 80) y notas (hasta 500).
- Notas enlazables a folio, expediente de teorías o ficha del atlas, con etiquetas.
- Búsqueda y filtros por texto, expediente y etiqueta.
- Edición, eliminación confirmada y traslado de notas al eliminar expedientes.
- Exportación JSON v2; importación no destructiva de backups v2 y de notas v1.
- 38 pruebas unitarias nuevas y 47 comprobaciones de interacción controlada.

### Changed
- El cuaderno se despliega en un módulo separado del núcleo de navegación.
- Migración no destructiva de notas anteriores a una nueva clave local versionada; la clave histórica nunca se borra.
- Adaptación responsive del cuaderno y corrección del ornamento que provocaba desbordamiento móvil.

### Security
- Validación de JSON externo, límites de tamaño y cantidad, deduplicación y referencias conocidas.
- Contenido de notas escapado como texto; protección contra escrituras sobre datos corruptos.

### Known limitations
- Chromium del entorno bloquea localhost: no hay E2E real con ESM y almacenamiento HTTP.
- Yale, la importación IVTFF completa, lanzadores de los SO y GitHub Pages siguen pendientes de verificación real.

## Anteriores

Para el historial de las fases 1–8 consultar las entregas anteriores y `docs/`.
