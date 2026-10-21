// Immer nur EINE Tonquelle: Player unten (Spotify/YouTube), Sneak Peeks, Clip im Kopfbereich
// und das YouTube-Fenster im Bereich „Watch“ (#ytlist). Startet eine Quelle, verstummen die anderen.
// Player/Sneak/Clip regeln sich schon gegenseitig (app.js, hero.js) – hier kommt #ytlist dazu.
(function(){
  var yl=document.getElementById('ytlist');if(!yl)return;
  var YT=/^https:\/\/www\.youtube(-nocookie)?\.com$/;
  function cmd(f){try{yl.contentWindow.postMessage(JSON.stringify({event:'command',func:f,args:[]}),'*')}catch(e){}}
  var ylPlaying=false;
  // Watch-Fenster anhalten, sobald woanders Ton startet
  function stopWatch(){cmd('pauseVideo');ylPlaying=false} // Befehl ist harmlos, falls dort nichts läuft
  // Klick auf eine Kachel (Player startet), Ton-an beim Clip, Sneak-Peek-Knopf
  document.addEventListener('click',function(e){
    var t=e.target.closest&&e.target.closest('.rel,.rv-snd,#reel video,.sneak');
    if(t)stopWatch();
  },true);
  // Automatisch nächster Song im Player / Sneak-Audio / Clip mit Ton
  document.addEventListener('play',function(e){
    var el=e.target;if(el.tagName==='VIDEO'&&el.muted)return;stopWatch();
  },true);
  new MutationObserver(function(ms){ms.forEach(function(m){
    var t=m.target;if(t.classList&&t.classList.contains('rel')&&t.classList.contains('active')&&!(m.oldValue||'').includes('active'))stopWatch();
  })}).observe(document.body,{attributes:true,attributeFilter:['class'],attributeOldValue:true,subtree:true});

  // Startet jemand ein Video im Watch-Fenster (auch ein vorgeschlagenes): alles andere anhalten
  function others(){
    var P=window.ABARD_PLAYER;if(P&&P.playing())P.pause();
    document.querySelectorAll('audio.sneak-a').forEach(function(a){if(!a.paused)a.pause()});
    if(window.ABARD_HERO)window.ABARD_HERO.mute();
  }
  window.addEventListener('message',function(e){
    if(e.source!==yl.contentWindow||!YT.test(e.origin))return;
    var d;try{d=typeof e.data==='string'?JSON.parse(e.data):e.data}catch(x){return}
    if(!d)return;
    var st=d.event==='onStateChange'?d.info:(d.event==='infoDelivery'&&d.info&&typeof d.info.playerState==='number'?d.info.playerState:null);
    if(st===null)return;
    if(st===1){if(!ylPlaying){ylPlaying=true;others()}}
    else if(st===0||st===2)ylPlaying=false;
  });
  // YouTube meldet Ereignisse erst, wenn man sich als Zuhörer anmeldet (nach dem Laden des Fensters)
  function listen(){var n=0,iv=setInterval(function(){
    if(++n>20){clearInterval(iv);return}
    try{yl.contentWindow.postMessage(JSON.stringify({event:'listening',id:'ytlist',channel:'widget'}),'*')}catch(e){}
  },500)}
  yl.addEventListener('load',listen);listen();
})();
