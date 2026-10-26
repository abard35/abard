// Stimmungs-Hintergrund: der ganze Seitenhintergrund wird zum geblurrten, abgedunkelten Cover
// des Songs, um den es gerade geht – des Clips im Kopfbereich oder des Songs, der im Player läuft.
// Die letzte Aktion gewinnt. Wird der Player geschlossen, geht es zurück zum Cover des gezeigten Clips.
// Zwei Ebenen werden weich überblendet; das neue Bild erscheint erst, wenn es geladen ist.
(function(){
  var box=document.createElement('div');box.id='bgc';box.setAttribute('aria-hidden','true');
  var A=document.createElement('i'),B=document.createElement('i');box.appendChild(A);box.appendChild(B);
  document.body.insertBefore(box,document.body.firstChild);
  var front=A,curSrc='',heroSrc='',want='';
  function set(src){
    if(!src||src===curSrc)return;want=src;
    var im=new Image();
    im.onload=function(){
      if(want!==src)return; // inzwischen schon ein anderes Cover gewählt
      var back=front===A?B:A;
      back.style.backgroundImage='url("'+src.replace(/"/g,'%22')+'")';
      back.classList.add('on');front.classList.remove('on');front=back;curSrc=src;document.body.classList.add('has-bgc');
    };
    im.src=src;
  }
  function coverOf(el){var i=el&&el.querySelector('img');if(!i)return '';var ss=(i.getAttribute('srcset')||i.getAttribute('data-srcset')||'').split(',').pop().trim().split(' ')[0];return ss||i.currentSrc||i.getAttribute('src')||i.getAttribute('data-src')||''}
  window.ABARD_BG={
    // Kopfbereich: Cover des gezeigten Clips (Release-Karte)
    // Beim ersten Aufbau erst nach dem Laden der Seite (das grosse Cover soll den Seitenaufbau nicht bremsen)
    hero:function(card){heroSrc=coverOf(card);var s=heroSrc;if(document.readyState==='complete')set(s);else window.addEventListener('load',function(){if(!curSrc&&heroSrc===s)set(s)})},
    set:set
  };
  // Player: startet ein Song (Kachel wird .active), dessen Cover nehmen
  new MutationObserver(function(ms){
    ms.forEach(function(m){
      var t=m.target;
      if(t.classList&&t.classList.contains('rel')&&t.classList.contains('active')&&m.oldValue&&m.oldValue.indexOf('active')<0)set(coverOf(t));
      if(t===document.body&&m.oldValue&&/\bplaying\b/.test(m.oldValue)&&!t.classList.contains('playing'))set(heroSrc);
    });
  }).observe(document.body,{attributes:true,attributeFilter:['class'],attributeOldValue:true,subtree:true});
})();
