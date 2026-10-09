# ABard-Website – Regeln für jede Sitzung

Albert spricht Deutsch und hat keine Shell-Kenntnisse. Kurz, auf Deutsch, ohne Floskeln. Unklares nachfragen statt raten. Offene Nebenpunkte sofort erledigen.

Diese Regeln gelten zusätzlich zum Release-Ablauf (Skill „abard-release-sneak-peek“) und gehen ihm bei Widerspruch vor.

## Songtexte und Storys (`songs.js`)
- `lyrics` = Songtext **exakt in der bei DistroKid eingereichten Fassung** (nicht ein älterer Entwurf). Im Zweifel bei Albert nachfragen.
- Jeder englische Song braucht zusätzlich **`story_de`** und **`lyrics_de`** (werden bei Sprache DE angezeigt).
- Deutsche Texte: deutsche Wortwahl und Grammatik, aber **immer „ss“ statt „ß“** (Alberts Wunsch: ß wurde früher in Browsern oft falsch dargestellt). Durchgehend „du“, bei mehreren Angesprochenen „ihr“.
- `story_de`: natürliche, muttersprachliche Übersetzung. Songtitel und Fachbegriffe (Power Ballad, Wall of Sound …) bleiben englisch, Titel in „…“. Wörtlich zitierte Songzeilen: deutsche Übersetzung im Text, danach das englische Original in `{{…}}` – wird klein und kursiv dahinter angezeigt. Bildhafte Anleihen aus dem Songtext nur übersetzen, nicht markieren.
- `lyrics_de`: sinngemässe, nicht wörtliche Übersetzung; Zeile für Zeile mit identischer Zeilen- und Strophenstruktur wie `lyrics` (gleiche Leerzeilen), damit man mitlesen kann. Kein Reimzwang, Rock-Ton statt Schlager. Interjektionen (Oh, Yeah, Mmh …) unverändert, Klammern (Backing Vocals) übersetzen. Gleiche englische Zeile → gleiche deutsche Zeile.
- Vor dem Veröffentlichen selbst gegenlesen (und prüfen, dass kein „ß“ vorkommt) – Albert ist Muttersprachler, holprige Stellen wären peinlich.
- `songs.js` mit `json.dumps(…, ensure_ascii=False, indent=2)` schreiben (Kopfkommentar behalten).

- Song-Fenster hat zwei Schalter: (1) oben mit Abstand hinter „Teilen“: „Original | Deutsch“ für „Über den Song“ und die Überschriften, Start = Seitensprache (Erstbesucher Englisch); (2) beim Songtext: „Original | Übersetzung“, startet bei jedem Song IMMER im Original – die sinngemässe Übersetzung nur auf aktiven Klick.

## Nach jeder Änderung
- `python3 tools/build_share.py` ausführen (Songseiten, JSON-LD, Sitemap, Versionsnummer `songs.js?v=`).
- Geänderte JS/CSS: `?v=` in `index.html` hochzählen.
- Song-Fenster in EN und DE testen (Story, Songtext, Umschalter Original/Deutsch), danach live in Chrome prüfen.
- Commit-Nachrichten auf Deutsch; Push auf `main` → Plesk deployt automatisch.

## Sonstiges
- Deutsche Bio steht in `artist.json` (`bio_de`), ebenfalls mit „ss“ statt „ß“.
- Kontaktadresse darf nie im Klartext auf der Seite stehen.
