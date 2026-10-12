"""Chromium UI regression using extracted source modules bundled in-process.
Not a network smoke test: requests to Yale are simulated; IndexedDB may be blocked on about:blank.
"""
from pathlib import Path
import json, shutil
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text()
css='\n'.join((root/p).read_text() for p in ('assets/css/styles.css','assets/css/phase2.css','assets/css/viewer.css','assets/css/atlas.css','assets/css/transcription.css'))
fixture=json.loads((root/'tests/fixtures/iiif-v2.json').read_text())
svg='data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="580"%3E%3Crect width="400" height="580" fill="%23e1cda3"/%3E%3C/svg%3E'
setup='''<script>
Object.defineProperty(window,'localStorage',{configurable:true,value:(()=>{const m=new Map();return {getItem(k){return m.has(k)?m.get(k):null},setItem(k,v){m.set(k,String(v))},removeItem(k){m.delete(k)},clear(){m.clear()}}})()});
/* Mock persistent IndexedDB for deterministic, non-network UI tests. */
const idbRecords=new Map();window.__qaIdbRecords=idbRecords;
Object.defineProperty(window,'indexedDB',{configurable:true,value:{open(){
 const request={result:null,error:null};
 queueMicrotask(()=>{
  request.result={objectStoreNames:{contains(){return true}},close(){},transaction(){
   const tx={error:null,oncomplete:null,onerror:null,onabort:null};
   tx.objectStore=()=>({
    get(key){const q={result:null,error:null};queueMicrotask(()=>{q.result=idbRecords.get(key)||null;q.onsuccess?.()});return q},
    put(val,key){queueMicrotask(()=>{idbRecords.set(key,val);tx.oncomplete?.()})},
    delete(key){queueMicrotask(()=>{idbRecords.delete(key);tx.oncomplete?.()})}
   });
   return tx;
  }};
  request.onsuccess?.();
 });
 return request;
}}});
window.__fixture=FIXTURE;window.__pixel=PIXEL;window.fetch=async()=>({ok:true,headers:{get:()=>null},text:async()=>JSON.stringify(window.__fixture)});
const OriginalImage=window.Image;window.Image=function(){const img=new OriginalImage();let requested='';Object.defineProperty(img,'src',{get(){return requested},set(v){requested=v;img.setAttribute('data-yale-url',v);img.setAttribute('src',window.__pixel)}});return img};window.confirm=()=>true;
</script>'''.replace('FIXTURE',json.dumps(fixture)).replace('PIXEL',json.dumps(svg))
def code(path):return (root/path).read_text()
def unmod(s):return '\n'.join(line for line in s.splitlines() if not line.startswith('import ')).replace('export const ','const ').replace('export function ','function ').replace('export async function ','async function ')
base=unmod(code('assets/js/data.js'))+'\n'+unmod(code('assets/js/iiif.js'))
base+='\n(function(){'+unmod(code('assets/js/atlas-data.js'))+'\nwindow.__atlasData={ATLAS_ENTRIES,ATLAS_CATEGORIES,ATLAS_SOURCES,ATLAS_FAVORITES_KEY,cleanAtlasFavorites,filterAtlas,findAtlasFolio};})();\n'
base+='\n(function(){const {findAtlasFolio}=window.__atlasData;'+unmod(code('assets/js/annotations.js'))+'\n'+unmod(code('assets/js/viewer.js'))+'\nwindow.__viewerExports={viewerHTML,mountViewer};})();\n'
base+='\n(function(){const {ATLAS_ENTRIES,ATLAS_CATEGORIES,ATLAS_SOURCES,ATLAS_FAVORITES_KEY,cleanAtlasFavorites,filterAtlas,findAtlasFolio}=window.__atlasData;'+unmod(code('assets/js/atlas.js'))+'\nwindow.__atlasExports={atlasHTML,mountAtlas};})();\n'
base+='\n(function(){'+unmod(code('assets/js/transcription-core.js'))+'\nwindow.__transCore={EVA_DEMO,MAX_IVTFF_CHARS,parseIVTFF,tokenizeEVARaw,flattenLines,summarize,searchIVTFF,csvTopWords,highlightedEVA};})();\n'
base+='\n(function(){const {EVA_DEMO,MAX_IVTFF_CHARS,parseIVTFF,flattenLines,summarize,searchIVTFF,csvTopWords,highlightedEVA}=window.__transCore;'+unmod(code('assets/js/transcription.js'))+'\nwindow.__transExports={transcriptionHTML,mountTranscription};})();\n'
app=code('assets/js/app.js').replace("import {SOURCES,SECTIONS,EVIDENCE,TIMELINE,STATUS} from './data.js';",'').replace("import {viewerHTML,mountViewer} from './viewer.js';",'const {viewerHTML,mountViewer}=window.__viewerExports;').replace("import {atlasHTML,mountAtlas} from './atlas.js';",'const {atlasHTML,mountAtlas}=window.__atlasExports;').replace("import {ATLAS_ENTRIES} from './atlas-data.js';",'const {ATLAS_ENTRIES}=window.__atlasData;').replace("import {transcriptionHTML,mountTranscription} from './transcription.js';",'const {transcriptionHTML,mountTranscription}=window.__transExports;')
html=html.replace('<link rel="stylesheet" href="assets/css/styles.css">','<style>'+css+'</style>')
for sheet in ('assets/css/phase2.css','assets/css/viewer.css','assets/css/atlas.css','assets/css/transcription.css'):
 html=html.replace(f'<link rel="stylesheet" href="{sheet}">','')
html=html.replace('<script type="module" src="assets/js/app.js"></script>','').replace('</body>',setup+'<script>'+base+'\n'+app+'</script></body>')
checks=[];errors=[]
def check(label,result):
 if not result:raise AssertionError('FAIL '+label)
 checks.append('PASS '+label)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path=shutil.which('chromium'),args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1440,'height':900},accept_downloads=True)
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html,wait_until='load')
 check('home loaded',page.locator('.hero').is_visible())
 page.locator('[data-view=transcripcion]').click()
 check('lab loads',page.locator('#transLab').is_visible())
 check('sample clearly labeled', 'Muestra auténtica' in page.locator('#transDatasetTitle').inner_text())
 check('sample shows 1 folio',page.locator('#transPages').inner_text()=='1')
 check('sample shows 2 lines',page.locator('#transLines').inner_text()=='2')
 check('f1r metadata present','L=A' in page.locator('#transFolioMeta').inner_text())
 check('f1r raw lines shown',page.locator('.trans-line').count()==2)
 check('ambiguity text displayed','[cth:oto]' in page.locator('.trans-lines').inner_text())
 check('uncertainty statistic > 0',int(page.locator('#transUncertain').inner_text())>=1)
 page.locator('#transQuery').fill('cthar');page.locator('#transSearchForm button[type=submit]').click()
 check('search token cthar',page.locator('#transSearchStatus').inner_text().startswith('2 coincidencias'))
 check('results highlight term',page.locator('.trans-hit mark').count()>=2)
 page.locator('#transMatch').select_option('exacta')
 check('exact search two occurrences',page.locator('#transSearchStatus').inner_text().startswith('2 coincidencias'))
 page.locator('#transQuery').fill('foobar');page.locator('#transSearchForm button[type=submit]').click()
 check('search empty state',page.locator('.trans-empty').count()>0)
 page.locator('#transQuery').fill('ar');page.locator('#transSearchForm button[type=submit]').click()
 check('search returns ar',page.locator('.trans-hit').count()>=1)
 check('CSV export enabled',page.locator('#transExport').is_enabled())
 with page.expect_download() as dl:page.locator('#transExport').click()
 check('CSV export name',dl.value.suggested_filename=='voynich-404-frecuencias-eva.csv')
 # File import: IndexedDB is simulated as an in-memory persistent store in this browser harness.
 complete='''#=IVTFF Eva- 2.0 M 5\n<f1r> <! $L=A>\n<f1r.1,@P0> chol.daiin\n<f1v> <! $L=B>\n<f1v.1,@La> shol.oteey\n<f1v.2,+P0> chol.daiin'''
 page.locator('#transFile').set_input_files({'name':'prueba-controlada.ivtff','mimeType':'text/plain','buffer':complete.encode()})
 page.wait_for_function("document.querySelector('#transPages').textContent==='2'")
 check('import two folios',page.locator('#transPages').inner_text()=='2')
 check('import source name shown','prueba-controlada.ivtff' in page.locator('#transDatasetTitle').inner_text())
 check('import three loci',page.locator('#transLines').inner_text()=='3')
 check('import stored in simulated IDB',page.evaluate("window.__qaIdbRecords.has('corpus')"))
 page.locator('#transFolio').select_option('f1v')
 check('folio switch displays two lines',page.locator('.trans-line').count()==2)
 page.locator('#transLocus').select_option('L')
 check('locus labels filter',page.locator('.trans-line').count()==1)
 page.locator('#transScope').select_option('folio')
 check('scope folio label', 'f1v' in page.locator('#transStatsScope').inner_text())
 page.locator('#transFolio').select_option('f1r')
 check('scope reacts to folio', 'f1r' in page.locator('#transStatsScope').inner_text())
 # Import invalid must not corrupt currently loaded dataset
 page.locator('#transFile').set_input_files({'name':'invalido.txt','mimeType':'text/plain','buffer':b'hello world'})
 page.wait_for_timeout(100)
 check('invalid import preserves imported data',page.locator('#transPages').inner_text()=='2')
 page.locator('[data-view=atlas]').click();page.locator('[data-view=transcripcion]').click();page.wait_for_function("document.querySelector('#transPages').textContent==='2'")
 check('import restored after navigation',page.locator('#transPages').inner_text()=='2')
 page.evaluate("localStorage.setItem('voynich404-notes-v1',JSON.stringify([{id:'proteccion',title:'Nota protegida',body:'Permanecer',date:'hoy'}]));localStorage.setItem('voynich404-atlas-favorites-v1',JSON.stringify(['herb-f2v']))")
 page.locator('#transReset').click();page.wait_for_function("document.querySelector('#transPages').textContent==='1'")
 check('reset returns to sample',page.locator('#transPages').inner_text()=='1')
 check('reset removes corpus from IDB',not page.evaluate("window.__qaIdbRecords.has('corpus')"))
 check('reset preserves old notes',page.evaluate("JSON.parse(localStorage.getItem('voynich404-notes-v1')).length===1"))
 check('reset preserves atlas favorites',page.evaluate("JSON.parse(localStorage.getItem('voynich404-atlas-favorites-v1')).length===1"))
 page.locator('#transOpenViewer').click()
 check('lab link opens viewer',page.locator('#folioViewer').count()==1 if page.locator('#folioViewer').count() else page.locator('#folioImage').count()==1)
 page.locator('[data-view=cuaderno]').click()
 page.locator('#noteTitle').fill('Nota de regresión F6');page.locator('#noteBody').fill('Texto original por estudiar.')
 page.locator('#noteForm button[type=submit]').click()
 check('prior notebook works',page.locator('#notesList .note').count()==2)
 page.locator('[data-view=atlas]').click()
 check('atlas remains 16 records',page.locator('.atlas-card').count()==16)
 page.locator('[data-view=transcripcion]').click()
 check('lab can be reopened',page.locator('#transLab').is_visible())
 page.locator('#openSearch').click();page.locator('#globalSearch').fill('Laboratorio EVA')
 check('global command search includes lab',page.locator('.command-option').count()>0)
 page.locator('.command-option').first.click()
 check('global command opens lab',page.locator('#transLab').is_visible())
 check('desktop no JS exceptions',not errors)
 page.wait_for_timeout(450)
 page.screenshot(path=str(root/'tests/VOYNICH-404_FASE-06_DESKTOP.png'),full_page=False)
 mobile=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
 mobile.on('pageerror',lambda e:errors.append('mobile: '+str(e)))
 mobile.set_content(html,wait_until='load')
 mobile.locator('#mobileMenu').click();mobile.locator('[data-view=transcripcion]').click()
 check('mobile lab displayed',mobile.locator('#transLab').is_visible())
 check('mobile no horizontal overflow 390',mobile.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
 mobile.wait_for_timeout(450)
 mobile.screenshot(path=str(root/'tests/VOYNICH-404_FASE-06_MOBILE.png'),full_page=False)
 mobile.set_viewport_size({'width':320,'height':700})
 check('mobile no horizontal overflow 320',mobile.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
 mobile.locator('#transQuery').fill('shol');mobile.locator('#transSearchForm button[type=submit]').click()
 check('mobile search functional',mobile.locator('.trans-hit').count()>0)
 check('no JS exceptions',not errors)
 browser.close()
(root/'tests/RESULTADOS_FASE6.md').write_text('# Pruebas fase 6: laboratorio EVA\n\n'+'\n'.join('- '+x for x in checks)+f'\n\n**{len(checks)} PASS; {len(errors)} errores JS.**\n\nPrueba DOM controlada con módulos del proyecto adaptados para ejecución inline y fuente IIIF simulada. IndexedDB simulado (no persistencia real), módulos HTTP de localhost, conexión a Yale y lanzadores de SO no verificados.\n')
print('\n'.join(checks));print('TOTAL:',len(checks),'ERRORS:',errors)
