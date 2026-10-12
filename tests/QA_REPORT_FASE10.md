# QA Fase 10 — v0.10.0 BETA

## Comprobado
- Sintaxis de todos los módulos JS y SW: PASS (`node --check`).
- Tests unitarios heredados `tests/test_*.mjs`: PASS.
- Todos los 30 recursos precacheados existen; manifest y sus iconos válidos.
- Respuesta HTTP del index: 200.
- El SW limita su cache a recursos locales del mismo origen y no borra almacenamiento de usuario.

## Pruebas no ejecutables
- Chromium E2E HTTP: `net::ERR_BLOCKED_BY_ADMINISTRATOR` al navegar a 127.0.0.1. No se ha certificado recarga offline real ni instalación PWA.
- Imágenes Yale y CORS: no verificados.
- Windows y Linux Mint del usuario: no verificados.

## Gate
BETA / PENDING. No declarar STABLE.
