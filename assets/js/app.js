import {SOURCES,SECTIONS,EVIDENCE,TIMELINE,STATUS} from './data.js';
import {viewerHTML,mountViewer} from './viewer.js';
import {atlasHTML,mountAtlas} from './atlas.js';
import {ATLAS_ENTRIES} from './atlas-data.js';
import {transcriptionHTML,mountTranscription} from './transcription.js';
import {cryptoHTML,mountCrypto} from './crypto.js';
import {theoriesHTML,mountTheories} from './theories.js';
import {THEORY_ENTRIES,THEORY_SOURCES} from './theories-data.js';
import {notebookHTML,mountNotebook} from './notebook.js';

const main=document.querySelector('#main');
const navigation=document.querySelector('#mainNav');
const themePicker=document.querySelector('#themePicker');
const dialog=document.querySelector('#detailDialog');
const dialogContent=document.querySelector('#detailContent');
const toast=document.querySelector('#toast');
const searchDialog=document.querySelector('#searchDialog');
const preferencesDialog=document.querySelector('#preferencesDialog');
const searchInput=document.querySelector('#globalSearch');
const searchResults=document.querySelector('#searchResults');
const sidebar=document.querySelector('#sidebar');
const sidebarBackdrop=document.querySelector('#sidebarBackdrop');
const mobileMenu=document.querySelector('#mobileMenu');
const modalFocus=new WeakMap();
let commandSelection=0;
let searchMatches=[];

const allowedViews=['inicio','codice','atlas','transcripcion','criptoanalisis','teorias','visor','evidencias','cronologia','cuaderno','fuentes'];
const titles={inicio:'Inicio',codice:'El códice',atlas:'Atlas iconográfico',transcripcion:'Laboratorio EVA',criptoanalisis:'Criptoanálisis',teorias:'Teorías y descubrimientos',visor:'Folios originales',evidencias:'Evidencias',cronologia:'Cronología',cuaderno:'Mi cuaderno',fuentes:'Fuentes'};
let currentView='inicio';
let releaseViewer=null;
let releaseAtlas=null;
let releaseTranscription=null;
let releaseCrypto=null;
let releaseTheories=null;
let releaseNotebook=null;
let evidenceFilter='todos';
let noticeTimer;
const storage={
 get(key,fallback){try{const v=localStorage.getItem(key);return v===null?fallback:JSON.parse(v)}catch{return fallback}},
 put(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}
};
const esc=(v)=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function notify(message){toast.textContent=message;toast.classList.add('visible');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>toast.classList.remove('visible'),2600)}
function sourceFor(id){return SOURCES.find(s=>s.id===id)}
function sourceLink(id){const src=sourceFor(id);return src?`<a href="${esc(src.url)}" target="_blank" rel="noopener noreferrer">${esc(src.title)} ↗</a>`:''}
function intro(kicker,title,description){return `<section class="page-head"><div class="eyebrow">${kicker}</div><h1>${title}</h1><p>${description}</p></section>`}
function miniPlant(){return `<svg viewBox="0 0 320 410" role="img" aria-label="Ilustración ornamental original inspirada en botánica medieval, no es una página del Voynich" xmlns="http://www.w3.org/2000/svg">
 <g fill="none" stroke="#655b3c" stroke-width="1.8" stroke-linecap="round"><path d="M157 348Q153 270 161 220T155 100"/><path d="M158 288Q103 257 86 224M160 262Q223 233 236 202M160 221Q110 202 91 160M159 192Q195 150 224 126M157 150Q128 132 118 103"/>
 <path d="M157 348Q134 352 105 380M157 348Q192 360 213 381M157 349Q153 372 159 393"/>
 </g>
 <g fill="#78805e" stroke="#626747" stroke-width="1.4"><path d="M85 222Q48 210 43 174Q82 174 85 222Z"/><path d="M96 232Q55 255 50 276Q83 272 96 232Z"/><path d="M235 199Q270 168 288 187Q278 209 235 199Z"/><path d="M223 210Q248 248 282 245Q262 213 223 210Z"/><path d="M91 160Q53 139 51 104Q88 113 91 160Z"/><path d="M105 179Q81 205 49 202Q74 171 105 179Z"/><path d="M225 127Q259 90 273 115Q269 145 225 127Z"/><path d="M212 143Q244 163 259 181Q216 177 212 143Z"/><path d="M120 103Q97 79 102 53Q128 67 120 103Z"/><path d="M161 161Q175 144 171 107Q150 120 161 161Z"/></g>
 <g fill="#8a5e46" stroke="#75523a" stroke-width="1.2"><circle cx="157" cy="91" r="18"/><circle cx="157" cy="65" r="15"/><circle cx="135" cy="78" r="14"/><circle cx="176" cy="78" r="14"/><circle cx="142" cy="102" r="14"/><circle cx="177" cy="104" r="14"/></g><g fill="#dabf88"><circle cx="157" cy="88" r="9"/><circle cx="157" cy="65" r="5"/><circle cx="136" cy="80" r="4"/><circle cx="177" cy="78" r="4"/><circle cx="143" cy="104" r="4"/><circle cx="177" cy="103" r="4"/></g>
 <g font-family="Georgia,serif" font-style="italic" fill="#6f6147" opacity=".8" font-size="14"><text x="23" y="34">oaiin  chedy  qotar</text><text x="22" y="51">fachys  otey  ar</text><text x="198" y="309">qol · sodar</text><text x="198" y="327">or · dayn</text></g></svg>`}
function home(){return `<section class="hero"><div><div class="eyebrow">ARCHIVO HISTÓRICO · BEINECKE MS 408</div><h1>El libro que <span>nadie ha logrado leer.</span></h1><div class="accent-rule"></div><p class="lead">Una investigación interactiva sobre el Manuscrito Voynich: lo documentado, lo desconocido y las hipótesis que siguen abiertas.</p><div class="action-row"><button class="btn" data-open="codice" type="button">Explorar el códice <span>→</span></button><button class="btn secondary" data-open="atlas" type="button">Explorar atlas <span>↗</span></button><button class="btn secondary" data-open="transcripcion" type="button">Laboratorio EVA <span>⌁</span></button><button class="btn secondary" data-open="criptoanalisis" type="button">Criptoanálisis <span>↗</span></button><button class="btn secondary" data-open="teorias" type="button">Teorías documentadas <span>⚖</span></button></div><div class="kpi-grid"><div class="stat"><strong>MS 408</strong><span>Signatura oficial</span></div><div class="stat"><strong>1404–38</strong><span>Datación del pergamino</span></div><div class="stat"><strong>6</strong><span>Secciones convencionales</span></div></div></div><div class="folio-art">${miniPlant()}<span class="folio-stamp">Ilustración conceptual propia<br>No es un folio original</span></div></section>
 <div class="section-heading"><div><div class="eyebrow">EXPEDICIONES DE INVESTIGACIÓN</div><h2>¿Por dónde empezamos?</h2></div><span class="micro">FASE 09 / CUADERNO AVANZADO</span></div>
 <div class="grid3 expedition-grid"><button class="feature" type="button" data-open="atlas"><span class="glyph">❧</span><h3>Atlas del códice</h3><p>Recorre los seis grandes grupos visuales y accede a la digitalización oficial.</p></button><button class="feature" type="button" data-open="evidencias"><span class="glyph">◈</span><h3>Mesa de evidencias</h3><p>Filtra hechos comprobados, preguntas abiertas y nuevas hipótesis.</p></button><button class="feature" type="button" data-open="cuaderno"><span class="glyph">✎</span><h3>Diario del investigador</h3><p>Guarda tus observaciones en este navegador. Sin cuentas ni servidores.</p></button></div>
 <section class="research-strip" aria-label="Estado del archivo"><div class="research-index"><span class="tiny-seal">V</span><div><span class="eyebrow">ESTADO DE LA INVESTIGACIÓN</span><strong>Un misterio real. Evidencias verificables.</strong></div></div><button type="button" class="strip-action" data-open="cronologia">Recorrer 600 años de historia <span aria-hidden="true">↗</span></button></section>
 <aside class="tip"><strong>Principio editorial:</strong> el manuscrito no está descifrado. Las transcripciones como EVA son herramientas de análisis, no traducciones. ${sourceLink('trans')}</aside>`}
function codex(){return `${intro('01 / ARCHIVO MATERIAL','Dentro del códice','La división en seis grupos es una clasificación moderna basada en los dibujos. Sus nombres no constituyen una lectura del texto.')}
 <div class="grid2">${SECTIONS.map(item=>`<button type="button" class="section-card" data-section="${item.id}"><span class="glyph" aria-hidden="true">${item.icon}</span><div><div class="tag">${esc(item.tag)}</div><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p><span class="micro">VER INFORMACIÓN →</span></div></button>`).join('')}</div>
 <aside class="tip"><strong>Digitalización original:</strong> explora las páginas mediante el <button class="small-link" data-open="visor" type="button">visor IIIF de Yale ↗</button>. El archivo incluye un catálogo que se consulta en línea y puede importarse manualmente. <button class="small-link" data-open="atlas" type="button">Abrir atlas botánico y astronómico →</button>. ${sourceLink('digital')}</aside>`}
function evidenceCards(){const items=evidenceFilter==='todos'?EVIDENCE:EVIDENCE.filter(e=>e.type===evidenceFilter);return `<div class="grid2" id="cards">${items.map(e=>`<article class="panel research-card"><header><span class="topic">${esc(e.topic)}</span><span class="pill ${e.type}">${STATUS[e.type].label}</span></header><h3>${esc(e.title)}</h3><p>${esc(e.desc)}</p><div class="card-foot"><span class="micro">${e.sources.length} fuente${e.sources.length!==1?'s':''}</span><button class="small-link" type="button" data-evidence="${e.id}">Ver referencias ↗</button></div></article>`).join('')}</div>`}
function evidences(){return `${intro('02 / INVESTIGACIÓN','La mesa de evidencias','Las fichas distinguen entre hechos documentados, hipótesis de investigación y cuestiones abiertas. Filtra para estudiar cada nivel.')}
 <div class="filter-bar" role="group" aria-label="Filtrar evidencias">${[['todos','Todas'],['documentado','Documentadas'],['hipotesis','Hipótesis'],['incierto','No resueltas']].map(([id,t])=>`<button type="button" class="chip ${evidenceFilter===id?'active':''}" aria-pressed="${evidenceFilter===id}" data-filter="${id}">${t}</button>`).join('')}</div>${evidenceCards()}
 <aside class="tip">Una hipótesis publicada en una revista científica no equivale a un consenso ni a la demostración de una traducción.</aside>`}
function chronology(){return `${intro('03 / HISTORIA DEL OBJETO','Seis siglos de preguntas','Cronología selectiva de hitos verificables y estudios documentados. Cada entrada puede consultarse en su fuente.')}
 <div class="timeline">${TIMELINE.map(m=>`<article class="moment"><div class="date">${esc(m.date)}</div><h3>${esc(m.title)}</h3><p>${esc(m.detail)}</p><div>${sourceLink(m.source)}</div></article>`).join('')}</div>`}
function sources(){return `${intro('05 / BIBLIOGRAFÍA','Fuentes y metodología','Enlaces a instituciones y materiales de investigación consultados. Una fuente describe sus propios resultados; no legitima automáticamente todas las interpretaciones que se le atribuyan.')}
 <div class="panel">${SOURCES.map(s=>`<article class="source-row"><div><h3>${esc(s.title)}</h3><p>${esc(s.organization)} · ${esc(s.kind)}</p></div><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer" aria-label="Abrir ${esc(s.title)} en nueva pestaña">Consultar ↗</a></article>`).join('')}<h2 style="margin:28px 0 8px;font-family:Georgia,serif">Investigaciones de la enciclopedia</h2><p class="micro">Fuentes históricas y académicas utilizadas en la fase 8. El enlace a una publicación no convierte automáticamente su hipótesis en cierta.</p>${Object.entries(THEORY_SOURCES).filter(([id])=>!['yale','dating','trans','singulion'].includes(id)).map(([id,src])=>`<article class="source-row"><div><h3>${esc(src.title)}</h3><p>${esc(src.author)} · ${esc(src.year)} · ${esc(src.kind)}</p></div><a href="${esc(src.url)}" target="_blank" rel="noopener noreferrer" aria-label="Consultar ${esc(src.title)}">Consultar ↗</a></article>`).join('')}</div><aside class="tip"><strong>Imágenes y derechos:</strong> las imágenes originales se solicitan a Yale en línea y no se incluyen en el ZIP. Consulta las condiciones de uso de la Biblioteca Beinecke antes de redistribuirlas.</aside>`}
const templates={inicio:home,codice:codex,atlas:atlasHTML,transcripcion:transcriptionHTML,criptoanalisis:cryptoHTML,teorias:theoriesHTML,visor:viewerHTML,evidencias:evidences,cronologia:chronology,cuaderno:notebookHTML,fuentes:sources};
function navigate(view,{push=true,initialFolio=null}={}){
 if(!allowedViews.includes(view))view='inicio';currentView=view;
 document.querySelector('#breadCurrent').textContent=titles[view];
 navigation.querySelectorAll('[data-view]').forEach(b=>{const active=b.dataset.view===view;b.classList.toggle('active',active);active?b.setAttribute('aria-current','page'):b.removeAttribute('aria-current')});
 if(releaseViewer){releaseViewer();releaseViewer=null}
 if(releaseAtlas){releaseAtlas();releaseAtlas=null}
 if(releaseTranscription){releaseTranscription();releaseTranscription=null}
 if(releaseCrypto){releaseCrypto();releaseCrypto=null}
 if(releaseTheories){releaseTheories();releaseTheories=null}
 if(releaseNotebook){releaseNotebook();releaseNotebook=null}
 main.innerHTML=templates[view]();
 if(view==='visor')releaseViewer=mountViewer(main,{notify,initialFolio,onAnnotate:page=>{
  navigate('cuaderno');const form=main.querySelector('#noteForm');if(form){form.elements.title.value=('Folio '+page.label).slice(0,90);form.elements.body.value='Beinecke MS 408, '+page.label+'\nhttps://collections.library.yale.edu/catalog/2002046\n\nObservaciones: ';main.querySelector('#nbFolio').value=page.label.match(/^f\d{1,3}[rv]\d?$/i)?page.label:'';form.elements.body.focus()}
 }});
 if(view==='atlas')releaseAtlas=mountAtlas(main,{notify,openFolio:folio=>navigate('visor',{initialFolio:folio})});
 if(view==='transcripcion')releaseTranscription=mountTranscription(main,{notify,openFolio:folio=>navigate('visor',{initialFolio:folio})});
 if(view==='criptoanalisis')releaseCrypto=mountCrypto(main,{notify,openEVA:()=>navigate('transcripcion')});
 if(view==='teorias')releaseTheories=mountTheories(main,{notify,openFolio:folio=>navigate('visor',{initialFolio:folio}),writeNote:({title,body})=>{navigate('cuaderno');const form=main.querySelector('#noteForm');if(form){form.elements.title.value=title;form.elements.body.value=body;form.elements.body.focus()}}});
 if(view==='cuaderno')releaseNotebook=mountNotebook(main,{notify,openFolio:folio=>navigate('visor',{initialFolio:folio}),openTheory:id=>{navigate('teorias');const entry=THEORY_ENTRIES.find(x=>x.id===id);const search=main.querySelector('#theorySearch');if(entry&&search){search.value=entry.title;search.dispatchEvent(new Event('input',{bubbles:true}));const details=main.querySelector('[data-theory-card] details');if(details)details.open=true}},openAtlas:id=>{navigate('atlas');const entry=ATLAS_ENTRIES.find(x=>x.id===id);const search=main.querySelector('#atlasSearch');if(entry&&search){search.value=entry.title;search.dispatchEvent(new Event('input',{bubbles:true}))}}});
 closeMobileMenu();if(push){const dest='#'+view;if(location.hash!==dest)history.pushState({view},'',dest)}
 window.scrollTo({top:0,behavior:'instant'});refreshProgress();requestAnimationFrame(animateView);
}
function showDialog(title,description,ids,label='Referencias'){const links=ids.map(sourceLink).join('');dialogContent.innerHTML=`<div class="eyebrow">ARCHIVO DE INVESTIGACIÓN</div><h2 id="dialogTitle" style="font-size:34px;margin:14px 0">${esc(title)}</h2><p class="dialog-body">${esc(description)}</p><div class="dialog-sources"><div class="eyebrow">${esc(label)}</div>${links}</div>`;modalFocus.set(dialog,document.activeElement);if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');document.querySelector('#closeDialog').focus()}
function setTheme(theme){if(!['nocturno','pergamino','laboratorio'].includes(theme))theme='nocturno';document.body.dataset.theme=theme;themePicker.value=theme;storage.put('voynich404-theme',theme);syncPreferences()}
navigation.addEventListener('click',ev=>{const button=ev.target.closest('[data-view]');if(button)navigate(button.dataset.view)});
main.addEventListener('click',ev=>{const node=ev.target.closest('button');if(!node)return;if(node.dataset.open){navigate(node.dataset.open);return}if(node.dataset.section){const s=SECTIONS.find(x=>x.id===node.dataset.section);if(s)showDialog(s.title,s.description+' Estado editorial: '+s.status+'.',[s.source]);return}if(node.dataset.evidence){const e=EVIDENCE.find(x=>x.id===node.dataset.evidence);if(e)showDialog(e.title,e.desc,e.sources);return}if(node.dataset.filter){evidenceFilter=node.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>{const pressed=b.dataset.filter===evidenceFilter;b.classList.toggle('active',pressed);b.setAttribute('aria-pressed',String(pressed))});document.querySelector('#cards').outerHTML=evidenceCards();node.focus();animateView();return}});
document.querySelector('#themeCycle').addEventListener('click',()=>{const options=['nocturno','pergamino','laboratorio'];setTheme(options[(options.indexOf(themePicker.value)+1)%options.length]);notify('Apariencia actualizada')});
themePicker.addEventListener('change',()=>setTheme(themePicker.value));
mobileMenu.addEventListener('click',()=>{sidebar.classList.contains('open')?closeMobileMenu():openMobileMenu()});
sidebarBackdrop.addEventListener('click',closeMobileMenu);
document.querySelector('#closeDialog').addEventListener('click',()=>{if(typeof dialog.close==='function')dialog.close();else dialog.removeAttribute('open')});
dialog.addEventListener('close',restoreFocus);
dialog.addEventListener('click',ev=>{if(ev.target===dialog)dialog.close()});
window.addEventListener('popstate',()=>navigate(location.hash.replace('#',''),{push:false}));
window.addEventListener('hashchange',()=>{const target=location.hash.replace('#','');if(target!==currentView)navigate(target,{push:false})});

function restoreFocus(event){const previous=modalFocus.get(event.target);modalFocus.delete(event.target);if(!dialog.open&&!searchDialog.open&&!preferencesDialog.open&&previous?.isConnected)previous.focus()}
function closeMobileMenu(){sidebar.classList.remove('open');sidebarBackdrop.classList.remove('shown');mobileMenu.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open')}
function openMobileMenu(){sidebar.classList.add('open');sidebarBackdrop.classList.add('shown');mobileMenu.setAttribute('aria-expanded','true');document.body.classList.add('menu-open');sidebar.querySelector('[data-view]')?.focus()}
function refreshProgress(){const range=Math.max(1,document.documentElement.scrollHeight-innerHeight);const pct=Math.max(0,Math.min(100,(scrollY/range)*100));document.querySelector('#readingProgress').style.width=pct+'%'}
window.addEventListener('scroll',refreshProgress,{passive:true});window.addEventListener('resize',()=>{refreshProgress();if(innerWidth>750)closeMobileMenu()});
function animateView(){if(document.body.dataset.motion==='off')return;const nodes=main.querySelectorAll('.hero,.page-head,.section-heading,.research-strip,.feature,.research-card,.section-card,.moment,.source-row,.folio-art');nodes.forEach((el,i)=>{el.classList.remove('enter');void el.offsetWidth;el.style.setProperty('--delay',Math.min(i,9)*48+'ms');el.classList.add('enter')})}
const prefs={
 setSize(size){const v=['compacta','normal','amplia'].includes(size)?size:'normal';document.body.dataset.type=v;storage.put('voynich404-type',v);syncPreferences()},
 setMotion(on){document.body.dataset.motion=on?'on':'off';storage.put('voynich404-motion',on?'on':'off');syncPreferences()}
};
function syncPreferences(){document.querySelectorAll('[data-skin]').forEach(btn=>{const active=btn.dataset.skin===document.body.dataset.theme;btn.classList.toggle('selected',active);btn.setAttribute('aria-pressed',String(active))});document.querySelectorAll('[data-size]').forEach(btn=>{const active=btn.dataset.size===document.body.dataset.type;btn.classList.toggle('selected',active);btn.setAttribute('aria-pressed',String(active))});const motion=document.body.dataset.motion!=='off';const toggle=document.querySelector('#motionToggle');toggle.setAttribute('aria-pressed',String(motion));toggle.setAttribute('aria-label',motion?'Desactivar animaciones':'Activar animaciones');toggle.textContent=motion?'Activadas':'Desactivadas'}
function showModal(element,focused){modalFocus.set(element,document.activeElement);element.showModal();focused?.focus()}
function closeModal(element){if(element.open)element.close()}
document.querySelector('#openPreferences').addEventListener('click',()=>showModal(preferencesDialog,preferencesDialog.querySelector('[data-skin]')));
document.querySelector('#sidebarPreferences').addEventListener('click',()=>{closeMobileMenu();showModal(preferencesDialog,preferencesDialog.querySelector('[data-skin]'))});
document.querySelectorAll('[data-close-dialog]').forEach(btn=>btn.addEventListener('click',()=>closeModal(document.getElementById(btn.dataset.closeDialog))));
[preferencesDialog,searchDialog].forEach(el=>{el.addEventListener('close',restoreFocus);el.addEventListener('click',e=>{if(e.target===el)el.close()})});
preferencesDialog.addEventListener('click',event=>{const skin=event.target.closest('[data-skin]');if(skin){setTheme(skin.dataset.skin);notify('Skin actualizado');return}const size=event.target.closest('[data-size]');if(size){prefs.setSize(size.dataset.size);return}});
document.querySelector('#motionToggle').addEventListener('click',()=>prefs.setMotion(document.body.dataset.motion==='off'));
document.querySelector('#resetPreferences').addEventListener('click',()=>{setTheme('nocturno');prefs.setSize('normal');prefs.setMotion(true);notify('Preferencias restablecidas')});
const commandIndex=[...allowedViews.map(id=>({kind:'view',id,title:titles[id],detail:'Sección del archivo'})),...SECTIONS.map(s=>({kind:'section',id:s.id,title:s.title,detail:s.description})),...EVIDENCE.map(e=>({kind:'evidence',id:e.id,title:e.title,detail:e.desc})),...ATLAS_ENTRIES.map(a=>({kind:'atlas',id:a.id,title:a.title,detail:a.observed})),...THEORY_ENTRIES.map(e=>({kind:'theory',id:e.id,title:e.title,detail:e.summary}))];
const plain=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es');
function renderCommandResults(){const needle=plain(searchInput.value.trim());searchMatches=commandIndex.filter(x=>plain(x.title+' '+x.detail).includes(needle)).slice(0,12);commandSelection=Math.min(commandSelection,Math.max(0,searchMatches.length-1));searchResults.innerHTML=searchMatches.length?searchMatches.map((x,i)=>`<button type="button" class="command-option ${i===commandSelection?'selected':''}" data-result="${i}" aria-selected="${i===commandSelection}"><span class="command-icon" aria-hidden="true">${x.kind==='view'?'⌂':x.kind==='section'?'❧':x.kind==='atlas'?'✦':'◈'}</span><span class="command-copy"><strong>${esc(x.title)}</strong><small>${esc(x.detail)}</small></span><span class="command-arrow" aria-hidden="true">↗</span></button>`).join(''):'<div class="empty">No hay coincidencias dentro del archivo disponible.</div>'}
function selectCommand(index){const entry=searchMatches[index];if(!entry)return;closeModal(searchDialog);if(entry.kind==='view'){navigate(entry.id);return}if(entry.kind==='theory'){navigate('teorias');const search=document.querySelector('#theorySearch');if(search){search.value=entry.title;search.dispatchEvent(new Event('input',{bubbles:true}));const detail=main.querySelector('[data-theory-card] details');if(detail)detail.open=true}return}if(entry.kind==='atlas'){navigate('atlas');document.querySelector('#atlasSearch').value=entry.title;document.querySelector('#atlasSearch').dispatchEvent(new Event('input',{bubbles:true}));return}if(entry.kind==='section'){navigate('codice');const s=SECTIONS.find(x=>x.id===entry.id);if(s){document.querySelector(`[data-section="${s.id}"]`)?.focus();showDialog(s.title,s.description+' Estado editorial: '+s.status+'.',[s.source])}return}navigate('evidencias');const e=EVIDENCE.find(x=>x.id===entry.id);if(e){document.querySelector(`[data-evidence="${e.id}"]`)?.focus();showDialog(e.title,e.desc,e.sources)}}
function openCommand(){if(preferencesDialog.open)preferencesDialog.close();showModal(searchDialog,searchInput);searchInput.value='';commandSelection=0;renderCommandResults()}
document.querySelector('#openSearch').addEventListener('click',openCommand);
searchInput.addEventListener('input',()=>{commandSelection=0;renderCommandResults()});
searchResults.addEventListener('click',event=>{const btn=event.target.closest('[data-result]');if(btn)selectCommand(Number(btn.dataset.result))});
searchInput.addEventListener('keydown',event=>{if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();if(searchMatches.length){commandSelection=(commandSelection+(event.key==='ArrowDown'?1:-1)+searchMatches.length)%searchMatches.length;renderCommandResults();searchResults.querySelector('.selected')?.scrollIntoView({block:'nearest'})}}else if(event.key==='Enter'){event.preventDefault();selectCommand(commandSelection)}});
document.addEventListener('keydown',event=>{const target=event.target;const editable=target instanceof HTMLElement&&(target.closest('input,textarea,select,[contenteditable=true]'));if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();if(!searchDialog.open)openCommand();return}if(event.key==='/'&&!editable&&!event.altKey&&!event.ctrlKey&&!event.metaKey&&!searchDialog.open&&!preferencesDialog.open&&!dialog.open){event.preventDefault();openCommand();return}if(event.key==='Escape'&&sidebar.classList.contains('open')){closeMobileMenu();mobileMenu.focus()}});
document.body.dataset.type=storage.get('voynich404-type','normal');
document.body.dataset.motion=storage.get('voynich404-motion','on');

setTheme(storage.get('voynich404-theme','nocturno'));
navigate(location.hash.replace('#',''),{push:false});
