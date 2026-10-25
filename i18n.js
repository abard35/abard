// Sprachumschalter EN/DE. Ohne eigene Wahl: Browser auf Deutsch → DE, sonst EN. Genres und Songtexte bleiben englisch.
// Bio zusätzlich auf ES/PT/FR/IT, wenn der Browser so eingestellt ist (Rest der Seite bleibt EN). Texte aus artist.json via build_share.py.
// Texte im HTML sind englisch; Elemente mit data-i18n / data-i18n-aria / data-i18n-title werden umgeschaltet.
(function(){
  var D={
    en:{
      'eyebrow':'Official Artist Site',
      'lede':'ABard is a sound, not a backstory. Rooted in 80s hard rock, sharpened by industrial steel and carried by big, cinematic emotion. From crushing riffs and symphonic metal to aching power ballads – every song tells its own story. Press play and decide for yourself.',
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
      'fav.toast':'♥ Saved to Your Favorites.','fav.toast.sp':'Also save it on Spotify ↗','fav.toast.yt':'Also like it on YouTube ↗','psub':'Subscribe ↗','soon.ps':'Pre-save on Spotify','cal':'Add to calendar','remind':'Remind me','rem.yt':'YouTube: premiere reminder','ps.note':'No Premium needed – a free Spotify account is enough. The song lands in your library on release day.','tap.play':'Tap to play','cal.ics':'Apple / Outlook (.ics)','cal.g':'Google Calendar','fav.toast.x':'Close',
      'd.story':'About the song','d.lyrics':'Lyrics','ly.orig':'Original','ly.de':'Deutsch','ly.note':'Sinngemässe Übersetzung','open.sp':'Open in Spotify ↗','open.yt':'Open on YouTube ↗',
      'vin.aria':'Story & lyrics for the song now playing','vin.now':'Now playing','vin.next':'Up next','vin.last':'Last played',
      'pn.text':'Spotify only plays a 30-second preview because you are not logged in.','pn.yt':'Play the full song on YouTube','pn.login':'Log in to Spotify ↗',
      'nx.in':'Up next in','nx.go':'Play now','nx.x':'Cancel','nx.viayt':'via YouTube',
      'pyt':'Open on YouTube ↗','pclose':'Close player',
      'lede.short':'ABard is a sound, not a backstory.','inst':'App','inst.aria':'Install ABard as an app','inst.h':'ABard as an app on your phone','inst.ios1':'Tap the Share icon {i} in Safari (bottom bar)','inst.ios2':'Scroll down and choose “Add to Home Screen”','inst.ios3':'Tap “Add” – done.','inst.and1':'Open the browser menu (⋮ top right)','inst.and2':'Choose “Install app” or “Add to Home screen”','inst.and3':'Confirm – done.','hero.on':'Sound on','hero.off':'Sound off','hero.out':'Out now','hero.new':'New single','hero.aria':'Short videos of the current releases','hero.pick':'Show clip:',
      'months':['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      'monthsLong':['January','February','March','April','May','June','July','August','September','October','November','December']
    },
    de:{
      'eyebrow':'Offizielle Künstlerseite',
      'lede':'ABard ist ein Sound, keine Hintergrundgeschichte. Verwurzelt im Hardrock der 80er, geschärft von industriellem Stahl und getragen von grossen, cineastischen Gefühlen. Von wuchtigen Riffs und Symphonic Metal bis zu sehnsuchtsvollen Power Ballads – jeder Song erzählt seine eigene Geschichte. Drück auf Play und entscheide selbst.',
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
      'fav.toast':'♥ Bei deinen Favoriten gemerkt.','fav.toast.sp':'Auch auf Spotify speichern ↗','fav.toast.yt':'Auch auf YouTube liken ↗','psub':'Abonnieren ↗','soon.ps':'Auf Spotify vormerken','cal':'In den Kalender','remind':'Erinnere mich','rem.yt':'YouTube: Premiere-Erinnerung','ps.note':'Kein Premium nötig – ein gratis Spotify-Konto genügt. Der Song landet am Release-Tag in deiner Bibliothek.','tap.play':'Tippen zum Abspielen','cal.ics':'Apple / Outlook (.ics)','cal.g':'Google Kalender','fav.toast.x':'Schliessen',
      'd.story':'Über den Song','d.lyrics':'Songtext','ly.orig':'Original','ly.de':'Deutsch','ly.note':'Sinngemässe Übersetzung','open.sp':'In Spotify öffnen ↗','open.yt':'In YouTube öffnen ↗',
      'vin.aria':'Story & Songtext zum laufenden Song','vin.now':'Läuft gerade','vin.next':'Als Nächstes','vin.last':'Zuletzt',
      'pn.text':'Spotify spielt nur eine 30-Sekunden-Vorschau, weil du nicht angemeldet bist.','pn.yt':'Ganz auf YouTube hören','pn.login':'Bei Spotify anmelden ↗',
      'nx.in':'Als Nächstes in','nx.go':'Jetzt spielen','nx.x':'Abbrechen','nx.viayt':'über YouTube',
      'pyt':'Auf YouTube öffnen ↗','pclose':'Player schliessen',
      'lede.short':'ABard ist ein Sound, keine Hintergrundgeschichte.','inst':'App','inst.aria':'ABard als App installieren','inst.h':'ABard als App auf dem Handy','inst.ios1':'In Safari unten auf Teilen {i} tippen','inst.ios2':'Nach unten scrollen und „Zum Home-Bildschirm“ wählen','inst.ios3':'Auf „Hinzufügen“ tippen – fertig.','inst.and1':'Browser-Menü öffnen (⋮ oben rechts)','inst.and2':'„App installieren“ oder „Zum Startbildschirm hinzufügen“ wählen','inst.and3':'Bestätigen – fertig.','hero.on':'Ton an','hero.off':'Ton aus','hero.out':'Jetzt draussen','hero.new':'Neue Single','hero.aria':'Kurzvideos der aktuellen Releases','hero.pick':'Clip zeigen:',
      'months':['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'],
      'monthsLong':['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember']
    }
  };
  var BIO={"es": "ABard es un sonido, no una biografía. Con raíces en el hard rock de los 80, afilado por acero industrial e impulsado por grandes emociones cinematográficas. De riffs demoledores y symphonic metal a power ballads desgarradoras: cada canción cuenta su propia historia. Dale play y decide por ti mismo.", "pt": "ABard é um som, não uma biografia. Com raízes no hard rock dos anos 80, afiado pelo aço industrial e movido por grandes emoções cinematográficas. De riffs esmagadores e symphonic metal a power ballads de partir o coração – cada música conta a sua própria história. Dê o play e tire suas próprias conclusões.", "fr": "ABard, c’est un son, pas une biographie. Ancré dans le hard rock des années 80, affûté par l’acier industriel et porté par de grandes émotions cinématographiques. Des riffs écrasants et du symphonic metal aux power ballads déchirantes – chaque chanson raconte sa propre histoire. Appuie sur play et juge par toi-même.", "it": "ABard è un suono, non una biografia. Radicato nell’hard rock degli anni ’80, affilato dall’acciaio industriale e sostenuto da grandi emozioni cinematografiche. Dai riff devastanti e dal symphonic metal alle power ballad struggenti – ogni canzone racconta la sua storia. Premi play e giudica da solo."};
  var lang='en',picked=false,nav='';
  try{nav=((navigator.languages&&navigator.languages[0])||navigator.language||'').toLowerCase().slice(0,2)}catch(e){}
  try{var st=localStorage.getItem('abard-lang');if(st==='de'||st==='en'){lang=st;picked=true}}catch(e){}
  if(!picked&&nav==='de')lang='de';
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
    // Bio in der Browsersprache (ES/PT/FR/IT), solange der Besucher nicht selbst EN/DE gewählt hat
    var bl=(lang==='en'&&!picked&&BIO[nav])?nav:'';
    document.querySelectorAll('[data-i18n="lede"]').forEach(function(el){if(bl){el.textContent=BIO[bl];el.lang=bl}else el.removeAttribute('lang')});
    document.querySelectorAll('[data-i18n-aria]').forEach(function(el){el.setAttribute('aria-label',T(el.getAttribute('data-i18n-aria')))});
    document.querySelectorAll('[data-i18n-title]').forEach(function(el){el.setAttribute('title',T(el.getAttribute('data-i18n-title')))});
    document.querySelectorAll('#lang button').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.lang===lang))});
    metas();
    document.dispatchEvent(new CustomEvent('abard:lang',{detail:lang}));
  }
  window.ABARD_I18N={T:T,lang:function(){return lang},set:function(l){if(!D[l])return;lang=l;picked=true;try{localStorage.setItem('abard-lang',l)}catch(e){}apply()}};
  document.querySelectorAll('#lang button').forEach(function(b){b.addEventListener('click',function(){window.ABARD_I18N.set(b.dataset.lang)})});
  apply();
})();
