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
- **Pre-Save-Button** in der `#soon`-Karte unter dem Sneak Peek (`id="soon-ps"`, Text-Schlüssel `soon.ps`), Link = DistroKid-HyperFollow-Seite des Releases (`https://distrokid.com/hyperfollow/abard1/<slug>`, per Claude in Chrome aus DistroKid holen). Verschwindet zur Release-Zeit automatisch.
- **Keine Weiterleitungsseiten für Bio-Links.** Instagram-/TikTok-Bio verlinkt immer die Startseite – Pre-Save läuft über den Button dort.
- Inline-Skripte sind per Content-Security-Policy gesperrt: JS immer als eigene Datei.
- **Stempel-Teaser** für Instagram/TikTok: Stempel „NEW SINGLE / OUT <MON> <TAG> / ABARD — <Jahr>“ in `#d8a23f` mit den Website-Schriften (Big Shoulders Display, IBM Plex Mono), leicht gedreht, dezente Textur; oben im Unschärfe-Bereich über dem Cover, für TikTok ca. 150 px tiefer (sonst liegt „Following | For You“ darüber); erscheint nach der Video-Einblendung (~2.5 s). Ausgabe `<Titel> Preview 9x16 Stempel.mov` plus Upload-Fassung unter 10 MB `<Titel> Reel.mp4`, beide nach Downloads.
- **Posten** (Albert klickt, Claude führt; nichts teilen ohne sein Okay): Instagram – Zuschnitt „Original“/9:16, Titelbild aus der Mitte (erstes Bild schwarz), Facebook-Teilen aus, KI-Label an, Zeichenzähler prüfen. TikTok – Dateinamen aus der Beschreibung löschen, Cover aus der Mitte, KI-Inhalt an, Urheberrechtsprüfung; kein Profil-Link → „Search ABard on Spotify and hit follow so you don't miss it.“ Text EN, 5 Hashtags (TikTok + #RockTok), **kein #ABard**.
- Eigener Ton im Teaser ist ok, solange der Release kein Social Media Pack bei DistroKid hat.
- HyperFollow-Klicks sind keine Erfolgskennzahl.
