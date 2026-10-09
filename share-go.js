// Geteilter Link (?via=share): Besucher direkt auf die Startseite mit geladenem Song schicken.
// Vorschau-Dienste (WhatsApp, Facebook …) führen kein JavaScript aus und sehen weiterhin Cover und Titel der Songseite.
(function(){
  if(!/[?&]via=share(&|$)/.test(location.search))return;
  var m=location.pathname.match(/^\/s\/([^\/]+)\/?/);
  if(m)location.replace('/#play-'+m[1]);
})();
