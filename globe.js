// Weltkugel-Overlay: zeigt alle Länder, in denen ABard gehört wurde (nur Stufen 1-5, keine Zahlen).
// Öffnet als <dialog> – laufende Musik (Spotify/YouTube-Player) wird dabei nicht angetastet.
// Karte und Bibliothek werden erst beim ersten Klick geladen.
(function(){
  var btn=document.getElementById('globe-btn'),dlg=document.getElementById('globe');
  if(!btn||!dlg||!dlg.showModal)return;
  var S={
    en:{eye:'Listeners worldwide',h:function(n){return 'Heard in '+n+' countries'},hint:'Drag to spin · tap a light',load:'Loading the world…'},
    de:{eye:'Hörer weltweit',h:function(n){return 'Gehört in '+n+' Ländern'},hint:'Ziehen zum Drehen · Licht antippen',load:'Die Welt wird geladen…'}
  };
  function lang(){return (window.ABARD_I18N&&window.ABARD_I18N.lang())||'en'}
  function txt(){
    var s=S[lang()]||S.en,n=window.ABARD_GLOBE?Object.keys(window.ABARD_GLOBE.levels).length:'';
    dlg.querySelector('.g-eye').textContent=s.eye;
    dlg.querySelector('.g-h').textContent=n?s.h(n):s.load;
    dlg.querySelector('.g-hint').textContent=s.hint;
    try{names=new Intl.DisplayNames([lang()],{type:'region'})}catch(e){names=null}
  }
  var names=null;
  function nameOf(c){try{return names?names.of(c):c}catch(e){return c}}
  document.addEventListener('abard:lang',function(){if(dlg.open)txt()});

  function load(src){return new Promise(function(ok,no){var s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=no;document.head.appendChild(s)})}
  var ready=null;
  btn.addEventListener('click',function(){
    txt();dlg.showModal();
    ready=ready||load('globe-lib.js?v=1').then(function(){return load('globe-data.js?v=1')}).then(init);
    ready.then(function(){txt();start()});
  });
  dlg.querySelector('.g-close').addEventListener('click',function(){dlg.close()});
  dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close()});

  var cv,ctx,proj,path,feats,lit=[],dpr=1,W=0,rot=[-10,-18],spin=true,last=0,dragAt=0,hover=null,stars=[],tip;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ALPHA=[0,.42,.56,.7,.85,1],SOD='216,162,63';

  function init(){
    var G=window.ABARD_GLOBE;
    cv=dlg.querySelector('canvas');ctx=cv.getContext('2d');tip=dlg.querySelector('.g-tip');
    feats=G.countries.map(function(f){return{type:'Feature',id:f.c,geometry:f.g,lv:G.levels[f.c]||0}});
    feats.forEach(function(f){if(f.lv)lit.push({c:f.id,p:d3.geoCentroid(f),lv:f.lv,ph:Math.random()*6.3,f:f})});
    Object.keys(G.dots).forEach(function(c){lit.push({c:c,p:G.dots[c],lv:G.levels[c]||1,ph:Math.random()*6.3})});
    for(var i=0;i<140;i++)stars.push([Math.random(),Math.random(),Math.random()*.9+.2,Math.random()*6.3]);
    proj=d3.geoOrthographic().clipAngle(90).precision(.4);
    path=d3.geoPath(proj,ctx);
    size();addEventListener('resize',size);
    var down=null;
    cv.addEventListener('pointerdown',function(e){down={x:e.clientX,y:e.clientY,r:rot.slice()};cv.setPointerCapture(e.pointerId);spin=false});
    cv.addEventListener('pointermove',function(e){
      if(down){var k=70/ (W/2);rot=[down.r[0]+(e.clientX-down.x)*k*.9,Math.max(-60,Math.min(60,down.r[1]-(e.clientY-down.y)*k*.9))];}
      pick(e);
    });
    function up(e){if(!down)return;var moved=Math.abs(e.clientX-down.x)+Math.abs(e.clientY-down.y);down=null;dragAt=performance.now();if(moved<6)pick(e,true)}
    cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
    cv.addEventListener('pointerleave',function(){if(!down){hover=null;tip.hidden=true}});
  }
  function size(){
    var box=cv.parentNode.getBoundingClientRect();W=Math.min(box.width,620);dpr=Math.min(devicePixelRatio||1,2);
    cv.width=W*dpr;cv.height=W*dpr;cv.style.width=W+'px';cv.style.height=W+'px';
    proj.translate([W/2,W/2]).scale(W/2*.82);
  }
  function pick(e,tap){
    var b=cv.getBoundingClientRect(),x=e.clientX-b.left,y=e.clientY-b.top,ll=proj.invert([x,y]),hit=null;
    if(ll&&d3.geoDistance(ll,[-rot[0],-rot[1]])<Math.PI/2){
      for(var i=0;i<feats.length;i++){if(feats[i].lv&&d3.geoContains(feats[i],ll)){hit=feats[i].id;break}}
      if(!hit)lit.forEach(function(l){if(!l.f){var q=proj(l.p);if(q&&Math.hypot(q[0]-x,q[1]-y)<12)hit=l.c}});
    }
    hover=hit;
    if(hit){tip.textContent=nameOf(hit);tip.hidden=false;tip.style.left=x+'px';tip.style.top=y+'px'}
    else tip.hidden=true;
    if(tap&&hit){spin=false;dragAt=performance.now()}
  }
  function start(){last=performance.now();requestAnimationFrame(frame)}
  function frame(t){
    if(!dlg.open)return;
    var dt=Math.min(60,t-last);last=t;
    if(!spin&&!reduce&&t-dragAt>3500&&!hover)spin=true;
    if(spin&&!reduce)rot[0]+=dt*.006;
    draw(t);requestAnimationFrame(frame);
  }
  function draw(t){
    var r=proj.scale(),c=W/2;
    proj.rotate([rot[0],rot[1]]);
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,W);
    // Sterne
    stars.forEach(function(s){var a=.15+.25*Math.sin(t*.0012+s[3])*.5+.12;ctx.fillStyle='rgba(233,230,223,'+a.toFixed(3)+')';ctx.fillRect(s[0]*W,s[1]*W,s[2],s[2])});
    // Atmosphäre
    var g=ctx.createRadialGradient(c,c,r*.96,c,c,r*1.18);g.addColorStop(0,'rgba('+SOD+',.22)');g.addColorStop(1,'rgba('+SOD+',0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(c,c,r*1.18,0,6.3);ctx.fill();
    // Kugel
    var sg=ctx.createRadialGradient(c-r*.35,c-r*.4,r*.1,c,c,r);sg.addColorStop(0,'#1d2026');sg.addColorStop(1,'#0a0b0d');
    ctx.fillStyle=sg;ctx.beginPath();path({type:'Sphere'});ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.035)';ctx.lineWidth=.6;ctx.beginPath();path(d3.geoGraticule10());ctx.stroke();
    // Länder
    ctx.lineWidth=.5;
    feats.forEach(function(f){
      ctx.beginPath();path(f);
      if(f.lv){var a=ALPHA[f.lv]*(f.id===hover?1:.88);ctx.fillStyle='rgba('+SOD+','+a+')';ctx.shadowColor='rgba('+SOD+',.6)';ctx.shadowBlur=f.id===hover?18:6+f.lv*2;ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='rgba(13,14,16,.55)'}
      else{ctx.fillStyle='#1a1c21';ctx.fill();ctx.strokeStyle='#2a2d33'}
      ctx.stroke();
    });
    // Lichter (Natriumdampf-Lampen) auf jedem Land mit Hörern
    var ctr=[-rot[0],-rot[1]];
    lit.forEach(function(l){
      var d=d3.geoDistance(l.p,ctr);if(d>Math.PI/2-.05)return;
      var q=proj(l.p),edge=Math.cos(d),pul=reduce?1:.75+.25*Math.sin(t*.003+l.ph),rad=(2+l.lv*1.6)*pul;
      var lg=ctx.createRadialGradient(q[0],q[1],0,q[0],q[1],rad*3.2);
      lg.addColorStop(0,'rgba(255,236,190,'+(.95*edge)+')');lg.addColorStop(.25,'rgba('+SOD+','+(.7*edge)+')');lg.addColorStop(1,'rgba('+SOD+',0)');
      ctx.fillStyle=lg;ctx.beginPath();ctx.arc(q[0],q[1],rad*3.2,0,6.3);ctx.fill();
    });
    // Rand
    ctx.strokeStyle='rgba('+SOD+',.35)';ctx.lineWidth=1;ctx.beginPath();path({type:'Sphere'});ctx.stroke();
  }
})();
