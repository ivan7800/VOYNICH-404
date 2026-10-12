"""Historical QA alias retained for previous documentation."""
from pathlib import Path
import subprocess
import sys
raise SystemExit(subprocess.call([sys.executable, str(Path(__file__).with_name('qa_phase2_regression.py'))]))
