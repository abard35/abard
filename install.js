// „App“-Knopf in der Kopfzeile: Seite auf dem Handy als App installieren.
// Android (Chrome/Edge): öffnet direkt den Installieren-Dialog des Browsers.
// iPhone/iPad: Apple erlaubt das nicht per Knopf – daher kurze Anleitung (Teilen → Zum Home-Bildschirm).
// Andere Android-Browser ohne Dialog: Anleitung über das Browser-Menü.
// Läuft die Seite schon als App oder auf dem Desktop: Knopf bleibt unsichtbar.
(function(){
  if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(function(){});
  var btn=document.getElementById('inst');if(!btn)return;
  var I=window.ABARD_I18N||{T:function(k){return k}},T=I.T;
  var standalone=(window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true;
  if(standalone)return;
  var ua=navigator.userAgent||'';
  var ios=/iPhone|iPad|iPod/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  var android=/Android/.test(ua);
  var deferred=null,pop=null;
  window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferred=e;if(android||ios)btn.hidden=false});
  window.addEventListener('appinstalled',function(){btn.hidden=true;deferred=null;close()});
  if(ios||android)btn.hidden=false;
  function close(){if(pop){pop.hidden=true}}
  function help(){
    if(!pop){
      pop=document.createElement('div');pop.className='instpop';pop.setAttribute('role','dialog');pop.hidden=true;
      document.body.appendChild(pop);
      document.addEventListener('click',function(e){if(pop&&!pop.hidden&&!pop.contains(e.target)&&e.target.closest('#inst')!==btn)close()},true);
      document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
    }
    var share='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M8 7l4-4 4 4"/><path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/></svg>';
    var steps=ios?[T('inst.ios1').replace('{i}',share),T('inst.ios2'),T('inst.ios3')]:[T('inst.and1'),T('inst.and2'),T('inst.and3')];
    pop.innerHTML='<img src="icon-192.png" alt="" width="48" height="48"><b>'+T('inst.h')+'</b><ol>'+steps.map(function(s){return '<li>'+s+'</li>'}).join('')+'</ol><button type="button" class="ctool">'+T('close')+'</button>';
    pop.querySelector('button').addEventListener('click',close);
    pop.hidden=false;
  }
  btn.addEventListener('click',function(){
    if(deferred){var d=deferred;deferred=null;d.prompt();d.userChoice.then(function(r){if(r&&r.outcome==='accepted')btn.hidden=true}).catch(function(){});return}
    if(pop&&!pop.hidden){close();return}
    help();
  });
  document.addEventListener('abard:lang',function(){if(pop&&!pop.hidden)help()});
})();
