// Kopfbereich: Shorts der aktuellen Releases.
// Ein Clip läuft gross und STUMM; Ton nur, wenn der Besucher ihn aktiv einschaltet.
// Ist ein Clip durch, folgt automatisch der nächste. Die übrigen Clips stehen als Mini-Icons darunter. Gibt es keinen aktuellen Release, entfällt der Bereich.
// "Aktuell" = Release steht noch bevor oder ist höchstens 7 Tage her.
// Vor dem Release läuft der Teaser, ab Release-Zeit der Out-Now-Short (falls vorhanden).
// Rechts neben dem Clip zeigt die Infozeile (#rinfo) Datum/Countdown und Teilen/Kalender/Pre-Save bzw.
// nach dem Release Spotify/YouTube/Story zum gerade gezeigten Song. Die Daten kommen live aus den
// (unsichtbaren) Release-Karten im Abschnitt #next – die bleiben die Datenquelle und werden weiter gepflegt.
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
  if(!L.length){st.hidden=true;document.querySelector('.hero').classList.add('no-reel');var r0=document.getElementById('rinfo');if(r0)r0.hidden=true;return}
  document.querySelector('.hero').classList.remove('no-reel');st.hidden=false;
  L.sort(function(a,b){return a.at-b.at});
  function kind(s){var out=Date.now()>=s.at;return out&&s.kinds.indexOf('out')>=0?s.slug+'-out':s.kinds.indexOf('teaser')>=0?s.slug+'-teaser':s.slug+'-out'}
  // Start: der nächste kommende Release, sonst der zuletzt erschienene
  var cur=0;for(var i=0;i<L.length;i++){if(L[i].at>now){cur=i;break}cur=i}

  var T=I.T;
  // Titel und Datum stehen schon im Clip selbst – daher keine eigene Beschriftung darüber
  st.innerHTML='<div class="rv"><video muted playsinline preload="auto"></video></div>'+
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
    b.addEventListener('click',function(){show(n,true)});th.appendChild(b);
  });else th.hidden=true;

  // ---- Infozeile zum gezeigten Song ----
  var ri=document.getElementById('rinfo');
  if(ri){
    ri.innerHTML='<p class="eyebrow ri-eye"></p><h2 class="ri-t"></h2><p class="ri-date"><span class="ri-d"></span></p><div class="ri-cd" hidden><div><b></b><span data-i18n="cd.d">'+T('cd.d')+'</span></div><div><b></b><span data-i18n="cd.h">'+T('cd.h')+'</span></div><div><b></b><span data-i18n="cd.m">'+T('cd.m')+'</span></div><div><b></b><span data-i18n="cd.s">'+T('cd.s')+'</span></div></div>'+
      '<p class="ri-ps"><a class="btn primary ri-psb" target="_blank" rel="noopener" data-i18n="soon.ps">'+T('soon.ps')+'</a><span class="ri-psn" data-i18n="ps.note">'+T('ps.note')+'</span></p>'+
      '<p class="ctools ri-tools"><button type="button" class="ctool" data-act="share"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 16a3 3 0 0 0-2.4 1.2l-6.7-3.4a3 3 0 0 0 0-1.6l6.7-3.4A3 3 0 1 0 15 7l-6.7 3.4a3 3 0 1 0 0 3.2L15 17a3 3 0 1 0 3-1Z"/></svg><span data-i18n="share">'+T('share')+'</span></button>'+
      '<button type="button" class="ctool" data-act="cal"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6v-5a7 7 0 0 0-5.5-6.84V3a1.5 1.5 0 0 0-3 0v1.16A7 7 0 0 0 5 11v5l-2 2v1h18v-1l-2-2Z"/></svg><span data-i18n="remind">'+T('remind')+'</span></button></p>'+
      '<p class="ri-out"></p>';
    ri.hidden=false;
    // Teilen/Kalender: dieselbe Funktion wie auf den Karten (kommt aus app.js, das nach diesem Skript lädt)
    document.addEventListener('DOMContentLoaded',function(){if(window.ABARD_CARD_TOOLS)window.ABARD_CARD_TOOLS(ri)});
  }
  var riOut=null;
  // Vor app.js (Countdown-Logik der Karten) Countdown bei kommendem Release schon einblenden – sonst springt der Kopf
  var dcl=false;document.addEventListener('DOMContentLoaded',function(){dcl=true});
  function sync(){
    if(!ri)return;
    var c=L[cur].card,q=function(sel){return c.querySelector(sel)};
    ['slug','at','day','time'].forEach(function(k){if(c.dataset[k]!==undefined)ri.dataset[k]=c.dataset[k]});
    ri.querySelector('.ri-eye').textContent=(q('.eyebrow')||{}).textContent||'';
    ri.querySelector('.ri-t').textContent=L[cur].t;
    var h=q('h2');ri.querySelector('.ri-t').lang=h&&h.lang||'';
    ri.querySelector('.ri-d').textContent=(q('.date')||{}).textContent||'';
    // Countdown aus der Karte übernehmen (grosse Ziffern wie früher auf den Karten, nur kompakter)
    var cd=q('.cd'),rc=ri.querySelector('.ri-cd'),on=!!(cd&&(dcl?!cd.hidden:L[cur].at>Date.now()));rc.hidden=!on;
    if(on){var b=cd.querySelectorAll('b'),rb=rc.querySelectorAll('b');for(var k=0;k<4;k++)rb[k].textContent=b[k]?b[k].textContent:''}
    var out=q('.out'),isOut=!!(out&&!out.hidden),key=cur+'|'+isOut;
    ri.querySelector('.ri-tools').hidden=isOut;
    if(riOut!==key){
      riOut=key;var o=ri.querySelector('.ri-out');o.innerHTML='';o.hidden=!isOut;
      if(isOut)out.querySelectorAll('a,span').forEach(function(a){if(!a.hidden)o.appendChild(a.cloneNode(true))});
    }
    // Pre-Save auf Spotify = Hauptaufforderung vor dem Release (gratis Spotify-Konto genügt)
    var ps=q('.ps-link'),mp=ri.querySelector('.ri-ps');
    mp.hidden=isOut||!ps||ps.hidden;if(ps)mp.querySelector('a').href=ps.href;
    // YouTube-Premiere (für die Erinnerung ohne Spotify)
    var yv=out&&out.querySelector('a[href*="youtube.com/watch"]');ri.dataset.yt=yv?yv.href:'';
    var cb=q('.ctool[data-act="cal"]');ri.querySelector('.ctool[data-act="cal"]').hidden=!cb||cb.hidden;
  }
  function loop(){sync();setTimeout(loop,1000-Date.now()%1000+30)}
  document.addEventListener('abard:lang',function(){riOut=null;sync()});

  // Video erst nach dem Laden der Seite holen (Standbild sofort) – sonst bremst der 1–3 MB grosse Clip den Seitenaufbau
  var loaded=document.readyState==='complete',pend=null;
  if(!loaded)window.addEventListener('load',function(){loaded=true;if(pend)setTimeout(pend,250);pend=null});
  function show(n,user){
    cur=n;var k=kind(L[n]);
    vid.poster='clips/'+k+'.jpg'+V;
    var go=function(){vid.src='clips/'+k+'.mp4'+V;if(!vid.muted||!reduce)vid.play().catch(function(){})};
    if(loaded||user){pend=null;go()}else pend=go;
    th.querySelectorAll('button').forEach(function(b,i){b.setAttribute('aria-current',i===n?'true':'false')});
    label();riOut=null;sync();
    if(window.ABARD_BG)window.ABARD_BG.hero(L[n].card);
  }

  // ---- Ton: nur auf aktiven Klick. Laufende Musik/Sneak Peek wird angehalten und danach fortgesetzt ----
  var resume=false;
  function soundOn(){
    document.querySelectorAll('audio.sneak-a').forEach(function(o){if(!o.paused)o.pause()});
    var P=window.ABARD_PLAYER;resume=!!(P&&P.playing());if(resume)P.pause();
    if(pend){var pg=pend;pend=null;pg()}
    vid.muted=false;vid.currentTime=0;vid.play().catch(function(){});snd.setAttribute('aria-pressed','true');label();
  }
  function soundOff(keep){
    vid.muted=true;snd.setAttribute('aria-pressed','false');label();
    if(reduce)vid.pause();
    if(resume&&!keep&&window.ABARD_PLAYER)window.ABARD_PLAYER.resume();resume=false;
  }
  // Clip zu Ende: nächsten aktuellen Release zeigen (Ton-Zustand bleibt); nur ein Clip → von vorne
  vid.addEventListener('ended',function(){if(L.length>1)show((cur+1)%L.length);else{vid.currentTime=0;vid.play().catch(function(){})}});
  // Für onlyone.js: startet unten das YouTube-Fenster, Clip stumm schalten
  window.ABARD_HERO={mute:function(){if(!vid.muted)soundOff(true)}};
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
    if(e.isIntersecting){if(!reduce&&vid.src)vid.play().catch(function(){})}else vid.pause();
  })}).observe(st);
  document.addEventListener('abard:lang',label);

  if(reduce)vid.preload='metadata';
  show(cur);
  // Karten-Skripte (Countdown) laufen erst nach app.js – dann regelmässig abgleichen
  document.addEventListener('DOMContentLoaded',loop);
})();
