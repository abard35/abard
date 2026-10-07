var S=[{"t": "Rising", "g": "Alternative Metal", "i": "https://i.scdn.co/image/ab67616d00001e02e32ceaa2429fadd1dd482f13"}, {"t": "Aftermath", "g": "Power Ballad", "i": "https://i.scdn.co/image/ab67616d00001e029cd9ca6a788798a5abd65561"}, {"t": "Still Burning", "g": "80s Power Ballad", "i": "https://i.scdn.co/image/ab67616d00001e02b9dd394b7b5d72fec0e4292b"}, {"t": "Room 404", "g": "Heavy Blues Rock", "i": "/room404.jpg?v=2"}, {"t": "The Dash Between The Years", "g": "Power Ballad", "i": "https://i.scdn.co/image/ab67616d00001e027f1f9a236b605972e7c5ed57"}, {"t": "Echoes Of The Silver Valley", "g": "Symphonic Rock", "i": "https://i.scdn.co/image/ab67616d00001e0246b475564885696bafed7bef"}, {"t": "Fragile Horizons", "g": "Symphonic Rock", "i": "https://i.scdn.co/image/ab67616d00001e02d7644c4fb0b6b4445ef64c56"}, {"t": "Lullaby For The Stars", "g": "Cinematic Ballad", "i": "https://i.scdn.co/image/ab67616d00001e02883402a5907de3786a099e13"}, {"t": "Golden Venom", "g": "Cinematic Rock Ballad", "i": "https://i.scdn.co/image/ab67616d00001e02f052df38dda813d635e07b64"}, {"t": "Shadows of my Yesterday", "g": "Power Ballad", "i": "https://i.scdn.co/image/ab67616d00001e02f8cb145cfb9931269f5a6b9e"}, {"t": "Passion", "g": "Power Metal", "i": "https://i.scdn.co/image/ab67616d00001e02449b29faaff08cc7a49cc9a8"}, {"t": "Toxic Devotion", "g": "Rock Ballad", "i": "https://i.scdn.co/image/ab67616d00001e02a2a1c75a94041578c2083ed7"}, {"t": "Chasing Illusions", "g": "Slow Dark Rock", "i": "https://i.scdn.co/image/ab67616d00001e02d95a957f65aa59fe1a7dae78"}, {"t": "When I Saw You", "g": "Rock Ballad", "i": "https://i.scdn.co/image/ab67616d00001e0218e85f9ff96c8bd8ff2a5983"}, {"t": "Fading Photographs", "g": "Grunge Ballad", "i": "https://i.scdn.co/image/ab67616d00001e02fe094ba8bf9e98fbca34e79f"}, {"t": "The Quiet Space", "g": "Power Ballad", "i": "https://i.scdn.co/image/ab67616d00001e02138c2a355411488bf068d920"}, {"t": "Wings of Wax", "g": "Melancholic Power Ballad", "i": "https://i.scdn.co/image/ab67616d00001e02a4e80c20a77168891c725dda"}, {"t": "MOM", "g": "Rock Ballad", "i": "https://i.scdn.co/image/ab67616d00001e02d6030d0a2d2197dcc3567c88"}, {"t": "Könige von Nichts", "g": "Dark Techno", "i": "https://i.scdn.co/image/ab67616d00001e02ea55c808a665194391488f35"}, {"t": "Dreaming (Your Own Life)", "g": "Rock Ballad", "i": "https://i.scdn.co/image/ab67616d00001e02486f5756910d1966b939ecad"}, {"t": "Symphony of Life", "g": "Epic Power Ballad", "i": "https://i.scdn.co/image/ab67616d00001e024f9c6fe391281894dd55112e"}, {"t": "Master Of Our Time", "g": "Power Ballad", "i": "https://i.scdn.co/image/ab67616d00001e02b3c4e738a5af801a504cd785"}, {"t": "Once A Lifetime", "g": "Power Ballad", "i": "https://i.scdn.co/image/ab67616d00001e02f69b50c962544074490b6fb6"}, {"t": "You", "g": "Power Ballad", "i": "https://i.scdn.co/image/ab67616d00001e02cfa7ae86e2686e4c915d30f4"}, {"t": "When I Have To Leave", "g": "Power Ballad", "i": "https://i.scdn.co/image/ab67616d00001e0217acb51f1456f3b1a04ea408"}, {"t": "She's Gone", "g": "80s Power Ballad", "i": "https://i.scdn.co/image/ab67616d00001e026fe2b5d2a1a4fc96c1c759e9"}, {"t": "Forever Drawn To You", "g": "Power Ballad", "i": "https://i.scdn.co/image/ab67616d00001e021d861e5b10bc32e048a39d3d"}, {"t": "The Flame That Is Ours", "g": "Power Ballad", "i": "https://i.scdn.co/image/ab67616d00001e02d35435c551eaea4e1b737f34"}];
// Mockups Kopfbereich – jede Variante baut sich aus S (Titel, Genre, Cover) auf
var LOGO='/apple-touch-icon.png';
function shuf(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function img(src,cls){var i=new Image();i.src=src;i.alt='';i.decoding='async';if(cls)i.className=cls;if(src===LOGO)i.classList.add('logo');return i}
function hero(sec,stageCls){
  var h=document.createElement('div');h.className='hero';
  var st=document.createElement('div');st.className='stage '+stageCls;st.setAttribute('aria-hidden','true');
  var tx=document.createElement('div');
  tx.innerHTML='<p class="eyebrow">Official Artist Site</p><h3>ABard</h3><ul class="genres"><li>Hard Rock</li><li>Metal</li><li>Power Ballads</li></ul><p class="lede">ABard is a sound, not a backstory. Rooted in 80s hard rock, sharpened by industrial steel and carried by big, cinematic emotion. Every song tells its own story – press play and decide for yourself.</p>';
  h.appendChild(st);h.appendChild(tx);sec.appendChild(h);return st;
}
var B={
  flow:function(st){
    var L=shuf(S),n=L.length,cur=0,its=[];
    L.forEach(function(s){var d=document.createElement('div');d.className='it';d.appendChild(img(s.i));var r=document.createElement('div');r.className='refl';r.appendChild(img(s.i));d.appendChild(r);st.appendChild(d);its.push(d)});
    var cap=document.createElement('div');cap.className='cap';st.appendChild(cap);
    function lay(){its.forEach(function(d,k){var o=((k-cur)%n+n)%n;if(o>n/2)o-=n;var a=Math.abs(o);
      d.style.transform=o===0?'translateZ(60px)':'translateX('+(o*22+(o>0?14:-14))+'%) translateZ(-'+(a*40)+'px) rotateY('+(o>0?-55:55)+'deg)';
      d.style.zIndex=10-a;d.style.opacity=a>3?0:1;d.style.filter=o===0?'none':'brightness(.6)'});
      cap.innerHTML='<b>'+L[cur].t+'</b> · '+L[cur].g}
    lay();setInterval(function(){cur=(cur+1)%n;lay()},3000);
  },
  flip:function(st){
    var pool=shuf(S.map(function(s){return s.i}).concat([LOGO])),used=pool.slice(0,9),rest=pool.slice(9),ts=[];
    used.forEach(function(u){var t=document.createElement('div');t.className='t';t.appendChild(img(u,'f'));t.appendChild(img(u,'b'));st.appendChild(t);ts.push(t)});
    var last=-1;setInterval(function(){var k;do{k=Math.floor(Math.random()*ts.length)}while(k===last);last=k;
      var t=ts[k],on=t.classList.contains('on'),hidden=on?t.querySelector('.f'):t.querySelector('.b'),shown=on?t.querySelector('.b'):t.querySelector('.f');
      var nu=rest.shift();rest.push(shown.getAttribute('src'));hidden.src=nu;hidden.classList.toggle('logo',nu===LOGO);t.classList.toggle('on')},1100);
  },
  cine:function(st){
    var L=shuf(S),cur=0,sl=[];
    L.forEach(function(s,k){var d=document.createElement('div');d.className='sl';var i=img(s.i.replace('00001e02','0000b273'));d.appendChild(i);st.appendChild(d);sl.push(d)});
    var ti=document.createElement('div');ti.className='ti';ti.innerHTML='<small></small><b></b>';st.appendChild(ti);
    var bar=document.createElement('i');bar.className='bar';st.appendChild(bar);
    var O=['30% 30%','70% 30%','50% 70%','30% 70%','70% 60%'];
    function show(){sl.forEach(function(d,k){d.classList.toggle('on',k===cur)});sl[cur].style.setProperty('--o',O[cur%O.length]);
      ti.querySelector('small').textContent=L[cur].g;ti.querySelector('b').textContent=L[cur].t;
      bar.classList.remove('run');void bar.offsetWidth;bar.classList.add('run')}
    show();setInterval(function(){cur=(cur+1)%L.length;show()},6000);
  },
  stack:function(st){
    var L=shuf(S),cs=[],next=0;
    function card(s){var c=document.createElement('div');c.className='c';c.appendChild(img(s.i));c.dataset.r=(Math.random()*16-8).toFixed(1);return c}
    for(var k=0;k<5;k++){var c=card(L[next++]);cs.push(c)}
    function lay(){cs.forEach(function(c,k){c.style.zIndex=10-k;c.style.transform='rotate('+c.dataset.r+'deg) translateY('+(k*-4)+'px)'})}
    cs.slice().reverse().forEach(function(c){st.appendChild(c)});lay();
    setInterval(function(){var top=cs.shift();top.classList.add('out');
      setTimeout(function(){top.remove()},950);
      var c=card(L[next%L.length]);next++;st.insertBefore(c,st.firstChild);cs.push(c);lay()},3000);
  },
  spot:function(st){
    var ims=[],L=shuf(shuf(S).slice(0,24).concat([{t:"ABard",g:"Official",i:LOGO}])).slice(0,24);
    if(!L.some(function(s){return s.i===LOGO}))L[7]={t:'ABard',g:'Official',i:LOGO};
    L.forEach(function(s){var i=img(s.i);st.appendChild(i);ims.push(i)});
    var lbl=document.createElement('div');lbl.className='lbl';st.appendChild(lbl);
    var last=-1;function go(){ims.forEach(function(i){i.classList.remove('lit')});var k;do{k=Math.floor(Math.random()*ims.length)}while(k===last);last=k;
      // Randkacheln nach innen vergrössern
      var c=k%6,r=Math.floor(k/6);ims[k].style.transformOrigin=(c===0?'0%':c===5?'100%':'50%')+' '+(r===0?'0%':r===3?'100%':'50%');
      ims[k].classList.add('lit');lbl.innerHTML='<b>'+L[k].t+'</b> · '+L[k].g}
    go();setInterval(go,2200);
  },
  belts:function(st){
    var t=document.createElement('div');t.className='tilt';st.appendChild(t);
    [[46,false],[60,true],[52,false]].forEach(function(cfg,k){
      var r=document.createElement('div');r.className='row'+(cfg[1]?' rev':'');r.style.setProperty('--d',cfg[0]+'s');
      var L=shuf(S).slice(0,10);if(k===1)L.splice(4,0,{i:LOGO});
      L.concat(L).forEach(function(s){r.appendChild(img(s.i))});t.appendChild(r)});
  },
  wall:function(st){
    st.style.cssText='display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;-webkit-mask-image:linear-gradient(transparent,#000 14%,#000 86%,transparent);mask-image:linear-gradient(transparent,#000 14%,#000 86%,transparent)';
    var L=shuf(S),cols=[[],[],[]];L.forEach(function(s,n){cols[n%3].push(s.i)});var lc=Math.floor(Math.random()*3);cols[lc].splice(Math.floor(Math.random()*cols[lc].length),0,LOGO);
    [46,58,40].forEach(function(d,c){var col=document.createElement('div');col.style.cssText='display:flex;flex-direction:column;gap:10px;animation:'+(c===1?'wd':'wu')+' '+d+'s linear infinite';
      cols[c].concat(cols[c]).forEach(function(u){var i=img(u,'cv');i.style.aspectRatio='1';i.style.height='auto';col.appendChild(i)});st.appendChild(col)});
  }
};
var ks=document.createElement('style');ks.textContent='@keyframes wu{to{transform:translateY(calc(-50% - 5px))}}@keyframes wd{from{transform:translateY(calc(-50% - 5px))}to{transform:translateY(0)}}';document.head.appendChild(ks);
document.querySelectorAll('[data-v]').forEach(function(sec){var v=sec.dataset.v;B[v](hero(sec,v))});
