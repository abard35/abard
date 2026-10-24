# ABard-Website – Regeln für jede Sitzung

Albert spricht Deutsch und hat keine Shell-Kenntnisse. Kurz, auf Deutsch, ohne Floskeln. Unklares nachfragen statt raten. Offene Nebenpunkte sofort erledigen.

Diese Regeln gelten zusätzlich zum Release-Ablauf (Skill „abard-release-sneak-peek“) und gehen ihm bei Widerspruch vor.

## Songtexte und Storys (`songs.js`)
- `lyrics` = Songtext **exakt in der bei DistroKid eingereichten Fassung** (nicht ein älterer Entwurf). Im Zweifel bei Albert nachfragen.
- Jeder englische Song braucht zusätzlich **`story_de`** und **`lyrics_de`** (werden bei Sprache DE angezeigt).
- Deutsche Texte: deutsche Wortwahl und Grammatik, aber **immer „ss“ statt „ß“** (Alberts Wunsch: ß wurde früher in Browsern oft falsch dargestellt). Durchgehend „du“, bei mehreren Angesprochenen „ihr“.
- `story_de`: natürliche, muttersprachliche Übersetzung. Songtitel und Fachbegriffe (Power Ballad, Wall of Sound …) bleiben englisch, Titel in „…“. Wörtlich zitierte Songzeilen: deutsche Übersetzung im Text, danach das englische Original in `{{…}}` – wird klein und kursiv dahinter angezeigt. Bildhafte Anleihen aus dem Songtext nur übersetzen, nicht markieren.
- `lyrics_de`: sinngemässe, nicht wörtliche Übersetzung; Zeile für Zeile mit identischer Zeilen- und Strophenstruktur wie `lyrics` (gleiche Leerzeilen), damit man mitlesen kann. Kein Reimzwang, Rock-Ton statt Schlager. Interjektionen (Oh, Yeah, Mmh …) unverändert, Klammern (Backing Vocals) übersetzen. Gleiche englische Zeile → gleiche deutsche Zeile.
- Kritisch übersetzen: nicht die erste Wörterbuch-Vokabel, sondern das Wort, das im Kontext passt (Beispiel: „ohne ein Geräusch“ statt „ohne einen Laut“, „egoistisch“ statt „selbstsüchtig“).
- Vor dem Veröffentlichen selbst gegenlesen (und prüfen, dass kein „ß“ vorkommt) – Albert ist Muttersprachler, holprige Stellen wären peinlich.
- `songs.js` mit `json.dumps(…, ensure_ascii=False, indent=2)` schreiben (Kopfkommentar behalten).

- Song-Fenster hat zwei Schalter: (1) oben mit Abstand hinter „Teilen“: „Original | DE“ für „Über den Song“ und die Überschriften, Start = Seitensprache (Erstbesucher Englisch); (2) beim Songtext: „Original | DE“ (Hinweis „Sinngemässe Übersetzung“), startet bei jedem Song IMMER im Original – die sinngemässe Übersetzung nur auf aktiven Klick.

## Nach jeder Änderung
- `python3 tools/build_share.py` ausführen (Songseiten, JSON-LD, Sitemap, Versionsnummer `songs.js?v=`).
- Geänderte JS/CSS: `?v=` in `index.html` hochzählen.
- Song-Fenster in EN und DE testen (Story, Songtext, Umschalter Original/Deutsch), danach live in Chrome prüfen.
- Commit-Nachrichten auf Deutsch; Push auf `main` → Plesk deployt automatisch.

## Sonstiges
- Deutsche Bio steht in `artist.json` (`bio_de`), ebenfalls mit „ss“ statt „ß“.
- Kontaktadresse darf nie im Klartext auf der Seite stehen.

## Release-Ergänzungen (seit 11.10.2026, gelten zusätzlich zum Release-Ablauf)
- **Release-Karten-Layout (seit 15.10.2026):** Hören vor Pre-Save. Das Cover ist der Sneak-Peek-Player (`<button class="sneak cov" id="<karte>-sneak">` mit Cover-Bild, Play-Kreis, Zeile „Sneak Peek · Zeit“ und Fortschrittsbalken an der Unterkante). Darunter eine Aktionszeile `.ctools`: „Share“, Kalender nur als Symbol, Pre-Save als kleiner Textlink `<a class="ps-link" id="<karte>-ps">` (Text-Schlüssel `soon.ps`), Link = DistroKid-HyperFollow-Seite des Releases (`https://distrokid.com/hyperfollow/abard1/<slug>`, per Claude in Chrome aus DistroKid holen). Kein grosser Pre-Save-Knopf mehr. Verschwindet zur Release-Zeit automatisch.
- **Keine Weiterleitungsseiten für Bio-Links.** Instagram-/TikTok-Bio verlinkt immer die Startseite – Pre-Save läuft über den Button dort.
- Inline-Skripte sind per Content-Security-Policy gesperrt: JS immer als eigene Datei.
- **Stempel-Teaser** für Instagram/TikTok: Stempel „NEW SINGLE / OUT <MON> <TAG> / ABARD — <Jahr>“ in `#d8a23f` mit den Website-Schriften (Big Shoulders Display, IBM Plex Mono), leicht gedreht, dezente Textur; oben im Unschärfe-Bereich über dem Cover, für TikTok ca. 150 px tiefer (sonst liegt „Following | For You“ darüber); erscheint nach der Video-Einblendung (~2.5 s). Ausgabe `<Titel> Preview 9x16 Stempel.mov` plus Upload-Fassung unter 10 MB `<Titel> Reel.mp4`, beide nach Downloads.
- **Posten** (Albert klickt, Claude führt; nichts teilen ohne sein Okay): Instagram – Zuschnitt „Original“/9:16, Titelbild aus der Mitte (erstes Bild schwarz), Facebook-Teilen aus, KI-Label an, Zeichenzähler prüfen. TikTok – Dateinamen aus der Beschreibung löschen, Cover aus der Mitte, KI-Inhalt an, Urheberrechtsprüfung; kein Profil-Link → „Search ABard on Spotify and hit follow so you don't miss it.“ Text EN, 5 Hashtags (TikTok + #RockTok), **kein #ABard**.
- **Release-Zeiten (seit 24.10.2026, ab den Releases nach Through Your Eyes):** Release am Freitag – Spotify 00:00 (Release Radar), YouTube-Premiere und Out-Now-Short 17:00. Posts und allfällige Anzeigen auf Instagram, Facebook und TikTok nie um 00:00, sondern wenn das Publikum aktiv ist (Release-Freitag ab 17:00, sonst abends ca. 17–20 Uhr). Karten-`data-at` = Spotify-Zeit.
- Eigener Ton im Teaser ist ok, solange der Release kein Social Media Pack bei DistroKid hat.
- HyperFollow-Klicks sind keine Erfolgskennzahl.
- **Google-Indexierung (seit 19.10.2026):** Erschienene Songs stehen in der Liste „All songs A–Z“ als normale Links im HTML (nicht `hidden`), sonst findet Google die Songseite nicht. `build_share.py` und der tägliche Lauf `update_stats.py` schalten Songs nach ihrer Release-Zeit automatisch frei. Am Release-Tag zusätzlich in der Search Console (Property `https://abard.die-bardewycks.ch/`) für `/s/<slug>/` „Indexierung beantragen“ (per Claude in Chrome) und danach prüfen, dass der Link live ohne `hidden` im Quelltext steht.

## Kopfbereich mit Shorts (seit 21.10.2026)
- Kopf zeigt die Shorts der aktuellen Releases (bevorstehend oder höchstens 7 Tage alt): ein Clip gross und stumm, Ton nur per Klick („Sound on“), ist ein Clip durch, folgt automatisch der nächste; die übrigen als Mini-Icons darunter. Kein aktueller Release → kein Videobereich.
- Daneben eine Infozeile (`#rinfo`) zum gezeigten Song: Datum, kleiner Countdown, Teilen/Kalender/Pre-Save bzw. nach Release Spotify/YouTube/Story.
- **Vor dem Release (seit 24.10.2026): Pre-Save auf Spotify ist der Hauptknopf** (gold, `.ri-ps`, Link aus dem `.ps-link` der Karte) mit Hinweis „kein Premium nötig, gratis Spotify-Konto genügt“. Darunter Teilen und „Erinnere mich“ (Glocke) für Besucher ohne Spotify: YouTube-Premiere-Erinnerung (Link = YouTube-Video aus `.out` der Karte, muss als Premiere geplant sein), .ics-Datei, Google Kalender. Keine E-Mail-Adressen sammeln. Die Release-Karten in `#next` sind **unsichtbar** (`hidden`) und dienen nur noch als Datenquelle – beim Release-Ablauf weiter wie bisher pflegen.
- Pro Release: Teaser- und Out-Now-Short aus `Downloads/09_Videos/Shorts` mit ffmpeg nach `clips/<slug>-teaser.mp4` / `clips/<slug>-out.mp4` (720×1280, H.264 CRF 27–31, AAC 128k, `+faststart`, Ziel unter ~3 MB), dazu Standbild `clips/<slug>-<art>.jpg` (720×1280) und Mini-Bild `clips/<slug>-<art>-s.jpg` (120×214), beide bei 40 % der Laufzeit. Slug in `CLIPS` in `hero.js` eintragen.
- Volle Bio steht im Kopf (Albert will sie dort vollständig, nicht gekürzt).
- Nur eine Tonquelle gleichzeitig (`onlyone.js`): Player, Sneak Peeks, Clip mit Ton und das YouTube-Fenster „Watch“ (`#ytlist`, braucht `enablejsapi=1` in der URL) halten sich gegenseitig an.
- Stimmungs-Hintergrund (`bgcover.js`): ganze Seite zeigt das geblurrte Cover des gezeigten Clips bzw. des im Player laufenden Songs (letzte Aktion gewinnt, beim Schliessen des Players zurück zum Clip). Stärke über `#bgc i.on{opacity}` in `index.html`. Blur max. ~40px plus Korn-Ebene; die Linientextur (`body::before`) wird bei aktivem Hintergrund ausgeblendet (`body.has-bgc`), sonst Moiré bei Windows-Skalierung.
- Als App installierbar (seit 21.10.2026): `manifest.webmanifest`, `sw.js` (absichtlich ohne Zwischenspeicher), Symbole `icon-192.png`/`icon-512.png`/`icon-maskable-512.png` aus `Downloads/07_Musik_Cover_Art/ABard Logo _2560x2560.png`. Knopf „App“ in der Kopfzeile (`install.js`) nur auf Handys: Android → Installieren-Dialog, iPhone → Anleitung (Teilen → Zum Home-Bildschirm).

## Autoplay nach Stimmung (seit 24.10.2026)
- Nach einem Song spielt der Player den **neuesten** noch nicht gehörten Song aus derselben Stimmungsfamilie, erst danach die verwandten Familien (`FAM`, `NB` in `app.js`). Familien: 1 Cyber/Sci-Fi, 2 Gothic/Dark Rock, 3 Cinematic, 4 Sultry, 5 Liebeslieder, 6 Verlust, 7 80s/Metal, 8 Aufbruch/Carpe Diem.
- Pro neuem Song beim Release-Ablauf den Slug in `FAM` eintragen (Familie bei Albert nachfragen, falls unklar). „The Flame That Is Ours“ steht in `LAST` (innerhalb der Familie hinten).
