// Cover der Kacheln selbst nachladen (data-src/data-srcset): natives loading="lazy" greift bei Lighthouse/PageSpeed
// nicht zuverlässig – dort wurden sonst alle ~40 Cover sofort geladen und die Handy-Wertung fiel unter 80.
(function(){
  function now(im){if(!im||!im.dataset.src)return;if(im.dataset.srcset){im.sizes=im.dataset.sizes||im.sizes;im.srcset=im.dataset.srcset}im.src=im.dataset.src;im.removeAttribute('data-src');im.removeAttribute('data-srcset')}
  function url(im){if(!im)return '';var ss=(im.getAttribute('srcset')||im.getAttribute('data-srcset')||'').split(',').pop().trim().split(' ')[0];return ss||im.currentSrc||im.getAttribute('src')||im.getAttribute('data-src')||''}
  var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);now(e.target)}})},{rootMargin:'400px 0px'}):null;
  function scan(root){(root||document).querySelectorAll('img[data-src]').forEach(function(im){io?io.observe(im):now(im)})}
  window.ABARD_LZ={now:now,url:url,scan:scan};
  scan();
})();
(function(){
  var I=window.ABARD_I18N||{T:function(k){return k},lang:function(){return 'en'}},T=I.T;
  var player=document.getElementById('player'),frame=document.getElementById('pframe');
  var src='spotify';
  try{src=localStorage.getItem('abard-src')||'spotify'}catch(e){}
  function setSrc(v){
    src=v;document.body.classList.toggle('yt',v==='youtube');
    document.querySelectorAll('.src button').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.src===v))});
    try{localStorage.setItem('abard-src',v)}catch(e){}
  }
  document.querySelectorAll('.src button').forEach(function(b){b.addEventListener('click',function(){setSrc(b.dataset.src)})});
  setSrc(src);
  function icon(n){return document.getElementById('ic-'+n).content.firstElementChild.cloneNode(true)}
  function decorate(a){
    var c=a.querySelector('.cover');if(!c||c.querySelector('.tshare'))return;
    var b=document.createElement('button');b.type='button';b.className='tshare';
    b.setAttribute('data-i18n-aria','share.aria');b.setAttribute('data-i18n-title','share.aria');
    b.setAttribute('aria-label',T('share.aria'));b.title=T('share.aria');b.appendChild(icon('share'));
    var m=document.createElement('span');m.className='favmark';m.setAttribute('aria-hidden','true');m.appendChild(icon('heart'));
    c.appendChild(b);c.appendChild(m);
  }
  document.querySelectorAll('.rel').forEach(decorate);
  document.querySelectorAll('.rel[data-id],.rel[data-yt],.rel[data-key]').forEach(function(a){
    a.addEventListener('click',function(e){
      var sb=e.target.closest('.tshare');
      if(sb){e.preventDefault();e.stopPropagation();shareSong(a,sb);return}
      if(e.metaKey||e.ctrlKey||e.shiftKey)return;
      e.preventDefault();
      if(!e.target.closest('.cover')){openDetail(a);return}
      play(a);
    });
  });
  var spAPI=null,spCtl=null,spWant=null,cur2=null,noteShown=false,spLast=0,isPreview=false;
  // Mini-Plattenspieler unten rechts
  var vin=document.getElementById('vin');
  function vinSpin(on){vin.classList.toggle('spin',!!on)}
  var vinSwapT=null;
  function vinSwap(a,label){
    if(vinSwapT)clearTimeout(vinSwapT);
    vinSpin(false);vin.classList.add('swap');
    vinSwapT=setTimeout(function(){vinSwapT=null;vinShow(a,false,label);vin.classList.remove('swap')},650);
  }
  function vinShow(a,assumePlaying,label){
    if(vinSwapT){clearTimeout(vinSwapT);vinSwapT=null;vin.classList.remove('swap')}
    document.getElementById('vin-p').textContent=label||T('vin.now');
    var im=a.querySelector('.cover img'),u=window.ABARD_LZ.url(im);
    document.getElementById('vin-img').src=u;document.getElementById('vin-lbl').src=u;
    document.getElementById('vin-t').textContent=a.querySelector('h3').textContent;
    vin.classList.add('show');vin.tabIndex=0;vinSpin(assumePlaying);
    requestAnimationFrame(vinPos);
  }
  function vinHide(){vin.classList.remove('show','spin');vin.tabIndex=-1}
  function vinPos(){var p=document.getElementById('player');if(!p.hidden)document.documentElement.style.setProperty('--pbar',p.offsetHeight+'px')}
  if(window.ResizeObserver)new ResizeObserver(vinPos).observe(document.getElementById('player'));
  vin.addEventListener('click',function(){var t=nextT&&nextA?nextA:cur2;if(t)openDetail(t)});
  var spwrap=document.getElementById('spwrap'),pnote=document.getElementById('pnote');
  window.onSpotifyIframeApiReady=function(API){spAPI=API};
  // Spotify-Steuerung erst nach dem Seitenaufbau (oder bei der ersten Berührung) laden – bremst sonst das Handy
  var spLoaded=false;
  function spLoad(){if(spLoaded)return;spLoaded=true;var sc=document.createElement('script');sc.src='https://open.spotify.com/embed/iframe-api/v1';sc.async=true;document.body.appendChild(sc)}
  if(document.readyState==='complete')setTimeout(spLoad,1500);else window.addEventListener('load',function(){setTimeout(spLoad,1500)});
  ['pointerdown','keydown','touchstart'].forEach(function(ev){document.addEventListener(ev,spLoad,{once:true,passive:true,capture:true})});
  function onUpd(e){
    var d=e&&e.data;if(d&&typeof d.isPaused==='boolean'){vinSpin(!d.isPaused);isPlay=!d.isPaused}
    if(d&&d.duration>0&&!player.classList.contains('yt')){
      isPreview=d.duration<=31000;
      if(d.position>=d.duration-1200||(d.isPaused&&d.position===0&&spLast>=d.duration-3000))songEnded();
      if(!d.isPaused&&d.position>0&&d.position<d.duration-3000)spLast=d.position;
    }
    if(!d||noteShown)return;
    if(d.duration>0&&d.duration<=31000){
      noteShown=true;
      document.getElementById('pnote-yt').hidden=!(cur2&&cur2.dataset.yt);
      pnote.hidden=false;document.body.classList.add('pnote-on');
      try{localStorage.setItem('abard-preview','1')}catch(err){}
    }
  }
  // Start sicherstellen: Spotify ignoriert play() manchmal, solange der Song noch lädt – dann kurz nachfassen
  var spTry=null;
  function spKick(){
    if(spTry)clearInterval(spTry);var n=0;
    spTry=setInterval(function(){
      if(isPlay||++n>6||!spCtl||player.hidden||player.classList.contains('yt')){clearInterval(spTry);spTry=null;return}
      try{spCtl.play()}catch(e){}
    },900);
  }
  function spPlay(uri){
    spWant=uri;isPlay=false;
    if(spCtl){spCtl.loadUri(uri);spCtl.play();spKick();return true}
    if(!spAPI)return false;
    spAPI.createController(document.getElementById('spembed'),{width:'100%',height:80,uri:uri},function(c){
      spCtl=c;c.addListener('playback_update',onUpd);
      c.addListener('ready',function(){if(spWant){c.play();spKick()}});
    });
    return true;
  }
  function play(a,forceYt){
      // Noch keine Spotify-/YouTube-ID hinterlegt (z. B. am Release-Tag): Link direkt öffnen statt Player
      if(!a.dataset.id&&!a.dataset.yt){window.open(a.href,'_blank','noopener');return}
      cur2=a;endFired=false;spLast=0;isPreview=false;nextCancel();played[key(a)]=1;
      document.querySelectorAll('.rel.active').forEach(function(x){x.classList.remove('active')});
      a.classList.add('active');
      var useYt=a.dataset.yt&&(forceYt===true||(forceYt!==false&&src==='youtube')||!a.dataset.id);
      player.classList.toggle('yt',!!useYt);document.body.classList.toggle('playing-yt',!!useYt);
      pnote.hidden=true;document.body.classList.remove('pnote-on');noteShown=false;
      if(useYt){
        if(spCtl){try{spCtl.pause()}catch(err){}}
        spwrap.hidden=true;frame.hidden=false;frame.title='YouTube-Player';
        frame.src='https://www.youtube.com/embed/'+a.dataset.yt+'?autoplay=1&rel=0&playsinline=1&enablejsapi=1&origin='+encodeURIComponent(location.origin);
        ytListen();
      }else if(spPlay('spotify:album:'+a.dataset.id)){
        frame.src='about:blank';frame.hidden=true;spwrap.hidden=false;
      }else{
        spwrap.hidden=true;frame.hidden=false;frame.title='Spotify-Player';
        frame.src='https://open.spotify.com/embed/album/'+a.dataset.id+'?utm_source=generator&theme=0';
      }
      document.getElementById('pi-t').textContent=a.querySelector('h3').textContent;
      var pyt=document.getElementById('pyt');pyt.hidden=!useYt;if(useYt)pyt.href='https://www.youtube.com/watch?v='+a.dataset.yt;document.getElementById('psub').hidden=!useYt;
      player.hidden=false;document.body.classList.add('playing');favSync();
      vinShow(a,useYt||!spCtl);
  }
  document.getElementById('pnote-yt').addEventListener('click',function(){setSrc('youtube');if(cur2)play(cur2,true)});
  document.getElementById('pclose').addEventListener('click',function(){
    frame.src='about:blank';if(spCtl){try{spCtl.pause()}catch(err){}}
    nextCancel();player.hidden=true;pnote.hidden=true;document.body.classList.remove('playing','pnote-on');vinHide();
    document.querySelectorAll('.rel.active').forEach(function(x){x.classList.remove('active')});
  });

  // ---- Autoplay: nach Songende 10 s warten, dann ähnliches Genre spielen ----
  // Schnittstelle für den Sneak Peek: laufende Musik anhalten und danach fortsetzen
  var isPlay=false;
  function ytCmd(f){try{frame.contentWindow.postMessage(JSON.stringify({event:'command',func:f,args:[]}),'*')}catch(e){}}
  window.ABARD_PLAYER={
    playing:function(){return !player.hidden&&isPlay},
    pause:function(){if(player.classList.contains('yt'))ytCmd('pauseVideo');else if(spCtl){try{spCtl.pause()}catch(e){}}},
    resume:function(){if(player.classList.contains('yt'))ytCmd('playVideo');else if(spCtl){try{spCtl.resume()}catch(e){}}}
  };
  var ap=true,nextYt=false,endFired=false,played={},nextT=null,nextA=null,ytPoll=null;
  try{ap=localStorage.getItem('abard-autoplay')!=='0'}catch(e){}
  var apBtn=document.getElementById('ap'),pnext=document.getElementById('pnext');
  function setAp(v){ap=v;apBtn.setAttribute('aria-pressed',String(v));try{localStorage.setItem('abard-autoplay',v?'1':'0')}catch(e){}if(!v)nextCancel()}
  apBtn.addEventListener('click',function(){setAp(!ap)});setAp(ap);
  // Autoplay: nächster Song aus derselben Stimmungsfamilie (neueste zuerst), erst danach
  // die verwandten Familien in der Reihenfolge von NB. Neuer Song → Slug hier eintragen.
  var FAM={
    'the-entropy-bell':1,'the-blind-kings':1,'the-digital-heretic':1,'the-morning-star':1,'koenige-von-nichts':1,
    'obsession-with-a-ghost':2,'chasing-illusions':2,'der-uhrmacher':2,'der-leuchtturm':2,
    'fragile-horizons':3,'echoes-of-the-silver-valley':3,'lullaby-for-the-stars':3,'symphony-of-life':3,
    'room-404':4,'toxic-devotion':4,'golden-venom':4,
    'once-a-lifetime':5,'what-love-should-be':5,'forever-drawn-to-you':5,'when-i-saw-you':5,'through-your-eyes':5,'the-flame-that-is-ours':5,
    'the-quiet-space':6,'you':6,'when-i-have-to-leave':6,'the-dash-between-the-years':6,'fading-photographs':6,'wings-of-wax':6,'aftermath':6,'mom':6,
    'still-burning':7,'she-s-gone':7,'shadows-of-my-yesterday':7,'love-will-haunt-me-forever':7,'if-my-heart-could-speak':7,'passion':7,'rising':7,
    'dreaming-your-own-life':8,'master-of-our-time':8,'no-someday-left':8,'kurze-zeit':8
  };
  // 1 Cyber/Sci-Fi · 2 Gothic/Dark Rock · 3 Cinematic · 4 Sultry · 5 Liebeslieder · 6 Verlust · 7 80s/Metal · 8 Aufbruch
  var NB={1:[2,3],2:[1,3],3:[2,6],4:[2,5],5:[6,4],6:[5,7],7:[6,8],8:[7,5]};
  var LAST={'the-flame-that-is-ours':1}; // innerhalb der Familie hinten anstellen
  function words(g){return (g||'').toLowerCase().split(/[\s\-\/]+/).filter(Boolean)}
  function pickNext(a,ytOnly){
    var g=(a.dataset.genre||'').toLowerCase(),gw=words(g),f=FAM[a.dataset.slug],nb=NB[f]||[],seen={},all=[];
    // Noch nicht erschienene (versteckte) Songs nie automatisch abspielen
    document.querySelectorAll('.rel[data-id]:not([hidden]),.rel[data-yt]:not([hidden])').forEach(function(r){
      var k=key(r);if(seen[k]||k===key(a)||(ytOnly&&!r.dataset.yt))return;seen[k]=1;all.push(r);
    });
    var pool=all.filter(function(r){return !played[key(r)]});
    if(!pool.length){played={};played[key(a)]=1;pool=all}
    function score(r){
      var rf=FAM[r.dataset.slug];
      if(f&&rf)return rf===f?100:nb[0]===rf?50:nb[1]===rf?25:0;
      // Song ohne Familie: Ähnlichkeit über die Genre-Wörter
      var rg=(r.dataset.genre||'').toLowerCase(),sc=0;
      if(rg&&rg===g)return 100;
      words(rg).forEach(function(w){if(gw.indexOf(w)>=0)sc+=(w==='ballad'||w==='metal'||w==='rock'?3:1)});
      return sc;
    }
    pool.sort(function(x,y){
      return score(y)-score(x)||(LAST[x.dataset.slug]?1:0)-(LAST[y.dataset.slug]?1:0)||(y.dataset.date||'').localeCompare(x.dataset.date||'');
    });
    return pool[0]||null;
  }
  function songEnded(){
    if(endFired||!ap||!cur2||player.hidden)return;endFired=true;
    nextYt=isPreview&&!player.classList.contains('yt');
    nextA=pickNext(cur2,nextYt);if(!nextA)return;
    var n=5;
    document.getElementById('pnext-t').textContent=nextA.querySelector('h3').textContent;
    document.getElementById('pnext-g').textContent=(nextA.dataset.genre?'· '+nextA.dataset.genre:'')+(nextYt?' · '+T('nx.viayt'):'');
    document.getElementById('pnext-s').textContent=n;
    pnote.hidden=true;document.body.classList.remove('pnote-on');
    pnext.hidden=false;pnext.classList.remove('run');void pnext.offsetWidth;pnext.classList.add('run');
    document.body.classList.add('pnext-on');
    vinSwap(nextA,T('vin.next'));
    nextT=setInterval(function(){
      n--;document.getElementById('pnext-s').textContent=Math.max(n,0);
      if(n<=0)playNext()
    },1000);
  }
  function nextCancel(){
    if(nextT){clearInterval(nextT);nextT=null}
    pnext.hidden=true;pnext.classList.remove('run');document.body.classList.remove('pnext-on');
  }
  function playNext(){var b=nextA;nextCancel();if(!b)return;if(nextYt)setSrc('youtube');play(b)}
  document.getElementById('pnext-go').addEventListener('click',playNext);
  document.getElementById('pnext-x').addEventListener('click',function(){var was=!!nextT;nextCancel();if(was&&cur2)vinSwap(cur2,T('vin.last'))});
  // YouTube meldet Songende über postMessage (enablejsapi=1)
  function ytListen(){
    if(ytPoll)clearInterval(ytPoll);var tries=0;
    ytPoll=setInterval(function(){
      if(++tries>20||frame.hidden){clearInterval(ytPoll);ytPoll=null;return}
      try{frame.contentWindow.postMessage(JSON.stringify({event:'listening',id:1,channel:'widget'}),'*')}catch(e){}
    },500);
  }
  window.addEventListener('message',function(e){
    if(e.source!==frame.contentWindow||!/^https:\/\/www\.youtube(-nocookie)?\.com$/.test(e.origin))return;
    var d;try{d=typeof e.data==='string'?JSON.parse(e.data):e.data}catch(err){return}
    if(!d)return;
    if(ytPoll&&d.event){clearInterval(ytPoll);ytPoll=null}
    var st=d.event==='onStateChange'?d.info:(d.info&&typeof d.info.playerState==='number'?d.info.playerState:null);
    if(st===0)songEnded();
    if(st===1){vinSpin(true);isPlay=true}else if(st===2||st===0){vinSpin(false);isPlay=false}
  });

  var dlg=document.getElementById('detail'),cur=null;
  function key(a){return a.dataset.id||a.dataset.yt||a.dataset.key}
  function fmtText(t){return esc(t).replace(/\{\{(.+?)\}\}/g,'<span class="orig" lang="en">$1</span>').replace(/\n/g,'<br>')}
  // Zwei Schalter im Song-Fenster:
  //  - oben (#dltog, hinter „Teilen“): Story und Überschriften Englisch/Deutsch; Start = Seitensprache
  //  - beim Songtext (#lytog): Original / sinngemässe Übersetzung; startet IMMER im Original, nur aktiv per Klick
  var dlMode='orig',lyMode='orig',lyFor=null;
  function rerender(){if(cur){var y=dlg.scrollTop;openDetail(cur,true);dlg.scrollTop=y}}
  document.querySelectorAll('#dltog button').forEach(function(b){b.addEventListener('click',function(){dlMode=b.dataset.dl;rerender()})});
  document.querySelectorAll('#lytog button').forEach(function(b){b.addEventListener('click',function(){lyMode=b.dataset.ly;rerender()})});
  function longDate(d){var M=T('monthsLong'),day=+d.slice(8,10),mo=M[+d.slice(5,7)-1],y=d.slice(0,4);return I.lang()==='de'?day+'. '+mo+' '+y:mo+' '+day+', '+y}
  function num(n){return I.lang()==='de'?Number(n).toLocaleString('de-CH').replace(/'/g,'’'):Number(n).toLocaleString('en-US')}
  function esc(t){var d=document.createElement('div');d.textContent=t;return d.innerHTML}
  function openDetail(a,noHash){
    cur=a;var k=key(a),SI=window.SONGINFO||{},info=SI[a.dataset.id]||SI[a.dataset.yt]||SI[a.dataset.ytx]||SI[a.dataset.key]||{},d=a.dataset.date||'';
    var dim=a.querySelector('img');window.ABARD_LZ.now(dim);document.getElementById('d-img').src=dim.currentSrc||window.ABARD_LZ.url(dim);
    document.getElementById('d-title').textContent=a.querySelector('h3').textContent;
    // Songdetails: nur der Stil (ausführlich wie im YouTube-Titel), sonst das Genre
    document.getElementById('d-meta').textContent=a.dataset.style||a.dataset.genre||'';
    document.getElementById('d-sp').hidden=!a.dataset.id;document.getElementById('d-yt').hidden=!a.dataset.yt;
    var l=document.getElementById('d-links');l.innerHTML='';
    if(a.dataset.id)l.innerHTML+='<a href="https://open.spotify.com/album/'+a.dataset.id+'" target="_blank" rel="noopener">'+esc(T('open.sp'))+'</a>';
    if(a.dataset.yt||a.dataset.ytx)l.innerHTML+='<a href="https://www.youtube.com/watch?v='+(a.dataset.yt||a.dataset.ytx)+'" target="_blank" rel="noopener">'+esc(T('open.yt'))+'</a>';
    if(!a.dataset.id&&!a.dataset.yt&&!a.dataset.ytx)l.innerHTML+='<a href="'+esc(a.href)+'" target="_blank" rel="noopener">'+esc(T('open.sp'))+'</a>';
    var story=document.getElementById('d-story'),ly=document.getElementById('d-lyrics');
    // Deutsch: übersetzte Story ({{…}} = englisches Originalzitat, klein/kursiv) und auf Wunsch sinngemässer Songtext
    // Umschalter „Deutsch“ stellt das ganze Fenster auf Deutsch (Überschriften, Story, Songtext), auch wenn die Seite auf EN steht
    if(lyFor!==a){lyFor=a;lyMode='orig';dlMode=I.lang()==='de'?'de':'orig'}
    var hasSt=!!info.story_de,de=hasSt&&dlMode==='de',st=(de&&info.story_de)||info.story;
    var hasDe=!!info.lyrics_de,useDe=hasDe&&lyMode==='de';
    story.querySelector('h3').textContent=de?'Über den Song':'About the song';
    ly.querySelector('h3').textContent=de?'Songtext':'Lyrics';
    document.getElementById('lynote').textContent='Sinngemässe Übersetzung';
    story.hidden=!st;story.querySelector('p').innerHTML=st?fmtText(st):'';
    document.getElementById('dltog').hidden=!hasSt;
    document.querySelectorAll('#dltog button').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.dl===(de?'de':'orig')))});
    document.getElementById('lytog').hidden=!hasDe;document.getElementById('lynote').hidden=!useDe;
    document.querySelectorAll('#lytog button').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.ly===(useDe?'de':'orig')))});
    var lt=useDe?info.lyrics_de:info.lyrics;
    ly.hidden=!info.lyrics;ly.querySelector('.lybody').innerHTML=lt?esc(lt).replace(/\n/g,'<br>'):'';
    favSync();
    if(!noHash)history.replaceState(null,'','#song-'+k);
    if(!dlg.open)dlg.showModal();dlg.scrollTop=0;
  }
  document.addEventListener('click',function(e){
    if(e.defaultPrevented||e.button||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
    var l=e.target.closest&&e.target.closest('#out-st,.songlist a');if(!l)return;
    var m=(l.getAttribute('href')||'').match(/(?:^|\/)s\/([^\/]+)\/?$/);if(!m)return;
    var t=document.querySelector('a.rel[data-slug="'+m[1]+'"]');if(!t)return;
    e.preventDefault();openDetail(t);
  });
  function closeDetail(){dlg.close()}
  dlg.addEventListener('close',function(){lyFor=null;if(location.hash.indexOf('#song-')===0)history.replaceState(null,'',location.pathname+location.search)});
  dlg.addEventListener('click',function(e){if(e.target===dlg)closeDetail()});
  document.getElementById('d-close').addEventListener('click',closeDetail);
  document.getElementById('d-sp').addEventListener('click',function(){play(cur,false);closeDetail()});
  document.getElementById('d-yt').addEventListener('click',function(){play(cur,true);closeDetail()});
  document.getElementById('d-share').addEventListener('click',function(){if(cur)shareSong(cur,this)});
  document.getElementById('pshare').addEventListener('click',function(){if(cur2)shareSong(cur2,this)});
  document.getElementById('d-fav').addEventListener('click',function(){if(cur)favToggle(cur)});
  document.getElementById('pfav').addEventListener('click',function(){if(cur2)favToggle(cur2)});

  // ---- Teilen: Handy = Teilen-Menü des Telefons, Desktop = kleines Menü ----
  // Link führt immer auf die eigene Songseite; ?via=share macht geteilte Aufrufe in der Plesk-Statistik sichtbar.
  function songUrl(a){
    return a.dataset.slug?location.origin+'/s/'+a.dataset.slug+'/?via=share':location.origin+location.pathname+'?via=share#song-'+key(a);
  }
  function songTitle(a){return (a.querySelector('h3')||a.querySelector('h2')).textContent}
  var pop=null,popFor=null;
  function popClose(){if(pop){pop.hidden=true;popFor=null}}
  function host(el){var d=el.closest('dialog[open]');return d||document.body}
  function shareSong(a,btn,items){
    var url=songUrl(a),t=songTitle(a)+' – ABard';
    var touch=window.matchMedia&&matchMedia('(pointer:coarse)').matches;
    if(!items&&touch&&navigator.share){navigator.share({title:t,text:t,url:url}).catch(function(){});return}
    if(!pop){
      pop=document.createElement('div');pop.className='shpop';pop.hidden=true;pop.setAttribute('role','menu');
      document.addEventListener('click',function(e){if(pop&&!pop.hidden&&!pop.contains(e.target)&&e.target.closest('button')!==popFor)popClose()},true);
      document.addEventListener('keydown',function(e){if(e.key==='Escape'&&pop&&!pop.hidden){e.stopPropagation();e.preventDefault();var f=popFor;popClose();if(f)f.focus()}},true);
      window.addEventListener('scroll',popClose,{passive:true});window.addEventListener('resize',popClose);
    }
    if(popFor===btn&&!pop.hidden){popClose();return}
    var msg=T('share.sub')+' '+t+' '+url;
    pop.innerHTML='';
    var h=document.createElement('p');h.textContent=songTitle(a);pop.appendChild(h);
    var cp=document.createElement('button');cp.type='button';cp.setAttribute('role','menuitem');cp.textContent=T('share.copy');
    cp.addEventListener('click',function(){
      function ok(){cp.textContent=T('copied');setTimeout(popClose,1200)}
      if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(url).then(ok,function(){prompt(T('share.copy'),url)});
      else prompt(T('share.copy'),url);
    });
    if(!items)pop.appendChild(cp);
    (items||[['WhatsApp','https://wa.me/?text='+encodeURIComponent(msg)],
     ['Facebook','https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url)],
     ['X','https://x.com/intent/post?text='+encodeURIComponent(t)+'&url='+encodeURIComponent(url)],
     [T('share.mail'),'mai'+'lto:?subject='+encodeURIComponent(t)+'&body='+encodeURIComponent(msg)]
    ]).forEach(function(x){
      var l=document.createElement('a');l.setAttribute('role','menuitem');l.textContent=x[0];l.href=x[1];
      if(x[2])l.setAttribute('download','');
      if(x[1].indexOf('http')===0){l.target='_blank';l.rel='noopener'}
      l.addEventListener('click',function(){setTimeout(popClose,50)});pop.appendChild(l);
    });
    host(btn).appendChild(pop);pop.hidden=false;popFor=btn;
    var r=btn.getBoundingClientRect(),pw=pop.offsetWidth,ph=pop.offsetHeight,vw=document.documentElement.clientWidth,vh=window.innerHeight;
    var x=Math.min(Math.max(8,r.right-pw),vw-pw-8),y=r.bottom+8;
    if(y+ph>vh-8)y=Math.max(8,r.top-ph-8);
    pop.style.left=x+'px';pop.style.top=y+'px';
    (items?pop.querySelector('a'):cp).focus({preventScroll:true});
  }

  // ---- Erinnerung für kommende Releases (ohne Spotify): YouTube-Premiere, .ics-Datei oder Google Kalender. Kalendereintrag für kommende Releases (Karten #soon/#later/#later2/#later3/#later4): .ics-Datei oder Google Kalender ----
  function calPop(box,btn){
    var t=box.dataset.at?Date.parse(box.dataset.at):Date.parse(box.dataset.day+'T'+(box.dataset.time||'00:00')+':00+02:00');
    var slug=box.dataset.slug,title=songTitle(box),name='ABard – '+title+' (New Single)';
    var z=function(ms){return new Date(ms).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')};
    var det=title+' – new single by ABard, out now on Spotify & YouTube.\n'+location.origin+'/s/'+slug+'/';
    shareSong(box,btn,(box.dataset.yt?[[T('rem.yt'),box.dataset.yt]]:[]).concat([
      [T('cal.ics'),'cal/'+slug+'.ics',true],
      [T('cal.g'),'https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent(name)+'&dates='+z(t)+'/'+z(t+1800000)+'&details='+encodeURIComponent(det)+'&location='+encodeURIComponent('Spotify / YouTube')]
    ]));
  }
  window.ABARD_CARD_TOOLS=function(box){
    box.querySelectorAll('.ctool').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();if(b.dataset.act==='cal')calPop(box,b);else shareSong(box,b)})});
  };

  // ---- Merken: Favoriten nur im Browser des Besuchers (localStorage), Schlüssel = Songseiten-Name ----
  function fkey(a){return a.dataset.slug||key(a)}
  function favGet(){try{var v=JSON.parse(localStorage.getItem('abard-favs')||'[]');return Array.isArray(v)?v:[]}catch(e){return []}}
  function favSet(v){try{localStorage.setItem('abard-favs',JSON.stringify(v))}catch(e){}}
  function isFav(a){return favGet().indexOf(fkey(a))>=0}
  function favToggle(a){
    var v=favGet(),k=fkey(a),i=v.indexOf(k),on=i<0;
    if(on)v.unshift(k);else v.splice(i,1);
    favSet(v);favSync();favRender();
    if(on)favToast(a);else toastHide();
  }
  function favBtn(b,on,withLabel){
    b.setAttribute('aria-pressed',String(on));
    var k=on?'fav.aria.on':'fav.aria';
    if(withLabel){var sp=b.querySelector('span');sp.setAttribute('data-i18n',on?'fav.on':'fav.add');sp.textContent=T(on?'fav.on':'fav.add')}
    else{b.setAttribute('data-i18n-aria',k);b.setAttribute('data-i18n-title',k);b.setAttribute('aria-label',T(k));b.title=T(k)}
  }
  function favSync(){
    var v=favGet();
    document.querySelectorAll('.rel[data-slug]').forEach(function(r){r.classList.toggle('is-fav',v.indexOf(fkey(r))>=0)});
    if(cur2)favBtn(document.getElementById('pfav'),v.indexOf(fkey(cur2))>=0,false);
    if(cur)favBtn(document.getElementById('d-fav'),v.indexOf(fkey(cur))>=0,true);
  }
  var toast=null,toastT=null;
  function toastHide(){if(toast)toast.hidden=true;if(toastT){clearTimeout(toastT);toastT=null}}
  function favToast(a){
    if(!toast){toast=document.createElement('div');toast.className='ftoast';toast.setAttribute('role','status');toast.hidden=true}
    toast.innerHTML='';
    var m=document.createElement('span');m.textContent=T('fav.toast');toast.appendChild(m);
    // Spotify-Speichern hilft dem Algorithmus – nur anbieten, wenn der Song auf Spotify ist
    // Hinweis passend zur Plattform: läuft der Song gerade über YouTube (oder gibt es ihn nur dort) → YouTube-Like, sonst Spotify-Speichern
    var viaYt=a.dataset.yt&&(!a.dataset.id||(cur2&&fkey(cur2)===fkey(a)&&player.classList.contains('yt')));
    var lh=viaYt?'https://www.youtube.com/watch?v='+a.dataset.yt:(a.dataset.id?'https://open.spotify.com/album/'+a.dataset.id:'');
    if(lh){var l=document.createElement('a');l.href=lh;l.target='_blank';l.rel='noopener';l.textContent=T(viaYt?'fav.toast.yt':'fav.toast.sp');l.addEventListener('click',toastHide);toast.appendChild(l)}
    var x=document.createElement('button');x.type='button';x.textContent='✕';x.setAttribute('aria-label',T('fav.toast.x'));x.addEventListener('click',toastHide);toast.appendChild(x);
    host(dlg.open?document.getElementById('d-fav'):document.getElementById('pfav')).appendChild(toast);
    toast.hidden=false;if(toastT)clearTimeout(toastT);toastT=setTimeout(toastHide,7000);
  }
  dlg.addEventListener('close',function(){popClose();if(toast&&toast.parentNode===dlg)toastHide()});
  // Reihe „Deine Favoriten“: Kopien der Kacheln, Klick wird an die Original-Kachel weitergereicht
  var favSec=document.getElementById('favs'),favList=document.getElementById('fav-list');
  function orig(k){
    var all=document.querySelectorAll('#releases .rel[data-slug],.rel[data-slug]');
    for(var i=0;i<all.length;i++)if(fkey(all[i])===k&&!all[i].closest('#favs'))return all[i];
    return null;
  }
  function favRender(){
    if(!favSec)return;
    favList.innerHTML='';var n=0;
    favGet().forEach(function(k){
      var o=orig(k);if(!o||o.hidden)return;
      var c=o.cloneNode(true);
      ['data-id','data-yt','data-ytx','data-key','data-at','data-sp','data-ytv'].forEach(function(x){c.removeAttribute(x)});
      c.classList.remove('active','big');c.dataset.fav=k;c.removeAttribute('target');
      var rk=c.querySelector('.rank'),st=c.querySelector('.streams');if(rk)rk.remove();if(st)st.remove();
      var im=c.querySelector('img');if(im){im.loading='eager';window.ABARD_LZ.now(im)}
      favList.appendChild(c);n++;
    });
    favSec.hidden=!n;
  }
  favList&&favList.addEventListener('click',function(e){
    var c=e.target.closest('.rel');if(!c)return;
    var o=orig(c.dataset.fav);if(!o)return;
    var sb=e.target.closest('.tshare');
    e.preventDefault();
    if(sb){e.stopPropagation();shareSong(o,sb);return}
    if(e.metaKey||e.ctrlKey||e.shiftKey){window.open(c.href,'_blank','noopener');return}
    if(!e.target.closest('.cover')){openDetail(o);return}
    play(o);
  });
  favRender();favSync();
  // Grosser Play-Knopf nach einem geteilten Link: ein Tipp gilt als Erlaubnis für Ton
  function tapPrompt(title,img,label,go){
    var o=document.getElementById('tapgo');if(o)o.remove();
    o=document.createElement('div');o.id='tapgo';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');o.setAttribute('aria-label',title);
    var b=document.createElement('button');b.type='button';b.className='tg-play';
    if(img){var i=document.createElement('img');i.src=img;i.alt='';b.appendChild(i)}
    var t1=document.createElement('b');t1.className='tg-title';t1.textContent=title;b.appendChild(t1);
    var ic=document.createElement('span');ic.className='tg-ic';ic.setAttribute('aria-hidden','true');ic.innerHTML='<svg viewBox="0 0 24 24"><path d="M7 4.5v15l13-7.5z"/></svg>';b.appendChild(ic);
    var t2=document.createElement('span');t2.className='tg-lab';t2.textContent=label;b.appendChild(t2);
    var x=document.createElement('button');x.type='button';x.className='tg-x';x.setAttribute('aria-label',T('close'));x.textContent='×';
    o.appendChild(b);o.appendChild(x);document.body.appendChild(o);document.documentElement.classList.add('tg-open');
    function shut(){o.remove();document.documentElement.classList.remove('tg-open')}
    b.addEventListener('click',function(){shut();go()});
    x.addEventListener('click',shut);
    o.addEventListener('click',function(e){if(e.target===o)shut()});
    document.addEventListener('keydown',function k(e){if(e.key==='Escape'){shut();document.removeEventListener('keydown',k)}});
    setTimeout(function(){b.focus({preventScroll:true})},50);
  }
  // Von der Songseite („▶ Play on ABard“): Song direkt im Player starten statt nur den Songtext zu zeigen.
  // Browser erlauben Ton ohne Klick auf der Seite nicht immer – dann steht der Song bereit, ein Tipp auf ▶ im Player genügt.
  // Erst nach dem übrigen Aufbau ausführen: der Release-Block blendet frisch erschienene Kacheln erst später ein
  if(location.hash.indexOf('#play-')===0)setTimeout(function(){
    var sl=decodeURIComponent(location.hash.slice(6)),pa=null;
    document.querySelectorAll('.rel[data-slug="'+sl.replace(/"/g,'')+'"]').forEach(function(r){if(!r.hidden&&!r.closest('#favs')&&(!pa||pa.classList.contains('big')))pa=r});
    history.replaceState(null,'',location.pathname+location.search);
    // Noch nicht erschienen (Kachel bis zur Release-Zeit versteckt): zur Release-Karte mit Countdown springen
    if(!pa){
      var nb=document.querySelector('.next[data-slug="'+sl.replace(/"/g,'')+'"]:not([hidden]),section[data-slug="'+sl.replace(/"/g,'')+'"]');
      if(nb){
        nb.scrollIntoView({block:'center'});
        var sn=nb.querySelector('.sneak'),im=nb.querySelector('img'),h=nb.querySelector('h2');
        if(sn&&h)tapPrompt(h.textContent,window.ABARD_LZ.url(im),T('sneak'),function(){sn.click()});
      }
    }
    if(pa){
      pa.scrollIntoView({block:'center'});
      var w0=Date.now(),P=window.ABARD_PLAYER;
      (function go(){if(spAPI||src==='youtube'||!pa.dataset.id||Date.now()-w0>3000)play(pa);else setTimeout(go,150)})();
      // Browser (v. a. WhatsApp/Instagram auf dem Handy) blockieren Ton ohne Tipp: dann ein grosser Play-Knopf
      setTimeout(function(){
        if(window.ABARD_PLAYER&&window.ABARD_PLAYER.playing())return;
        var im=pa.querySelector('img');tapPrompt(songTitle(pa),window.ABARD_LZ.url(im),T('tap.play'),function(){play(pa)});
      },4000);
    }
  },0);
  if(location.hash.indexOf('#song-')===0){var k0=location.hash.slice(6),a0=document.querySelector('.rel[data-id="'+k0+'"]:not([hidden]),.rel[data-yt="'+k0+'"]:not([hidden]),.rel[data-key="'+k0+'"]:not([hidden])');if(a0)openDetail(a0,true)}
  // Song-Verzeichnis A–Z: unveröffentlichte Songs ab Release-Zeit zeigen (Trennpunkte nur zwischen sichtbaren)
  (function(){
    var p=document.querySelector('nav.songlist p');if(!p)return;
    function upd(){
      var nx=Infinity;
      p.querySelectorAll('a[data-at]').forEach(function(a){var t=Date.parse(a.dataset.at);if(Date.now()>=t)a.hidden=false;else nx=Math.min(nx,t)});
      var first=true;
      p.querySelectorAll('a').forEach(function(a){var s=a.previousElementSibling;if(s&&s.classList.contains('sep'))s.hidden=a.hidden||first;if(!a.hidden)first=false});
      if(nx<Infinity&&nx-Date.now()<864e5)setTimeout(upd,nx-Date.now()+500);
    }
    upd();
  })();
  // ---- Nächster Release: Countdown, danach automatisch Buttons + Kachel ----
  // Alle Angaben stehen im HTML an <section id="next" data-at data-sp data-yt>. Fehlt eine ID,
  // führen die Buttons trotzdem sicher zum Ziel (Spotify-Künstlerseite / YouTube-Kanal, neuester Release oben).
  (function(){
    var box=document.getElementById('next');if(!box)return;
    var t=Date.parse(box.dataset.at),pad=function(n){return String(n).padStart(2,'0')};
    var SHOW_DAYS=21; // so lange bleibt der Block nach dem Release als "Jetzt erschienen" stehen
    var sp=box.dataset.sp,yt=box.dataset.yt;
    if(sp)document.getElementById('out-sp').href='https://open.spotify.com/album/'+sp;
    if(yt)document.getElementById('out-yt').href='https://www.youtube.com/watch?v='+yt;
    // Nur die Kachel dieses Releases ergänzen – nicht andere noch unveröffentlichte Songs
    document.querySelectorAll('.rel[data-at][data-slug="'+box.dataset.slug+'"]').forEach(function(a){
      if(sp&&!a.dataset.id){a.dataset.id=sp;a.href='https://open.spotify.com/album/'+sp}
      if(yt&&!a.dataset.yt){a.dataset.yt=yt;if(!sp)a.href='https://www.youtube.com/watch?v='+yt}
    });
    function dateText(){
      var d=new Date(t),l=I.lang()==='de'?'de-CH':'en-GB',o={day:'numeric',month:'long',year:'numeric'};
      var tm=d.toLocaleTimeString(l,{hour:'2-digit',minute:'2-digit',timeZoneName:'short'});
      return d.toLocaleDateString(I.lang()==='de'?'de-CH':'en-US',o)+' · '+tm;
    }
    function released(){
      var eye=document.getElementById('next-eye');eye.setAttribute('data-i18n','next.out');eye.textContent=T('next.out');
      document.getElementById('cd').hidden=true;document.getElementById('cd-out').hidden=false;
      // Spotify erscheint evtl. später als YouTube: bis dahin Hinweis statt Spotify-Button
      var spAt=Date.parse(box.dataset.spAt||''),spB=document.getElementById('out-sp'),spS=document.getElementById('out-sp-soon');
      function spCheck(){var wait=!isNaN(spAt)&&Date.now()<spAt&&!box.dataset.sp;spB.hidden=wait;spS.hidden=!wait;if(wait)setTimeout(spCheck,60000)}
      spCheck();
      document.querySelectorAll('.rel[data-at]').forEach(function(a){if(Date.now()>=Date.parse(a.dataset.at))a.hidden=false});
      if(Date.now()-t>SHOW_DAYS*86400000)document.getElementById('next-card').hidden=true;
    }
    function tick(){
      document.getElementById('next-date').textContent=dateText();
      var s=Math.floor((t-Date.now())/1000);
      if(isNaN(s)||s<=0){released();return}
      document.getElementById('cd-d').textContent=Math.floor(s/86400);
      document.getElementById('cd-h').textContent=pad(Math.floor(s%86400/3600));
      document.getElementById('cd-m').textContent=pad(Math.floor(s%3600/60));
      document.getElementById('cd-s').textContent=pad(s%60);
      setTimeout(tick,1000);
    }
    tick();
    document.addEventListener('abard:lang',function(){document.getElementById('next-date').textContent=dateText()});
  })();
  // ---- Nächste Releases (Karten #soon, #later, #later2, #later3, #later4): Countdown + Sneak Peek ----
  // data-day = Datum, data-time = Uhrzeit (leer, solange nicht bestätigt: dann nur Tage, Uhrzeit "folgt").
  // data-at (optional) = genaue Release-Zeit mit Zeitzone (z. B. Winterzeit +01:00), sonst data-day/data-time mit +02:00.
  // #later: data-after = Release-Zeit der Karte davor. Bis dahin nur Datum (ohne Uhr), danach Countdown;
  // gleichzeitig verschwindet die Karte zwei Plätze davor (#later blendet #next-card aus, #later2 blendet #soon aus, #later3 blendet #later aus, #later4 blendet #later2 aus).
  function releaseCard(id){
    var box=document.getElementById(id);if(!box)return null;
    var g=function(s){return document.getElementById(id+'-'+s)};
    var tm=box.dataset.time,t=box.dataset.at?Date.parse(box.dataset.at):Date.parse(box.dataset.day+'T'+(tm||'00:00')+':00+02:00'),pad=function(n){return String(n).padStart(2,'0')};
    var after=Date.parse(box.dataset.after||'');
    if(!tm)box.classList.add('soon-notime');
    if(window.ABARD_CARD_TOOLS)window.ABARD_CARD_TOOLS(box);
    function waiting(){return !isNaN(after)&&Date.now()<after}
    function dateText(){
      var d=new Date(box.dataset.day+'T12:00:00+02:00'),l=I.lang()==='de'?'de-CH':'en-US';
      var s=d.toLocaleDateString(l,{day:'numeric',month:'long',year:'numeric',timeZone:'Europe/Zurich'});
      if(waiting())return s;
      if(tm)s+=' · '+new Date(t).toLocaleTimeString(I.lang()==='de'?'de-CH':'en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Zurich',timeZoneName:'short'});
      else s+=' · '+T('tba');
      return s;
    }
    function tick(){
      g('date').textContent=dateText();
      if(waiting()){g('cd').hidden=true;setTimeout(tick,Math.min(after-Date.now()+300,60000));return}
      g('cd').hidden=false;
      if(!isNaN(after)){var ord=['next-card','soon','later','later2','later3','later4'],pi=ord.indexOf(id)-2,nc=pi>=0?document.getElementById(ord[pi]):null;if(nc)nc.hidden=true}
      var s=Math.floor((t-Date.now())/1000);
      if(isNaN(s)||s<=0){
        var eye=g('eye');eye.setAttribute('data-i18n','next.out');eye.textContent=T('next.out');
        g('cd').hidden=true;g('out').hidden=false;var ps=g('ps');if(ps)ps.hidden=true;var cb=box.querySelector('.ctool[data-act="cal"]');if(cb)cb.hidden=true;
        // Kacheln mit Release-Zeit bis zu diesem Release einblenden (Countdown endet schon in der letzten Sekunde davor)
        document.querySelectorAll('.rel[data-at]').forEach(function(a){if(Date.parse(a.dataset.at)<=t)a.hidden=false});return;
      }
      g('d').textContent=tm?Math.floor(s/86400):Math.ceil(s/86400);
      g('h').textContent=pad(Math.floor(s%86400/3600));
      g('m').textContent=pad(Math.floor(s%3600/60));
      g('s').textContent=pad(s%60);
      setTimeout(tick,1000);
    }
    tick();
    document.addEventListener('abard:lang',function(){g('date').textContent=dateText()});
    // Sneak Peek: laufende Musik pausieren, nach dem Sneak Peek dort weiterspielen
    var btn=g('sneak'),au=g('sneak-a'),bar=g('sneak-p'),lab=g('sneak-t'),resume=false;
    if(!btn||!au)return box;
    function mmss(x){x=Math.max(0,Math.round(x));return Math.floor(x/60)+':'+pad(x%60)}
    function done(){btn.setAttribute('aria-pressed','false');if(resume&&window.ABARD_PLAYER){window.ABARD_PLAYER.resume()}resume=false}
    btn.addEventListener('click',function(){
      if(au.paused){
        document.querySelectorAll('audio.sneak-a').forEach(function(o){if(o!==au&&!o.paused)o.pause()});
        var P=window.ABARD_PLAYER;resume=!!(P&&P.playing());if(resume)P.pause();
        au.play().catch(function(){done()});btn.setAttribute('aria-pressed','true');
      }else{au.pause();done()}
    });
    au.addEventListener('pause',function(){if(btn.getAttribute('aria-pressed')==='true'&&au.currentTime<(au.duration||60))btn.setAttribute('aria-pressed','false')});
    au.addEventListener('timeupdate',function(){var d=au.duration||60;bar.style.transform='scaleX('+(au.currentTime/d)+')';lab.textContent=mmss(d-au.currentTime)});
    au.addEventListener('ended',function(){au.currentTime=0;bar.style.transform='scaleX(0)';lab.textContent=mmss(au.duration||60);done()});
    // Startet jemand einen Song im Player, Sneak Peek anhalten
    document.addEventListener('click',function(e){if(!au.paused&&e.target.closest&&e.target.closest('.rel')&&!e.target.closest('.tshare')){au.pause();resume=false;btn.setAttribute('aria-pressed','false')}},true);
    return box;
  }
  releaseCard('soon');releaseCard('later');releaseCard('later2');releaseCard('later3');releaseCard('later4');
  // Sprache gewechselt: offenen Songdialog neu beschriften
  document.addEventListener('abard:lang',function(){if(dlg.open&&cur){lyFor=null;openDetail(cur,true)}var v=document.getElementById('vin-p');if(v&&vin.classList.contains('show')&&!nextT)v.textContent=T('vin.now')});
  // Video-Liste: eigene Playlist aus allen YouTube-Songs (neueste zuerst) statt der Kanal-Uploads
  (function(){
    var f=document.getElementById('ytlist');if(!f)return;
    var ids=[],seen={};
    // Noch nicht erschienene Releases (Premiere geplant) nie zeigen
    var now=Date.now();
    document.querySelectorAll('.rel[data-yt]:not(.big)').forEach(function(r){var v=r.dataset.yt,at=Date.parse(r.dataset.at||'');if(v&&!seen[v]&&!(at>now)){seen[v]=1;ids.push(v)}});
    var url=ids.length?'https://www.youtube.com/embed/'+ids[0]+'?enablejsapi=1&rel=0&playsinline=1&playlist='+ids.slice(1,50).join(',')+'&origin='+encodeURIComponent(location.origin):f.dataset.src;
    // Player erst laden, wenn der Besucher in die Nähe scrollt (spart allen anderen 3 MB YouTube-Code und Cookies)
    var go=function(){if(!f.src||f.src==='about:blank')f.src=url};
    if(!('IntersectionObserver' in window))return go();
    var io=new IntersectionObserver(function(es){if(es.some(function(e){return e.isIntersecting})){io.disconnect();go()}},{rootMargin:'1200px 0px'});
    io.observe(f);
    // Sprung über das Menü „Videos“ direkt laden
    window.addEventListener('hashchange',function(){if(location.hash==='#watch'){io.disconnect();go()}});
  })();
  // ---- Disclaimer als Overlay: Seite bleibt, Musik spielt weiter ----
  (function(){
    var link=document.getElementById('legal-link'),box=document.getElementById('legal'),body=document.getElementById('legal-body'),parts=null;
    if(!link||!box||!box.showModal)return;
    function render(){
      if(!parts)return;
      body.innerHTML='';body.appendChild((I.lang()==='de'?parts.de:parts.en).cloneNode(true));
      body.querySelectorAll('.mail').forEach(function(b){b.addEventListener('click',function(){
        var a=atob(b.getAttribute('data-m')).split('').reverse().join('');
        location.href='mai'+'lto:'+a+'?subject='+encodeURIComponent('ABard Website');
      })});
      body.querySelectorAll('a[href^="http"]').forEach(function(a){a.target='_blank';a.rel='noopener'});
    }
    link.addEventListener('click',function(e){
      if(e.metaKey||e.ctrlKey||e.shiftKey)return;
      e.preventDefault();
      if(parts){render();box.showModal();box.scrollTop=0;return}
      fetch(link.getAttribute('href')).then(function(r){if(!r.ok)throw 0;return r.text()}).then(function(t){
        var doc=new DOMParser().parseFromString(t,'text/html'),main=doc.querySelector('main');
        main.querySelectorAll('.back,footer,script').forEach(function(n){n.remove()});
        var de=document.createElement('div'),en=document.createElement('div'),cur=de;
        Array.prototype.slice.call(main.childNodes).forEach(function(n){
          if(n.nodeName==='HR'){cur=en;return}
          cur.appendChild(document.importNode(n,true));
        });
        // Englischer Teil steckt in einem <div lang="en"> – Überschriften davor bleiben erhalten
        parts={de:de,en:en.childNodes.length?en:de};
        render();box.showModal();box.scrollTop=0;
      }).catch(function(){location.href=link.getAttribute('href')});
    });
    document.getElementById('legal-close').addEventListener('click',function(){box.close()});
    box.addEventListener('click',function(e){if(e.target===box)box.close()});
    document.addEventListener('abard:lang',function(){if(box.open)render()});
  })();
  document.getElementById('y').textContent=new Date().getFullYear();
})();
