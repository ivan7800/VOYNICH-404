#!/usr/bin/env python3
"""Local development launcher for VOYNICH 404. Bound to localhost only."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Timer
import os
import webbrowser

ROOT = Path(__file__).resolve().parent
try:
    port = int(os.getenv('VOYNICH_PORT', '8044'))
except ValueError:
    port = 8044
if not 1024 <= port <= 65526:
    port = 8044

handler = partial(SimpleHTTPRequestHandler, directory=str(ROOT))
server = None
for candidate in range(port, port + 10):
    try:
        server = ThreadingHTTPServer(('127.0.0.1', candidate), handler)
        break
    except OSError:
        continue

if server is None:
    raise SystemExit('No se ha encontrado un puerto libre. Cierra otras instancias y prueba de nuevo.')

url = f'http://127.0.0.1:{server.server_port}/'
print(f'VOYNICH 404 v0.11.1 RC2 — Abriendo {url}', flush=True)
print('Para detener el servidor: Ctrl+C', flush=True)
Timer(0.6, lambda: webbrowser.open(url)).start()
try:
    server.serve_forever()
except KeyboardInterrupt:
    print('\nServidor detenido.')
finally:
    server.server_close()
