// Kopfbereich-Animation. Bei jedem Besuch wird EINE von vier Varianten zufällig gewählt
// und bleibt für die ganze Sitzung (Tab) gleich: Cover-Wand, Kachel-Dreher, Kinoplakat, Spotlight.
// Cover, Titel und Genres kommen automatisch aus den Kacheln der Release-Liste.
(function(){
  var st=document.getElementById('wall');if(!st)return;
  var LOGO='apple-touch-icon.png';
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var narrow=window.matchMedia&&matchMedia('(max-width:760px)').matches;

  // Songs aus den Kacheln einsammeln (ohne Doppelte)
  var seen={},S=[];
  document.querySelectorAll('.rel').forEach(function(a){
    var im=a.querySelector('.cover img');if(!im)return;
    var src=im.getAttribute('src');if(!src||seen[src])return;seen[src]=1;
    var big=((im.getAttribute('srcset')||'').split(',').pop().trim().split(' ')[0])||src;
    var o={src:src,big:big,t:(a.querySelector('h3')||{}).textContent||'',g:a.dataset.genre||''};
    // Noch nicht erschienen: Erscheinungsdatum in Orange aufs Cover schreiben
    var at=Date.parse(a.dataset.at||'');if(!isNaN(at)&&Date.now()<at)o.at=at;
    S.push(o);
  });
  if(S.length<6){st.hidden=true;return}
  function badge(s){
    return new Promise(function(done){
      var im=new Image();im.onload=function(){
        try{
          var W=600,c=document.createElement('canvas');c.width=c.height=W;var x=c.getContext('2d');
          x.drawImage(im,0,0,W,W);
          var Ix=window.ABARD_I18N,de=Ix&&Ix.lang&&Ix.lang()==='de',d=new Date(s.at);
          var txt=de?'Ab '+d.toLocaleDateString('de-CH',{day:'numeric',month:'long',timeZone:'Europe/Zurich'}):'Out '+d.toLocaleDateString('en-US',{month:'long',day:'numeric',timeZone:'Europe/Zurich'});
          txt=txt.toUpperCase();
          var g=x.createLinearGradient(0,W*.70,0,W);g.addColorStop(0,'rgba(13,14,16,0)');g.addColorStop(.45,'rgba(13,14,16,.82)');g.addColorStop(1,'rgba(13,14,16,.92)');
          x.fillStyle=g;x.fillRect(0,W*.70,W,W*.30);
          var fs=Math.round(W*.085);x.font='700 '+fs+'px "Big Shoulders Display","Arial Narrow",Impact,sans-serif';
          while(x.measureText(txt).width>W*.86&&fs>20){fs-=2;x.font='700 '+fs+'px "Big Shoulders Display","Arial Narrow",Impact,sans-serif'}
          x.textAlign='center';x.textBaseline='alphabetic';x.fillStyle='#d8a23f';
          if('letterSpacing' in x)x.letterSpacing=Math.round(fs*.08)+'px';
          x.fillText(txt,W/2,W*.93);
          s.src=s.big=c.toDataURL('image/jpeg',.88);
        }catch(e){}
        done();
      };
      im.onerror=function(){done()};im.src=s.src;
    });
  }
  var pend=S.filter(function(s){return s.at}),waits=[];
  if(pend.length){
    // Schrift der Seite abwarten (max. 1 s), damit das Datum im Seitenstil erscheint
    var fontReady=Promise.race([document.fonts&&document.fonts.load?document.fonts.load('700 40px "Big Shoulders Display"').catch(function(){}):0,new Promise(function(r){setTimeout(r,1000)})]);
    waits=pend.map(function(s){return fontReady.then(function(){return badge(s)})});
  }

  function shuf(a){a=a.slice();for(var k=a.length-1;k>0;k--){var j=Math.floor(Math.random()*(k+1)),t=a[k];a[k]=a[j];a[j]=t}return a}
  function img(src,cls){var i=document.createElement('img');i.src=src;i.alt='';i.decoding='async';if(cls)i.className=cls;if(src===LOGO)i.classList.add('logo');return i}
  function esc(t){var d=document.createElement('div');d.textContent=t;return d.innerHTML}
  function every(ms,fn){if(!reduce)setInterval(function(){if(!document.hidden)fn()},ms)}

  var V={
    wall:function(){
      st.classList.add('wall');
      var srcs=shuf(S.map(function(s){return s.src})),cols=[[],[],[]];
      srcs.forEach(function(s,n){cols[n%3].push(s)});
      // Logo nur EINMAL in der ganzen Wand
      var lc=Math.floor(Math.random()*3);cols[lc].splice(Math.floor(Math.random()*(cols[lc].length+1)),0,LOGO);
      [46,58,40].forEach(function(d,c){
        var col=document.createElement('div');col.className='col'+(c===1?' down':'');col.style.setProperty('--dur',d+'s');
        cols[c].concat(cols[c]).forEach(function(s){var i=img(s);i.width=300;i.height=300;col.appendChild(i)});
        st.appendChild(col);
      });
    },
    flip:function(){
      st.classList.add('flip');
      var n=narrow?12:9;if(narrow)st.style.gridTemplateColumns='repeat(4,1fr)';
      var pool=shuf(S.map(function(s){return s.src}).concat([LOGO])),rest=pool.slice(n),ts=[];
      pool.slice(0,n).forEach(function(u){var t=document.createElement('div');t.className='t';t.appendChild(img(u,'f'));t.appendChild(img(rest[0]||u,'b'));st.appendChild(t);ts.push(t)});
      var last=-1;
      every(1100,function(){
        var k;do{k=Math.floor(Math.random()*ts.length)}while(k===last&&ts.length>1);last=k;
        var t=ts[k],on=t.classList.contains('on'),back=t.querySelector(on?'.f':'.b'),front=t.querySelector(on?'.b':'.f');
        var nu=rest.shift();rest.push(front.getAttribute('src'));
        back.src=nu;back.classList.toggle('logo',nu===LOGO);
        // erst drehen, wenn das neue Bild geladen ist
        if(back.complete)t.classList.toggle('on');else back.onload=function(){back.onload=null;t.classList.toggle('on')};
      });
    },
    cine:function(){
      st.classList.add('cine');
      var L=shuf(S),cur=0,sl=[],O=['30% 30%','70% 30%','50% 70%','30% 70%','70% 60%'];
      var ti=document.createElement('div');ti.className='ti';ti.innerHTML='<small></small><b></b>';
      var bar=document.createElement('i');bar.className='cbar';
      function slide(k){
        if(sl[k])return sl[k];
        var d=document.createElement('div');d.className='sl';d.appendChild(img(L[k].big));st.insertBefore(d,ti);sl[k]=d;return d;
      }
      st.appendChild(ti);st.appendChild(bar);
      function show(){
        var d=slide(cur);slide((cur+1)%L.length); // nächstes Bild schon vorladen
        sl.forEach(function(x){if(x)x.classList.toggle('on',x===d)});
        d.style.setProperty('--o',O[cur%O.length]);
        ti.querySelector('small').textContent=L[cur].g;ti.querySelector('b').textContent=L[cur].t;
        bar.classList.remove('run');void bar.offsetWidth;if(!reduce)bar.classList.add('run');
      }
      show();every(6000,function(){cur=(cur+1)%L.length;show()});
    },
    spot:function(){
      st.classList.add('spot');
      var n=narrow?24:36,L=shuf(S).slice(0,n-1);
      L.splice(Math.floor(Math.random()*(L.length+1)),0,{src:LOGO,t:'ABard',g:'Official Artist Site'});
      while(L.length<n)L.push(L[L.length%S.length]);
      var ims=L.map(function(s){var i=img(s.src);st.appendChild(i);return i});
      var lbl=document.createElement('div');lbl.className='lbl';st.appendChild(lbl);
      var cols=6,rows=Math.ceil(n/cols),last=-1;
      function go(){
        ims.forEach(function(i){i.classList.remove('lit')});
        var k;do{k=Math.floor(Math.random()*ims.length)}while(k===last);last=k;
        var c=k%cols,r=Math.floor(k/cols);
        // Randkacheln wachsen nach innen, damit nichts abgeschnitten wird
        ims[k].style.transformOrigin=(c===0?'0%':c===cols-1?'100%':'50%')+' '+(r===0?'0%':r===rows-1?'100%':'50%');
        ims[k].classList.add('lit');lbl.innerHTML='<b>'+esc(L[k].t)+'</b> · '+esc(L[k].g);
      }
      go();every(2200,go);
    }
  };

  // Variante für diese Sitzung: einmal zufällig wählen, dann beibehalten
  var keys=['wall','flip','cine','spot'],v=null;
  try{v=sessionStorage.getItem('abard-hero')}catch(e){}
  if(keys.indexOf(v)<0){v=keys[Math.floor(Math.random()*keys.length)];try{sessionStorage.setItem('abard-hero',v)}catch(e){}}
  // Zum Testen: #hero-wall, #hero-flip, #hero-cine, #hero-spot erzwingt eine Variante
  var h=location.hash.match(/^#hero-(wall|flip|cine|spot)$/);if(h)v=h[1];
  function start(){V[v]();st.dataset.variant=v}
  if(waits.length)Promise.race([Promise.all(waits),new Promise(function(r){setTimeout(r,1500)})]).then(start);else start();
})();
