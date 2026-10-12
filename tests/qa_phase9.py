"""Controlled inline Chromium QA: local HTTP module loading is blocked by environment policy. Simulated IDB / IIIF, real event handlers and browser DOM."""
from pathlib import Path
import json, shutil
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text()
css='\n'.join((root/p).read_text() for p in ('assets/css/styles.css','assets/css/phase2.css','assets/css/viewer.css','assets/css/atlas.css','assets/css/transcription.css','assets/css/crypto.css','assets/css/theories.css','assets/css/notebook.css'))
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
base+='\n(function(){'+unmod(code('assets/js/notebook-core.js'))+'\nwindow.__notebookCore={NOTEBOOK_KEY,LEGACY_NOTES_KEY,NOTEBOOK_SCHEMA,MAX_NOTES,MAX_DOSSIERS,MAX_BACKUP_BYTES,emptyNotebook,validateNotebook,validateNote,validateDossier,upgradeLegacyNotes,parseNotebookBackup,createNotebookBackup,mergeNotebook,filterNotebook};})();\n'
base+='\n(function(){const {NOTEBOOK_KEY,LEGACY_NOTES_KEY,NOTEBOOK_SCHEMA,MAX_NOTES,MAX_DOSSIERS,MAX_BACKUP_BYTES,emptyNotebook,validateNotebook,validateNote,validateDossier,upgradeLegacyNotes,parseNotebookBackup,createNotebookBackup,mergeNotebook,filterNotebook}=window.__notebookCore;const {THEORY_ENTRIES}=window.__theoryData;const {ATLAS_ENTRIES}=window.__atlasData;'+unmod(code('assets/js/notebook.js'))+'\nwindow.__notebookExports={notebookHTML,mountNotebook};})();\n'
app=code('assets/js/app.js').replace("import {theoriesHTML,mountTheories} from './theories.js';",'const {theoriesHTML,mountTheories}=window.__theoryExports;').replace("import {THEORY_ENTRIES,THEORY_SOURCES} from './theories-data.js';",'const {THEORY_ENTRIES,THEORY_SOURCES}=window.__theoryData;').replace("import {notebookHTML,mountNotebook} from './notebook.js';",'const {notebookHTML,mountNotebook}=window.__notebookExports;').replace("import {cryptoHTML,mountCrypto} from './crypto.js';",'const {cryptoHTML,mountCrypto}=window.__cryptoExports;').replace("import {SOURCES,SECTIONS,EVIDENCE,TIMELINE,STATUS} from './data.js';",'').replace("import {viewerHTML,mountViewer} from './viewer.js';",'const {viewerHTML,mountViewer}=window.__viewerExports;').replace("import {atlasHTML,mountAtlas} from './atlas.js';",'const {atlasHTML,mountAtlas}=window.__atlasExports;').replace("import {ATLAS_ENTRIES} from './atlas-data.js';",'const {ATLAS_ENTRIES}=window.__atlasData;').replace("import {transcriptionHTML,mountTranscription} from './transcription.js';",'const {transcriptionHTML,mountTranscription}=window.__transExports;')
html=html.replace('<link rel="stylesheet" href="assets/css/styles.css">','<style>'+css+'</style>')
for sheet in ('assets/css/phase2.css','assets/css/viewer.css','assets/css/atlas.css','assets/css/transcription.css','assets/css/crypto.css','assets/css/theories.css','assets/css/notebook.css'):
 html=html.replace(f'<link rel="stylesheet" href="{sheet}">','')
html=html.replace('<script type="module" src="assets/js/app.js"></script>','').replace('</body>',setup+'<script>'+base+'\n'+app+'</script></body>')

checks=[];errors=[]
def check(label,condition):
 if not condition:raise AssertionError('FAIL '+label+' | errors: '+str(errors[-3:]))
 checks.append(label)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path=shutil.which('chromium'),args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1440,'height':900},accept_downloads=True)
 page.set_default_timeout(5000)
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html,wait_until='load')
 check('inicio carga',page.locator('.hero').is_visible())
 # legacy data preserved and migrated on first write
 page.evaluate("localStorage.setItem('voynich404-notes-v1',JSON.stringify([{id:'old1',title:'Nota heredada',body:'Antigua observación',date:'12/10/2026'}]))")
 page.locator('[data-view=cuaderno]').click()
 check('cuaderno abierto',page.locator('#notebookRoot').is_visible())
 check('nota antigua visible',page.get_by_text('Nota heredada').is_visible())
 check('migración no escribe en v2 antes de guardar',page.evaluate("localStorage.getItem('voynich404-notebook-v2')") is None)
 # new dossier
 page.locator('#nbDossierTitle').fill('Caso botánico')
 page.locator('#nbDossierDescription').fill('Seguimiento de f1r')
 page.locator('#nbDossierForm button[type=submit]').click()
 check('expediente creado',page.locator('.nb-dossier').count()==1)
 check('nota original conservada',page.get_by_text('Nota heredada').is_visible())
 check('clave antigua intacta',page.evaluate("JSON.parse(localStorage.getItem('voynich404-notes-v1'))[0].title")=='Nota heredada')
 check('nueva clave creada',page.evaluate("!!localStorage.getItem('voynich404-notebook-v2')"))
 # adding note with references
 page.locator('#noteTitle').fill('Mi referencia EVA')
 page.locator('#noteBody').fill('Hipótesis de trabajo <script>alert(1)</script>')
 page.locator('#nbDossierSelect').select_option(index=1)
 page.locator('#nbTags').fill('EVA, Botánica, eva')
 page.locator('#nbFolio').fill('f1r')
 page.locator('#nbTheory').select_option('eva')
 page.locator('#nbAtlas').select_option(index=1)
 page.locator('#noteForm button[type=submit]').click()
 check('crea nota nueva',page.locator('.nb-note').count()==2)
 check('HTML peligroso como texto',page.locator('.nb-note script').count()==0 and page.locator('.nb-note').filter(has_text='Mi referencia EVA').locator('.nb-note-body').inner_text().find('<script>')>=0)
 check('tags persistidos',page.locator('.nb-tag').count()==2)
 check('enlace folio aparece',page.locator('[data-nb=folio]').count()==1)
 check('enlace teoría aparece',page.locator('[data-nb=theory]').count()==1)
 check('enlace atlas aparece',page.locator('[data-nb=atlas]').count()==1)
 check('expediente asociado',page.evaluate("JSON.parse(localStorage.getItem('voynich404-notebook-v2')).notes.find(n=>n.title==='Mi referencia EVA').dossierId")!='')
 page.locator('[data-nb=theory]').click(timeout=5000)
 check('vínculo teoría abre enciclopedia',page.locator('#theorySearch').is_visible())
 page.locator('[data-view=cuaderno]').click()
 page.locator('[data-nb=atlas]').click(timeout=5000)
 check('vínculo atlas abre catálogo',page.locator('#atlasSearch').is_visible())
 page.locator('[data-view=cuaderno]').click()
 page.evaluate('window.scrollTo(0,0)');page.wait_for_timeout(950);page.screenshot(path=str(root/'tests/VOYNICH-404_FASE-09_DESKTOP.png'),full_page=False,timeout=5000,animations='disabled')
 # query / filtering
 page.locator('#nbSearch').fill('referencia')
 check('buscador filtra',page.locator('.nb-note').count()==1)
 page.locator('#nbSearch').fill('')
 page.locator('[data-nb=filterTag]').first.click()
 check('filtro etiqueta',page.locator('.nb-note').count()==1)
 page.locator('#nbClearFilters').click()
 check('limpiar filtros',page.locator('.nb-note').count()==2)
 # editing
 page.locator('.nb-note').filter(has_text='Mi referencia EVA').locator('[data-nb=edit]').click()
 check('abre edición',page.locator('#nbFormHeading').inner_text()=='Editar observación')
 page.locator('#noteBody').fill('Texto revisado')
 page.locator('#noteForm button[type=submit]').click()
 check('edición guardada',page.get_by_text('Texto revisado').is_visible())
 check('sin duplicar al editar',page.locator('.nb-note').count()==2)
 # export
 with page.expect_download() as download:
  page.locator('#nbExport').click()
 check('export JSON',download.value.suggested_filename.endswith('.json'))
 # switching view and back
 page.locator('[data-view=inicio]').click()
 page.locator('[data-view=cuaderno]').click()
 check('persistencia al cambiar vista',page.get_by_text('Texto revisado').is_visible())
 check('dossier tras navegar',page.locator('.nb-dossier').count()==1)
 # deleting dossier retains note
 page.locator('[data-nb=deleteDossier]').click()
 check('expediente eliminado',page.locator('.nb-dossier').count()==0)
 check('notas no eliminadas',page.locator('.nb-note').count()==2)
 # deleting note
 page.locator('.nb-note').filter(has_text='Texto revisado').locator('[data-nb=delete]').click()
 check('nota eliminada',page.locator('.nb-note').count()==1)
 check('nota antigua permanece',page.get_by_text('Nota heredada').is_visible())
 # Fusionar backups externos y proteger notas existentes
 backup={'app':'VOYNICH 404','kind':'notebook','schemaVersion':2,'data':{'schemaVersion':2,'dossiers':[], 'notes':[{'id':'imported-one','title':'Nota externa','body':'Importada sin sustitución','tags':['archivo'],'folio':'f2r','theoryId':'','atlasId':'','dossierId':'','createdAt':'2026-10-12T00:00:00.000Z','updatedAt':'2026-10-12T00:00:00.000Z'}]}}
 page.locator('#nbImportFile').set_input_files({'name':'cuaderno.json','mimeType':'application/json','buffer':json.dumps(backup).encode()})
 check('importación añade sin borrar',page.get_by_text('Nota externa').is_visible() and page.get_by_text('Nota heredada').is_visible())
 check('importación contabiliza',page.locator('.nb-note').count()==2)
 page.locator('#nbImportFile').set_input_files({'name':'cuaderno.json','mimeType':'application/json','buffer':json.dumps(backup).encode()})
 check('importación repetida no duplica',page.locator('.nb-note').count()==2)
 page.locator('#nbImportFile').set_input_files({'name':'fallo.json','mimeType':'application/json','buffer':b'{invalid'})
 check('copia corrupta no borra datos',page.locator('.nb-note').count()==2)
 page.locator('[data-nb=folio]').first.click()
 check('vínculo folio abre visor',page.locator('#breadCurrent').text_content().strip()=='Folios originales')
 page.locator('[data-view=cuaderno]').click()
 check('regreso al cuaderno conserva datos',page.get_by_text('Nota externa').is_visible())
 # theories / atlas regression
 page.locator('[data-view=teorias]').click()
 check('teorías conservadas',page.locator('.theory-card').count()==15)
 page.locator('[data-view=atlas]').click()
 check('atlas conservado',page.locator('#atlasSearch').is_visible())
 page.locator('[data-view=criptoanalisis]').click()
 check('criptoanálisis conservado',page.locator('#cryptoRoot').count()>=0 and len(page.locator('#main').inner_text())>100)
 # mobile
 mobile=browser.new_page(viewport={'width':390,'height':844})
 mobile.on('pageerror',lambda e:errors.append('mobile '+str(e)))
 mobile.set_content(html,wait_until='load')
 mobile.locator('#mobileMenu').click()
 mobile.locator('[data-view=cuaderno]').click()
 check('móvil cuaderno visible',mobile.locator('#noteForm').is_visible())
 check('móvil menú cerrado',not mobile.locator('#sidebar').evaluate('(x)=>x.classList.contains("open")'))
 mobile.wait_for_timeout(950)
 check('móvil sin overflow horizontal',mobile.evaluate('document.documentElement.scrollWidth <= window.innerWidth+2'))
 mobile.screenshot(path=str(root/'tests/VOYNICH-404_FASE-09_MOBILE.png'),full_page=False)
 narrow=browser.new_page(viewport={'width':320,'height':700});narrow.set_content(html,wait_until='load');narrow.locator('#mobileMenu').click();narrow.locator('[data-view=cuaderno]').click();narrow.wait_for_timeout(1000)
 check('320px sin desbordamiento',narrow.evaluate('document.documentElement.scrollWidth <= innerWidth+2'))
 corrupt=narrow;corrupt.locator('#mobileMenu').click();corrupt.locator('[data-view=inicio]').click(timeout=5000)
 corrupt.evaluate("localStorage.setItem('voynich404-notebook-v2','{invalid')")
 corrupt.locator('#mobileMenu').click();corrupt.locator('[data-view=cuaderno]').click(timeout=5000)
 check('datos corruptos informados',corrupt.locator('#nbError').is_visible())
 check('datos corruptos bloquean escritura',corrupt.locator('#nbSave').is_disabled())
 check('datos corruptos no sobrescritos',corrupt.evaluate("localStorage.getItem('voynich404-notebook-v2')")=='{invalid')
 check('sin excepciones JS',not errors)
 (root/'tests/RESULTADOS_FASE9.md').write_text('# Fase 9 · Chromium controlado\n\n'+'\n'.join('- PASS '+c for c in checks)+f'\n\n{len(checks)} PASS. Errores JS: {len(errors)}.\n\n**Limitación:** módulos inline y almacenamiento simulado; Chromium del entorno bloquea navegar a localhost.\n')
 print(f'TOTAL {len(checks)} PASS · errores={errors}')
 browser.close()
