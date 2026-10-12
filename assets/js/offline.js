// PWA aislada: nunca toca IndexedDB, localStorage ni los datos del investigador.
const status = document.getElementById('offlineStatus');
const applyUpdate = document.getElementById('applyUpdate');
let updateRequested = false;
const update = (message, state='unknown') => {
  if (!status) return;
  status.textContent = message;
  status.dataset.state = state;
  status.title = 'La biblioteca local puede funcionar offline. Yale e imágenes externas necesitan conexión.';
};
const connection = () => update(navigator.onLine ? 'Con conexión' : 'Modo offline', navigator.onLine ? 'online' : 'offline');
window.addEventListener('online', connection);
window.addEventListener('offline', connection);
connection();
if ('serviceWorker' in navigator && (location.protocol === 'https:' || ['localhost','127.0.0.1'].includes(location.hostname))) {
  navigator.serviceWorker.register('./sw.js', {scope:'./'}).then(reg => {
    const offerUpdate = () => {
      if (!reg.waiting || !navigator.serviceWorker.controller) return;
      applyUpdate.hidden = false;
      update('Actualización disponible', 'unknown');
    };
    offerUpdate();
    applyUpdate.addEventListener('click', () => {
      if (!reg.waiting) return;
      updateRequested = true;
      applyUpdate.disabled = true;
      update('Actualizando…', 'unknown');
      reg.waiting.postMessage({type:'ACTIVATE_UPDATE'});
    });
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (updateRequested) location.reload();
    });
    reg.addEventListener('updatefound', () => {
      const worker = reg.installing;
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed') offerUpdate();
      });
    });
  }).catch(err => {
    console.warn('PWA no disponible:',err);
    update('Offline no disponible','error');
  });
} else update('Offline no disponible','error');
