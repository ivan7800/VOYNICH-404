# Resultados QA automatizado · Chromium

- PASS Inicio carga
- PASS Botón explorar navega
- PASS Modal de sección abre
- PASS Modal contiene fuentes
- PASS Botón cerrar modal
- PASS Se muestran evidencias
- PASS Filtro hipótesis
- PASS Modal evidencia
- PASS Cronología
- PASS Fuentes externas
- PASS Skin pergamino
- PASS Selección skin almacenada
- PASS Cambiar skin desde sidebar
- PASS Guardar nota
- PASS Escape HTML del título
- PASS Nota en almacenamiento
- PASS Exportación JSON
- PASS Exportación contiene datos
- PASS Borrar nota
- PASS Menú móvil oculto por defecto
- PASS Menú móvil abre
- PASS Menú móvil navega
- PASS Menú móvil cierra al navegar
- PASS Sin scroll horizontal a 390px
- PASS Sin errores JS de consola

Errores: ninguno

**Alcance real de la prueba:** Chromium bloquea el acceso HTTP por política administrativa. Se ensayó con el HTML y CSS originales e inyección combinada del código JavaScript original (sin ejecutar el import ESM por red) y con un `localStorage` simulado. El análisis sintáctico ESM se hizo aparte con Node.js. No se ha podido verificar la carga ESM real en navegador ni el funcionamiento en Windows o Linux Mint.
