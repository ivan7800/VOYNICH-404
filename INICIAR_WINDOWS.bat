@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if not errorlevel 1 (
  py -3 serve.py
  goto :end
)
where python >nul 2>nul
if not errorlevel 1 (
  python serve.py
  goto :end
)
echo Necesitas Python 3 para ejecutar VOYNICH 404.
echo Descargalo desde python.org y selecciona Add Python to PATH.
pause
:end
endlocal
