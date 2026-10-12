#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
if ! command -v python3 >/dev/null 2>&1; then
  echo "Se necesita Python 3 para iniciar VOYNICH 404."
  exit 1
fi
python3 serve.py
