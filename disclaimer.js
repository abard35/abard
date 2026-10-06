// Adresse steht nirgends im Klartext; sie wird erst beim Klick zusammengesetzt und nie angezeigt
document.querySelectorAll('.mail').forEach(function(b){
  b.addEventListener('click',function(){
    var a=atob(b.getAttribute('data-m')).split('').reverse().join('');
    location.href='mai'+'lto:'+a+'?subject='+encodeURIComponent('ABard Website');
  });
});
