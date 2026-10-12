"""Controlled inline Chromium QA: local HTTP module loading is blocked by environment policy. Simulated IDB / IIIF, real event handlers and browser DOM."""
from pathlib import Path
import json, shutil
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text()
css='\n'.join((root/p).read_text() for p in ('assets/css/styles.css','assets/css/phase2.css','assets/css/viewer.css','assets/css/atlas.css','assets/css/transcription.css','assets/css/crypto.css','assets/css/theories.css'))
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
base+='\n(function(){'+unmod(code('assets/js/theories-data.js'))+'\nwindow.__theoryData={THEORY_ENTRIES,THEORY_SOURCES,THEORY_KINDS,THEORY_TOPICS,THEORY_VERDICTS};})();\n'
base+='\n(function(){const {THEORY_ENTRIES,THEORY_SOURCES,THEORY_KINDS,THEORY_TOPICS,THEORY_VERDICTS}=window.__theoryData;'+unmod(code('assets/js/theories-core.js'))+'\nwindow.__theoryCore={FAVORITES_KEY,normalizeTerm,validateTheoryIndex,cleanTheoryFavorites,filterTheories,selectTheoryComparison,buildResearchExport};})();\n'
base+='\n(function(){const {THEORY_ENTRIES,THEORY_SOURCES,THEORY_KINDS,THEORY_TOPICS,THEORY_VERDICTS}=window.__theoryData;const {FAVORITES_KEY,cleanTheoryFavorites,filterTheories,selectTheoryComparison,buildResearchExport}=window.__theoryCore;'+unmod(code('assets/js/theories.js'))+'\nwindow.__theoryExports={theoriesHTML,mountTheories};})();\n'
app=code('assets/js/app.js').replace("import {theoriesHTML,mountTheories} from './theories.js';",'const {theoriesHTML,mountTheories}=window.__theoryExports;').replace("import {THEORY_ENTRIES,THEORY_SOURCES} from './theories-data.js';",'const {THEORY_ENTRIES,THEORY_SOURCES}=window.__theoryData;').replace("import {cryptoHTML,mountCrypto} from './crypto.js';",'const {cryptoHTML,mountCrypto}=window.__cryptoExports;').replace("import {SOURCES,SECTIONS,EVIDENCE,TIMELINE,STATUS} from './data.js';",'').replace("import {viewerHTML,mountViewer} from './viewer.js';",'const {viewerHTML,mountViewer}=window.__viewerExports;').replace("import {atlasHTML,mountAtlas} from './atlas.js';",'const {atlasHTML,mountAtlas}=window.__atlasExports;').replace("import {ATLAS_ENTRIES} from './atlas-data.js';",'const {ATLAS_ENTRIES}=window.__atlasData;').replace("import {transcriptionHTML,mountTranscription} from './transcription.js';",'const {transcriptionHTML,mountTranscription}=window.__transExports;')
html=html.replace('<link rel="stylesheet" href="assets/css/styles.css">','<style>'+css+'</style>')
for sheet in ('assets/css/phase2.css','assets/css/viewer.css','assets/css/atlas.css','assets/css/transcription.css','assets/css/crypto.css','assets/css/theories.css'):
 html=html.replace(f'<link rel="stylesheet" href="{sheet}">','')
html=html.replace('<script type="module" src="assets/js/app.js"></script>','').replace('</body>',setup+'<script>'+base+'\n'+app+'</script></body>')
checks=[];errors=[]
def check(label,expr):
 if not expr:raise AssertionError('FAIL: '+label)
 checks.append(label)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path=shutil.which('chromium'),args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1440,'height':900},accept_downloads=True)
 page.on('pageerror',lambda err:errors.append(str(err)))
 page.set_content(html,wait_until='load')
 check('home loads',page.locator('.hero').is_visible())
 page.locator('[data-view=teorias]').click()
 check('theory view loads',page.locator('#theoriesRoot').is_visible())
 check('15 cards rendered',page.locator('.theory-card').count()==15)
 check('15 source cards searchable',page.locator('#theoryCount').inner_text().startswith('15'))
 check('statuses clearly displayed',page.locator('.theories-legend-item').count()==5)
 check('initial comparison empty', 'Pulsa' in page.locator('#theoryComparison').inner_text())
 page.locator('#theorySearch').fill('roger bacon')
 check('search returns Bacon',page.locator('.theory-card').count()==1)
 check('Bacon incompatibility shown', 'INCOMPATIBLE' in page.locator('.theory-card').inner_text())
 page.locator('#theoryReset').click()
 check('reset restores 15',page.locator('.theory-card').count()==15)
 page.locator('#theoryKind').select_option('comprobacion')
 check('kind 4',page.locator('.theory-card').count()==4)
 page.locator('#theoryTopic').select_option('escritura')
 check('kind combined 2',page.locator('.theory-card').count()==2)
 page.locator('#theoryReset').click()
 page.locator('#theoryVerdict').select_option('sin_resolver')
 check('unresolved filter',page.locator('.theory-card').count()>0 and page.locator('.theory-card').all_text_contents()[0].find('SIN RESOLVER')>=0)
 page.locator('#theoryReset').click()
 page.locator('[data-theory-card="bacon"] .theory-detail summary').click()
 check('details expanded',page.locator('[data-theory-card="bacon"] details').evaluate('(el)=>el.open'))
 check('source anchors present',page.locator('[data-theory-card="bacon"] .theory-links a').count()==2)
 page.locator('[data-theory-card="bacon"] [data-theory-action="favorite"]').click()
 check('favorite persisted',page.evaluate("JSON.parse(localStorage.getItem('voynich404-theory-favorites-v1'))")==['bacon'])
 check('details preserved after favorite',page.locator('[data-theory-card="bacon"] details').evaluate('(el)=>el.open'))
 page.locator('#theoryOnlyFav').check()
 check('favorites only',page.locator('.theory-card').count()==1)
 page.locator('#theoryOnlyFav').uncheck()
 page.locator('[data-theory-card="bacon"] [data-theory-action="compare"]').click()
 page.locator('[data-theory-card="lengua"] [data-theory-action="compare"]').click()
 check('compare two',page.locator('.theory-compare-cards article').count()==2)
 page.locator('[data-theory-card="currier"] [data-theory-action="compare"]').click()
 check('compare three',page.locator('.theory-compare-cards article').count()==3)
 page.locator('[data-theory-card="escribas"] [data-theory-action="compare"]').click()
 check('max three enforced',page.locator('.theory-compare-cards article').count()==3)
 with page.expect_download() as download_info:page.locator('#theoryExport').click()
 download=download_info.value
 check('export JSON filename',download.suggested_filename=='voynich-404-investigacion-teorias.json')
 import json
 exported=json.loads(download.path().read_text())
 check('export 3 selected records',len(exported['cards'])==3)
 check('export includes citations',len(exported['cards'][0]['sourceDetails'])>=1)
 page.locator('#theoryClearCompare').click()
 check('compare clears',page.locator('.theory-compare-cards article').count()==0)
 page.locator('[data-theory-card="lengua"] .theory-detail summary').click()
 page.locator('[data-theory-card="lengua"] [data-theory-action="related"]').first.click()
 check('related scroll opens linked record',page.locator('.theory-card').count()==15 and page.locator('[data-theory-card="cifrado"] details').evaluate('(el)=>el.open'))
 page.locator('[data-theory-card="eva"] [data-theory-action="note"]').click()
 check('note opens notebook',page.locator('#noteForm').is_visible())
 check('note title prefilled',page.locator('#noteTitle').input_value().startswith('Teoría'))
 page.locator('#noteBody').fill('Mi análisis de la hipótesis.')
 page.locator('#noteForm button[type=submit]').click()
 check('note saved',page.locator('#notesList .note').count()==1)
 page.locator('[data-view=teorias]').click()
 check('favorites survive navigate',page.locator('[data-theory-card="bacon"] [data-theory-action="favorite"]').get_attribute('aria-pressed')=='true')
 page.locator('#theorySort').select_option('recientes')
 check('sort changed order',page.locator('.theory-card').first.get_attribute('data-theory-card') in ['escribas','singulion','origen','plantas'])
 check('desktop no horizontal overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
 page.screenshot(path=str(root/'tests/VOYNICH-404_FASE-08_DESKTOP.png'),full_page=False)
 page.locator('#theoryCards').scroll_into_view_if_needed()
 page.screenshot(path=str(root/'tests/VOYNICH-404_FASE-08_FICHAS.png'),full_page=False)
 page.locator('#themePicker').select_option('pergamino')
 check('pergamino skin works',page.locator('body').get_attribute('data-theme')=='pergamino')
 page.locator('#themePicker').select_option('laboratorio')
 check('laboratorio skin works',page.locator('body').get_attribute('data-theme')=='laboratorio')
 page.locator('#themePicker').select_option('nocturno')
 check('nocturno skin works',page.locator('body').get_attribute('data-theme')=='nocturno')
 # Existing phase features smoke
 page.locator('[data-view=atlas]').click()
 check('atlas still has 16 cards',page.locator('.atlas-card').count()==16)
 page.locator('[data-view=transcripcion]').click()
 check('EVA still mounts',page.locator('#transLab').count()==1)
 page.locator('[data-view=criptoanalisis]').click()
 check('crypto still mounts',page.locator('#cryptoLab').count()==1)
 page.locator('[data-view=visor]').click()
 check('viewer still mounts',page.locator('#folioArea').count()==1)
 page.locator('[data-view=fuentes]').click()
 check('phase 8 academic bibliography visible', 'Investigaciones de la enciclopedia' in page.locator('#main').inner_text())
 check('phase 8 bibliography links present',page.locator('.source-row a').count()>10)
 page.locator('#openSearch').click()
 page.locator('#globalSearch').fill('singuliones')
 check('search theory indexed',page.locator('#searchResults .command-option').count()>0)
 page.keyboard.press('Escape')
 mobile=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,accept_downloads=True)
 mobile.on('pageerror',lambda err:errors.append('mobile: '+str(err)))
 mobile.set_content(html,wait_until='load')
 mobile.locator('#mobileMenu').click()
 mobile.locator('[data-view=teorias]').click()
 check('mobile theory view visible',mobile.locator('#theoriesRoot').is_visible())
 check('mobile 390 no overflow',mobile.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
 mobile.locator('#theorySearch').fill('Bacon')
 check('mobile search works',mobile.locator('.theory-card').count()==1)
 mobile.locator('#theoryReset').click()
 mobile.locator('#theoryKind').select_option('debate')
 check('mobile kind works',mobile.locator('.theory-card').count()==3)
 mobile.locator('[data-theory-card="escribas"] [data-theory-action="compare"]').click()
 check('mobile compare works',mobile.locator('.theory-compare-cards article').count()==1)
 mobile.screenshot(path=str(root/'tests/VOYNICH-404_FASE-08_MOBILE.png'),full_page=False)
 mobile.set_viewport_size({'width':320,'height':700})
 check('mobile 320 no overflow',mobile.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
 check('no JS exceptions',not errors)
 browser.close()
(root/'tests/RESULTADOS_FASE8.md').write_text('# Fase 8 / Chromium controlado\n\n'+'\n'.join('- PASS '+x for x in checks)+f'\n\n**{len(checks)} PASS**, errores JavaScript: {len(errors)}\n\nLa carga real de módulos ESM desde HTTP y conexión con Yale siguen pendientes; se usaron módulos inline, IndexedDB y IIIF simulados.\n')
print('TOTAL',len(checks),'PASS ERRORS',errors)
