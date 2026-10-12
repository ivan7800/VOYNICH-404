import {strict as assert} from 'node:assert';
import {validateAnnotation,parseAnnotations,parseAnnotationsBackup,backupAnnotations,folioAnnotations,mergeAnnotations,coordinateInImage,MAX_ANNOTATIONS} from '../assets/js/annotations.js';
const note={id:'pin1',folioId:'yale-canvas-1',folioLabel:'f1r',x:0.27,y:0.66,title:'Una planta',body:'Rasgo observado, sin traducción',createdAt:'2026-10-12T00:00:00.000Z',updatedAt:'2026-10-12T00:00:00.000Z'};
let count=0;function check(condition,label){assert.ok(condition,label);count++}
check(!!validateAnnotation(note),'valid');check(validateAnnotation({...note,x:1,y:0})!==null,'edges valid');check(validateAnnotation({...note,x:-.1})===null,'invalid coordinate');check(validateAnnotation({...note,x:'0.2'})===null,'no string coercion');check(validateAnnotation({...note,body:' '})===null,'empty note');check(validateAnnotation({...note,folioId:''})===null,'no unlinked pin');check(validateAnnotation({...note,title:'x'.repeat(101)}).title.length===100,'truncation');check(validateAnnotation({...note,extra:'<script>'}).extra===undefined,'no unknown props');
check(parseAnnotations([note]).length===1,'validated collection');assert.throws(()=>parseAnnotations([note,note]),/duplicados/);count++;assert.throws(()=>parseAnnotations(Array(MAX_ANNOTATIONS+1).fill(note)),/límites/);count++;
const exported=backupAnnotations([note]);check(parseAnnotationsBackup(exported)[0].id==='pin1','backup roundtrip');assert.throws(()=>parseAnnotationsBackup(exported.replace('VOYNICH 404','OTHER')),/compatible/);count++;
assert.throws(()=>parseAnnotationsBackup('not JSON'),/JSON/);count++;
assert.throws(()=>parseAnnotationsBackup(JSON.stringify({app:'VOYNICH 404',kind:'folio-annotations',schemaVersion:99,annotations:[note]})),/compatible/);count++;
check(mergeAnnotations([note],[note]).added===0,'import does not overwrite');check(mergeAnnotations([],[note]).added===1,'merge adds new');check(folioAnnotations([note],note.folioId).length===1,'folio filter');
check(JSON.stringify(coordinateInImage({left:100,top:150,width:200,height:400},150,350))===JSON.stringify({x:.25,y:.5}),'coordinates');check(coordinateInImage({left:0,top:0,width:100,height:100},200,50)===null,'reject outside image');check(coordinateInImage({left:0,top:0,width:0,height:10},0,0)===null,'zero-size rejection');
console.log(`PASS ${count} annotation assertions`);
