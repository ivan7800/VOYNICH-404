# VOYNICH 404 · Informe de QA fase 2

- PASS  Carga la portada
- PASS  Aparecen tres accesos de expedición
- PASS  Están los botones de búsqueda y preferencias
- PASS  Buscador global abre con clic
- PASS  Búsqueda con acentos
- PASS  Sin resultados muestra mensaje
- PASS  Enter del buscador navega
- PASS  Búsqueda abre ficha contextual
- PASS  Cerrar ficha desde búsqueda devuelve el foco al archivo
- PASS  Atajo Ctrl+K abre búsqueda
- PASS  Escape cierra búsqueda
- PASS  Preferencias abren por botón
- PASS  Cambiar skin desde galería
- PASS  Skin tiene aria-pressed
- PASS  Tamaño amplio de letra
- PASS  Desactivar animaciones
- PASS  Preferencias persistidas
- PASS  Restablecer preferencias
- PASS  Cerrar preferencias
- PASS  Todas las secciones preservadas
- PASS  Detalle de secciones
- PASS  Se preservan nueve evidencias
- PASS  Filtrado dinámico accesible
- PASS  Modal de evidencia conserva fuentes
- PASS  Guardar anotación
- PASS  No ejecuta HTML guardado
- PASS  Exportar diario con datos
- PASS  Eliminar nota
- PASS  Las cinco fuentes siguen disponibles
- PASS  Selector secundario de skin
- PASS  Sin desbordamiento móvil 390
- PASS  Menú móvil abre y anuncia estado
- PASS  Menú móvil tiene fondo bloqueante
- PASS  Navegación móvil cierra menú
- PASS  Fondo cierra menú móvil
- PASS  Búsqueda operativa en móvil
- PASS  Resultados legibles en móvil
- PASS  Sin desbordamiento móvil 320
- PASS  Sin errores JavaScript

**Total:** 39 comprobaciones superadas.

**Errores de página o consola:** ninguno.

**Alcance:** Chromium sin navegación HTTP (bloqueada administrativamente). Se ejecutaron el HTML y CSS reales y los cuerpos de los módulos JS concatenados para pruebas, con localStorage simulado. El servidor de archivos y la sintaxis ESM se verifican por separado. Este test no prueba la carga ESM HTTP ni los lanzadores en Windows o Linux.

## Comprobaciones complementarias de integración

- Node.js: análisis de sintaxis de `app.js` y `data.js` sin errores.
- Python: compilación de `serve.py` sin errores.
- HTTP Python: `200 OK` para página principal, icono, ambos CSS y script principal.
- `serve.py`: se verificó un puerto libre y un puerto previamente ocupado; en el segundo caso seleccionó el siguiente correctamente.
- Limitación: Chromium no pudo validar navegación HTTP por restricción del entorno, por lo que la ejecución ESM real debe comprobarse en el equipo final.
