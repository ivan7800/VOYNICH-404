# QA — VOYNICH 404 Fase 3

- PASS home visible
- PASS IIIF 2 official manifest parsed
- PASS three canvas entries present
- PASS image URL uses Yale IIIF
- PASS prev disabled on first
- PASS next selects f1v
- PASS search filters indexed pages
- PASS direct selection selects third
- PASS zoom in updates scale
- PASS zoom out resets
- PASS bookmark saved with stable ID
- PASS folio-to-note navigation
- PASS note retained
- PASS last visited folio restored
- PASS bookmark restored
- PASS filter matches multiple labels
- PASS keyboard previous
- PASS refresh retains selection
- PASS six historical sections retained
- PASS nine evidence cards retained
- PASS previous note persisted
- PASS skin controls preserved
- PASS CORS/network failure informs user
- PASS manual JSON import available
- PASS imported IIIF manifest renders folio
- PASS mobile folio viewer visible
- PASS mobile no horizontal overflow
- PASS mobile navigation closes
- PASS 320px no overflow
- PASS no JS page errors

**Resultado:** 30 comprobaciones superadas, 0 errores de página.

**Alcance:** Browser DOM/CSS/JS reales, ESM ensamblados para pruebas, almacenamiento simulado, manifiestos IIIF v2 y errores HTTP simulados; imagen de prueba sintética. No valida conexión real a Yale ni CORS, ni los lanzadores en sistemas finales.
