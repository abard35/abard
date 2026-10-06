// Cover-Wand im Kopfbereich: nimmt automatisch alle Cover aus der Release-Liste
(function(){
  var wall=document.getElementById('wall'); if(!wall) return;
  var seen={}, srcs=[];
  document.querySelectorAll('.rel .cover img').forEach(function(i){
    var s=i.getAttribute('src'); if(s && !seen[s]){seen[s]=1; srcs.push(s);}
  });
  if(srcs.length<3){wall.hidden=true; return;}
  for(var k=srcs.length-1;k>0;k--){var j=Math.floor(Math.random()*(k+1)); var t=srcs[k]; srcs[k]=srcs[j]; srcs[j]=t;}
  var cols=[[],[],[]]; srcs.forEach(function(s,n){cols[n%3].push(s);});
  // Logo ab und zu: je einmal in der linken und rechten Spalte, versetzt
  var LOGO='apple-touch-icon.png';
  cols[0].splice(Math.floor(cols[0].length/3),0,LOGO);
  cols[2].splice(Math.floor(cols[2].length*2/3),0,LOGO);
  var durs=[46,58,40];
  cols.forEach(function(list,c){
    var col=document.createElement('div'); col.className='col'+(c===1?' down':'');
    col.style.setProperty('--dur',durs[c]+'s');
    list.concat(list).forEach(function(s){
      var im=document.createElement('img'); im.src=s; im.alt=''; im.decoding='async'; im.width=300; im.height=300; if(s===LOGO)im.className='logo';
      col.appendChild(im);
    });
    wall.appendChild(col);
  });
})();
