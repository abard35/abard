# ABard – Website

Quelle der Seite https://abard.die-bardewycks.ch

Plesk holt dieses Repository und stellt `index.html` im Ordner `abard.die-bardewycks.ch` bereit.

## Künstlerdaten an einer Stelle

`artist.json` enthält Bio (EN/DE), Genres und alle Profil-Links. Nach einer Änderung `python3 tools/build_share.py` ausführen – daraus entstehen Bio auf der Startseite, Google-Daten (JSON-LD), Profil-Links im Footer, Songseiten und Sitemap.
