"""Checks local entrypoints, PWA precache completeness and relative deployment paths."""
from pathlib import Path
import re, json, sys
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text(encoding='utf-8')
sw=(ROOT/'sw.js').read_text(encoding='utf-8')
manifest=json.loads((ROOT/'manifest.webmanifest').read_text(encoding='utf-8'))
checks=[]
def check(message, value):
    checks.append((message, bool(value)))
refs=re.findall(r'(?:src|href)=[\"\'](assets/[^\"\'?#]+)[\"\']',html)
precache=re.findall(r'[\"\'](\./[^\"\' ]+)[\"\']',sw.split('];',1)[0])
check('All HTML local assets exist', all((ROOT/r).is_file() for r in refs))
check('All HTML local assets precached', all('./'+r in precache for r in refs))
check('All precached resources exist', all(p=='./' or (ROOT/p).exists() for p in precache))
check('Manifest scope and start URL are relative',manifest.get('scope')=='./' and manifest.get('start_url')=='./')
check('Manifest icons exist',all((ROOT/i['src']).is_file() for i in manifest['icons']))
check('SW excludes external domains', 'url.origin !== self.location.origin' in sw)
check('No localStorage / indexedDB in SW', not re.search(r'localStorage|indexedDB',sw,re.I))
check('HTML uses local module scripts', 'type="module" src="assets/js/app.js"' in html)
for file in (ROOT/'assets/js').glob('*.js'):
    for dep in re.findall(r'from\s+[\"\'](\./[^\"\']+)[\"\']',file.read_text()):
        check('Import '+file.name+' -> '+dep,(file.parent/dep).is_file())
for name,ok in checks: print(('PASS' if ok else 'FAIL')+' '+name)
print(f'{sum(v for _,v in checks)}/{len(checks)} PASS')
sys.exit(0 if all(v for _,v in checks) else 1)
