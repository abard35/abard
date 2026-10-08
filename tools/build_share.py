#!/usr/bin/env python3
"""Erzeugt für jeden Song eine eigene Songseite unter /s/<titel>/ mit Cover, Story, Lyrics und Links
(für Google und für Vorschauen auf Facebook, WhatsApp usw.), setzt data-slug in index.html,
aktualisiert die strukturierten Daten (JSON-LD) im <head> und schreibt sitemap.xml.
Aufruf im Repo-Ordner:  python3 tools/build_share.py"""
import re, json, os, html, unicodedata
BASE = "https://abard.die-bardewycks.ch"
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(root)
s = open("index.html", encoding="utf-8").read()
js = open("songs.js", encoding="utf-8").read()
info = json.loads(js.split("window.SONGINFO = ", 1)[1].rstrip().rstrip(";"))
art = json.load(open("artist.json", encoding="utf-8"))

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
tracks = []
def fix(m):
    t = m.group(0)
    key = attr(t, "data-id") or attr(t, "data-yt") or attr(t, "data-ytx") or attr(t, "data-key")
    title = html.unescape(re.search(r"<h3>(.*?)</h3>", t).group(1))
    slug = slugify(title)
    img = re.search(r'<img src="([^"]+)"', t).group(1)
    img = img.replace("ab67616d00001e02", "ab67616d0000b273")
    if not img.startswith("http"): img = BASE + "/" + img.split("?")[0]
    if slug not in seen:
        seen[slug] = True
        st = (info.get(key) or info.get(attr(t, "data-yt") or "") or {}).get("story", "")
        first = st.split("\n\n")[0] if st else ""
        desc = short(first) if first else f"Listen to {title} by ABard on Spotify and YouTube."
        url = f"{BASE}/s/{slug}/"
        target = f"/#song-{key}"
        e = html.escape
        sp = attr(t, "data-id"); yt = attr(t, "data-yt") or attr(t, "data-ytx")
        genre = attr(t, "data-genre") or ""; date = attr(t, "data-date") or ""
        when = ""
        if date:
            y, mo = date.split("-")[:2]
            when = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][int(mo)-1] + " " + y
        style = attr(t, "data-style") or genre
        meta_line = style
        info_k = info.get(key) or info.get(attr(t, "data-yt") or "") or {}
        def paras(txt, br):
            return "".join("<p>" + e(p).replace("\n", "<br>") + "</p>" for p in txt.split("\n\n") if p.strip())
        story_html = f'<section><h2>The Story</h2>{paras(info_k["story"], True)}</section>' if info_k.get("story") else ""
        lyr_html = f'<section class="lyrics"><h2>Lyrics</h2>{paras(info_k["lyrics"], True)}</section>' if info_k.get("lyrics") else ""
        btns = f'<a class="btn primary" href="{target}">▶ Play on ABard</a>'
        if sp: btns += f'<a class="btn" href="https://open.spotify.com/album/{e(sp)}" target="_blank" rel="noopener">Spotify</a>'
        if yt: btns += f'<a class="btn" href="https://www.youtube.com/watch?v={e(yt)}" target="_blank" rel="noopener">YouTube</a>'
        # Noch keine IDs (z. B. Release-Tag): sichere Ausweichlinks auf Künstlerseite/Kanal
        if not sp and not yt: btns += '<a class="btn" href="https://open.spotify.com/artist/6Tt5kXSXqcxJ9DmscyOUxN" target="_blank" rel="noopener">Spotify</a>'
        if not sp and not yt: btns += '<a class="btn" href="https://www.youtube.com/@ABardOfficial/videos" target="_blank" rel="noopener">YouTube</a>'
        ld_song = {"@context": "https://schema.org", "@type": "MusicRecording", "name": title, "url": url, "image": img,
                   "byArtist": {"@type": "MusicGroup", "name": "ABard", "@id": BASE + "/#artist", "url": BASE + "/"},
                   **({"datePublished": date} if date else {}), **({"genre": genre} if genre else {}),
                   "sameAs": [u for u in ((f"https://open.spotify.com/album/{sp}" if sp else None), (f"https://www.youtube.com/watch?v={yt}" if yt else None)) if u]}
        ld_txt = json.dumps(ld_song, ensure_ascii=False).replace("</", "<\\/")
        page = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)} – ABard{(" | " + e(style)) if style else ""}</title>
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
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="theme-color" content="#0d0e10">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<script type="application/ld+json">{ld_txt}</script>
<style>
:root{{--bg:#0d0e10;--panel:#16181c;--line:#2a2d33;--fg:#e9e6df;--muted:#8d9099;--sodium:#d8a23f;--display:"Big Shoulders Display","Arial Narrow",Impact,sans-serif;--body:"IBM Plex Sans",system-ui,sans-serif;--mono:"IBM Plex Mono",ui-monospace,monospace;color-scheme:dark}}
*{{box-sizing:border-box}}html,body{{margin:0}}
body{{background:var(--bg);color:var(--fg);font-family:var(--body);line-height:1.65;-webkit-font-smoothing:antialiased}}
a{{color:inherit}}img{{max-width:100%;height:auto;display:block}}
.wrap{{max-width:880px;margin:0 auto;padding-inline:16px}}
header{{border-bottom:1px solid var(--line);padding-block:16px;font-family:var(--mono);font-size:.8rem;letter-spacing:.08em;display:flex;justify-content:space-between;gap:16px}}
header a{{text-decoration:none}}header a:hover{{color:var(--sodium)}}
.mark{{font-family:var(--display);font-weight:900;font-size:1.4rem;letter-spacing:.06em}}
.hero{{display:grid;grid-template-columns:minmax(0,300px) 1fr;gap:32px;align-items:end;padding-block:40px 24px}}
@media(max-width:640px){{.hero{{grid-template-columns:1fr;gap:20px;padding-top:24px}}.hero img{{max-width:320px}}}}
.hero img{{aspect-ratio:1;object-fit:cover;width:100%;background:var(--panel);border-radius:4px;box-shadow:0 20px 50px rgba(0,0,0,.5)}}
h1{{font-family:var(--display);font-weight:900;font-size:clamp(2.4rem,7vw,4.2rem);line-height:.95;margin:0 0 8px;text-transform:uppercase;letter-spacing:.01em}}
.by{{font-family:var(--mono);font-size:.85rem;color:var(--muted);margin:0 0 20px;letter-spacing:.05em}}.by a{{color:var(--sodium);text-decoration:none}}
.btns{{display:flex;flex-wrap:wrap;gap:10px}}
.btn{{display:inline-block;padding:10px 18px;border:1px solid var(--line);border-radius:999px;text-decoration:none;font-weight:500;font-size:.95rem}}
.btn:hover,.btn:focus-visible{{border-color:var(--sodium);color:var(--sodium)}}
.btn.primary{{background:var(--sodium);border-color:var(--sodium);color:#111}}.btn.primary:hover{{color:#111;filter:brightness(1.1)}}
section{{border-top:1px solid var(--line);padding-block:24px}}
h2{{font-family:var(--mono);font-size:.8rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--sodium);margin:0 0 12px}}
section p{{margin:0 0 1em;max-width:65ch}}.lyrics p{{color:#cfccc5}}
footer{{border-top:1px solid var(--line);padding-block:28px;font-family:var(--mono);font-size:.75rem;letter-spacing:.08em;color:var(--muted);display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}}
footer a{{text-decoration:none}}footer a:hover{{color:var(--sodium)}}
</style>
</head><body>
<header class="wrap"><a class="mark" href="/">ABARD</a><a href="/#releases">All songs →</a></header>
<main class="wrap">
<div class="hero">
<img src="{e(img)}" alt="Cover: {e(title)}" width="640" height="640">
<div>
<h1>{e(title)}</h1>
{('<p class="by">' + e(meta_line) + '</p>') if meta_line else ""}
<div class="btns">{btns}</div>
</div>
</div>
{story_html}
{lyr_html}
</main>
<footer class="wrap"><a href="/">← abard.die-bardewycks.ch</a><span>© 2025–2026 ABard</span><a href="/disclaimer.html">Disclaimer</a></footer>
</body></html>
"""
        os.makedirs(f"s/{slug}", exist_ok=True)
        open(f"s/{slug}/index.html", "w", encoding="utf-8").write(page)
    tracks.append({"@type": "MusicRecording", "name": title, "byArtist": {"@id": BASE + "/#artist"},
                   "url": f"{BASE}/s/{slug}/", "sameAs": attr(t, "href"), "image": img,
                   **({"datePublished": attr(t, "data-date")} if attr(t, "data-date") else {}),
                   **({"genre": attr(t, "data-genre")} if attr(t, "data-genre") else {})})
    t = re.sub(r'\sdata-slug="[^"]*"', "", t)
    return t.replace("<a ", '<a data-slug="' + slug + '" ', 1)

s2 = re.sub(r'<a [^>]*class="rel[^"]*"[^>]*>.*?</a>', fix, s, flags=re.S)

# Strukturierte Daten für Suchmaschinen (Künstler + Songs) zwischen den Markern im <head>
uniq = {}
for tr in tracks:
    uniq.setdefault(tr["name"].lower(), tr)
ld = {"@context": "https://schema.org", "@type": "MusicGroup", "@id": BASE + "/#artist",
      "name": "ABard", "url": BASE + "/",
      "description": art["bio_en"], "image": BASE + "/og.jpg",
      "genre": art["genres"],
      "sameAs": [p["url"] for p in art["profiles"]],
      "track": list(uniq.values())}
block = ('<!--LD-->\n<script type="application/ld+json">\n'
         + json.dumps(ld, ensure_ascii=False, indent=1).replace("</", "<\\/") + '\n</script>\n<!--/LD-->')
if "<!--LD-->" in s2:
    s2 = re.sub(r"<!--LD-->.*?<!--/LD-->", lambda m: block, s2, flags=re.S)
else:
    s2 = s2.replace("</head>", block + "\n</head>", 1)
# Bio (EN) auf der Startseite und Profil-Links im Footer aus artist.json
s2 = re.sub(r'(<p class="lede" data-i18n="lede">).*?(</p>)', lambda m: m.group(1) + html.escape(art["bio_en"], quote=False) + m.group(2), s2, count=1, flags=re.S)
plinks = " · ".join(f'<a href="{html.escape(p["url"])}" target="_blank" rel="noopener me">{html.escape(p["name"])}</a>' for p in art["profiles"] if p.get("footer"))
s2 = re.sub(r"<!--PROFILES-->.*?<!--/PROFILES-->", lambda m: "<!--PROFILES--><span>" + plinks + "</span><!--/PROFILES-->", s2, flags=re.S)
# Bio in der Sprachdatei (EN und DE)
i18 = open("i18n.js", encoding="utf-8").read()
q = lambda t: t.replace("\\", "\\\\").replace("'", "\\'")
parts = re.split(r"('lede':')((?:[^'\\]|\\.)*)(')", i18)
if len(parts) == 9:
    parts[2] = q(art["bio_en"]); parts[6] = q(art["bio_de"])
    open("i18n.js", "w", encoding="utf-8").write("".join(parts))

# Liste aller Songseiten über dem Footer (echte Links, damit Suchmaschinen jede Songseite finden)
names, ats = {}, {}
for tr in tracks:
    sl = tr["url"].rstrip("/").rsplit("/", 1)[1]
    names.setdefault(sl, tr["name"])
for m in re.finditer(r'<a data-slug="([^"]+)"[^>]*\sdata-at="([^"]+)"', s2):
    ats[m.group(1)] = m.group(2)
# Noch nicht erschienene Songs: data-at, die Seite blendet sie bis zur Release-Zeit aus
links = "<span class=\"sep\"> · </span>".join(
    f'<a href="s/{sl}/"' + (f' data-at="{ats[sl]}" hidden' if sl in ats else '') + f'>{html.escape(n)}</a>'
    for sl, n in sorted(names.items(), key=lambda x: x[1].lower()))
nav = ('<!--SONGS-->\n<nav class="songlist wrap" aria-label="All songs"><h2 data-i18n="songs.az">All songs A–Z</h2><p>'
       + links + '</p></nav>\n<!--/SONGS-->')
if "<!--SONGS-->" in s2:
    s2 = re.sub(r"<!--SONGS-->.*?<!--/SONGS-->", lambda m: nav, s2, flags=re.S)
else:
    s2 = s2.replace('<footer class="wrap">', nav + '\n<footer class="wrap">', 1)
open("index.html", "w", encoding="utf-8").write(s2)

# Sitemap: Startseite + Songseiten (Disclaimer ist noindex)
import datetime
open("sitemap.xml", "w", encoding="utf-8").write(
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    f'  <url><loc>{BASE}/</loc><lastmod>{datetime.date.today().isoformat()}</lastmod></url>\n'
    + "".join(f'  <url><loc>{BASE}/s/{sl}/</loc></url>\n' for sl in seen)
    + '</urlset>\n')
print(len(seen), "Teilen-Seiten erzeugt")
