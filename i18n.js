// Sprachumschalter EN/DE. Standard: Englisch. Genres und Songtexte bleiben englisch.
// Texte im HTML sind englisch; Elemente mit data-i18n / data-i18n-aria / data-i18n-title werden umgeschaltet.
(function(){
  var D={
    en:{
      'eyebrow':'Official Artist Site',
      'lede':'ABard is a sound, not a backstory. Rooted in 80s hard rock, sharpened by industrial steel and carried by big, cinematic emotion. Every song tells its own story – press play and decide for yourself.',
      'next.soon':'Next Release · Single','next.out':'Latest Release · Single','sneak':'Sneak Peek','songs.az':'All songs A–Z','out.spsoon':'On Spotify from October 9','tba':'time to be announced',
      'cd.d':'Days','cd.h':'Hrs','cd.m':'Min','cd.s':'Sec',
      'out.sp':'Listen on Spotify','out.yt':'Watch on YouTube','out.st':'Story & Lyrics',
      'top.count':'Most streamed on Spotify & YouTube',
      'src.aria':'Play via','src.label':'Listen on','ap.title':'Automatically play a similar song afterwards',
      'src.note':'Newest first · Tap a cover to play · Tap Story & Lyrics for the words · YouTube works without an account',
      'only.yt':'only on YouTube','only.sp':'only on Spotify',
      'watch.sub':'Subscribe on YouTube →',
      'close':'Close','globe.aria':'Where ABard is heard','share':'Share','copied':'Link copied ✓',
      'share.aria':'Share this song','share.copy':'Copy link','share.mail':'E-mail','share.sub':'Listen to this:',
      'fav.add':'Save','fav.on':'Saved','fav.aria':'Save to favorites','fav.aria.on':'Remove from favorites',
      'fav.h':'Your Favorites','fav.note':'Saved in this browser only',
      'fav.toast':'♥ Saved to Your Favorites.','fav.toast.sp':'Also save it on Spotify ↗','fav.toast.x':'Close',
      'd.story':'About the song','d.lyrics':'Lyrics','open.sp':'Open in Spotify ↗','open.yt':'Open on YouTube ↗',
      'vin.aria':'Story & lyrics for the song now playing','vin.now':'Now playing','vin.next':'Up next','vin.last':'Last played',
      'pn.text':'Spotify only plays a 30-second preview because you are not logged in.','pn.yt':'Play the full song on YouTube','pn.login':'Log in to Spotify ↗',
      'nx.in':'Up next in','nx.go':'Play now','nx.x':'Cancel','nx.viayt':'via YouTube',
      'pyt':'Open on YouTube ↗','pclose':'Close player',
      'months':['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      'monthsLong':['January','February','March','April','May','June','July','August','September','October','November','December']
    },
    de:{
      'eyebrow':'Offizielle Künstlerseite',
      'lede':'ABard ist ein Sound, keine Hintergrundgeschichte. Verwurzelt im Hardrock der 80er, geschärft von industriellem Stahl und getragen von grossen, cineastischen Gefühlen. Jeder Song erzählt seine eigene Geschichte – drück auf Play und entscheide selbst.',
      'next.soon':'Nächster Release · Single','next.out':'Neuester Release · Single','sneak':'Reinhören','songs.az':'Alle Songs A–Z','out.spsoon':'Auf Spotify ab 9. Oktober','tba':'Uhrzeit folgt',
      'cd.d':'Tage','globe.aria':'Wo ABard gehört wird','cd.h':'Std','cd.m':'Min','cd.s':'Sek',
      'out.sp':'Auf Spotify hören','out.yt':'Auf YouTube ansehen','out.st':'Story & Songtext',
      'top.count':'Meistgehört auf Spotify & YouTube',
      'src.aria':'Abspielen über','src.label':'Hören auf','ap.title':'Nach dem Song automatisch einen ähnlichen spielen',
      'src.note':'Neueste zuerst · Cover antippen zum Abspielen · Story & Lyrics antippen für den Songtext · YouTube geht ohne Konto',
      'only.yt':'nur YouTube','only.sp':'nur Spotify',
      'watch.sub':'Abonnieren auf YouTube →',
      'close':'Schliessen','share':'Teilen','copied':'Link kopiert ✓',
      'share.aria':'Diesen Song teilen','share.copy':'Link kopieren','share.mail':'E-Mail','share.sub':'Hör dir das an:',
      'fav.add':'Merken','fav.on':'Gemerkt','fav.aria':'Zu den Favoriten','fav.aria.on':'Aus den Favoriten entfernen',
      'fav.h':'Deine Favoriten','fav.note':'Nur in diesem Browser gespeichert',
      'fav.toast':'♥ Bei deinen Favoriten gemerkt.','fav.toast.sp':'Auch auf Spotify speichern ↗','fav.toast.x':'Schliessen',
      'd.story':'Über den Song','d.lyrics':'Songtext','open.sp':'In Spotify öffnen ↗','open.yt':'In YouTube öffnen ↗',
      'vin.aria':'Story & Songtext zum laufenden Song','vin.now':'Läuft gerade','vin.next':'Als Nächstes','vin.last':'Zuletzt',
      'pn.text':'Spotify spielt nur eine 30-Sekunden-Vorschau, weil du nicht angemeldet bist.','pn.yt':'Ganz auf YouTube hören','pn.login':'Bei Spotify anmelden ↗',
      'nx.in':'Als Nächstes in','nx.go':'Jetzt spielen','nx.x':'Abbrechen','nx.viayt':'über YouTube',
      'pyt':'Auf YouTube öffnen ↗','pclose':'Player schliessen',
      'months':['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'],
      'monthsLong':['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember']
    }
  };
  var lang='en';
  try{var st=localStorage.getItem('abard-lang');if(st==='de'||st==='en')lang=st}catch(e){}
  function T(k){var v=D[lang][k];return v===undefined?D.en[k]:v}
  // Monatsangabe auf den Kacheln aus data-date neu schreiben (Genre bleibt englisch)
  function metas(){
    document.querySelectorAll('.rel').forEach(function(a){
      var m=a.querySelector('.meta'),d=a.dataset.date;if(!m||!d)return;
      var parts=[];if(a.dataset.genre)parts.push(a.dataset.genre);
      parts.push(T('months')[+d.slice(5,7)-1]+' '+d.slice(0,4));
      m.textContent=parts.join(' · ');
    });
  }
  function apply(){
    document.documentElement.lang=lang;
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var k=el.getAttribute('data-i18n');
      // Status des Release-Blocks entscheidet über den Text der Überzeile
      el.textContent=T(k);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function(el){el.setAttribute('aria-label',T(el.getAttribute('data-i18n-aria')))});
    document.querySelectorAll('[data-i18n-title]').forEach(function(el){el.setAttribute('title',T(el.getAttribute('data-i18n-title')))});
    document.querySelectorAll('#lang button').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.lang===lang))});
    metas();
    document.dispatchEvent(new CustomEvent('abard:lang',{detail:lang}));
  }
  window.ABARD_I18N={T:T,lang:function(){return lang},set:function(l){if(!D[l])return;lang=l;try{localStorage.setItem('abard-lang',l)}catch(e){}apply()}};
  document.querySelectorAll('#lang button').forEach(function(b){b.addEventListener('click',function(){window.ABARD_I18N.set(b.dataset.lang)})});
  apply();
})();
