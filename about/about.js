// Über-Seite: Sprache wie die Startseite (eigene Wahl gespeichert, sonst Browser auf Deutsch → DE, sonst EN),
// Kopieren der Pressetexte, E-Mail-Knopf (Adresse nie im Klartext).
// Läuft im <head> (nicht defer), damit die richtige Sprache ohne Flackern erscheint.
(function(){
  var lang='en',st=null;
  try{st=localStorage.getItem('abard-lang')}catch(e){}
  if(st==='de'||st==='en')lang=st;
  else try{if(((navigator.languages&&navigator.languages[0])||navigator.language||'').toLowerCase().slice(0,2)==='de')lang='de'}catch(e){}
  var root=document.documentElement;
  root.classList.toggle('en',lang==='en');root.lang=lang;
  function init(){
    var TITLE={de:document.title,en:'About ABard – Albert Bardewyck, songwriter from Switzerland'};
    function set(l){
      lang=l;
      root.lang=l;root.classList.toggle('en',l==='en');
      document.title=TITLE[l];
      document.querySelectorAll('.lang button').forEach(function(b){b.setAttribute('aria-pressed',String(b.getAttribute('data-lang')===l))});
    }
    document.querySelectorAll('.lang button').forEach(function(b){
      b.addEventListener('click',function(){var l=b.getAttribute('data-lang');try{localStorage.setItem('abard-lang',l)}catch(e){}set(l)});
    });
    set(lang);

    document.querySelectorAll('.cbtn').forEach(function(b){
      b.addEventListener('click',function(){
        var p=b.parentNode.querySelector('p[data-l="'+lang+'"]');if(!p)return;
        var t=p.textContent.trim(),lbl=b.querySelector('[data-l="'+lang+'"]'),old=lbl.textContent;
        function ok(){lbl.textContent=lang==='de'?'Kopiert ✓':'Copied ✓';setTimeout(function(){lbl.textContent=old},1800)}
        if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(ok,function(){});
      });
    });

    document.querySelectorAll('.mail').forEach(function(b){
      b.addEventListener('click',function(){
        var a=atob(b.getAttribute('data-m')).split('').reverse().join('');
        location.href='mai'+'lto:'+a+'?subject='+encodeURIComponent('ABard');
      });
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
