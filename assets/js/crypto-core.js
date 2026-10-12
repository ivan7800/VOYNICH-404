/** VOYNICH 404 F7 — Analysis of EVA transcription strings, not manuscript glyphs or meanings. */
import {flattenLines} from './transcription-core.js';
export const CRYPTO_VERSION='1.0';
const good=t=>t&&t.valid&&/^[a-z]+$/i.test(t.text);
export function tokensOf(dataset,{folio='todos',locus='todos'}={}){
 return flattenLines(dataset,folio,locus).flatMap(line=>line.tokens.filter(good).map(t=>t.text.toLowerCase()));
}
export function lineTokens(dataset,opts={}){
 return flattenLines(dataset,opts.folio||'todos',opts.locus||'todos').flatMap(line=>{
  const segments=[];let current=[];for(const t of line.tokens){
   if(good(t))current.push(t.text.toLowerCase());else if(current.length){segments.push(current);current=[]}
  }if(current.length)segments.push(current);return segments;
 });
}
export function frequency(items){const out=new Map();for(const x of items)out.set(x,(out.get(x)||0)+1);return [...out].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));}
export function shannon(counts){const nums=counts.map(x=>Array.isArray(x)?x[1]:x).filter(n=>n>0);const n=nums.reduce((a,b)=>a+b,0);return n? Math.max(0,-nums.reduce((s,v)=>{const p=v/n;return s+p*Math.log2(p)},0)):null;}
export function profile(tokens){const forms=frequency(tokens);const chars=frequency(tokens.flatMap(w=>[...w]));const first=frequency(tokens.map(w=>w[0]));const last=frequency(tokens.map(w=>w.at(-1)));const lengths=frequency(tokens.map(w=>String(w.length)));return {tokens:tokens.length,distinct:forms.length,typeTokenRatio:tokens.length?forms.length/tokens.length:null,charEntropy:shannon(chars),wordEntropy:shannon(forms),averageLength:tokens.length?tokens.reduce((s,w)=>s+w.length,0)/tokens.length:null,top:forms.slice(0,12),first:first.slice(0,12),last:last.slice(0,12),lengths:lengths.sort((a,b)=>Number(a[0])-Number(b[0])),chars:chars.slice(0,26)};}
export function ngrams(lines,n=2,{minCount=2,maxResults=40}={}){
 if(![2,3].includes(n))throw Error('n solo puede ser 2 o 3');
 const seen=new Map();for(const line of lines){for(let i=0;i<=line.length-n;i++){const key=line.slice(i,i+n).join(' ');seen.set(key,(seen.get(key)||0)+1)}}
 return [...seen].filter(([,count])=>count>=minCount).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,maxResults);
}
export function collisionCount(lines,n=2){let out=0;const counts=new Map();for(const line of lines){for(let i=0;i<=line.length-n;i++){const key=line.slice(i,i+n).join('|');const cnt=(counts.get(key)||0)+1;counts.set(key,cnt);if(cnt===2)out++}}return out;}
/** Compare distributions, without claiming significance or decipherment. */
export function jsDivergence(wordsA,wordsB){
 if(!wordsA.length||!wordsB.length)return null;
 const a=new Map(frequency(wordsA)),b=new Map(frequency(wordsB));let res=0;
 for(const key of new Set([...a.keys(),...b.keys()])){const p=(a.get(key)||0)/wordsA.length,q=(b.get(key)||0)/wordsB.length,m=(p+q)/2;if(p)res+=.5*p*Math.log2(p/m);if(q)res+=.5*q*Math.log2(q/m)}
 return res;
}
export function groupCompare(dataset,kind='folios',first=null,second=null){
 if(!dataset?.pages?.length)throw Error('Corpus no válido');
 let a=[],b=[],nameA='',nameB='';
 if(kind==='folios'){
  const pA=first||dataset.pages[0]?.id,pB=second||dataset.pages[1]?.id;
  nameA=pA||'Folio A';nameB=pB||'Folio B';a=tokensOf(dataset,{folio:pA});b=tokensOf(dataset,{folio:pB});
 }else if(kind==='loci'){
  nameA='P (párrafos)';nameB='L (etiquetas)';a=tokensOf(dataset,{locus:'P'});b=tokensOf(dataset,{locus:'L'});
 }else if(kind==='currier'){
  nameA='Metadato $L=A';nameB='Metadato $L=B';
  for(const p of dataset.pages){const arr=tokensOf(dataset,{folio:p.id});if(p.metadata?.L==='A')a.push(...arr);if(p.metadata?.L==='B')b.push(...arr)}
 }else throw Error('Comparación desconocida');
 const divergence=jsDivergence(a,b);
 return {nameA,nameB,a:profile(a),b:profile(b),divergence,adequate:a.length>=100&&b.length>=100,method:kind,warning:a.length<100||b.length<100?'Menos de 100 tokens inequívocos en al menos un grupo: comparación exploratoria muy sensible al tamaño de muestra.':'Descripciones de distribuciones EVA; no constituyen prueba de idiomas diferentes.'};
}
export function positions(dataset,opts={}){
 const words=tokensOf(dataset,opts);const begin=frequency(words.map(w=>w[0]));const end=frequency(words.map(w=>w.at(-1)));
 return {tokens:words.length,first:begin.slice(0,15),last:end.slice(0,15),lengths:profile(words).lengths};
}
export function seededRandom(seed){let state=seed>>>0;return ()=>{state=(1664525*state+1013904223)>>>0;return state/4294967296}};
function shuffledLines(lines,rng){const lens=lines.map(x=>x.length);const all=lines.flat();for(let i=all.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[all[i],all[j]]=[all[j],all[i]]}let at=0;return lens.map(len=>{const part=all.slice(at,at+len);at+=len;return part})}
export function shuffleBaseline(lines,{seed=404,runs=60,n=2}={}){
 if(!Number.isInteger(seed)||seed<0||seed>4294967295||!Number.isInteger(runs)||runs<1||runs>200)throw Error('Semilla o iteraciones fuera de rango');
 const clean=lines.map(line=>line.filter(x=>typeof x==='string'&&/^[a-z]+$/.test(x)));const count=clean.reduce((s,l)=>s+l.length,0);
 const observed=collisionCount(clean,n);if(count<4)return {observed,tokenCount:count,runs:0,mean:null,min:null,max:null,values:[],seed,n,insufficient:true};
 const rng=seededRandom(seed),values=[];
 for(let i=0;i<runs;i++)values.push(collisionCount(shuffledLines(clean,rng),n));
 return {observed,tokenCount:count,runs,mean:values.reduce((a,b)=>a+b,0)/runs,min:Math.min(...values),max:Math.max(...values),values,seed,n,insufficient:false};
}
export function safeCsvCell(value){let s=String(value);if(/^[\s\t\r\n]*[=+@-]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"'}
export function exportNgramsCsv(rows,{source='Muestra de f1r',n=2,scope='todos'}={}){
 return '\ufeff'+'fuente;ambito;n;secuencia;frecuencia\r\n'+rows.map(([ngram,count])=>[safeCsvCell(source),safeCsvCell(scope),n,safeCsvCell(ngram),count].join(';')).join('\r\n')+'\r\n';
}
