/** IIIF Presentation 2/3 parser. No untrusted HTML is emitted from metadata. */
export const MANIFESTS=[
  'https://collections.library.yale.edu/manifests/2002046',
  'https://collections.library.yale.edu/manifests/oid/2002046'
];
export const YALE_CATALOG='https://collections.library.yale.edu/catalog/2002046';
const textLabel=(value)=>{
  if(typeof value==='string')return value;
  if(Array.isArray(value))return textLabel(value[0]);
  if(value&&typeof value==='object'){
    const v=value.es||value.en||value.none||Object.values(value)[0];
    return textLabel(v);
  }
  return '';
};
const validUrl=(s)=>{
  if(typeof s!=='string'||s.length>2048)return null;
  try{const u=new URL(s);return u.protocol==='https:'?u.href:null}catch{return null}
};
export const yaleUrl=(url)=>{
  const u=validUrl(url);
  if(!u)return null;
  const h=new URL(u).hostname.toLowerCase();
  return h==='yale.edu'||h.endsWith('.yale.edu')?u:null;
};
function first(x){return Array.isArray(x)?x[0]:x}
function serviceUrl(resource){
  const service=first(resource?.service||resource?.['@service']);
  const val=typeof service==='string'?service:(service?.id||service?.['@id']);
  const u=yaleUrl(val);
  return u?.replace(/\/info\.json(?:\?.*)?$/,'').replace(/\/$/,'')||null;
}
function canvasV2(c){
  const annotation=first(c?.images);
  const resource=annotation?.resource;
  if(!resource)return null;
  return {
    id:String(c['@id']||c.id||''),
    label:textLabel(c.label)||'Sin etiqueta',
    service:serviceUrl(resource),
    image:yaleUrl(resource['@id']||resource.id)
  };
}
function canvasV3(c){
  const annotationPage=first(c?.items);
  const annotation=first(annotationPage?.items);
  const body=first(annotation?.body);
  if(!body)return null;
  return {
    id:String(c.id||c['@id']||''),
    label:textLabel(c.label)||'Sin etiqueta',
    service:serviceUrl(body),
    image:yaleUrl(body.id||body['@id'])
  };
}
export function parseManifest(data,{requireVoynich=false}={}){
  if(!data||typeof data!=='object')throw Error('El archivo no contiene un manifiesto válido.');
  if(requireVoynich){const identity=String(data.id||data['@id']||'')+' '+textLabel(data.label)+' '+String(data.description||'');if(!(/2002046|voynich|ms[ -]?408/i).test(identity))throw Error('El JSON no identifica el manuscrito Voynich (Yale MS 408).');}
  let canvases, parse;
  if(Array.isArray(data.sequences)&&Array.isArray(data.sequences[0]?.canvases)){
    canvases=data.sequences[0].canvases;parse=canvasV2;
  }else if(Array.isArray(data.items)){
    canvases=data.items.filter(x=>x?.type==='Canvas');parse=canvasV3;
  }else throw Error('Solo se admiten manifiestos IIIF Presentation v2 o v3.');
  if(canvases.length>600||canvases.length<1)throw Error('Número de imágenes fuera de límites (1–600).');
  const pages=canvases.map(c=>parse(c)).filter(x=>x&&(x.image||x.service)).map((x,index)=>({...x,index}));
  if(!pages.length)throw Error('No se han encontrado imágenes de Yale con HTTPS en este manifiesto.');
  return pages;
}
export function pageUrl(page,width=1300){
  if(page?.service){
    const w=Math.max(300,Math.min(3000,Math.round(width)));
    return `${page.service}/full/${w},/0/default.jpg`;
  }
  return page?.image||'';
}
export async function fetchManifest(url,{signal}={}){
  if(!MANIFESTS.includes(url))throw Error('Solo se conecta con el manifiesto oficial de Yale.');
  const response=await fetch(url,{mode:'cors',redirect:'follow',cache:'no-cache',signal});
  if(!response.ok)throw Error(`Yale respondió HTTP ${response.status}.`);
  const type=response.headers.get('Content-Type')||'';
  const length=Number(response.headers.get('Content-Length')||0);
  if(length>15_000_000)throw Error('El manifiesto supera el tamaño permitido.');
  const content=await response.text();
  if(content.length>15_000_000)throw Error('El manifiesto supera el tamaño permitido.');
  try{return parseManifest(JSON.parse(content))}catch(error){throw Error('Manifiesto no compatible: '+error.message)}
}
