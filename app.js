(function(){
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
  document.querySelectorAll('.rel[data-id],.rel[data-yt]').forEach(function(a){
    a.addEventListener('click',function(e){
      if(e.metaKey||e.ctrlKey||e.shiftKey)return;
      e.preventDefault();
      if(!e.target.closest('.cover')){openDetail(a);return}
      play(a);
    });
  });
  var spAPI=null,spCtl=null,spWant=null,cur2=null,noteShown=false;
  // Mini-Plattenspieler unten rechts
  var vin=document.getElementById('vin');
  function vinSpin(on){vin.classList.toggle('spin',!!on)}
  function vinShow(a,assumePlaying){
    var im=a.querySelector('.cover img'),u=(im.getAttribute('srcset')||'').split(',').pop().trim().split(' ')[0]||im.getAttribute('src');
    document.getElementById('vin-img').src=u;document.getElementById('vin-lbl').src=u;
    document.getElementById('vin-t').textContent=a.querySelector('h3').textContent;
    vin.classList.add('show');vin.tabIndex=0;vinSpin(assumePlaying);
    requestAnimationFrame(vinPos);
  }
  function vinHide(){vin.classList.remove('show','spin');vin.tabIndex=-1}
  function vinPos(){var p=document.getElementById('player');if(!p.hidden)document.documentElement.style.setProperty('--pbar',p.offsetHeight+'px')}
  if(window.ResizeObserver)new ResizeObserver(vinPos).observe(document.getElementById('player'));
  vin.addEventListener('click',function(){if(cur2)openDetail(cur2)});
  var spwrap=document.getElementById('spwrap'),pnote=document.getElementById('pnote');
  window.onSpotifyIframeApiReady=function(API){spAPI=API};
  function onUpd(e){
    var d=e&&e.data;if(d&&typeof d.isPaused==='boolean')vinSpin(!d.isPaused);if(!d||noteShown)return;
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
      cur2=a;
      document.querySelectorAll('.rel.active').forEach(function(x){x.classList.remove('active')});
      a.classList.add('active');
      var useYt=a.dataset.yt&&(forceYt===true||(forceYt!==false&&src==='youtube')||!a.dataset.id);
      player.classList.toggle('yt',!!useYt);document.body.classList.toggle('pyt',!!useYt);
      pnote.hidden=true;document.body.classList.remove('pnote-on');noteShown=false;
      if(useYt){
        if(spCtl){try{spCtl.pause()}catch(err){}}
        spwrap.hidden=true;frame.hidden=false;frame.title='YouTube-Player';
        frame.src='https://www.youtube.com/embed/'+a.dataset.yt+'?autoplay=1&rel=0&playsinline=1&origin='+encodeURIComponent(location.origin);
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
    player.hidden=true;pnote.hidden=true;document.body.classList.remove('playing','pnote-on');vinHide();
    document.querySelectorAll('.rel.active').forEach(function(x){x.classList.remove('active')});
  });

  var dlg=document.getElementById('detail'),cur=null;
  var M=['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
  function key(a){return a.dataset.id||a.dataset.yt}
  function esc(t){var d=document.createElement('div');d.textContent=t;return d.innerHTML}
  function openDetail(a,noHash){
    cur=a;var k=key(a),info=(window.SONGINFO||{})[k]||{},d=a.dataset.date||'';
    document.getElementById('d-img').src=a.querySelector('img').currentSrc||a.querySelector('img').src;
    document.getElementById('d-title').textContent=a.querySelector('h3').textContent;
    var meta=[];if(a.dataset.genre)meta.push(a.dataset.genre);if(d)meta.push(+d.slice(8,10)+'. '+M[+d.slice(5,7)-1]+' '+d.slice(0,4));
    var pl=[];if(a.dataset.sp)pl.push(Number(a.dataset.sp).toLocaleString('de-CH').replace(/'/g,'’')+' Spotify');if(a.dataset.ytv)pl.push(Number(a.dataset.ytv).toLocaleString('de-CH').replace(/'/g,'’')+' YouTube');
    if(a.querySelector('.streams'))meta.push(pl.join(' · '));
    document.getElementById('d-meta').textContent=meta.join(' · ');
    document.getElementById('d-sp').hidden=!a.dataset.id;document.getElementById('d-yt').hidden=!a.dataset.yt;
    var l=document.getElementById('d-links');l.innerHTML='';
    if(a.dataset.id)l.innerHTML+='<a href="https://open.spotify.com/album/'+a.dataset.id+'" target="_blank" rel="noopener">In Spotify öffnen ↗</a>';
    if(a.dataset.yt||a.dataset.ytx)l.innerHTML+='<a href="https://www.youtube.com/watch?v='+(a.dataset.yt||a.dataset.ytx)+'" target="_blank" rel="noopener">In YouTube öffnen ↗</a>';
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
    else if(navigator.clipboard){navigator.clipboard.writeText(url).then(function(){var b=document.getElementById('d-share');b.textContent='Link kopiert ✓';setTimeout(function(){b.textContent='Teilen'},2000)})}
  });
  if(location.hash.indexOf('#song-')===0){var k0=location.hash.slice(6),a0=document.querySelector('.rel[data-id="'+k0+'"],.rel[data-yt="'+k0+'"]');if(a0)openDetail(a0,true)}
  (function(){
    var t=Date.parse('2026-10-08T13:00:00+02:00'),pad=function(n){return String(n).padStart(2,'0')};
    function tick(){
      var s=Math.floor((t-Date.now())/1000);
      if(s<=0){document.getElementById('cd').hidden=true;document.getElementById('cd-out').hidden=false;return}
      document.getElementById('cd-d').textContent=Math.floor(s/86400);
      document.getElementById('cd-h').textContent=pad(Math.floor(s%86400/3600));
      document.getElementById('cd-m').textContent=pad(Math.floor(s%3600/60));
      document.getElementById('cd-s').textContent=pad(s%60);
      setTimeout(tick,1000);
    }
    tick();
  })();
  // Video-Liste: eigene Playlist aus allen YouTube-Songs (neueste zuerst) statt der Kanal-Uploads
  (function(){
    var f=document.getElementById('ytlist');if(!f)return;
    var ids=[],seen={};
    document.querySelectorAll('.rel[data-yt]:not(.big)').forEach(function(r){var v=r.dataset.yt;if(v&&!seen[v]){seen[v]=1;ids.push(v)}});
    if(!ids.length)return;
    f.src='https://www.youtube.com/embed/'+ids[0]+'?rel=0&playsinline=1&playlist='+ids.slice(1,50).join(',')+'&origin='+encodeURIComponent(location.origin);
  })();
  document.getElementById('y').textContent=new Date().getFullYear();
})();
