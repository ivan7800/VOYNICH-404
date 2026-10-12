/* VOYNICH 404 · annotations are personal observations, never verified manuscript metadata. */
export const ANNOTATIONS_KEY='voynich404-folio-annotations-v1';
export const ANNOTATIONS_VERSION=1;
export const MAX_ANNOTATIONS=800;
const asText=(x,max)=>typeof x==='string'?x.trim().slice(0,max):'';
const num=(x)=>typeof x==='number'&&Number.isFinite(x)?x:null;
export function validateAnnotation(value){
 if(!value||typeof value!=='object'||Array.isArray(value))return null;
 const id=asText(value.id,100),folioId=asText(value.folioId,1000),folioLabel=asText(value.folioLabel,180),title=asText(value.title,100),body=asText(value.body,4000);
 const x=num(value.x),y=num(value.y);
 if(!id||!folioId||!folioLabel||!title||!body||x===null||y===null||x<0||x>1||y<0||y>1)return null;
 const date=s=>typeof s==='string'&&/^\d{4}-\d\d-\d\dT/.test(s)&&!Number.isNaN(Date.parse(s))?s.slice(0,32):new Date(0).toISOString();
 return {id,folioId,folioLabel,x,y,title,body,createdAt:date(value.createdAt),updatedAt:date(value.updatedAt)};
}
export function parseAnnotations(value){
 if(!Array.isArray(value)||value.length>MAX_ANNOTATIONS)throw Error('Número de anotaciones fuera de límites.');
 const seen=new Set(),result=[];
 for(const item of value){const parsed=validateAnnotation(item);if(!parsed)throw Error('Hay anotaciones inválidas: comprueba títulos, texto y coordenadas.');if(seen.has(parsed.id))throw Error('El archivo contiene identificadores duplicados.');seen.add(parsed.id);result.push(parsed)}
 return result;
}
export function parseAnnotationsBackup(raw){
 if(typeof raw!=='string'||raw.length>5_000_000)throw Error('El archivo supera 5 MB.');
 let parsed;try{parsed=JSON.parse(raw)}catch{throw Error('El archivo JSON no es válido.')}
 if(!parsed||parsed.app!=='VOYNICH 404'||parsed.kind!=='folio-annotations'||parsed.schemaVersion!==ANNOTATIONS_VERSION)throw Error('Formato de copia no compatible con VOYNICH 404.');
 return parseAnnotations(parsed.annotations);
}
export function backupAnnotations(annotations){return JSON.stringify({app:'VOYNICH 404',kind:'folio-annotations',schemaVersion:ANNOTATIONS_VERSION,exportedAt:new Date().toISOString(),annotations:parseAnnotations(annotations)},null,2)}
export function folioAnnotations(annotations,id){return annotations.filter(a=>a.folioId===id)}
export function mergeAnnotations(existing,incoming){const ids=new Set(existing.map(a=>a.id));const merged=[...existing];let added=0;for(const item of incoming){if(!ids.has(item.id)){merged.push(item);ids.add(item.id);added++}}if(merged.length>MAX_ANNOTATIONS)throw Error('Se alcanzó el máximo de anotaciones.');return {annotations:merged,added}}
export function coordinateInImage(rect,clientX,clientY){if(!rect||rect.width<=0||rect.height<=0)return null;const x=(clientX-rect.left)/rect.width,y=(clientY-rect.top)/rect.height;return x>=0&&x<=1&&y>=0&&y<=1?{x:Math.round(x*10000)/10000,y:Math.round(y*10000)/10000}:null}
