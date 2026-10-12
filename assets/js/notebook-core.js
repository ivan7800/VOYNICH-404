/** VOYNICH 404 · Investigación personal local, sin afirmaciones históricas automáticas. */
export const NOTEBOOK_KEY='voynich404-notebook-v2';
export const LEGACY_NOTES_KEY='voynich404-notes-v1';
export const NOTEBOOK_SCHEMA=2;
export const MAX_NOTES=500;
export const MAX_DOSSIERS=80;
export const MAX_BACKUP_BYTES=3_000_000;
const str=(v,max)=>typeof v==='string'?v.trim().slice(0,max):'';
const iso=(v)=>typeof v==='string'&&Number.isFinite(Date.parse(v))?new Date(v).toISOString():null;
const idValid=s=>/^[\w.:-]{1,100}$/.test(s);
const folioValid=s=>!s||/^f\d{1,3}[rv](?:\d)?$/i.test(s);
const nowDate=()=>new Date().toISOString();
export function normalizeTags(value){const arr=Array.isArray(value)?value:String(value||'').split(',');return [...new Set(arr.map(x=>str(x,30).toLocaleLowerCase('es')).filter(Boolean))].slice(0,8)}
export function validateNote(input,{theoryIds=[],atlasIds=[]}={}){
 if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Nota inválida.');
 const id=str(input.id,100),title=str(input.title,90),body=str(input.body,5000),folio=str(input.folio,12).toLowerCase(),theoryId=str(input.theoryId,100),atlasId=str(input.atlasId,100),dossierId=str(input.dossierId,100);
 if(!idValid(id)||!title||!body||!folioValid(folio))throw Error('Nota con identificador, contenido o folio inválido.');
 if(theoryId&& !theoryIds.includes(theoryId))throw Error('La nota refiere una teoría inexistente.');
 if(atlasId&& !atlasIds.includes(atlasId))throw Error('La nota refiere una ficha del atlas inexistente.');
 if(dossierId && !idValid(dossierId))throw Error('Expediente inválido.');
 const createdAt=iso(input.createdAt)||nowDate(),updatedAt=iso(input.updatedAt)||createdAt;
 return {id,title,body,tags:normalizeTags(input.tags),folio,theoryId,atlasId,dossierId,createdAt,updatedAt};
}
export function validateDossier(input){
 if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Expediente inválido.');
 const id=str(input.id,100),title=str(input.title,90),description=str(input.description,500);
 if(!idValid(id)||!title)throw Error('Identificador o título de expediente inválido.');
 return {id,title,description,createdAt:iso(input.createdAt)||nowDate()};
}
export function emptyNotebook(){return {schemaVersion:NOTEBOOK_SCHEMA,notes:[],dossiers:[]}}
export function validateNotebook(input,ids={}){
 if(!input||typeof input!=='object'||Array.isArray(input)||input.schemaVersion!==NOTEBOOK_SCHEMA||!Array.isArray(input.notes)||!Array.isArray(input.dossiers))throw Error('Formato de cuaderno incompatible.');
 if(input.notes.length>MAX_NOTES||input.dossiers.length>MAX_DOSSIERS)throw Error('Demasiadas notas o expedientes.');
 const dossiers=input.dossiers.map(validateDossier),notes=input.notes.map(n=>validateNote(n,ids));
 if(new Set(dossiers.map(x=>x.id)).size!==dossiers.length||new Set(notes.map(x=>x.id)).size!==notes.length)throw Error('Identificadores duplicados.');
 const dossierIds=new Set(dossiers.map(x=>x.id));
 if(notes.some(x=>x.dossierId&&!dossierIds.has(x.dossierId)))throw Error('Una nota está vinculada a un expediente inexistente.');
 return {schemaVersion:NOTEBOOK_SCHEMA,notes,dossiers};
}
export function upgradeLegacyNotes(value){
 if(!Array.isArray(value)||value.length>MAX_NOTES)throw Error('Las notas antiguas no tienen formato válido.');
 const taken=new Set();return {schemaVersion:NOTEBOOK_SCHEMA,dossiers:[],notes:value.map((x,index)=>{
  if(!x||typeof x!=='object'||typeof x.title!=='string'||typeof x.body!=='string')throw Error('Existe una nota antigua dañada.');
  let id=str(x.id,100);if(!idValid(id)||taken.has(id))id=`legacy-${index}`;taken.add(id);
  const date=typeof x.date==='string'?x.date:'';
  let when=iso(x.createdAt);if(!when&&/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(date)){const [d,m,y]=date.split('/').map(Number);when=iso(`${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}T12:00:00Z`)}
  return validateNote({id,title:x.title,body:x.body,createdAt:when||nowDate(),updatedAt:when||nowDate()});
 })};
}
export function parseNotebookBackup(raw,ids={}){
 if(typeof raw!=='string'||new Blob([raw]).size>MAX_BACKUP_BYTES)throw Error('La copia supera el tamaño máximo de 3 MB.');
 let item;try{item=JSON.parse(raw)}catch{throw Error('El archivo no es JSON válido.')}
 if(item?.app!=='VOYNICH 404')throw Error('La copia no pertenece a VOYNICH 404.');
 if(item?.kind==='notebook'&&item?.schemaVersion===NOTEBOOK_SCHEMA)return validateNotebook(item.data,ids);
 if(item?.format===1&&Array.isArray(item.notes))return upgradeLegacyNotes(item.notes);
 throw Error('Esquema de copia de seguridad no compatible.');
}
export function createNotebookBackup(data,ids={}){const clean=validateNotebook(data,ids);return JSON.stringify({app:'VOYNICH 404',kind:'notebook',schemaVersion:NOTEBOOK_SCHEMA,exportedAt:nowDate(),data:clean},null,2)}
export function mergeNotebook(current,incoming,ids={}){
 const base=validateNotebook(current,ids),other=validateNotebook(incoming,ids),merged={schemaVersion:NOTEBOOK_SCHEMA,dossiers:[...base.dossiers],notes:[...base.notes]};
 const did=new Set(base.dossiers.map(d=>d.id));let newDossiers=0,newNotes=0,conflicts=0;
 for(const d of other.dossiers){if(!did.has(d.id)){merged.dossiers.push(d);did.add(d.id);newDossiers++}else if(JSON.stringify(base.dossiers.find(x=>x.id===d.id))!==JSON.stringify(d))conflicts++}
 const nid=new Set(base.notes.map(n=>n.id));for(const n of other.notes){if(!nid.has(n.id)){merged.notes.push(n);nid.add(n.id);newNotes++}else if(JSON.stringify(base.notes.find(x=>x.id===n.id))!==JSON.stringify(n))conflicts++}
 return {data:validateNotebook(merged,ids),newNotes,newDossiers,conflicts};
}
export function filterNotebook(notes,{search='',dossier='all',tag='',folio='',theory=''}={}){
 const term=String(search).trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const normalize=x=>String(x).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 return notes.filter(n=>(dossier==='all'||(dossier==='none'?!n.dossierId:n.dossierId===dossier))&&(!tag||n.tags.includes(tag))&&(!folio||n.folio.toLowerCase()===folio.toLowerCase())&&(!theory||n.theoryId===theory)&&(!term||normalize([n.title,n.body,n.folio,n.theoryId,n.atlasId,n.tags.join(' ')].join(' ')).includes(term))).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
}
