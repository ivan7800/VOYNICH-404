"""Controlled inline Chromium QA: local HTTP module loading is blocked by environment policy. Simulated IDB / IIIF, real event handlers and browser DOM."""
from pathlib import Path
import json, shutil
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text()
css='\n'.join((root/p).read_text() for p in ('assets/css/styles.css','assets/css/phase2.css','assets/css/viewer.css','assets/css/atlas.css','assets/css/transcription.css','assets/css/crypto.css'))
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
base+='\n(function(){const {flattenLines}=window.__transCore;'+unmod(code('assets/js/crypto-core.js'))+'\nwindow.__cryptoCore={CRYPTO_VERSION,tokensOf,lineTokens,profile,ngrams,groupCompare,positions,shuffleBaseline,exportNgramsCsv};})();\n'
base+='\n(function(){const {EVA_DEMO,MAX_IVTFF_CHARS,parseIVTFF}=window.__transCore;const {CRYPTO_VERSION,tokensOf,lineTokens,profile,ngrams,groupCompare,positions,shuffleBaseline,exportNgramsCsv}=window.__cryptoCore;'+unmod(code('assets/js/crypto.js'))+'\nwindow.__cryptoExports={cryptoHTML,mountCrypto};})();\n'
app=code('assets/js/app.js').replace("import {cryptoHTML,mountCrypto} from './crypto.js';",'const {cryptoHTML,mountCrypto}=window.__cryptoExports;').replace("import {SOURCES,SECTIONS,EVIDENCE,TIMELINE,STATUS} from './data.js';",'').replace("import {viewerHTML,mountViewer} from './viewer.js';",'const {viewerHTML,mountViewer}=window.__viewerExports;').replace("import {atlasHTML,mountAtlas} from './atlas.js';",'const {atlasHTML,mountAtlas}=window.__atlasExports;').replace("import {ATLAS_ENTRIES} from './atlas-data.js';",'const {ATLAS_ENTRIES}=window.__atlasData;').replace("import {transcriptionHTML,mountTranscription} from './transcription.js';",'const {transcriptionHTML,mountTranscription}=window.__transExports;')
html=html.replace('<link rel="stylesheet" href="assets/css/styles.css">','<style>'+css+'</style>')
for sheet in ('assets/css/phase2.css','assets/css/viewer.css','assets/css/atlas.css','assets/css/transcription.css','assets/css/crypto.css'):
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
 check('app loaded',page.locator('.hero').is_visible())
 page.locator('[data-view=criptoanalisis]').click()
 check('crypto lab visible',page.locator('#cryptoLab').is_visible())
 check('sample labeled', 'f1r' in page.locator('#cryptoSource').inner_text())
 check('1 sample folio',page.locator('#cryptoPages').inner_text()=='1')
 check('more than 10 sample tokens',int(page.locator('#cryptoTokens').inner_text())>10)
 check('small sample warning', '100 tokens' in page.locator('#cryptoCompareWarning').inner_text())
 page.locator('#cryptoCompareMode').select_option('loci')
 check('folio selectors hidden for loci',page.locator('#cryptoFolioALabel').is_hidden())
 check('P label rendered','párrafos' in page.locator('#cryptoComparison').inner_text())
 page.locator('#cryptoCompareMode').select_option('currier')
 check('currier A label rendered','$L=A' in page.locator('#cryptoComparison').inner_text())
 page.locator('#cryptoCompareMode').select_option('folios')
 check('folio selectors shown',page.locator('#cryptoFolioALabel').is_visible())
 check('position counts present',page.locator('#cryptoInitial .crypto-rank').count()>0)
 page.locator('#cryptoN').select_option('3')
 check('3 token mode',page.locator('#cryptoN').input_value()=='3')
 page.locator('#cryptoN').select_option('2')
 with page.expect_download() as dl:page.locator('#cryptoCsv').click()
 check('CSV downloads',dl.value.suggested_filename=='voynich404-secuencias-eva.csv')
 page.locator('#cryptoRuns').select_option('20')
 page.locator('#cryptoShuffle').click()
 page.wait_for_function("!document.querySelector('#cryptoShuffle').disabled && document.querySelector('#cryptoShuffleOutput').innerText.includes('Media de las mezclas')")
 check('shuffle results rendered',page.locator('.crypto-baseline strong').count()==3)
 before=page.locator('#cryptoShuffleOutput').inner_text()
 page.locator('#cryptoShuffle').click()
 page.wait_for_function("!document.querySelector('#cryptoShuffle').disabled && document.querySelector('#cryptoShuffleOutput').innerText.includes('Media de las mezclas')")
 check('same seed same display',before==page.locator('#cryptoShuffleOutput').inner_text())
 page.locator('#cryptoSeed').fill('-1')
 page.locator('#cryptoShuffle').click()
 check('invalid seed not executed',page.locator('.crypto-baseline').count()==0)
 page.locator('#cryptoSeed').fill('8')
 page.locator('#cryptoShuffle').click()
 page.wait_for_function("!document.querySelector('#cryptoShuffle').disabled && document.querySelector('#cryptoShuffleOutput').innerText.includes('Media de las mezclas')")
 with page.expect_download() as dl:page.locator('#cryptoExportReport').click()
 check('JSON downloads',dl.value.suggested_filename=='voynich404-informe-criptoanalisis.json')
 sample=b'#=IVTFF Eva- 2.0 M 5\n<f1r> <! $L=A>\n<f1r.1,@P0> chol.chol.daiin\n<f1v> <! $L=B>\n<f1v.1,@La> otay.otay.daiin\n<f1v.2,@P0> chol.chol'
 page.locator('#cryptoImport').set_input_files({'name':'prueba-f7.ivtff','mimeType':'text/plain','buffer':sample})
 page.wait_for_function("document.querySelector('#cryptoPages').textContent==='2'")
 check('temp import 2 folios',page.locator('#cryptoPages').inner_text()=='2')
 check('temp import label', 'Importado temporalmente' in page.locator('#cryptoSource').inner_text())
 page.locator('#cryptoScope').select_option('f1v')
 check('folio scope switch',page.locator('#cryptoScope').input_value()=='f1v')
 page.locator('#cryptoCompareMode').select_option('folios')
 page.locator('#cryptoFolioB').select_option('f1v')
 check('folio B compare visible','f1v' in page.locator('#cryptoComparison').inner_text())
 page.locator('#cryptoCompareMode').select_option('currier')
 check('currier compare B visible','$L=B' in page.locator('#cryptoComparison').inner_text())
 check('no JS errors after import',not errors)
 page.locator('#cryptoToEVA').click()
 check('crypto to EVA navigation',page.locator('#transLab').is_visible())
 page.locator('#transFile').set_input_files({'name':'guardado-f7.ivtff','mimeType':'text/plain','buffer':sample})
 page.wait_for_function("document.querySelector('#transPages').textContent==='2'")
 check('EVA import',page.locator('#transPages').inner_text()=='2')
 page.locator('[data-view=criptoanalisis]').click()
 page.wait_for_function("document.querySelector('#cryptoSource').textContent.includes('guardado-f7')")
 check('crypto reads persisted simulated IDB', 'guardado-f7' in page.locator('#cryptoSource').inner_text())
 page.locator('[data-view=atlas]').click()
 check('16 atlas cards preserved',page.locator('.atlas-card').count()==16)
 page.locator('[data-view=cuaderno]').click()
 check('notebook preserved',page.locator('#noteForm').count()==1)
 page.locator('#noteTitle').fill('Nota F7');page.locator('#noteBody').fill('Prueba de regresion')
 page.locator('#noteForm button[type=submit]').click()
 check('notebook add note',page.locator('#notesList .note').count()==1)
 page.locator('[data-view=criptoanalisis]').click()
 check('crypto accessible after other views',page.locator('#cryptoLab').is_visible())
 check('desktop no horizontal overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
 page.screenshot(path=str(root/'tests/VOYNICH-404_FASE-07_DESKTOP.png'),full_page=False)
 mobile=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
 mobile.on('pageerror',lambda e:errors.append('mobile '+str(e)))
 mobile.set_content(html,wait_until='load')
 mobile.locator('#mobileMenu').click();mobile.locator('[data-view=criptoanalisis]').click()
 check('mobile crypto lab visible',mobile.locator('#cryptoLab').is_visible())
 check('mobile 390 no overflow',mobile.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
 mobile.locator('#cryptoCompareMode').select_option('loci')
 check('mobile selects work',mobile.locator('#cryptoCompareMode').input_value()=='loci')
 mobile.wait_for_timeout(450)
 check('mobile menu fully closed', not mobile.locator('#sidebar').evaluate('(el)=>el.classList.contains("open")'))
 mobile.screenshot(path=str(root/'tests/VOYNICH-404_FASE-07_MOBILE.png'),full_page=False)
 mobile.set_viewport_size({'width':320,'height':700})
 check('mobile 320 no overflow',mobile.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
 check('no JS exceptions',not errors)
 browser.close()
(root/'tests/RESULTADOS_FASE7.md').write_text('# Pruebas F7 — Chromium DOM controlado\n\n'+'\n'.join('- '+x for x in checks)+f'\n\n**{len(checks)} PASS; {len(errors)} errores JavaScript**.\n\nPruebas con módulos inline, IndexedDB y servidor Yale simulados. No demuestra compatibilidad real HTTP/ESM/IndexedDB ni imágenes Yale.\n')
print('TOTAL',len(checks),'ERRORS',errors)
