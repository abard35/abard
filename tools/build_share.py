#!/usr/bin/env python3
"""Erzeugt für jeden Song eine Teilen-Seite unter /s/<titel>/ mit Cover, Titel und Interpret
(für Vorschauen auf Facebook, WhatsApp usw.) und setzt data-slug in index.html.
Aufruf im Repo-Ordner:  python3 tools/build_share.py"""
import re, json, os, html, unicodedata
BASE = "https://abard.die-bardewycks.ch"
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(root)
s = open("index.html", encoding="utf-8").read()
js = open("songs.js", encoding="utf-8").read()
info = json.loads(js.split("window.SONGINFO = ", 1)[1].rstrip().rstrip(";"))

def slugify(t):
    t = t.replace("ä", "ae").replace("ö", "oe").replace("ü", "ue").replace("Ä", "Ae").replace("Ö", "Oe").replace("Ü", "Ue")
    t = unicodedata.normalize("NFKD", t).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")

def attr(t, a):
    m = re.search(r'\s' + a + r'="([^"]*)"', t)
    return m.group(1) if m else None

def short(text, n=170):
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) <= n: return text
    cut = text[:n].rsplit(" ", 1)[0]
    return cut.rstrip(",;:–-") + " …"

seen = {}
def fix(m):
    t = m.group(0)
    key = attr(t, "data-id") or attr(t, "data-yt") or attr(t, "data-ytx")
    title = html.unescape(re.search(r"<h3>(.*?)</h3>", t).group(1))
    slug = slugify(title)
    img = re.search(r'<img src="([^"]+)"', t).group(1)
    img = img.replace("ab67616d00001e02", "ab67616d0000b273")
    if img.startswith("room404"): img = BASE + "/" + img.split("?")[0]
    if slug not in seen:
        seen[slug] = True
        st = (info.get(key) or info.get(attr(t, "data-yt") or "") or {}).get("story", "")
        first = st.split("\n\n")[0] if st else ""
        desc = short(first) if first else f"Listen to {title} by ABard on Spotify and YouTube."
        url = f"{BASE}/s/{slug}/"
        target = f"/#song-{key}"
        e = html.escape
        page = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)} – ABard</title>
<meta name="description" content="{e(desc)}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="music.song">
<meta property="og:site_name" content="ABard">
<meta property="og:title" content="{e(title)} – ABard">
<meta property="og:description" content="{e(desc)}">
<meta property="og:image" content="{e(img)}">
<meta property="og:url" content="{url}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{e(title)} – ABard">
<meta name="twitter:image" content="{e(img)}">
<link rel="icon" href="/favicon.ico">
<meta http-equiv="refresh" content="0; url={target}">
<script>location.replace({json.dumps(target)})</script>
<style>body{{background:#0d0e10;color:#e9e6df;font-family:system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0}}a{{color:#d8a23f}}</style>
</head><body><a href="{target}">{e(title)} – ABard</a></body></html>
"""
        os.makedirs(f"s/{slug}", exist_ok=True)
        open(f"s/{slug}/index.html", "w", encoding="utf-8").write(page)
    t = re.sub(r'\sdata-slug="[^"]*"', "", t)
    return t.replace("<a ", '<a data-slug="' + slug + '" ', 1)

s2 = re.sub(r'<a [^>]*class="rel[^"]*"[^>]*>.*?</a>', fix, s, flags=re.S)
open("index.html", "w", encoding="utf-8").write(s2)
print(len(seen), "Teilen-Seiten erzeugt")
