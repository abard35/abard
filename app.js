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
  document.querySelectorAll('.rel[data-id],.rel[data-yt],.rel[data-key]').forEach(function(a){
    a.addEventListener('click',function(e){
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
    var im=a.querySelector('.cover img'),u=(im.getAttribute('srcset')||'').split(',').pop().trim().split(' ')[0]||im.getAttribute('src');
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
  function onUpd(e){
    var d=e&&e.data;if(d&&typeof d.isPaused==='boolean')vinSpin(!d.isPaused);
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
  function spPlay(uri){
    spWant=uri;
    if(spCtl){spCtl.loadUri(uri);spCtl.play();return true}
    if(!spAPI)return false;
    spAPI.createController(document.getElementById('spembed'),{width:'100%',height:80,uri:uri},function(c){
      spCtl=c;c.addListener('playback_update',onUpd);
      c.addListener('ready',function(){if(spWant){c.play()}});
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
      var pyt=document.getElementById('pyt');pyt.hidden=!useYt;if(useYt)pyt.href='https://www.youtube.com/watch?v='+a.dataset.yt;
      player.hidden=false;document.body.classList.add('playing');
      vinShow(a,useYt||!spCtl);
  }
  document.getElementById('pnote-yt').addEventListener('click',function(){setSrc('youtube');if(cur2)play(cur2,true)});
  document.getElementById('pclose').addEventListener('click',function(){
    frame.src='about:blank';if(spCtl){try{spCtl.pause()}catch(err){}}
    nextCancel();player.hidden=true;pnote.hidden=true;document.body.classList.remove('playing','pnote-on');vinHide();
    document.querySelectorAll('.rel.active').forEach(function(x){x.classList.remove('active')});
  });

  // ---- Autoplay: nach Songende 10 s warten, dann ähnliches Genre spielen ----
  var ap=true,nextYt=false,endFired=false,played={},nextT=null,nextA=null,ytPoll=null;
  try{ap=localStorage.getItem('abard-autoplay')!=='0'}catch(e){}
  var apBtn=document.getElementById('ap'),pnext=document.getElementById('pnext');
  function setAp(v){ap=v;apBtn.setAttribute('aria-pressed',String(v));try{localStorage.setItem('abard-autoplay',v?'1':'0')}catch(e){}if(!v)nextCancel()}
  apBtn.addEventListener('click',function(){setAp(!ap)});setAp(ap);
  function words(g){return (g||'').toLowerCase().split(/[\s\-\/]+/).filter(Boolean)}
  function pickNext(a,ytOnly){
    var g=(a.dataset.genre||'').toLowerCase(),gw=words(g),seen={},best=[],bs=-1,all=[];
    document.querySelectorAll('.rel[data-id],.rel[data-yt]').forEach(function(r){
      var k=key(r);if(seen[k]||k===key(a)||(ytOnly&&!r.dataset.yt))return;seen[k]=1;all.push(r);
    });
    var pool=all.filter(function(r){return !played[key(r)]});
    if(!pool.length){played={};played[key(a)]=1;pool=all}
    pool.forEach(function(r){
      var rg=(r.dataset.genre||'').toLowerCase(),sc=0;
      if(rg&&rg===g)sc=100;else words(rg).forEach(function(w){if(gw.indexOf(w)>=0)sc+=(w==='ballad'||w==='metal'||w==='rock'?3:1)});
      if(sc>bs){bs=sc;best=[r]}else if(sc===bs)best.push(r);
    });
    return best.length?best[Math.floor(Math.random()*best.length)]:null;
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
    if(st===1)vinSpin(true);else if(st===2)vinSpin(false);
  });

  var dlg=document.getElementById('detail'),cur=null;
  function key(a){return a.dataset.id||a.dataset.yt||a.dataset.key}
  function longDate(d){var M=T('monthsLong'),day=+d.slice(8,10),mo=M[+d.slice(5,7)-1],y=d.slice(0,4);return I.lang()==='de'?day+'. '+mo+' '+y:mo+' '+day+', '+y}
  function num(n){return I.lang()==='de'?Number(n).toLocaleString('de-CH').replace(/'/g,'’'):Number(n).toLocaleString('en-US')}
  function esc(t){var d=document.createElement('div');d.textContent=t;return d.innerHTML}
  function openDetail(a,noHash){
    cur=a;var k=key(a),info=(window.SONGINFO||{})[k]||{},d=a.dataset.date||'';
    document.getElementById('d-img').src=a.querySelector('img').currentSrc||a.querySelector('img').src;
    document.getElementById('d-title').textContent=a.querySelector('h3').textContent;
    var meta=[];if(a.dataset.genre)meta.push(a.dataset.genre);if(d)meta.push(longDate(d));
    var pl=[];if(a.dataset.sp)pl.push(num(a.dataset.sp)+' Spotify');if(a.dataset.ytv)pl.push(num(a.dataset.ytv)+' YouTube');
    if(a.querySelector('.streams'))meta.push(pl.join(' · '));
    document.getElementById('d-meta').textContent=meta.join(' · ');
    document.getElementById('d-sp').hidden=!a.dataset.id;document.getElementById('d-yt').hidden=!a.dataset.yt;
    var l=document.getElementById('d-links');l.innerHTML='';
    if(a.dataset.id)l.innerHTML+='<a href="https://open.spotify.com/album/'+a.dataset.id+'" target="_blank" rel="noopener">'+esc(T('open.sp'))+'</a>';
    if(a.dataset.yt||a.dataset.ytx)l.innerHTML+='<a href="https://www.youtube.com/watch?v='+(a.dataset.yt||a.dataset.ytx)+'" target="_blank" rel="noopener">'+esc(T('open.yt'))+'</a>';
    if(!a.dataset.id&&!a.dataset.yt&&!a.dataset.ytx)l.innerHTML+='<a href="'+esc(a.href)+'" target="_blank" rel="noopener">'+esc(T('open.sp'))+'</a>';
    var story=document.getElementById('d-story'),ly=document.getElementById('d-lyrics');
    story.hidden=!info.story;story.querySelector('p').innerHTML=info.story?esc(info.story).replace(/\n/g,'<br>'):'';
    ly.hidden=!info.lyrics;ly.querySelector('div').innerHTML=info.lyrics?esc(info.lyrics).replace(/\n/g,'<br>'):'';
    if(!noHash)history.replaceState(null,'','#song-'+k);
    if(!dlg.open)dlg.showModal();dlg.scrollTop=0;
  }
  function closeDetail(){dlg.close()}
  dlg.addEventListener('close',function(){if(location.hash.indexOf('#song-')===0)history.replaceState(null,'',location.pathname+location.search)});
  dlg.addEventListener('click',function(e){if(e.target===dlg)closeDetail()});
  document.getElementById('d-close').addEventListener('click',closeDetail);
  document.getElementById('d-sp').addEventListener('click',function(){play(cur,false);closeDetail()});
  document.getElementById('d-yt').addEventListener('click',function(){play(cur,true);closeDetail()});
  document.getElementById('d-share').addEventListener('click',function(){
    var url=cur.dataset.slug?location.origin+'/s/'+cur.dataset.slug+'/':location.origin+location.pathname+'#song-'+key(cur),t=cur.querySelector('h3').textContent+' – ABard';
    if(navigator.share){navigator.share({title:t,url:url}).catch(function(){})}
    else if(navigator.clipboard){navigator.clipboard.writeText(url).then(function(){var b=document.getElementById('d-share');b.textContent=T('copied');setTimeout(function(){b.textContent=T('share')},2000)})}
  });
  if(location.hash.indexOf('#song-')===0){var k0=location.hash.slice(6),a0=document.querySelector('.rel[data-id="'+k0+'"],.rel[data-yt="'+k0+'"],.rel[data-key="'+k0+'"]:not([hidden])');if(a0)openDetail(a0,true)}
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
    document.querySelectorAll('.rel[data-at]').forEach(function(a){
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
      document.querySelectorAll('.rel[data-at]').forEach(function(a){if(Date.now()>=Date.parse(a.dataset.at))a.hidden=false});
      if(Date.now()-t>SHOW_DAYS*86400000)box.hidden=true;
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
  // Sprache gewechselt: offenen Songdialog neu beschriften
  document.addEventListener('abard:lang',function(){if(dlg.open&&cur)openDetail(cur,true);var v=document.getElementById('vin-p');if(v&&vin.classList.contains('show')&&!nextT)v.textContent=T('vin.now')});
  // Video-Liste: eigene Playlist aus allen YouTube-Songs (neueste zuerst) statt der Kanal-Uploads
  (function(){
    var f=document.getElementById('ytlist');if(!f)return;
    var ids=[],seen={};
    document.querySelectorAll('.rel[data-yt]:not(.big)').forEach(function(r){var v=r.dataset.yt;if(v&&!seen[v]){seen[v]=1;ids.push(v)}});
    if(!ids.length)return;
    f.src='https://www.youtube.com/embed/'+ids[0]+'?rel=0&playsinline=1&playlist='+ids.slice(1,50).join(',')+'&origin='+encodeURIComponent(location.origin);
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
