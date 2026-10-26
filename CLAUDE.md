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
- Sprache (seit 25.10.2026): Ohne eigene Wahl entscheidet die Browsersprache – Deutsch → ganze Seite DE (auch Story auf den Songseiten), sonst EN. Keine IP-Erkennung. Klick auf EN/DE hat immer Vorrang und wird gespeichert.
- Bio zusätzlich auf Spanisch, Portugiesisch, Französisch, Italienisch, Griechisch, Filipino (`bio_es/pt/fr/it/el/fil` in `artist.json`; Browser `tl` zählt als Filipino): erscheint nur bei entsprechender Browsersprache und ohne eigene EN/DE-Wahl, Rest der Seite bleibt EN. Bei Bio-Änderungen alle Sprachen mitpflegen (Genres englisch, „du“-Form), dann `build_share.py`.
- Meilenstein „mehr als die Hälfte“ (seit 25.10.2026): Sobald in `globe-data.js` Hörer aus mindestens 98 der 195 Staaten stehen, hängt `build_share.py` automatisch den Satz aus `bio_half` (8 Sprachen, `artist.json`) an die Bio der Website. `build_share.py` meldet den Stand („Weltkarte: X von 195 Staaten“). Wird er erstmals aktiv: Albert Bescheid geben und den englischen Satz auch in die Bio auf Spotify, YouTube, YouTube Music, Instagram, TikTok und Suno übernehmen (Bio überall synchron).
- Weltkarte (`globe-data.js`): Länder mit Stufen 1–5 aus DistroKid, wird seit 25.10.2026 per geplanter Aufgabe „ABard Weltkarte aktualisieren“ am 1. jedes Monats ergänzt (nie schrumpfen). „Heard in“ zählt alle Gebiete, „to go“ nur fehlende der 195 Staaten (`STATES` in `globe.js` und `build_share.py`).
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

## Ladezeit / Lighthouse (seit 26.10.2026)
- Ausgangslage 26.10.2026 (PageSpeed Insights): Mobil Leistung 48 (LCP 7,1 s, CLS 0,73), Desktop 79. Nach Änderungen neu messen auf pagespeed.web.dev.
- **Schriften lokal** in `fonts/` (woff2, latin/latin-ext/greek, aus @fontsource); Startseite hat die `@font-face`-Regeln inline, Songseiten und Disclaimer laden `/fonts/fonts.css`. Kein Google Fonts mehr (auch nicht in der CSP oder im Disclaimer erwähnen).
- **Kopfbereich darf nicht springen:** `.reel:empty` reserviert den Platz für Clip + „Sound on“ + Mini-Icons (Mini-Icons feste Höhe 78 px), `#rinfo[hidden]` hat Platzhalter-Höhen (Höhen je Bildschirmbreite, siehe CSS). Wird der Inhalt der Infozeile grösser/kleiner, Höhen anpassen und mit Playwright CLS messen.
- **Clip-Standbild = grösstes Element (LCP):** `tools/hero_preload.py` (läuft in `build_share.py` und `update_stats.py`) setzt zwischen `<!--HEROPL-->` ein Preload mit `fetchpriority="high"` für das Standbild des ersten Clips und `no-reel`, wenn kein Release aktuell ist; ausserdem schreibt es das Standbild als `<img class="rv-po">` unter dem `<video>` direkt in `#reel` (hero.js übernimmt dieses Element). Nicht als `poster` am Video – sonst wertet Lighthouse den später startenden Clip als LCP (Mobil fiel dadurch von 99 auf 77). Das Video selbst lädt `hero.js` erst nach dem Seiten-Load (oder sofort bei Klick).
- **Browser-Cache (.htaccess):** Bilder, Clips, Audio, Schriften mit `?v=` 1 Jahr `immutable`, ohne `?v=` 7 Tage. Darum bei jeder ersetzten Datei `?v=` hochzählen, sonst sehen Besucher die alte Fassung.
- Bilder in den unsichtbaren Release-Karten immer mit `loading="lazy"` (sonst lädt das Handy sie unnötig).
- YouTube-Fenster „Videos“ (`#ytlist`): hat im HTML **kein** `src` (nur `data-src` als Ersatz); `app.js` setzt es erst, wenn der Besucher in die Nähe scrollt (1200 px) oder über `#watch` springt. Nicht wieder fest einbauen – sonst lädt jeder Besucher 3 MB YouTube-Code (Desktop-Leistung).
- Alle Skripte am Seitenende mit `defer` laden (Reihenfolge bleibt, blockieren aber den ersten Bildaufbau nicht). Die Spotify-iframe-API steht nicht im HTML: `app.js` lädt sie 1,5 s nach dem Seiten-Load oder bei der ersten Berührung/Taste (bremst sonst das Handy).
- Erstes Clip-Standbild im Kopf = kleinere Fassung `clips/<slug>-<art>-m.jpg` (432×768); `hero_preload.py` erzeugt sie bei `build_share.py` automatisch, falls sie fehlt (braucht Pillow). Mitcommitten.
- Stimmungs-Hintergrund des Kopf-Clips lädt erst nach dem Seiten-Load (`bgcover.js`), damit das grosse Cover den Aufbau nicht bremst.
- **Kachel-Cover ohne `src` im HTML:** `<div class="cover"><img data-src="…" data-srcset="…">`, `app.js` (`ABARD_LZ`) lädt sie beim Hinscrollen (400 px Vorlauf). Natives `loading="lazy"` reicht nicht – PageSpeed lud sonst alle ~40 Cover sofort (Handy-Wertung ~79 statt 99). `tools/lazy_tiles.py` wandelt in `build_share.py`/`update_stats.py` automatisch um; neue Kacheln dürfen mit normalem `src` eingetragen werden. Bilder der unsichtbaren Release-Karten (`#next`) bekommen ebenfalls `data-src`. Wer per JS ein Kachel-Bild braucht: `ABARD_LZ.url(img)` bzw. `ABARD_LZ.now(img)`.
- Lokal messen: Lighthouse (`npx lighthouse`, Chromium unter `/opt/pw-browsers`) gegen einen lokalen Server mit gzip – schwankt weniger als PageSpeed.
- **Streamzahlen nicht anzeigen (seit 27.10.2026):** `.rel .streams{display:none}`. `update_stats.py` läuft trotzdem täglich weiter (Top 3 = meistgehörte Songs); die Zahlen gehen nur an Albert.
