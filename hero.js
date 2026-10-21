// Kopfbereich: Shorts der aktuellen Releases.
// Ein Clip läuft gross und STUMM; Ton nur, wenn der Besucher ihn aktiv einschaltet.
// Die übrigen Clips stehen als Mini-Icons darunter. Gibt es keinen aktuellen Release, entfällt der Bereich.
// "Aktuell" = Release steht noch bevor oder ist höchstens 7 Tage her.
// Vor dem Release läuft der Teaser, ab Release-Zeit der Out-Now-Short (falls vorhanden).
// Neuer Release: Clips als clips/<slug>-teaser.mp4 / -out.mp4 (+ .jpg Standbild, -s.jpg Mini-Bild) ablegen
// und den Slug unten in CLIPS eintragen. Datum und Titel kommen automatisch aus den Release-Karten.
(function(){
  var st=document.getElementById('reel');if(!st)return;
  var CLIPS={
    'no-someday-left':['out'],
    'kurze-zeit':['teaser','out'],
    'der-uhrmacher':['teaser','out'],
    'der-leuchtturm':['teaser'],
    'through-your-eyes':['teaser','out']
  };
  var DAYS_AFTER=7,V='?v=1';
  var I=window.ABARD_I18N||{T:function(k){return k},lang:function(){return 'en'}};
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var now=Date.now(),L=[];

  // Releases aus den Karten einsammeln
  document.querySelectorAll('.next[data-slug][data-at]').forEach(function(c){
    var slug=c.dataset.slug,k=CLIPS[slug],at=Date.parse(c.dataset.at);
    if(!k||isNaN(at)||now>at+DAYS_AFTER*864e5)return;
    var h=c.querySelector('h2');
    L.push({slug:slug,at:at,kinds:k,card:c,t:h?h.textContent.trim():slug});
  });
  if(!L.length){st.hidden=true;document.querySelector('.hero').classList.add('no-reel');return}
  L.sort(function(a,b){return a.at-b.at});
  function kind(s){var out=Date.now()>=s.at;return out&&s.kinds.indexOf('out')>=0?s.slug+'-out':s.kinds.indexOf('teaser')>=0?s.slug+'-teaser':s.slug+'-out'}
  // Start: der nächste kommende Release, sonst der zuletzt erschienene
  var cur=0;for(var i=0;i<L.length;i++){if(L[i].at>now){cur=i;break}cur=i}

  var T=I.T;
  // Titel und Datum stehen schon im Clip selbst – daher keine eigene Beschriftung darüber
  st.innerHTML='<div class="rv"><video muted loop playsinline preload="auto"></video></div>'+
    '<button type="button" class="rv-snd" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path class="spk" d="M4 9v6h4l5 4V5L8 9H4Z"/><path class="on" d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"/><path class="off" d="m16.5 9.5 5 5m0-5-5 5"/></svg><span></span></button>'+
    '<div class="rv-th" role="group"></div>';
  var vid=st.querySelector('video'),snd=st.querySelector('.rv-snd'),th=st.querySelector('.rv-th');
  st.setAttribute('aria-label',T('hero.aria'));

  function dateTxt(s){
    if(Date.now()>=s.at)return T('hero.out');
    var d=new Date(s.at),m=(T('months')||[])[+d.toLocaleString('en-US',{month:'numeric',timeZone:'Europe/Zurich'})-1]||'',day=d.toLocaleString('en-US',{day:'numeric',timeZone:'Europe/Zurich'});
    return T('hero.new')+' · '+(I.lang()==='de'?day+'. '+m:m+' '+day);
  }
  function label(){
    var s=L[cur];vid.setAttribute('aria-label',s.t+' – '+dateTxt(s));
    snd.querySelector('span').textContent=T(vid.muted?'hero.on':'hero.off');
    th.setAttribute('aria-label',T('hero.pick'));
    th.querySelectorAll('button').forEach(function(b,n){b.setAttribute('aria-label',L[n].t+' – '+dateTxt(L[n]));b.title=L[n].t});
  }
  // Mini-Icons (nur wenn mehr als ein Clip)
  if(L.length>1)L.forEach(function(s,n){
    var b=document.createElement('button');b.type='button';
    b.innerHTML='<img src="clips/'+kind(s)+'-s.jpg'+V+'" alt="" width="60" height="107" loading="lazy" decoding="async">';
    b.addEventListener('click',function(){show(n)});th.appendChild(b);
  });else th.hidden=true;

  function show(n){
    cur=n;var k=kind(L[n]);
    vid.poster='clips/'+k+'.jpg'+V;vid.src='clips/'+k+'.mp4'+V;
    th.querySelectorAll('button').forEach(function(b,i){b.setAttribute('aria-current',i===n?'true':'false')});
    label();
    if(!vid.muted||!reduce)vid.play().catch(function(){});
  }

  // ---- Ton: nur auf aktiven Klick. Laufende Musik/Sneak Peek wird angehalten und danach fortgesetzt ----
  var resume=false;
  function soundOn(){
    document.querySelectorAll('audio.sneak-a').forEach(function(o){if(!o.paused)o.pause()});
    var P=window.ABARD_PLAYER;resume=!!(P&&P.playing());if(resume)P.pause();
    vid.muted=false;vid.currentTime=0;vid.play().catch(function(){});snd.setAttribute('aria-pressed','true');label();
  }
  function soundOff(keep){
    vid.muted=true;snd.setAttribute('aria-pressed','false');label();
    if(reduce)vid.pause();
    if(resume&&!keep&&window.ABARD_PLAYER)window.ABARD_PLAYER.resume();resume=false;
  }
  snd.addEventListener('click',function(){vid.muted?soundOn():soundOff()});
  vid.addEventListener('click',function(){vid.muted?soundOn():soundOff()});
  // Clip-Wechsel mit Ton: Ton bleibt an, neuer Clip startet vorne
  th.addEventListener('click',function(){if(!vid.muted)vid.currentTime=0});
  // Startet jemand einen Sneak Peek oder einen Song: Clip wieder stumm (ohne Fortsetzen)
  document.addEventListener('play',function(e){if(e.target.classList&&e.target.classList.contains('sneak-a')&&!vid.muted)soundOff(true)},true);
  document.addEventListener('click',function(e){if(!vid.muted&&e.target.closest&&e.target.closest('.rel'))soundOff(true)},true);
  // Stummer Clip ausserhalb des Sichtfelds: anhalten (spart Akku/Daten)
  if('IntersectionObserver' in window)new IntersectionObserver(function(es){es.forEach(function(e){
    if(!vid.muted)return;
    if(e.isIntersecting){if(!reduce)vid.play().catch(function(){})}else vid.pause();
  })}).observe(st);
  document.addEventListener('abard:lang',label);

  if(reduce)vid.preload='metadata';
  show(cur);
})();
