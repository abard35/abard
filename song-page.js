// Songseiten /s/<song>/: Umschalter Original | DE für Story und Songtext.
// Story startet in der zuletzt gewählten Seitensprache, der Songtext startet immer im Original.
(function(){
  function init(){
    var de=false;try{de=localStorage.getItem('abard-lang')==='de'}catch(e){}
    document.querySelectorAll('[data-sw]').forEach(function(sec){
      var tog=sec.querySelector('.tog'),h=sec.querySelector('h2');if(!tog)return;
      function set(v){
        sec.querySelectorAll('.txt').forEach(function(t){t.hidden=t.getAttribute('data-v')!==v});
        tog.querySelectorAll('button').forEach(function(b){b.setAttribute('aria-pressed',String(b.getAttribute('data-v')===v))});
        if(h)h.textContent=h.getAttribute(v==='de'?'data-de':'data-en');
      }
      tog.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){set(b.getAttribute('data-v'))})});
      tog.hidden=false;
      set(sec.getAttribute('data-sw')==='story'&&de?'de':'orig');
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
