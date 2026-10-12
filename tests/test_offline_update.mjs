import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const code = readFileSync(new URL('../assets/js/offline.js', import.meta.url), 'utf8');
function emitter(extra = {}) {
  const listeners = new Map();
  return {
    ...extra,
    addEventListener(type, fn) { listeners.set(type, fn); },
    emit(type) { listeners.get(type)?.(); }
  };
}
async function scenario({waiting = null, controller = {}, protocol = 'https:', reject = false} = {}) {
  let reloads = 0;
  const status = {textContent:'', dataset:{}, title:''};
  const button = emitter({hidden:true, disabled:false});
  const registration = emitter({waiting, installing:null});
  const serviceWorker = emitter({controller, register:()=>reject ? Promise.reject(Error('blocked')) : Promise.resolve(registration)});
  const navigator = {onLine:true, serviceWorker};
  const location = {protocol, hostname:'example.org', reload:()=>{reloads++;}};
  const window = emitter();
  const document = {getElementById:id=>id==='offlineStatus' ? status : button};
  runInNewContext(code,{document,navigator,location,window,console:{warn(){}}});
  await new Promise(resolve=>setImmediate(resolve));
  return {status,button,registration,serviceWorker,location,window,get reloads(){return reloads;}};
}

const messages=[];
const active = await scenario({waiting:{postMessage:message=>messages.push(message)}});
assert.equal(active.button.hidden,false);
assert.match(active.status.textContent,/Actualización disponible/);
active.button.emit('click');
assert.equal(messages.length,1);
assert.equal(messages[0].type,'ACTIVATE_UPDATE');
assert.equal(active.button.disabled,true);
assert.equal(active.reloads,0);
active.serviceWorker.emit('controllerchange');
assert.equal(active.reloads,1);

const newInstall = await scenario({waiting:null});
assert.equal(newInstall.button.hidden,true);
const installer = emitter({state:'installing'});
newInstall.registration.installing=installer;
newInstall.registration.emit('updatefound');
newInstall.registration.waiting={postMessage(){}};
installer.state='installed';
installer.emit('statechange');
assert.equal(newInstall.button.hidden,false);

const firstVisit = await scenario({waiting:{postMessage(){}},controller:null});
assert.equal(firstVisit.button.hidden,true);
const failed = await scenario({reject:true});
assert.equal(failed.status.textContent,'Offline no disponible');
console.log('PASS 8 comprobaciones de actualización PWA con dobles');
