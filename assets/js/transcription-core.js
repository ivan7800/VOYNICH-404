/** VOYNICH 404 — conservative IVTFF EVA index. Transliterations are NOT translations. */
export const MAX_IVTFF_CHARS=2_000_000;
export const MAX_IVTFF_LINES=20_000;
export const EVA_DEMO=`#=IVTFF Eva- 2.0 M 5
# DEMOSTRACIÓN LIMITADA: extracto f1r, Zandbergen–Landini ZL3b (2025).
# Fuente: https://www.voynich.nu/data/ZL3b-n.txt
<f1r>      <! $Q=A $P=A $F=a $B=1 $I=T $L=A $H=1 $C=1 $X=V>
<f1r.1,@P0>       <%>fachys.ykal.ar.ataiin.shol.shory.[cth:oto]res.y.kor.sholdy<!@254;>
<f1r.2,+P0>       sory.ckhar.or,y.kair.chtaiin.shar.ase.cthar.cthar,dan`;
const PAGE_ID=/^f\d{1,3}[rv]\d?$/i;
const GLYPH=/^[a-z]+$/i;
const escapeRegExp=text=>text.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
/** Remove explicit positioning controls; preserve uncertain runs so they never enter clean statistics. */
export function tokenizeEVARaw(raw){
 if(typeof raw!=='string')return [];
 const cleaned=raw.replace(/<![^>]*>/g,'').replace(/<%>|<\$>/g,'').replace(/\s+/g,' ');
 return cleaned.split(/[.,\s]+/).map(t=>t.trim()).filter(Boolean).map(text=>({text,valid:GLYPH.test(text),uncertain:!GLYPH.test(text)}));
}
export function parseIVTFF(text){
 if(typeof text!=='string'||!text.trim())throw new Error('Archivo vacío o ilegible');
 if(text.length>MAX_IVTFF_CHARS)throw new Error('El archivo supera el límite de 2 millones de caracteres');
 const lines=text.replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n').split('\n');
 if(lines.length>MAX_IVTFF_LINES)throw new Error('El archivo contiene demasiadas líneas');
 const header=lines[0].match(/^#=IVTFF\s+(Eva-|EvaT)\s+([\d.]+)\s+([MDA])(?:\s|$)/i);
 if(!header)throw new Error('Se requiere un archivo IVTFF con alfabeto Eva- o EvaT (no una traducción ni texto plano)');
 const pages=[];const byPage=new Map();let current=null;let loci=0;let invalid=0;let uncertain=0;let clean=0;
 for(let i=1;i<lines.length;i++){
  const line=lines[i].trim();
  if(!line||line.startsWith('#'))continue;
  if(line.length>5000)throw new Error('Línea excesivamente larga en el corpus');
  const folio=line.match(/^<([^>]+)>\s*(?:<!([^>]*)>)?\s*$/);
  if(folio&&PAGE_ID.test(folio[1])){
   const id=folio[1].toLowerCase();if(byPage.has(id))throw new Error(`Folio duplicado: ${id}`);
   const metadata={};for(const m of (folio[2]||'').matchAll(/\$([A-Z])=([^\s>]+)/g))metadata[m[1]]=m[2];
   current={id,metadata,lines:[]};pages.push(current);byPage.set(id,current);continue;
  }
  const locus=line.match(/^<([^,.<>]+)\.([^,<>]+),([^<>]+)>\s*(.*)$/);
  if(locus){
   const id=locus[1].toLowerCase();
   if(!PAGE_ID.test(id)||!byPage.has(id)){invalid++;continue;}
   const page=byPage.get(id); const raw=locus[4].trim();
   const tokens=tokenizeEVARaw(raw);uncertain+=tokens.filter(t=>t.uncertain).length;clean+=tokens.filter(t=>t.valid).length;
   page.lines.push({location:locus[2],locus:locus[3].replace(/^[=@+*]/,''),raw,tokens});loci++;current=page;continue;
  }
  // Metadata and comments not understood are never silently made into words.
  invalid++;
 }
 if(!pages.length||!loci)throw new Error('No se encontraron folios y líneas IVTFF válidos');
 return {format:'IVTFF',alphabet:header[1],version:header[2],pages,loci,clean,uncertain,invalid};
}
export function flattenLines(dataset,folio='todos',locus='todos'){
 if(!dataset||!Array.isArray(dataset.pages))return [];
 const rows=[];for(const page of dataset.pages){if(folio!=='todos'&&page.id!==folio)continue;for(const line of page.lines){if(locus!=='todos'&&line.locus[0]!==locus)continue;rows.push({...line,folio:page.id})}}return rows;
}
export function summarize(dataset,{folio='todos',locus='todos'}={}){
 const rows=flattenLines(dataset,folio,locus),frequency=new Map(),glyphs=new Map(),pairs=new Map();let reliable=0,ambiguous=0;
 for(const line of rows){for(const item of line.tokens){if(!item.valid){ambiguous++;continue}const word=item.text.toLowerCase();reliable++;frequency.set(word,(frequency.get(word)||0)+1);for(const glyph of word)glyphs.set(glyph,(glyphs.get(glyph)||0)+1);for(let k=0;k<word.length-1;k++){const pair=word.slice(k,k+2);pairs.set(pair,(pairs.get(pair)||0)+1)}}}
 const sorted=m=>[...m.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
 return {rows:rows.length,words:reliable,ambiguous,distinct:frequency.size,topWords:sorted(frequency),glyphs:sorted(glyphs),bigrams:sorted(pairs)};
}
export function searchIVTFF(dataset,needle,{folio='todos',locus='todos',mode='contiene',limit=150}={}){
 const query=String(needle||'').trim().toLowerCase();if(!/^[a-z]{1,30}$/.test(query))return {count:0,results:[],valid:false};
 const rows=flattenLines(dataset,folio,locus);let count=0;const results=[];
 for(const line of rows){const matches=line.tokens.filter(t=>t.valid&&(mode==='exacta'?t.text.toLowerCase()===query:t.text.toLowerCase().includes(query)));
  if(matches.length){count+=matches.length;if(results.length<limit)results.push({...line,hits:matches.length})}
 }
 return {count,results,valid:true};
}
export function csvTopWords(data,limit=200,source='Muestra ZL3b',scope='corpus'){
 const safeCell=x=>{let value=String(x);if(/^[=+@-]/.test(value))value="'"+value;return '"'+value.replaceAll('"','""')+'"'};
 const rows=['fuente;ambito;token;frecuencia'];
 for(const [word,count] of data.topWords.slice(0,limit))rows.push([safeCell(source),safeCell(scope),safeCell(word),count].join(';'));
 return '\uFEFF'+rows.join('\r\n')+'\r\n';
}
export function highlightedEVA(raw,term){
 const escape=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
 if(!term||!/^[a-z]{1,30}$/i.test(term))return escape(raw);
 const pattern=new RegExp(`(${escapeRegExp(term)})`,'gi');return escape(raw).replace(pattern,'<mark>$1</mark>');
}
